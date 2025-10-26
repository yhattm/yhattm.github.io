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
  <div class="lang-toggle">
    <button
      @click="toggleLanguage"
      class="lang-btn"
      :aria-label="ariaLabel"
      type="button"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<style scoped>
.lang-toggle {
  position: fixed;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  z-index: 1000;
}

.lang-btn {
  background: var(--dark-700);
  color: var(--text);
  border: 2px solid var(--dark-600);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
}

.lang-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
  transform: translateY(-2px);
}

.lang-btn:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
</style>
