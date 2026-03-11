<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <p class="font-sans text-cream-200/40 text-sm">Manage</p>
        <h1 class="font-serif text-cream-100 text-2xl">Cooking Classes</h1>
      </div>
      <button @click="openForm()" class="btn-gold text-sm">+ New Class</button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-3">
      <div v-for="i in 4" :key="i" class="h-20 bg-charcoal-800 animate-pulse border border-charcoal-700" />
    </div>

    <!-- Classes list -->
    <div v-else-if="classes.length" class="space-y-4">
      <div
        v-for="cls in classes"
        :key="cls.id"
        class="bg-charcoal-800 border border-charcoal-700 p-6 hover:border-gold/30 transition-colors duration-200"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-3 mb-2">
              <h3 class="font-serif text-cream-100 text-lg">{{ cls.title }}</h3>
              <span class="tag-gold text-xs">{{ cls.level }}</span>
              <span
                class="font-sans text-xs px-2 py-0.5 border"
                :class="cls.is_published ? 'text-emerald-400 border-emerald-500/20 bg-emerald-900/20' : 'text-cream-200/40 border-charcoal-600'"
              >{{ cls.is_published ? 'Published' : 'Draft' }}</span>
            </div>
            <p class="font-sans text-cream-200/60 text-sm mb-3 line-clamp-2">{{ cls.description }}</p>
            <div class="flex flex-wrap gap-4 text-xs font-sans text-cream-200/40">
              <span>{{ formatDate(cls.schedule_date) }}</span>
              <span>₱{{ cls.price_php?.toLocaleString('en-PH') }}</span>
              <span>{{ cls.booked_slots }} / {{ cls.total_slots }} slots booked</span>
            </div>
          </div>
          <div class="flex gap-3 shrink-0">
            <button @click="openForm(cls)" class="font-sans text-xs text-gold hover:text-gold-light transition-colors uppercase tracking-widest">Edit</button>
            <button @click="togglePublish(cls)" class="font-sans text-xs text-cream-200/50 hover:text-cream-100 transition-colors uppercase tracking-widest">
              {{ cls.is_published ? 'Unpublish' : 'Publish' }}
            </button>
            <button @click="confirmDelete(cls)" class="font-sans text-xs text-red-400/50 hover:text-red-400 transition-colors uppercase tracking-widest">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-20 border border-charcoal-700">
      <p class="font-serif text-cream-200/30 text-2xl italic mb-4">No classes yet.</p>
      <button @click="openForm()" class="btn-gold text-sm">Create First Class</button>
    </div>

    <!-- Class form modal -->
    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" @click.self="showForm = false">
        <div class="absolute inset-0 bg-charcoal-950/90 backdrop-blur-sm" />
        <div class="relative bg-charcoal-900 border border-charcoal-700 w-full max-w-lg p-8 my-4">
          <button @click="showForm = false" class="absolute top-4 right-4 text-cream-200/40 hover:text-cream-100 text-xl">×</button>

          <p class="section-label mb-2">{{ editingClass ? 'Edit' : 'New' }} Class</p>
          <h2 class="font-serif text-cream-100 text-xl mb-6">{{ editingClass ? editingClass.title : 'Create Class' }}</h2>

          <form @submit.prevent="saveClass" class="space-y-4">
            <div>
              <label class="admin-label">Title *</label>
              <input v-model="form.title" type="text" required class="input-dark" placeholder="Class title" />
            </div>
            <div>
              <label class="admin-label">Description</label>
              <textarea v-model="form.description" rows="3" class="input-dark resize-none" placeholder="What students will learn…" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="admin-label">Level</label>
                <select v-model="form.level" class="input-dark">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label class="admin-label">Price (PHP) *</label>
                <input v-model.number="form.price_php" type="number" required min="0" class="input-dark" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="admin-label">Date & Time *</label>
                <input v-model="form.schedule_date" type="datetime-local" required class="input-dark" />
              </div>
              <div>
                <label class="admin-label">Total Slots</label>
                <input v-model.number="form.total_slots" type="number" min="1" class="input-dark" />
              </div>
            </div>
            <div>
              <label class="admin-label">Location</label>
              <input v-model="form.location" type="text" class="input-dark" placeholder="Venue name or online" />
            </div>
            <label class="flex items-center gap-3 cursor-pointer">
              <input v-model="form.is_published" type="checkbox" class="w-4 h-4 accent-gold" />
              <span class="font-sans text-sm text-cream-100">Publish immediately</span>
            </label>

            <div class="flex gap-3 pt-2">
              <button type="button" @click="showForm = false" class="btn-outline text-sm flex-1 justify-center">Cancel</button>
              <button type="submit" :disabled="saving" class="btn-gold text-sm flex-1 justify-center">
                {{ saving ? 'Saving…' : (editingClass ? 'Update' : 'Create Class') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete confirm -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="deleteTarget = null">
        <div class="absolute inset-0 bg-charcoal-950/90 backdrop-blur-sm" />
        <div class="relative bg-charcoal-900 border border-charcoal-700 w-full max-w-sm p-8 text-center">
          <p class="font-serif text-cream-100 text-xl mb-3">Delete Class?</p>
          <p class="font-sans text-cream-200/60 text-sm mb-6">"<span class="text-cream-100">{{ deleteTarget.title }}</span>" will be permanently removed.</p>
          <div class="flex gap-3 justify-center">
            <button @click="deleteTarget = null" class="btn-outline text-sm">Cancel</button>
            <button @click="deleteClass" :disabled="deleting" class="px-7 py-3.5 bg-red-600 hover:bg-red-500 text-white font-sans font-medium text-sm uppercase tracking-widest transition-colors">
              {{ deleting ? 'Deleting…' : 'Delete' }}
            </button>
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

const classes = ref<any[]>([])
const pending = ref(true)
const showForm = ref(false)
const editingClass = ref<any>(null)
const saving = ref(false)
const deleteTarget = ref<any>(null)
const deleting = ref(false)

const emptyForm = () => ({
  title: '', description: '', level: 'Beginner', price_php: 0,
  schedule_date: '', total_slots: 10, location: '', is_published: false
})

const form = reactive(emptyForm())

onMounted(async () => {
  const { data } = await supabase.from('classes').select('*').order('schedule_date', { ascending: true })
  classes.value = data || []
  pending.value = false
})

const openForm = (cls?: any) => {
  editingClass.value = cls || null
  if (cls) {
    Object.assign(form, {
      title: cls.title, description: cls.description, level: cls.level,
      price_php: cls.price_php, schedule_date: cls.schedule_date?.slice(0, 16),
      total_slots: cls.total_slots, location: cls.location, is_published: cls.is_published,
    })
  } else {
    Object.assign(form, emptyForm())
  }
  showForm.value = true
}

const saveClass = async () => {
  saving.value = true
  try {
    if (editingClass.value) {
      const { data, error } = await supabase.from('classes').update({ ...form }).eq('id', editingClass.value.id).select().single()
      if (error) throw error
      const idx = classes.value.findIndex(c => c.id === editingClass.value.id)
      if (idx !== -1) classes.value[idx] = data
      success('Class updated successfully.')
    } else {
      const { data, error } = await supabase.from('classes').insert({ ...form, booked_slots: 0 }).select().single()
      if (error) throw error
      classes.value.unshift(data)
      success('Class created successfully.')
    }
    showForm.value = false
  } catch (e: any) {
    toastError(e.message || 'Save failed.')
  } finally {
    saving.value = false
  }
}

const togglePublish = async (cls: any) => {
  const { error } = await supabase.from('classes').update({ is_published: !cls.is_published }).eq('id', cls.id)
  if (!error) {
    cls.is_published = !cls.is_published
    success(cls.is_published ? 'Class published.' : 'Class unpublished.')
  }
}

const confirmDelete = (cls: any) => { deleteTarget.value = cls }

const deleteClass = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  const { error } = await supabase.from('classes').delete().eq('id', deleteTarget.value.id)
  if (error) {
    toastError('Delete failed.')
  } else {
    classes.value = classes.value.filter(c => c.id !== deleteTarget.value.id)
    success(`"${deleteTarget.value.title}" deleted.`)
    deleteTarget.value = null
  }
  deleting.value = false
}

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-PH', { weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

useSeoMeta({ title: 'Classes — Admin · Sugar Momma' })
</script>

<style scoped>
.admin-label { @apply block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2; }
</style>
