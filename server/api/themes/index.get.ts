// server/api/themes/index.get.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase
    .from('themes')
    .select('id,name,description,cover_url,is_fixed_price,price_php,price_range_min,price_range_max')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, message: 'Failed to fetch themes.' })
  }

  return data || []
})
