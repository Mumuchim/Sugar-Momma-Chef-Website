// server/api/admin/recipes.post.ts
// Upserts a recipe with all ingredients and instructions

import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // ── Server-side admin guard ───────────────────────────────────────────────
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

  const body = await readBody(event)
  const { recipe, ingredients, instructions } = body

  // Upsert recipe
  const { data: savedRecipe, error: recipeError } = await supabase
    .from('recipes')
    .upsert({
      ...recipe,
      // Convert empty string to null so FK constraint is satisfied
      collection_id: recipe.collection_id || null,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (recipeError) throw createError({ statusCode: 500, message: recipeError.message })

  const recipeId = savedRecipe.id

  // Replace ingredients
  if (ingredients !== undefined) {
    await supabase.from('ingredients').delete().eq('recipe_id', recipeId)
    if (ingredients.length > 0) {
      await supabase.from('ingredients').insert(
        ingredients.map((ing: any, i: number) => ({ ...ing, recipe_id: recipeId, sort_order: i }))
      )
    }
  }

  // Replace instructions
  if (instructions !== undefined) {
    await supabase.from('instructions').delete().eq('recipe_id', recipeId)
    if (instructions.length > 0) {
      await supabase.from('instructions').insert(
        instructions.map((inst: any, i: number) => ({ ...inst, recipe_id: recipeId, step_number: i + 1 }))
      )
    }
  }

  return { success: true, id: recipeId }
})
