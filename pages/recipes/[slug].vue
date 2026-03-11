<template>
  <div v-if="recipe">
    <!-- Back / Breadcrumb bar -->
    <div class="bg-charcoal-900 border-b border-charcoal-700">
      <div class="container mx-auto px-6 lg:px-16 max-w-7xl py-3 flex items-center gap-2 text-xs font-sans text-cream-200/40">
        <NuxtLink to="/recipes" class="hover:text-gold transition-colors flex items-center gap-1.5 uppercase tracking-widest">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Recipes
        </NuxtLink>
        <span class="text-cream-200/20">/</span>
        <span class="text-cream-200/60 truncate max-w-xs">{{ recipe.title }}</span>
      </div>
    </div>

    <!-- Full-bleed Banner -->
    <div class="relative h-[70vh] min-h-[500px] overflow-hidden">
      <img
        v-if="recipe.banner_url"
        :src="recipe.banner_url"
        :alt="recipe.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-charcoal-800" />
      <div class="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/30 to-transparent" />

      <!-- Meta overlay -->
      <div class="absolute bottom-12 left-6 lg:left-16 right-6 lg:right-16 max-w-4xl">
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="tag">{{ recipe.category }}</span>
          <span class="tag">{{ recipe.difficulty }}</span>
          <span v-if="recipe.is_premium" class="tag-gold">Premium</span>
        </div>
        <h1 class="heading-display mb-4">{{ recipe.title }}</h1>
        <p v-if="recipe.subtitle" class="font-sans text-cream-200/70 text-xl max-w-2xl">{{ recipe.subtitle }}</p>
      </div>
    </div>

    <!-- Sticky meta bar -->
    <div class="bg-charcoal-800/80 backdrop-blur-sm border-b border-charcoal-700 sticky top-0 z-20 no-print">
      <div class="container mx-auto px-6 lg:px-16 max-w-7xl">
        <div class="flex items-center justify-between py-3 gap-6 overflow-x-auto">
          <div class="flex gap-6 text-sm font-sans text-cream-200/60 whitespace-nowrap">
            <span v-if="recipe.prep_time_mins">Prep: <strong class="text-cream-100">{{ recipe.prep_time_mins }}m</strong></span>
            <span v-if="recipe.cook_time_mins">Cook: <strong class="text-cream-100">{{ recipe.cook_time_mins }}m</strong></span>
            <span>Serves: <strong class="text-cream-100">{{ currentServings }}</strong></span>
          </div>
          <button @click="printRecipe" class="btn-outline text-xs py-2 px-4 whitespace-nowrap no-print">
            🖨 Print Recipe
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 lg:px-16 max-w-7xl py-16">
      <div class="grid lg:grid-cols-3 gap-16">

        <!-- LEFT: Ingredients (sticky) -->
        <aside class="lg:col-span-1 order-2 lg:order-1">
          <div class="lg:sticky lg:top-20 space-y-8">
            <!-- Serving multiplier -->
            <div class="border border-charcoal-700 p-6">
              <p class="section-label mb-4">Adjust Servings</p>
              <div class="flex items-center gap-4">
                <button
                  @click="decrement"
                  class="w-10 h-10 border border-charcoal-600 text-cream-100 hover:border-gold transition-colors text-lg"
                >−</button>
                <span class="font-serif text-3xl text-cream-100 w-12 text-center">{{ currentServings }}</span>
                <button
                  @click="increment"
                  class="w-10 h-10 border border-charcoal-600 text-cream-100 hover:border-gold transition-colors text-lg"
                >+</button>
              </div>
              <p class="font-sans text-xs text-cream-200/40 mt-2">
                <span v-if="scalingFactor !== 1">{{ scalingFactor.toFixed(1) }}× original recipe</span>
                <span v-else>Original recipe</span>
              </p>
            </div>

            <!-- Ingredients list -->
            <div>
              <p class="section-label">Ingredients</p>
              <ul class="space-y-3">
                <li
                  v-for="ing in scaledIngredients"
                  :key="ing.id"
                  class="flex gap-3 font-sans text-sm border-b border-charcoal-700/50 pb-3 last:border-0"
                >
                  <span class="text-gold font-medium whitespace-nowrap w-20 shrink-0">
                    {{ ing.scaledQuantity || '' }} {{ ing.unit || '' }}
                  </span>
                  <span class="text-cream-100">{{ ing.name }}</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <!-- RIGHT: Content -->
        <main class="lg:col-span-2 order-1 lg:order-2 space-y-16">
          <!-- Story -->
          <div v-if="recipe.story">
            <p class="section-label">The Story</p>
            <div class="font-serif text-cream-200/80 text-lg leading-relaxed prose prose-invert max-w-none">
              {{ recipe.story }}
            </div>
          </div>

          <!-- Embedded video -->
          <div v-if="recipe.video_url" class="aspect-video bg-charcoal-800">
            <iframe
              :src="embedUrl"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>

          <!-- Instructions -->
          <div>
            <p class="section-label">Method</p>
            <div class="space-y-10">
              <div
                v-for="step in recipe.instructions"
                :key="step.id"
                class="grid md:grid-cols-[3rem_1fr] gap-6"
              >
                <div class="flex flex-col items-center">
                  <span class="font-serif text-3xl text-gold font-light leading-none">{{ step.step_number.toString().padStart(2,'0') }}</span>
                  <div class="w-px flex-1 bg-charcoal-700 mt-3 hidden md:block" />
                </div>
                <div>
                  <p class="font-sans text-cream-100 leading-relaxed">{{ step.body }}</p>
                  <img
                    v-if="step.photo_url"
                    :src="step.photo_url"
                    :alt="`Step ${step.step_number}`"
                    class="mt-6 w-full aspect-video object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>

  <div v-else-if="pending" class="min-h-screen flex items-center justify-center">
    <LoadingSpinner />
  </div>

  <div v-else class="min-h-screen flex items-center justify-center">
    <p class="font-serif text-cream-200/40 text-2xl">Recipe not found.</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchRecipeBySlug } = useRecipes()

const recipe = ref<any>(null)
const pending = ref(true)

const { currentServings, scaledIngredients, scalingFactor, increment, decrement } = (() => {
  const base = computed(() => recipe.value?.base_servings || 4)
  const ings = computed(() => recipe.value?.ingredients || [])
  return useServings(ings.value, base.value)
})()

// Refetch-safe on mount
onMounted(async () => {
  const { data } = await fetchRecipeBySlug(route.params.slug as string)
  recipe.value = data
  pending.value = false
})

const embedUrl = computed(() => {
  if (!recipe.value?.video_url) return ''
  const url = recipe.value.video_url
  if (url.includes('youtube.com/watch')) {
    const id = new URL(url).searchParams.get('v')
    return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]
    return `https://www.youtube.com/embed/${id}`
  }
  return url
})

const printRecipe = () => window.print()

useSeoMeta({
  title: computed(() => recipe.value ? `${recipe.value.title} — Sugar Momma` : 'Recipe — Sugar Momma'),
})
</script>
