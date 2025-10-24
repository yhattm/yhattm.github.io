<script setup lang="ts">
import { useLanguageStore, type BilingualText } from '@/stores/language'
import StatCard from '@/components/StatCard.vue'

const languageStore = useLanguageStore()

const sectionTitle: BilingualText = {
  en: 'About Me',
  zh: '關於我',
}

const paragraph1: BilingualText = {
  en: 'Backend Developer with 20+ years of experience in embedded systems, cloud architecture, and video surveillance solutions. Currently serving as R&D Manager at VIVOTEK, leading development of cloud-based video surveillance platforms and smart home products.',
  zh: '擁有 20 多年嵌入式系統、雲端架構和影像監控解決方案經驗的後端開發工程師。目前擔任晶睿通訊研發經理，領導雲端影像監控平台和智慧家居產品的開發。',
}

const paragraph2: BilingualText = {
  en: 'Passionate about building scalable backend systems, exploring AWS services, and creating innovative IoT solutions. Former CTO at Infani, where I architected a comprehensive baby monitor service from firmware to cloud.',
  zh: '熱衷於建構可擴展的後端系統、探索 AWS 服務以及創建創新的物聯網解決方案。曾任 Infani 技術長，從韌體到雲端架構了完整的嬰兒監視器服務。',
}

const stats = [
  {
    number: '20+',
    label: { en: 'Years Experience', zh: '年經驗' },
  },
  {
    number: '3',
    label: { en: 'Major Companies', zh: '主要公司' },
  },
  {
    number: '50+',
    label: { en: 'Technologies', zh: '技術' },
  },
]
</script>

<template>
  <section id="about" class="about">
    <div class="container">
      <h2 class="section-title">{{ languageStore.t(sectionTitle) }}</h2>
      <div class="about-content">
        <div class="about-text">
          <p>{{ languageStore.t(paragraph1) }}</p>
          <p>{{ languageStore.t(paragraph2) }}</p>
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
