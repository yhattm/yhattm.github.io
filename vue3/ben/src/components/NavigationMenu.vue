<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// Map route names to tab values
const currentTab = computed(() => {
  const routeName = route.name as string
  switch (routeName) {
    case 'tools-home':
      return 'home'
    case 'settings':
      return 'settings'
    case 'about':
      return 'about'
    case 'app-info':
      return 'app-info'
    default:
      return 'home'
  }
})

const handleTabChange = (value: string | number) => {
  const val = String(value)
  switch (val) {
    case 'home':
      router.push('/')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'about':
      router.push('/about')
      break
    case 'app-info':
      router.push('/app-info')
      break
  }
}
</script>

<template>
  <nav class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto px-4">
      <Tabs :model-value="currentTab" @update:model-value="handleTabChange" class="w-full">
        <TabsList class="w-full justify-start h-14 bg-transparent border-0">
          <TabsTrigger
            value="home"
            class="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 sm:px-6"
          >
            {{ t('nav.home') }}
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            class="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 sm:px-6"
          >
            {{ t('nav.settings') }}
          </TabsTrigger>
          <TabsTrigger
            value="about"
            class="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 sm:px-6"
          >
            {{ t('nav.about') }}
          </TabsTrigger>
          <TabsTrigger
            value="app-info"
            class="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 sm:px-6"
          >
            {{ t('nav.appInfo') }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  </nav>
</template>