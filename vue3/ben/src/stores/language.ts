import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Language = 'en' | 'zh'

export interface BilingualText {
  en: string
  zh: string
}

export const useLanguageStore = defineStore('language', () => {
  const currentLang = ref<Language>('en')

  const toggleLanguage = () => {
    currentLang.value = currentLang.value === 'en' ? 'zh' : 'en'
    savePreference()
  }

  const setLanguage = (lang: Language) => {
    currentLang.value = lang
    savePreference()
  }

  const t = (text: BilingualText): string => {
    return text[currentLang.value]
  }

  const savePreference = () => {
    localStorage.setItem('preferredLanguage', currentLang.value)
  }

  const loadPreference = () => {
    const saved = localStorage.getItem('preferredLanguage')
    if (saved === 'en' || saved === 'zh') {
      currentLang.value = saved
    }
  }

  return {
    currentLang,
    toggleLanguage,
    setLanguage,
    t,
    loadPreference,
  }
})
