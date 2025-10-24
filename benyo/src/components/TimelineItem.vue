<script setup lang="ts">
import { ref } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { useLanguageStore, type BilingualText } from '@/stores/language'

interface Props {
  date: BilingualText
  company: string
  role: BilingualText
  description: BilingualText
  tags: string[]
}

defineProps<Props>()

const languageStore = useLanguageStore()
const { isVisible, targetRef } = useScrollAnimation(0.1)
const isHovered = ref(false)
</script>

<template>
  <div
    ref="targetRef"
    class="timeline-item"
    :class="{ 'is-visible': isVisible }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="timeline-marker" :class="{ 'is-hovered': isHovered }"></div>
    <div class="timeline-content">
      <div class="timeline-date">{{ languageStore.t(date) }}</div>
      <h3 class="timeline-title">{{ company }}</h3>
      <h4 class="timeline-subtitle">{{ languageStore.t(role) }}</h4>
      <p class="timeline-description">{{ languageStore.t(description) }}</p>
      <div class="tech-tags">
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-item {
  position: relative;
  padding-left: 3rem;
  padding-bottom: var(--spacing-lg);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.timeline-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 0.75rem;
  top: 2rem;
  bottom: 0;
  width: 2px;
  background: var(--dark-600);
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 0.25rem;
  width: 2rem;
  height: 2rem;
  background: var(--primary);
  border: 4px solid var(--dark);
  border-radius: 50%;
  z-index: 1;
  transition: var(--transition);
}

.timeline-marker.is-hovered {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  transform: scale(1.1);
}

.timeline-content {
  background: var(--dark-700);
  border: 1px solid var(--dark-600);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  transition: var(--transition);
}

.timeline-content:hover {
  border-color: var(--primary);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.1);
}

.timeline-date {
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
}

.timeline-title {
  color: var(--text);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
}

.timeline-subtitle {
  color: var(--primary);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.timeline-description {
  color: var(--text);
  line-height: 1.6;
  margin-bottom: var(--spacing-sm);
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag {
  background: var(--dark-600);
  color: var(--text);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--dark-600);
  transition: var(--transition);
}

.tag:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

@media (max-width: 768px) {
  .timeline-item {
    padding-left: 2rem;
  }

  .timeline-marker {
    width: 1.5rem;
    height: 1.5rem;
  }

  .timeline-title {
    font-size: 1.25rem;
  }

  .timeline-subtitle {
    font-size: 1rem;
  }
}
</style>
