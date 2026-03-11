<template>
  <div class="card-dark p-6 grid md:grid-cols-3 gap-6 items-center">
    <div class="md:col-span-2">
      <div class="flex flex-wrap gap-2 mb-3">
        <span class="tag-gold">{{ classItem.level }}</span>
        <span v-if="classItem.is_online" class="tag">Online</span>
        <span v-if="availableSlots === 0" class="tag border-red-500/40 text-red-400">Full</span>
      </div>
      <h3 class="font-serif text-cream-100 text-2xl mb-2">{{ classItem.title }}</h3>
      <p v-if="classItem.description" class="font-sans text-cream-200/60 text-sm leading-relaxed mb-4 line-clamp-2">
        {{ classItem.description }}
      </p>
      <div class="flex flex-wrap gap-4 text-xs font-sans text-cream-200/40">
        <span>📅 {{ formatDate(classItem.schedule_date) }}</span>
        <span v-if="classItem.duration_hours">⏱ {{ classItem.duration_hours }}h</span>
        <span v-if="classItem.location && !classItem.is_online">📍 {{ classItem.location }}</span>
        <span>👥 {{ availableSlots }} / {{ classItem.total_slots }} slots left</span>
      </div>
    </div>

    <div class="text-center md:text-right">
      <p class="font-serif text-3xl text-gold mb-1">₱{{ formatPrice(classItem.price_php) }}</p>
      <p class="font-sans text-xs text-cream-200/40 mb-4">per person</p>
      <button
        @click="$emit('book', classItem)"
        :disabled="availableSlots === 0"
        class="btn-gold text-sm"
        :class="availableSlots === 0 ? 'opacity-40 cursor-not-allowed' : ''"
      >
        {{ availableSlots === 0 ? 'Fully Booked' : 'Book Now' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Class } from '~/types/database'

const props = defineProps<{ classItem: Class }>()
defineEmits<{ (e: 'book', cls: Class): void }>()

const availableSlots = computed(() => props.classItem.total_slots - props.classItem.booked_slots)
const formatPrice = (p: number) => p.toLocaleString('en-PH')
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
</script>
