// server/api/orders/create.post.ts
// Saves a custom order inquiry — NO payment at this stage.
// Admin will contact the customer, agree on price, then send a payment link manually.

import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const body = await readBody(event)

  const {
    customer_name,
    customer_email,
    customer_phone,
    occasion,
    event_date,
    notes,
    theme_id,
    theme_name,
  } = body

  if (!customer_name || !customer_email || !occasion || !event_date || !notes) {
    throw createError({ statusCode: 400, message: 'All required fields must be filled.' })
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name,
      customer_email,
      customer_phone: customer_phone || null,
      occasion,
      event_date,
      notes,
      theme_id: theme_id || null,
      theme_name: theme_name || null,
      status: 'inquiry',
    })
    .select('id')
    .single()

  if (orderError) {
    console.error('[orders/create]', orderError)
    throw createError({ statusCode: 500, message: 'Failed to save order. Please try again.' })
  }

  return { data: { order_id: order.id } }
})
