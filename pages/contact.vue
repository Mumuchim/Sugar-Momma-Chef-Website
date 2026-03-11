<template>
  <div>
    <PageHero label="Get in Touch" title="Contact" subtitle="Inquiries, collaborations, and press." />

    <section class="py-20 container mx-auto px-6 lg:px-16 max-w-4xl">
      <div class="grid lg:grid-cols-2 gap-16">
        <div class="space-y-8">
          <div>
            <p class="section-label">Direct</p>
            <a href="mailto:hello@sugarmomma.ph" class="font-serif text-cream-100 text-2xl hover:text-gold transition-colors">
              hello@sugarmomma.ph
            </a>
          </div>
          <div>
            <p class="section-label">Social</p>
            <a href="#" class="font-sans text-cream-200/60 hover:text-gold transition-colors block">@sugarmomma.ph</a>
          </div>
          <div>
            <p class="section-label">Response Time</p>
            <p class="font-sans text-cream-200/60 text-sm">Within 24–48 hours on business days.</p>
          </div>
        </div>

        <form v-if="!sent" @submit.prevent="submit" class="space-y-5">
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Name *</label>
              <input v-model="form.name" type="text" required class="input-dark" />
            </div>
            <div>
              <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Email *</label>
              <input v-model="form.email" type="email" required class="input-dark" />
            </div>
          </div>
          <div>
            <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Subject</label>
            <input v-model="form.subject" type="text" class="input-dark" />
          </div>
          <div>
            <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Message *</label>
            <textarea v-model="form.message" required rows="5" class="input-dark resize-none" />
          </div>
          <button type="submit" class="btn-gold w-full justify-center" :disabled="loading">
            {{ loading ? 'Sending…' : 'Send Message' }}
          </button>
        </form>

        <div v-else class="border border-charcoal-700 p-8 text-center">
          <p class="font-serif text-cream-100 text-2xl mb-3">Message Sent</p>
          <p class="font-sans text-cream-200/60 text-sm">We'll get back to you within 24–48 hours.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const form = reactive({ name: '', email: '', subject: '', message: '' })
const loading = ref(false)
const sent = ref(false)
const { success, error: toastError } = useToast()

const submit = async () => {
  loading.value = true
  try {
    await $fetch('/api/contact', { method: 'POST', body: { ...form } })
    sent.value = true
    success('Message sent! We\'ll get back to you within 24–48 hours.')
  } catch (e: any) {
    toastError(e.data?.message || 'Something went wrong. Please try again.')
  } finally {
    loading.value = false
  }
}

useSeoMeta({ title: 'Contact — Sugar Momma' })
</script>
