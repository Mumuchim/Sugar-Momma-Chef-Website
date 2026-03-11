<template>
  <button
    @click="toggle"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    aria-label="Toggle color mode"
    class="theme-toggle-pill group"
    :class="isDark ? 'is-dark' : 'is-light'"
  >
    <!-- Track -->
    <span class="pill-track">
      <span class="pill-thumb" />
    </span>

    <!-- Icons + Label -->
    <span class="pill-label">
      <Transition name="icon-swap" mode="out-in">
        <span v-if="isDark" key="sun-label" class="pill-inner">
          <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4"/>
            <path stroke-linecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <span class="pill-text">Light</span>
        </span>
        <span v-else key="moon-label" class="pill-inner">
          <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <span class="pill-text">Dark</span>
        </span>
      </Transition>
    </span>
  </button>
</template>

<script setup lang="ts">
const { isDark, toggle } = useColorMode()
</script>

<style scoped>
.theme-toggle-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px 5px 6px;
  border: 1px solid;
  border-radius: 999px;
  font-family: var(--font-sans, 'DM Sans', sans-serif);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.25s ease, color 0.25s ease, background-color 0.25s ease;
  white-space: nowrap;
}
.theme-toggle-pill.is-dark {
  border-color: rgb(36 36 36);
  color: rgb(244 237 218 / 0.5);
  background: transparent;
}
.theme-toggle-pill.is-dark:hover {
  border-color: #C9A84C;
  color: #C9A84C;
}
.theme-toggle-pill.is-light {
  border-color: rgb(214 204 183);
  color: rgb(52 42 20 / 0.6);
  background: transparent;
}
.theme-toggle-pill.is-light:hover {
  border-color: #C9A84C;
  color: #a8882e;
}

/* Mini toggle track */
.pill-track {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 24px;
  height: 14px;
  border-radius: 999px;
  background: rgb(36 36 36);
  border: 1px solid rgb(46 46 46);
  transition: background 0.25s ease;
  flex-shrink: 0;
}
.is-light .pill-track {
  background: #C9A84C22;
  border-color: #C9A84C66;
}
.pill-thumb {
  position: absolute;
  left: 2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(244 237 218 / 0.4);
  transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), background 0.25s ease;
}
.is-light .pill-thumb {
  transform: translateX(10px);
  background: #C9A84C;
}
.is-dark:hover .pill-thumb {
  background: #C9A84C;
}

.pill-label { display: inline-flex; align-items: center; }
.pill-inner { display: inline-flex; align-items: center; gap: 4px; }
.pill-text  { display: none; }

@media (min-width: 768px) {
  .pill-text { display: inline; }
}

/* Icon swap transition */
.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.icon-swap-enter-from { opacity: 0; transform: scale(0.7); }
.icon-swap-leave-to   { opacity: 0; transform: scale(0.7); }
</style>
