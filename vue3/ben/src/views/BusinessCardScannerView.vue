<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBusinessCardStore } from '@/stores/businessCard'
import { getOcrService } from '@/services/ocr-service'
import { isValidImageFile, blobToObjectURL, revokeObjectURL } from '@/utils/image-processing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import CardThumbnail from '@/components/scanner/CardThumbnail.vue'
import type { CardData } from '@/types/business-card'

const { t } = useI18n()
const store = useBusinessCardStore()

// State
const isScanning = ref(false)
const ocrProgress = ref(0)
const error = ref<string | null>(null)
const capturedImage = ref<Blob | null>(null)
const imagePreviewUrl = ref<string | null>(null)
const formData = ref<CardData>({})
const rawOcrText = ref('')
const searchQuery = ref('')
const sortBy = ref<'date' | 'name' | 'company'>('date')

// Computed
const filteredCards = computed(() => {
  const searched = store.searchCards(searchQuery.value)
  return store.sortCards(searched, sortBy.value)
})

// Load cards on mount
onMounted(async () => {
  await store.loadCards()
})

// Handle file upload
async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  if (!isValidImageFile(file)) {
    error.value = t('businessCardScanner.invalidFileType')
    return
  }

  await processImage(file)
}

// Process image with OCR
async function processImage(imageFile: Blob) {
  isScanning.value = true
  error.value = null
  ocrProgress.value = 0

  try {
    // Store captured image
    capturedImage.value = imageFile

    // Create preview URL
    if (imagePreviewUrl.value) {
      revokeObjectURL(imagePreviewUrl.value)
    }
    imagePreviewUrl.value = blobToObjectURL(imageFile)

    // Initialize OCR service
    const ocrService = getOcrService()
    await ocrService.isReady()

    // Perform OCR
    const result = await ocrService.recognize(
      imageFile,
      (progress) => {
        ocrProgress.value = Math.round(progress)
      }
    )

    // Set form data
    formData.value = result.extractedData
    rawOcrText.value = result.text

  } catch (err) {
    console.error('OCR processing error:', err)
    error.value = t('businessCardScanner.scanError')
  } finally {
    isScanning.value = false
  }
}

// Save card
async function saveCard() {
  if (!capturedImage.value) {
    error.value = 'No image captured'
    return
  }

  try {
    await store.addCard(formData.value, rawOcrText.value, capturedImage.value)

    // Reset form
    resetForm()

    // Success message (could use toast)
    alert(t('businessCardScanner.messages.cardSaved'))
  } catch (err) {
    console.error('Save card error:', err)
    error.value = t('businessCardScanner.messages.saveFailed')
  }
}

// Reset form
function resetForm() {
  formData.value = {}
  rawOcrText.value = ''
  capturedImage.value = null
  if (imagePreviewUrl.value) {
    revokeObjectURL(imagePreviewUrl.value)
    imagePreviewUrl.value = null
  }
  error.value = null
  ocrProgress.value = 0
}

// Delete card
async function deleteCard(id: string) {
  if (confirm(t('businessCardScanner.confirm.deleteMessage'))) {
    try {
      await store.deleteCard(id)
      alert(t('businessCardScanner.messages.cardDeleted'))
    } catch (err) {
      console.error('Delete card error:', err)
      error.value = t('businessCardScanner.messages.deleteFailed')
    }
  }
}

