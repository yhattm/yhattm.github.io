<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <p>{{ t('footer.copyright') }}</p>
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
