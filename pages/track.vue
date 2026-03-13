<template>
  <div>
    <UiPageHero
      label="After Your Purchase"
      title="Track My Order"
      subtitle="Enter the email you used when ordering to see your order status."
    />

    <section class="py-20 container mx-auto px-6 lg:px-16 max-w-2xl">

      <!-- Search form -->
      <div class="border border-charcoal-700 p-8 mb-10">
        <p class="section-label mb-6">Look Up Your Order</p>
        <div class="space-y-4">
          <div>
            <label class="block font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-2">Email Address</label>
            <input
              v-model="emailInput"
              type="email"
              placeholder="you@email.com"
              class="input-dark w-full"
              @keydown.enter="search"
            />
          </div>
          <div>
            <label class="block font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-2">Order Reference Token</label>
            <input
              v-model="tokenInput"
              type="text"
              placeholder="Shown on your payment confirmation page"
              class="input-dark w-full font-mono"
              @keydown.enter="search"
            />
          </div>
          <button class="btn-gold w-full justify-center" :disabled="loading" @click="search">
            {{ loading ? '…' : 'Track Order' }}
          </button>
        </div>
        <p v-if="errorMsg" class="font-sans text-red-400 text-xs mt-3">{{ errorMsg }}</p>
      </div>

      <!-- Results -->
      <div v-if="searched">
        <div v-if="orders.length === 0" class="text-center py-16">
          <p class="font-serif text-cream-200/30 text-2xl italic mb-2">No orders found.</p>
          <p class="font-sans text-cream-200/30 text-sm">
            Double-check the email you used at checkout, or
            <NuxtLink to="/contact" class="text-gold hover:text-gold-light transition-colors">contact us</NuxtLink>
            for help.
          </p>
        </div>

        <div v-else class="space-y-5">
          <p class="font-sans text-cream-200/40 text-xs uppercase tracking-widest mb-6">
            {{ orders.length }} order{{ orders.length > 1 ? 's' : '' }} found
          </p>

          <div
            v-for="order in orders"
            :key="order.id"
            class="border border-charcoal-700 hover:border-charcoal-600 transition-colors p-6"
          >
            <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <p class="font-serif text-cream-100 text-lg">{{ order.product_name }}</p>
                <p class="font-sans text-cream-200/40 text-xs mt-1 uppercase tracking-widest">
                  {{ order.is_bundle ? 'Bundle' : 'Per piece' }} ·
                  {{ order.fulfillment_type === 'pickup' ? 'Pickup' : 'Delivery' }}
                </p>
              </div>
              <span
                class="font-sans text-xs uppercase tracking-widest px-3 py-1.5 border"
                :class="statusStyle(order.status)"
              >
                {{ statusLabel(order.status) }}
              </span>
            </div>

            <div class="gold-divider" />

            <div class="grid sm:grid-cols-2 gap-3 mt-4 font-sans text-sm">
              <div>
                <p class="text-cream-200/30 text-xs uppercase tracking-widest mb-1">Order Date</p>
                <p class="text-cream-200/70">{{ formatDate(order.created_at) }}</p>
              </div>
              <div>
                <p class="text-cream-200/30 text-xs uppercase tracking-widest mb-1">Amount Paid</p>
                <p class="text-gold font-serif text-lg">₱{{ formatPrice(order.total_php) }}</p>
              </div>
              <div v-if="order.fulfillment_type === 'delivery' && order.delivery_address">
                <p class="text-cream-200/30 text-xs uppercase tracking-widest mb-1">Delivery Address</p>
                <p class="text-cream-200/70">{{ order.delivery_address }}</p>
              </div>
              <div v-if="order.notes">
                <p class="text-cream-200/30 text-xs uppercase tracking-widest mb-1">Notes</p>
                <p class="text-cream-200/70">{{ order.notes }}</p>
              </div>
            </div>
          </div>

          <div class="pt-4 text-center">
            <p class="font-sans text-cream-200/30 text-xs">
              Questions about your order?
              <NuxtLink to="/contact" class="text-gold hover:text-gold-light transition-colors ml-1">
                Contact us →
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>

<script setup lang="ts">
const emailInput = ref('')
const tokenInput = ref('')
const loading = ref(false)
const errorMsg = ref('')
const searched = ref(false)
const orders = ref<any[]>([])

const search = async () => {
  if (!emailInput.value.includes('@')) {
    errorMsg.value = 'Please enter a valid email address.'
    return
  }
  if (!tokenInput.value.trim()) {
    errorMsg.value = 'Please enter your order reference token.'
    return
  }
  loading.value = true
  errorMsg.value = ''
  searched.value = false
  try {
    const data = await $fetch<any[]>('/api/track', {
      query: {
        email: emailInput.value.toLowerCase(),
        lookup_token: tokenInput.value.trim(),
      },
    })
    orders.value = data || []
    searched.value = true
  } catch (e: any) {
    errorMsg.value = e.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Pending Payment',
    paid: 'Paid — Being Prepared',
    preparing: 'In the Kitchen',
    ready: 'Ready for Pickup / Delivery',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return map[status] || status
}

const statusStyle = (status: string) => {
  const map: Record<string, string> = {
    pending: 'border-yellow-600/40 text-yellow-500/80 bg-yellow-500/5',
    paid: 'border-blue-500/40 text-blue-400/80 bg-blue-500/5',
    preparing: 'border-gold/40 text-gold bg-gold/5',
    ready: 'border-green-500/40 text-green-400/80 bg-green-500/5',
    completed: 'border-charcoal-600 text-cream-200/40',
    cancelled: 'border-red-500/30 text-red-400/70',
  }
  return map[status] || 'border-charcoal-700 text-cream-200/50'
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })

const formatPrice = (price: number) => Number(price).toLocaleString('en-PH')

useSeoMeta({ title: 'Track My Order — Sugar Momma' })
</script>
