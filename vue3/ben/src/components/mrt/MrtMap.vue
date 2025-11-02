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
const polylines = ref<L.Polyline[]>([])

onMounted(() => {
  if (!mapContainer.value) return

  // Initialize map centered on Taipei Main Station
  map = L.map(mapContainer.value).setView([25.047924, 121.517081], 12)

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map)

  // Render lines and markers
  renderLines()
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

// Group stations by line and draw connecting lines
function renderLines() {
  if (!map) return

  // Clear existing polylines
  polylines.value.forEach((line) => line.remove())
  polylines.value = []

  // Group stations by line
  const lineGroups = new Map<string, Station[]>()
  props.stations.forEach((station) => {
    if (!lineGroups.has(station.line)) {
      lineGroups.set(station.line, [])
    }
    lineGroups.get(station.line)!.push(station)
  })

  // Draw polyline for each line
  lineGroups.forEach((stations) => {
    if (stations.length < 2) return

    // Sort stations by ID to maintain line order
    const sortedStations = [...stations].sort((a, b) => {
      const numA = parseInt(a.id.replace(/[^0-9]/g, ''))
      const numB = parseInt(b.id.replace(/[^0-9]/g, ''))
      return numA - numB
    })

    // Get coordinates for the line
    const coordinates: [number, number][] = sortedStations.map((station) => [
      station.lat,
      station.lng,
    ])

    // Get line color (safe since we checked length > 1)
    const lineColor = sortedStations[0]?.lineColor || '#888888'

    // Create polyline
    const polyline = L.polyline(coordinates, {
      color: lineColor,
      weight: 4,
      opacity: 0.7,
      smoothFactor: 1,
    }).addTo(map!)

    polylines.value.push(polyline)
  })
}

function renderMarkers() {
  if (!map) return

  // Clear existing markers
  markers.value.forEach((marker) => marker.remove())
  markers.value.clear()

  props.stations.forEach((station) => {
    const isOrigin = station.id === props.selectedOrigin
    const stationName = locale.value === 'zh' ? station.nameZh : station.nameEn

    let fareText = ''
    let markerSize = 28
    let fontSize = '11px'

    // Calculate fare to display in marker
    if (props.selectedOrigin && !isOrigin) {
      const fare = calculateFare(props.selectedOrigin, station.id, props.fares)
      if (fare !== null) {
        fareText = `$${fare}`
        markerSize = 36
        fontSize = '12px'
      } else {
        fareText = 'N/A'
        markerSize = 32
        fontSize = '10px'
      }
    } else if (isOrigin) {
      fareText = '起點'
      markerSize = 40
      fontSize = '11px'
    }

    // Create custom icon with fare inside circle
    const iconHtml = `
      <div style="
        position: relative;
        width: ${markerSize}px;
        height: ${markerSize}px;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${station.lineColor};
          border: ${isOrigin ? '3px solid #000' : '2px solid #fff'};
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            color: #fff;
            font-size: ${fontSize};
            font-weight: bold;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            text-align: center;
            line-height: 1;
          ">${fareText}</span>
        </div>
      </div>
    `

    const icon = L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [markerSize, markerSize],
      iconAnchor: [markerSize / 2, markerSize / 2],
    })

    const marker = L.marker([station.lat, station.lng], { icon })
      .addTo(map!)
      .bindTooltip(stationName, {
        permanent: false,
        direction: 'top',
        offset: [0, -markerSize / 2 - 5],
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
  background: transparent !important;
  border: none !important;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}

/* Ensure polylines appear behind markers */
:deep(.leaflet-overlay-pane) {
  z-index: 400;
}

:deep(.leaflet-marker-pane) {
  z-index: 600;
}
</style>