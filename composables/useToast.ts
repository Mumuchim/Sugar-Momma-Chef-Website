// composables/useToast.ts
// Global toast notification system

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  duration?: number
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const add = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    toasts.value.push({ ...toast, id })
    const duration = toast.duration ?? 4000
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }

  const remove = (id: string) => {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  const success = (message: string) => add({ type: 'success', message })
  const error = (message: string) => add({ type: 'error', message, duration: 6000 })
  const info = (message: string) => add({ type: 'info', message })

  return { toasts: readonly(toasts), add, remove, success, error, info }
}
