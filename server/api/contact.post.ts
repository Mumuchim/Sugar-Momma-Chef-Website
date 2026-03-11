// server/api/contact.post.ts

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { name, email, subject, message } = body

  if (!name || !email || !message) {
    throw createError({ statusCode: 400, message: 'Name, email, and message are required.' })
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceKey)
  const { error } = await supabase.from('contact_messages').insert({ name, email, subject, message })

  if (error) throw createError({ statusCode: 500, message: 'Failed to save message.' })
  return { success: true }
})
