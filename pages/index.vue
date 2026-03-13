<template>
  <div class="overflow-x-hidden">
    <!-- ── HERO ─────────────────────────────────────────────── -->
    <section class="relative min-h-screen flex items-end pb-24 overflow-hidden">
      <!-- Background image -->
      <div class="absolute inset-0 bg-charcoal-950">
        <img
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1800&q=80"
          alt="Artisan pastry"
          class="w-full h-full object-cover opacity-30"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-r from-charcoal-950/80 via-transparent to-transparent" />
      </div>

      <!-- Decorative gold line -->
      <div class="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-gold/30 to-transparent ml-[10%]" />

      <div class="relative container mx-auto px-6 lg:px-16 max-w-7xl">
        <div class="max-w-3xl">
          <h1 class="heading-display opacity-0 animate-fade-up animate-delay-200">
            {{ hero.title_line1 }}<br />
            {{ hero.title_line2 }}<br />
            <span class="italic text-gold">{{ hero.title_highlight }}</span>
          </h1>

          <div class="gold-divider opacity-0 animate-fade-up animate-delay-300" />

          <p class="font-sans text-cream-200/70 text-lg leading-relaxed max-w-xl opacity-0 animate-fade-up animate-delay-300">
            {{ hero.description }}
          </p>

          <div class="flex flex-wrap gap-4 mt-10 opacity-0 animate-fade-up animate-delay-400">
            <NuxtLink to="/recipes" class="btn-gold">Explore Recipes</NuxtLink>
            <NuxtLink to="/shop" class="btn-outline">Browse Shop</NuxtLink>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="absolute bottom-8 right-16 hidden lg:flex flex-col items-center gap-2 opacity-0 animate-fade-in animate-delay-500">
          <span class="font-sans text-xs text-gold/60 tracking-[0.2em] uppercase writing-vertical">Scroll</span>
          <div class="w-px h-16 bg-gradient-to-b from-gold/60 to-transparent" />
        </div>
      </div>
    </section>

    <!-- ── MEET THE CHEF ──────────────────────────────────────── -->
    <section class="py-28 bg-charcoal-800 relative overflow-hidden">
      <!-- Background texture -->
      <div class="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div class="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />

      <div class="relative container mx-auto px-6 lg:px-16 max-w-7xl">
        <div class="grid lg:grid-cols-2 gap-20 items-center">
          <!-- Portrait -->
          <div class="relative">
            <div class="aspect-[3/4] overflow-hidden relative max-w-md">
              <img
                :src="homeChef.photo_url || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80'"
                :alt="`${homeChef.name} — Sugar Momma`"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 to-transparent" />
            </div>
            <!-- Decorative frame -->
            <div class="absolute -bottom-4 -right-4 w-full h-full border border-gold/20 max-w-md pointer-events-none" />
            <!-- Chef name badge -->
            <div class="absolute bottom-6 left-6 bg-charcoal-950/90 backdrop-blur-sm border border-charcoal-700 px-5 py-3">
              <p class="font-serif text-cream-100 text-lg">{{ homeChef.name }}</p>
              <p class="font-sans text-gold text-xs uppercase tracking-widest mt-0.5">{{ homeChef.badge_role }}</p>
            </div>
          </div>

          <!-- Bio content -->
          <div>
            <p class="section-label">{{ homeChef.section_label }}</p>
            <h2 class="heading-section mb-6">
              {{ homeChef.heading }}<br />
              <span class="italic text-gold">{{ homeChef.heading_highlight }}</span>
            </h2>
            <div class="gold-divider" />

            <p class="font-sans text-cream-200/70 leading-relaxed mb-5">
              {{ homeChef.bio_para1 }}
            </p>
            <p class="font-sans text-cream-200/70 leading-relaxed mb-8">
              {{ homeChef.bio_para2 }}
            </p>

            <!-- Credentials grid -->
            <div class="grid grid-cols-2 gap-3 mb-10">
              <div
                v-for="cred in credentials"
                :key="cred.title"
                class="border border-charcoal-600 p-4 hover:border-gold/40 transition-colors duration-300"
              >
                <p class="font-sans text-gold text-xs uppercase tracking-widest mb-1">{{ cred.label }}</p>
                <p class="font-sans text-cream-100 text-sm">{{ cred.title }}</p>
              </div>
            </div>

            <div class="flex gap-4">
              <NuxtLink to="/about" class="btn-gold">Chef's Story</NuxtLink>
              <NuxtLink to="/classes" class="btn-outline">Book a Class</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FEATURED RECIPES ──────────────────────────────────── -->
    <section class="py-28 container mx-auto px-6 lg:px-16 max-w-7xl">
      <div class="flex items-end justify-between mb-16">
        <div>
          <p class="section-label">From the Kitchen</p>
          <h2 class="heading-section">Latest Recipes</h2>
        </div>
        <NuxtLink to="/recipes" class="btn-outline text-sm hidden md:inline-flex">
          View All
        </NuxtLink>
      </div>

      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <RecipeCardSkeleton v-for="i in 3" :key="i" />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <RecipeCard
          v-for="recipe in featuredRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>

      <div class="mt-10 text-center md:hidden">
        <NuxtLink to="/recipes" class="btn-outline">View All Recipes</NuxtLink>
      </div>
    </section>

    <!-- ── SHOP TEASER ──────────────────────────────────────── -->
    <section class="py-28 bg-charcoal-800 clip-diagonal relative overflow-hidden">
      <div class="absolute inset-0 bg-noise opacity-50" />
      <div class="relative container mx-auto px-6 lg:px-16 max-w-7xl">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p class="section-label">{{ shop.label }}</p>
            <h2 class="heading-section mb-6">
              {{ shop.title }}<br />{{ shop.title_line2 }}
            </h2>
            <div class="gold-divider" />
            <p class="font-sans text-cream-200/70 leading-relaxed mb-8 max-w-md">
              {{ shop.description }}
            </p>
            <NuxtLink to="/shop" class="btn-gold">Browse Shop</NuxtLink>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <NuxtLink
              v-for="(product, i) in shopTeaserProducts"
              :key="product.id"
              :to="`/shop/${product.slug}`"
              class="aspect-square bg-charcoal-900 overflow-hidden relative group"
              :class="i === 0 ? 'mt-8' : ''"
            >
              <img
                v-if="product.image_url"
                :src="product.image_url"
                :alt="product.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
              />
              <div v-else class="w-full h-full bg-charcoal-800 flex items-center justify-center">
                <span class="text-gold/20 text-4xl">🍰</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent" />
              <div class="absolute bottom-4 left-4 right-4">
                <p class="font-serif text-cream-100 text-sm group-hover:text-gold transition-colors">{{ product.name }}</p>
                <p class="font-sans text-gold text-xs mt-0.5">{{ product.is_bundle ? 'Bundle available' : 'Pickup & Delivery' }}</p>
              </div>
            </NuxtLink>
            <NuxtLink
              v-for="n in Math.max(0, 4 - shopTeaserProducts.length)"
              :key="`ph-${n}`"
              to="/shop"
              class="aspect-square bg-charcoal-900 border border-dashed border-charcoal-700 flex items-center justify-center"
            >
              <p class="font-serif text-cream-200/20 text-sm italic">Coming soon</p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CUSTOM ORDERS CTA ─────────────────────────────────── -->
    <section class="py-28 container mx-auto px-6 lg:px-16 max-w-7xl">
      <div class="border border-charcoal-700 p-12 lg:p-20 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-32 h-32 border-r border-b border-gold/20 translate-x-8 translate-y-8" />
        <div class="absolute bottom-0 right-0 w-32 h-32 border-l border-t border-gold/20 -translate-x-8 -translate-y-8" />

        <div class="relative text-center max-w-2xl mx-auto">
          <p class="section-label">Bespoke Creations</p>
          <h2 class="heading-section mb-6">Custom Pastry Orders</h2>
          <p class="font-sans text-cream-200/70 leading-relaxed mb-10">
            For weddings, celebrations, or simply an extraordinary moment — each
            piece is crafted with the same precision as fine-dining plated desserts.
          </p>
          <NuxtLink to="/orders" class="btn-gold">Place a Custom Order</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ── COOKING CLASSES ───────────────────────────────────── -->
    <section class="py-24 bg-charcoal-800 relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div class="container mx-auto px-6 lg:px-16 max-w-7xl">
        <div class="flex flex-wrap items-end justify-between gap-4 mb-14">
          <div>
            <p class="section-label">Learn & Create</p>
            <h2 class="heading-section">Cooking Classes</h2>
          </div>
          <NuxtLink to="/classes" class="btn-outline text-sm">View Schedule</NuxtLink>
        </div>

        <div v-if="upcomingClasses?.length" class="grid md:grid-cols-3 gap-6">
          <div
            v-for="cls in upcomingClasses"
            :key="cls.id"
            class="card-dark p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <span class="tag-gold">{{ cls.level }}</span>
              <span class="font-sans text-gold font-medium">₱{{ formatPrice(cls.price_php) }}</span>
            </div>
            <h3 class="font-serif text-cream-100 text-xl mb-2">{{ cls.title }}</h3>
            <p class="font-sans text-cream-200/60 text-sm leading-relaxed mb-4 line-clamp-2">{{ cls.description }}</p>
            <div class="text-xs font-sans text-cream-200/40 space-y-1">
              <p>{{ formatDate(cls.schedule_date) }}</p>
              <p>{{ cls.total_slots - cls.booked_slots }} slots remaining</p>
            </div>
          </div>
        </div>

        <!-- Empty state: clean placeholder cards -->
        <div v-else class="grid md:grid-cols-3 gap-6">
          <div
            v-for="i in 3"
            :key="i"
            class="border border-charcoal-700/60 border-dashed p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[180px]"
          >
            <svg class="w-8 h-8 text-charcoal-600" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p class="font-serif text-cream-200/20 text-sm italic">Coming soon</p>
          </div>
        </div>
        <p v-if="!upcomingClasses?.length" class="font-sans text-cream-200/40 text-sm text-center mt-8">
          No classes scheduled yet — join the newsletter to be first to know.
        </p>
      </div>
    </section>

    <!-- ── NEWSLETTER ────────────────────────────────────────── -->
    <UiNewsletterSignup />
  </div>
