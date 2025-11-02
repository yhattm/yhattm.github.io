<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MrtMap from '@/components/mrt/MrtMap.vue'
import StationSelector from '@/components/mrt/StationSelector.vue'
import type { Station, FareMatrix } from '@/types/mrt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

const { t } = useI18n()

const stations = ref<Station[]>([])
const fares = ref<FareMatrix>({})
const selectedOrigin = ref<string | null>(null)
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

onMounted(async () => {
  try {
    // Dynamically import station and fare data
    const [stationsModule, faresModule] = await Promise.all([
      import('@/data/mrt-stations.json'),
      import('@/data/mrt-fares.json'),
    ])

    stations.value = stationsModule.default as Station[]
    fares.value = faresModule.default as FareMatrix

    isLoading.value = false
  } catch (error) {
    console.error('Failed to load MRT data:', error)
    errorMessage.value = t('mrtFareFinder.error')
    isLoading.value = false
  }
})

function handleOriginSelect(stationId: string) {
  selectedOrigin.value = stationId
}
</script>

<template>
  <main class="min-h-screen p-4 bg-gradient-to-b from-background to-muted/20">
    <div class="container mx-auto max-w-7xl">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-3xl md:text-4xl font-bold mb-2">
          {{ t('mrtFareFinder.title') }}
        </h1>
        <p class="text-lg text-muted-foreground">
          {{ t('mrtFareFinder.subtitle') }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center min-h-[500px]">
        <div class="text-center">
          <div
            class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span class="sr-only">{{ t('mrtFareFinder.loading') }}</span>
          </div>
          <p class="mt-4 text-muted-foreground">{{ t('mrtFareFinder.loading') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <Alert v-else-if="errorMessage" variant="destructive" class="mb-6">
        <AlertDescription>
          {{ errorMessage }}
        </AlertDescription>
      </Alert>

      <!-- Main Content -->
      <div v-else class="grid gap-6 lg:grid-cols-[300px_1fr]">
        <!-- Sidebar with Station Selector -->
        <div class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{{ t('mrtFareFinder.selectOrigin') }}</CardTitle>
              <CardDescription>
                {{ t('mrtFareFinder.selectInstruction') }}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StationSelector
                :stations="stations"
                :selected-origin="selectedOrigin"
                @select-origin="handleOriginSelect"
              />
            </CardContent>
          </Card>

          <!-- Info Card -->
          <Card v-if="selectedOrigin">
            <CardHeader>
              <CardTitle class="text-base">{{ t('mrtFareFinder.infoTitle') }}</CardTitle>
            </CardHeader>
            <CardContent class="text-sm text-muted-foreground space-y-2">
              <p>{{ t('mrtFareFinder.infoDesc1') }}</p>
              <p>{{ t('mrtFareFinder.infoDesc2') }}</p>
            </CardContent>
          </Card>
        </div>

        <!-- Map Container -->
        <Card class="overflow-hidden">
          <div class="h-[600px] lg:h-[700px]">
            <MrtMap
              :stations="stations"
              :selected-origin="selectedOrigin"
              :fares="fares"
              @select-origin="handleOriginSelect"
            />
          </div>
        </Card>
      </div>

      <!-- Instructions -->
      <Card v-if="!isLoading && !errorMessage" class="mt-6">
        <CardHeader>
          <CardTitle class="text-base">{{ t('mrtFareFinder.howToUse') }}</CardTitle>
        </CardHeader>
        <CardContent class="text-sm text-muted-foreground">
          <ol class="list-decimal list-inside space-y-2">
            <li>{{ t('mrtFareFinder.step1') }}</li>
            <li>{{ t('mrtFareFinder.step2') }}</li>
            <li>{{ t('mrtFareFinder.step3') }}</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  </main>
</template>