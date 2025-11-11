// IndexedDB Database Service for Business Card Scanner
// 名片掃描器的 IndexedDB 資料庫服務

import { openDB, type IDBPDatabase } from 'idb'
import type { BusinessCard, CardImage, CardScannerDB } from '@/types/business-card'

const DB_NAME = 'business-card-scanner'
const DB_VERSION = 1

let dbInstance: IDBPDatabase<CardScannerDB> | null = null

/**
 * Initialize and open the IndexedDB database
 * 初始化並開啟 IndexedDB 資料庫
 */
export async function initDB(): Promise<IDBPDatabase<CardScannerDB>> {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await openDB<CardScannerDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create cards object store with timestamp index
      // 建立名片物件儲存庫並加上時間戳記索引
      if (!db.objectStoreNames.contains('cards')) {
        const cardsStore = db.createObjectStore('cards', { keyPath: 'id' })
        cardsStore.createIndex('by-timestamp', 'timestamp')
      }

      // Create images object store
      // 建立圖片物件儲存庫
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id' })
      }
    },
  })

  return dbInstance
}

/**
 * Get the database instance (initializes if needed)
 * 取得資料庫實例（需要時初始化）
 */
async function getDB(): Promise<IDBPDatabase<CardScannerDB>> {
  if (!dbInstance) {
    return await initDB()
  }
  return dbInstance
}

// ============================================
// Card Operations 名片操作
// ============================================

/**
 * Get all business cards sorted by timestamp (newest first)
 * 取得所有名片，按時間戳記排序（最新的優先）
 */
export async function getAllCards(): Promise<BusinessCard[]> {
  const db = await getDB()
  const cards = await db.getAllFromIndex('cards', 'by-timestamp')
  // Reverse to get newest first
  return cards.reverse()
}

/**
 * Get a single business card by ID
 * 依 ID 取得單一名片
 */
export async function getCard(id: string): Promise<BusinessCard | undefined> {
  const db = await getDB()
  return await db.get('cards', id)
}

/**
 * Add a new business card
 * 新增名片
 */
export async function addCard(card: BusinessCard): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('cards', 'readwrite')
  await tx.store.add(card)
  await tx.done
}

/**
 * Update an existing business card
 * 更新現有名片
 */
export async function updateCard(card: BusinessCard): Promise<void> {
  const db = await getDB()
  await db.put('cards', card)
}

/**
 * Delete a business card by ID
 * 依 ID 刪除名片
 */
export async function deleteCard(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('cards', id)
}

/**
 * Delete multiple business cards by IDs
 * 依 ID 刪除多張名片
 */
export async function deleteCards(ids: string[]): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('cards', 'readwrite')
  await Promise.all([...ids.map((id) => tx.store.delete(id)), tx.done])
}

// ============================================
// Image Operations 圖片操作
// ============================================

/**
 * Get a card image by ID
 * 依 ID 取得名片圖片
 */
export async function getImage(id: string): Promise<CardImage | undefined> {
  const db = await getDB()
  return await db.get('images', id)
}

/**
 * Add a new card image
 * 新增名片圖片
 */
export async function addImage(image: CardImage): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('images', 'readwrite')
  await tx.store.add(image)
  await tx.done
}

/**
 * Delete a card image by ID
 * 依 ID 刪除名片圖片
 */
export async function deleteImage(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('images', id)
}

/**
 * Delete multiple card images by IDs
 * 依 ID 刪除多張名片圖片
 */
export async function deleteImages(ids: string[]): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('images', 'readwrite')
  await Promise.all([...ids.map((id) => tx.store.delete(id)), tx.done])
}

// ============================================
// Utility Functions 工具函式
// ============================================

/**
 * Get storage usage estimate (if supported by browser)
 * 取得儲存空間使用量估計（如果瀏覽器支援）
 */
export async function getStorageEstimate(): Promise<{
  usage: number
  quota: number
  usagePercent: number
} | null> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate()
    const usage = estimate.usage || 0
    const quota = estimate.quota || 0
    const usagePercent = quota > 0 ? (usage / quota) * 100 : 0

    return {
      usage,
      quota,
      usagePercent,
    }
  }
  return null
}

/**
 * Clear all data from the database
 * 清除資料庫中的所有資料
 */
export async function clearAllData(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['cards', 'images'], 'readwrite')
  await Promise.all([tx.objectStore('cards').clear(), tx.objectStore('images').clear(), tx.done])
}

/**
 * Count total number of cards
 * 計算名片總數
 */
export async function getCardCount(): Promise<number> {
  const db = await getDB()
  return await db.count('cards')
}
