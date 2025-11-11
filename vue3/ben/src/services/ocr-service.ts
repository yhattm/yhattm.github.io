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
      this.worker = await createWorker('eng+chi_tra', 1, {
        errorHandler: (err) => console.error('Tesseract error:', err),
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
      // Convert Blob/File to image data for Tesseract
      const imageData = await this.blobToImageData(image)

      // Recognize text
      const result = await this.worker.recognize(imageData)

      // Call progress callback with 100% when done
      if (onProgress) {
        onProgress(100)
      }

      const rawText = result.data.text
      const confidence = result.data.confidence

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
