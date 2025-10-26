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
  <section id="experience" class="experience">
    <div class="container">
      <h2 class="section-title">{{ t('experience.title') }}</h2>
      <div class="timeline">
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

<style scoped>
.experience {
  padding: var(--spacing-xl) 0;
  background: var(--dark);
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

.timeline {
  max-width: 800px;
  margin: 0 auto;
  padding-top: var(--spacing-md);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
}
</style>
