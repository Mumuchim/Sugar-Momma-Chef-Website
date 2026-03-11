<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <p class="font-sans text-cream-200/40 text-sm">Manage</p>
        <h1 class="font-serif text-cream-100 text-2xl">Recipes</h1>
      </div>
      <NuxtLink to="/admin/recipes/new" class="btn-gold text-sm">
        + New Recipe
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="activeCategory = cat"
        class="tag transition-all duration-200"
        :class="activeCategory === cat ? 'border-gold text-gold' : 'hover:border-cream-200/40'"
      >{{ cat }}</button>

      <div class="ml-auto">
        <input
          v-model="search"
          type="text"
          placeholder="Search recipes…"
          class="input-dark text-sm py-2 w-56"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-3">
      <div v-for="i in 6" :key="i" class="h-16 bg-charcoal-800 animate-pulse border border-charcoal-700" />
    </div>

    <!-- Recipe table -->
    <div v-else-if="filteredRecipes.length" class="border border-charcoal-700 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-charcoal-700 bg-charcoal-800">
            <th class="text-left px-6 py-3 font-sans text-xs text-cream-200/40 uppercase tracking-widest">Title</th>
            <th class="text-left px-4 py-3 font-sans text-xs text-cream-200/40 uppercase tracking-widest hidden md:table-cell">Category</th>
            <th class="text-left px-4 py-3 font-sans text-xs text-cream-200/40 uppercase tracking-widest hidden lg:table-cell">Difficulty</th>
            <th class="text-left px-4 py-3 font-sans text-xs text-cream-200/40 uppercase tracking-widest">Status</th>
            <th class="px-6 py-3 font-sans text-xs text-cream-200/40 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-charcoal-700">
          <tr
            v-for="recipe in filteredRecipes"
            :key="recipe.id"
            class="hover:bg-charcoal-800/50 transition-colors duration-150 group"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-charcoal-700 shrink-0 overflow-hidden">
                  <img
                    v-if="recipe.thumbnail_url"
                    :src="recipe.thumbnail_url"
                    :alt="recipe.title"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="text-gold/20 text-xs font-serif">SM</span>
                  </div>
                </div>
                <div>
                  <p class="font-sans text-cream-100 text-sm">{{ recipe.title }}</p>
                  <p v-if="recipe.is_premium" class="font-sans text-gold text-xs mt-0.5">Premium</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 hidden md:table-cell">
              <span class="font-sans text-cream-200/60 text-xs uppercase tracking-widest">{{ recipe.category }}</span>
            </td>
            <td class="px-4 py-4 hidden lg:table-cell">
              <span
                class="font-sans text-xs uppercase tracking-widest"
                :class="{
                  'text-emerald-400': recipe.difficulty === 'beginner',
                  'text-amber-400': recipe.difficulty === 'intermediate',
                  'text-red-400': recipe.difficulty === 'advanced',
                }"
              >{{ recipe.difficulty }}</span>
            </td>
            <td class="px-4 py-4">
              <span
                class="font-sans text-xs px-2 py-1 uppercase tracking-widest"
                :class="recipe.is_published
                  ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20'
                  : 'bg-charcoal-700 text-cream-200/40 border border-charcoal-600'"
              >
                {{ recipe.is_published ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <NuxtLink
                  :to="`/recipes/${recipe.slug}`"
                  target="_blank"
                  class="font-sans text-xs text-cream-200/50 hover:text-cream-100 transition-colors uppercase tracking-widest"
                >View</NuxtLink>
                <NuxtLink
                  :to="`/admin/recipes/new?id=${recipe.id}`"
                  class="font-sans text-xs text-gold hover:text-gold-light transition-colors uppercase tracking-widest"
                >Edit</NuxtLink>
                <button
                  @click="confirmDelete(recipe)"
                  class="font-sans text-xs text-red-400/60 hover:text-red-400 transition-colors uppercase tracking-widest"
                >Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-20 border border-charcoal-700">
      <p class="font-serif text-cream-200/30 text-2xl italic mb-4">No recipes yet.</p>
      <NuxtLink to="/admin/recipes/new" class="btn-gold text-sm">Create First Recipe</NuxtLink>
    </div>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="deleteTarget = null">
        <div class="absolute inset-0 bg-charcoal-950/90 backdrop-blur-sm" />
        <div class="relative bg-charcoal-900 border border-charcoal-700 w-full max-w-sm p-8 text-center">
          <p class="font-serif text-cream-100 text-xl mb-3">Delete Recipe?</p>
          <p class="font-sans text-cream-200/60 text-sm mb-6">
            "<span class="text-cream-100">{{ deleteTarget.title }}</span>" will be permanently removed.
          </p>
          <div class="flex gap-3 justify-center">
            <button @click="deleteTarget = null" class="btn-outline text-sm">Cancel</button>
            <button @click="deleteRecipe" :disabled="deleting" class="px-7 py-3.5 bg-red-600 hover:bg-red-500 text-white font-sans font-medium text-sm uppercase tracking-widest transition-colors">
              {{ deleting ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const supabase = useSupabaseClient()
const { success, error: toastError } = useToast()

const recipes = ref<any[]>([])
const pending = ref(true)
const search = ref('')
const activeCategory = ref('All')
const deleteTarget = ref<any>(null)
const deleting = ref(false)

const categories = ['All', 'Pastry', 'Bread', 'Cakes', 'Japanese', 'Plated Desserts']

const filteredRecipes = computed(() => {
  let list = recipes.value
  if (activeCategory.value !== 'All') {
    list = list.filter(r => r.category?.toLowerCase() === activeCategory.value.toLowerCase())
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(r => r.title?.toLowerCase().includes(q) || r.subtitle?.toLowerCase().includes(q))
  }
  return list
})

onMounted(async () => {
  const { data } = await supabase
    .from('recipes')
    .select('id, title, slug, category, difficulty, is_published, is_premium, thumbnail_url')
    .order('created_at', { ascending: false })
  recipes.value = data || []
  pending.value = false
})

const confirmDelete = (recipe: any) => {
  deleteTarget.value = recipe
}

const deleteRecipe = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  const { error } = await supabase.from('recipes').delete().eq('id', deleteTarget.value.id)
  if (error) {
    toastError('Delete failed. Please try again.')
  } else {
    recipes.value = recipes.value.filter(r => r.id !== deleteTarget.value.id)
    success(`"${deleteTarget.value.title}" deleted.`)
    deleteTarget.value = null
  }
  deleting.value = false
}

useSeoMeta({ title: 'Recipes — Admin · Sugar Momma' })
</script>
