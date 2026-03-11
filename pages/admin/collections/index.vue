<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <p class="font-sans text-cream-200/40 text-sm">Manage</p>
        <h1 class="font-serif text-cream-100 text-2xl">Collections</h1>
      </div>
      <button @click="openForm()" class="btn-gold text-sm">+ New Collection</button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="grid md:grid-cols-2 gap-4">
      <div v-for="i in 4" :key="i" class="h-40 bg-charcoal-800 animate-pulse border border-charcoal-700" />
    </div>

    <!-- Grid -->
    <div v-else-if="collections.length" class="grid md:grid-cols-2 gap-4">
      <div
        v-for="col in collections"
        :key="col.id"
        class="bg-charcoal-800 border border-charcoal-700 overflow-hidden hover:border-gold/30 transition-colors duration-200 group"
      >
        <!-- Cover image -->
        <div class="aspect-[16/7] bg-charcoal-700 relative overflow-hidden">
          <img
            v-if="col.cover_url"
            :src="col.cover_url"
            :alt="col.title"
            class="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-charcoal-900 to-transparent" />
          <div class="absolute bottom-4 left-4">
            <p class="font-serif text-cream-100 text-lg">{{ col.title }}</p>
            <p class="font-sans text-gold text-xs mt-0.5">₱{{ col.price_php?.toLocaleString('en-PH') }}</p>
          </div>
          <span
            class="absolute top-3 right-3 font-sans text-xs px-2 py-0.5 border"
            :class="col.is_published ? 'text-emerald-400 border-emerald-500/20 bg-emerald-900/30' : 'text-cream-200/40 border-charcoal-600 bg-charcoal-800'"
          >{{ col.is_published ? 'Live' : 'Draft' }}</span>
        </div>

        <!-- Meta -->
        <div class="p-5">
          <p class="font-sans text-cream-200/60 text-sm line-clamp-2 mb-4">{{ col.tagline }}</p>
          <div class="flex items-center justify-between">
            <span class="font-sans text-xs text-cream-200/30">{{ col.recipe_count || 0 }} recipes</span>
            <div class="flex gap-4">
              <button @click="openForm(col)" class="font-sans text-xs text-gold hover:text-gold-light transition-colors uppercase tracking-widest">Edit</button>
              <button @click="togglePublish(col)" class="font-sans text-xs text-cream-200/50 hover:text-cream-100 transition-colors uppercase tracking-widest">
                {{ col.is_published ? 'Unpublish' : 'Publish' }}
              </button>
              <button @click="confirmDelete(col)" class="font-sans text-xs text-red-400/50 hover:text-red-400 transition-colors uppercase tracking-widest">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-20 border border-charcoal-700">
      <p class="font-serif text-cream-200/30 text-2xl italic mb-4">No collections yet.</p>
      <button @click="openForm()" class="btn-gold text-sm">Create First Collection</button>
    </div>

    <!-- Form modal -->
    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" @click.self="showForm = false">
        <div class="absolute inset-0 bg-charcoal-950/90 backdrop-blur-sm" />
        <div class="relative bg-charcoal-900 border border-charcoal-700 w-full max-w-lg p-8 my-4">
          <button @click="showForm = false" class="absolute top-4 right-4 text-cream-200/40 hover:text-cream-100 text-xl">×</button>

          <p class="section-label mb-2">{{ editingCollection ? 'Edit' : 'New' }} Collection</p>
          <h2 class="font-serif text-cream-100 text-xl mb-6">{{ editingCollection ? editingCollection.title : 'Create Collection' }}</h2>

          <form @submit.prevent="saveCollection" class="space-y-4">
            <div>
              <label class="admin-label">Title *</label>
              <input v-model="form.title" type="text" required class="input-dark" placeholder="Collection title" />
            </div>
            <div>
              <label class="admin-label">Tagline</label>
              <input v-model="form.tagline" type="text" class="input-dark" placeholder="Short description shown in the card" />
            </div>
            <div>
              <label class="admin-label">Description</label>
              <textarea v-model="form.description" rows="3" class="input-dark resize-none" />
            </div>
            <div>
              <label class="admin-label">Cover Image URL</label>
              <input v-model="form.cover_url" type="url" class="input-dark" placeholder="https://…" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="admin-label">Price (PHP) *</label>
                <input v-model.number="form.price_php" type="number" required min="0" class="input-dark" />
              </div>
              <div>
                <label class="admin-label">Slug</label>
                <input v-model="form.slug" type="text" class="input-dark" placeholder="auto-generated" />
              </div>
            </div>
            <label class="flex items-center gap-3 cursor-pointer">
              <input v-model="form.is_published" type="checkbox" class="w-4 h-4 accent-gold" />
              <span class="font-sans text-sm text-cream-100">Publish immediately</span>
            </label>

            <div class="flex gap-3 pt-2">
              <button type="button" @click="showForm = false" class="btn-outline text-sm flex-1 justify-center">Cancel</button>
              <button type="submit" :disabled="saving" class="btn-gold text-sm flex-1 justify-center">
                {{ saving ? 'Saving…' : (editingCollection ? 'Update' : 'Create') }}
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
          <p class="font-serif text-cream-100 text-xl mb-3">Delete Collection?</p>
          <p class="font-sans text-cream-200/60 text-sm mb-6">"<span class="text-cream-100">{{ deleteTarget.title }}</span>" will be permanently removed.</p>
          <div class="flex gap-3 justify-center">
            <button @click="deleteTarget = null" class="btn-outline text-sm">Cancel</button>
            <button @click="deleteCollection" :disabled="deleting" class="px-7 py-3.5 bg-red-600 hover:bg-red-500 text-white font-sans font-medium text-sm uppercase tracking-widest transition-colors">
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

