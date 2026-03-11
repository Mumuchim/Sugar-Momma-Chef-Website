<template>
  <div class="bg-charcoal-800 border border-charcoal-700 p-6">
    <h3 class="font-serif text-cream-100 text-lg mb-5 pb-4 border-b border-charcoal-700">{{ title }}</h3>
    <div class="space-y-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
