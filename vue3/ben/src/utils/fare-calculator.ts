import type { FareMatrix, Station } from '../types/mrt'

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of point 1
 * @param lng1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lng2 Longitude of point 2
 * @returns Distance in kilometers
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Calculate fare based on distance using Taipei MRT's official fare tiers
 * Based on the official fare structure from data.taipei
 * @param distance Distance in kilometers
 * @returns Fare in NT$
 */
function calculateFareByDistance(distance: number): number {
  if (distance <= 5) return 20
  if (distance <= 8) return 25
  if (distance <= 12) return 30
  if (distance <= 16) return 35
  if (distance <= 20) return 40
  if (distance <= 24) return 45
  if (distance <= 28) return 50
  if (distance <= 31) return 55
  if (distance <= 34) return 60
  return 65
}

/**
 * Calculate the fare between two MRT stations
 *
 * @param originId - Origin station ID (e.g., "BL12")
 * @param destId - Destination station ID (e.g., "BL13")
 * @param fares - Fare matrix containing all station pair fares
 * @param stations - Optional array of stations for distance-based fallback calculation
 * @returns Fare amount in NT$, or null if fare not found
 *
 * @example
 * ```ts
 * // Using fare matrix only
 * const fare = calculateFare("BL12", "BL13", fares)
 * // Returns: 20
 *
 * // With distance-based fallback
 * const fare = calculateFare("BL12", "BL13", fares, stations)
 * // Returns: 20 (from matrix) or calculated from distance if not in matrix
 * ```
 */
export function calculateFare(
  originId: string,
  destId: string,
  fares: FareMatrix,
  stations?: Station[],
): number | null {
  // Same station: fare is 0
  if (originId === destId) {
    return 0
  }

  // Try direct lookup (originId-destId)
  const directKey = `${originId}-${destId}`
  if (directKey in fares) {
    return fares[directKey] ?? null
  }

  // Try reverse lookup (destId-originId) for bidirectional fares
  const reverseKey = `${destId}-${originId}`
  if (reverseKey in fares) {
    return fares[reverseKey] ?? null
  }

  // If stations data is provided, calculate fare based on distance
  if (stations && stations.length > 0) {
    const originStation = stations.find((s) => s.id === originId)
    const destStation = stations.find((s) => s.id === destId)

    if (originStation && destStation) {
      const distance = calculateDistance(
        originStation.lat,
        originStation.lng,
        destStation.lat,
        destStation.lng,
      )
      return calculateFareByDistance(distance)
    }
  }

  // Fare not found and cannot calculate
  return null
}