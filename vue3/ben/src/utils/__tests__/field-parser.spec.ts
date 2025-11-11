import { describe, it, expect } from 'vitest'
import { parseCardFields, cleanFieldValue, mergeCardData } from '../field-parser'
import type { CardData } from '@/types/business-card'

describe('parseCardFields', () => {
  describe('English business cards', () => {
    it('should parse a simple English business card', () => {
      const ocrText = `John Doe
CEO
Acme Corporation
john.doe@acme.com
+1-555-123-4567
123 Main Street, New York, NY 10001`

      const result = parseCardFields(ocrText)

      expect(result.name).toBe('John Doe')
      expect(result.title).toBe('CEO')
      expect(result.company).toBe('Acme Corporation')
      expect(result.email).toBe('john.doe@acme.com')
      expect(result.phone).toBe('+1-555-123-4567')
      expect(result.address).toContain('123 Main Street')
    })

    it('should extract phone numbers in various formats', () => {
      const ocrText1 = 'Phone: (02) 1234-5678'
      const ocrText2 = 'Mobile: 0912-345-678'
      const ocrText3 = 'Tel: 02 1234 5678'

      expect(parseCardFields(ocrText1).phone).toBeTruthy()
      expect(parseCardFields(ocrText2).phone).toBeTruthy()
      expect(parseCardFields(ocrText3).phone).toBeTruthy()
    })

    it('should extract website URLs', () => {
      const ocrText = `Company Inc.
https://www.example.com
contact@example.com`

      const result = parseCardFields(ocrText)

      expect(result.website).toBe('https://www.example.com')
    })

    it('should extract social media links', () => {
      const ocrText = `Jane Smith
linkedin.com/in/janesmith
twitter.com/janesmith`

      const result = parseCardFields(ocrText)

      expect(result.socialMedia).toContain('linkedin.com/in/janesmith')
      expect(result.socialMedia).toContain('twitter.com/janesmith')
    })

    it('should distinguish fax from phone', () => {
      const ocrText = `Company Ltd.
Phone: 02-1234-5678
Fax: 02-8765-4321`

      const result = parseCardFields(ocrText)

      expect(result.phone).toBe('02-1234-5678')
      expect(result.fax).toBe('02-8765-4321')
    })
  })

  describe('Chinese business cards', () => {
    it('should parse Chinese business card with bilingual name', () => {
      const ocrText = `鄭禾珈 Appa
董事長
郡暉有限公司
0928-568-881
統編:60681878
地址:台北市大同區承德路一段17號9樓`

      const result = parseCardFields(ocrText)

      expect(result.name).toBe('鄭禾珈 Appa')
      expect(result.title).toBe('董事長')
      expect(result.company).toBe('郡暉有限公司')
      expect(result.phone).toBe('0928-568-881')
    })

    it('should recognize Chinese company keywords', () => {
      const ocrText1 = '台灣科技股份有限公司'
      const ocrText2 = '北京互聯網有限公司'
      const ocrText3 = '香港貿易公司'

      expect(parseCardFields(ocrText1).company).toBeTruthy()
      expect(parseCardFields(ocrText2).company).toBeTruthy()
      expect(parseCardFields(ocrText3).company).toBeTruthy()
    })

    it('should recognize Chinese job titles', () => {
      const ocrText1 = `王小明
總經理
科技公司`

      const ocrText2 = `李華
副總裁
貿易公司`

      expect(parseCardFields(ocrText1).title).toBe('總經理')
      expect(parseCardFields(ocrText2).title).toBe('副總裁')
    })

    it('should handle traditional Chinese addresses', () => {
      const ocrText = `公司名稱
台北市信義區信義路五段7號101樓`

      const result = parseCardFields(ocrText)

      expect(result.address).toBeTruthy()
      if (result.address) {
        expect(result.address).toContain('台北市')
        expect(result.address).toContain('信義路')
      }
    })

    it('should distinguish fax in Chinese', () => {
      const ocrText = `公司名稱
電話: 02-1234-5678
傳真: 02-8765-4321`

      const result = parseCardFields(ocrText)

      expect(result.phone).toBe('02-1234-5678')
      expect(result.fax).toBe('02-8765-4321')
    })
  })

  describe('Real-world test case: card.jpg', () => {
    it('should accurately parse the test business card', () => {
      // This is the expected OCR output from test/image/card.jpg
      // Tesseract.js output may vary slightly
      const ocrText = `鄭禾珈 Appa
董事長
0928-568-881
郡暉有限公司
統編:60681878
地址:台北市大同區承德路一段17號9樓
展示館:桃園市桃園區經國路11號61樓之1
好好品味生活館
HHPW`

      const result = parseCardFields(ocrText)

      // Name should be detected (may be bilingual)
      expect(result.name).toBeTruthy()
      expect(result.name).toMatch(/鄭禾珈|Appa/)

      // Title should be recognized
      expect(result.title).toBe('董事長')

      // Phone should be extracted
      expect(result.phone).toBe('0928-568-881')

      // Company name should be found
      expect(result.company).toBe('郡暉有限公司')

      // Address should be detected
      expect(result.address).toBeTruthy()
      if (result.address) {
        expect(result.address).toMatch(/台北市|桃園市/)
      }
    })
  })

  describe('Edge cases', () => {
    it('should handle empty OCR text', () => {
      const result = parseCardFields('')

      expect(result).toEqual({})
    })

    it('should handle OCR text with only whitespace', () => {
      const result = parseCardFields('   \n  \n   ')

      expect(result).toEqual({})
    })

    it('should handle OCR text with no recognizable patterns', () => {
      const ocrText = 'Some random text with no contact info'

      const result = parseCardFields(ocrText)

      // Should still try to extract name from first line
      expect(result.name).toBe('Some random text with no contact info')
    })

    it('should not extract phone numbers from long numeric strings', () => {
      const ocrText = '12345678901234567890'

      const result = parseCardFields(ocrText)

      // Should not mistake long numbers as phone
      expect(result.phone).toBeFalsy()
    })

    it('should handle multiple email addresses', () => {
      const ocrText = `Contact
info@company.com
support@company.com`

      const result = parseCardFields(ocrText)

      // Should extract first email
      expect(result.email).toBe('info@company.com')
    })

    it('should handle multiple phone numbers', () => {
      const ocrText = `Contact
Office: 02-1234-5678
Mobile: 0912-345-678`

      const result = parseCardFields(ocrText)

      // Should extract first non-fax phone
      expect(result.phone).toBeTruthy()
    })
  })
})

