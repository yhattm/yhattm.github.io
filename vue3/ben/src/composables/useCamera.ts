import { ref, onUnmounted } from 'vue'

export interface CameraCapabilities {
  torch?: boolean
  zoom?: boolean
  focusMode?: string[]
}

export function useCamera() {
  const stream = ref<MediaStream | null>(null)
  const error = ref<string | null>(null)
  const isActive = ref(false)
  const facingMode = ref<'user' | 'environment'>('environment')
  const capabilities = ref<CameraCapabilities>({})

  // Check if getUserMedia is supported
  const isSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }

  // Start camera with specified facing mode
  async function startCamera(preferredFacingMode: 'user' | 'environment' = 'environment') {
    if (!isSupported()) {
      error.value = 'Camera API not supported'
      return false
    }

    try {
      facingMode.value = preferredFacingMode

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: preferredFacingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      }

      stream.value = await navigator.mediaDevices.getUserMedia(constraints)
      isActive.value = true
      error.value = null

      // Get camera capabilities
      const videoTrack = stream.value.getVideoTracks()[0]
      if (videoTrack) {
        const caps = videoTrack.getCapabilities() as any
        capabilities.value = {
          torch: caps.torch !== undefined,
          zoom: caps.zoom !== undefined,
          focusMode: caps.focusMode || []
        }
      }

      return true
    } catch (err) {
      console.error('Camera access error:', err)
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          error.value = 'Camera permission denied'
        } else if (err.name === 'NotFoundError') {
          error.value = 'No camera found'
        } else {
          error.value = 'Camera access failed'
        }
      }
      return false
    }
  }

  // Stop camera
  function stopCamera() {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
      stream.value = null
      isActive.value = false
    }
  }

  // Toggle torch/flash
  async function toggleTorch(enabled: boolean) {
    if (!stream.value || !capabilities.value.torch) return false

    try {
      const videoTrack = stream.value.getVideoTracks()[0]
      if (!videoTrack) return false

      await videoTrack.applyConstraints({
        // @ts-ignore - torch is not in standard types yet
        advanced: [{ torch: enabled }]
      })
      return true
    } catch (err) {
      console.error('Torch toggle error:', err)
      return false
    }
  }

  // Set focus mode
  async function setFocusMode(mode: 'continuous' | 'manual') {
    if (!stream.value) return false

    try {
      const videoTrack = stream.value.getVideoTracks()[0]
      if (!videoTrack) return false

      await videoTrack.applyConstraints({
        // @ts-ignore - focusMode may not be in standard types
        advanced: [{ focusMode: mode }]
      })
      return true
    } catch (err) {
      console.error('Focus mode error:', err)
      return false
    }
  }

  // Switch camera (front/rear)
  async function switchCamera() {
    const newFacingMode = facingMode.value === 'user' ? 'environment' : 'user'
    stopCamera()
    return await startCamera(newFacingMode)
  }

  // Capture still image from stream
  function captureImage(videoElement: HTMLVideoElement): Blob | null {
    if (!stream.value || !isActive.value) return null

    try {
      const canvas = document.createElement('canvas')
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) return null

      // Apply mirroring for front camera
      if (facingMode.value === 'user') {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      }

      ctx.drawImage(videoElement, 0, 0)

      return new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/jpeg', 0.9)
      }) as any
    } catch (err) {
      console.error('Capture image error:', err)
      return null
    }
  }

  // Clean up on unmount
  onUnmounted(() => {
    stopCamera()
  })

  return {
    stream,
    error,
    isActive,
    facingMode,
    capabilities,
    isSupported,
    startCamera,
    stopCamera,
    toggleTorch,
    setFocusMode,
    switchCamera,
    captureImage
  }
}
