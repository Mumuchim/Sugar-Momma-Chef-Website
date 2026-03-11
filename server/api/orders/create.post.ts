// server/api/orders/create.post.ts

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const {
    customer_name,
    customer_email,
    customer_phone,
    occasion,
    event_date,
    notes,
    deposit_amount = 1500,
  } = body

  if (!customer_name || !customer_email || !occasion || !event_date || !notes) {
    throw createError({ statusCode: 400, message: 'All required fields must be filled.' })
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceKey)

  // Insert order record first (status: pending)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name,
      customer_email,
      customer_phone,
      occasion,
      event_date,
      notes,
      deposit_amount,
      status: 'pending',
    })
    .select('id')
    .single()

  if (orderError) {
    console.error('[orders/create]', orderError)
    throw createError({ statusCode: 500, message: 'Failed to save order.' })
  }

  // Create checkout session
  const checkout = await $fetch<any>('/api/paymongo/checkout', {
    method: 'POST',
    body: {
      lineItems: [{
        name: `Custom Pastry Order — ${occasion}`,
        amount: deposit_amount,
        description: `50% deposit for custom order (Event: ${event_date})`,
        quantity: 1,
      }],
      description: `Custom Order Deposit — ${customer_name}`,
      metadata: {
        type: 'order_deposit',
        order_id: order.id,
        user_email: customer_email,
      },
      successUrl: `${config.public.siteUrl}/payment/success?type=order`,
      cancelUrl: `${config.public.siteUrl}/orders`,
    },
  })

  // Store checkout URL on order
  await supabase
    .from('orders')
    .update({ paymongo_checkout_url: checkout.checkout_url })
    .eq('id', order.id)

  return { data: { checkout_url: checkout.checkout_url, order_id: order.id } }
})
