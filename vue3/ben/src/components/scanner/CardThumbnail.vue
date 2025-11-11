<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useBusinessCardStore } from '@/stores/businessCard'

const props = defineProps<{
  imageId: string
}>()

const emit = defineEmits<{
  click: []
}>()

const store = useBusinessCardStore()
const imageUrl = ref<string | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    imageUrl.value = await store.getCardThumbnailUrl(props.imageId)
  } catch (err) {
    console.error('Failed to load thumbnail:', err)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
  }
})
</script>

<template>
  <div
    class="w-full h-32 bg-muted rounded-md overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
    @click="emit('click')"
  >
    <div v-if="isLoading" class="text-sm text-muted-foreground">Loading...</div>
    <img v-else-if="imageUrl" :src="imageUrl" alt="Card thumbnail" class="w-full h-full object-cover" />
    <div v-else class="text-sm text-muted-foreground">No image</div>
  </div>
</template>
