<template>
  <NuxtLink
    :to="`/recipes/${recipe.slug}`"
    class="group block overflow-hidden"
    :class="large ? 'card-dark' : 'card-dark'"
  >
    <!-- Image -->
    <div
      class="overflow-hidden bg-charcoal-800 relative"
      :class="large ? 'aspect-[16/9]' : 'aspect-[4/3]'"
    >
      <img
        v-if="recipe.thumbnail_url || recipe.banner_url"
        :src="recipe.thumbnail_url || recipe.banner_url"
        :alt="recipe.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div v-else class="w-full h-full bg-charcoal-700 flex items-center justify-center">
        <span class="font-serif text-4xl text-charcoal-600 italic">SM</span>
      </div>

      <!-- Premium badge -->
      <div v-if="recipe.is_premium" class="absolute top-4 right-4 tag-gold backdrop-blur-sm bg-charcoal-950/60">
        Premium
      </div>

      <!-- Difficulty pill -->
      <div class="absolute bottom-4 left-4">
        <span
          class="font-sans text-xs uppercase tracking-widest px-2.5 py-1 backdrop-blur-sm"
          :class="{
            'bg-emerald-900/60 text-emerald-300': recipe.difficulty === 'beginner',
            'bg-amber-900/60 text-amber-300': recipe.difficulty === 'intermediate',
            'bg-red-900/60 text-red-300': recipe.difficulty === 'advanced',
          }"
        >
          {{ recipe.difficulty }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <p class="section-label text-xs mb-2">{{ recipe.category }}</p>
      <h3
        class="font-serif text-cream-100 transition-colors duration-200 group-hover:text-gold"
        :class="large ? 'text-2xl lg:text-3xl' : 'text-xl'"
      >
        {{ recipe.title }}
      </h3>
      <p v-if="recipe.subtitle" class="font-sans text-cream-200/60 text-sm mt-2 line-clamp-2 leading-relaxed">
        {{ recipe.subtitle }}
      </p>

      <!-- Meta -->
      <div class="flex items-center gap-4 mt-4 pt-4 border-t border-charcoal-700">
        <span v-if="recipe.total_time_mins" class="font-sans text-xs text-cream-200/40">
          {{ recipe.total_time_mins }} min
        </span>
        <span v-if="recipe.base_servings" class="font-sans text-xs text-cream-200/40">
          Serves {{ recipe.base_servings }}
        </span>
        <span class="ml-auto font-sans text-xs text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View Recipe →
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/database'

defineProps<{
  recipe: Recipe
  large?: boolean
}>()
</script>
