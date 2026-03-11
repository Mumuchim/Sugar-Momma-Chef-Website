<template>
  <footer class="bg-charcoal-950 border-t border-charcoal-800 mt-auto">
    <div class="container mx-auto px-6 lg:px-16 max-w-7xl py-16">
      <div class="grid md:grid-cols-4 gap-12 mb-12">
        <!-- Brand -->
        <div class="md:col-span-2">
          <SugarMommaLogo size="md" show-tagline class="mb-5" />
          <p class="font-sans text-cream-200/50 text-sm leading-relaxed max-w-xs">
            Premium pastry artistry rooted in Japanese fine-dining tradition.
            Crafted with discipline, plated with passion.
          </p>
          <!-- Chef credit -->
          <p class="font-sans text-cream-200/30 text-xs mt-4 uppercase tracking-widest">
            By Chef Maria Santos · Manila, Philippines
          </p>
          <div class="flex gap-4 mt-6">
            <a href="https://instagram.com" target="_blank" class="w-9 h-9 border border-charcoal-700 hover:border-gold flex items-center justify-center text-cream-200/50 hover:text-gold transition-all duration-200">
              <span class="text-xs font-sans">IG</span>
            </a>
            <a href="https://facebook.com" target="_blank" class="w-9 h-9 border border-charcoal-700 hover:border-gold flex items-center justify-center text-cream-200/50 hover:text-gold transition-all duration-200">
              <span class="text-xs font-sans">FB</span>
            </a>
            <a href="https://youtube.com" target="_blank" class="w-9 h-9 border border-charcoal-700 hover:border-gold flex items-center justify-center text-cream-200/50 hover:text-gold transition-all duration-200">
              <span class="text-xs font-sans">YT</span>
            </a>
          </div>
        </div>

        <!-- Links -->
        <div>
          <p class="section-label mb-4">Explore</p>
          <ul class="space-y-2.5">
            <li v-for="link in links" :key="link.to">
              <NuxtLink :to="link.to" class="font-sans text-sm text-cream-200/50 hover:text-gold transition-colors duration-200">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <p class="section-label mb-4">Contact</p>
          <div class="space-y-2.5 font-sans text-sm text-cream-200/50">
            <p>Manila, Philippines</p>
            <a href="mailto:hello@sugarmomma.ph" class="hover:text-gold transition-colors block">
              hello@sugarmomma.ph
            </a>
            <a href="https://instagram.com" target="_blank" class="hover:text-gold transition-colors block">
              @sugarmomma.ph
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-charcoal-800 pt-8 flex flex-col md:flex-row justify-between gap-4">
        <p class="font-sans text-xs text-cream-200/30">
          © {{ new Date().getFullYear() }} Sugar Momma by Chef Maria Santos. All rights reserved.
        </p>
        <div class="flex gap-6">
          <NuxtLink to="/privacy" class="font-sans text-xs text-cream-200/30 hover:text-cream-200/60 transition-colors">Privacy Policy</NuxtLink>
          <NuxtLink to="/terms" class="font-sans text-xs text-cream-200/30 hover:text-cream-200/60 transition-colors">Terms of Service</NuxtLink>
          <NuxtLink to="/admin/login" class="font-sans text-xs text-cream-200/20 hover:text-cream-200/50 transition-colors">Admin</NuxtLink>
        </div>
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
  { to: '/about', label: 'About Chef Maria' },
  { to: '/contact', label: 'Contact' },
]
</script>
