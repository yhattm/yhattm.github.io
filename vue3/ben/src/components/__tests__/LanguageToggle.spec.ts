import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import LanguageToggle from '../LanguageToggle.vue'

const createTestI18n = () => {
  return createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: {},
      zh: {},
    },
  })
}

describe('LanguageToggle', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders correctly', () => {
    const wrapper = mount(LanguageToggle, {
      global: {
        plugins: [createTestI18n()],
      },
    })
    expect(wrapper.find('.lang-toggle').exists()).toBe(true)
    expect(wrapper.find('.lang-btn').exists()).toBe(true)
  })

  it('displays "中文" when current language is English', () => {
    const i18n = createTestI18n()
    const wrapper = mount(LanguageToggle, {
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.find('.lang-btn').text()).toBe('中文')
  })

  it('displays "English" when current language is Chinese', async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'zh',
      fallbackLocale: 'en',
      messages: {
        en: {},
        zh: {},
      },
    })
    const wrapper = mount(LanguageToggle, {
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.find('.lang-btn').text()).toBe('English')
  })

  it('toggles language when button is clicked', async () => {
    const i18n = createTestI18n()
    const wrapper = mount(LanguageToggle, {
      global: {
        plugins: [i18n],
      },
    })
    expect(i18n.global.locale.value).toBe('en')

    await wrapper.find('.lang-btn').trigger('click')

    expect(i18n.global.locale.value).toBe('zh')
  })

  it('updates button text after toggle', async () => {
    const wrapper = mount(LanguageToggle, {
      global: {
        plugins: [createTestI18n()],
      },
    })
    expect(wrapper.find('.lang-btn').text()).toBe('中文')

    await wrapper.find('.lang-btn').trigger('click')

    expect(wrapper.find('.lang-btn').text()).toBe('English')
  })

  it('has correct ARIA label for English', () => {
    const i18n = createTestI18n()
    const wrapper = mount(LanguageToggle, {
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.find('.lang-btn').attributes('aria-label')).toBe('Switch to Chinese')
  })

  it('has correct ARIA label for Chinese', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'zh',
      fallbackLocale: 'en',
      messages: {
        en: {},
        zh: {},
      },
    })
    const wrapper = mount(LanguageToggle, {
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.find('.lang-btn').attributes('aria-label')).toBe('Switch to English')
  })

  it('has button type attribute', () => {
    const wrapper = mount(LanguageToggle, {
      global: {
        plugins: [createTestI18n()],
      },
    })
    expect(wrapper.find('.lang-btn').attributes('type')).toBe('button')
  })
})
