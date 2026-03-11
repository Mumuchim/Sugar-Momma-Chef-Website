// composables/useServings.ts
import { ref, computed } from 'vue'
import type { Ingredient } from '~/types/database'

export const useServings = (
  ingredients: Ingredient[],
  baseServings: number
) => {
  const currentServings = ref(baseServings)

  const scaledIngredients = computed(() =>
    ingredients.map((ing) => ({
      ...ing,
      scaledQuantity: ing.quantity
        ? +(ing.quantity * (currentServings.value / baseServings)).toFixed(2)
        : null,
    }))
  )

  const increment = () => {
    if (currentServings.value < 99) currentServings.value++
  }

  const decrement = () => {
    if (currentServings.value > 1) currentServings.value--
  }

  const scalingFactor = computed(() => currentServings.value / baseServings)

  return { currentServings, scaledIngredients, scalingFactor, increment, decrement }
}
