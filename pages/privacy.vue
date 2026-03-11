<template>
  <div>
    <PageHero label="Legal" title="Privacy Policy" subtitle="How we collect, use, and protect your information." />

    <section class="py-20 container mx-auto px-6 lg:px-16 max-w-3xl">
      <!-- Back link -->
      <NuxtLink to="/" class="inline-flex items-center gap-2 font-sans text-xs text-cream-200/40 hover:text-gold transition-colors uppercase tracking-widest mb-12">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Home
      </NuxtLink>

      <div class="space-y-10 font-sans text-cream-200/70 leading-relaxed">
        <div>
          <p class="section-label">Last updated</p>
          <p class="text-cream-100">January 1, 2025</p>
        </div>

        <div v-for="section in sections" :key="section.title">
          <h2 class="font-serif text-cream-100 text-xl mb-4">{{ section.title }}</h2>
          <p>{{ section.content }}</p>
        </div>

        <div class="border border-charcoal-700 p-6">
          <p class="section-label">Questions?</p>
          <p class="text-cream-200/70 text-sm">Contact us at <a href="mailto:hello@sugarmomma.ph" class="text-gold hover:text-gold-light transition-colors">hello@sugarmomma.ph</a></p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const sections = [
  {
    title: 'Information We Collect',
    content: 'We collect information you provide directly to us, such as when you place a custom order, book a cooking class, subscribe to our newsletter, or contact us. This includes your name, email address, phone number, and any order details you provide.',
  },
  {
    title: 'How We Use Your Information',
    content: 'We use the information we collect to process your orders and bookings, send you confirmation emails, respond to your inquiries, send newsletters (with your consent), and improve our services. We do not sell your personal information to third parties.',
  },
  {
    title: 'Payment Information',
    content: 'All payment processing is handled by PayMongo, a PCI-compliant payment processor. We do not store your credit card or payment details on our servers. Please refer to PayMongo\'s privacy policy for information on how they handle your payment data.',
  },
  {
    title: 'Cookies',
    content: 'We use essential cookies to maintain your session and preferences. We do not use advertising or tracking cookies. You may disable cookies in your browser settings, though this may affect some functionality.',
  },
  {
    title: 'Data Security',
    content: 'We use industry-standard security measures to protect your personal information. Our database is hosted on Supabase with row-level security policies. However, no method of transmission over the internet is 100% secure.',
  },
  {
    title: 'Your Rights',
    content: 'You have the right to access, correct, or delete your personal information at any time. To exercise these rights, please contact us at hello@sugarmomma.ph and we will respond within 30 days.',
  },
]

useSeoMeta({ title: 'Privacy Policy — Sugar Momma' })
</script>
