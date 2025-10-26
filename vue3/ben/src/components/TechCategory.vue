<script setup lang="ts">
import TechItem from './TechItem.vue'

interface TechItemData {
  icon: string
  name: string
  proficiency: number
}

interface Props {
  title: string
  items: TechItemData[]
}

defineProps<Props>()
</script>

<template>
  <div class="mb-12">
    <h3 class="text-gray-100 text-2xl md:text-xl font-bold mb-6 pb-4 border-b-2 border-gray-600">
      {{ title }}
    </h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-3">
      <TechItem
        v-for="(item, index) in items"
        :key="index"
        :icon="item.icon"
        :name="item.name"
        :proficiency="item.proficiency"
      />
    </div>
  </div>
</template>
