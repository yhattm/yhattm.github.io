<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCamera } from '@/composables/useCamera'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Camera,
  FlipHorizontal,
  Zap,
  ZapOff,
  Focus,
  RotateCw,
  Check,
  X
} from 'lucide-vue-next'

const { t } = useI18n()
const emit = defineEmits<{
  captured: [blob: Blob]
}>()

const {
  stream,
  error: cameraError,
  isActive,
  facingMode,
  capabilities,
  isSupported,
  startCamera,
  stopCamera,
  toggleTorch,
  switchCamera,
  captureImage
} = useCamera()

const videoRef = ref<HTMLVideoElement | null>(null)
const capturedImageUrl = ref<string | null>(null)
const isTorchOn = ref(false)
const isCapturing = ref(false)
const cameraInitialized = ref(false)

// Note: Camera is NOT started automatically on mount (lazy initialization)
// Camera will start on first capture button press

// Clean up on unmount
onUnmounted(() => {
  if (capturedImageUrl.value) {
    URL.revokeObjectURL(capturedImageUrl.value)
  }
  stopCamera()
})

// Watch stream and attach to video element
watch(stream, (newStream) => {
  if (newStream && videoRef.value) {
    videoRef.value.srcObject = newStream
  }
}, { immediate: true })

// Handle torch toggle
async function handleTorchToggle() {
  const success = await toggleTorch(!isTorchOn.value)
  if (success) {
    isTorchOn.value = !isTorchOn.value
  }
}

// Handle camera switch
async function handleCameraSwitch() {
  await switchCamera()
}

// Handle capture (with lazy camera initialization)
async function handleCapture() {
  // Lazy initialization: Start camera on first capture if not already active
  if (!cameraInitialized.value && !isActive.value) {
    const started = await startCamera('environment')
    if (started) {
      cameraInitialized.value = true
      // Give camera a moment to stabilize before capturing
      await new Promise(resolve => setTimeout(resolve, 500))
    } else {
      // Camera failed to start, cannot capture
      return
    }
  }

  if (!videoRef.value) return

  isCapturing.value = true
  const blob = await captureImage(videoRef.value)
  isCapturing.value = false

  if (blob) {
    // Create preview URL
    if (capturedImageUrl.value) {
      URL.revokeObjectURL(capturedImageUrl.value)
    }
    capturedImageUrl.value = URL.createObjectURL(blob)

    // Pause camera
    stopCamera()
  }
}

// Confirm captured image
function confirmImage() {
  if (!capturedImageUrl.value) return

  // Convert URL back to blob and emit
  fetch(capturedImageUrl.value)
    .then(res => res.blob())
    .then(blob => {
      emit('captured', blob)
      retake()
    })
}

// Retake image
async function retake() {
  if (capturedImageUrl.value) {
    URL.revokeObjectURL(capturedImageUrl.value)
    capturedImageUrl.value = null
  }
  // Restart camera (already initialized, so just start the stream)
  await startCamera(facingMode.value)
}
</script>

<template>
  <Card>
    <CardContent class="p-0">
      <!-- Camera not supported -->
      <div v-if="!isSupported()" class="p-8 text-center">
        <p class="text-muted-foreground mb-4">
          {{ t('businessCardScanner.camera.notSupported') }}
        </p>
        <p class="text-sm text-muted-foreground">
          {{ t('businessCardScanner.camera.useUploadInstead') }}
        </p>
      </div>

      <!-- Camera error -->
      <div v-else-if="cameraError" class="p-8 text-center">
        <p class="text-destructive mb-4">{{ cameraError }}</p>
        <p class="text-sm text-muted-foreground">
          {{ t('businessCardScanner.camera.permissionInstructions') }}
        </p>
      </div>

      <!-- Live preview or captured image -->
      <div v-else class="relative aspect-video bg-black overflow-hidden">
        <!-- Live camera preview -->
        <video
          v-show="!capturedImageUrl && isActive"
          ref="videoRef"
          autoplay
          playsinline
          :class="[
            'w-full h-full object-cover',
            facingMode === 'user' ? 'scale-x-[-1]' : ''
          ]"
        />

        <!-- Captured image preview -->
        <img
          v-if="capturedImageUrl"
          :src="capturedImageUrl"
          alt="Captured business card"
          class="w-full h-full object-contain"
        />

        <!-- Camera controls overlay (when live preview) -->
        <div
          v-if="!capturedImageUrl && isActive"
          class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
        >
          <div class="flex items-center justify-center gap-4">
            <!-- Flash/Torch toggle -->
            <Button
              v-if="capabilities.torch"
              variant="ghost"
              size="icon"
              class="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
              @click="handleTorchToggle"
            >
              <Zap v-if="isTorchOn" :size="24" />
              <ZapOff v-else :size="24" />
            </Button>

            <!-- Capture button -->
            <Button
              size="icon"
              class="h-16 w-16 rounded-full bg-white hover:bg-white/90"
              :disabled="isCapturing"
              @click="handleCapture"
            >
              <Camera :size="28" class="text-black" />
            </Button>

            <!-- Camera switch -->
            <Button
              variant="ghost"
              size="icon"
              class="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
              @click="handleCameraSwitch"
            >
              <FlipHorizontal :size="24" />
            </Button>
          </div>
        </div>

        <!-- Captured image controls -->
        <div
          v-if="capturedImageUrl"
          class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
        >
          <div class="flex items-center justify-center gap-4">
            <!-- Retake -->
            <Button
              variant="ghost"
              size="icon"
              class="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
              @click="retake"
            >
              <X :size="24" />
            </Button>

            <!-- Use this image -->
            <Button
              size="lg"
              class="px-8 rounded-full bg-white hover:bg-white/90 text-black"
              @click="confirmImage"
            >
              <Check :size="20" class="mr-2" />
              {{ t('businessCardScanner.camera.useThisImage') }}
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
