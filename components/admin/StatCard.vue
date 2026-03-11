<template>
  <div class="bg-charcoal-800 border border-charcoal-700 p-6">
    <div class="flex items-start justify-between">
      <div>
        <p class="font-sans text-xs text-cream-200/40 uppercase tracking-widest mb-2">{{ label }}</p>
        <p class="font-serif text-4xl text-cream-100">{{ value }}</p>
      </div>
      <span class="text-2xl">{{ icon }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string; icon: string }>()
</script>
