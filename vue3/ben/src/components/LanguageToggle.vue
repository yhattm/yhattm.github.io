<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const buttonText = computed(() => {
  return locale.value === 'en' ? '中文' : 'English'
})

const ariaLabel = computed(() => {
  return `Switch to ${locale.value === 'en' ? 'Chinese' : 'English'}`
})

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
  localStorage.setItem('preferredLanguage', locale.value)
}
</script>

<template>
  <div class="fixed top-4 right-4 md:right-6 z-[1000]">
    <button
      @click="toggleLanguage"
      class="bg-gray-800 text-gray-100 border-2 border-gray-700 px-4 py-2 rounded cursor-pointer font-medium transition-all text-sm hover:bg-blue-500 hover:border-blue-500 hover:-translate-y-0.5 focus:outline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
      :aria-label="ariaLabel"
      type="button"
    >
      {{ buttonText }}
    </button>
  </div>
</template>
