<template>
  <div class="min-h-screen bg-charcoal-950 flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <div class="mb-8">
        <SugarMommaLogo size="lg" class="justify-center" />
      </div>

      <div v-if="error" class="border border-red-500/30 bg-red-500/10 p-6 mb-6">
        <p class="font-serif text-cream-100 text-xl mb-2">Authentication Failed</p>
        <p class="font-sans text-red-400 text-sm">{{ error }}</p>
        <NuxtLink to="/" class="btn-outline mt-6 inline-flex">Return Home</NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <LoadingSpinner />
        <p class="font-sans text-cream-200/60 text-sm mt-4">Completing sign-in…</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const router = useRouter()
const supabase = useSupabaseClient()
const error = ref('')

onMounted(async () => {
  // Handle magic link / OAuth callback
  const { data, error: authError } = await supabase.auth.getSession()

  if (authError) {
    error.value = authError.message
    return
  }

  if (data.session) {
    // Check if admin, redirect accordingly
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', data.session.user.id)
      .single()

    if (profile?.is_admin) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } else {
    router.push('/')
  }
})

useSeoMeta({ title: 'Signing In… — Sugar Momma' })
</script>
