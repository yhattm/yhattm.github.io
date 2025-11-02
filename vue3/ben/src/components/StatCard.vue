<script setup lang="ts">
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  number: string
  label: string
}

defineProps<Props>()

const { isVisible, targetRef } = useScrollAnimation(0.1)
</script>

<template>
  <div
    ref="targetRef"
    class="transition-all opacity-0 translate-y-8"
    :class="{ 'opacity-100 translate-y-0': isVisible }"
  >
    <Card
      class="bg-gray-700 border border-gray-600 text-center hover:-translate-y-2 hover:scale-105 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
    >
      <CardContent class="p-6 md:p-4">
        <div
          class="text-5xl md:text-4xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2"
        >
          {{ number }}
        </div>
        <div class="text-gray-400 text-sm font-medium uppercase tracking-wider">{{ label }}</div>
      </CardContent>
    </Card>
  </div>
</template>