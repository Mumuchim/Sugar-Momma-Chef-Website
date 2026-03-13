<template>
  <div class="min-h-screen bg-charcoal-950 flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <!-- Animated checkmark -->
      <div class="w-20 h-20 border border-gold rounded-full flex items-center justify-center mx-auto mb-8 relative">
        <span class="text-gold text-3xl">✓</span>
        <div class="absolute inset-0 rounded-full border border-gold/20 scale-110 animate-ping" style="animation-duration:2s;animation-iteration-count:1" />
      </div>

      <p class="section-label mb-2">Payment Confirmed</p>
      <h1 class="font-serif text-cream-100 text-4xl mb-4">
        <span v-if="type === 'order'">Deposit Received</span>
        <span v-else-if="type === 'class'">Booking Confirmed!</span>
        <span v-else>You're all set</span>
      </h1>

      <p class="font-sans text-cream-200/60 leading-relaxed mb-8">
        <span v-if="type === 'order'">
          Your 50% deposit has been received. We'll reach out within 24 hours to finalize your custom order details and confirm your event date.
        </span>
        <span v-else-if="type === 'class'">
          Your class booking is confirmed! Check your inbox — a confirmation with joining details has been sent to your email.
        </span>
        <span v-else>
          Your payment was successful. Check your email for a confirmation and next steps.
        </span>
      </p>

      <!-- Order tracking token (shop orders only) -->
      <div v-if="type === 'shop' && lookupToken" class="border border-charcoal-700 bg-charcoal-900/50 p-5 mb-8 text-left">
        <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-2">Your Order Reference</p>
        <p class="font-mono text-gold text-sm break-all mb-3">{{ lookupToken }}</p>
        <p class="font-sans text-cream-200/40 text-xs leading-relaxed">
          Save this token — you'll need it along with your email to track your order on the
          <NuxtLink to="/track" class="text-gold hover:text-gold-light transition-colors">Track My Order</NuxtLink>
          page.
        </p>
      </div>

      <div class="flex flex-wrap gap-4 justify-center">
        <NuxtLink v-if="type === 'class'" to="/classes" class="btn-outline">
          View Classes
        </NuxtLink>
        <NuxtLink v-else-if="type === 'shop'" to="/track" class="btn-outline">
          Track My Order
        </NuxtLink>
        <NuxtLink v-else-if="type === 'order'" to="/orders" class="btn-outline">
          Place Another Order
        </NuxtLink>
        <NuxtLink to="/" class="btn-gold">Return Home</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
const route = useRoute()
const type = computed(() => route.query.type as string || '')
const method = computed(() => route.query.method as string || 'online')
const lookupToken = computed(() => route.query.token as string || '')
const isCod = computed(() => method.value === 'cod')
useSeoMeta({ title: 'Order Confirmed — Sugar Momma' })
</script>
