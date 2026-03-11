// server/api/newsletter.post.ts

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { email } = await readBody(event)

  if (!email || !email.includes('@')) {
    throw createError({ statusCode: 400, message: 'Valid email required.' })
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceKey)
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email }, { onConflict: 'email' })

  if (error) {
    console.error('[newsletter]', error)
    throw createError({ statusCode: 500, message: 'Failed to subscribe.' })
  }

  return { success: true }
})
