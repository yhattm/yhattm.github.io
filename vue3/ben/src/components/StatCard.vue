<script setup lang="ts">
import { useScrollAnimation } from '@/composables/useScrollAnimation'

interface Props {
  number: string
  label: string
}

const props = defineProps<Props>()

const { isVisible, targetRef } = useScrollAnimation(0.1)
</script>

<template>
  <div
    ref="targetRef"
    class="stat-card"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="stat-number">{{ number }}</div>
    <div class="stat-label">{{ label }}</div>
  </div>
</template>

<style scoped>
.stat-card {
  background: var(--dark-700);
  border: 1px solid var(--dark-600);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  text-align: center;
  transition: var(--transition);
  opacity: 0;
  transform: translateY(30px);
}

.stat-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.stat-card:hover {
  transform: translateY(-10px) scale(1.05);
  border-color: var(--primary);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .stat-number {
    font-size: 2.5rem;
  }

  .stat-card {
    padding: var(--spacing-sm);
  }
}
</style>
