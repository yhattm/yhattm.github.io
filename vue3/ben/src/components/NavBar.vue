<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const navOpacity = ref(0.8)
const navShadow = ref('none')
const activeSectionId = ref('home')

const navLinks = computed(() => [
  { href: '#home', text: t('nav.home') },
  { href: '#about', text: t('nav.about') },
  { href: '#experience', text: t('nav.experience') },
  { href: '#tech', text: t('nav.techStack') },
  { href: '#contact', text: t('nav.contact') },
])

const handleScroll = () => {
  const scrollPosition = window.pageYOffset

  // Update navbar opacity based on scroll
  if (scrollPosition > 100) {
    navOpacity.value = 0.95
    navShadow.value = '0 4px 6px rgba(0, 0, 0, 0.1)'
  } else {
    navOpacity.value = 0.8
    navShadow.value = 'none'
  }

  // Update active link based on section in viewport
  const sections = document.querySelectorAll('section[id]')
  sections.forEach((section) => {
    const sectionTop = (section as HTMLElement).offsetTop - 100
    const sectionHeight = (section as HTMLElement).offsetHeight
    const sectionId = section.getAttribute('id')

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight &&
      sectionId
    ) {
      activeSectionId.value = sectionId
    }
  })
}

const smoothScroll = (event: Event, href: string) => {
  event.preventDefault()
  const targetId = href.substring(1)
  const targetElement = document.getElementById(targetId)

  if (targetElement) {
    const offsetTop = targetElement.offsetTop - 80
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    class="backdrop-blur-md sticky top-0 z-[999] border-b border-gray-700 py-4 transition-all"
    :style="{
      background: `rgba(15, 23, 42, ${navOpacity})`,
      boxShadow: navShadow,
    }"
  >
    <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
      <div class="text-2xl md:text-3xl font-bold text-blue-500 tracking-tight">Ben</div>
      <ul class="flex gap-4 md:gap-8 list-none m-0 p-0">
        <li v-for="link in navLinks" :key="link.href">
          <a
            :href="link.href"
            class="text-gray-200 no-underline font-medium transition-colors py-2 relative text-sm md:text-base hover:text-blue-500"
            :class="{ 'text-blue-500 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500': activeSectionId === link.href.substring(1) }"
            @click="smoothScroll($event, link.href)"
          >
            {{ link.text }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
