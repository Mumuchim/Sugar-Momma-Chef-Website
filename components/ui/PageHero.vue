<template>
  <section class="pt-28 pb-20 bg-charcoal-800 relative overflow-hidden">
    <!-- Decorative elements -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
    <div class="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

    <div class="relative container mx-auto px-6 lg:px-16 max-w-7xl">
      <div class="max-w-3xl">
        <p class="section-label">{{ label }}</p>
        <h1 class="heading-display">{{ title }}</h1>
        <div v-if="subtitle" class="mt-6">
          <div class="gold-divider" />
          <p class="font-sans text-cream-200/70 text-lg leading-relaxed">{{ subtitle }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  title: string
  subtitle?: string
}>()
</script>
