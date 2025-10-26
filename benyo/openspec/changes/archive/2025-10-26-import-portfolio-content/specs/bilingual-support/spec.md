# Capability: Bilingual Language Support

## ADDED Requirements

### Requirement: Language Toggle Control
The system MUST provide a fixed-position language toggle button that allows users to switch between English and Chinese.

#### Scenario: User toggles to Chinese
**Given** the application displays content in English
**When** the user clicks the language toggle button showing "中文"
**Then** the system:
- Switches all translatable content to Chinese
- Updates button text to "English"
- Saves preference "zh" to localStorage key "preferredLanguage"

#### Scenario: User toggles back to English
**Given** the application displays content in Chinese
**When** the user clicks the language toggle button showing "English"
**Then** the system:
- Switches all translatable content to English
- Updates button text to "中文"
- Saves preference "en" to localStorage key "preferredLanguage"

#### Scenario: Button is accessible from all scroll positions
**Given** the user scrolls to any position on the page
**When** checking the language toggle button visibility
**Then** the button remains visible in fixed position (top-right corner)

---

### Requirement: Bilingual Content Management
The system MUST store and display all user-facing text in both English and Chinese with synchronized updates.

#### Scenario: Content switches language completely
**Given** the user switches language preference
**When** the language store state updates
**Then** ALL following content translates simultaneously:

**Navigation**
- EN: "Home", "About", "Experience", "Tech Stack", "Contact"
- ZH: "首頁", "關於", "經驗", "技術棧", "聯繫"

**Hero Section**
- Greeting: "👋 Hello, I'm" / "👋 你好，我是"
- Role: "Backend Developer" / "後端開發工程師"
- Tagline: "Specializing in Golang, AWS, and Cloud-based Video Surveillance Solutions" / "專注於 Golang、AWS 和雲端影像監控解決方案"
- CTA: "Get in Touch" / "聯繫我"

**About Section**
- Title: "About Me" / "關於我"
- Stats: "Years Experience", "Major Companies", "Technologies" / "年經驗", "主要公司", "技術"

**Experience Section**
- Title: "Professional Experience" / "專業經驗"
- Roles: "R&D Manager", "Cofounder & CTO", "Deputy Manager" / "研發經理", "共同創辦人兼技術長", "副理"

**Tech Stack Section**
- Title: "Tech Stack" / "技術棧"
- Categories: "Backend Development", "Cloud & DevOps", "Frontend & Mobile", "Embedded & IoT" / "後端開發", "雲端與 DevOps", "前端與行動", "嵌入式與物聯網"

**Contact Section**
- Title: "Get in Touch" / "聯繫方式"
- Description: "Interested in collaboration or have a question? Feel free to reach out!" / "有興趣合作或有問題？歡迎聯繫！"

**Footer**
- Text: "© 2025 Ben. Built with passion for clean code." / "© 2025 Ben. 用對簡潔程式碼的熱情打造。"

---

### Requirement: Language Preference Persistence
The system MUST remember user's language preference across sessions using localStorage.

#### Scenario: First visit defaults to English
**Given** the user visits the site for the first time (no localStorage key)
**When** the application initializes
**Then** the system:
- Sets currentLang to "en"
- Displays all content in English
- Shows language toggle button with text "中文"

#### Scenario: Returning user loads saved preference
**Given** localStorage contains key "preferredLanguage" with value "zh"
**When** the user visits the site
**Then** the system:
- Loads language preference from localStorage
- Sets currentLang to "zh"
- Displays all content in Chinese
- Shows language toggle button with text "English"

#### Scenario: Preference persists across page reloads
**Given** the user has toggled language to Chinese
**When** the user refreshes the page
**Then** the system maintains Chinese language display

---

### Requirement: Reactive Language State Management
The system MUST use Pinia store for centralized, reactive language state accessible to all components.

#### Scenario: Language store provides global state
**Given** multiple components need language information
**When** any component accesses the language store
**Then** the component receives:
- `currentLang`: Current language code ('en' | 'zh')
- `toggleLanguage()`: Function to switch languages
- `t()`: Translation helper function

#### Scenario: Store update triggers component re-render
**Given** multiple components display bilingual content
**When** the language store's currentLang changes
**Then** all subscribed components automatically re-render with new language content

---

## Implementation Details

### Language Store (Pinia)
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
```

### Component Usage Pattern
```vue
<script setup lang="ts">
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()

const heroTitle = {
  en: 'Backend Developer',
  zh: '後端開發工程師'
}
</script>

<template>
  <h2>{{ languageStore.t(heroTitle) }}</h2>
</template>
```

### Language Toggle Component
```vue
<script setup lang="ts">
import { useLanguageStore } from '@/stores/language'
import { computed } from 'vue'

const languageStore = useLanguageStore()

const buttonText = computed(() => {
  return languageStore.currentLang === 'en' ? '中文' : 'English'
})
</script>

<template>
  <div class="lang-toggle">
    <button
      @click="languageStore.toggleLanguage()"
      class="lang-btn"
      :aria-label="`Switch to ${languageStore.currentLang === 'en' ? 'Chinese' : 'English'}`"
    >
      {{ buttonText }}
    </button>
  </div>
</template>
```

---

## Accessibility

### ARIA Labels
- Language toggle button MUST have descriptive aria-label indicating target language
- Language changes MUST be announced to screen readers via live region (aria-live="polite")

### Keyboard Navigation
- Language toggle MUST be keyboard accessible (focusable and activatable with Enter/Space)
- Tab order MUST remain logical after language switch
