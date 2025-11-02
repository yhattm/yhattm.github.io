import { describe, it, expect } from 'vitest'
import { calculateFare } from '../fare-calculator'
import type { FareMatrix } from '../../types/mrt'

describe('calculateFare', () => {
  const mockFares: FareMatrix = {
    'BL12-BL13': 20,
    'BL12-BL14': 25,
    'BL13-BL14': 20,
    'R10-R11': 30,
    'BL12-R10': 20,
  }

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

  it('should return null for missing fare data', () => {
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