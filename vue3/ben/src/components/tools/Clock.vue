<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const now = useNow({ interval: 1000 })
const { locale } = useI18n()

const formattedTime = computed(() => {
  const date = now.value
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: locale.value === 'en',
  }

  return new Intl.DateTimeFormat(locale.value === 'zh' ? 'zh-CN' : 'en-US', options).format(date)
})
</script>

<template>
  <div class="text-center">
    <div
      class="text-6xl md:text-8xl font-bold tabular-nums tracking-tight text-foreground dark:text-foreground"
      role="timer"
      :aria-label="`Current time: ${formattedTime}`"
    >
      {{ formattedTime }}
    </div>
  </div>
</template>
