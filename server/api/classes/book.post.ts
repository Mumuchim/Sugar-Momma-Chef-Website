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

  // Check available slots
  const { data: cls, error: clsError } = await supabase
    .from('classes')
    .select('id, title, price_php, total_slots, booked_slots')
    .eq('id', class_id)
    .eq('is_published', true)
    .single()

  if (clsError || !cls) throw createError({ statusCode: 404, message: 'Class not found.' })
  if (cls.booked_slots >= cls.total_slots) throw createError({ statusCode: 409, message: 'This class is fully booked.' })

  // Create booking record
  const { data: booking, error: bookingError } = await supabase
    .from('class_bookings')
    .insert({ class_id, customer_name, customer_email, customer_phone, status: 'pending' })
    .select('id')
    .single()

  if (bookingError) throw createError({ statusCode: 500, message: 'Failed to create booking.' })

  // Create checkout
  const checkout = await $fetch<any>('/api/paymongo/checkout', {
    method: 'POST',
    body: {
      lineItems: [{
        name: `Cooking Class: ${cls.title}`,
        amount: cls.price_php,
        description: 'Cooking class booking',
        quantity: 1,
      }],
      description: `Booking: ${cls.title}`,
      metadata: {
        type: 'class_booking',
        booking_id: booking.id,
        class_id: cls.id,
        user_email: customer_email,
      },
      successUrl: `${config.public.siteUrl}/payment/success?type=class`,
      cancelUrl: `${config.public.siteUrl}/classes`,
    },
  })

  await supabase
    .from('class_bookings')
    .update({ paymongo_checkout_url: checkout.checkout_url })
    .eq('id', booking.id)

  return { data: { checkout_url: checkout.checkout_url, booking_id: booking.id } }
})
