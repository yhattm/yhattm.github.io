<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useLanguageStore } from './stores/language'
import LanguageToggle from './components/LanguageToggle.vue'
import NavBar from './components/NavBar.vue'

const languageStore = useLanguageStore()

onMounted(() => {
  languageStore.loadPreference()
})
</script>

<template>
  <LanguageToggle />
  <NavBar />
  <RouterView />
</template>

<style scoped>
/* Minimal app-level styles - component-specific styles are scoped */
</style>
