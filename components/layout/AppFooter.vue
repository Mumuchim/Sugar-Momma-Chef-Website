<template>
  <footer class="bg-charcoal-950 mt-auto relative">
    <!-- Gold accent line at top -->
    <div class="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    <!-- Secondary border -->
    <div class="border-t border-charcoal-800" />

    <div class="container mx-auto px-6 lg:px-16 max-w-7xl py-16">
      <div class="grid md:grid-cols-4 gap-12 mb-12">
        <!-- Brand -->
        <div class="md:col-span-2">
          <UiSugarMommaLogo size="md" show-tagline class="mb-5" />
          <p class="font-sans text-cream-200/50 text-sm leading-relaxed max-w-xs">
            Premium pastry artistry rooted in Japanese fine-dining tradition.
            Crafted with discipline, plated with passion.
          </p>
          <!-- Chef credit -->
          <p class="font-sans text-cream-200/30 text-xs mt-4 uppercase tracking-widest">
            By Chef Regina Faustino · Rizal, Philippines
          </p>
          <div class="flex gap-4 mt-6">
            <a href="https://instagram.com" target="_blank" class="w-9 h-9 border border-charcoal-700 hover:border-gold flex items-center justify-center text-cream-200/50 hover:text-gold transition-all duration-200" aria-label="Instagram">
              <span class="text-xs font-sans">IG</span>
            </a>
            <a href="https://facebook.com" target="_blank" class="w-9 h-9 border border-charcoal-700 hover:border-gold flex items-center justify-center text-cream-200/50 hover:text-gold transition-all duration-200" aria-label="Facebook">
              <span class="text-xs font-sans">FB</span>
            </a>
            <a href="https://youtube.com" target="_blank" class="w-9 h-9 border border-charcoal-700 hover:border-gold flex items-center justify-center text-cream-200/50 hover:text-gold transition-all duration-200" aria-label="YouTube">
              <span class="text-xs font-sans">YT</span>
            </a>
          </div>
        </div>

        <!-- Links -->
        <div>
          <p class="section-label mb-4">Explore</p>
          <ul class="space-y-2.5">
            <li v-for="link in links" :key="link.to">
              <NuxtLink :to="link.to" class="font-sans text-sm text-cream-200/50 hover:text-gold transition-colors duration-200 flex items-center gap-2 group">
                <span class="w-0 h-px bg-gold transition-all duration-200 group-hover:w-3" />
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <p class="section-label mb-4">Contact</p>
          <div class="space-y-2.5 font-sans text-sm text-cream-200/50">
            <p>Rizal, Philippines</p>
            <a href="mailto:hello@sugarmomma.ph" class="hover:text-gold transition-colors block">
              hello@sugarmomma.ph
            </a>
            <a href="https://instagram.com" target="_blank" class="hover:text-gold transition-colors block">
              @sugarmomma.ph
            </a>
          </div>

          <!-- Newsletter mini CTA -->
          <div class="mt-6 pt-6 border-t border-charcoal-800">
            <p class="font-sans text-xs text-cream-200/30 uppercase tracking-widest mb-3">Newsletter</p>
            <NuxtLink to="/#newsletter" class="font-sans text-xs text-gold/70 hover:text-gold transition-colors">
              Join the inner circle →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-charcoal-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="font-sans text-xs text-cream-200/30">
          © {{ new Date().getFullYear() }} Sugar Momma by Chef Regina Faustino. All rights reserved.
        </p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/privacy" class="font-sans text-xs text-cream-200/30 hover:text-cream-200/60 transition-colors">Privacy Policy</NuxtLink>
          <NuxtLink to="/terms" class="font-sans text-xs text-cream-200/30 hover:text-cream-200/60 transition-colors">Terms of Service</NuxtLink>
          <NuxtLink to="/admin/login" class="font-sans text-xs text-cream-200/50 hover:text-gold transition-colors flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            Admin Login
          </NuxtLink>
        </div>

        <!-- Back to top -->
        <button
          @click="scrollToTop"
          class="flex items-center gap-2 font-sans text-xs text-cream-200/30 hover:text-gold transition-colors duration-200 group"
          aria-label="Back to top"
        >
          <span class="uppercase tracking-widest">Top</span>
          <span class="w-6 h-6 border border-charcoal-700 group-hover:border-gold flex items-center justify-center transition-colors duration-200">
            <svg class="w-3 h-3 transition-transform duration-200 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const links = [
  { to: '/recipes', label: 'Recipes' },
  { to: '/collections', label: 'Premium Collections' },
  { to: '/classes', label: 'Cooking Classes' },
  { to: '/orders', label: 'Custom Orders' },
  { to: '/about', label: 'About Chef Regina' },
  { to: '/contact', label: 'Contact' },
]

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
