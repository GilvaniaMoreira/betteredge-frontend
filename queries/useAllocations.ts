import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { allocationsService } from '@/services/allocations'
import { Allocation, AllocationCreate, AllocationFilter } from '@/types/allocation'
import { toast } from 'react-hot-toast'

export function useAllocations(params: AllocationFilter = {}) {
  return useQuery({
    queryKey: ['allocations', params],
    queryFn: () => allocationsService.getAllocations(params),
  })
}

export function useAllocation(id: number) {
  return useQuery({
    queryKey: ['allocation', id],
    queryFn: () => allocationsService.getAllocation(id),
    enabled: !!id,
  })
}

export function useCreateAllocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AllocationCreate) => allocationsService.createAllocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
      queryClient.invalidateQueries({ queryKey: ['allocation-stats'] })
      toast.success('Alocação criada com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao criar alocação')
    },
  })
}

export function useUpdateAllocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AllocationCreate> }) =>
      allocationsService.updateAllocation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
      queryClient.invalidateQueries({ queryKey: ['allocation', id] })
      queryClient.invalidateQueries({ queryKey: ['allocation-stats'] })
      toast.success('Alocação atualizada com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao atualizar alocação')
    },
  })
}

export function useDeleteAllocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => allocationsService.deleteAllocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
      queryClient.invalidateQueries({ queryKey: ['allocation-stats'] })
      toast.success('Alocação deletada com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao deletar alocação')
    },
  })
}

export function useAllocationSummary() {
  return useQuery({
    queryKey: ['allocation-stats'],
    queryFn: () => allocationsService.getAllocationSummary(),
  })
}


