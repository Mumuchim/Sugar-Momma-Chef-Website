import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  // Check admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) throw createError({ statusCode: 403, message: 'Forbidden' })

  const body = await readBody(event)
  const { key, value } = body

  if (!key || value === undefined) throw createError({ statusCode: 400, message: 'key and value are required' })

  const { error } = await supabase
    .from('site_content')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})
