// server/api/admin/recipes.get.ts

import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // ── Server-side admin guard ───────────────────────────────────────────────
  // The client middleware only protects page navigation; this check protects
  // the actual API endpoint from direct HTTP calls.
  const userClient = await serverSupabaseClient(event)
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const { data: profile } = await userClient
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  if (!profile?.is_admin) throw createError({ statusCode: 403, message: 'Forbidden' })
  // ─────────────────────────────────────────────────────────────────────────

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceKey)

  const { data, error } = await supabase
    .from('recipes')
    .select('id, slug, title, category, difficulty, is_published, is_premium, created_at')
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, message: error.message })
  return { data }
})
