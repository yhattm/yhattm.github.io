// Field Parser for Business Card OCR Text
// 名片 OCR 文字的欄位解析器

import type { CardData } from '@/types/business-card'

/**
 * Regex patterns for extracting contact information
 * 提取聯絡資訊的正則表達式模式
 */
const PATTERNS = {
  // Email: simple pattern for most email addresses
  // 電子郵件：大多數電子郵件地址的簡單模式
  email: /[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/gi,

  // Phone: various formats including international, parentheses, dashes, spaces
  // 電話：各種格式，包括國際、括號、破折號、空格
  phone:
    /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}|\d{2,4}-\d{3,4}-\d{3,4}/g,

  // URL: http/https URLs
  // 網址：http/https 網址
  url: /https?:\/\/[\w.-]+\.[\w]{2,}(\/[^\s]*)?/gi,

  // Social media patterns
  // 社群媒體模式
  linkedin: /linkedin\.com\/in\/[\w-]+/gi,
  twitter: /twitter\.com\/[\w]+/gi,
  facebook: /facebook\.com\/[\w.]+/gi,

  // Fax: similar to phone but often labeled
  // 傳真：類似電話但通常有標籤
  fax: /(?:fax|傳真)[:：]?\s*(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/gi,
}

/**
 * Parse OCR text and extract structured contact fields
 * 解析 OCR 文字並提取結構化聯絡欄位
 */
export function parseCardFields(ocrText: string): CardData {
  const lines = ocrText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const cardData: CardData = {}

  // Extract email
  const emailMatch = ocrText.match(PATTERNS.email)
  if (emailMatch && emailMatch.length > 0) {
    cardData.email = emailMatch[0]
  }

  // Extract phone (excluding fax)
  const phoneMatches = ocrText.match(PATTERNS.phone)
  if (phoneMatches && phoneMatches.length > 0) {
    // Filter out fax numbers if they're labeled
    const phones = phoneMatches.filter((p) => {
      const context = ocrText.substring(
        Math.max(0, ocrText.indexOf(p) - 10),
        ocrText.indexOf(p),
      )
      return !/(fax|傳真)/i.test(context)
    })
    if (phones.length > 0) {
      cardData.phone = phones[0]
    }
  }

  // Extract fax
  const faxMatch = ocrText.match(PATTERNS.fax)
  if (faxMatch && faxMatch.length > 0) {
    // Clean up "fax:" or "傳真:" prefix
    cardData.fax = faxMatch[0].replace(/(?:fax|傳真)[:：]?\s*/gi, '').trim()
  }

  // Extract website URL
  const urlMatches = ocrText.match(PATTERNS.url)
  if (urlMatches && urlMatches.length > 0) {
    cardData.website = urlMatches[0]
  }

  // Extract social media
  const socialMediaMatches = [
    ...(ocrText.match(PATTERNS.linkedin) || []),
    ...(ocrText.match(PATTERNS.twitter) || []),
    ...(ocrText.match(PATTERNS.facebook) || []),
  ]
  if (socialMediaMatches.length > 0) {
    cardData.socialMedia = socialMediaMatches.join(', ')
  }

  // Heuristic: first non-empty line is often the name
  // 啟發式：第一個非空白行通常是姓名
  if (lines.length > 0 && lines[0]) {
    const firstLine = lines[0]
    // Skip if it's too long (likely company name or address)
    if (firstLine.length < 50 && !PATTERNS.email.test(firstLine)) {
      cardData.name = firstLine
    }
  }

  // Heuristic: second line is often the title/position
  // 啟發式：第二行通常是職稱/職位
  if (lines.length > 1 && lines[1]) {
    const secondLine = lines[1]
    // Skip if it looks like email, phone, or URL
    if (
      secondLine.length < 60 &&
      !PATTERNS.email.test(secondLine) &&
      !PATTERNS.phone.test(secondLine) &&
      !PATTERNS.url.test(secondLine)
    ) {
      cardData.title = secondLine
    }
  }

  // Heuristic: look for company name
  // 啟發式：尋找公司名稱
  // Often appears after name/title or has keywords like "Inc.", "Ltd.", "Corp.", "公司"
  const companyKeywords = /\b(inc\.|ltd\.|corp\.|limited|company|公司|有限|股份)\b/i
  const companyLine = lines.find((line) => companyKeywords.test(line))
  if (companyLine && companyLine.length < 100) {
    cardData.company = companyLine
  } else if (lines.length > 2 && lines[2]) {
    // Fallback: third line might be company if not already identified
    const thirdLine = lines[2]
    if (
      thirdLine.length < 100 &&
      !PATTERNS.email.test(thirdLine) &&
      !PATTERNS.phone.test(thirdLine) &&
      !PATTERNS.url.test(thirdLine) &&
      thirdLine !== cardData.name &&
      thirdLine !== cardData.title
    ) {
      cardData.company = thirdLine
    }
  }

  // Heuristic: address is often one of the longer lines without email/phone/url
  // 啟發式：地址通常是不含電子郵件/電話/網址的較長行之一
  const addressLine = lines.find(
    (line) =>
      line.length > 20 &&
      line.length < 200 &&
      !PATTERNS.email.test(line) &&
      !PATTERNS.phone.test(line) &&
      !PATTERNS.url.test(line) &&
      line !== cardData.name &&
      line !== cardData.title &&
      line !== cardData.company,
  )
  if (addressLine) {
    cardData.address = addressLine
  }

  return cardData
}

/**
 * Clean and normalize extracted field value
 * 清理並規範化提取的欄位值
 */
export function cleanFieldValue(value: string | undefined): string | undefined {
  if (!value) return undefined
  return value.trim().replace(/\s+/g, ' ')
}

/**
 * Merge manual edits with OCR extracted data
 * 將手動編輯與 OCR 提取的資料合併
 */
export function mergeCardData(extracted: CardData, manual: Partial<CardData>): CardData {
  return {
    ...extracted,
    ...manual,
  }
}
