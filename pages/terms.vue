<template>
  <div>
    <UiPageHero label="Legal" title="Terms of Service" subtitle="The rules and guidelines for using Sugar Momma's services." />

    <section class="py-20 container mx-auto px-6 lg:px-16 max-w-3xl">
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
    title: 'Acceptance of Terms',
    content: 'By accessing or using Sugar Momma\'s website, placing orders, booking classes, or purchasing collections, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.',
  },
  {
    title: 'Custom Orders',
    content: 'All custom pastry orders require a 50% non-refundable deposit to confirm your slot. The remaining balance is due upon delivery or pickup. Orders must be placed at least 7 days in advance. Cancellations within 48 hours of the event date will forfeit the full deposit.',
  },
  {
    title: 'Cooking Classes',
    content: 'Class bookings are confirmed upon successful payment. Cancellations made more than 72 hours before the class date will receive a full refund. Cancellations within 72 hours are non-refundable but may be transferred to another class date subject to availability.',
  },
  {
    title: 'Premium Collections',
    content: 'Premium recipe collection purchases grant lifetime access to the purchased content for personal, non-commercial use. Sharing, redistributing, or reselling collection content is strictly prohibited. Refunds are not available once collection access has been granted.',
  },
  {
    title: 'Intellectual Property',
    content: 'All recipes, photographs, videos, and content on this website are the exclusive property of Sugar Momma and Chef Maria Santos. You may not reproduce, distribute, or create derivative works without explicit written permission.',
  },
  {
    title: 'Limitation of Liability',
    content: 'Sugar Momma\'s liability is limited to the amount paid for the specific service in question. We are not liable for any indirect, incidental, or consequential damages arising from the use of our services.',
  },
]

useSeoMeta({ title: 'Terms of Service — Sugar Momma' })
</script>
