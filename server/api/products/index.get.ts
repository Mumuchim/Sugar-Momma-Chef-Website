// server/api/products/index.get.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase
    .from('products')
    .select('id,slug,name,short_description,description,image_url,category,is_bundle,bundle_label,bundle_description,bundle_price_php,single_label,single_description,price_php,allows_cod')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, message: 'Failed to fetch products' })
  }

  return data || []
})
