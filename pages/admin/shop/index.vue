<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="font-serif text-cream-100 text-2xl">Shop Products</h2>
        <p class="font-sans text-cream-200/40 text-sm mt-1">Manage your baked goods listing</p>
      </div>
      <button class="btn-gold text-sm" @click="openModal()">+ Add Product</button>
    </div>

    <!-- Products table -->
    <div class="border border-charcoal-700 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-charcoal-700 bg-charcoal-900/50">
            <th class="text-left font-sans text-xs text-cream-200/40 uppercase tracking-widest px-6 py-4">Product</th>
            <th class="text-left font-sans text-xs text-cream-200/40 uppercase tracking-widest px-6 py-4">Category</th>
            <th class="text-left font-sans text-xs text-cream-200/40 uppercase tracking-widest px-6 py-4">Price</th>
            <th class="text-left font-sans text-xs text-cream-200/40 uppercase tracking-widest px-6 py-4">Bundle</th>
            <th class="text-left font-sans text-xs text-cream-200/40 uppercase tracking-widest px-6 py-4">COD</th>
            <th class="text-left font-sans text-xs text-cream-200/40 uppercase tracking-widest px-6 py-4">Status</th>
            <th class="px-6 py-4" />
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td colspan="6" class="text-center py-12">
              <p class="font-sans text-cream-200/30 text-sm">Loading…</p>
            </td>
          </tr>
          <tr v-else-if="products.length === 0">
            <td colspan="6" class="text-center py-12">
              <p class="font-serif text-cream-200/20 italic">No products yet. Add your first one!</p>
            </td>
          </tr>
          <tr
            v-for="product in products"
            :key="product.id"
            class="border-b border-charcoal-800 hover:bg-charcoal-800/30 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-charcoal-700 overflow-hidden shrink-0">
                  <img v-if="product.image_url" :src="product.image_url" :alt="product.name" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gold/30 text-sm">🍰</div>
                </div>
                <div>
                  <p class="font-sans text-cream-100 text-sm">{{ product.name }}</p>
                  <p class="font-sans text-cream-200/30 text-xs">/shop/{{ product.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 font-sans text-cream-200/60 text-sm capitalize">{{ product.category || '—' }}</td>
            <td class="px-6 py-4 font-serif text-gold text-sm">₱{{ formatPrice(product.price_php) }}</td>
            <td class="px-6 py-4">
              <span v-if="product.is_bundle" class="font-sans text-xs bg-gold/10 border border-gold/30 text-gold px-2 py-0.5">
                ₱{{ formatPrice(product.bundle_price_php) }}
              </span>
              <span v-else class="text-cream-200/20 text-xs">—</span>
            </td>
            <td class="px-6 py-4">
              <span
                class="font-sans text-xs uppercase tracking-widest px-2.5 py-1 border"
                :class="product.allows_cod ? 'border-emerald-500/30 text-emerald-400/70' : 'border-charcoal-600 text-cream-200/20'"
              >
                {{ product.allows_cod ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span
                class="font-sans text-xs uppercase tracking-widest px-2.5 py-1 border"
                :class="product.is_published ? 'border-green-500/30 text-green-400/70' : 'border-charcoal-600 text-cream-200/30'"
              >
                {{ product.is_published ? 'Live' : 'Draft' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3 justify-end">
                <button class="font-sans text-xs text-cream-200/40 hover:text-gold transition-colors" @click="openModal(product)">Edit</button>
                <button class="font-sans text-xs text-red-400/50 hover:text-red-400 transition-colors" @click="deleteProduct(product.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/80 backdrop-blur-sm">
        <div class="bg-charcoal-900 border border-charcoal-700 w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-serif text-cream-100 text-xl">{{ editingProduct ? 'Edit Product' : 'New Product' }}</h3>
            <button class="text-cream-200/40 hover:text-cream-100 transition-colors" @click="showModal = false">✕</button>
          </div>

          <form @submit.prevent="saveProduct" class="space-y-5">
            <div>
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Product Name *</label>
              <input v-model="form.name" type="text" required class="input-dark" placeholder="e.g. Matcha Mille Crêpe" />
            </div>
            <div>
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Slug *</label>
              <input v-model="form.slug" type="text" required class="input-dark" placeholder="matcha-mille-crepe" />
            </div>
            <div>
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Short Description</label>
              <input v-model="form.short_description" type="text" class="input-dark" placeholder="One-liner shown on the shop grid" />
            </div>
            <div>
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Full Description</label>
              <textarea v-model="form.description" rows="3" class="input-dark resize-none" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Price (₱) *</label>
                <input v-model.number="form.price_php" type="number" required min="1" class="input-dark" />
              </div>
              <div>
                <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Category</label>
                <select v-model="form.category" class="input-dark">
                  <option value="">None</option>
                  <option>cakes</option>
                  <option>pastries</option>
                  <option>cookies</option>
                  <option>bread</option>
                  <option>seasonal</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Product Image</label>
              <div v-if="form.image_url" class="mb-3">
                <img :src="form.image_url" class="h-32 w-full object-cover border border-charcoal-700" />
              </div>
              <div class="flex gap-2">
                <AdminImageUpload
                  label=""
                  :current-url="form.image_url"
                  bucket="product-images"
                  :path="`products/${form.slug || 'new'}`"
                  compact
                  @uploaded="form.image_url = $event"
                />
                <span v-if="form.image_url" class="font-sans text-xs text-emerald-400 self-center">✓ Uploaded</span>
              </div>
              <p class="font-sans text-cream-200/30 text-xs mt-2">Or paste a URL:</p>
              <input v-model="form.image_url" type="url" class="input-dark mt-1" placeholder="https://…" />
            </div>

            <!-- Bundle toggle -->
            <div class="border border-charcoal-700 p-4 space-y-4">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" v-model="form.is_bundle" class="w-4 h-4 accent-gold" />
                <span class="font-sans text-sm text-cream-100">Enable Bundle Option</span>
              </label>

              <template v-if="form.is_bundle">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Bundle Label</label>
                    <input v-model="form.bundle_label" type="text" class="input-dark" placeholder="e.g. Box of 6" />
                  </div>
                  <div>
                    <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Bundle Price (₱)</label>
                    <input v-model.number="form.bundle_price_php" type="number" min="1" class="input-dark" />
                  </div>
                </div>
                <div>
                  <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Bundle Description</label>
                  <input v-model="form.bundle_description" type="text" class="input-dark" placeholder="e.g. Perfect for gifting" />
                </div>
              </template>
            </div>

            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" v-model="form.allows_cod" class="w-4 h-4 accent-gold" />
              <div>
                <span class="font-sans text-sm text-cream-100">Allow Cash on Delivery</span>
                <p class="font-sans text-cream-200/30 text-xs mt-0.5">Customers can choose to pay upon receipt</p>
              </div>
            </label>

            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" v-model="form.is_published" class="w-4 h-4 accent-gold" />
              <span class="font-sans text-sm text-cream-100">Publish (visible in Shop)</span>
            </label>

            <div v-if="saveError" class="border border-red-500/30 bg-red-500/10 px-3 py-2">
              <p class="font-sans text-red-400 text-xs">{{ saveError }}</p>
            </div>

            <div class="flex gap-3 pt-2">
              <button type="submit" class="btn-gold flex-1 justify-center" :disabled="saving">
                {{ saving ? 'Saving…' : 'Save Product' }}
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

const products = ref<any[]>([])
const pending = ref(true)
const showModal = ref(false)
const editingProduct = ref<any>(null)
const saving = ref(false)
const saveError = ref('')

const blankForm = () => ({
  name: '', slug: '', short_description: '', description: '',
  price_php: 0, category: '', image_url: '',
  is_bundle: false, bundle_label: '', bundle_price_php: 0, bundle_description: '',
  single_label: '', single_description: '', is_published: false, allows_cod: false,
})
const form = reactive(blankForm())

onMounted(async () => {
  await loadProducts()
})

const loadProducts = async () => {
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  products.value = data || []
  pending.value = false
}

const openModal = (product?: any) => {
  saveError.value = ''
  if (product) {
    editingProduct.value = product
    Object.assign(form, { ...blankForm(), ...product })
  } else {
    editingProduct.value = null
    Object.assign(form, blankForm())
  }
  showModal.value = true
}

const saveProduct = async () => {
  saving.value = true
  saveError.value = ''
  const payload = { ...form }
  if (!payload.is_bundle) {
    payload.bundle_price_php = 0
    payload.bundle_label = ''
    payload.bundle_description = ''
  }
  try {
    if (editingProduct.value) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.value.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if (error) throw error
    }
    await loadProducts()
    showModal.value = false
  } catch (e: any) {
    saveError.value = e.message || 'Failed to save product.'
  } finally {
    saving.value = false
  }
}

const deleteProduct = async (id: string) => {
  if (!confirm('Delete this product? This cannot be undone.')) return
  await supabase.from('products').delete().eq('id', id)
  await loadProducts()
}

const formatPrice = (price: number) => Number(price).toLocaleString('en-PH')
</script>
