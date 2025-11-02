import type { FareMatrix } from '../types/mrt'

/**
 * Calculate the fare between two MRT stations
 *
 * @param originId - Origin station ID (e.g., "BL12")
 * @param destId - Destination station ID (e.g., "BL13")
 * @param fares - Fare matrix containing all station pair fares
 * @returns Fare amount in NT$, or null if fare not found
 *
 * @example
 * ```ts
 * const fare = calculateFare("BL12", "BL13", fares)
 * // Returns: 20
 * ```
 */
export function calculateFare(
  originId: string,
  destId: string,
  fares: FareMatrix,
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

  // Fare not found
  return null
}