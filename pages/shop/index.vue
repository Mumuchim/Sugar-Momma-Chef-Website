<template>
  <div>
    <UiPageHero
      label="Order Online"
      title="Shop"
      subtitle="Fresh baked goods, available for pickup or delivery."
    />

    <section class="py-20 container mx-auto px-6 lg:px-16 max-w-7xl">

      <!-- Filters bar -->
      <div class="flex flex-wrap items-center gap-3 mb-12">
        <button
          v-for="cat in categories"
          :key="cat.value"
          @click="activeCategory = cat.value"
          class="font-sans text-xs uppercase tracking-widest px-4 py-2 border transition-all duration-200"
          :class="activeCategory === cat.value
            ? 'border-gold text-gold bg-gold/10'
            : 'border-charcoal-700 text-cream-200/50 hover:border-charcoal-500 hover:text-cream-200'"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="i in 8"
          :key="i"
          class="bg-charcoal-900 border border-charcoal-800 animate-pulse"
        >
          <div class="aspect-square bg-charcoal-800" />
          <div class="p-5 space-y-3">
            <div class="h-4 bg-charcoal-800 rounded w-3/4" />
            <div class="h-3 bg-charcoal-800 rounded w-full" />
            <div class="h-3 bg-charcoal-800 rounded w-1/2" />
          </div>
        </div>
      </div>

      <!-- Products grid -->
      <div v-else-if="filteredProducts.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ShopProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-24">
        <p class="font-serif text-cream-200/20 text-3xl italic mb-4">Nothing here yet.</p>
        <p class="font-sans text-cream-200/30 text-sm">Check back soon — new items are added regularly.</p>
      </div>

    </section>
  </div>
</template>

<script setup lang="ts">
const activeCategory = ref('all')
const products = ref<any[]>([])
const pending = ref(true)

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Cakes', value: 'cakes' },
  { label: 'Pastries', value: 'pastries' },
  { label: 'Cookies', value: 'cookies' },
  { label: 'Bread', value: 'bread' },
  { label: 'Seasonal', value: 'seasonal' },
]

onMounted(async () => {
  try {
    const data = await $fetch<any[]>('/api/products')
    products.value = data || []
  } catch (e) {
    console.error('Failed to load products:', e)
  } finally {
    pending.value = false
  }
})

const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') return products.value
  return products.value.filter(p => p.category === activeCategory.value)
})

useSeoMeta({
  title: 'Shop — Sugar Momma',
  description: 'Order fresh baked goods from Sugar Momma. Available for pickup or delivery.',
})
</script>
