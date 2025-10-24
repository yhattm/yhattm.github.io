import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import TechItem from '../TechItem.vue'

describe('TechItem', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders correctly with props', () => {
    const wrapper = mount(TechItem, {
      props: {
        icon: 'Go',
        name: 'Golang',
        proficiency: 95,
      },
    })

    expect(wrapper.find('.tech-item').exists()).toBe(true)
    expect(wrapper.find('.tech-icon').exists()).toBe(true)
    expect(wrapper.find('.tech-name').exists()).toBe(true)
    expect(wrapper.find('.tech-bar').exists()).toBe(true)
  })

  it('displays icon text', () => {
    const wrapper = mount(TechItem, {
      props: {
        icon: 'Go',
        name: 'Golang',
        proficiency: 95,
      },
    })

    expect(wrapper.find('.tech-icon').text()).toBe('Go')
  })

  it('displays technology name', () => {
    const wrapper = mount(TechItem, {
      props: {
        icon: 'AWS',
        name: 'AWS Services',
        proficiency: 90,
      },
    })

    expect(wrapper.find('.tech-name').text()).toBe('AWS Services')
  })

  it('has progress bar fill element', () => {
    const wrapper = mount(TechItem, {
      props: {
        icon: 'K8s',
        name: 'Kubernetes',
        proficiency: 85,
      },
    })

    expect(wrapper.find('.tech-bar-fill').exists()).toBe(true)
  })

  it('accepts different proficiency levels', () => {
    const proficiencies = [70, 80, 90, 100]

    proficiencies.forEach((proficiency) => {
      const wrapper = mount(TechItem, {
        props: {
          icon: 'Test',
          name: 'Test Tech',
          proficiency,
        },
      })

      expect(wrapper.props('proficiency')).toBe(proficiency)
    })
  })

  it('has correct structure for animations', () => {
    const wrapper = mount(TechItem, {
      props: {
        icon: 'TS',
        name: 'TypeScript',
        proficiency: 85,
      },
    })

    const item = wrapper.find('.tech-item')
    expect(item.exists()).toBe(true)

    const bar = wrapper.find('.tech-bar')
    const barFill = wrapper.find('.tech-bar-fill')

    expect(bar.exists()).toBe(true)
    expect(barFill.exists()).toBe(true)
  })
})
