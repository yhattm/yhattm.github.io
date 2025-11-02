import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'

export type ThemeMode = 'light' | 'dark' | 'auto'
export type EffectiveTheme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme-mode'

export const useThemeStore = defineStore('theme', () => {
  // State
  const mode = ref<ThemeMode>('auto')
  const prefersDark = usePreferredDark()

  // Computed
  const effectiveTheme = computed<EffectiveTheme>(() => {
    if (mode.value === 'auto') {
      return prefersDark.value ? 'dark' : 'light'
    }
    return mode.value
  })

  // Actions
  const setThemeMode = (newMode: ThemeMode) => {
    mode.value = newMode
    savePreference()
    applyTheme()
  }

  const initializeTheme = () => {
    loadPreference()
    applyTheme()
  }

  const applyTheme = () => {
    const theme = effectiveTheme.value
    const htmlElement = document.documentElement

    // Set data-theme attribute
    htmlElement.setAttribute('data-theme', theme)

    // Toggle dark class for Tailwind compatibility
    if (theme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }

  const savePreference = () => {
    localStorage.setItem(THEME_STORAGE_KEY, mode.value)
  }

  const loadPreference = () => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'auto') {
      mode.value = saved
    }
  }

  // Watch for system preference changes when in auto mode
  watch(
    () => prefersDark.value,
    () => {
      if (mode.value === 'auto') {
        applyTheme()
      }
    },
  )

  return {
    mode,
    effectiveTheme,
    setThemeMode,
    initializeTheme,
  }
})