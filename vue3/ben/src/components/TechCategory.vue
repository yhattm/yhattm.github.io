<script setup lang="ts">
import TechItem from './TechItem.vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

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
  <Card class="mb-12 bg-gray-800 border-gray-700">
    <CardHeader>
      <CardTitle class="text-gray-100 text-2xl md:text-xl">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-3">
        <TechItem
          v-for="(item, index) in items"
          :key="index"
          :icon="item.icon"
          :name="item.name"
          :proficiency="item.proficiency"
        />
      </div>
    </CardContent>
  </Card>
</template>