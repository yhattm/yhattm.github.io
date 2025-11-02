<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useThemeStore, type ThemeMode } from '../stores/theme'
import { useLanguageStore, type Language } from '../stores/language'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'

const { t } = useI18n()
const themeStore = useThemeStore()
const languageStore = useLanguageStore()

const handleThemeChange = (value: any) => {
  if (value && typeof value === 'string' && (value === 'light' || value === 'dark' || value === 'auto')) {
    themeStore.setThemeMode(value as ThemeMode)
  }
}

const handleLanguageChange = (value: any) => {
  if (value && typeof value === 'string' && (value === 'en' || value === 'zh')) {
    languageStore.setLanguage(value as Language)
  }
}
</script>

<template>
  <main class="min-h-screen p-4 md:p-8">
    <div class="container max-w-3xl mx-auto">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">{{ t('settings.title') }}</h1>
        <p class="text-lg text-muted-foreground">{{ t('settings.subtitle') }}</p>
      </div>

      <div class="space-y-6">
        <!-- Appearance Settings -->
        <Card>
          <CardHeader>
            <CardTitle>{{ t('settings.appearance') }}</CardTitle>
            <CardDescription>{{ t('settings.appearanceDescription') }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="theme-select">{{ t('settings.themeMode') }}</Label>
              <Select :model-value="themeStore.mode" @update:model-value="handleThemeChange">
                <SelectTrigger id="theme-select">
                  <SelectValue :placeholder="t('settings.themeMode')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="light">
                      <div class="flex flex-col items-start">
                        <span>{{ t('theme.light') }}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div class="flex flex-col items-start">
                        <span>{{ t('theme.dark') }}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="auto">
                      <div class="flex flex-col items-start">
                        <span>{{ t('theme.auto') }}</span>
                        <span class="text-xs text-muted-foreground">{{
                          t('theme.autoDescription')
                        }}</span>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <!-- Language Settings -->
        <Card>
          <CardHeader>
            <CardTitle>{{ t('settings.language') }}</CardTitle>
            <CardDescription>{{ t('settings.languageDescription') }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="language-select">{{ t('settings.selectLanguage') }}</Label>
              <Select
                :model-value="languageStore.currentLang"
                @update:model-value="handleLanguageChange"
              >
                <SelectTrigger id="language-select">
                  <SelectValue :placeholder="t('settings.selectLanguage')" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="en"> English </SelectItem>
                    <SelectItem value="zh"> 繁體中文 </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</template>
