<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import TimelineItem from '@/components/TimelineItem.vue'

const { t } = useI18n()

const experiences = computed(() => [
  {
    date: t('experience.vivotek.date'),
    company: 'VIVOTEK',
    role: t('experience.vivotek.role'),
    description: t('experience.vivotek.description'),
    tags: ['Golang', 'AWS', 'Kubernetes', 'Flutter', 'React'],
  },
  {
    date: t('experience.infani.date'),
    company: 'Infani',
    role: t('experience.infani.role'),
    description: t('experience.infani.description'),
    tags: ['Golang', 'AWS IoT', 'React Native', 'TensorFlow', 'Docker'],
  },
  {
    date: t('experience.vivotekEarly.date'),
    company: 'VIVOTEK',
    role: t('experience.vivotekEarly.role'),
    description: t('experience.vivotekEarly.description'),
    tags: ['Embedded Linux', 'DSP', 'Video Analytics', 'RTSP', 'P2P'],
  },
])
</script>

<template>
  <section id="experience" class="py-20 bg-gray-900">
    <div class="max-w-7xl mx-auto px-6">
      <h2
        class="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent"
      >
        {{ t('experience.title') }}
      </h2>
      <div class="max-w-3xl mx-auto pt-6">
        <TimelineItem
          v-for="(exp, index) in experiences"
          :key="index"
          :date="exp.date"
          :company="exp.company"
          :role="exp.role"
          :description="exp.description"
          :tags="exp.tags"
        />
      </div>
    </div>
  </section>
</template>
