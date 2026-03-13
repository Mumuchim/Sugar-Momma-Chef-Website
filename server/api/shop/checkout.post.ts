// server/api/shop/checkout.post.ts
import { serverSupabaseClient } from '#supabase/server'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = await serverSupabaseClient(event)
  const body = await readBody(event)

  const {
    product_id,
    product_name,
    is_bundle,
    unit_price_php,
    quantity = 1,
    fulfillment_type,
    delivery_address,
    customer_name,
    customer_email,
    customer_phone,
    notes,
    payment_method = 'online', // 'online' | 'cod'
  } = body

  if (!product_id || !customer_name || !customer_email || !unit_price_php) {
    throw createError({ statusCode: 400, message: 'Missing required fields.' })
  }
  if (fulfillment_type === 'delivery' && !delivery_address?.trim()) {
    throw createError({ statusCode: 400, message: 'Delivery address is required.' })
  }

  // If COD requested, verify the product actually allows it (server-side guard)
  if (payment_method === 'cod') {
    const serviceClient = createClient(config.public.supabaseUrl, config.supabaseServiceKey)
    const { data: product } = await serviceClient
      .from('products')
      .select('allows_cod')
      .eq('id', product_id)
      .single()
    if (!product?.allows_cod) {
      throw createError({ statusCode: 400, message: 'Cash on Delivery is not available for this product.' })
    }
  }

  const qty = Math.max(1, Math.min(99, Math.round(Number(quantity) || 1)))
  const total_php = unit_price_php * qty

  // Create the order
  const { data: order, error: orderError } = await supabase
    .from('shop_orders')
    .insert({
      product_id,
      product_name,
      is_bundle,
      unit_price_php,
      quantity: qty,
      total_php,
      fulfillment_type,
      delivery_address: fulfillment_type === 'delivery' ? delivery_address : null,
      customer_name,
      customer_email,
      customer_phone,
      notes,
      payment_method,
      status: payment_method === 'cod' ? 'pending' : 'pending',
    })
    .select('id, lookup_token')
    .single()

  if (orderError || !order) {
    throw createError({ statusCode: 500, message: 'Failed to create order.' })
  }

  // ── COD: no payment gateway needed, go straight to success ───────────────
  if (payment_method === 'cod') {
    return {
      data: {
        checkout_url: `${config.public.siteUrl}/payment/success?ref=${order.id}&token=${order.lookup_token}&type=shop&method=cod`,
        order_id: order.id,
        lookup_token: order.lookup_token,
        is_cod: true,
      },
    }
  }

  // ── Online: create PayMongo checkout session ──────────────────────────────
  const authHeader = `Basic ${Buffer.from(config.paymongoSecretKey + ':').toString('base64')}`
  const lineItemName = is_bundle ? `${product_name} (Bundle)` : product_name

  const response = await $fetch<any>('https://api.paymongo.com/v1/checkout_sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
    body: {
      data: {
        attributes: {
          billing: { email: customer_email, name: customer_name },
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          line_items: [{
            currency: 'PHP',
            amount: Math.round(unit_price_php * 100),
            name: lineItemName,
            quantity: qty,
          }],
          payment_method_types: ['card', 'gcash', 'paymaya', 'billease', 'dob', 'dob_ubp'],
          description: `Sugar Momma Shop — ${lineItemName}`,
          success_url: `${config.public.siteUrl}/payment/success?ref=${order.id}&token=${order.lookup_token}&type=shop`,
          cancel_url: `${config.public.siteUrl}/payment/cancelled`,
          metadata: { type: 'shop', order_id: order.id, customer_email },
        },
      },
    },
  }).catch((err) => {
    console.error('[PayMongo] Shop checkout error:', err.data)
    throw createError({ statusCode: 502, message: 'Payment gateway error. Please try again.' })
  })

  const checkout_url = response.data.attributes.checkout_url
  const session_id = response.data.id

  await supabase
    .from('shop_orders')
    .update({ paymongo_checkout_url: checkout_url, paymongo_ref: session_id })
    .eq('id', order.id)

  return { data: { checkout_url, order_id: order.id, lookup_token: order.lookup_token, is_cod: false } }
})
