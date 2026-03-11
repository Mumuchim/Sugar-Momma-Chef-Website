<template>
  <div class="min-h-screen bg-charcoal-950 flex items-center justify-center px-6 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/3 rounded-full blur-3xl" />
    </div>

    <!-- Decorative vertical line -->
    <div class="absolute top-0 left-[10%] w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

    <div class="relative text-center max-w-lg">
      <!-- Giant 404 -->
      <p class="font-serif text-gold/10 select-none" style="font-size: clamp(8rem, 20vw, 14rem); line-height: 0.85; letter-spacing: -0.05em;">
        404
      </p>

      <div class="-mt-4">
        <p class="section-label mb-4">Page Not Found</p>
        <h1 class="heading-section mb-4">
          Lost in the kitchen?
        </h1>
        <div class="gold-divider mx-auto" />
        <p class="font-sans text-cream-200/60 leading-relaxed mb-10 max-w-sm mx-auto">
          This page doesn't exist — perhaps it was whisked away. Let's get you back to something delicious.
        </p>

        <div class="flex flex-wrap gap-4 justify-center">
          <NuxtLink to="/" class="btn-gold">Return Home</NuxtLink>
          <NuxtLink to="/recipes" class="btn-outline">Browse Recipes</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useSeoMeta({ title: 'Page Not Found — Sugar Momma' })
</script>
