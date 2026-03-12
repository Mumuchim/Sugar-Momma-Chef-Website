// composables/useServings.ts
import { ref, computed, isRef } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { Ingredient } from '~/types/database'

export const useServings = (
  ingredients: Ingredient[] | Ref<Ingredient[]> | ComputedRef<Ingredient[]>,
  baseServings: number | Ref<number> | ComputedRef<number>
) => {
  const resolvedBase = isRef(baseServings) ? baseServings : ref(baseServings)
  const resolvedIngredients = isRef(ingredients) ? ingredients : ref(ingredients)

  const currentServings = ref(resolvedBase.value)

  // Keep currentServings in sync when the recipe's base changes (e.g. after load)
  watch(resolvedBase, (newBase) => {
    currentServings.value = newBase
  })

  const scaledIngredients = computed(() =>
    resolvedIngredients.value.map((ing) => ({
      ...ing,
      scaledQuantity: ing.quantity
        ? +(ing.quantity * (currentServings.value / resolvedBase.value)).toFixed(2)
        : null,
    }))
  )

  const increment = () => {
    if (currentServings.value < 99) currentServings.value++
  }

  const decrement = () => {
    if (currentServings.value > 1) currentServings.value--
  }

  const scalingFactor = computed(() => currentServings.value / resolvedBase.value)

  return { currentServings, scaledIngredients, scalingFactor, increment, decrement }
}
