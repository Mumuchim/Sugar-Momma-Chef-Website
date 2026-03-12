<template>
  <NuxtLink to="/" class="flex items-center gap-3 group" aria-label="Sugar Momma — Home">
    <!-- Pastry icon mark -->
    <svg
      :width="size === 'sm' ? 28 : size === 'lg' ? 48 : 36"
      :height="size === 'sm' ? 28 : size === 'lg' ? 48 : 36"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="shrink-0 transition-transform duration-500 group-hover:rotate-6"
    >
      <!-- Cake base -->
      <rect x="8" y="30" width="32" height="12" rx="2" fill="#C9A84C" opacity="0.15" />
      <rect x="8" y="30" width="32" height="12" rx="2" stroke="#C9A84C" stroke-width="1.2" />
      <!-- Cake middle tier -->
      <rect x="12" y="20" width="24" height="12" rx="2" fill="#C9A84C" opacity="0.1" />
      <rect x="12" y="20" width="24" height="12" rx="2" stroke="#C9A84C" stroke-width="1.2" />
      <!-- Cake top tier -->
      <rect x="17" y="12" width="14" height="10" rx="2" fill="#C9A84C" opacity="0.1" />
      <rect x="17" y="12" width="14" height="10" rx="2" stroke="#C9A84C" stroke-width="1.2" />
      <!-- Candle -->
      <rect x="23" y="7" width="2" height="6" rx="1" fill="#C9A84C" opacity="0.8" />
      <!-- Flame -->
      <ellipse cx="24" cy="5.5" rx="1.5" ry="2" fill="#C9A84C" />
      <ellipse cx="24" cy="5" rx="0.7" ry="1.2" fill="#faf6ec" opacity="0.6" />
      <!-- Decorative dots on tiers -->
      <circle cx="19" cy="26" r="1" fill="#C9A84C" opacity="0.7" />
      <circle cx="24" cy="26" r="1" fill="#C9A84C" opacity="0.7" />
      <circle cx="29" cy="26" r="1" fill="#C9A84C" opacity="0.7" />
      <circle cx="14" cy="36" r="1" fill="#C9A84C" opacity="0.5" />
      <circle cx="20" cy="36" r="1" fill="#C9A84C" opacity="0.5" />
      <circle cx="26" cy="36" r="1" fill="#C9A84C" opacity="0.5" />
      <circle cx="34" cy="36" r="1" fill="#C9A84C" opacity="0.5" />
    </svg>

    <!-- Wordmark -->
    <div class="flex flex-col leading-none">
      <span
        class="font-serif text-cream-100 tracking-wider transition-colors duration-300 group-hover:text-gold"
        :class="size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-4xl' : 'text-2xl'"
      >
        Sugar<span class="text-gold italic">Momma</span>
      </span>
      <span
        v-if="showTagline"
        class="font-sans text-cream-200/40 uppercase tracking-[0.18em] mt-0.5"
        :class="size === 'sm' ? 'text-[8px]' : 'text-[9px]'"
      >
        Fine Pastry &amp; Premium Cuisine
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
}>(), {
  size: 'md',
  showTagline: false,
})
</script>
