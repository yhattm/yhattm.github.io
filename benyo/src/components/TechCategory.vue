<script setup lang="ts">
import { useLanguageStore, type BilingualText } from '@/stores/language'
import TechItem from './TechItem.vue'

interface TechItemData {
  icon: string
  name: string
  proficiency: number
}

interface Props {
  title: BilingualText
  items: TechItemData[]
}

defineProps<Props>()

const languageStore = useLanguageStore()
</script>

<template>
  <div class="tech-category">
    <h3 class="tech-category-title">{{ languageStore.t(title) }}</h3>
    <div class="tech-grid">
      <TechItem
        v-for="(item, index) in items"
        :key="index"
        :icon="item.icon"
        :name="item.name"
        :proficiency="item.proficiency"
      />
    </div>
  </div>
</template>

<style scoped>
.tech-category {
  margin-bottom: var(--spacing-lg);
}

.tech-category-title {
  color: var(--text);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--dark-600);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-sm);
}

@media (max-width: 768px) {
  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-xs);
  }

  .tech-category-title {
    font-size: 1.25rem;
  }
}
</style>
