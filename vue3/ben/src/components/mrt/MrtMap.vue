<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Station, FareMatrix } from '@/types/mrt'
import { calculateFare } from '@/utils/fare-calculator'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  stations: Station[]
  selectedOrigin: string | null
  fares: FareMatrix
}>()

const emit = defineEmits<{
  selectOrigin: [stationId: string]
}>()

const { locale } = useI18n()
const mapContainer = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null
const markers = ref<Map<string, L.Marker>>(new Map())

onMounted(() => {
  if (!mapContainer.value) return

  // Initialize map centered on Taipei Main Station
  map = L.map(mapContainer.value).setView([25.047924, 121.517081], 12)

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map)

  // Render station markers
  renderMarkers()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

// Watch for changes to update markers
watch(
  () => [props.selectedOrigin, props.stations, locale.value],
  () => {
    if (map) {
      renderMarkers()
    }
  },
  { deep: true },
)

function renderMarkers() {
  if (!map) return

  // Clear existing markers
  markers.value.forEach((marker) => marker.remove())
  markers.value.clear()

  props.stations.forEach((station) => {
    const isOrigin = station.id === props.selectedOrigin
    const stationName = locale.value === 'zh' ? station.nameZh : station.nameEn

    let labelHtml = stationName

    // If origin is selected and this is not the origin, show fare
    if (props.selectedOrigin && !isOrigin) {
      const fare = calculateFare(props.selectedOrigin, station.id, props.fares)
      if (fare !== null) {
        labelHtml = `${stationName}<br/><strong>NT$${fare}</strong>`
      } else {
        labelHtml = `${stationName}<br/><span style="color: #999;">N/A</span>`
      }
    } else if (isOrigin) {
      labelHtml = `<strong>${stationName}</strong><br/><em style="font-size: 0.8em;">Origin</em>`
    }

    // Create custom icon with station color
    const iconHtml = `
      <div style="
        background: ${station.lineColor};
        border: ${isOrigin ? '3px solid #000' : '2px solid #fff'};
        border-radius: 50%;
        width: ${isOrigin ? '16px' : '12px'};
        height: ${isOrigin ? '16px' : '12px'};
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `

    const icon = L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [isOrigin ? 16 : 12, isOrigin ? 16 : 12],
      iconAnchor: [isOrigin ? 8 : 6, isOrigin ? 8 : 6],
    })

    const marker = L.marker([station.lat, station.lng], { icon })
      .addTo(map!)
      .bindTooltip(labelHtml, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
      })

    // Click handler to select origin
    marker.on('click', () => {
      emit('selectOrigin', station.id)
    })

    markers.value.set(station.id, marker)
  })
}
</script>

<template>
  <div class="mrt-map-wrapper">
    <div ref="mapContainer" class="map-container" />
  </div>
</template>

<style scoped>
.mrt-map-wrapper {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.map-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

/* Override Leaflet styles for custom markers */
:deep(.custom-marker) {
  background: transparent;
  border: none;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}
</style>