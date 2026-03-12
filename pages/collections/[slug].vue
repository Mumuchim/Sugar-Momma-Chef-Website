<template>
  <div>
    <!-- Loading -->
    <div v-if="pending" class="min-h-screen flex items-center justify-center">
      <UiLoadingSpinner />
    </div>

    <!-- Not found -->
    <div v-else-if="!collection" class="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <p class="font-serif text-cream-200/30 text-4xl italic mb-4">Collection not found.</p>
        <NuxtLink to="/collections" class="btn-outline">Back to Collections</NuxtLink>
      </div>
    </div>

    <template v-else>
      <!-- Hero -->
      <div class="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          v-if="collection.cover_url"
          :src="collection.cover_url"
          :alt="collection.title"
          class="w-full h-full object-cover opacity-40"
        />
        <div v-else class="w-full h-full bg-charcoal-800" />
        <div class="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/50 to-transparent" />
        <div class="absolute bottom-12 left-0 right-0 container mx-auto px-6 lg:px-16 max-w-7xl">
          <NuxtLink to="/collections" class="font-sans text-xs text-cream-200/40 hover:text-gold uppercase tracking-widest mb-4 inline-flex items-center gap-2 transition-colors">
            ← Collections
          </NuxtLink>
          <p class="section-label mt-2">Premium Collection</p>
          <h1 class="heading-section">{{ collection.title }}</h1>
          <p v-if="collection.tagline" class="font-sans text-cream-200/60 mt-3 max-w-xl">{{ collection.tagline }}</p>
        </div>
      </div>

      <!-- Content -->
      <section class="py-16 container mx-auto px-6 lg:px-16 max-w-7xl">
        <div class="grid lg:grid-cols-3 gap-16">
          <!-- Recipe list -->
          <div class="lg:col-span-2">
            <p class="section-label mb-8">What's Inside</p>

            <div class="space-y-4">
              <div
                v-for="recipe in collection.recipes"
                :key="recipe.id"
                class="flex items-center gap-4 border border-charcoal-700 p-4 hover:border-gold/30 transition-colors duration-300 group"
              >
                <div class="w-16 h-16 bg-charcoal-700 overflow-hidden shrink-0">
                  <img
                    v-if="recipe.thumbnail_url"
                    :src="recipe.thumbnail_url"
                    :alt="recipe.title"
                    class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="text-gold/30 text-2xl">🍰</span>
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <p class="font-serif text-cream-100 group-hover:text-gold transition-colors truncate">{{ recipe.title }}</p>
                  <div class="flex gap-3 mt-1">
                    <span class="font-sans text-cream-200/40 text-xs uppercase tracking-widest">{{ recipe.difficulty }}</span>
                    <span v-if="recipe.prep_time_mins" class="font-sans text-cream-200/40 text-xs">{{ recipe.prep_time_mins }}min</span>
                  </div>
                </div>

                <!-- Lock icon if not unlocked -->
                <div v-if="!hasAccess" class="text-gold/30 shrink-0">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <NuxtLink
                  v-else
                  :to="`/recipes/${recipe.slug}`"
                  class="font-sans text-xs text-gold hover:text-gold-light uppercase tracking-widest shrink-0 transition-colors"
                >
                  View →
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Unlock panel -->
          <div class="lg:col-span-1">
            <div class="border border-charcoal-700 p-8 sticky top-32">
              <!-- Already unlocked -->
              <div v-if="hasAccess" class="text-center">
                <div class="w-14 h-14 border border-gold/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="font-serif text-cream-100 text-xl mb-2">Collection Unlocked</p>
                <p class="font-sans text-cream-200/50 text-sm">You have full access to all {{ collection.recipes?.length }} recipes.</p>
              </div>

              <!-- Unlock form -->
              <div v-else>
                <p class="section-label mb-2">One-Time Access</p>
                <p class="font-serif text-cream-100 text-3xl mb-1">₱{{ collection.price_php?.toLocaleString('en-PH') }}</p>
                <p class="font-sans text-cream-200/40 text-xs mb-6">Lifetime access · {{ collection.recipes?.length }} recipes</p>

                <div class="gold-divider" />

                <p class="font-sans text-cream-200/60 text-sm leading-relaxed mb-6">
                  {{ collection.description || 'Unlock the full collection for exclusive access to all recipes, video guides, and technique breakdowns.' }}
                </p>

                <!-- Perks -->
                <ul class="space-y-2 mb-8">
                  <li v-for="perk in perks" :key="perk" class="flex items-start gap-2">
                    <span class="text-gold text-xs mt-0.5">✓</span>
                    <span class="font-sans text-cream-200/60 text-sm">{{ perk }}</span>
                  </li>
                </ul>

                <!-- Email input for non-logged-in users -->
                <div v-if="!user" class="mb-4">
                  <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Your Email</label>
                  <input
                    v-model="email"
                    type="email"
                    placeholder="you@email.com"
                    class="input-dark"
                  />
                  <p class="font-sans text-cream-200/30 text-xs mt-2">We'll send access to this email after payment.</p>
                </div>

                <div v-if="errorMsg" class="border border-red-500/30 bg-red-500/10 px-3 py-2 mb-4">
                  <p class="font-sans text-red-400 text-xs">{{ errorMsg }}</p>
                </div>

                <button
                  class="btn-gold w-full justify-center"
                  :disabled="loading"
                  @click="unlock"
                >
                  {{ loading ? 'Processing…' : 'Unlock Collection' }}
                </button>

                <p class="font-sans text-cream-200/30 text-xs text-center mt-4">
                  Secured by PayMongo · GCash, Card, PayMaya
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchCollectionBySlug, checkUserAccess } = useCollections()
const user = useSupabaseUser()

const email = ref(user.value?.email || '')
const loading = ref(false)
const errorMsg = ref('')
const hasAccess = ref(false)

const { data: collection, pending } = useAsyncData(
  `collection-${route.params.slug}`,
  () => fetchCollectionBySlug(route.params.slug as string).then((r) => r.data)
)

// Check access once collection loads
watch(collection, async (col) => {
  if (col?.id) {
    hasAccess.value = await checkUserAccess(col.id)
  }
}, { immediate: true })

const perks = [
  'Lifetime access — no subscription',
  'Full step-by-step video breakdowns',
  'Technique deep-dives & chef notes',
  'Printable recipe cards',
  'Access on any device',
]

const unlock = async () => {
  if (!collection.value) return
  if (!user.value && !email.value.includes('@')) {
    errorMsg.value = 'Please enter a valid email address.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const { data } = await $fetch<any>('/api/collections/unlock', {
      method: 'POST',
      body: {
        collection_id: collection.value.id,
        user_email: user.value?.email || email.value,
        user_id: user.value?.id,
      },
    })
    // Redirect to PayMongo checkout
    window.location.href = data.checkout_url
  } catch (e: any) {
    errorMsg.value = e.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

useSeoMeta({
  title: computed(() => collection.value ? `${collection.value.title} — Sugar Momma` : 'Collection — Sugar Momma'),
})
</script>