// Export all cards
function exportCards() {
  try {
    const json = store.exportToJson()

    // Download JSON file
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `business-cards-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    alert(t('businessCardScanner.export.downloadSuccess'))
  } catch (err) {
    console.error('Export error:', err)
    error.value = t('businessCardScanner.export.exportError')
  }
}

// Format timestamp
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString()
}
</script>

<template>
  <main class="min-h-screen p-4 bg-gradient-to-b from-background to-muted/20">
    <div class="container mx-auto max-w-7xl space-y-6">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl md:text-4xl font-bold mb-2">
          {{ t('businessCardScanner.title') }}
        </h1>
        <p class="text-lg text-muted-foreground">
          {{ t('businessCardScanner.subtitle') }}
        </p>
      </div>

      <!-- Error Alert -->
      <Alert v-if="error" variant="destructive" class="mb-4">
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <!-- Scanner Section -->
      <Card>
        <CardHeader>
          <CardTitle>{{ t('businessCardScanner.uploadImage') }}</CardTitle>
          <CardDescription>{{ t('businessCardScanner.uploadInstructions') }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- File Upload -->
          <div class="flex gap-4">
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              @change="handleFileUpload"
              :disabled="isScanning"
            />
          </div>

          <!-- Image Preview -->
          <div v-if="imagePreviewUrl" class="border rounded-lg p-4">
            <img :src="imagePreviewUrl" alt="Card preview" class="max-w-full h-auto max-h-64 mx-auto" />
          </div>

          <!-- OCR Progress -->
          <div v-if="isScanning" class="space-y-2">
            <p class="text-sm text-muted-foreground">{{ t('businessCardScanner.scanning') }}</p>
            <div class="w-full bg-secondary rounded-full h-2">
              <div
                class="bg-primary h-2 rounded-full transition-all"
                :style="{ width: `${ocrProgress}%` }"
              ></div>
            </div>
            <p class="text-xs text-center">{{ ocrProgress }}%</p>
          </div>

          <!-- Card Form -->
          <div v-if="capturedImage && !isScanning" class="space-y-4 border-t pt-4">
            <h3 class="font-semibold">{{ t('businessCardScanner.fields.name') }}</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{{ t('businessCardScanner.fields.name') }}</Label>
                <Input v-model="formData.name" />
              </div>
              <div>
                <Label>{{ t('businessCardScanner.fields.title') }}</Label>
                <Input v-model="formData.title" />
              </div>
              <div>
                <Label>{{ t('businessCardScanner.fields.company') }}</Label>
                <Input v-model="formData.company" />
              </div>
              <div>
                <Label>{{ t('businessCardScanner.fields.phone') }}</Label>
                <Input v-model="formData.phone" />
              </div>
              <div>
                <Label>{{ t('businessCardScanner.fields.email') }}</Label>
                <Input v-model="formData.email" type="email" />
              </div>
              <div>
                <Label>{{ t('businessCardScanner.fields.website') }}</Label>
                <Input v-model="formData.website" />
              </div>
            </div>

            <div class="flex gap-2">
              <Button @click="saveCard" class="flex-1">
                {{ t('businessCardScanner.actions.save') }}
              </Button>
              <Button @click="resetForm" variant="outline">
                {{ t('businessCardScanner.actions.cancel') }}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card List Section -->
      <Card>
        <CardHeader>
          <div class="flex justify-between items-center">
            <div>
              <CardTitle>{{ t('businessCardScanner.list.title') }}</CardTitle>
              <CardDescription>{{ t('businessCardScanner.list.count', { count: store.cardCount }) }}</CardDescription>
            </div>
            <Button v-if="store.hasCards" @click="exportCards" variant="outline">
              {{ t('businessCardScanner.actions.exportAll') }}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <!-- Search and Sort -->
          <div v-if="store.hasCards" class="flex gap-4 mb-4">
            <Input
              v-model="searchQuery"
              :placeholder="t('businessCardScanner.list.search')"
              class="flex-1"
            />
            <select v-model="sortBy" class="border rounded-md px-3 py-2">
              <option value="date">{{ t('businessCardScanner.list.sortDate') }}</option>
              <option value="name">{{ t('businessCardScanner.list.sortName') }}</option>
              <option value="company">{{ t('businessCardScanner.list.sortCompany') }}</option>
            </select>
          </div>

          <!-- Empty State -->
          <div v-if="!store.hasCards" class="text-center py-12">
            <p class="text-muted-foreground mb-2">{{ t('businessCardScanner.list.empty') }}</p>
            <p class="text-sm text-muted-foreground">{{ t('businessCardScanner.list.emptyMessage') }}</p>
          </div>

          <!-- Card List -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card v-for="card in filteredCards" :key="card.id" class="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardThumbnail :image-id="card.imageId" />
              </CardHeader>
              <CardContent class="space-y-2">
                <CardTitle class="text-lg">{{ card.data.name || 'Unknown' }}</CardTitle>
                <CardDescription>{{ card.data.title }}</CardDescription>
                <p v-if="card.data.company" class="text-sm">{{ card.data.company }}</p>
                <p v-if="card.data.email" class="text-sm text-muted-foreground">{{ card.data.email }}</p>
                <p v-if="card.data.phone" class="text-sm text-muted-foreground">{{ card.data.phone }}</p>
                <div class="flex items-center justify-between pt-2">
                  <Badge variant="secondary">{{ formatDate(card.timestamp) }}</Badge>
                  <Button @click="deleteCard(card.id)" variant="ghost" size="sm">
                    {{ t('businessCardScanner.actions.delete') }}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
</template>
