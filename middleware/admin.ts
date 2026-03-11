// middleware/admin.ts
// Protects all /admin/* pages (except /admin/login)

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return

  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  // Not logged in at all
  if (!user.value) return navigateTo('/admin/login')

  // Check admin flag
  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.value.id)
    .single()

  if (!data?.is_admin) return navigateTo('/')
})
