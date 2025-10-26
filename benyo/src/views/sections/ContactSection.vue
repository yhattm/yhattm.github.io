<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section id="contact" class="contact">
    <div class="container">
      <h2 class="section-title">{{ t('contact.title') }}</h2>
      <p class="contact-description">{{ t('contact.description') }}</p>
      <div class="contact-links">
        <a
          href="https://www.linkedin.com/in/chihpin/"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-link"
        >
          <span class="contact-icon">in</span>
          <span>LinkedIn</span>
        </a>
        <a
          href="https://github.com/yhattm"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-link"
        >
          <span class="contact-icon">GH</span>
          <span>GitHub</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding: var(--spacing-xl) 0;
  background: var(--dark);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--spacing-md);
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-description {
  text-align: center;
  color: var(--text-muted);
  font-size: 1.125rem;
  margin-bottom: var(--spacing-lg);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.contact-links {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--dark-700);
  border: 2px solid var(--dark-600);
  border-radius: var(--radius-md);
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.125rem;
  transition: var(--transition);
  min-width: 200px;
  justify-content: center;
}

.contact-link:hover {
  border-color: var(--primary);
  background: var(--dark-600);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
}

.contact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--primary);
  color: white;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .contact-description {
    font-size: 1rem;
  }

  .contact-links {
    flex-direction: column;
    align-items: stretch;
  }

  .contact-link {
    min-width: auto;
  }
}
</style>
