<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageToggle from './components/LanguageToggle.vue'
import NavBar from './components/NavBar.vue'

const { locale } = useI18n()

onMounted(() => {
  // Set initial lang attribute
  document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'
})

// Update HTML lang attribute when language changes
watch(locale, (newLang) => {
  document.documentElement.lang = newLang === 'zh' ? 'zh-CN' : 'en'
})
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <LanguageToggle />
  <NavBar />
  <RouterView id="main-content" />
</template>

<style scoped>
/* Minimal app-level styles - component-specific styles are scoped */

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 10000;
  border-radius: 0 0 var(--radius-sm) 0;
  font-weight: 600;
}

.skip-link:focus {
  top: 0;
}
</style>
