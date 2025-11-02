<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import NavigationMenu from './components/NavigationMenu.vue'
import { useThemeStore } from './stores/theme'

const { locale } = useI18n()
const themeStore = useThemeStore()

onMounted(() => {
  // Set initial lang attribute
  document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'

  // Initialize theme
  themeStore.initializeTheme()
})

// Update HTML lang attribute when language changes
watch(locale, (newLang) => {
  document.documentElement.lang = newLang === 'zh' ? 'zh-CN' : 'en'
})
</script>

<template>
  <a
    href="#main-content"
    class="absolute -top-10 left-0 bg-blue-600 text-white px-4 py-2 no-underline z-[10000] rounded-br font-semibold focus:top-0 transition-all"
  >
    Skip to main content
  </a>
  <NavigationMenu />
  <RouterView id="main-content" />
</template>
