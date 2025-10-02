import { api } from '@/lib/api'
import { Allocation, AllocationCreate, AllocationList, AllocationFilter, AllocationSummary } from '@/types/allocation'

export const allocationsService = {
  getAllocations: async (params: AllocationFilter = {}): Promise<AllocationList> => {
    const response = await api.get('/allocations', { params })
    return response.data
  },

  getAllocation: async (id: number): Promise<Allocation> => {
    const response = await api.get(`/allocations/${id}`)
    return response.data
  },

  createAllocation: async (data: AllocationCreate): Promise<Allocation> => {
    const response = await api.post('/allocations', data)
    return response.data
  },

  updateAllocation: async (id: number, data: Partial<AllocationCreate>): Promise<Allocation> => {
    const response = await api.put(`/allocations/${id}`, data)
    return response.data
  },

  deleteAllocation: async (id: number): Promise<void> => {
    await api.delete(`/allocations/${id}`)
  },

  getAllocationSummary: async (): Promise<AllocationSummary> => {
    const response = await api.get('/allocations/stats/total-value')
    return response.data
  }
}