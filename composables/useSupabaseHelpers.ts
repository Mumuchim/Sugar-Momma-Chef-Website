// composables/useSupabaseHelpers.ts
// Thin wrappers over the Nuxt Supabase module for common queries

export const useRecipes = () => {
  const supabase = useSupabaseClient()

  const fetchPublicRecipes = async (limit = 12, offset = 0) => {
    const { data, error, count } = await supabase
      .from('recipes')
      .select('id,slug,title,subtitle,banner_url,thumbnail_url,category,difficulty,prep_time_mins,cook_time_mins,total_time_mins,base_servings,is_premium,collection_id,created_at', { count: 'exact' })
      .eq('is_published', true)
      .eq('is_premium', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    return { data, error, count }
  }

  const fetchRecipeBySlug = async (slug: string) => {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        ingredients (id, sort_order, quantity, unit, name, notes),
        instructions (id, step_number, body, photo_url),
        collection:collections (id, slug, title, price_php)
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    return { data, error }
  }

  const fetchFeaturedRecipes = async (limit = 4) => {
    const { data, error } = await supabase
      .from('recipes')
      .select('id,slug,title,subtitle,banner_url,thumbnail_url,category,difficulty,prep_time_mins,is_premium')
      .eq('is_published', true)
      .eq('is_premium', false)
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  }

  return { fetchPublicRecipes, fetchRecipeBySlug, fetchFeaturedRecipes }
}

export const useCollections = () => {
  const supabase = useSupabaseClient()

  const fetchAllCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select(`
        id, slug, title, tagline, description, cover_url, price_php, created_at
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    return { data, error }
  }

  const fetchCollectionBySlug = async (slug: string) => {
    const { data, error } = await supabase
      .from('collections')
      .select(`
        *,
        recipes (id, slug, title, thumbnail_url, difficulty, prep_time_mins, is_premium)
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    return { data, error }
  }

  const checkUserAccess = async (collectionId: string) => {
    const user = useSupabaseUser()
    if (!user.value) return false
    const { data } = await supabase
      .from('user_collection_access')
      .select('id')
      .eq('user_id', user.value.id)
      .eq('collection_id', collectionId)
      .single()
    return !!data
  }

  return { fetchAllCollections, fetchCollectionBySlug, checkUserAccess }
}

export const useClasses = () => {
  const supabase = useSupabaseClient()

  const fetchUpcomingClasses = async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('is_published', true)
      .gte('schedule_date', new Date().toISOString())
      .order('schedule_date', { ascending: true })
    return { data, error }
  }

  return { fetchUpcomingClasses }
}

export const useAdminGuard = () => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const router = useRouter()

  const checkAdmin = async () => {
    if (!user.value) {
      return navigateTo('/admin/login')
    }
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.value.id)
      .single()
    if (!data?.is_admin) {
      return navigateTo('/')
    }
  }

  return { checkAdmin }
}
