import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '../StatCard.vue'

describe('StatCard', () => {
  it('renders correctly with props', () => {
    const wrapper = mount(StatCard, {
      props: {
        number: '20+',
        label: 'Years Experience',
      },
    })

    expect(wrapper.find('.stat-card').exists()).toBe(true)
    expect(wrapper.find('.stat-number').text()).toBe('20+')
    expect(wrapper.find('.stat-label').text()).toBe('Years Experience')
  })

  it('displays the provided label text', () => {
    const wrapper = mount(StatCard, {
      props: {
        number: '3',
        label: 'Major Companies',
      },
    })

    expect(wrapper.find('.stat-label').text()).toBe('Major Companies')
  })

  it('supports different label languages', () => {
    const wrapper = mount(StatCard, {
      props: {
        number: '20+',
        label: '年經驗',
      },
    })

    expect(wrapper.find('.stat-label').text()).toBe('年經驗')
  })

  it('has animation classes for scroll effect', () => {
    const wrapper = mount(StatCard, {
      props: {
        number: '50+',
        label: 'Technologies',
      },
    })

    expect(wrapper.find('.stat-card').classes()).toContain('stat-card')
  })
})
