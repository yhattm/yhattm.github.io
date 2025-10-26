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
    class="navbar"
    :style="{
      background: `rgba(15, 23, 42, ${navOpacity})`,
      boxShadow: navShadow,
    }"
  >
    <div class="container">
      <div class="nav-brand">Ben</div>
      <ul class="nav-menu">
        <li v-for="link in navLinks" :key="link.href">
          <a
            :href="link.href"
            class="nav-link"
            :class="{ active: activeSectionId === link.href.substring(1) }"
            @click="smoothScroll($event, link.href)"
          >
            {{ link.text }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 999;
  border-bottom: 1px solid var(--dark-700);
  padding: var(--spacing-sm) 0;
  transition: var(--transition);
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -0.025em;
}

.nav-menu {
  display: flex;
  gap: var(--spacing-md);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
  padding: 0.5rem 0;
  position: relative;
}

.nav-link:hover {
  color: var(--primary);
}

.nav-link.active {
  color: var(--primary);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary);
}

@media (max-width: 768px) {
  .nav-menu {
    gap: var(--spacing-sm);
  }

  .nav-link {
    font-size: 0.875rem;
  }

  .nav-brand {
    font-size: 1.25rem;
  }
}
</style>
