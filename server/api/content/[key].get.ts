import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, 'key')
  if (!key) throw createError({ statusCode: 400, message: 'Missing key' })

  const supabase = await serverSupabaseClient(event)
  const { data, error } = await supabase
    .from('site_content')
    .select('value')
    .eq('key', key)
    .single()

  if (error || !data) return null
  return data.value
})
