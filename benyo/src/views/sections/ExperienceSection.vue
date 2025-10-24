<script setup lang="ts">
import { useLanguageStore, type BilingualText } from '@/stores/language'
import TimelineItem from '@/components/TimelineItem.vue'

const languageStore = useLanguageStore()

const sectionTitle: BilingualText = {
  en: 'Professional Experience',
  zh: '專業經驗',
}

const experiences = [
  {
    date: { en: 'Nov 2017 - Present · 8 yrs', zh: '2017年11月 - 至今 · 8年' },
    company: 'VIVOTEK',
    role: { en: 'R&D Manager', zh: '研發經理' },
    description: {
      en: 'Leading cloud-based video surveillance as a service (Vortex backend) and smart home product development using Golang, AWS services, and modern DevOps practices.',
      zh: '領導基於雲端的影像監控服務（Vortex 後端）和智慧家居產品開發，使用 Golang、AWS 服務和現代 DevOps 實踐。',
    },
    tags: ['Golang', 'AWS', 'Kubernetes', 'Flutter', 'React'],
  },
  {
    date: { en: 'Jul 2015 - Nov 2017 · 2 yrs 5 mos', zh: '2015年7月 - 2017年11月 · 2年5個月' },
    company: 'Infani',
    role: { en: 'Cofounder & CTO', zh: '共同創辦人兼技術長' },
    description: {
      en: 'Architected and developed comprehensive baby monitor service from firmware to cloud, including AI/ML for baby detection and sleep analysis. Managed full-stack development and DevOps infrastructure.',
      zh: '從韌體到雲端架構和開發完整的嬰兒監視器服務，包括用於嬰兒檢測和睡眠分析的 AI/ML。管理全端開發和 DevOps 基礎設施。',
    },
    tags: ['Golang', 'AWS IoT', 'React Native', 'TensorFlow', 'Docker'],
  },
  {
    date: { en: 'Jul 2005 - Jul 2015 · 10 yrs 1 mo', zh: '2005年7月 - 2015年7月 · 10年1個月' },
    company: 'VIVOTEK',
    role: { en: 'Deputy Manager', zh: '副理' },
    description: {
      en: 'Progressed from Engineer to Deputy Manager, leading teams in network protocols, ONVIF, RTSP, P2P, and Video Content Analysis. Managed IP camera firmware development and intelligent video analytics.',
      zh: '從工程師晉升為副理，領導網路協定、ONVIF、RTSP、P2P 和影像內容分析團隊。管理 IP 攝影機韌體開發和智慧影像分析。',
    },
    tags: ['Embedded Linux', 'DSP', 'Video Analytics', 'RTSP', 'P2P'],
  },
]
</script>

<template>
  <section id="experience" class="experience">
    <div class="container">
      <h2 class="section-title">{{ languageStore.t(sectionTitle) }}</h2>
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
