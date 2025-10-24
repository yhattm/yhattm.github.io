<script setup lang="ts">
import { useLanguageStore, type BilingualText } from '@/stores/language'

const languageStore = useLanguageStore()

const copyrightText: BilingualText = {
  en: '© 2025 Ben. Built with passion for clean code.',
  zh: '© 2025 Ben. 用對簡潔程式碼的熱情打造。',
}
</script>

<template>
  <footer class="footer">
    <div class="container">
      <p>{{ languageStore.t(copyrightText) }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--dark-800);
  border-top: 1px solid var(--dark-600);
  padding: var(--spacing-md) 0;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.footer p {
  margin: 0;
}
</style>
