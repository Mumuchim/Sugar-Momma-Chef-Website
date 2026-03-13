<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="font-serif text-cream-100 text-2xl">Themes & Packages</h2>
        <p class="font-sans text-cream-200/40 text-sm mt-1">Customers can select these when placing a custom order</p>
      </div>
      <button class="btn-gold text-sm" @click="openModal()">+ Add Theme</button>
    </div>

    <!-- Themes grid -->
    <div v-if="pending" class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="i in 6" :key="i" class="h-48 bg-charcoal-800 animate-pulse border border-charcoal-700" />
    </div>

    <div v-else-if="themes.length === 0" class="text-center py-20 border border-charcoal-700">
      <p class="font-serif text-cream-200/20 italic text-xl">No themes yet.</p>
      <p class="font-sans text-cream-200/30 text-sm mt-2">Create your first theme or package to display on the custom orders page.</p>
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="theme in themes"
        :key="theme.id"
        class="border border-charcoal-700 hover:border-charcoal-600 transition-colors relative overflow-hidden group"
      >
        <div v-if="theme.cover_url" class="h-32 overflow-hidden">
          <img :src="theme.cover_url" :alt="theme.name" class="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
        </div>
        <div v-else class="h-32 bg-charcoal-800 flex items-center justify-center">
          <span class="text-gold/20 text-4xl">🎂</span>
        </div>

        <div class="p-5">
          <div class="flex items-start justify-between gap-2 mb-2">
            <p class="font-serif text-cream-100">{{ theme.name }}</p>
            <span
              class="font-sans text-xs uppercase tracking-widest px-2 py-0.5 border shrink-0"
              :class="theme.is_published ? 'border-green-500/30 text-green-400/70' : 'border-charcoal-600 text-cream-200/30'"
            >
              {{ theme.is_published ? 'Live' : 'Draft' }}
            </span>
          </div>
          <p v-if="theme.description" class="font-sans text-cream-200/40 text-xs line-clamp-2 mb-3">{{ theme.description }}</p>

          <div class="flex items-center justify-between">
            <div>
              <span v-if="theme.is_fixed_price && theme.price_php" class="font-serif text-gold text-sm">
                ₱{{ formatPrice(theme.price_php) }}
              </span>
              <span v-else-if="theme.price_range_min" class="font-sans text-gold/70 text-xs">
                ₱{{ formatPrice(theme.price_range_min) }}{{ theme.price_range_max ? ' – ₱' + formatPrice(theme.price_range_max) : '+' }}
              </span>
              <span v-else class="font-sans text-cream-200/30 text-xs">Negotiable</span>
              <span
                class="ml-2 font-sans text-xs border px-1.5 py-0.5"
                :class="theme.is_fixed_price ? 'border-gold/20 text-gold/50' : 'border-charcoal-700 text-cream-200/30'"
              >
                {{ theme.is_fixed_price ? 'Fixed' : 'Negotiable' }}
              </span>
            </div>
            <div class="flex gap-3">
              <button class="font-sans text-xs text-cream-200/40 hover:text-gold transition-colors" @click="openModal(theme)">Edit</button>
              <button class="font-sans text-xs text-red-400/50 hover:text-red-400 transition-colors" @click="deleteTheme(theme.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm">
        <div class="bg-charcoal-900 border border-charcoal-700 w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-serif text-cream-100 text-xl">{{ editing ? 'Edit Theme' : 'New Theme' }}</h3>
            <button class="text-cream-200/40 hover:text-cream-100 transition-colors" @click="showModal = false">✕</button>
          </div>

          <form @submit.prevent="saveTheme" class="space-y-5">
            <div>
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Theme Name *</label>
              <input v-model="form.name" type="text" required class="input-dark" placeholder="e.g. Japanese Wagashi Set" />
            </div>
            <div>
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Description</label>
              <textarea v-model="form.description" rows="3" class="input-dark resize-none" placeholder="What's included, style, vibe…" />
            </div>
            <div>
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Cover Image</label>
              <div v-if="form.cover_url" class="mb-3">
                <img :src="form.cover_url" class="h-32 w-full object-cover border border-charcoal-700" />
              </div>
              <div class="flex gap-2">
                <AdminImageUpload
                  label=""
                  :current-url="form.cover_url"
                  bucket="theme-covers"
                  :path="`themes/${form.name?.toLowerCase().replace(/\s+/g, '-') || 'new'}`"
                  compact
                  @uploaded="form.cover_url = $event"
                />
                <span v-if="form.cover_url" class="font-sans text-xs text-emerald-400 self-center">✓ Uploaded</span>
              </div>
              <p class="font-sans text-cream-200/30 text-xs mt-2">Or paste a URL:</p>
              <input v-model="form.cover_url" type="url" class="input-dark mt-1" placeholder="https://…" />
            </div>

            <!-- Pricing type -->
            <div class="border border-charcoal-700 p-4 space-y-4">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" v-model="form.is_fixed_price" class="w-4 h-4 accent-gold" />
                <span class="font-sans text-sm text-cream-100">Fixed Price</span>
                <span class="font-sans text-xs text-cream-200/30">(uncheck for negotiable / price range)</span>
              </label>

              <div v-if="form.is_fixed_price">
                <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Price (₱) *</label>
                <input v-model.number="form.price_php" type="number" min="0" class="input-dark" />
              </div>

              <div v-else class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Min Price (₱)</label>
                  <input v-model.number="form.price_range_min" type="number" min="0" class="input-dark" placeholder="e.g. 3000" />
                </div>
                <div>
                  <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Max Price (₱)</label>
                  <input v-model.number="form.price_range_max" type="number" min="0" class="input-dark" placeholder="e.g. 8000" />
                </div>
              </div>
            </div>

            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" v-model="form.is_published" class="w-4 h-4 accent-gold" />
              <span class="font-sans text-sm text-cream-100">Publish (show on Custom Orders page)</span>
            </label>

            <div v-if="saveError" class="border border-red-500/30 bg-red-500/10 px-3 py-2">
              <p class="font-sans text-red-400 text-xs">{{ saveError }}</p>
            </div>

            <div class="flex gap-3 pt-2">
              <button type="submit" class="btn-gold flex-1 justify-center" :disabled="saving">
                {{ saving ? 'Saving…' : 'Save Theme' }}
              </button>
              <button type="button" class="btn-outline" @click="showModal = false">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const supabase = useSupabaseClient()

