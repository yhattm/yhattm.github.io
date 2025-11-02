<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Clock from '../components/tools/Clock.vue'
import DateDisplay from '../components/tools/DateDisplay.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const { t } = useI18n()
</script>

<template>
  <main class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
    <div class="container max-w-4xl">
      <div class="text-center mb-8">
        <h1 class="text-4xl md:text-5xl font-bold mb-2">{{ t('toolsHome.title') }}</h1>
        <p class="text-lg text-muted-foreground">{{ t('toolsHome.subtitle') }}</p>
      </div>

      <Card class="shadow-lg">
        <CardHeader>
          <CardTitle class="text-center text-2xl">{{ t('toolsHome.currentTime') }}</CardTitle>
          <CardDescription class="text-center">{{ t('toolsHome.currentDate') }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <Clock />
          <DateDisplay />
        </CardContent>
      </Card>
    </div>
  </main>
</template>
