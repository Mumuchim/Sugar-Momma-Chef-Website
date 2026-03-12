<template>
  <div>
    <UiPageHero
      label="Learn the Craft"
      title="Cooking Classes"
      subtitle="Small group sessions where technique meets creativity."
    />

    <!-- Chef Bio -->
    <section class="py-20 bg-charcoal-800">
      <div class="container mx-auto px-6 lg:px-16 max-w-7xl">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div class="aspect-[4/5] bg-charcoal-700 overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"
              alt="Chef portrait"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
          </div>
          <div>
            <p class="section-label">Your Instructor</p>
            <h2 class="heading-section mb-4">Chef Maria Santos</h2>
            <div class="gold-divider" />
            <p class="font-sans text-cream-200/70 leading-relaxed mb-6">
              With over 12 years in Japanese fine-dining kitchens across Tokyo and Manila,
              Chef Maria brings the precision and artistry of Michelin-star pastry to intimate
              group classes designed for serious home cooks and aspiring pastry chefs.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="cred in credentials" :key="cred" class="border border-charcoal-600 p-4">
                <p class="font-sans text-cream-100 text-sm">{{ cred }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Class listings -->
    <section class="py-20 container mx-auto px-6 lg:px-16 max-w-7xl">
      <p class="section-label mb-4">Upcoming Schedule</p>
      <h2 class="heading-section mb-14">Available Classes</h2>

      <div v-if="pending" class="space-y-6">
        <div v-for="i in 3" :key="i" class="h-32 bg-charcoal-800 animate-pulse" />
      </div>

      <div v-else-if="classes.length" class="space-y-6">
        <UiClassCard
          v-for="cls in classes"
          :key="cls.id"
          :class-item="cls"
          @book="openBooking"
        />
      </div>

      <div v-else class="text-center py-20">
        <p class="font-serif text-cream-200/40 text-2xl italic">No upcoming classes scheduled.</p>
        <p class="font-sans text-cream-200/40 mt-3 text-sm">Check back soon or join the newsletter.</p>
      </div>
    </section>

    <!-- Booking Modal -->
    <UiClassBookingModal
      v-if="selectedClass"
      :class-item="selectedClass"
      @close="selectedClass = null"
    />

    <UiNewsletterSignup />
  </div>
</template>

<script setup lang="ts">
import type { Class } from '~/types/database'

const { fetchUpcomingClasses } = useClasses()

const classes = ref<Class[]>([])
const pending = ref(true)
const selectedClass = ref<Class | null>(null)

onMounted(async () => {
  const { data } = await fetchUpcomingClasses()
  classes.value = data || []
  pending.value = false
})

const openBooking = (cls: Class) => {
  selectedClass.value = cls
}

const credentials = [
  'Le Cordon Bleu, Paris — Pâtisserie Diploma',
  'Nihonbashi Yukari, Tokyo — 3-year tenure',
  'Pioneer Centre Manila — Head Pastry Chef',
  'Featured in Esquire Philippines 2023',
]

useSeoMeta({ title: 'Cooking Classes — Sugar Momma' })
</script>
