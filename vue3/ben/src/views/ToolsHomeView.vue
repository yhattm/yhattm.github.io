<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Clock from '../components/tools/Clock.vue'
import DateDisplay from '../components/tools/DateDisplay.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

const { t } = useI18n()
const router = useRouter()

const tools = [
  {
    name: t('nav.mrtFareFinder'),
    route: '/mrt-fare-finder',
    description: 'Find MRT fare between stations',
  },
  {
    name: t('nav.businessCardScanner'),
    route: '/business-card-scanner',
    description: 'Scan and manage business cards with OCR',
  },
]
</script>

<template>
  <main class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
    <div class="container max-w-4xl space-y-6">
      <div class="text-center mb-8">
        <h1 class="text-4xl md:text-5xl font-bold mb-2">{{ t('toolsHome.title') }}</h1>
        <p class="text-lg text-muted-foreground">{{ t('toolsHome.subtitle') }}</p>
      </div>

      <!-- Time/Date Card -->
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

      <!-- Tools Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card v-for="tool in tools" :key="tool.route" class="cursor-pointer hover:shadow-lg transition-shadow" @click="router.push(tool.route)">
          <CardHeader>
            <CardTitle>{{ tool.name }}</CardTitle>
            <CardDescription>{{ tool.description }}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" class="w-full">Open Tool</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</template>
