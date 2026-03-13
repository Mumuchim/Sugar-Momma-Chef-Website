<template>
  <NuxtLink
    :to="`/shop/${product.slug}`"
    class="group block bg-charcoal-900 border border-charcoal-700 hover:border-gold/40 transition-all duration-300 overflow-hidden"
  >
    <!-- Product image -->
    <div class="relative aspect-square overflow-hidden bg-charcoal-800">
      <img
        v-if="product.image_url"
        :src="product.image_url"
        :alt="product.name"
        class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <span class="text-gold/20 text-5xl">🍰</span>
      </div>

      <!-- Bundle badge -->
      <div v-if="product.is_bundle" class="absolute top-3 left-3">
        <span class="bg-gold text-charcoal-950 font-sans text-xs font-semibold uppercase tracking-widest px-2.5 py-1">
          Bundle
        </span>
      </div>

      <!-- Category tag -->
      <div v-if="product.category" class="absolute top-3 right-3">
        <span class="bg-charcoal-950/80 backdrop-blur-sm border border-charcoal-700 font-sans text-xs text-cream-200/60 uppercase tracking-widest px-2 py-1">
          {{ product.category }}
        </span>
      </div>
    </div>

    <!-- Product info -->
    <div class="p-5">
      <h3 class="font-serif text-cream-100 text-lg group-hover:text-gold transition-colors duration-200 leading-tight mb-1">
        {{ product.name }}
      </h3>

      <p v-if="product.short_description" class="font-sans text-cream-200/50 text-sm leading-relaxed line-clamp-2 mb-4">
        {{ product.short_description }}
      </p>

      <!-- Pricing -->
      <div class="flex items-end justify-between mt-3">
        <div>
          <p v-if="product.is_bundle && product.bundle_price_php" class="font-sans text-cream-200/40 text-xs mb-0.5">
            from
          </p>
          <p class="font-serif text-gold text-xl font-medium">
            ₱{{ formatPrice(lowestPrice) }}
          </p>
          <p v-if="product.is_bundle && product.bundle_price_php" class="font-sans text-cream-200/40 text-xs mt-0.5">
            {{ product.bundle_label || 'Bundle available' }}
          </p>
        </div>

        <span class="font-sans text-xs text-gold/70 group-hover:text-gold uppercase tracking-widest transition-colors duration-200">
          Book Now →
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  product: {
    id: string
    slug: string
    name: string
    short_description?: string
    image_url?: string
    category?: string
    is_bundle: boolean
    bundle_label?: string
    price_php: number
    bundle_price_php?: number
  }
}>()

const lowestPrice = computed(() => {
  if (props.product.is_bundle && props.product.bundle_price_php) {
    return Math.min(props.product.price_php, props.product.bundle_price_php)
  }
  return props.product.price_php
})

const formatPrice = (price: number) => price.toLocaleString('en-PH')
</script>
