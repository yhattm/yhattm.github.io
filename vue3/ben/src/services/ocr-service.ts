// OCR Service using Tesseract.js
// 使用 Tesseract.js 的 OCR 服務

import { createWorker, type Worker } from 'tesseract.js'
import type { OcrService, OcrResult, CardData } from '@/types/business-card'
import { parseCardFields } from '@/utils/field-parser'

/**
 * Tesseract.js implementation of OCR service
 * Tesseract.js OCR 服務實作
 */
export class TesseractOcrService implements OcrService {
  private worker: Worker | null = null
  private initialized = false

  /**
   * Initialize Tesseract worker with English and Chinese languages
   * 初始化 Tesseract worker（支援英文和中文）
   */
  private async init(): Promise<void> {
    if (this.initialized && this.worker) {
      return
    }

    try {
      // Create worker with Chinese first (better for Chinese-heavy cards)
      // Use chi_tra (Traditional Chinese) + eng (English)
      // OEM (OCR Engine Mode): 1 = LSTM neural nets only
      this.worker = await createWorker('chi_tra+eng', 1, {
        errorHandler: (err) => console.error('Tesseract error:', err),
        logger: (m) => {
          // Optionally log progress
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
          }
        },
      })

      // Configure Tesseract parameters for better business card recognition
      // PSM 6 = Assume a single uniform block of text (good for business cards)
      // Note: tessedit_ocr_engine_mode must be set during createWorker, not here
      await this.worker.setParameters({
        tessedit_pageseg_mode: '6', // Single block of text
        preserve_interword_spaces: '1', // Preserve spacing
      })

      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize Tesseract worker:', error)
      throw new Error('OCR service initialization failed')
    }
  }

  /**
   * Check if OCR service is ready
   * 檢查 OCR 服務是否就緒
   */
  async isReady(): Promise<boolean> {
    try {
      await this.init()
      return this.initialized
    } catch {
      return false
    }
  }

  /**
   * Process an image and extract text with field parsing
   * 處理圖片並提取文字，包含欄位解析
   */
  async recognize(
    image: Blob | File,
    onProgress?: (progress: number) => void,
  ): Promise<OcrResult> {
    // Initialize worker if needed
    await this.init()

    if (!this.worker) {
      throw new Error('OCR worker not initialized')
    }

    try {
      // Temporarily disable preprocessing to test raw image quality
      // If raw image works better, we'll need to adjust preprocessing algorithm
      // const processedImage = await this.preprocessImage(image)

      // Note: Can't pass logger callback to recognize() due to Web Worker serialization
      // Progress tracking is handled by the worker's init-time logger
      const result = await this.worker.recognize(image)

      // Call progress callback with 100% when done
      if (onProgress) {
        onProgress(100)
      }

      const rawText = result.data.text
      const confidence = result.data.confidence

      console.log('OCR Confidence:', confidence)
      console.log('OCR Raw Text:', rawText)

      // Parse extracted text into structured fields
      const extractedData = parseCardFields(rawText)

      return {
        text: rawText,
        confidence,
        extractedData,
      }
    } catch (error) {
      console.error('OCR recognition failed:', error)
      throw new Error('Failed to process image with OCR')
    }
  }

  /**
   * Preprocess image to improve OCR accuracy
   * 預處理圖片以提高 OCR 準確度
   */
  private async preprocessImage(blob: Blob): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(blob)

      img.onload = () => {
        try {
          // Create canvas
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
          }

          // Set canvas size to image size
          canvas.width = img.width
          canvas.height = img.height

          // Draw image
          ctx.drawImage(img, 0, 0)

          // Get image data for processing
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          // Apply image enhancements
          // 1. Convert to grayscale and increase contrast
          for (let i = 0; i < data.length; i += 4) {
            // Convert to grayscale using luminance formula
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]

            // Increase contrast (simple threshold)
            // Adjust these values if needed: lower threshold = darker, higher = lighter
            const contrast = gray < 128 ? gray * 0.8 : gray * 1.2

            // Clamp to 0-255
            const final = Math.min(255, Math.max(0, contrast))

            data[i] = final // R
            data[i + 1] = final // G
            data[i + 2] = final // B
            // Alpha channel (i+3) stays the same
          }

          // Put processed image data back
          ctx.putImageData(imageData, 0, 0)

          // Clean up
          URL.revokeObjectURL(url)

          resolve(canvas)
        } catch (err) {
          URL.revokeObjectURL(url)
          reject(err)
        }
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load image for preprocessing'))
      }

      img.src = url
    })
  }

  /**
   * Convert Blob to ImageData for Tesseract processing
   * 將 Blob 轉換為 ImageData 供 Tesseract 處理
   */
  private async blobToImageData(blob: Blob): Promise<string | HTMLImageElement> {
    // Tesseract can accept various formats, return blob URL
    return URL.createObjectURL(blob)
  }

  /**
   * Terminate the worker to free resources
   * 終止 worker 以釋放資源
   */
  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate()
      this.worker = null
      this.initialized = false
    }
  }
}

// Singleton instance
// 單例實例
let ocrServiceInstance: TesseractOcrService | null = null

/**
 * Get or create OCR service instance
 * 取得或建立 OCR 服務實例
 */
export function getOcrService(): OcrService {
  if (!ocrServiceInstance) {
    ocrServiceInstance = new TesseractOcrService()
  }
  return ocrServiceInstance
}

/**
 * Cleanup OCR service (call when app unmounts)
 * 清理 OCR 服務（應用程式卸載時呼叫）
 */
export async function cleanupOcrService(): Promise<void> {
  if (ocrServiceInstance) {
    await ocrServiceInstance.terminate()
    ocrServiceInstance = null
  }
}
