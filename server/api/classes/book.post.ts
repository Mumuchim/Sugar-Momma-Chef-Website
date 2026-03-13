// server/api/classes/book.post.ts

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { class_id, customer_name, customer_email, customer_phone } = body

  if (!class_id || !customer_name || !customer_email) {
    throw createError({ statusCode: 400, message: 'Missing required fields.' })
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceKey)

  // ── Atomic booking: check capacity + insert in a single DB transaction ───
  // This prevents the race condition where two concurrent requests both pass
  // the capacity check and both insert, resulting in overbooking.
  const { data: bookingResult, error: bookingError } = await supabase
    .rpc('atomic_book_class', {
      p_class_id: class_id,
      p_customer_name: customer_name,
      p_customer_email: customer_email,
      p_customer_phone: customer_phone || null,
    })

  if (bookingError) {
    console.error('[book.post] atomic_book_class error:', bookingError)
    throw createError({ statusCode: 500, message: 'Failed to create booking.' })
  }

  // The function returns {ok, booking_id, error_code}
  if (!bookingResult?.ok) {
    if (bookingResult?.error_code === 'NOT_FOUND') {
      throw createError({ statusCode: 404, message: 'Class not found.' })
    }
    if (bookingResult?.error_code === 'FULLY_BOOKED') {
      throw createError({ statusCode: 409, message: 'This class is fully booked.' })
    }
    throw createError({ statusCode: 500, message: 'Could not reserve your spot.' })
  }

  const bookingId = bookingResult.booking_id

  // Fetch class details for checkout line item
  const { data: cls } = await supabase
    .from('classes')
    .select('title, price_php')
    .eq('id', class_id)
    .single()

  // Create checkout
  const checkout = await $fetch<any>('/api/paymongo/checkout', {
    method: 'POST',
    body: {
      lineItems: [{
        name: `Cooking Class: ${cls?.title ?? 'Class'}`,
        amount: cls?.price_php ?? 0,
        description: 'Cooking class booking',
        quantity: 1,
      }],
      description: `Booking: ${cls?.title ?? 'Class'}`,
      metadata: {
        type: 'class_booking',
        booking_id: bookingId,
        class_id,
        user_email: customer_email,
      },
      successUrl: `${config.public.siteUrl}/payment/success?type=class`,
      cancelUrl: `${config.public.siteUrl}/classes`,
    },
  })

  await supabase
    .from('class_bookings')
    .update({ paymongo_checkout_url: checkout.checkout_url })
    .eq('id', bookingId)

  return { data: { checkout_url: checkout.checkout_url, booking_id: bookingId } }
})
