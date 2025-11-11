// Business Card Store
// 名片 Store

import { defineStore } from 'pinia'
import { ref, computed, toRaw } from 'vue'
import type { BusinessCard, CardData, CardImage } from '@/types/business-card'
import * as db from '@/services/db'
import { processImage, blobToArrayBuffer, arrayBufferToBlob } from '@/utils/image-processing'

/**
 * Business Card Store for managing scanned cards
 * 管理已掃描名片的 Store
 */
export const useBusinessCardStore = defineStore('businessCard', () => {
  // State
  const cards = ref<BusinessCard[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedCardIds = ref<Set<string>>(new Set())

  // Computed
  const cardCount = computed(() => cards.value.length)
  const selectedCount = computed(() => selectedCardIds.value.size)
  const hasCards = computed(() => cards.value.length > 0)

  /**
   * Generate UUID for new cards/images
   * 為新名片/圖片生成 UUID
   */
  function generateId(): string {
    return crypto.randomUUID()
  }

  /**
   * Load all cards from IndexedDB
   * 從 IndexedDB 載入所有名片
   */
  async function loadCards(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      cards.value = await db.getAllCards()
    } catch (e) {
      error.value = 'Failed to load cards'
      console.error('Load cards error:', e)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Add a new business card with image
   * 新增名片及圖片
   */
  async function addCard(cardData: CardData, rawOcr: string, imageFile: Blob): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      // Process image (compress and create thumbnail)
      const processed = await processImage(imageFile)

      // Generate IDs
      const cardId = generateId()
      const imageId = generateId()

      // Convert Blobs to ArrayBuffers for IndexedDB storage
      const imageBuffer = await blobToArrayBuffer(processed.compressed)
      const thumbnailBuffer = await blobToArrayBuffer(processed.thumbnail)

      // Create image record
      const cardImage: CardImage = {
        id: imageId,
        image: imageBuffer,
        thumbnail: thumbnailBuffer,
        imageType: 'image/jpeg',
      }

      // Create card record
      const now = Date.now()
      const businessCard: BusinessCard = {
        id: cardId,
        timestamp: now,
        imageId,
        data: toRaw(cardData), // Convert Vue reactive proxy to plain object
        rawOcr,
        lastModified: now,
      }

      // Save to IndexedDB
      await db.addImage(cardImage)
      await db.addCard(businessCard)

      // Reload cards to update UI
      await loadCards()
    } catch (e) {
      error.value = 'Failed to add card'
      console.error('Add card error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update an existing business card's data
   * 更新現有名片的資料
   */
  async function updateCard(id: string, cardData: Partial<CardData>): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const card = await db.getCard(id)
      if (!card) {
        throw new Error('Card not found')
      }

      // Update card with new data
      const updatedCard: BusinessCard = {
        ...card,
        data: {
          ...card.data,
          ...toRaw(cardData), // Convert Vue reactive proxy to plain object
        },
        lastModified: Date.now(),
      }

      await db.updateCard(updatedCard)
      await loadCards()
    } catch (e) {
      error.value = 'Failed to update card'
      console.error('Update card error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete a business card and its image
   * 刪除名片及其圖片
   */
  async function deleteCard(id: string): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const card = await db.getCard(id)
      if (card) {
        // Delete image first
        await db.deleteImage(card.imageId)
        // Then delete card
        await db.deleteCard(id)
        // Remove from selection if selected
        selectedCardIds.value.delete(id)
        await loadCards()
      }
    } catch (e) {
      error.value = 'Failed to delete card'
      console.error('Delete card error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete multiple cards
   * 刪除多張名片
   */
  async function deleteCards(ids: string[]): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      // Get all cards to find image IDs
      const cardsToDelete = await Promise.all(ids.map((id) => db.getCard(id)))
      const imageIds = cardsToDelete.filter((c) => c !== undefined).map((c) => c!.imageId)

      // Delete images and cards
      await db.deleteImages(imageIds)
      await db.deleteCards(ids)

      // Clear selection
      ids.forEach((id) => selectedCardIds.value.delete(id))

      await loadCards()
    } catch (e) {
      error.value = 'Failed to delete cards'
      console.error('Delete cards error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get a card image by image ID
   * 依圖片 ID 取得名片圖片
   */
  async function getCardImage(imageId: string): Promise<CardImage | undefined> {
    return await db.getImage(imageId)
  }

  /**
   * Get card thumbnail as object URL for display
   * 取得名片縮圖的物件 URL 以供顯示
   */
  async function getCardThumbnailUrl(imageId: string): Promise<string | null> {
    try {
      const cardImage = await db.getImage(imageId)
      if (!cardImage) return null

      const blob = arrayBufferToBlob(cardImage.thumbnail, cardImage.imageType)
      return URL.createObjectURL(blob)
    } catch (err) {
      console.error('Failed to get thumbnail URL:', err)
      return null
    }
  }

  /**
   * Get full card image as object URL for display
   * 取得完整名片圖片的物件 URL 以供顯示
   */
  async function getCardImageUrl(imageId: string): Promise<string | null> {
    try {
      const cardImage = await db.getImage(imageId)
      if (!cardImage) return null

      const blob = arrayBufferToBlob(cardImage.image, cardImage.imageType)
      return URL.createObjectURL(blob)
    } catch (err) {
      console.error('Failed to get image URL:', err)
      return null
    }
  }

  /**
   * Search cards by text (name, company, email, phone)
   * 依文字搜尋名片（姓名、公司、電子郵件、電話）
   */
  function searchCards(query: string): BusinessCard[] {
    if (!query.trim()) {
      return cards.value
    }

    const lowerQuery = query.toLowerCase()
    return cards.value.filter((card) => {
      const searchText = [
        card.data.name,
        card.data.company,
        card.data.email,
        card.data.phone,
        card.data.title,
        card.data.address,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchText.includes(lowerQuery)
    })
  }

  /**
   * Sort cards by different criteria
   * 依不同標準排序名片
   */
  function sortCards(
    cardList: BusinessCard[],
    sortBy: 'date' | 'name' | 'company',
  ): BusinessCard[] {
    const sorted = [...cardList]

    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => b.timestamp - a.timestamp)
      case 'name':
        return sorted.sort((a, b) => {
          const nameA = a.data.name || ''
          const nameB = b.data.name || ''
          return nameA.localeCompare(nameB)
        })
      case 'company':
        return sorted.sort((a, b) => {
          const companyA = a.data.company || ''
          const companyB = b.data.company || ''
          return companyA.localeCompare(companyB)
        })
      default:
        return sorted
    }
  }

  /**
   * Toggle card selection
   * 切換名片選取狀態
   */
  function toggleCardSelection(id: string): void {
    if (selectedCardIds.value.has(id)) {
      selectedCardIds.value.delete(id)
    } else {
      selectedCardIds.value.add(id)
    }
  }

  /**
   * Select all cards
   * 選取所有名片
   */
  function selectAll(): void {
    cards.value.forEach((card) => selectedCardIds.value.add(card.id))
  }

  /**
   * Clear all selections
   * 清除所有選取
   */
  function clearSelection(): void {
    selectedCardIds.value.clear()
  }

  /**
   * Export cards to JSON
   * 將名片匯出為 JSON
   */
  function exportToJson(cardIds?: string[]): string {
    const cardsToExport = cardIds
      ? cards.value.filter((c) => cardIds.includes(c.id))
      : cards.value

    const exportData = {
      exportDate: new Date().toISOString(),
      cardCount: cardsToExport.length,
      cards: cardsToExport.map((card) => ({
        ...card,
        // Note: Images are stored separately in IndexedDB
        imageId: card.imageId,
      })),
    }

    return JSON.stringify(exportData, null, 2)
  }

  /**
   * Get storage usage estimate
   * 取得儲存空間使用量估計
   */
  async function getStorageInfo() {
    return await db.getStorageEstimate()
  }

  return {
    // State
    cards,
    isLoading,
    error,
    selectedCardIds,

    // Computed
    cardCount,
    selectedCount,
    hasCards,

    // Actions
    loadCards,
    addCard,
    updateCard,
    deleteCard,
    deleteCards,
    getCardImage,
    getCardThumbnailUrl,
    getCardImageUrl,
    searchCards,
    sortCards,
    toggleCardSelection,
    selectAll,
    clearSelection,
    exportToJson,
    getStorageInfo,
  }
})
