<template>
  <div>
    <UiPageHero
      label="Bespoke Creations"
      title="Custom Orders"
      subtitle="Tell us your vision — we'll get back to you within 24 hours to discuss details."
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
            <p class="section-label mb-3">Good to Know</p>
            <p class="font-sans text-cream-200/60 text-sm leading-relaxed">
              A 50% deposit is required once we've confirmed your order. The balance is due on delivery or pickup.
              No payment is needed to submit your inquiry.
            </p>
          </div>
        </div>

        <!-- Form column -->
        <div class="lg:col-span-3">

          <!-- Success state -->
          <div v-if="submitted" class="text-center py-16 border border-charcoal-700 px-8">
            <div class="w-16 h-16 border border-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-gold text-2xl">✓</span>
            </div>
            <h3 class="font-serif text-cream-100 text-2xl mb-3">Inquiry Received!</h3>
            <p class="font-sans text-cream-200/60 leading-relaxed max-w-sm mx-auto">
              We'll review your brief and reach out within 24 hours to discuss your order and finalize the details.
            </p>
          </div>

          <form v-else @submit.prevent="submitOrder" class="space-y-8">

            <!-- Theme picker -->
            <div>
              <div class="flex items-center gap-3 mb-4">
                <p class="section-label">Start From a Theme</p>
                <span class="font-sans text-xs text-cream-200/30 uppercase tracking-widest">(Optional)</span>
              </div>

              <div v-if="themesLoading" class="grid sm:grid-cols-2 gap-3">
                <div v-for="i in 4" :key="i" class="h-28 bg-charcoal-800 animate-pulse border border-charcoal-700" />
              </div>

              <div v-else-if="themes.length" class="grid sm:grid-cols-2 gap-3">
                <button
                  v-for="theme in themes"
                  :key="theme.id"
                  type="button"
                  @click="toggleTheme(theme)"
                  class="relative text-left border p-4 transition-all duration-200 overflow-hidden group"
                  :class="selectedTheme?.id === theme.id ? 'border-gold bg-gold/5' : 'border-charcoal-700 hover:border-charcoal-500'"
                >
                  <div v-if="theme.cover_url" class="absolute inset-0">
                    <img :src="theme.cover_url" :alt="theme.name" class="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
                    <div class="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 to-charcoal-950/50" />
                  </div>
                  <div class="relative">
                    <div class="flex items-start justify-between gap-2 mb-1">
                      <p class="font-serif text-cream-100 text-sm leading-snug">{{ theme.name }}</p>
                      <span v-if="theme.is_fixed_price && theme.price_php" class="font-serif text-gold text-sm shrink-0">
                        ₱{{ formatPrice(theme.price_php) }}
                      </span>
                      <span v-else-if="theme.price_range_min" class="font-sans text-gold/70 text-xs shrink-0 mt-0.5">
                        ₱{{ formatPrice(theme.price_range_min) }}+
                      </span>
                    </div>
                    <p v-if="theme.description" class="font-sans text-cream-200/40 text-xs leading-relaxed line-clamp-2">{{ theme.description }}</p>
                    <span v-if="theme.is_fixed_price" class="inline-block mt-2 font-sans text-xs text-gold/60 uppercase tracking-widest border border-gold/20 px-1.5 py-0.5">Fixed Price</span>
                    <span v-else class="inline-block mt-2 font-sans text-xs text-cream-200/30 uppercase tracking-widest border border-charcoal-700 px-1.5 py-0.5">Negotiable</span>
                  </div>
                  <div v-if="selectedTheme?.id === theme.id" class="absolute top-2 right-2 w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                    <span class="text-charcoal-950 text-xs font-bold">✓</span>
                  </div>
                </button>
              </div>

              <p v-if="themes.length === 0 && !themesLoading" class="font-sans text-cream-200/30 text-sm italic">
                No themes available yet — just describe your vision below.
              </p>
              <p v-if="selectedTheme" class="font-sans text-xs text-gold/70 mt-3">
                Theme selected — notes pre-filled as a starting point. Feel free to customise.
              </p>
            </div>

            <div class="gold-divider" />

            <!-- Contact details -->
            <div class="space-y-4">
              <p class="section-label">Your Details</p>
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
            </div>

            <!-- Event details -->
            <div class="space-y-4">
              <p class="section-label">Event Details</p>
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
                <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Your Vision & Notes *</label>
                <textarea
                  v-model="form.notes"
                  required
                  rows="5"
                  class="input-dark resize-none"
                  placeholder="Describe what you have in mind — flavors, design, number of guests, dietary restrictions, budget range, etc."
                />
              </div>
            </div>

            <div v-if="error" class="border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p class="font-sans text-red-400 text-sm">{{ error }}</p>
            </div>

            <button type="submit" class="btn-gold w-full justify-center" :disabled="loading">
              {{ loading ? 'Sending…' : 'Submit Order' }}
            </button>

            <p class="font-sans text-cream-200/30 text-xs text-center">
              No payment required now — we'll contact you to discuss details first.
            </p>
          </form>
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
const themes = ref<any[]>([])
const themesLoading = ref(true)
const selectedTheme = ref<any>(null)

const minDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const howItWorks = [
  { title: 'Submit your brief', desc: 'Fill in your vision, occasion, and date. No payment needed.' },
  { title: 'We get in touch', desc: "We'll reach out within 24h to discuss your order and confirm details." },
  { title: 'Pay a 50% deposit', desc: "Once agreed, we'll send you a payment link to secure your slot." },
  { title: 'Collect your creation', desc: 'Pick up or have it delivered on your event date.' },
]

onMounted(async () => {
  try {
    const data = await $fetch<any[]>('/api/themes')
    themes.value = data || []
  } catch (e) {
    // themes optional, fail silently
  } finally {
    themesLoading.value = false
  }
})

const toggleTheme = (theme: any) => {
  if (selectedTheme.value?.id === theme.id) {
    selectedTheme.value = null
    form.notes = ''
  } else {
    selectedTheme.value = theme
    form.notes = `Theme: ${theme.name}\n\n${theme.description ? theme.description + '\n\n' : ''}(Add your customisations here — portions, flavours, design preferences, etc.)`
  }
}

const submitOrder = async () => {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/orders/create', {
      method: 'POST',
      body: {
        ...form,
        theme_id: selectedTheme.value?.id || null,
        theme_name: selectedTheme.value?.name || null,
      },
    })
    submitted.value = true
  } catch (e: any) {
    error.value = e.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

const formatPrice = (price: number) => Number(price).toLocaleString('en-PH')

useSeoMeta({ title: 'Custom Orders — Sugar Momma' })
</script>
