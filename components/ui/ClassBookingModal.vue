<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
      <div class="absolute inset-0 bg-charcoal-950/90 backdrop-blur-sm" />

      <div class="relative bg-charcoal-900 border border-charcoal-700 w-full max-w-lg p-8">
        <button @click="$emit('close')" class="absolute top-4 right-4 text-cream-200/40 hover:text-cream-100 text-xl">×</button>

        <h2 class="font-serif text-cream-100 text-2xl mb-2">{{ classItem.title }}</h2>
        <p class="font-sans text-gold text-sm mb-6">₱{{ classItem.price_php.toLocaleString('en-PH') }} per person</p>

        <form v-if="!submitted" @submit.prevent="book" class="space-y-4">
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Full Name *</label>
              <input v-model="form.customer_name" type="text" required class="input-dark" />
            </div>
            <div>
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Email *</label>
              <input v-model="form.customer_email" type="email" required class="input-dark" />
            </div>
          </div>
          <div>
            <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Phone</label>
            <input v-model="form.customer_phone" type="tel" class="input-dark" />
          </div>

          <div v-if="error" class="border border-red-500/30 bg-red-500/10 px-3 py-2">
            <p class="font-sans text-red-400 text-xs">{{ error }}</p>
          </div>

          <button type="submit" class="btn-gold w-full justify-center" :disabled="loading">
            {{ loading ? 'Processing…' : 'Confirm & Pay' }}
          </button>
        </form>

        <div v-else class="text-center py-6">
          <p class="font-serif text-cream-100 text-xl mb-3">Redirecting to payment…</p>
          <a :href="checkoutUrl" class="btn-gold">Pay Now</a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Class } from '~/types/database'

const props = defineProps<{ classItem: Class }>()
defineEmits(['close'])

const form = reactive({ customer_name: '', customer_email: '', customer_phone: '' })
const loading = ref(false)
const error = ref('')
const submitted = ref(false)
const checkoutUrl = ref('')

const book = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await $fetch<any>('/api/classes/book', {
      method: 'POST',
      body: { ...form, class_id: props.classItem.id },
    })
    checkoutUrl.value = data.checkout_url
    submitted.value = true
  } catch (e: any) {
    error.value = e.data?.message || 'Booking failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
