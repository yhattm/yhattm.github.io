/**
 * Represents a Taipei MRT station with all required information
 */
export interface Station {
  /**
   * Unique station identifier (e.g., "BL12", "R10")
   */
  id: string

  /**
   * Station name in English
   */
  nameEn: string

  /**
   * Station name in Traditional Chinese
   */
  nameZh: string

  /**
   * Latitude coordinate (WGS84 format)
   */
  lat: number

  /**
   * Longitude coordinate (WGS84 format)
   */
  lng: number

  /**
   * MRT line code (e.g., "BL" for Blue Line, "R" for Red Line)
   */
  line: string

  /**
   * Hex color code for the MRT line
   */
  lineColor: string
}

/**
 * Fare matrix mapping station pairs to fare amounts in NT$
 * Key format: "stationId1-stationId2" (e.g., "BL12-BL13")
 * Bidirectional: A-B and B-A should have the same fare
 */
export type FareMatrix = Record<string, number>

/**
 * Helper type for station pair keys in the fare matrix
 */
export type StationPair = `${string}-${string}`