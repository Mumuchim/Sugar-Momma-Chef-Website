<template>
  <section class="py-24 bg-charcoal-950">
    <div class="container mx-auto px-6 lg:px-16 max-w-3xl text-center">
      <p class="section-label mb-4">Stay in the Loop</p>
      <h2 class="heading-section mb-4">Join the Inner Circle</h2>
      <p class="font-sans text-cream-200/60 leading-relaxed mb-10">
        New recipes, exclusive techniques, early access to classes — delivered to your inbox.
      </p>

      <form v-if="!success" @submit.prevent="subscribe" class="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
        <input
          v-model="email"
          type="email"
          required
          class="input-dark flex-1"
          placeholder="your@email.com"
        />
        <button type="submit" class="btn-gold whitespace-nowrap" :disabled="loading">
          {{ loading ? '…' : 'Subscribe' }}
        </button>
      </form>

      <div v-else class="font-sans text-gold text-sm">
        ✓ Thank you — you're on the list.
      </div>

      <p class="font-sans text-xs text-cream-200/30 mt-4">No spam. Unsubscribe any time.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
const email = ref('')
const loading = ref(false)
const success = ref(false)

const subscribe = async () => {
  loading.value = true
  try {
    await $fetch('/api/newsletter', { method: 'POST', body: { email: email.value } })
    success.value = true
  } catch {}
  loading.value = false
}
</script>
