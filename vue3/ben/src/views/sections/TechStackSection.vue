<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import TechCategory from '@/components/TechCategory.vue'

const { t } = useI18n()

const categories = computed(() => [
  {
    title: t('techStack.categories.backend'),
    items: [
      { icon: 'Go', name: 'Golang', proficiency: 95 },
      { icon: 'JS', name: 'Express.js', proficiency: 85 },
      { icon: 'API', name: 'REST/GraphQL', proficiency: 90 },
      { icon: 'gRPC', name: 'gRPC', proficiency: 80 },
    ],
  },
  {
    title: t('techStack.categories.cloudDevOps'),
    items: [
      { icon: 'AWS', name: 'AWS Services', proficiency: 90 },
      { icon: 'K8s', name: 'Kubernetes', proficiency: 85 },
      { icon: '🐳', name: 'Docker', proficiency: 90 },
      { icon: 'CDK', name: 'AWS CDK', proficiency: 85 },
    ],
  },
  {
    title: t('techStack.categories.frontendMobile'),
    items: [
      { icon: '⚛️', name: 'React', proficiency: 85 },
      { icon: 'FL', name: 'Flutter', proficiency: 80 },
      { icon: 'RN', name: 'React Native', proficiency: 75 },
      { icon: 'TS', name: 'TypeScript', proficiency: 85 },
    ],
  },
  {
    title: t('techStack.categories.embeddedIoT'),
    items: [
      { icon: '🐧', name: 'Embedded Linux', proficiency: 95 },
      { icon: 'MQTT', name: 'MQTT/IoT', proficiency: 90 },
      { icon: 'RTC', name: 'WebRTC', proficiency: 85 },
      { icon: 'RTOS', name: 'RTOS', proficiency: 80 },
    ],
  },
])
</script>

<template>
  <section id="tech" class="py-20 bg-gray-800">
    <div class="max-w-7xl mx-auto px-6">
      <h2
        class="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent"
      >
        {{ t('techStack.title') }}
      </h2>
      <div class="max-w-5xl mx-auto">
        <TechCategory
          v-for="(category, index) in categories"
          :key="index"
          :title="category.title"
          :items="category.items"
        />
      </div>
    </div>
  </section>
</template>
