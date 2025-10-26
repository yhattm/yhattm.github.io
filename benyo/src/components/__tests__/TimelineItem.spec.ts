import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TimelineItem from '../TimelineItem.vue'

describe('TimelineItem', () => {
  const defaultEnglishProps = {
    date: 'Nov 2017 - Present',
    company: 'VIVOTEK',
    role: 'R&D Manager',
    description: 'Leading cloud-based video surveillance development',
    tags: ['Golang', 'AWS', 'Kubernetes'],
  }

  const defaultChineseProps = {
    date: '2017年11月 - 至今',
    company: 'VIVOTEK',
    role: '研發經理',
    description: '領導雲端影像監控開發',
    tags: ['Golang', 'AWS', 'Kubernetes'],
  }

  it('renders correctly with all props', () => {
    const wrapper = mount(TimelineItem, {
      props: defaultEnglishProps,
    })

    expect(wrapper.find('.timeline-item').exists()).toBe(true)
    expect(wrapper.find('.timeline-marker').exists()).toBe(true)
    expect(wrapper.find('.timeline-content').exists()).toBe(true)
  })

  it('displays company name', () => {
    const wrapper = mount(TimelineItem, {
      props: defaultEnglishProps,
    })

    expect(wrapper.find('.timeline-title').text()).toBe('VIVOTEK')
  })

  it('displays English content', () => {
    const wrapper = mount(TimelineItem, {
      props: defaultEnglishProps,
    })

    expect(wrapper.find('.timeline-date').text()).toBe('Nov 2017 - Present')
    expect(wrapper.find('.timeline-subtitle').text()).toBe('R&D Manager')
    expect(wrapper.find('.timeline-description').text()).toBe(
      'Leading cloud-based video surveillance development'
    )
  })

  it('displays Chinese content', () => {
    const wrapper = mount(TimelineItem, {
      props: defaultChineseProps,
    })

    expect(wrapper.find('.timeline-date').text()).toBe('2017年11月 - 至今')
    expect(wrapper.find('.timeline-subtitle').text()).toBe('研發經理')
    expect(wrapper.find('.timeline-description').text()).toBe('領導雲端影像監控開發')
  })

  it('displays all tags', () => {
    const wrapper = mount(TimelineItem, {
      props: defaultEnglishProps,
    })

    const tags = wrapper.findAll('.tag')
    expect(tags).toHaveLength(3)
    expect(tags[0]!.text()).toBe('Golang')
    expect(tags[1]!.text()).toBe('AWS')
    expect(tags[2]!.text()).toBe('Kubernetes')
  })

  it('applies hover state to marker', async () => {
    const wrapper = mount(TimelineItem, {
      props: defaultEnglishProps,
    })

    const marker = wrapper.find('.timeline-marker')
    expect(marker.classes()).not.toContain('is-hovered')

    await wrapper.find('.timeline-item').trigger('mouseenter')

    expect(marker.classes()).toContain('is-hovered')
  })
})
