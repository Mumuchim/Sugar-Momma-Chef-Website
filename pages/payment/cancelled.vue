<template>
  <div class="min-h-screen bg-charcoal-950 flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <div class="w-20 h-20 border border-charcoal-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <span class="text-cream-200/40 text-3xl">×</span>
      </div>

      <p class="section-label">Payment Cancelled</p>
      <h1 class="font-serif text-cream-100 text-3xl mb-4">No charge was made</h1>
      <p class="font-sans text-cream-200/60 leading-relaxed mb-10">
        Your payment was cancelled and you have not been charged.
        You can go back and try again whenever you're ready.
      </p>

      <div class="flex flex-wrap gap-4 justify-center">
        <button @click="$router.back()" class="btn-outline">Go Back</button>
        <NuxtLink to="/" class="btn-gold">Return Home</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useSeoMeta({ title: 'Payment Cancelled — Sugar Momma' })
</script>
