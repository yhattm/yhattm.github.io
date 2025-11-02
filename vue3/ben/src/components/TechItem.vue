<script setup lang="ts">
import { ref, watch } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { Card } from '@/components/ui/card'

interface Props {
  icon: string
  name: string
  proficiency: number
}

const props = defineProps<Props>()

const { isVisible, targetRef } = useScrollAnimation(0.1)
const animatedProficiency = ref(0)

watch(isVisible, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      animatedProficiency.value = props.proficiency
    }, 100)
  }
})
</script>

<template>
  <div
    ref="targetRef"
    class="transition-all opacity-0 translate-y-8"
    :class="{ 'opacity-100 translate-y-0': isVisible }"
  >
    <Card
      class="flex flex-col gap-2 p-4 md:p-3 bg-gray-700 border border-gray-600 hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/20 hover:-translate-y-1 transition-all"
    >
      <div class="text-2xl md:text-xl font-bold text-blue-500 text-center bg-gray-600 p-4 md:p-3 rounded">
        {{ icon }}
      </div>
      <div class="text-gray-100 font-semibold text-sm md:text-xs text-center">{{ name }}</div>
      <div class="h-2 bg-gray-600 rounded overflow-hidden relative">
        <div
          class="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded transition-all duration-1000 ease-out w-0"
          :style="{ width: `${animatedProficiency}%` }"
        ></div>
      </div>
    </Card>
  </div>
</template>