</template>

<script setup lang="ts">
const { fetchFeaturedRecipes } = useRecipes()
const { fetchUpcomingClasses } = useClasses()

const { data: featuredRecipes, pending } = useAsyncData('featured-recipes', () =>
  fetchFeaturedRecipes(3).then((r) => r.data || [])
)

const { data: upcomingClasses } = useAsyncData('upcoming-classes', () =>
  fetchUpcomingClasses().then((r) => (r.data || []).slice(0, 3))
)

const { data: shopTeaserProducts } = useAsyncData('shop-teaser', () =>
  $fetch<any[]>('/api/products').then((data) => (data || []).slice(0, 4)).catch(() => [])
)

// Fetch editable site content
const { data: heroContent } = useAsyncData('content-home-hero', () =>
  $fetch('/api/content/home_hero').catch(() => null)
)
const { data: shopContent } = useAsyncData('content-home-shop', () =>
  $fetch('/api/content/home_shop_teaser').catch(() => null)
)
const { data: homeChefContent } = useAsyncData('content-home-chef', () =>
  $fetch('/api/content/home_chef').catch(() => null)
)

const hero = computed(() => ({
  title_line1:     (heroContent.value as any)?.title_line1     ?? 'Where Japanese',
  title_line2:     (heroContent.value as any)?.title_line2     ?? 'precision meets',
  title_highlight: (heroContent.value as any)?.title_highlight ?? 'sweetness.',
  description:     (heroContent.value as any)?.description     ?? 'Custom catering orders, fresh baked goods, and intimate cooking classes — crafted with the discipline of fine dining.',
}))

