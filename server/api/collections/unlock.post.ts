// server/api/collections/unlock.post.ts
// Initiates a PayMongo checkout for unlocking a collection

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  // Accept both snake_case and camelCase field names
  const collectionId = body.collection_id || body.collectionId
  const userEmail = body.user_email || body.userEmail
  const userId = body.user_id || body.userId

  if (!collectionId || !userEmail) {
    throw createError({ statusCode: 400, message: 'collection_id and user_email are required' })
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceKey)
  const { data: collection, error } = await supabase
    .from('collections')
    .select('id, title, price_php, cover_url')
    .eq('id', collectionId)
    .eq('is_published', true)
    .single()

  if (error || !collection) {
    throw createError({ statusCode: 404, message: 'Collection not found' })
  }

  const checkout = await $fetch<any>('/api/paymongo/checkout', {
    method: 'POST',
    body: {
      lineItems: [{
        name: `Sugar Momma: ${collection.title}`,
        amount: collection.price_php,
        description: `Unlock full access to the "${collection.title}" recipe collection`,
        quantity: 1,
      }],
      description: `Unlock: ${collection.title}`,
      metadata: {
        type: 'collection_purchase',
        collection_id: collection.id,
        user_email: userEmail,
        // PayMongo metadata values must be strings — omit user_id if not available
        ...(userId ? { user_id: userId } : {}),
      },
      successUrl: `${config.public.siteUrl}/payment/success?type=collection&id=${collectionId}`,
      cancelUrl: `${config.public.siteUrl}/payment/cancelled`,
    },
  })

  return { data: { checkout_url: checkout.checkout_url, session_id: checkout.session_id } }
})
