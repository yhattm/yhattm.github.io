<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const now = useNow({ interval: 1000 })
const { locale } = useI18n()

const formattedDate = computed(() => {
  const date = now.value
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return new Intl.DateTimeFormat(locale.value === 'zh' ? 'zh-CN' : 'en-US', options).format(date)
})
</script>

<template>
  <div class="text-center">
    <div class="text-xl md:text-2xl text-muted-foreground dark:text-muted-foreground">
      {{ formattedDate }}
    </div>
  </div>
</template>
