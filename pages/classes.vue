<template>
  <div>
    <UiPageHero
      :label="hero.label"
      :title="hero.title"
      :subtitle="hero.subtitle"
    />

    <!-- Instructor Bio -->
    <section class="py-20 bg-charcoal-800">
      <div class="container mx-auto px-6 lg:px-16 max-w-7xl">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div class="aspect-[4/5] bg-charcoal-700 overflow-hidden relative">
            <img
              :src="instructor.photo_url || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80'"
              :alt="`${instructor.name} — Instructor`"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
          </div>
          <div>
            <p class="section-label">Your Instructor</p>
            <h2 class="heading-section mb-4">{{ instructor.name }}</h2>
            <div class="gold-divider" />
            <p class="font-sans text-cream-200/70 leading-relaxed mb-6">
              {{ instructor.bio }}
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="cred in instructor.credentials" :key="cred" class="border border-charcoal-600 p-4">
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

// Fetch editable site content
const { data: heroData }       = useAsyncData('content-classes-hero',       () => $fetch('/api/content/classes_hero').catch(() => null))
const { data: instructorData } = useAsyncData('content-classes-instructor', () => $fetch('/api/content/classes_instructor').catch(() => null))

const hero = computed(() => ({
  label:    (heroData.value as any)?.label    ?? 'Learn the Craft',
  title:    (heroData.value as any)?.title    ?? 'Cooking Classes',
  subtitle: (heroData.value as any)?.subtitle ?? 'Small group sessions where technique meets creativity.',
}))

const instructor = computed(() => ({
  name:        (instructorData.value as any)?.name        ?? 'Chef Regina Faustino',
  photo_url:   (instructorData.value as any)?.photo_url   ?? 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
  bio:         (instructorData.value as any)?.bio         ?? 'With over 12 years in Japanese fine-dining kitchens across Tokyo and Manila, Chef Regina brings the precision and artistry of Michelin-star pastry to intimate group classes designed for serious home cooks and aspiring Head Chefs.',
  credentials: ((instructorData.value as any)?.credentials as string[]) ?? [
    'Le Cordon Bleu, Paris — Pâtisserie Diploma',
    'Nihonbashi Yukari, Tokyo — 3-year tenure',
    'ABCT Japanese Restaurant — Executive Head Chef',
    'Featured in Manila Bulletin 2023',
  ],
}))

useSeoMeta({ title: 'Cooking Classes — Sugar Momma' })
</script>
