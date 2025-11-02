<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

const { t } = useI18n()

// These will be injected at build time in Task 3.6
const appVersion = import.meta.env.VITE_APP_VERSION || '0.0.0'
const buildDate = import.meta.env.VITE_BUILD_DATE || new Date().toISOString()

const techStack = [
  { name: 'Vue', version: '3.5.22' },
  { name: 'TypeScript', version: '5.9.0' },
  { name: 'Vite', version: '7.1.12' },
  { name: 'Tailwind CSS', version: '4.1.16' },
  { name: 'shadcn-vue', version: 'latest' },
]

const formattedBuildDate = new Date(buildDate).toLocaleString()
</script>

<template>
  <main class="min-h-screen p-4 md:p-8">
    <div class="container max-w-3xl mx-auto">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">{{ t('appInfo.title') }}</h1>
        <p class="text-lg text-muted-foreground">{{ t('appInfo.subtitle') }}</p>
      </div>

      <div class="space-y-6">
        <!-- App Details -->
        <Card>
          <CardHeader>
            <CardTitle>{{ t('appInfo.title') }}</CardTitle>
            <CardDescription>{{ t('appInfo.description') }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-muted-foreground mb-1">
                  {{ t('appInfo.version') }}
                </p>
                <p class="text-lg font-semibold">v{{ appVersion }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-muted-foreground mb-1">
                  {{ t('appInfo.buildDate') }}
                </p>
                <p class="text-lg font-semibold">{{ formattedBuildDate }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Tech Stack -->
        <Card>
          <CardHeader>
            <CardTitle>{{ t('appInfo.techStack') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              <Badge v-for="tech in techStack" :key="tech.name" variant="secondary" class="px-3 py-1">
                {{ tech.name }} {{ tech.version }}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <!-- Developer Info -->
        <Card>
          <CardHeader>
            <CardTitle>{{ t('appInfo.developer') }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div>
                <p class="text-lg font-medium">Ben</p>
                <p class="text-sm text-muted-foreground">Backend Developer</p>
              </div>
              <Separator />
              <RouterLink to="/about">
                <Button variant="outline">
                  {{ t('appInfo.viewProfile') }}
                </Button>
              </RouterLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</template>