describe('cleanFieldValue', () => {
  it('should trim whitespace', () => {
    expect(cleanFieldValue('  test  ')).toBe('test')
  })

  it('should normalize multiple spaces to single space', () => {
    expect(cleanFieldValue('hello    world')).toBe('hello world')
  })

  it('should return undefined for empty string', () => {
    expect(cleanFieldValue('')).toBeUndefined()
  })

  it('should return undefined for undefined input', () => {
    expect(cleanFieldValue(undefined)).toBeUndefined()
  })

  it('should handle mixed whitespace characters', () => {
    expect(cleanFieldValue('test \t\n value')).toBe('test value')
  })
})

describe('mergeCardData', () => {
  it('should merge manual edits with extracted data', () => {
    const extracted: CardData = {
      name: 'John Doe',
      email: 'john@example.com',
    }

    const manual: Partial<CardData> = {
      email: 'john.doe@example.com',
      phone: '555-1234',
    }

    const result = mergeCardData(extracted, manual)

    expect(result.name).toBe('John Doe')
    expect(result.email).toBe('john.doe@example.com') // Manual overrides
    expect(result.phone).toBe('555-1234')
  })

  it('should preserve all extracted fields when no manual edits', () => {
    const extracted: CardData = {
      name: 'Jane Smith',
      title: 'CEO',
      company: 'Acme Inc.',
    }

    const result = mergeCardData(extracted, {})

    expect(result).toEqual(extracted)
  })

  it('should allow manual fields to override with empty values', () => {
    const extracted: CardData = {
      name: 'Test',
      phone: '123-456',
    }

    const manual: Partial<CardData> = {
      phone: undefined,
    }

    const result = mergeCardData(extracted, manual)

    expect(result.phone).toBeUndefined()
  })
})
