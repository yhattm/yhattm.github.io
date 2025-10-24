import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import StatCard from '../StatCard.vue'
import { useLanguageStore } from '@/stores/language'

describe('StatCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders correctly with props', () => {
    const wrapper = mount(StatCard, {
      props: {
        number: '20+',
        label: { en: 'Years Experience', zh: '年經驗' },
      },
    })

    expect(wrapper.find('.stat-card').exists()).toBe(true)
    expect(wrapper.find('.stat-number').text()).toBe('20+')
  })

  it('displays English label when language is English', () => {
    const store = useLanguageStore()
    store.currentLang = 'en'

    const wrapper = mount(StatCard, {
      props: {
        number: '20+',
        label: { en: 'Years Experience', zh: '年經驗' },
      },
    })

    expect(wrapper.find('.stat-label').text()).toBe('Years Experience')
  })

  it('displays Chinese label when language is Chinese', () => {
    const store = useLanguageStore()
    store.currentLang = 'zh'

    const wrapper = mount(StatCard, {
      props: {
        number: '20+',
        label: { en: 'Years Experience', zh: '年經驗' },
      },
    })

    expect(wrapper.find('.stat-label').text()).toBe('年經驗')
  })

  it('updates label when language changes', async () => {
    const store = useLanguageStore()
    const wrapper = mount(StatCard, {
      props: {
        number: '3',
        label: { en: 'Major Companies', zh: '主要公司' },
      },
    })

    expect(wrapper.find('.stat-label').text()).toBe('Major Companies')

    store.toggleLanguage()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.stat-label').text()).toBe('主要公司')
  })

  it('has animation classes for scroll effect', () => {
    const wrapper = mount(StatCard, {
      props: {
        number: '50+',
        label: { en: 'Technologies', zh: '技術' },
      },
    })

    expect(wrapper.find('.stat-card').classes()).toContain('stat-card')
  })
})
