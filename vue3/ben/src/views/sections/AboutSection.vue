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
  <section id="about" class="py-20 bg-gray-800">
    <div class="max-w-7xl mx-auto px-6">
      <h2
        class="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent"
      >
        {{ t('about.title') }}
      </h2>
      <div class="grid gap-12">
        <div class="text-gray-100 text-lg leading-relaxed max-w-3xl mx-auto">
          <p class="mb-6">{{ t('about.paragraph1') }}</p>
          <p>{{ t('about.paragraph2') }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6">
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
