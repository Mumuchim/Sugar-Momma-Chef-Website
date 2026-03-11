// composables/useColorMode.ts
// Dark mode is the default. Persists to localStorage.
// Uses a single 'light' class on <html> — all CSS variables flip automatically.

const STORAGE_KEY = 'sm-theme'

// Shared reactive state across all composable instances
const mode = ref<'dark' | 'light'>('dark')

export const useColorMode = () => {
  const isDark = computed(() => mode.value === 'dark')
  const isLight = computed(() => mode.value === 'light')

  const applyToDOM = (m: 'dark' | 'light') => {
    if (!process.client) return
    document.documentElement.classList.toggle('light', m === 'light')
  }

  const toggle = () => {
    const next: 'dark' | 'light' = mode.value === 'dark' ? 'light' : 'dark'
    mode.value = next
    applyToDOM(next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
  }

  const setMode = (m: 'dark' | 'light') => {
    mode.value = m
    applyToDOM(m)
    try { localStorage.setItem(STORAGE_KEY, m) } catch {}
  }

  /** Call once on app mount — reads saved preference */
  const init = () => {
    if (!process.client) return
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as 'dark' | 'light' | null
      if (saved === 'light' || saved === 'dark') {
        mode.value = saved
        applyToDOM(saved)
      } else {
        // Default: dark. Apply class just to be safe.
        applyToDOM('dark')
      }
    } catch {
      applyToDOM('dark')
    }
  }

  return { mode, isDark, isLight, toggle, setMode, init }
}
