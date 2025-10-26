<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CodeWindow from '@/components/CodeWindow.vue'

const { t } = useI18n()
</script>

<template>
  <section id="home" class="hero">
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <div class="hero-tag">{{ t('hero.greeting') }}</div>
          <h1 class="hero-title">Ben</h1>
          <h2 class="hero-subtitle">{{ t('hero.role') }}</h2>
          <p class="hero-description">{{ t('hero.tagline') }}</p>
          <div class="hero-cta">
            <a href="#contact" class="btn btn-primary">{{ t('hero.ctaButton') }}</a>
            <a
              href="https://www.linkedin.com/in/chihpin/"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-secondary"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div class="hero-visual">
          <CodeWindow />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: var(--spacing-xl) 0;
  background: linear-gradient(to bottom, var(--dark) 0%, var(--dark-800) 100%);
  position: relative;
  overflow: hidden;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  align-items: center;
}

.hero-tag {
  color: var(--text-muted);
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-xs);
  letter-spacing: -0.025em;
}

.hero-subtitle {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: var(--spacing-sm);
}

.hero-description {
  font-size: 1.125rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: var(--spacing-md);
  max-width: 500px;
}

.hero-cta {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.btn {
  padding: 0.875rem 2rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
  display: inline-block;
  border: 2px solid transparent;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.btn-primary:hover {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--text);
  border-color: var(--dark-600);
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .hero-title {
    font-size: 3rem;
  }

  .hero-subtitle {
    font-size: 1.5rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-visual {
    order: 2;
  }

  .hero-text {
    order: 1;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: var(--spacing-lg) 0;
    min-height: auto;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .hero-cta {
    flex-direction: column;
  }

  .btn {
    text-align: center;
  }
}
</style>
