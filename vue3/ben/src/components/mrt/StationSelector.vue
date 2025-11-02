<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Station } from '@/types/mrt'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
  stations: Station[]
  selectedOrigin: string | null
}>()

const emit = defineEmits<{
  selectOrigin: [stationId: string]
}>()

const { t, locale } = useI18n()

// Sort stations alphabetically by name in current language
const sortedStations = computed(() => {
  return [...props.stations].sort((a, b) => {
    const nameA = locale.value === 'zh' ? a.nameZh : a.nameEn
    const nameB = locale.value === 'zh' ? b.nameZh : b.nameEn
    return nameA.localeCompare(nameB, locale.value)
  })
})

function handleValueChange(value: unknown) {
  if (value && typeof value === 'string') {
    emit('selectOrigin', value)
  }
}
</script>

<template>
  <div class="station-selector">
    <label for="origin-station" class="block text-sm font-medium mb-2">
      {{ t('mrtFareFinder.selectOrigin') }}
    </label>
    <Select :model-value="selectedOrigin" @update:model-value="handleValueChange">
      <SelectTrigger id="origin-station" class="w-full">
        <SelectValue :placeholder="t('mrtFareFinder.selectOrigin')" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem
            v-for="station in sortedStations"
            :key="station.id"
            :value="station.id"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: station.lineColor }"
              />
              <span>{{ locale === 'zh' ? station.nameZh : station.nameEn }}</span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<style scoped>
.station-selector {
  width: 100%;
}
</style>