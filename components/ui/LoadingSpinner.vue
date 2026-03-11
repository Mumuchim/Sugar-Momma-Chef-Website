<template>
  <div class="flex flex-col items-center gap-4">
    <div class="w-10 h-10 border border-charcoal-700 border-t-gold rounded-full animate-spin" />
    <p v-if="label" class="font-sans text-xs text-cream-200/40 uppercase tracking-widest">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label?: string }>()
</script>
