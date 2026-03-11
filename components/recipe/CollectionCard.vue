<template>
  <div class="card-dark overflow-hidden group">
    <!-- Cover image -->
    <div class="aspect-[16/9] bg-charcoal-800 overflow-hidden relative">
      <img
        v-if="collection.cover_url"
        :src="collection.cover_url"
        :alt="collection.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        :class="!hasAccess ? 'blur-sm' : ''"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 to-transparent" />

      <!-- Lock overlay for unpurchased -->
      <div v-if="!hasAccess" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <div class="w-14 h-14 border border-gold/40 rounded-full flex items-center justify-center mx-auto mb-3 bg-charcoal-950/60 backdrop-blur-sm">
            <span class="text-gold text-xl">🔒</span>
          </div>
          <p class="font-serif text-cream-100 text-lg">Locked Collection</p>
        </div>
      </div>

      <!-- Unlocked badge -->
      <div v-else class="absolute top-4 right-4 tag-gold backdrop-blur-sm bg-charcoal-950/60">
        ✓ Unlocked
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 lg:p-8">
      <h3 class="font-serif text-cream-100 text-2xl mb-2">{{ collection.title }}</h3>
      <p v-if="collection.tagline" class="font-sans text-gold text-sm italic mb-3">{{ collection.tagline }}</p>
      <p v-if="collection.description" class="font-sans text-cream-200/60 text-sm leading-relaxed mb-6 line-clamp-3">
        {{ collection.description }}
      </p>

      <div class="flex items-center justify-between mt-6 pt-6 border-t border-charcoal-700">
        <div>
          <p class="font-serif text-3xl text-gold">₱{{ formatPrice(collection.price_php) }}</p>
          <p class="font-sans text-xs text-cream-200/40 mt-0.5">one-time payment</p>
        </div>

        <div>
          <NuxtLink
            v-if="hasAccess"
            :to="`/collections/${collection.slug}`"
            class="btn-outline text-sm"
          >
            View Recipes
          </NuxtLink>
          <button
            v-else
            @click="$emit('unlock', collection)"
            class="btn-gold text-sm"
          >
            Unlock Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Collection } from '~/types/database'

defineProps<{
  collection: Collection
  hasAccess: boolean
}>()

defineEmits<{
  (e: 'unlock', collection: Collection): void
}>()

const formatPrice = (price: number) => price.toLocaleString('en-PH')
</script>
