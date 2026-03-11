<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <p class="font-sans text-cream-200/40 text-sm">Inbox</p>
        <h1 class="font-serif text-cream-100 text-2xl">Messages</h1>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="unreadCount" class="tag-gold text-xs">{{ unreadCount }} unread</span>
        <button @click="markAllRead" class="font-sans text-xs text-cream-200/40 hover:text-gold transition-colors uppercase tracking-widest">
          Mark all read
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-20 bg-charcoal-800 animate-pulse border border-charcoal-700" />
    </div>

    <!-- Messages list -->
    <div v-else-if="messages.length" class="space-y-2">
      <div
        v-for="msg in messages"
        :key="msg.id"
        @click="openMessage(msg)"
        class="border p-5 cursor-pointer transition-all duration-200 group"
        :class="msg.is_read
          ? 'bg-charcoal-800/40 border-charcoal-700 hover:border-gold/30'
          : 'bg-charcoal-800 border-charcoal-600 hover:border-gold/50'"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <!-- Unread dot -->
            <div class="mt-1.5 w-2 h-2 rounded-full shrink-0" :class="msg.is_read ? 'bg-transparent' : 'bg-gold'" />
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-3 mb-1">
                <p class="font-sans text-cream-100 text-sm" :class="msg.is_read ? 'font-normal' : 'font-medium'">{{ msg.name }}</p>
                <p class="font-sans text-cream-200/40 text-xs">{{ msg.email }}</p>
              </div>
              <p v-if="msg.subject" class="font-sans text-cream-200/70 text-sm mb-1">{{ msg.subject }}</p>
              <p class="font-sans text-cream-200/50 text-xs line-clamp-1">{{ msg.message }}</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2 shrink-0">
            <span class="font-sans text-xs text-cream-200/30">{{ timeAgo(msg.created_at) }}</span>
            <button
              @click.stop="deleteMessage(msg)"
              class="font-sans text-xs text-red-400/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 uppercase tracking-widest"
            >Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-20 border border-charcoal-700">
      <p class="font-serif text-cream-200/30 text-2xl italic">No messages yet.</p>
    </div>

    <!-- Message detail modal -->
    <Teleport to="body">
      <div v-if="selectedMessage" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="selectedMessage = null">
        <div class="absolute inset-0 bg-charcoal-950/90 backdrop-blur-sm" />
        <div class="relative bg-charcoal-900 border border-charcoal-700 w-full max-w-lg p-8">
          <button @click="selectedMessage = null" class="absolute top-4 right-4 text-cream-200/40 hover:text-cream-100 text-xl">×</button>

          <p class="section-label mb-2">Message</p>
          <h2 class="font-serif text-cream-100 text-xl mb-1">{{ selectedMessage.name }}</h2>
          <a :href="`mailto:${selectedMessage.email}`" class="font-sans text-gold text-sm hover:text-gold-light transition-colors block mb-6">
            {{ selectedMessage.email }}
          </a>

          <div v-if="selectedMessage.subject" class="mb-4">
            <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-1">Subject</p>
            <p class="font-sans text-cream-100 text-sm">{{ selectedMessage.subject }}</p>
          </div>

          <div class="mb-6">
            <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-2">Message</p>
            <p class="font-sans text-cream-200/80 text-sm leading-relaxed bg-charcoal-800 border border-charcoal-700 p-4 whitespace-pre-wrap">{{ selectedMessage.message }}</p>
          </div>

          <div class="flex gap-3">
            <a :href="`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`" class="btn-gold text-sm">
              Reply via Email
            </a>
            <button @click="selectedMessage = null" class="btn-outline text-sm">Close</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const supabase = useSupabaseClient()
const { success } = useToast()

const messages = ref<any[]>([])
const pending = ref(true)
const selectedMessage = ref<any>(null)

const unreadCount = computed(() => messages.value.filter(m => !m.is_read).length)

onMounted(async () => {
  const { data } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  messages.value = data || []
  pending.value = false
})

const openMessage = async (msg: any) => {
  selectedMessage.value = msg
  if (!msg.is_read) {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', msg.id)
    msg.is_read = true
  }
}

const markAllRead = async () => {
  await supabase.from('contact_messages').update({ is_read: true }).eq('is_read', false)
  messages.value.forEach(m => m.is_read = true)
  success('All messages marked as read.')
}

const deleteMessage = async (msg: any) => {
  await supabase.from('contact_messages').delete().eq('id', msg.id)
  messages.value = messages.value.filter(m => m.id !== msg.id)
}

const timeAgo = (dateStr: string) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}

useSeoMeta({ title: 'Messages — Admin · Sugar Momma' })
</script>
