// Business Card Types
// 名片類型定義

import type { DBSchema } from 'idb'

/**
 * Contact information extracted from a business card
 * 從名片提取的聯絡資訊
 */
export interface CardData {
  name?: string // 姓名
  title?: string // 職稱
  company?: string // 公司
  phone?: string // 電話
  email?: string // 電子郵件
  address?: string // 地址
  website?: string // 網站
  socialMedia?: string // 社群媒體
  fax?: string // 傳真
}

/**
 * Complete business card record
 * 完整的名片記錄
 */
export interface BusinessCard {
  id: string // UUID
  timestamp: number // Unix timestamp (milliseconds) - when card was scanned
  imageId: string // Reference to image in images store
  data: CardData // Extracted contact information
  rawOcr: string // Original OCR text output
  lastModified: number // Unix timestamp (milliseconds) - when card was last edited
}

/**
 * Card image with full-size and thumbnail versions
 * 名片圖片（含全尺寸和縮圖版本）
 */
export interface CardImage {
  id: string // UUID (matches BusinessCard.imageId)
  image: ArrayBuffer // Compressed full-size image (max 1920x1080, JPEG 80%)
  thumbnail: ArrayBuffer // Small preview image (max 200x200, JPEG 70%)
  imageType: string // MIME type (e.g., 'image/jpeg')
}

/**
 * Result from OCR processing
 * OCR 處理結果
 */
export interface OcrResult {
  text: string // Raw OCR text
  confidence: number // OCR confidence score (0-100)
  extractedData: CardData // Parsed contact fields
}

/**
 * IndexedDB schema for business card scanner
 * 名片掃描器的 IndexedDB 架構
 */
export interface CardScannerDB extends DBSchema {
  cards: {
    key: string // BusinessCard.id
    value: BusinessCard
    indexes: {
      'by-timestamp': number // Index for sorting by scan date
    }
  }
  images: {
    key: string // CardImage.id
    value: CardImage
  }
}

/**
 * OCR service interface for extensibility
 * OCR 服務介面（可擴充性）
 */
export interface OcrService {
  /**
   * Process an image and extract text
   * 處理圖片並提取文字
   */
  recognize(
    image: Blob | File,
    onProgress?: (progress: number) => void,
  ): Promise<OcrResult>

  /**
   * Check if OCR service is ready
   * 檢查 OCR 服務是否就緒
   */
  isReady(): Promise<boolean>
}

/**
 * Image processing result
 * 圖片處理結果
 */
export interface ProcessedImage {
  compressed: Blob // Compressed full-size image
  thumbnail: Blob // Thumbnail preview
  originalSize: number // Original file size in bytes
  compressedSize: number // Compressed file size in bytes
}
