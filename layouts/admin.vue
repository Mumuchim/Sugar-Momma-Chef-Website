<template>
  <div class="min-h-screen bg-charcoal-950 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-charcoal-900 border-r border-charcoal-700 fixed inset-y-0 left-0 flex flex-col z-30">
      <div class="px-6 py-8 border-b border-charcoal-700">
        <NuxtLink to="/" class="font-serif text-xl text-cream-100 tracking-widest">
          Sugar<span class="text-gold">Momma</span>
        </NuxtLink>
        <p class="font-sans text-xs text-cream-200/40 mt-1 tracking-widest uppercase">Admin Panel</p>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <AdminNavLink to="/admin" icon="grid" label="Dashboard" exact />
        <AdminNavLink to="/admin/recipes" icon="book-open" label="Recipes" />
        <AdminNavLink to="/admin/collections" icon="layers" label="Collections" />
        <AdminNavLink to="/admin/orders" icon="shopping-bag" label="Orders" />
        <AdminNavLink to="/admin/classes" icon="calendar" label="Classes" />
        <AdminNavLink to="/admin/messages" icon="mail" label="Messages" />
      </nav>

      <div class="px-4 py-6 border-t border-charcoal-700">
        <button
          @click="signOut"
          class="w-full flex items-center gap-3 px-4 py-2.5 text-cream-200/50 hover:text-cream-100 font-sans text-sm transition-colors duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="ml-64 flex-1 min-h-screen">
      <header class="bg-charcoal-900 border-b border-charcoal-700 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <h1 class="font-serif text-lg text-cream-100">{{ pageTitle }}</h1>
        <div class="flex items-center gap-3">
          <UiThemeToggle />
          <span class="font-sans text-xs text-cream-200/40">{{ userEmail }}</span>
          <div class="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
            <span class="text-gold font-serif text-sm">{{ userInitial }}</span>
          </div>
        </div>
      </header>

      <main class="p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const route = useRoute()

const userEmail = computed(() => user.value?.email || '')
const userInitial = computed(() => userEmail.value?.[0]?.toUpperCase() || 'A')

const pageTitleMap: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/recipes': 'Recipes',
  '/admin/collections': 'Collections',
  '/admin/orders': 'Orders',
  '/admin/classes': 'Classes',
  '/admin/messages': 'Messages',
}

const pageTitle = computed(() =>
  pageTitleMap[route.path] || 'Admin'
)

const signOut = async () => {
  await supabase.auth.signOut()
  router.push('/admin/login')
}
</script>
