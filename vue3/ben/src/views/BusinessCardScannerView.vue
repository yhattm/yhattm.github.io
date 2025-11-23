<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBusinessCardStore } from '@/stores/businessCard'
import { getOcrService } from '@/services/ocr-service'
import { isValidImageFile, blobToObjectURL, revokeObjectURL } from '@/utils/image-processing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import CardThumbnail from '@/components/scanner/CardThumbnail.vue'
import CameraCapture from '@/components/scanner/CameraCapture.vue'
import ImageViewer from '@/components/scanner/ImageViewer.vue'
import type { CardData } from '@/types/business-card'

const { t } = useI18n()
const store = useBusinessCardStore()

// State
const activeTab = ref('camera') // Default to camera on mobile, upload on desktop
const isScanning = ref(false)
const ocrProgress = ref(0)
const error = ref<string | null>(null)
const capturedImage = ref<Blob | null>(null)
const imagePreviewUrl = ref<string | null>(null)
const formData = ref<CardData>({})
const rawOcrText = ref('')
const searchQuery = ref('')
const sortBy = ref<'date' | 'name' | 'company'>('date')

// Image viewer state
const viewerOpen = ref(false)
const viewerImageId = ref<string | null>(null)

// Rescan state
const rescanningCardId = ref<string | null>(null)
const rescanProgress = ref(0)

// Detect if mobile to set default tab
onMounted(() => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  activeTab.value = isMobile ? 'camera' : 'upload'
})

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

