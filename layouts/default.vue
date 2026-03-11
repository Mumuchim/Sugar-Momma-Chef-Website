<template>
  <div class="min-h-screen bg-charcoal-900 flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
