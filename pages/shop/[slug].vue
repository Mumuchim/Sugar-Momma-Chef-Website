<template>
  <div>
    <!-- Loading -->
    <div v-if="pending" class="min-h-screen flex items-center justify-center">
      <UiLoadingSpinner />
    </div>

    <!-- Not found -->
    <div v-else-if="!product" class="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <p class="font-serif text-cream-200/30 text-4xl italic mb-4">Product not found.</p>
        <NuxtLink to="/shop" class="btn-outline">Back to Shop</NuxtLink>
      </div>
    </div>

    <template v-else>
      <!-- Breadcrumb -->
      <div class="container mx-auto px-6 lg:px-16 max-w-7xl pt-8">
        <NuxtLink to="/shop" class="font-sans text-xs text-cream-200/40 hover:text-gold uppercase tracking-widest inline-flex items-center gap-2 transition-colors">
          ← Shop
        </NuxtLink>
      </div>

      <!-- Product Section -->
      <section class="py-12 container mx-auto px-6 lg:px-16 max-w-7xl">
        <div class="grid lg:grid-cols-2 gap-16 items-start">

          <!-- Image -->
          <div class="relative">
            <div class="aspect-square overflow-hidden bg-charcoal-900 border border-charcoal-700">
              <img
                v-if="product.image_url"
                :src="product.image_url"
                :alt="product.name"
                class="w-full h-full object-cover opacity-90"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="text-gold/20 text-8xl">🍰</span>
              </div>
            </div>
            <!-- Bundle badge -->
            <div v-if="product.is_bundle" class="absolute top-4 left-4">
              <span class="bg-gold text-charcoal-950 font-sans text-xs font-semibold uppercase tracking-widest px-3 py-1.5">
                Bundle Available
              </span>
            </div>
          </div>

          <!-- Info + Order panel -->
          <div class="lg:sticky lg:top-28">
            <p v-if="product.category" class="section-label mb-2">{{ product.category }}</p>
            <h1 class="font-serif text-cream-100 text-4xl leading-tight mb-4">{{ product.name }}</h1>

            <p v-if="product.description" class="font-sans text-cream-200/60 leading-relaxed mb-8">
              {{ product.description }}
            </p>

            <div class="gold-divider" />

            <!-- Pricing options -->
            <div class="space-y-3 mb-8">
              <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-3">Choose an option</p>

              <!-- Single / per piece -->
              <label
                class="flex items-center justify-between border p-4 cursor-pointer transition-all duration-200"
                :class="selectedOption === 'single'
                  ? 'border-gold bg-gold/5'
                  : 'border-charcoal-700 hover:border-charcoal-500'"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                    :class="selectedOption === 'single' ? 'border-gold' : 'border-charcoal-600'"
                  >
                    <div v-if="selectedOption === 'single'" class="w-2 h-2 rounded-full bg-gold" />
                  </div>
                  <div>
                    <p class="font-sans text-cream-100 text-sm font-medium">{{ product.single_label || 'Per piece' }}</p>
                    <p v-if="product.single_description" class="font-sans text-cream-200/40 text-xs mt-0.5">{{ product.single_description }}</p>
                  </div>
                </div>
                <p class="font-serif text-gold text-lg">₱{{ formatPrice(product.price_php) }}</p>
                <input type="radio" v-model="selectedOption" value="single" class="sr-only" />
              </label>

              <!-- Bundle option (if available) -->
              <label
                v-if="product.is_bundle && product.bundle_price_php"
                class="flex items-center justify-between border p-4 cursor-pointer transition-all duration-200"
                :class="selectedOption === 'bundle'
                  ? 'border-gold bg-gold/5'
                  : 'border-charcoal-700 hover:border-charcoal-500'"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                    :class="selectedOption === 'bundle' ? 'border-gold' : 'border-charcoal-600'"
                  >
                    <div v-if="selectedOption === 'bundle'" class="w-2 h-2 rounded-full bg-gold" />
                  </div>
                  <div>
                    <p class="font-sans text-cream-100 text-sm font-medium">{{ product.bundle_label || 'Bundle' }}</p>
                    <p v-if="product.bundle_description" class="font-sans text-cream-200/40 text-xs mt-0.5">{{ product.bundle_description }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-serif text-gold text-lg">₱{{ formatPrice(product.bundle_price_php) }}</p>
                  <p v-if="savings > 0" class="font-sans text-green-400/70 text-xs mt-0.5">Save ₱{{ formatPrice(savings) }}</p>
                </div>
                <input type="radio" v-model="selectedOption" value="bundle" class="sr-only" />
              </label>
            </div>

            <!-- Fulfillment type -->
            <div class="mb-8">
              <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-3">Fulfillment</p>
              <div class="grid grid-cols-2 gap-3">
                <label
                  class="flex items-center gap-3 border p-4 cursor-pointer transition-all duration-200"
                  :class="fulfillment === 'pickup'
                    ? 'border-gold bg-gold/5'
                    : 'border-charcoal-700 hover:border-charcoal-500'"
                >
                  <div
                    class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    :class="fulfillment === 'pickup' ? 'border-gold' : 'border-charcoal-600'"
                  >
                    <div v-if="fulfillment === 'pickup'" class="w-2 h-2 rounded-full bg-gold" />
                  </div>
                  <div>
                    <p class="font-sans text-cream-100 text-sm">Pickup</p>
                    <p class="font-sans text-cream-200/40 text-xs">Rizal, PH</p>
                  </div>
                  <input type="radio" v-model="fulfillment" value="pickup" class="sr-only" />
                </label>

                <label
                  class="flex items-center gap-3 border p-4 cursor-pointer transition-all duration-200"
                  :class="fulfillment === 'delivery'
                    ? 'border-gold bg-gold/5'
                    : 'border-charcoal-700 hover:border-charcoal-500'"
                >
                  <div
                    class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    :class="fulfillment === 'delivery' ? 'border-gold' : 'border-charcoal-600'"
                  >
                    <div v-if="fulfillment === 'delivery'" class="w-2 h-2 rounded-full bg-gold" />
                  </div>
                  <div>
                    <p class="font-sans text-cream-100 text-sm">Delivery</p>
                    <p class="font-sans text-cream-200/40 text-xs">Fee at checkout</p>
                  </div>
                  <input type="radio" v-model="fulfillment" value="delivery" class="sr-only" />
                </label>
              </div>
            </div>

            <!-- Delivery address (only if delivery) -->
            <div v-if="fulfillment === 'delivery'" class="mb-6">
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Delivery Address *</label>
              <textarea
                v-model="form.delivery_address"
                rows="2"
                class="input-dark resize-none"
                placeholder="Street, barangay, city, province"
              />
            </div>

            <!-- Customer details -->
            <div class="space-y-4 mb-6">
              <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest">Your Details</p>
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
              <div>
                <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Notes (optional)</label>
                <textarea v-model="form.notes" rows="2" class="input-dark resize-none" placeholder="Allergies, special requests, preferred pickup date…" />
              </div>
            </div>

            <!-- Quantity -->
            <div class="mb-6">
              <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-3">Quantity</p>
              <div class="flex items-center gap-4">
                <button
                  @click="decrementQty"
                  class="w-10 h-10 border border-charcoal-600 text-cream-100 hover:border-gold transition-colors text-lg"
                  :disabled="quantity <= 1"
                >−</button>
                <span class="font-serif text-2xl text-cream-100 w-10 text-center">{{ quantity }}</span>
                <button
                  @click="incrementQty"
                  class="w-10 h-10 border border-charcoal-600 text-cream-100 hover:border-gold transition-colors text-lg"
                  :disabled="quantity >= 99"
                >+</button>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="mb-8">
              <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-3">Payment Method</p>
              <div class="space-y-3">
                <!-- Online payment (always available) -->
                <label
                  class="flex items-center gap-3 border p-4 cursor-pointer transition-all duration-200"
                  :class="paymentMethod === 'online' ? 'border-gold bg-gold/5' : 'border-charcoal-700 hover:border-charcoal-500'"
                >
                  <div
                    class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    :class="paymentMethod === 'online' ? 'border-gold' : 'border-charcoal-600'"
                  >
                    <div v-if="paymentMethod === 'online'" class="w-2 h-2 rounded-full bg-gold" />
                  </div>
                  <div class="flex-1">
                    <p class="font-sans text-cream-100 text-sm">Pay Online</p>
                    <p class="font-sans text-cream-200/40 text-xs">GCash, Card, PayMaya, BillEase</p>
                  </div>
                  <input type="radio" v-model="paymentMethod" value="online" class="sr-only" />
                </label>

                <!-- COD (only if product allows it) -->
                <label
                  v-if="product.allows_cod"
                  class="flex items-center gap-3 border p-4 cursor-pointer transition-all duration-200"
                  :class="paymentMethod === 'cod' ? 'border-gold bg-gold/5' : 'border-charcoal-700 hover:border-charcoal-500'"
                >
                  <div
                    class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    :class="paymentMethod === 'cod' ? 'border-gold' : 'border-charcoal-600'"
                  >
                    <div v-if="paymentMethod === 'cod'" class="w-2 h-2 rounded-full bg-gold" />
                  </div>
                  <div class="flex-1">
                    <p class="font-sans text-cream-100 text-sm">Cash on Delivery</p>
                    <p class="font-sans text-cream-200/40 text-xs">Pay when you receive your order</p>
                  </div>
                  <input type="radio" v-model="paymentMethod" value="cod" class="sr-only" />
                </label>
              </div>
            </div>

            <!-- Error -->
            <div v-if="errorMsg" class="border border-red-500/30 bg-red-500/10 px-3 py-2 mb-4">
              <p class="font-sans text-red-400 text-xs">{{ errorMsg }}</p>
            </div>

            <!-- Total + CTA -->
            <div class="border border-charcoal-700 p-5 mb-5">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-sans text-cream-200/60 text-sm">Total</p>
                  <p v-if="quantity > 1" class="font-sans text-cream-200/30 text-xs mt-0.5">
                    ₱{{ formatPrice(currentPrice) }} × {{ quantity }}
                  </p>
                </div>
                <p class="font-serif text-gold text-2xl">₱{{ formatPrice(totalPrice) }}</p>
              </div>
              <p v-if="selectedOption === 'bundle'" class="font-sans text-cream-200/30 text-xs mt-1 text-right">
                {{ product.bundle_label }}
              </p>
            </div>

            <button
              class="btn-gold w-full justify-center"
              :disabled="loading || !form.customer_name || !form.customer_email"
              @click="checkout"
            >
              {{ loading ? 'Processing…' : 'Checkout' }}
            </button>

            <p class="font-sans text-cream-200/30 text-xs text-center mt-4">
              <span v-if="paymentMethod === 'cod'">Cash on Delivery · Pay upon receipt</span>
              <span v-else>Secured by PayMongo · GCash, Card, PayMaya</span>
            </p>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const product = ref<any>(null)
const pending = ref(true)
const loading = ref(false)
const errorMsg = ref('')

const selectedOption = ref<'single' | 'bundle'>('single')
const fulfillment = ref<'pickup' | 'delivery'>('pickup')
const quantity = ref(1)
const paymentMethod = ref<'online' | 'cod'>('online')

const form = reactive({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  delivery_address: '',
  notes: '',
})

onMounted(async () => {
  try {
    const data = await $fetch<any[]>('/api/products')
    product.value = (data || []).find((p: any) => p.slug === route.params.slug) || null
    if (product.value?.is_bundle && product.value?.bundle_price_php) {
      selectedOption.value = 'bundle' // default to bundle if available
    }
  } catch (e) {
    console.error('Failed to load product:', e)
  } finally {
    pending.value = false
  }
})

const currentPrice = computed(() => {
  if (selectedOption.value === 'bundle' && product.value?.bundle_price_php) {
    return product.value.bundle_price_php
  }
  return product.value?.price_php || 0
})

const totalPrice = computed(() => currentPrice.value * quantity.value)

const savings = computed(() => {
  if (!product.value?.is_bundle || !product.value?.bundle_price_php) return 0
  return product.value.price_php - product.value.bundle_price_php
})

const incrementQty = () => { if (quantity.value < 99) quantity.value++ }
const decrementQty = () => { if (quantity.value > 1) quantity.value-- }

const formatPrice = (price: number) => price.toLocaleString('en-PH')

const checkout = async () => {
  if (!product.value) return
  if (!form.customer_name || !form.customer_email.includes('@')) {
    errorMsg.value = 'Please fill in your name and a valid email.'
    return
  }
  if (fulfillment.value === 'delivery' && !form.delivery_address.trim()) {
    errorMsg.value = 'Please enter your delivery address.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const { data } = await $fetch<any>('/api/shop/checkout', {
      method: 'POST',
      body: {
        product_id: product.value.id,
        product_name: product.value.name,
        is_bundle: selectedOption.value === 'bundle',
        unit_price_php: currentPrice.value,
        quantity: quantity.value,
        payment_method: paymentMethod.value,
        fulfillment_type: fulfillment.value,
        ...form,
      },
    })
    window.location.href = data.checkout_url
  } catch (e: any) {
    errorMsg.value = e.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

useSeoMeta({
  title: computed(() => product.value ? `${product.value.name} — Sugar Momma Shop` : 'Shop — Sugar Momma'),
})
</script>
