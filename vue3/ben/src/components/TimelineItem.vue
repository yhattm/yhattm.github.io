<script setup lang="ts">
import { ref } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

interface Props {
  date: string
  company: string
  role: string
  description: string
  tags: string[]
}

defineProps<Props>()

const { isVisible, targetRef } = useScrollAnimation(0.1)
const isHovered = ref(false)
</script>

<template>
  <div
    ref="targetRef"
    class="relative pl-12 md:pl-10 pb-12 last:pb-0 opacity-0 translate-y-8 transition-all duration-500 before:content-[''] before:absolute before:left-3 before:top-8 before:bottom-0 before:w-0.5 before:bg-gray-600 last:before:hidden"
    :class="{ 'opacity-100 translate-y-0': isVisible }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      class="absolute left-0 top-1 w-8 h-8 md:w-6 md:h-6 bg-blue-600 border-4 border-gray-900 rounded-full z-10 transition-all"
      :class="{ 'bg-gradient-to-br from-blue-500 to-purple-600 scale-110': isHovered }"
    ></div>
    <div
      class="bg-gray-700 border border-gray-600 rounded-lg p-6 transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
    >
      <div class="text-gray-400 text-sm font-medium mb-2">{{ date }}</div>
      <h3 class="text-gray-100 text-2xl md:text-xl font-bold mb-2">{{ company }}</h3>
      <h4 class="text-blue-500 text-lg md:text-base font-semibold mb-4">{{ role }}</h4>
      <p class="text-gray-100 leading-relaxed mb-4">{{ description }}</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in tags"
          :key="tag"
          class="bg-gray-600 text-gray-100 px-3 py-1 rounded text-xs font-medium border border-gray-600 transition-all hover:bg-blue-600 hover:border-blue-600 hover:text-white"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>
