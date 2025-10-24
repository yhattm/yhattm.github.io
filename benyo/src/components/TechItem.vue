<script setup lang="ts">
import { ref, watch } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

interface Props {
  icon: string
  name: string
  proficiency: number
}

const props = defineProps<Props>()

const { isVisible, targetRef } = useScrollAnimation(0.1)
const animatedProficiency = ref(0)

watch(isVisible, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      animatedProficiency.value = props.proficiency
    }, 100)
  }
})
</script>

<template>
  <div
    ref="targetRef"
    class="tech-item"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="tech-icon">{{ icon }}</div>
    <div class="tech-name">{{ name }}</div>
    <div class="tech-bar">
      <div
        class="tech-bar-fill"
        :style="{ width: `${animatedProficiency}%` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.tech-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: var(--dark-700);
  border: 1px solid var(--dark-600);
  border-radius: var(--radius-md);
  transition: var(--transition);
  opacity: 0;
  transform: translateY(30px);
}

.tech-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.tech-item:hover {
  border-color: var(--primary);
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.2);
  transform: translateY(-5px);
}

.tech-icon {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  text-align: center;
  background: var(--dark-600);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.tech-name {
  color: var(--text);
  font-weight: 600;
  font-size: 0.875rem;
  text-align: center;
}

.tech-bar {
  height: 8px;
  background: var(--dark-600);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.tech-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 4px;
  transition: width 1s ease-out;
  width: 0;
}

@media (max-width: 768px) {
  .tech-item {
    padding: var(--spacing-xs);
  }

  .tech-icon {
    font-size: 1.25rem;
  }

  .tech-name {
    font-size: 0.75rem;
  }
}
</style>
