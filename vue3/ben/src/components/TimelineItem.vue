<script setup lang="ts">
import { ref } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    class="relative pl-12 md:pl-10 pb-12 last:pb-0 transition-all duration-500 opacity-0 translate-y-8 before:content-[''] before:absolute before:left-3 before:top-8 before:bottom-0 before:w-0.5 before:bg-gray-600 last:before:hidden"
    :class="{ 'opacity-100 translate-y-0': isVisible }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      class="absolute left-0 top-1 w-8 h-8 md:w-6 md:h-6 bg-blue-600 border-4 border-gray-900 rounded-full z-10 transition-all"
      :class="{ 'bg-gradient-to-br from-blue-500 to-purple-600 scale-110': isHovered }"
    ></div>
    <Card
      class="bg-gray-700 border border-gray-600 transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
    >
      <CardHeader>
        <CardDescription class="text-gray-400 text-sm font-medium mb-2">{{ date }}</CardDescription>
        <CardTitle class="text-gray-100 text-2xl md:text-xl mb-2">{{ company }}</CardTitle>
        <CardDescription class="text-blue-500 text-lg md:text-base font-semibold">{{ role }}</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-gray-100 leading-relaxed mb-4">{{ description }}</p>
        <div class="flex flex-wrap gap-2">
          <Badge
            v-for="tag in tags"
            :key="tag"
            variant="secondary"
            class="bg-gray-600 text-gray-100 border border-gray-600 transition-all hover:bg-blue-600 hover:border-blue-600 hover:text-white"
          >
            {{ tag }}
          </Badge>
        </div>
      </CardContent>
    </Card>
  </div>
</template>