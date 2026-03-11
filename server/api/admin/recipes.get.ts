// server/api/admin/recipes.get.ts

import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceKey)

  const { data, error } = await supabase
    .from('recipes')
    .select('id, slug, title, category, difficulty, is_published, is_premium, created_at')
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, message: error.message })
  return { data }
})
