<template>
  <div>
    <!-- Page Hero -->
    <PageHero
      label="The Blog"
      title="Recipes"
      :subtitle="'Techniques, stories, and the craft behind every creation.'"
    />

    <!-- Filters & Grid -->
    <section class="py-20 container mx-auto px-6 lg:px-16 max-w-7xl">
      <!-- Category filter + Search -->
      <div class="flex flex-wrap items-start gap-3 mb-14">
        <div class="flex flex-wrap gap-3 flex-1">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            class="tag transition-all duration-200"
            :class="activeCategory === cat ? 'border-gold text-gold' : 'hover:border-cream-200/40 hover:text-cream-100'"
          >
            {{ cat }}
          </button>
        </div>
        <div class="relative w-full sm:w-auto">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cream-200/30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search recipes…"
            class="input-dark text-sm py-2 pl-9 pr-4 w-full sm:w-52"
          />
        </div>
      </div>

      <!-- Recipe grid - asymmetric layout -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <RecipeCardSkeleton v-for="i in 6" :key="i" />
      </div>

      <div v-else-if="filteredRecipes.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- First card is large -->
        <RecipeCard
          v-if="filteredRecipes[0]"
          :recipe="filteredRecipes[0]"
          class="md:col-span-2"
          large
        />
        <RecipeCard
          v-for="recipe in filteredRecipes.slice(1)"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>

      <div v-else class="text-center py-20">
        <p class="font-serif text-cream-200/40 text-2xl italic">
          {{ searchQuery ? `No results for "${searchQuery}"` : 'No recipes yet in this category.' }}
        </p>
        <button v-if="searchQuery" @click="searchQuery = ''" class="btn-outline text-sm mt-6">Clear Search</button>
      </div>

      <!-- Load more -->
      <div v-if="hasMore" class="mt-16 text-center">
        <button @click="loadMore" class="btn-outline" :disabled="loadingMore">
          {{ loadingMore ? 'Loading…' : 'Load More' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/database'

const { fetchPublicRecipes } = useRecipes()
const PAGE_SIZE = 12

const allRecipes = ref<Recipe[]>([])
const pending = ref(true)
const loadingMore = ref(false)
const offset = ref(0)
const total = ref(0)
const activeCategory = ref('All')

const categories = ['All', 'Pastry', 'Bread', 'Cakes', 'Japanese', 'Plated Desserts']
const searchQuery = ref('')

const filteredRecipes = computed(() => {
  let list = activeCategory.value === 'All'
    ? allRecipes.value
    : allRecipes.value.filter((r) => r.category?.toLowerCase() === activeCategory.value.toLowerCase())
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(r =>
      r.title?.toLowerCase().includes(q) ||
      r.subtitle?.toLowerCase().includes(q) ||
      r.category?.toLowerCase().includes(q)
    )
  }
  return list
})

const hasMore = computed(() => offset.value < total.value)

const load = async () => {
  const { data, count } = await fetchPublicRecipes(PAGE_SIZE, offset.value)
  allRecipes.value.push(...(data || []))
  total.value = count || 0
  offset.value += PAGE_SIZE
}

const loadMore = async () => {
  loadingMore.value = true
  await load()
  loadingMore.value = false
}

onMounted(async () => {
  await load()
  pending.value = false
})

useSeoMeta({
  title: 'Recipes — Sugar Momma',
  description: 'Explore our collection of premium pastry recipes from Japanese wagashi to French pâtisserie.',
})
</script>
