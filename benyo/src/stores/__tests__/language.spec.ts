import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLanguageStore, type BilingualText } from '../language'

describe('Language Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with English as default language', () => {
      const store = useLanguageStore()
      expect(store.currentLang).toBe('en')
    })
  })

  describe('toggleLanguage', () => {
    it('should toggle from English to Chinese', () => {
      const store = useLanguageStore()
      expect(store.currentLang).toBe('en')

      store.toggleLanguage()

      expect(store.currentLang).toBe('zh')
    })

    it('should toggle from Chinese to English', () => {
      const store = useLanguageStore()
      store.currentLang = 'zh'

      store.toggleLanguage()

      expect(store.currentLang).toBe('en')
    })

    it('should save preference to localStorage when toggling', () => {
      const store = useLanguageStore()

      store.toggleLanguage()

      expect(localStorage.getItem('preferredLanguage')).toBe('zh')
    })
  })

  describe('setLanguage', () => {
    it('should set language to English', () => {
      const store = useLanguageStore()
      store.currentLang = 'zh'

      store.setLanguage('en')

      expect(store.currentLang).toBe('en')
    })

    it('should set language to Chinese', () => {
      const store = useLanguageStore()

      store.setLanguage('zh')

      expect(store.currentLang).toBe('zh')
    })

    it('should save preference to localStorage when setting language', () => {
      const store = useLanguageStore()

      store.setLanguage('zh')

      expect(localStorage.getItem('preferredLanguage')).toBe('zh')
    })
  })

  describe('t (translation helper)', () => {
    it('should return English text when currentLang is en', () => {
      const store = useLanguageStore()
      const text: BilingualText = {
        en: 'Hello',
        zh: '你好',
      }

      const result = store.t(text)

      expect(result).toBe('Hello')
    })

    it('should return Chinese text when currentLang is zh', () => {
      const store = useLanguageStore()
      store.currentLang = 'zh'
      const text: BilingualText = {
        en: 'Hello',
        zh: '你好',
      }

      const result = store.t(text)

      expect(result).toBe('你好')
    })

    it('should update returned text when language changes', () => {
      const store = useLanguageStore()
      const text: BilingualText = {
        en: 'Hello',
        zh: '你好',
      }

      expect(store.t(text)).toBe('Hello')

      store.toggleLanguage()

      expect(store.t(text)).toBe('你好')
    })
  })

  describe('loadPreference', () => {
    it('should load English preference from localStorage', () => {
      localStorage.setItem('preferredLanguage', 'en')
      const store = useLanguageStore()

      store.loadPreference()

      expect(store.currentLang).toBe('en')
    })

    it('should load Chinese preference from localStorage', () => {
      localStorage.setItem('preferredLanguage', 'zh')
      const store = useLanguageStore()

      store.loadPreference()

      expect(store.currentLang).toBe('zh')
    })

    it('should maintain default language when localStorage is empty', () => {
      const store = useLanguageStore()
      expect(store.currentLang).toBe('en')

      store.loadPreference()

      expect(store.currentLang).toBe('en')
    })

    it('should ignore invalid values from localStorage', () => {
      localStorage.setItem('preferredLanguage', 'invalid')
      const store = useLanguageStore()

      store.loadPreference()

      expect(store.currentLang).toBe('en')
    })
  })

  describe('localStorage persistence', () => {
    it('should persist language preference across store instances', () => {
      const store1 = useLanguageStore()
      store1.setLanguage('zh')

      // Create new pinia instance to simulate app reload
      setActivePinia(createPinia())
      const store2 = useLanguageStore()
      store2.loadPreference()

      expect(store2.currentLang).toBe('zh')
    })

    it('should update localStorage when language changes multiple times', () => {
      const store = useLanguageStore()

      store.toggleLanguage() // en -> zh
      expect(localStorage.getItem('preferredLanguage')).toBe('zh')

      store.toggleLanguage() // zh -> en
      expect(localStorage.getItem('preferredLanguage')).toBe('en')

      store.setLanguage('zh')
      expect(localStorage.getItem('preferredLanguage')).toBe('zh')
    })
  })
})