// Handle camera capture
async function handleCameraCapture(blob: Blob) {
  await processImage(blob)
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

// View full-size image
function viewImage(imageId: string) {
  viewerImageId.value = imageId
  viewerOpen.value = true
}

// Rescan card with OCR
async function rescanCard(cardId: string) {
  if (!confirm(t('businessCardScanner.confirm.rescanMessage'))) {
    return
  }

  rescanningCardId.value = cardId
  rescanProgress.value = 0
  error.value = null

  try {
    await store.rescanCard(cardId, (progress) => {
      rescanProgress.value = Math.round(progress)
    })

    alert(t('businessCardScanner.messages.rescanSuccess'))
  } catch (err) {
    console.error('Rescan error:', err)
    error.value = t('businessCardScanner.messages.rescanFailed')
  } finally {
    rescanningCardId.value = null
    rescanProgress.value = 0
  }
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

      <!-- Scanner Section with Tabs -->
      <Card>
        <CardHeader>
          <CardTitle>{{ t('businessCardScanner.capture.title') }}</CardTitle>
          <CardDescription>{{ t('businessCardScanner.capture.description') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs v-model="activeTab" class="w-full">
            <TabsList class="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="camera">
                {{ t('businessCardScanner.tabs.camera') }}
              </TabsTrigger>
              <TabsTrigger value="upload">
                {{ t('businessCardScanner.tabs.upload') }}
              </TabsTrigger>
            </TabsList>

            <!-- Camera Tab -->
            <TabsContent value="camera" class="space-y-4">
              <CameraCapture @captured="handleCameraCapture" />
            </TabsContent>

            <!-- Upload Tab -->
            <TabsContent value="upload" class="space-y-4">
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
            </TabsContent>
          </Tabs>

          <!-- OCR Progress (shared across both tabs) -->
          <div v-if="isScanning" class="space-y-2 mt-4">
            <p class="text-sm text-muted-foreground">{{ t('businessCardScanner.scanning') }}</p>
            <div class="w-full bg-secondary rounded-full h-2">
              <div
                class="bg-primary h-2 rounded-full transition-all"
                :style="{ width: `${ocrProgress}%` }"
              ></div>
            </div>
            <p class="text-xs text-center">{{ ocrProgress }}%</p>
          </div>

          <!-- Card Form (shared across both tabs) -->
          <div v-if="capturedImage && !isScanning" class="space-y-4 border-t pt-4 mt-4">
            <h3 class="font-semibold">{{ t('businessCardScanner.form.title') }}</h3>

            <!-- Contact Fields -->
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
              <div>
                <Label>{{ t('businessCardScanner.fields.fax') }}</Label>
                <Input v-model="formData.fax" />
              </div>
              <div>
                <Label>{{ t('businessCardScanner.fields.socialMedia') }}</Label>
                <Input v-model="formData.socialMedia" />
              </div>
            </div>

            <!-- Address Field (full width) -->
            <div>
              <Label>{{ t('businessCardScanner.fields.address') }}</Label>
              <Input v-model="formData.address" />
            </div>

            <!-- Raw OCR Text -->
            <div>
              <Label>{{ t('businessCardScanner.fields.rawOcr') }}</Label>
              <textarea
                v-model="rawOcrText"
                readonly
                class="w-full min-h-[100px] p-2 border rounded-md bg-muted text-sm font-mono whitespace-pre-wrap"
                :placeholder="t('businessCardScanner.fields.rawOcr')"
              />
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
                <CardThumbnail :image-id="card.imageId" @click="viewImage(card.imageId)" />
              </CardHeader>
              <CardContent class="space-y-2">
                <CardTitle class="text-lg">{{ card.data.name || 'Unknown' }}</CardTitle>
                <CardDescription>{{ card.data.title }}</CardDescription>

                <!-- All Contact Fields -->
                <div class="space-y-1 text-sm">
                  <p v-if="card.data.company" class="flex items-start gap-2">
                    <span class="text-muted-foreground min-w-[60px]">{{ t('businessCardScanner.fields.company') }}:</span>
                    <span class="flex-1">{{ card.data.company }}</span>
                  </p>
                  <p v-if="card.data.phone" class="flex items-start gap-2">
                    <span class="text-muted-foreground min-w-[60px]">{{ t('businessCardScanner.fields.phone') }}:</span>
                    <span class="flex-1">{{ card.data.phone }}</span>
                  </p>
                  <p v-if="card.data.email" class="flex items-start gap-2">
                    <span class="text-muted-foreground min-w-[60px]">{{ t('businessCardScanner.fields.email') }}:</span>
                    <span class="flex-1 break-all">{{ card.data.email }}</span>
                  </p>
                  <p v-if="card.data.website" class="flex items-start gap-2">
                    <span class="text-muted-foreground min-w-[60px]">{{ t('businessCardScanner.fields.website') }}:</span>
                    <span class="flex-1 break-all">{{ card.data.website }}</span>
                  </p>
                  <p v-if="card.data.fax" class="flex items-start gap-2">
                    <span class="text-muted-foreground min-w-[60px]">{{ t('businessCardScanner.fields.fax') }}:</span>
                    <span class="flex-1">{{ card.data.fax }}</span>
                  </p>
                  <p v-if="card.data.socialMedia" class="flex items-start gap-2">
                    <span class="text-muted-foreground min-w-[60px]">{{ t('businessCardScanner.fields.socialMedia') }}:</span>
                    <span class="flex-1 break-all">{{ card.data.socialMedia }}</span>
                  </p>
                  <p v-if="card.data.address" class="flex items-start gap-2">
                    <span class="text-muted-foreground min-w-[60px]">{{ t('businessCardScanner.fields.address') }}:</span>
                    <span class="flex-1">{{ card.data.address }}</span>
                  </p>
                </div>

                <!-- Raw OCR Text -->
                <div v-if="card.rawOcr" class="pt-2 border-t">
                  <p class="text-xs text-muted-foreground mb-1">{{ t('businessCardScanner.fields.rawOcr') }}:</p>
                  <div class="bg-muted/50 rounded p-2 text-xs font-mono whitespace-pre-wrap break-words max-h-24 overflow-y-auto">
                    {{ card.rawOcr }}
                  </div>
                </div>

                <div class="flex items-center justify-between pt-2 border-t">
                  <Badge variant="secondary">{{ formatDate(card.timestamp) }}</Badge>
                  <div class="flex gap-2">
                    <Button
                      @click="rescanCard(card.id)"
                      variant="outline"
                      size="sm"
                      :disabled="rescanningCardId === card.id"
                    >
                      <span v-if="rescanningCardId === card.id">
                        {{ t('businessCardScanner.actions.rescanning') }} {{ rescanProgress }}%
                      </span>
                      <span v-else>
                        {{ t('businessCardScanner.actions.rescan') }}
                      </span>
                    </Button>
                    <Button @click="deleteCard(card.id)" variant="ghost" size="sm">
                      {{ t('businessCardScanner.actions.delete') }}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Image Viewer Modal -->
    <ImageViewer :image-id="viewerImageId" :open="viewerOpen" @update:open="viewerOpen = $event" />
  </main>
</template>
