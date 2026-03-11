<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-3 px-4 py-2.5 font-sans text-sm transition-all duration-200"
    :class="isActive
      ? 'bg-charcoal-800 text-gold border-l-2 border-gold'
      : 'text-cream-200/50 hover:text-cream-100 hover:bg-charcoal-800/50 border-l-2 border-transparent'"
  >
    <span class="text-base">{{ iconEmoji }}</span>
    {{ label }}
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string
  label: string
  icon: string
  exact?: boolean
}>()

const route = useRoute()
const isActive = computed(() =>
  props.exact ? route.path === props.to : route.path.startsWith(props.to)
)

const iconMap: Record<string, string> = {
  grid: '⊞',
  'book-open': '📖',
  layers: '📚',
  'shopping-bag': '📦',
  calendar: '🗓',
  mail: '✉️',
}
const iconEmoji = computed(() => iconMap[props.icon] || '•')
</script>
