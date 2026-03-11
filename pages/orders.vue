<template>
  <div>
    <PageHero
      label="Bespoke Creations"
      title="Custom Orders"
      subtitle="Commission a one-of-a-kind pastry for your most special occasions."
    />

    <section class="py-20 container mx-auto px-6 lg:px-16 max-w-4xl">
      <div class="grid lg:grid-cols-5 gap-16">
        <!-- Info column -->
        <div class="lg:col-span-2 space-y-8">
          <div>
            <p class="section-label">How It Works</p>
            <div class="space-y-6">
              <div v-for="(step, i) in howItWorks" :key="i" class="flex gap-4">
                <span class="font-serif text-gold text-2xl leading-none shrink-0">{{ String(i+1).padStart(2,'0') }}</span>
                <div>
                  <p class="font-sans text-cream-100 font-medium text-sm">{{ step.title }}</p>
                  <p class="font-sans text-cream-200/60 text-sm mt-1">{{ step.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="border border-charcoal-700 p-6">
            <p class="section-label mb-3">Deposit Note</p>
            <p class="font-sans text-cream-200/60 text-sm leading-relaxed">
              A 50% deposit is required to confirm your order. The balance is due upon delivery or pickup.
            </p>
          </div>
        </div>

        <!-- Form column -->
        <div class="lg:col-span-3">
          <form v-if="!submitted" @submit.prevent="submitOrder" class="space-y-6">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Full Name *</label>
                <input v-model="form.customer_name" type="text" required class="input-dark" placeholder="Your full name" />
              </div>
              <div>
                <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Email *</label>
                <input v-model="form.customer_email" type="email" required class="input-dark" placeholder="you@email.com" />
              </div>
            </div>

            <div>
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Phone</label>
              <input v-model="form.customer_phone" type="tel" class="input-dark" placeholder="+63 9XX XXX XXXX" />
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Occasion *</label>
                <select v-model="form.occasion" required class="input-dark">
                  <option value="">Select an occasion</option>
                  <option>Wedding</option>
                  <option>Birthday</option>
                  <option>Anniversary</option>
                  <option>Corporate Event</option>
                  <option>Holiday</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Event Date *</label>
                <input v-model="form.event_date" type="date" required class="input-dark" :min="minDate" />
              </div>
            </div>

            <div>
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Order Details & Notes *</label>
              <textarea
                v-model="form.notes"
                required
                rows="5"
                class="input-dark resize-none"
                placeholder="Describe your vision — flavors, design, allergens, portions, dietary restrictions, etc."
              />
            </div>

            <div v-if="error" class="border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p class="font-sans text-red-400 text-sm">{{ error }}</p>
            </div>

            <button type="submit" class="btn-gold w-full justify-center" :disabled="loading">
              {{ loading ? 'Processing…' : 'Submit Order & Pay Deposit' }}
            </button>
          </form>

          <!-- Success state -->
          <div v-else class="text-center py-16 border border-charcoal-700 px-8">
            <div class="w-16 h-16 border border-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-gold text-2xl">✓</span>
            </div>
            <h3 class="font-serif text-cream-100 text-2xl mb-3">Order Received</h3>
            <p class="font-sans text-cream-200/60 leading-relaxed mb-6">
              You'll be redirected to the payment portal. Once your deposit is confirmed, we'll be in touch within 24 hours.
            </p>
            <a v-if="checkoutUrl" :href="checkoutUrl" class="btn-gold">Proceed to Payment</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  occasion: '',
  event_date: '',
  notes: '',
})

const loading = ref(false)
const error = ref('')
const submitted = ref(false)
const checkoutUrl = ref('')

const minDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const howItWorks = [
  { title: 'Submit your brief', desc: 'Fill in your vision, occasion, and date below.' },
  { title: 'Pay a 50% deposit', desc: 'Secure your slot via GCash, PayMaya, or card.' },
  { title: 'Design consultation', desc: 'We\'ll reach out within 24h to finalize details.' },
  { title: 'Collect your creation', desc: 'Pick up or have it delivered on your event date.' },
]

const submitOrder = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await $fetch('/api/orders/create', {
      method: 'POST',
      body: { ...form, deposit_amount: 1500 }, // Default deposit
    })
    checkoutUrl.value = data.checkout_url
    submitted.value = true
    // Optionally auto-redirect
    // window.location.href = data.checkout_url
  } catch (e: any) {
    error.value = e.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

useSeoMeta({ title: 'Custom Orders — Sugar Momma' })
</script>
