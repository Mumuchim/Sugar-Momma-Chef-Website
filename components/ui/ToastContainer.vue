<template>
  <Teleport to="body">
    <div class="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 min-w-[280px] max-w-sm border px-5 py-4 backdrop-blur-sm shadow-2xl"
          :class="{
            'bg-charcoal-900/95 border-emerald-500/40': toast.type === 'success',
            'bg-charcoal-900/95 border-red-500/40': toast.type === 'error',
            'bg-charcoal-900/95 border-gold/40': toast.type === 'info',
          }"
        >
          <!-- Icon -->
          <span
            class="text-lg shrink-0 mt-0.5"
            :class="{
              'text-emerald-400': toast.type === 'success',
              'text-red-400': toast.type === 'error',
              'text-gold': toast.type === 'info',
            }"
          >
            {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ' }}
          </span>

          <!-- Message -->
          <p class="font-sans text-sm text-cream-100 flex-1 leading-relaxed">{{ toast.message }}</p>

          <!-- Close -->
          <button
            @click="remove(toast.id)"
            class="text-cream-200/30 hover:text-cream-100 transition-colors text-sm shrink-0"
          >×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()
</script>
