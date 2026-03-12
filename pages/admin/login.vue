<template>
  <div class="min-h-screen bg-charcoal-950 flex items-center justify-center px-6">
    <!-- Decorative background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
    </div>

    <div class="relative w-full max-w-md">
      <div class="text-center mb-12">
        <div class="flex justify-center">
          <UiSugarMommaLogo size="lg" />
        </div>
        <p class="font-sans text-cream-200/40 text-sm mt-4 tracking-widest uppercase">Admin Access</p>
      </div>

      <div class="border border-charcoal-700 p-10">
        <form @submit.prevent="signIn" class="space-y-5">
          <div>
            <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="input-dark"
              placeholder="admin@sugarmomma.ph"
              autocomplete="email"
            />
          </div>
          <div>
            <label class="block font-sans text-xs text-cream-200/60 uppercase tracking-widest mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              required
              class="input-dark"
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>

          <div v-if="error" class="border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p class="font-sans text-red-400 text-sm">{{ error }}</p>
          </div>

          <button type="submit" class="btn-gold w-full justify-center mt-6" :disabled="loading">
            {{ loading ? 'Signing in…' : 'Sign In' }}
          </button>
        </form>
      </div>

      <p class="text-center font-sans text-xs text-cream-200/20 mt-6">
        Not the admin? <NuxtLink to="/" class="text-gold/60 hover:text-gold">Go home</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const signIn = async () => {
  loading.value = true
  error.value = ''

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (authError) {
    error.value = authError.message
    loading.value = false
    return
  }

  // Verify admin status
  const user = useSupabaseUser()
  const { data } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.value!.id)
    .single()

  if (!data?.is_admin) {
    await supabase.auth.signOut()
    error.value = 'Access denied. Admin only.'
    loading.value = false
    return
  }

  router.push('/admin')
}

useSeoMeta({ title: 'Admin Login — Sugar Momma' })
</script>
