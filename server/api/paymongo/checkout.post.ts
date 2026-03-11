// server/api/paymongo/checkout.post.ts
// Creates a PayMongo Checkout Session and returns the checkout_url

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const {
    lineItems,   // Array of { name, amount (in centavos), quantity }
    successUrl,
    cancelUrl,
    metadata,    // { type, collection_id, user_email, ... }
    description,
  } = body

  if (!lineItems?.length) {
    throw createError({ statusCode: 400, message: 'Line items are required' })
  }

  const authHeader = `Basic ${Buffer.from(config.paymongoSecretKey + ':').toString('base64')}`

  const response = await $fetch<any>('https://api.paymongo.com/v1/checkout_sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    body: {
      data: {
        attributes: {
          billing: { email: metadata?.user_email || '' },
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          line_items: lineItems.map((item: any) => ({
            currency: 'PHP',
            amount: Math.round(item.amount * 100), // Convert to centavos
            description: item.description || '',
            name: item.name,
            quantity: item.quantity || 1,
          })),
          payment_method_types: ['card', 'gcash', 'paymaya', 'billease', 'dob', 'dob_ubp'],
          description: description || 'Sugar Momma Payment',
          success_url: successUrl || `${config.public.siteUrl}/payment/success`,
          cancel_url: cancelUrl || `${config.public.siteUrl}/payment/cancelled`,
          metadata: metadata || {},
        },
      },
    },
  }).catch((err) => {
    console.error('[PayMongo] Checkout error:', err.data)
    throw createError({ statusCode: 502, message: 'Payment gateway error. Please try again.' })
  })

  return {
    checkout_url: response.data.attributes.checkout_url,
    session_id: response.data.id,
  }
})
