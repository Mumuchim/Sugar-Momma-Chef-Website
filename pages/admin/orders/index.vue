<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <p class="font-sans text-cream-200/40 text-sm">Manage</p>
        <h1 class="font-serif text-cream-100 text-2xl">Custom Orders</h1>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="statusFilter" class="input-dark text-sm py-2 w-40">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="deposit_paid">Deposit Paid</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-20 bg-charcoal-800 animate-pulse border border-charcoal-700" />
    </div>

    <!-- Orders table -->
    <div v-else-if="filteredOrders.length" class="border border-charcoal-700 overflow-x-auto">
      <table class="w-full min-w-[700px]">
        <thead>
          <tr class="border-b border-charcoal-700 bg-charcoal-800">
            <th class="text-left px-6 py-3 font-sans text-xs text-cream-200/40 uppercase tracking-widest">Customer</th>
            <th class="text-left px-4 py-3 font-sans text-xs text-cream-200/40 uppercase tracking-widest">Occasion</th>
            <th class="text-left px-4 py-3 font-sans text-xs text-cream-200/40 uppercase tracking-widest">Event Date</th>
            <th class="text-left px-4 py-3 font-sans text-xs text-cream-200/40 uppercase tracking-widest">Status</th>
            <th class="text-right px-6 py-3 font-sans text-xs text-cream-200/40 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-charcoal-700">
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="hover:bg-charcoal-800/50 transition-colors duration-150 group cursor-pointer"
            @click="openOrder(order)"
          >
            <td class="px-6 py-4">
              <p class="font-sans text-cream-100 text-sm">{{ order.customer_name }}</p>
              <p class="font-sans text-cream-200/40 text-xs mt-0.5">{{ order.customer_email }}</p>
            </td>
            <td class="px-4 py-4">
              <span class="font-sans text-cream-200/60 text-sm">{{ order.occasion }}</span>
            </td>
            <td class="px-4 py-4">
              <span class="font-sans text-cream-200/60 text-sm">{{ formatDate(order.event_date) }}</span>
            </td>
            <td class="px-4 py-4">
              <span class="font-sans text-xs px-2.5 py-1 uppercase tracking-widest border" :class="statusClass(order.status)">
                {{ order.status?.replace('_', ' ') }}
              </span>
            </td>
            <td class="px-6 py-4 text-right" @click.stop>
              <select
                :value="order.status"
                @change="updateStatus(order, ($event.target as HTMLSelectElement).value)"
                class="font-sans text-xs bg-charcoal-700 border border-charcoal-600 text-cream-100 px-2 py-1 focus:outline-none focus:border-gold/60"
              >
                <option value="pending">Pending</option>
                <option value="deposit_paid">Deposit Paid</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-20 border border-charcoal-700">
      <p class="font-serif text-cream-200/30 text-2xl italic">No orders yet.</p>
    </div>

    <!-- Order detail modal -->
    <Teleport to="body">
      <div v-if="selectedOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="selectedOrder = null">
        <div class="absolute inset-0 bg-charcoal-950/90 backdrop-blur-sm" />
        <div class="relative bg-charcoal-900 border border-charcoal-700 w-full max-w-lg p-8">
          <button @click="selectedOrder = null" class="absolute top-4 right-4 text-cream-200/40 hover:text-cream-100 text-xl">×</button>

          <p class="section-label mb-2">Order Details</p>
          <h2 class="font-serif text-cream-100 text-2xl mb-6">{{ selectedOrder.customer_name }}</h2>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-1">Email</p>
                <p class="font-sans text-cream-100 text-sm">{{ selectedOrder.customer_email }}</p>
              </div>
              <div>
                <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-1">Phone</p>
                <p class="font-sans text-cream-100 text-sm">{{ selectedOrder.customer_phone || '—' }}</p>
              </div>
              <div>
                <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-1">Occasion</p>
                <p class="font-sans text-cream-100 text-sm">{{ selectedOrder.occasion }}</p>
              </div>
              <div>
                <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-1">Event Date</p>
                <p class="font-sans text-cream-100 text-sm">{{ formatDate(selectedOrder.event_date) }}</p>
              </div>
            </div>
            <div>
              <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-1">Notes / Vision</p>
              <p class="font-sans text-cream-200/70 text-sm leading-relaxed bg-charcoal-800 border border-charcoal-700 p-4">{{ selectedOrder.notes }}</p>
            </div>
            <div>
              <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-2">Update Status</p>
              <select
                v-model="selectedOrder.status"
                @change="updateStatus(selectedOrder, selectedOrder.status)"
                class="input-dark text-sm"
              >
                <option value="pending">Pending</option>
                <option value="deposit_paid">Deposit Paid</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const supabase = useSupabaseClient()
const { success, error: toastError } = useToast()

const orders = ref<any[]>([])
const pending = ref(true)
const statusFilter = ref('')
const selectedOrder = ref<any>(null)

const filteredOrders = computed(() =>
  statusFilter.value ? orders.value.filter(o => o.status === statusFilter.value) : orders.value
)

onMounted(async () => {
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  orders.value = data || []
  pending.value = false
})

const openOrder = (order: any) => {
  selectedOrder.value = { ...order }
}

const updateStatus = async (order: any, newStatus: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', order.id)
  if (error) {
    toastError('Failed to update status.')
  } else {
    const idx = orders.value.findIndex(o => o.id === order.id)
    if (idx !== -1) orders.value[idx].status = newStatus
    success(`Status updated to "${newStatus.replace('_', ' ')}".`)
  }
}

const statusClass = (status: string) => ({
  'bg-amber-900/30 text-amber-400 border-amber-500/20': status === 'pending',
  'bg-blue-900/30 text-blue-400 border-blue-500/20': status === 'deposit_paid',
  'bg-purple-900/30 text-purple-400 border-purple-500/20': status === 'in_progress',
  'bg-emerald-900/30 text-emerald-400 border-emerald-500/20': status === 'completed',
  'bg-red-900/30 text-red-400 border-red-500/20': status === 'cancelled',
})

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

useSeoMeta({ title: 'Orders — Admin · Sugar Momma' })
</script>
