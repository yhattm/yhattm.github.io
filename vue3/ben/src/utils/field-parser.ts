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
  // Must have separators (-, ., space, parentheses) or be of specific length
  phone:
    /(\+?\d{1,3}[-.\s])\(?\d{2,4}\)?[-.\s]\d{3,4}[-.\s]\d{3,4}|\(?\d{2,4}\)?[-.\s]\d{3,4}[-.\s]\d{3,4}|\d{2,4}-\d{3,4}-\d{3,4}/g,

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

  // Chinese job titles
  // 中文職稱
  chineseTitle: /^(董事長|總經理|執行長|副總經理|副總裁|總裁|經理|主任|部長|課長|組長|專員|主管|顧問|總監)$/,

  // Company registration number (Taiwan)
  // 公司統一編號（台灣）
  taxId: /(?:統編|統一編號|Tax\s*ID)[:：]?\s*(\d{8})/gi,

  // Address keywords for better detection
  // 地址關鍵字以提高偵測準確度
  addressKeywords: /(?:地址|址|address|展示館|辦公室|office)[:：]?\s*/gi,
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

  // Special case: if only one line and contains company keywords, treat as company
  // 特殊情況：如果只有一行且包含公司關鍵字，則視為公司名稱
  // Note: \b doesn't work with Chinese, so we use lookahead/lookbehind or just match the pattern
  const companyKeywords = /(inc\.|ltd\.|corp\.|limited|company|公司|有限公司|股份|集團|企業)/i
  if (lines.length === 1 && companyKeywords.test(lines[0])) {
    cardData.company = lines[0]
    return cardData
  }

  // Special case: if two lines, first is company, second is address
  // 特殊情況：如果兩行，第一行是公司，第二行是地址
  if (
    lines.length === 2 &&
    companyKeywords.test(lines[0]) &&
    /(?:市|區|路|街|巷|弄|號|樓|street|road|avenue|floor)/i.test(lines[1])
  ) {
    cardData.company = lines[0]
    cardData.address = lines[1]
    return cardData
  }

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

  // Extract company registration/tax ID (Taiwan)
  // 提取公司統一編號（台灣）
  const taxIdMatch = ocrText.match(PATTERNS.taxId)
  if (taxIdMatch && taxIdMatch.length > 0) {
    // Extract just the 8-digit number
    const numberMatch = taxIdMatch[0].match(/\d{8}/)
    if (numberMatch) {
      // Store in a custom field or append to company info
      // For now, we'll note it exists but not add to CardData interface
      // You may want to extend CardData to include taxId field
    }
  }

  // Heuristic: first non-empty line is often the name
  // 啟發式：第一個非空白行通常是姓名
  // Support bilingual names (Chinese + English)
  if (lines.length > 0 && lines[0]) {
    const firstLine = lines[0]
    // Skip if it's too long (likely company name or address)
    // Allow longer names for bilingual (Chinese + English) names
    if (firstLine.length < 80 && !PATTERNS.email.test(firstLine) && !PATTERNS.phone.test(firstLine)) {
      cardData.name = firstLine
    }
  }

  // Heuristic: second line is often the title/position
  // 啟發式：第二行通常是職稱/職位
  // Enhanced: Check for Chinese titles explicitly
  if (lines.length > 1 && lines[1]) {
    const secondLine = lines[1]
    // Check if it matches a known Chinese title
    if (PATTERNS.chineseTitle.test(secondLine.trim())) {
      cardData.title = secondLine
    }
    // Or if it looks like a generic title
    else if (
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
  // (companyKeywords already defined above for early return case)
  const companyLine = lines.find((line) => companyKeywords.test(line))
  if (companyLine && companyLine.length < 100) {
    cardData.company = companyLine
  } else {
    // Fallback: third line might be company if not already identified
    // or if it's just a company name without keywords (for simple cases)
    for (let i = 2; i < Math.min(lines.length, 6); i++) {
      const line = lines[i]
      if (
        line &&
        line.length > 2 &&
        line.length < 100 &&
        !PATTERNS.email.test(line) &&
        !PATTERNS.phone.test(line) &&
        !PATTERNS.url.test(line) &&
        !PATTERNS.chineseTitle.test(line.trim()) &&
        line !== cardData.name &&
        line !== cardData.title
      ) {
        // Check if line looks like a company (has company keywords or is short enough)
        if (companyKeywords.test(line) || (line.length < 50 && i <= 3)) {
          cardData.company = line
          break
        }
      }
    }
  }

  // Heuristic: address is often one of the longer lines without email/phone/url
  // 啟發式：地址通常是不含電子郵件/電話/網址的較長行之一
  // Enhanced: Check for address keywords in Chinese and English
  const addressLines = lines.filter((line) => {
    // Check if line has address keywords
    const hasAddressKeyword = /(?:地址|址|address|展示館|辦公室|office)[:：]/i.test(line)

    // Check if line looks like an address (contains city/street keywords)
    const looksLikeAddress = /(?:市|區|路|街|巷|弄|號|樓|street|road|avenue|floor)/i.test(line)

    return (
      (hasAddressKeyword || looksLikeAddress) &&
      line.length > 10 &&
      line.length < 200 &&
      !PATTERNS.email.test(line) &&
      !PATTERNS.phone.test(line) &&
      !PATTERNS.url.test(line) &&
      line !== cardData.name &&
      line !== cardData.title &&
      line !== cardData.company
    )
  })

  if (addressLines.length > 0) {
    // Clean up address keywords and join multiple addresses
    const cleanedAddresses = addressLines.map((line) =>
      line.replace(PATTERNS.addressKeywords, '').trim()
    )
    // For now, just use the first address found
    // You could join multiple addresses with separator if needed
    cardData.address = cleanedAddresses[0]
  } else {
    // Fallback: find longer lines that might be addresses
    const fallbackAddressLine = lines.find(
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
    if (fallbackAddressLine) {
      cardData.address = fallbackAddressLine
    }
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
