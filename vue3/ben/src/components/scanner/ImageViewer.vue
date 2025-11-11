<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useBusinessCardStore } from '@/stores/businessCard'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  imageId: string | null
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const store = useBusinessCardStore()
const imageUrl = ref<string | null>(null)
const isLoading = ref(false)

// Load full-size image when dialog opens
watch(() => props.imageId, async (newImageId) => {
  if (newImageId && props.open) {
    isLoading.value = true
    try {
      imageUrl.value = await store.getCardImageUrl(newImageId)
    } catch (err) {
      console.error('Failed to load full-size image:', err)
    } finally {
      isLoading.value = false
    }
  }
}, { immediate: true })

// Clean up image URL when dialog closes
watch(() => props.open, (isOpen) => {
  if (!isOpen && imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
    imageUrl.value = null
  }
})

// Clean up on unmount
onUnmounted(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
  }
})

function handleClose() {
  emit('update:open', false)
}

// Handle ESC key
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="max-w-4xl w-full p-0">
      <!-- Close button -->
      <div class="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          class="rounded-full bg-black/50 hover:bg-black/70 text-white"
          @click="handleClose"
        >
          <X :size="20" />
        </Button>
      </div>

      <!-- Image container -->
      <div class="relative w-full min-h-[400px] max-h-[80vh] bg-black flex items-center justify-center">
        <div v-if="isLoading" class="text-white">Loading...</div>
        <img
          v-else-if="imageUrl"
          :src="imageUrl"
          alt="Full-size business card"
          class="max-w-full max-h-[80vh] object-contain"
        />
        <div v-else class="text-white">No image available</div>
      </div>
    </DialogContent>
  </Dialog>
</template>
