import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { useWorkouts } from '@/hooks/useWorkouts'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'

global.fetch = vi.fn()

describe('useWorkouts SWR Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initially loads workouts successfully from SWR cache with native fetcher mapping', async () => {
    const mockData = [
      { id: '1', name: 'Workout 1' },
      { id: '2', name: 'Workout 2' }
    ]

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {children}
      </SWRConfig>
    )

    const { result } = renderHook(() => useWorkouts(10), { wrapper })

    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.workouts).toEqual(mockData)
    expect(result.current.hasMore).toBe(false) 
    
    expect(global.fetch).toHaveBeenCalledWith('/api/workouts?limit=10&offset=0&search=')
  })
})
