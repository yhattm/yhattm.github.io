import { describe, it, expect } from 'vitest'
import { calculateFare } from '../fare-calculator'
import type { FareMatrix, Station } from '../../types/mrt'

describe('calculateFare', () => {
  const mockFares: FareMatrix = {
    'BL12-BL13': 20,
    'BL12-BL14': 25,
    'BL13-BL14': 20,
    'R10-R11': 30,
    'BL12-R10': 20,
  }

  const mockStations: Station[] = [
    {
      id: 'BL12',
      nameEn: 'Taipei Main Station',
      nameZh: '台北車站',
      lat: 25.047924,
      lng: 121.517081,
      line: 'BL',
      lineColor: '#0070bd',
    },
    {
      id: 'BL13',
      nameEn: 'Shandao Temple',
      nameZh: '善導寺',
      lat: 25.044473,
      lng: 121.524108,
      line: 'BL',
      lineColor: '#0070bd',
    },
    {
      id: 'G09',
      nameEn: 'Guting',
      nameZh: '古亭',
      lat: 25.026487,
      lng: 121.522638,
      line: 'G',
      lineColor: '#008659',
    },
  ]

  describe('fare matrix lookup', () => {
    it('should return 0 for same station', () => {
      const fare = calculateFare('BL12', 'BL12', mockFares)
      expect(fare).toBe(0)
    })

    it('should return correct fare for valid station pair (direct lookup)', () => {
      const fare = calculateFare('BL12', 'BL13', mockFares)
      expect(fare).toBe(20)
    })

    it('should return correct fare for bidirectional lookup (reverse key)', () => {
      const fare = calculateFare('BL13', 'BL12', mockFares)
      expect(fare).toBe(20) // Should find 'BL12-BL13' when looking for 'BL13-BL12'
    })

    it('should return correct fare for multi-stop journey', () => {
      const fare = calculateFare('BL12', 'BL14', mockFares)
      expect(fare).toBe(25)
    })

    it('should return correct fare for cross-line journey', () => {
      const fare = calculateFare('BL12', 'R10', mockFares)
      expect(fare).toBe(20)
    })

    it('should return null for missing fare data (without stations)', () => {
      const fare = calculateFare('BL12', 'G09', mockFares) // G09 not in mock data
      expect(fare).toBeNull()
    })

    it('should return null for invalid station IDs', () => {
      const fare = calculateFare('INVALID1', 'INVALID2', mockFares)
      expect(fare).toBeNull()
    })

    it('should handle empty fare matrix', () => {
      const emptyFares: FareMatrix = {}
      const fare = calculateFare('BL12', 'BL13', emptyFares)
      expect(fare).toBeNull()
    })
  })

  describe('distance-based calculation (fallback)', () => {
    it('should calculate fare by distance when not in fare matrix', () => {
      const fare = calculateFare('BL12', 'G09', mockFares, mockStations)
      // Distance ~2.5km, should be NT$20
      expect(fare).toBe(20)
    })

    it('should prefer fare matrix over distance calculation', () => {
      const fare = calculateFare('BL12', 'BL13', mockFares, mockStations)
      // Should use fare matrix (20) not distance calculation
      expect(fare).toBe(20)
    })

    it('should return null when station not found in stations array', () => {
      const fare = calculateFare('BL12', 'INVALID', mockFares, mockStations)
      expect(fare).toBeNull()
    })

    it('should calculate correct fare tiers based on distance', () => {
      const longDistanceStations: Station[] = [
        {
          id: 'BL12',
          nameEn: 'Taipei Main Station',
          nameZh: '台北車站',
          lat: 25.047924,
          lng: 121.517081,
          line: 'BL',
          lineColor: '#0070bd',
        },
        {
          id: 'TEST1',
          nameEn: 'Test Station',
          nameZh: '測試站',
          lat: 25.1, // ~6km away
          lng: 121.58,
          line: 'BL',
          lineColor: '#0070bd',
        },
      ]
      const fare = calculateFare('BL12', 'TEST1', {}, longDistanceStations)
      // Distance ~8-10km, should be NT$25 or NT$30
      expect(fare).toBeGreaterThanOrEqual(25)
      expect(fare).toBeLessThanOrEqual(30)
    })
  })
})