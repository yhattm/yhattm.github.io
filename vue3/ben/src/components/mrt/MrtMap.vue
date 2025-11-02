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

// Define correct route sequences for each line (including branches)
const routeSequences: Record<string, string[][]> = {
  BR: [['BR01', 'BR02', 'BR03', 'BR04', 'BR05', 'BR06', 'BR07', 'BR08', 'BR09', 'BR10', 'BR11', 'BR12', 'BR13', 'BR14', 'BR15', 'BR16', 'BR17', 'BR18', 'BR19', 'BR20', 'BR21', 'BR22', 'BR23', 'BR24']],
  R: [
    ['R02', 'R03', 'R04', 'R05', 'R06', 'R07', 'R08', 'R09', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15', 'R16', 'R17', 'R18', 'R19', 'R20', 'R21', 'R22', 'R23', 'R24', 'R25', 'R26', 'R27', 'R28'], // Main line
    ['R22', 'R22A'], // Xinbeitou branch
  ],
  G: [
    ['G01', 'G02', 'G03', 'G04', 'G05', 'G06', 'G07', 'G08', 'G09', 'G10', 'G11', 'G12', 'G13', 'G14', 'G15', 'G16', 'G17', 'G18', 'G19'], // Main line
    ['G03', 'G03A'], // Xiaobitan branch
  ],
  O: [
    ['O01', 'O02', 'O03', 'O04', 'O05', 'O06', 'O07', 'O08', 'O09', 'O10', 'O11', 'O12', 'O13', 'O14', 'O15', 'O16', 'O17', 'O18', 'O19', 'O20', 'O21'], // Main line (Zhonghe-Xinlu to Huilong)
    ['O12', 'O50', 'O51', 'O52', 'O53', 'O54'], // Luzhou branch
  ],
  BL: [['BL01', 'BL02', 'BL03', 'BL04', 'BL05', 'BL06', 'BL07', 'BL08', 'BL09', 'BL10', 'BL11', 'BL12', 'BL13', 'BL14', 'BL15', 'BL16', 'BL17', 'BL18', 'BL19', 'BL20', 'BL21', 'BL22', 'BL23']],
  Y: [['Y07', 'Y08', 'Y09', 'Y10', 'Y11', 'Y12', 'Y13', 'Y14', 'Y15', 'Y16', 'Y17', 'Y18', 'Y19', 'Y20']], // Circular line (partial)
}

// Group stations by line and draw connecting lines
function renderLines() {
  if (!map) return

  // Clear existing polylines
  polylines.value.forEach((line) => line.remove())
  polylines.value = []

  // Create station lookup map
  const stationMap = new Map<string, Station>()
  props.stations.forEach((station) => {
    stationMap.set(station.id, station)
  })

  // Draw each route segment
  Object.entries(routeSequences).forEach(([, segments]) => {
    segments.forEach((sequence) => {
      // Get coordinates for this segment
      const coordinates: [number, number][] = []
      let lineColor = '#888888'

      sequence.forEach((stationId) => {
        const station = stationMap.get(stationId)
        if (station) {
          coordinates.push([station.lat, station.lng])
          if (lineColor === '#888888') {
            lineColor = station.lineColor
          }
        }
      })

      // Only draw if we have at least 2 points
      if (coordinates.length >= 2) {
        const polyline = L.polyline(coordinates, {
          color: lineColor,
          weight: 4,
          opacity: 0.7,
          smoothFactor: 1,
        }).addTo(map!)

        polylines.value.push(polyline)
      }
    })
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