<template>
  <div>
    <UiPageHero
      label="The Story"
      title="About Sugar Momma"
      subtitle="Where discipline meets sweetness — a chef's journey from Tokyo to Manila."
    />

    <!-- Chef Portrait Section -->
    <section class="py-20 bg-charcoal-800">
      <div class="container mx-auto px-6 lg:px-16 max-w-7xl">
        <div class="grid lg:grid-cols-2 gap-20 items-start">
          <!-- Portrait -->
          <div class="relative sticky top-32">
            <div class="aspect-[3/4] overflow-hidden">
              <img
                :src="chef.portrait_url || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80'"
                :alt="`${chef.name} — Executive Head Chef, Sugar Momma`"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 to-transparent" />
            </div>
            <div class="absolute -bottom-4 -right-4 w-full h-full border border-gold/20 pointer-events-none" />

            <!-- Social links -->
            <div class="mt-8 flex gap-3">
              <a
                v-for="social in socials"
                :key="social.label"
                :href="social.href"
                target="_blank"
                class="flex items-center gap-2 border border-charcoal-700 hover:border-gold px-4 py-2 transition-colors duration-200 group"
              >
                <span class="font-sans text-xs text-cream-200/50 group-hover:text-gold uppercase tracking-widest transition-colors">{{ social.label }}</span>
              </a>
            </div>
          </div>

          <!-- Story -->
          <div class="space-y-12">
            <div>
              <p class="section-label">Executive Head Chef</p>
              <h2 class="heading-section mb-2">{{ chef.name }}</h2>
              <p class="font-sans text-gold/70 text-sm uppercase tracking-widest">{{ chef.role }}</p>
              <div class="gold-divider" />
            </div>

            <div class="space-y-6 font-sans text-cream-200/70 leading-relaxed">
              <p v-for="(para, i) in chef.bio" :key="i">{{ para }}</p>
            </div>

            <!-- Credentials -->
            <div>
              <p class="section-label mb-6">Career Highlights</p>
              <div class="space-y-4">
                <div
                  v-for="item in timeline"
                  :key="item.year"
                  class="flex gap-6 items-start border-l border-charcoal-700 pl-6 hover:border-gold transition-colors duration-300"
                >
                  <span class="font-serif text-gold text-sm shrink-0 w-12">{{ item.year }}</span>
                  <div>
                    <p class="font-sans text-cream-100 text-sm font-medium">{{ item.title }}</p>
                    <p class="font-sans text-cream-200/50 text-sm mt-0.5">{{ item.detail }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Philosophy -->
            <div class="border border-charcoal-700 p-8 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 border-l border-b border-gold/10 pointer-events-none" />
              <p class="section-label mb-4">Chef's Philosophy</p>
              <blockquote class="font-serif text-cream-100 text-2xl italic leading-relaxed">
                "{{ chef.philosophy_quote }}"
              </blockquote>
              <p class="font-sans text-cream-200/40 text-sm mt-4">— Chef Regina Faustino</p>
            </div>

            <!-- CTA -->
            <div class="flex flex-wrap gap-4">
              <NuxtLink to="/classes" class="btn-gold">Learn from Chef Regina</NuxtLink>
              <NuxtLink to="/recipes" class="btn-outline">Explore Her Recipes</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Press -->
    <section class="py-20 container mx-auto px-6 lg:px-16 max-w-7xl">
      <p class="section-label text-center mb-12">As Seen In</p>
      <div class="flex flex-wrap justify-center gap-12 items-center">
        <span
          v-for="press in pressFeatures"
          :key="press"
          class="font-serif text-cream-200/20 text-2xl italic hover:text-cream-200/50 transition-colors duration-300 cursor-default"
        >
          {{ press }}
        </span>
      </div>
    </section>

    <UiNewsletterSignup />
  </div>
</template>

<script setup lang="ts">
const { data: chefData }     = useAsyncData('about-chef',     () => $fetch('/api/content/about_chef').catch(() => null))
const { data: timelineData } = useAsyncData('about-timeline', () => $fetch('/api/content/about_timeline').catch(() => null))
const { data: pressData }    = useAsyncData('about-press',    () => $fetch('/api/content/about_press').catch(() => null))
const { data: socialsData }  = useAsyncData('about-socials',  () => $fetch('/api/content/about_socials').catch(() => null))

const chef = computed(() => ({
  name:            (chefData.value as any)?.name            ?? 'Chef Regina Faustino',
  role:            (chefData.value as any)?.role            ?? 'Founder & Head Chef, Sugar Momma',
  portrait_url:    (chefData.value as any)?.portrait_url    ?? 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
  philosophy_quote:(chefData.value as any)?.philosophy_quote ?? 'A perfect pastry should taste like it came from someone who loves you. The technique is just the beginning.',
  bio: ((chefData.value as any)?.bio as string[]) ?? [
    'Chef Regina Faustino grew up watching her grandmother make kakanin in a small kitchen in Bulacan — measuring nothing, wasting nothing, pouring everything into each piece. That memory became the foundation of everything she would later learn to do with precision.',
    'After graduating from Le Cordon Bleu in Paris with a Pâtisserie Diploma, she spent three formative years in Tokyo at Nihonbashi Yukari, a restaurant renowned for bridging Japanese kaiseki tradition with French technique. It was there she fell in love with the philosophy of kanso — simplicity as the highest form of refinement.',
    'Returning to Rizal as Executive Head Chef at ABCT Japanese Restaurant, she led the dessert program that earned the restaurant its first appearance in the Asia\'s 50 Best extended list. But the kitchen, while fulfilling, wasn\'t enough.',
    'Sugar Momma was Regina\'s answer to a simpler question: what if the most exquisite pastry wasn\'t locked inside a fine-dining reservation? What if it could live in your home, in your kitchen, in the hands of someone she taught herself?',
    'Today, Sugar Momma is more than a brand. It\'s a living archive of Regina\'s journey — recipes she developed in Tokyo, techniques she refined in Paris, and flavors that have always been Filipino at heart.',
  ],
}))

const timeline = computed(() => (timelineData.value as any[]) ?? [
  { year: '2009', title: 'Le Cordon Bleu, Paris', detail: 'Graduated with Pâtisserie Grand Diplôme' },
  { year: '2010', title: 'Nihonbashi Yukari, Tokyo', detail: '3-year tenure under Chef Kimio Nonaga' },
  { year: '2013', title: "L'Atelier de Joël Robuchon, Hong Kong", detail: 'Stage program, dessert innovation' },
  { year: '2015', title: 'ABCT Japanese Restaurant', detail: 'Appointed Head Executive Head Chef' },
  { year: '2019', title: 'Manila Bulletin', detail: 'Named "Chef to Watch" — Class of 2019' },
  { year: '2021', title: 'Sugar Momma Founded', detail: 'Launched as an independent pastry brand' },
  { year: '2023', title: 'Manila Bulletin', detail: 'Featured in "The New Filipino Table" cover story' },
])

const socials = computed(() => (socialsData.value as any[]) ?? [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Facebook',  href: 'https://facebook.com' },
  { label: 'YouTube',   href: 'https://youtube.com' },
])

const pressFeatures = computed(() => (pressData.value as string[]) ?? [
  'Manila Bulletin', 'Metro Magazine', 'Lifestyle Asia', 'Manila Times', 'CNN Philippines',
])

useSeoMeta({
  title: 'About Chef Regina Faustino — Sugar Momma',
  description: 'Meet Chef Regina Faustino, Executive Head Chef and founder of Sugar Momma. From Le Cordon Bleu to Tokyo to Manila — a story of precision, passion, and pastry.',
})
</script>
