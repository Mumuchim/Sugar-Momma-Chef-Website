<template>
  <div :class="compact ? 'flex items-center gap-3' : 'space-y-2'">
    <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest" :class="compact ? 'shrink-0' : 'mb-2'">
      {{ label }}
    </label>

    <div v-if="currentUrl && !compact" class="mb-3">
      <img :src="currentUrl" class="h-32 object-cover rounded border border-charcoal-700" />
    </div>

    <div :class="compact ? 'flex items-center gap-2 flex-1' : ''">
      <input
        type="file"
        :accept="'image/jpeg,image/png,image/webp'"
        class="hidden"
        :ref="fileInput => fileInputRef = fileInput"
        @change="handleFile"
      />
      <button
        type="button"
        @click="(fileInputRef as HTMLInputElement)?.click()"
        class="btn-outline text-xs py-2"
        :disabled="uploading"
      >
        {{ uploading ? 'Uploading…' : (currentUrl ? 'Replace' : 'Upload') }}
      </button>
      <span v-if="currentUrl && compact" class="font-sans text-xs text-emerald-400">✓ Uploaded</span>
      <span v-if="uploadError" class="font-sans text-xs text-red-400">{{ uploadError }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  currentUrl?: string
  bucket: 'recipe-media' | 'collection-covers' | 'class-covers' | 'step-photos'
  path: string
  compact?: boolean
}>()

const emit = defineEmits<{ (e: 'uploaded', url: string): void }>()

const { uploadFile } = useStorage()
const fileInputRef = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')

const handleFile = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploading.value = true
  uploadError.value = ''

  const { url, error } = await uploadFile(props.bucket, file, props.path)

  if (error || !url) {
    uploadError.value = 'Upload failed'
  } else {
    emit('uploaded', url)
  }

  uploading.value = false
}
</script>
