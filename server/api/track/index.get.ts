// server/api/track/index.get.ts
// Requires both email + lookup_token to prevent email enumeration / PII exposure.
// The lookup_token is shown on the payment/success page and is unique per order.

import { serverSupabaseClient } from '#supabase/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)
  const email = (query.email as string || '').toLowerCase().trim()
  const lookupToken = (query.lookup_token as string || '').trim()

  if (!email || !EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, message: 'A valid email is required.' })
  }
  if (!lookupToken) {
    throw createError({ statusCode: 400, message: 'An order reference token is required.' })
  }

  // Token must match a real order belonging to this email — prevents enumeration
  const { data, error } = await supabase
    .from('shop_orders')
    .select('id,product_name,quantity,is_bundle,unit_price_php,total_php,fulfillment_type,notes,status,created_at')
    .eq('customer_email', email)
    .eq('lookup_token', lookupToken)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    throw createError({ statusCode: 500, message: 'Failed to look up orders.' })
  }

  // delivery_address is intentionally excluded from the public response
  return data || []
})
