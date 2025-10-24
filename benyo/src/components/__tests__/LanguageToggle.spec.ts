import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import LanguageToggle from '../LanguageToggle.vue'
import { useLanguageStore } from '@/stores/language'

describe('LanguageToggle', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders correctly', () => {
    const wrapper = mount(LanguageToggle)
    expect(wrapper.find('.lang-toggle').exists()).toBe(true)
    expect(wrapper.find('.lang-btn').exists()).toBe(true)
  })

  it('displays "中文" when current language is English', () => {
    const wrapper = mount(LanguageToggle)
    const store = useLanguageStore()
    store.currentLang = 'en'

    expect(wrapper.find('.lang-btn').text()).toBe('中文')
  })

  it('displays "English" when current language is Chinese', async () => {
    const store = useLanguageStore()
    store.currentLang = 'zh'
    const wrapper = mount(LanguageToggle)

    expect(wrapper.find('.lang-btn').text()).toBe('English')
  })

  it('toggles language when button is clicked', async () => {
    const wrapper = mount(LanguageToggle)
    const store = useLanguageStore()
    expect(store.currentLang).toBe('en')

    await wrapper.find('.lang-btn').trigger('click')

    expect(store.currentLang).toBe('zh')
  })

  it('updates button text after toggle', async () => {
    const wrapper = mount(LanguageToggle)
    expect(wrapper.find('.lang-btn').text()).toBe('中文')

    await wrapper.find('.lang-btn').trigger('click')

    expect(wrapper.find('.lang-btn').text()).toBe('English')
  })

  it('has correct ARIA label for English', () => {
    const wrapper = mount(LanguageToggle)
    const store = useLanguageStore()
    store.currentLang = 'en'

    expect(wrapper.find('.lang-btn').attributes('aria-label')).toBe('Switch to Chinese')
  })

  it('has correct ARIA label for Chinese', () => {
    const store = useLanguageStore()
    store.currentLang = 'zh'
    const wrapper = mount(LanguageToggle)

    expect(wrapper.find('.lang-btn').attributes('aria-label')).toBe('Switch to English')
  })

  it('has button type attribute', () => {
    const wrapper = mount(LanguageToggle)
    expect(wrapper.find('.lang-btn').attributes('type')).toBe('button')
  })
})
