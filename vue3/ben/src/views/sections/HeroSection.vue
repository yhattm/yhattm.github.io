<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CodeWindow from '@/components/CodeWindow.vue'

const { t } = useI18n()
</script>

<template>
  <section
    id="home"
    class="hero min-h-screen flex items-center py-20 lg:py-24 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden"
  >
    <div class="max-w-7xl mx-auto px-6 w-full">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div class="order-1">
          <div class="text-gray-400 text-lg font-medium mb-4">{{ t('hero.greeting') }}</div>
          <h1
            class="text-5xl md:text-6xl lg:text-7xl font-black mb-2 bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight"
          >
            Ben
          </h1>
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-100 mb-4">
            {{ t('hero.role') }}
          </h2>
          <p class="text-lg text-gray-400 leading-relaxed mb-6 max-w-lg">
            {{ t('hero.tagline') }}
          </p>
          <div class="flex gap-4 flex-wrap md:flex-row flex-col md:items-start">
            <a
              href="#contact"
              class="px-8 py-3.5 rounded font-semibold no-underline transition-all inline-block border-2 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 text-center"
            >
              {{ t('hero.ctaButton') }}
            </a>
            <a
              href="https://www.linkedin.com/in/chihpin/"
              target="_blank"
              rel="noopener noreferrer"
              class="px-8 py-3.5 rounded font-semibold no-underline transition-all inline-block border-2 bg-transparent text-gray-100 border-gray-600 hover:border-blue-500 hover:text-blue-500 hover:-translate-y-0.5 text-center"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div class="flex justify-center items-center order-2">
          <CodeWindow />
        </div>
      </div>
    </div>
  </section>
</template>