const collections = ref<any[]>([])
const pending = ref(true)
const showForm = ref(false)
const editingCollection = ref<any>(null)
const saving = ref(false)
const deleteTarget = ref<any>(null)
const deleting = ref(false)

const emptyForm = () => ({
  title: '', tagline: '', description: '', cover_url: '',
  price_php: 0, slug: '', is_published: false,
})

const form = reactive(emptyForm())

onMounted(async () => {
  const { data } = await supabase
    .from('collections')
    .select('*, recipe_count:recipes(count)')
    .order('created_at', { ascending: false })
  collections.value = (data || []).map(c => ({
    ...c,
    recipe_count: c.recipe_count?.[0]?.count ?? 0,
  }))
  pending.value = false
})

const openForm = (col?: any) => {
  editingCollection.value = col || null
  if (col) {
    Object.assign(form, {
      title: col.title, tagline: col.tagline, description: col.description,
      cover_url: col.cover_url, price_php: col.price_php,
      slug: col.slug, is_published: col.is_published,
    })
  } else {
    Object.assign(form, emptyForm())
  }
  showForm.value = true
}

const saveCollection = async () => {
  saving.value = true
  const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
  try {
    if (editingCollection.value) {
      const { data, error } = await supabase.from('collections').update({ ...form, slug }).eq('id', editingCollection.value.id).select().single()
      if (error) throw error
      const idx = collections.value.findIndex(c => c.id === editingCollection.value.id)
      if (idx !== -1) collections.value[idx] = { ...data, recipe_count: collections.value[idx].recipe_count }
      success('Collection updated.')
    } else {
      const { data, error } = await supabase.from('collections').insert({ ...form, slug }).select().single()
      if (error) throw error
      collections.value.unshift({ ...data, recipe_count: 0 })
      success('Collection created.')
    }
    showForm.value = false
  } catch (e: any) {
    toastError(e.message || 'Save failed.')
  } finally {
    saving.value = false
  }
}

const togglePublish = async (col: any) => {
  const { error } = await supabase.from('collections').update({ is_published: !col.is_published }).eq('id', col.id)
  if (!error) {
    col.is_published = !col.is_published
    success(col.is_published ? 'Collection published.' : 'Collection unpublished.')
  }
}

const confirmDelete = (col: any) => { deleteTarget.value = col }

const deleteCollection = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  const { error } = await supabase.from('collections').delete().eq('id', deleteTarget.value.id)
  if (error) {
    toastError('Delete failed.')
  } else {
    collections.value = collections.value.filter(c => c.id !== deleteTarget.value.id)
    success(`"${deleteTarget.value.title}" deleted.`)
    deleteTarget.value = null
  }
  deleting.value = false
}

useSeoMeta({ title: 'Collections — Admin · Sugar Momma' })
</script>

<style scoped>
.admin-label { @apply block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2; }
</style>
