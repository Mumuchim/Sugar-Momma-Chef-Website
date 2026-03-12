<template>
  <div class="max-w-4xl">
    <!-- Breadcrumb + Back -->
    <div class="flex items-center gap-2 text-xs font-sans text-cream-200/40 mb-6">
      <NuxtLink to="/admin/recipes" class="hover:text-gold transition-colors flex items-center gap-1.5 uppercase tracking-widest">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Recipes
      </NuxtLink>
      <span class="text-cream-200/20">/</span>
      <span class="text-cream-200/60">{{ isEditing ? 'Edit Recipe' : 'New Recipe' }}</span>
    </div>

    <div class="flex items-center justify-between mb-8">
      <div>
        <p class="font-sans text-cream-200/40 text-sm">{{ isEditing ? 'Editing' : 'Creating new' }}</p>
        <h1 class="font-serif text-cream-100 text-2xl">{{ form.title || 'Untitled Recipe' }}</h1>
      </div>
      <div class="flex gap-3">
        <button @click="save(false)" class="btn-outline text-sm" :disabled="saving">Save Draft</button>
        <button @click="save(true)" class="btn-gold text-sm" :disabled="saving">
          {{ saving ? 'Saving…' : 'Publish' }}
        </button>
      </div>
    </div>

    <div class="space-y-8">
      <!-- ── BASIC INFO ─────────────────────────────────── -->
      <AdminSection title="Basic Info">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="admin-label">Title *</label>
            <input v-model="form.title" type="text" class="input-dark" placeholder="Recipe title" @input="autoSlug" />
          </div>
          <div>
            <label class="admin-label">Slug</label>
            <input v-model="form.slug" type="text" class="input-dark" placeholder="auto-generated" />
          </div>
        </div>
        <div>
          <label class="admin-label">Subtitle</label>
          <input v-model="form.subtitle" type="text" class="input-dark" placeholder="Short tagline" />
        </div>
        <div>
          <label class="admin-label">Story / Introduction</label>
          <textarea v-model="form.story" rows="5" class="input-dark resize-none" placeholder="The narrative behind this recipe…" />
        </div>
        <div>
          <label class="admin-label">Video URL (YouTube/Vimeo)</label>
          <input v-model="form.video_url" type="url" class="input-dark" placeholder="https://youtube.com/watch?v=..." />
        </div>
      </AdminSection>

      <!-- ── METADATA ─────────────────────────────────── -->
      <AdminSection title="Metadata">
        <div class="grid sm:grid-cols-3 gap-4">
          <div>
            <label class="admin-label">Category</label>
            <select v-model="form.category" class="input-dark">
              <option>pastry</option><option>bread</option><option>cakes</option>
              <option>japanese</option><option>plated-desserts</option>
            </select>
          </div>
          <div>
            <label class="admin-label">Difficulty</label>
            <select v-model="form.difficulty" class="input-dark">
              <option>beginner</option><option>intermediate</option><option>advanced</option>
            </select>
          </div>
          <div>
            <label class="admin-label">Base Servings</label>
            <input v-model.number="form.base_servings" type="number" min="1" class="input-dark" />
          </div>
          <div>
            <label class="admin-label">Prep Time (mins)</label>
            <input v-model.number="form.prep_time_mins" type="number" min="0" class="input-dark" />
          </div>
          <div>
            <label class="admin-label">Cook Time (mins)</label>
            <input v-model.number="form.cook_time_mins" type="number" min="0" class="input-dark" />
          </div>
        </div>
        <div class="flex gap-6 pt-2">
          <label class="flex items-center gap-3 cursor-pointer">
            <input v-model="form.is_premium" type="checkbox" class="w-4 h-4 accent-gold" />
            <span class="font-sans text-sm text-cream-100">Premium recipe</span>
          </label>
          <div v-if="form.is_premium" class="flex-1">
            <select v-model="form.collection_id" class="input-dark text-sm">
              <option value="">Select collection…</option>
              <option v-for="col in collections" :key="col.id" :value="col.id">{{ col.title }}</option>
            </select>
          </div>
        </div>
      </AdminSection>

      <!-- ── IMAGES ──────────────────────────────────── -->
      <AdminSection title="Images">
        <div class="grid sm:grid-cols-2 gap-6">
          <AdminImageUpload
            label="Banner Image (Full-width)"
            :current-url="form.banner_url"
            bucket="recipe-media"
            :path="`banners/${form.slug || 'draft'}`"
            @uploaded="form.banner_url = $event"
          />
          <AdminImageUpload
            label="Thumbnail"
            :current-url="form.thumbnail_url"
            bucket="recipe-media"
            :path="`thumbnails/${form.slug || 'draft'}`"
            @uploaded="form.thumbnail_url = $event"
          />
        </div>
      </AdminSection>

      <!-- ── INGREDIENTS ────────────────────────────── -->
      <AdminSection title="Ingredients">
        <div class="space-y-2">
          <div
            v-for="(ing, i) in ingredients"
            :key="i"
            class="flex gap-2 items-center"
          >
            <input v-model="ing.quantity" type="number" step="0.1" class="input-dark w-20 shrink-0" placeholder="Qty" />
            <input v-model="ing.unit" type="text" class="input-dark w-24 shrink-0" placeholder="Unit" />
            <input v-model="ing.name" type="text" class="input-dark flex-1" placeholder="Ingredient name" />
            <input v-model="ing.notes" type="text" class="input-dark w-32 shrink-0 text-xs" placeholder="Notes" />
            <button @click="removeIngredient(i)" class="text-cream-200/30 hover:text-red-400 transition-colors px-2 text-lg shrink-0">×</button>
          </div>
        </div>
        <button @click="addIngredient" class="mt-3 font-sans text-sm text-gold hover:text-gold-light transition-colors">
          + Add Ingredient
        </button>
      </AdminSection>

      <!-- ── INSTRUCTIONS ───────────────────────────── -->
      <AdminSection title="Instructions">
        <div class="space-y-4">
          <div
            v-for="(step, i) in instructions"
            :key="i"
            class="border border-charcoal-700 p-4"
          >
            <div class="flex items-start gap-3">
              <span class="font-serif text-2xl text-gold shrink-0 w-8">{{ i + 1 }}</span>
              <div class="flex-1 space-y-3">
                <textarea
                  v-model="step.body"
                  rows="3"
                  class="input-dark resize-none w-full"
                  :placeholder="`Step ${i + 1} description…`"
                />
                <AdminImageUpload
                  label="Step photo (optional)"
                  :current-url="step.photo_url"
                  bucket="step-photos"
                  :path="`steps/${form.slug || 'draft'}/step-${i+1}`"
                  @uploaded="step.photo_url = $event"
                  compact
                />
              </div>
              <button @click="removeInstruction(i)" class="text-cream-200/30 hover:text-red-400 transition-colors px-1 shrink-0 text-lg">×</button>
            </div>
          </div>
        </div>
        <button @click="addInstruction" class="mt-3 font-sans text-sm text-gold hover:text-gold-light transition-colors">
          + Add Step
        </button>
      </AdminSection>

      <!-- Save error/success feedback -->
      <div v-if="saveError" class="border border-red-500/30 bg-red-500/10 px-4 py-3">
        <p class="font-sans text-red-400 text-sm">{{ saveError }}</p>
      </div>
      <div v-if="saveSuccess" class="border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
        <p class="font-sans text-emerald-400 text-sm">✓ Recipe saved successfully!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const { success, error: toastError } = useToast()
