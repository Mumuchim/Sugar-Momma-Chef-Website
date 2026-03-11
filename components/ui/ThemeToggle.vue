<template>
  <button
    @click="toggle"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    aria-label="Toggle color mode"
    class="relative w-9 h-9 flex items-center justify-center border transition-colors duration-300 group"
    :class="isDark
      ? 'border-charcoal-600 hover:border-gold text-cream-200/50 hover:text-gold'
      : 'border-charcoal-700 hover:border-gold text-cream-200/60 hover:text-gold'"
  >
    <!-- Sun icon (shown in dark mode → click to go light) -->
    <Transition name="icon-swap">
      <svg
        v-if="isDark"
        key="sun"
        class="w-4 h-4 transition-transform duration-300 group-hover:rotate-45"
        fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="4"/>
        <path stroke-linecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>

      <!-- Moon icon (shown in light mode → click to go dark) -->
      <svg
        v-else
        key="moon"
        class="w-4 h-4 transition-transform duration-300"
        fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </Transition>
  </button>
</template>

<script setup lang="ts">
const { isDark, toggle } = useColorMode()
</script>

<style scoped>
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  position: absolute;
}
.icon-swap-enter-from { opacity: 0; transform: scale(0.6) rotate(-30deg); }
.icon-swap-leave-to   { opacity: 0; transform: scale(0.6) rotate(30deg); }
</style>
