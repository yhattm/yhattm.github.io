<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section id="contact" class="py-20 bg-gray-900">
    <div class="max-w-7xl mx-auto px-6">
      <h2
        class="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent"
      >
        {{ t('contact.title') }}
      </h2>
      <p class="text-center text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
        {{ t('contact.description') }}
      </p>
      <div class="flex justify-center gap-6 flex-wrap md:flex-row flex-col md:items-center">
        <a
          href="https://www.linkedin.com/in/chihpin/"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-4 px-8 py-6 bg-gray-700 border-2 border-gray-600 rounded-lg text-gray-100 no-underline font-semibold text-lg transition-all min-w-[200px] justify-center hover:border-blue-500 hover:bg-gray-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
        >
          <span
            class="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded font-bold text-base"
          >
            in
          </span>
          <span>LinkedIn</span>
        </a>
        <a
          href="https://github.com/yhattm"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-4 px-8 py-6 bg-gray-700 border-2 border-gray-600 rounded-lg text-gray-100 no-underline font-semibold text-lg transition-all min-w-[200px] justify-center hover:border-blue-500 hover:bg-gray-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20"
        >
          <span
            class="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded font-bold text-base"
          >
            GH
          </span>
          <span>GitHub</span>
        </a>
      </div>
    </div>
  </section>
</template>
