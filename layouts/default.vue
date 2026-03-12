<template>
  <div class="min-h-screen bg-charcoal-900 flex flex-col">
    <LayoutAppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutAppFooter />
  </div>
</template>
