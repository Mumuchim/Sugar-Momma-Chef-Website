<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="font-serif text-cream-100 text-2xl">Shop Orders</h2>
        <p class="font-sans text-cream-200/40 text-sm mt-1">All product orders from the shop</p>
      </div>
      <!-- Status filter -->
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="s in statuses"
          :key="s.value"
          @click="filterStatus = s.value"
          class="font-sans text-xs uppercase tracking-widest px-3 py-1.5 border transition-all duration-200"
          :class="filterStatus === s.value
            ? 'border-gold text-gold bg-gold/10'
            : 'border-charcoal-700 text-cream-200/40 hover:border-charcoal-500'"
        >
          {{ s.label }}
        </button>
      </div>
    </div>

    <div class="border border-charcoal-700 overflow-x-auto">
      <table class="w-full min-w-[780px]">
        <thead>
          <tr class="border-b border-charcoal-700 bg-charcoal-900/50">
            <th class="text-left font-sans text-xs text-cream-200/40 uppercase tracking-widest px-6 py-4">Customer</th>
            <th class="text-left font-sans text-xs text-cream-200/40 uppercase tracking-widest px-6 py-4">Product</th>
            <th class="text-left font-sans text-xs text-cream-200/40 uppercase tracking-widest px-6 py-4">Qty</th>
            <th class="text-left font-sans text-xs text-cream-200/40 uppercase tracking-widest px-6 py-4">Payment</th>
            <th class="text-left font-sans text-xs text-cream-200/40 uppercase tracking-widest px-6 py-4">Fulfillment</th>
            <th class="text-left font-sans text-xs text-cream-200/40 uppercase tracking-widest px-6 py-4">Total</th>
            <th class="text-left font-sans text-xs text-cream-200/40 uppercase tracking-widest px-6 py-4">Date</th>
            <th class="text-left font-sans text-xs text-cream-200/40 uppercase tracking-widest px-6 py-4">Status</th>
            <th class="px-6 py-4" />
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td colspan="7" class="text-center py-12">
              <p class="font-sans text-cream-200/30 text-sm">Loading…</p>
            </td>
          </tr>
          <tr v-else-if="filteredOrders.length === 0">
            <td colspan="7" class="text-center py-12">
              <p class="font-serif text-cream-200/20 italic">No orders found.</p>
            </td>
          </tr>
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="border-b border-charcoal-800 hover:bg-charcoal-800/30 transition-colors"
          >
            <td class="px-6 py-4">
              <p class="font-sans text-cream-100 text-sm">{{ order.customer_name }}</p>
              <p class="font-sans text-cream-200/30 text-xs">{{ order.customer_email }}</p>
              <p v-if="order.customer_phone" class="font-sans text-cream-200/30 text-xs">{{ order.customer_phone }}</p>
            </td>
            <td class="px-6 py-4">
              <p class="font-sans text-cream-100 text-sm">{{ order.product_name }}</p>
              <span v-if="order.is_bundle" class="font-sans text-xs text-gold/70">Bundle</span>
            </td>
            <td class="px-6 py-4 font-sans text-cream-200/70 text-sm">
              {{ order.quantity ?? 1 }}
            </td>
            <td class="px-6 py-4">
              <span
                class="font-sans text-xs uppercase tracking-widest px-2.5 py-1 border"
                :class="order.payment_method === 'cod'
                  ? 'border-emerald-500/30 text-emerald-400/70 bg-emerald-500/5'
                  : 'border-blue-500/30 text-blue-400/70 bg-blue-500/5'"
              >
                {{ order.payment_method === 'cod' ? 'COD' : 'Online' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <p class="font-sans text-cream-200/60 text-sm capitalize">{{ order.fulfillment_type }}</p>
              <p v-if="order.delivery_address" class="font-sans text-cream-200/30 text-xs mt-0.5 max-w-[160px] truncate" :title="order.delivery_address">
                {{ order.delivery_address }}
              </p>
            </td>
            <td class="px-6 py-4 font-serif text-gold text-sm">₱{{ formatPrice(order.total_php) }}</td>
            <td class="px-6 py-4 font-sans text-cream-200/50 text-xs">{{ formatDate(order.created_at) }}</td>
            <td class="px-6 py-4">
              <select
                :value="order.status"
                @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value)"
                class="font-sans text-xs bg-charcoal-800 border border-charcoal-600 text-cream-200/80 px-2 py-1.5 focus:border-gold focus:outline-none"
              >
                <option v-for="s in statuses.filter(s => s.value !== 'all')" :key="s.value" :value="s.value">
                  {{ s.label }}
                </option>
              </select>
            </td>
            <td class="px-6 py-4">
              <button
                v-if="order.notes"
                class="font-sans text-xs text-cream-200/30 hover:text-cream-200 transition-colors"
                @click="viewNotes(order)"
                title="View notes"
              >
                📋
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Notes modal -->
    <Teleport to="body">
      <div v-if="notesOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm" @click.self="notesOrder = null">
        <div class="bg-charcoal-900 border border-charcoal-700 w-full max-w-md p-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-serif text-cream-100 text-lg">Order Notes</h3>
            <button class="text-cream-200/40 hover:text-cream-100" @click="notesOrder = null">✕</button>
          </div>
          <p class="font-sans text-cream-200/60 text-sm leading-relaxed">{{ notesOrder.notes }}</p>
          <p class="font-sans text-cream-200/30 text-xs mt-4">— {{ notesOrder.customer_name }}</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const supabase = useSupabaseClient()

const orders = ref<any[]>([])
const pending = ref(true)
const filterStatus = ref('all')
const notesOrder = ref<any>(null)

const statuses = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready', value: 'ready' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

onMounted(async () => {
  const { data } = await supabase
    .from('shop_orders')
    .select('*')
    .order('created_at', { ascending: false })
  orders.value = data || []
  pending.value = false
})

const filteredOrders = computed(() =>
  filterStatus.value === 'all'
    ? orders.value
    : orders.value.filter(o => o.status === filterStatus.value)
)

const updateStatus = async (id: string, status: string) => {
  await supabase.from('shop_orders').update({ status }).eq('id', id)
  const order = orders.value.find(o => o.id === id)
  if (order) order.status = status
}

const viewNotes = (order: any) => { notesOrder.value = order }
const formatPrice = (price: number) => Number(price).toLocaleString('en-PH')
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
</script>
