// server/api/paymongo/webhook.post.ts
// ─────────────────────────────────────────────────────────────────────────────
// PayMongo sends webhooks for: checkout_session.payment.paid,
// payment_intent.succeeded, link.payment.paid
// Registers at: https://dashboard.paymongo.com/developers/webhooks
// Webhook URL: https://yourdomain.com/api/paymongo/webhook
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'
import { createHmac, timingSafeEqual } from 'crypto'
import type { PayMongoWebhookPayload } from '~/types/database'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // ── 1. Read raw body for signature verification ───────────────────────────
  const rawBody = await readRawBody(event)
  if (!rawBody) throw createError({ statusCode: 400, message: 'Empty body' })

  // ── 2. Verify PayMongo webhook signature ──────────────────────────────────
  const signatureHeader = getHeader(event, 'paymongo-signature')
  if (!signatureHeader) throw createError({ statusCode: 401, message: 'Missing signature' })

  const isValid = verifyPayMongoSignature(rawBody, signatureHeader, config.paymongoWebhookSecret)
  if (!isValid) throw createError({ statusCode: 401, message: 'Invalid signature' })

  // ── 3. Parse payload ──────────────────────────────────────────────────────
  const payload: PayMongoWebhookPayload = JSON.parse(rawBody)
  const eventType = payload.data.attributes.type
  const eventData = payload.data.attributes.data

  console.log(`[PayMongo Webhook] Received: ${eventType}`)

  // ── 4. Use service-role Supabase client (bypasses RLS) ───────────────────
  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // ── 5. Handle specific event types ───────────────────────────────────────
  switch (eventType) {

    // ── COLLECTION PURCHASE ────────────────────────────────────────────────
    case 'checkout_session.payment.paid': {
      const metadata = eventData.attributes.metadata || {}
      const { type, collection_id, user_email, user_id } = metadata

      if (type === 'collection_purchase') {
        await handleCollectionPurchase(supabase, {
          collectionId: collection_id,
          userEmail: user_email,
          userId: user_id,
          paymongoRef: eventData.id,
        })
      }

      if (type === 'order_deposit') {
        await handleOrderDeposit(supabase, {
          orderId: metadata.order_id,
          paymongoRef: eventData.id,
        })
      }

      if (type === 'class_booking') {
        await handleClassBooking(supabase, {
          bookingId: metadata.booking_id,
          classId: metadata.class_id,
          paymongoRef: eventData.id,
        })
      }
      break
    }

    default:
      console.log(`[PayMongo Webhook] Unhandled event: ${eventType}`)
  }

  return { received: true }
})

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function verifyPayMongoSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string
): boolean {
  try {
    // PayMongo signature header format: "t=TIMESTAMP,te=SIG,li=SIG"
    const parts: Record<string, string> = {}
    signatureHeader.split(',').forEach((part) => {
      const [key, val] = part.split('=')
      parts[key] = val
    })

    const timestamp = parts['t']
    const signature = parts['te'] || parts['li'] // test or live

    // Create the signed payload
    const signedPayload = `${timestamp}.${rawBody}`

    // Compute HMAC SHA256
    const computedSig = createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex')

    // Timing-safe comparison
    const sigBuffer = Buffer.from(signature, 'hex')
    const computedBuffer = Buffer.from(computedSig, 'hex')

    if (sigBuffer.length !== computedBuffer.length) return false
    return timingSafeEqual(sigBuffer, computedBuffer)
  } catch (e) {
    console.error('[PayMongo] Signature verification error:', e)
    return false
  }
}

async function handleCollectionPurchase(
  supabase: ReturnType<typeof createClient>,
  params: {
    collectionId: string
    userEmail: string
    userId?: string
    paymongoRef: string
  }
) {
  const { collectionId, userEmail, userId, paymongoRef } = params

  let resolvedUserId = userId

  // If no userId in metadata, find or create user by email
  if (!resolvedUserId) {
    // Check if user exists
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const existing = users.find((u) => u.email === userEmail)

    if (existing) {
      resolvedUserId = existing.id
    } else {
      // Create a new user and send a magic link to set their password
      const { data: newUser, error } = await supabase.auth.admin.createUser({
        email: userEmail,
        email_confirm: true,
        user_metadata: { created_via: 'collection_purchase' },
      })
      if (error) {
        console.error('[handleCollectionPurchase] Failed to create user:', error)
        return
      }
      resolvedUserId = newUser.user.id

      // Send magic link so they can set a password
      await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: userEmail,
      })
    }
  }

  // Grant collection access — check first to avoid duplicate rows on webhook retry
  const { data: existingAccess } = await supabase
    .from('user_collection_access')
    .select('id')
    .eq('user_id', resolvedUserId)
    .eq('collection_id', collectionId)
    .maybeSingle()

  if (existingAccess) {
    console.log(`[PayMongo] User ${resolvedUserId} already has access to collection ${collectionId} — skipping duplicate grant`)
    return
  }

  const { error: accessError } = await supabase
    .from('user_collection_access')
    .insert({
      user_id: resolvedUserId,
      collection_id: collectionId,
      payment_ref: paymongoRef,
    })

  if (accessError) {
    console.error('[handleCollectionPurchase] Failed to grant access:', accessError)
    return
  }

  console.log(`[PayMongo] Granted collection ${collectionId} access to user ${resolvedUserId}`)
}

async function handleOrderDeposit(
  supabase: ReturnType<typeof createClient>,
  params: { orderId: string; paymongoRef: string }
) {
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'deposit_paid',
      paymongo_ref: params.paymongoRef,
    })
    .eq('id', params.orderId)

  if (error) console.error('[handleOrderDeposit]', error)
  else console.log(`[PayMongo] Order ${params.orderId} deposit confirmed`)
}

async function handleClassBooking(
  supabase: ReturnType<typeof createClient>,
  params: { bookingId: string; classId: string; paymongoRef: string }
) {
  // Update booking status
  const { error: bookingError } = await supabase
    .from('class_bookings')
    .update({ status: 'paid', paymongo_ref: params.paymongoRef })
    .eq('id', params.bookingId)

  if (bookingError) { console.error('[handleClassBooking] booking update:', bookingError); return }

  // Increment booked slots
  await supabase.rpc('increment_booked_slots', { class_id: params.classId })

  console.log(`[PayMongo] Class booking ${params.bookingId} confirmed`)
}