const isEditing = computed(() => !!route.query.id)

// Form state
const form = reactive({
  id: undefined as string | undefined,
  title: '',
  slug: '',
  subtitle: '',
  story: '',
  video_url: '',
  banner_url: '',
  thumbnail_url: '',
  category: 'pastry',
  difficulty: 'intermediate',
  base_servings: 4,
  prep_time_mins: undefined as number | undefined,
  cook_time_mins: undefined as number | undefined,
  is_published: false,
  is_premium: false,
  collection_id: '',
})

const ingredients = ref([{ quantity: null, unit: '', name: '', notes: '' }])
const instructions = ref([{ body: '', photo_url: '' }])
const collections = ref<any[]>([])
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)

const autoSlug = () => {
  if (!isEditing.value) {
    form.slug = form.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
}

const addIngredient = () => ingredients.value.push({ quantity: null, unit: '', name: '', notes: '' })
const removeIngredient = (i: number) => ingredients.value.splice(i, 1)
const addInstruction = () => instructions.value.push({ body: '', photo_url: '' })
const removeInstruction = (i: number) => instructions.value.splice(i, 1)

const save = async (publish: boolean) => {
  saving.value = true
  saveError.value = ''
  saveSuccess.value = false

  try {
    await $fetch('/api/admin/recipes', {
      method: 'POST',
      body: {
        recipe: { ...form, is_published: publish },
        ingredients: ingredients.value.filter((i) => i.name),
        instructions: instructions.value.filter((s) => s.body),
      },
    })
    saveSuccess.value = true
    success(publish ? 'Recipe published successfully!' : 'Draft saved successfully.')
    setTimeout(() => { saveSuccess.value = false }, 4000)
    if (publish && !isEditing.value) {
      setTimeout(() => router.push('/admin/recipes'), 1500)
    }
  } catch (e: any) {
    saveError.value = e.data?.message || 'Save failed.'
    toastError(e.data?.message || 'Save failed. Please try again.')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  const { data } = await supabase.from('collections').select('id, title').eq('is_published', true)
  collections.value = data || []

  if (route.query.id) {
    const { data: existing } = await supabase
      .from('recipes')
      .select('*, ingredients(*), instructions(*)')
      .eq('id', route.query.id)
      .single()
    if (existing) {
      Object.assign(form, existing)
      ingredients.value = existing.ingredients || []
      instructions.value = existing.instructions || []
    }
  }
})
</script>

<style>
.admin-label { @apply block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2; }
</style>
