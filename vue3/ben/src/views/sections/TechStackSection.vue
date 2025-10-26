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
  <section id="tech" class="tech-stack">
    <div class="container">
      <h2 class="section-title">{{ t('techStack.title') }}</h2>
      <div class="tech-categories">
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

<style scoped>
.tech-stack {
  padding: var(--spacing-xl) 0;
  background: var(--dark-800);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tech-categories {
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
}
</style>