const themes = ref<any[]>([])
const pending = ref(true)
const showModal = ref(false)
const editing = ref<any>(null)
const saving = ref(false)
const saveError = ref('')

const blankForm = () => ({
  name: '', description: '', cover_url: '',
  is_fixed_price: false,
  price_php: 0,
  price_range_min: 0, price_range_max: 0,
  is_published: false,
})
const form = reactive(blankForm())

onMounted(async () => {
  const { data } = await supabase.from('themes').select('*').order('created_at', { ascending: false })
  themes.value = data || []
  pending.value = false
})

const openModal = (theme?: any) => {
  saveError.value = ''
  if (theme) {
    editing.value = theme
    Object.assign(form, { ...blankForm(), ...theme })
  } else {
    editing.value = null
    Object.assign(form, blankForm())
  }
  showModal.value = true
}

const saveTheme = async () => {
  saving.value = true
  saveError.value = ''
  const payload = { ...form }
  if (payload.is_fixed_price) {
    payload.price_range_min = 0
    payload.price_range_max = 0
  } else {
    payload.price_php = 0
  }
  try {
    if (editing.value) {
      const { error } = await supabase.from('themes').update(payload).eq('id', editing.value.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('themes').insert(payload)
      if (error) throw error
    }
    const { data } = await supabase.from('themes').select('*').order('created_at', { ascending: false })
    themes.value = data || []
    showModal.value = false
  } catch (e: any) {
    saveError.value = e.message || 'Failed to save theme.'
  } finally {
    saving.value = false
  }
}

const deleteTheme = async (id: string) => {
  if (!confirm('Delete this theme?')) return
  await supabase.from('themes').delete().eq('id', id)
  themes.value = themes.value.filter(t => t.id !== id)
}

const formatPrice = (price: number) => Number(price).toLocaleString('en-PH')
</script>
