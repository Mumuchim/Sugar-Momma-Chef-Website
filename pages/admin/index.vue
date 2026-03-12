<template>
  <div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <AdminStatCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Recent Orders -->
      <div class="bg-charcoal-800 border border-charcoal-700 p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-serif text-cream-100 text-xl">Recent Orders</h2>
          <NuxtLink to="/admin/orders" class="font-sans text-xs text-gold">View all →</NuxtLink>
        </div>
        <div v-if="recentOrders.length" class="space-y-3">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="flex items-center justify-between py-3 border-b border-charcoal-700 last:border-0"
          >
            <div>
              <p class="font-sans text-cream-100 text-sm">{{ order.customer_name }}</p>
              <p class="font-sans text-cream-200/40 text-xs">{{ order.occasion }} · {{ formatDate(order.event_date) }}</p>
            </div>
            <span
              class="text-xs font-sans px-2 py-1"
              :class="{
                'bg-amber-900/40 text-amber-400': order.status === 'pending',
                'bg-emerald-900/40 text-emerald-400': order.status === 'deposit_paid',
                'bg-blue-900/40 text-blue-400': order.status === 'in_progress',
              }"
            >{{ order.status }}</span>
          </div>
        </div>
        <p v-else class="font-sans text-cream-200/40 text-sm">No orders yet.</p>
      </div>

      <!-- Quick Actions -->
      <div class="bg-charcoal-800 border border-charcoal-700 p-6">
        <h2 class="font-serif text-cream-100 text-xl mb-6">Quick Actions</h2>
        <div class="grid grid-cols-2 gap-3">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.to"
            :to="action.to"
            class="border border-charcoal-600 hover:border-gold p-4 transition-all duration-200 group"
          >
            <p class="font-sans text-2xl mb-2">{{ action.icon }}</p>
            <p class="font-sans text-cream-100 text-sm group-hover:text-gold transition-colors">{{ action.label }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const supabase = useSupabaseClient()

const recentOrders = ref<any[]>([])

const stats = ref([
  { label: 'Recipes', value: '—', icon: '📖' },
  { label: 'Orders', value: '—', icon: '📦' },
  { label: 'Classes', value: '—', icon: '🍳' },
  { label: 'Subscribers', value: '—', icon: '✉️' },
])

const quickActions = [
  { to: '/admin/recipes/new', label: 'New Recipe', icon: '✍️' },
  { to: '/admin/collections', label: 'Collections', icon: '📚' },
  { to: '/admin/orders', label: 'View Orders', icon: '📦' },
  { to: '/admin/classes', label: 'Manage Classes', icon: '🗓' },
]

onMounted(async () => {
  const [recipeCount, orderCount, orderData, classCount, subCount] = await Promise.all([
    supabase.from('recipes').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id,customer_name,occasion,event_date,status').order('created_at', { ascending: false }).limit(5),
    supabase.from('classes').select('id', { count: 'exact', head: true }),
    supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
  ])

  stats.value[0].value = String(recipeCount.count || 0)
  stats.value[1].value = String(orderCount.count || 0)
  stats.value[2].value = String(classCount.count || 0)
  stats.value[3].value = String(subCount.count || 0)

  recentOrders.value = orderData.data || []
})

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }) : '—'
</script>