const shop = computed(() => ({
  label:       (shopContent.value as any)?.label       ?? 'Order Online',
  title:       (shopContent.value as any)?.title       ?? 'Fresh Baked',
  title_line2: (shopContent.value as any)?.title_line2 ?? 'Goods',
  description: (shopContent.value as any)?.description ?? 'Artisan pastries made to order — available per piece or in bundles. Choose pickup from Rizal or have them delivered to your door.',
}))

const homeChef = computed(() => ({
  photo_url:         (homeChefContent.value as any)?.photo_url         ?? '',
  name:              (homeChefContent.value as any)?.name              ?? 'Chef Regina Faustino',
  badge_role:        (homeChefContent.value as any)?.badge_role        ?? 'Executive Head Chef',
  section_label:     (homeChefContent.value as any)?.section_label     ?? 'The Woman Behind Sugar Momma',
  heading:           (homeChefContent.value as any)?.heading           ?? 'Crafted with',
  heading_highlight: (homeChefContent.value as any)?.heading_highlight ?? 'passion & precision.',
  bio_para1:         (homeChefContent.value as any)?.bio_para1         ?? "Sugar Momma was born from Chef Regina's dream of bringing the discipline of Japanese fine-dining pastry to every table in the Philippines. After over 12 years in Michelin-starred kitchens across Tokyo and Manila, she returned home to build something deeply personal — a place where technique and soul coexist.",
  bio_para2:         (homeChefContent.value as any)?.bio_para2         ?? "Every recipe, every class, every custom creation carries her signature: meticulous, heartfelt, and unmistakably Sugar Momma.",
}))

const credentials = [
  { label: 'Education', title: 'Le Cordon Bleu, Paris — Pâtisserie Diploma' },
  { label: 'Experience', title: 'Nihonbashi Yukari, Tokyo — 3-year tenure' },
  { label: 'Current Role', title: 'ABCT Japanese Restaurant — Executive Head Chef' },
  { label: 'Recognition', title: 'Featured in Manila Bulletin 2023' },
]

const formatPrice = (price: number) => price.toLocaleString('en-PH')
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-PH', { weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })

useSeoMeta({
  title: 'Sugar Momma — Premium Pastry & Fine Dining',
  ogTitle: 'Sugar Momma — Premium Pastry & Fine Dining',
  description: 'Custom catering, fresh baked goods, and cooking classes by Head Executive Chef specializing in Japanese fine-dining pastries.',
})
</script>
