<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-500"
    :class="scrolled ? 'bg-charcoal-900/95 backdrop-blur-sm border-b border-charcoal-700' : 'bg-transparent'"
  >
    <div class="container mx-auto px-6 lg:px-16 max-w-7xl">
      <div class="flex items-center justify-between h-18">
        <!-- Logo -->
        <SugarMommaLogo :show-tagline="scrolled" />

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="font-sans text-sm text-cream-200/70 hover:text-cream-100 transition-colors duration-200 uppercase tracking-widest"
            active-class="text-gold"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-3">
          <ThemeToggle />
          <NuxtLink to="/orders" class="btn-gold text-xs py-2.5 px-5 hidden md:inline-flex">
            Order Now
          </NuxtLink>

          <!-- Mobile menu toggle -->
          <button
            @click="mobileOpen = !mobileOpen"
            class="md:hidden flex flex-col gap-1.5 p-2 text-cream-100"
            aria-label="Toggle menu"
          >
            <span
              class="w-6 h-px bg-current transition-all duration-300"
              :class="mobileOpen ? 'rotate-45 translate-y-2' : ''"
            />
            <span
              class="w-4 h-px bg-current transition-all duration-300"
              :class="mobileOpen ? 'opacity-0' : ''"
            />
            <span
              class="w-6 h-px bg-current transition-all duration-300"
              :class="mobileOpen ? '-rotate-45 -translate-y-2' : ''"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileOpen"
        class="md:hidden bg-charcoal-900 border-t border-charcoal-700 px-6 py-8 space-y-4"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="block font-sans text-cream-200/70 hover:text-gold transition-colors py-2 uppercase tracking-widest text-sm"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
        <NuxtLink to="/orders" class="btn-gold w-full text-center mt-4" @click="mobileOpen = false">
          Order Now
        </NuxtLink>
      </div>
    </Transition>
  </header>

  <!-- Header spacer for non-hero pages -->
  <div class="h-18" />
</template>

<script setup lang="ts">
const scrolled = ref(false)
const mobileOpen = ref(false)
const route = useRoute()

// Close mobile menu on route change
watch(() => route.path, () => { mobileOpen.value = false })

const navLinks = [
  { to: '/recipes', label: 'Recipes' },
  { to: '/collections', label: 'Collections' },
  { to: '/classes', label: 'Classes' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const onScroll = () => { scrolled.value = window.scrollY > 40 }

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1);
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
