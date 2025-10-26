<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import StatCard from '@/components/StatCard.vue'

const { t } = useI18n()

const stats = computed(() => [
  {
    number: '20+',
    label: t('about.stats.yearsExperience'),
  },
  {
    number: '3',
    label: t('about.stats.majorCompanies'),
  },
  {
    number: '50+',
    label: t('about.stats.technologies'),
  },
])
</script>

<template>
  <section id="about" class="about">
    <div class="container">
      <h2 class="section-title">{{ t('about.title') }}</h2>
      <div class="about-content">
        <div class="about-text">
          <p>{{ t('about.paragraph1') }}</p>
          <p>{{ t('about.paragraph2') }}</p>
        </div>
        <div class="about-stats">
          <StatCard
            v-for="(stat, index) in stats"
            :key="index"
            :number="stat.number"
            :label="stat.label"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
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

.about-content {
  display: grid;
  gap: var(--spacing-lg);
}

.about-text {
  color: var(--text);
  font-size: 1.125rem;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto;
}

.about-text p {
  margin-bottom: var(--spacing-md);
}

.about-text p:last-child {
  margin-bottom: 0;
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .about-text {
    font-size: 1rem;
  }

  .about-stats {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
}
</style>
