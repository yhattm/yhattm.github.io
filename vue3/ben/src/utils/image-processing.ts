// Image Processing Utilities
// 圖片處理工具

import type { ProcessedImage } from '@/types/business-card'

/**
 * Compress and process an image for storage
 * 壓縮並處理圖片以供儲存
 *
 * @param file - Input image file or blob
 * @returns Processed image with compressed version and thumbnail
 */
export async function processImage(file: Blob | File): Promise<ProcessedImage> {
  const originalSize = file.size

  // Create image element for processing
  const img = await createImageFromBlob(file)

  // Compress main image (max 1920x1080, JPEG 80%)
  const compressed = await compressImage(img, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
  })

  // Generate thumbnail (max 200x200, JPEG 70%)
  const thumbnail = await compressImage(img, {
    maxWidth: 200,
    maxHeight: 200,
    quality: 0.7,
  })

  return {
    compressed,
    thumbnail,
    originalSize,
    compressedSize: compressed.size,
  }
}

/**
 * Create HTMLImageElement from Blob
 * 從 Blob 建立 HTMLImageElement
 */
function createImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(blob)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Compress an image with specified constraints
 * 使用指定約束壓縮圖片
 */
async function compressImage(
  img: HTMLImageElement,
  options: {
    maxWidth: number
    maxHeight: number
    quality: number
  },
): Promise<Blob> {
  const { maxWidth, maxHeight, quality } = options

  // Calculate scaling factor to fit within max dimensions
  const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height)

  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(img.width * scale)
  canvas.height = Math.floor(img.height * scale)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  // Draw scaled image
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  // Convert to Blob with JPEG compression
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to compress image'))
        }
      },
      'image/jpeg',
      quality,
    )
  })
}

/**
 * Validate if a file is a supported image format
 * 驗證檔案是否為支援的圖片格式
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  return validTypes.includes(file.type)
}

/**
 * Get human-readable file size
 * 取得人類可讀的檔案大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Convert Blob to Data URL (for preview)
 * 將 Blob 轉換為 Data URL（用於預覽）
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Convert Blob to ArrayBuffer (for IndexedDB storage)
 * 將 Blob 轉換為 ArrayBuffer（用於 IndexedDB 儲存）
 */
export function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(blob)
  })
}

/**
 * Convert ArrayBuffer to Blob
 * 將 ArrayBuffer 轉換為 Blob
 */
export function arrayBufferToBlob(buffer: ArrayBuffer, type: string = 'image/jpeg'): Blob {
  return new Blob([buffer], { type })
}

/**
 * Create object URL from Blob (more efficient for large images)
 * 從 Blob 建立物件 URL（對大圖片更有效率）
 */
export function blobToObjectURL(blob: Blob): string {
  return URL.createObjectURL(blob)
}

/**
 * Revoke object URL to free memory
 * 撤銷物件 URL 以釋放記憶體
 */
export function revokeObjectURL(url: string): void {
  URL.revokeObjectURL(url)
}
