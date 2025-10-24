import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import TimelineItem from '../TimelineItem.vue'
import { useLanguageStore } from '@/stores/language'

describe('TimelineItem', () => {
  const defaultProps = {
    date: { en: 'Nov 2017 - Present', zh: '2017年11月 - 至今' },
    company: 'VIVOTEK',
    role: { en: 'R&D Manager', zh: '研發經理' },
    description: {
      en: 'Leading cloud-based video surveillance development',
      zh: '領導雲端影像監控開發',
    },
    tags: ['Golang', 'AWS', 'Kubernetes'],
  }

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders correctly with all props', () => {
    const wrapper = mount(TimelineItem, {
      props: defaultProps,
    })

    expect(wrapper.find('.timeline-item').exists()).toBe(true)
    expect(wrapper.find('.timeline-marker').exists()).toBe(true)
    expect(wrapper.find('.timeline-content').exists()).toBe(true)
  })

  it('displays company name', () => {
    const wrapper = mount(TimelineItem, {
      props: defaultProps,
    })

    expect(wrapper.find('.timeline-title').text()).toBe('VIVOTEK')
  })

  it('displays English date when language is English', () => {
    const store = useLanguageStore()
    store.currentLang = 'en'

    const wrapper = mount(TimelineItem, {
      props: defaultProps,
    })

    expect(wrapper.find('.timeline-date').text()).toBe('Nov 2017 - Present')
  })

  it('displays Chinese date when language is Chinese', () => {
    const store = useLanguageStore()
    store.currentLang = 'zh'

    const wrapper = mount(TimelineItem, {
      props: defaultProps,
    })

    expect(wrapper.find('.timeline-date').text()).toBe('2017年11月 - 至今')
  })

  it('displays English role when language is English', () => {
    const store = useLanguageStore()
    store.currentLang = 'en'

    const wrapper = mount(TimelineItem, {
      props: defaultProps,
    })

    expect(wrapper.find('.timeline-subtitle').text()).toBe('R&D Manager')
  })

  it('displays Chinese role when language is Chinese', () => {
    const store = useLanguageStore()
    store.currentLang = 'zh'

    const wrapper = mount(TimelineItem, {
      props: defaultProps,
    })

    expect(wrapper.find('.timeline-subtitle').text()).toBe('研發經理')
  })

  it('displays all tags', () => {
    const wrapper = mount(TimelineItem, {
      props: defaultProps,
    })

    const tags = wrapper.findAll('.tag')
    expect(tags).toHaveLength(3)
    expect(tags[0].text()).toBe('Golang')
    expect(tags[1].text()).toBe('AWS')
    expect(tags[2].text()).toBe('Kubernetes')
  })

  it('updates description when language changes', async () => {
    const store = useLanguageStore()
    const wrapper = mount(TimelineItem, {
      props: defaultProps,
    })

    expect(wrapper.find('.timeline-description').text()).toBe(
      'Leading cloud-based video surveillance development'
    )

    store.toggleLanguage()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.timeline-description').text()).toBe('領導雲端影像監控開發')
  })

  it('applies hover state to marker', async () => {
    const wrapper = mount(TimelineItem, {
      props: defaultProps,
    })

    const marker = wrapper.find('.timeline-marker')
    expect(marker.classes()).not.toContain('is-hovered')

    await wrapper.find('.timeline-item').trigger('mouseenter')

    expect(marker.classes()).toContain('is-hovered')
  })
})
