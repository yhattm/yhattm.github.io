<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="bg-gray-800 border-t border-gray-600 py-6 text-center text-gray-400 text-sm">
    <div class="max-w-7xl mx-auto px-6">
      <p class="m-0">{{ t('footer.copyright') }}</p>
    </div>
  </footer>
</template>
