import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assetsService } from '@/services/assets'
import { Asset, AssetCreate, AssetFilter, YahooSearchSimpleResult, YahooSearchResult } from '@/types/asset'
import { toast } from 'react-hot-toast'

export function useAssets(params: AssetFilter = {}) {
  return useQuery({
    queryKey: ['assets', params],
    queryFn: () => assetsService.getAssets(params),
  })
}

export function useAsset(id: number) {
  return useQuery({
    queryKey: ['asset', id],
    queryFn: () => assetsService.getAsset(id),
    enabled: !!id,
  })
}

export function useCreateAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AssetCreate) => assetsService.createAsset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Ativo criado com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao criar ativo')
    },
  })
}

export function useUpdateAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AssetCreate> }) =>
      assetsService.updateAsset(id, data),
    onSuccess: (_: any, { id }: { id: number; data: Partial<AssetCreate> }) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['asset', id] })
      toast.success('Ativo atualizado com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao atualizar ativo')
    },
  })
}

export function useDeleteAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => assetsService.deleteAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Ativo deletado com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao deletar ativo')
    },
  })
}

export function useSearchYahooAssets(query: string, limit: number = 10) {
  return useQuery({
    queryKey: ['yahoo-assets', query, limit],
    queryFn: () => assetsService.searchYahooAssets(query, limit),
    enabled: !!query && query.length > 0,
  })
}

export function useYahooAssetDetails(ticker: string) {
  return useQuery({
    queryKey: ['yahoo-asset-details', ticker],
    queryFn: () => assetsService.getYahooAssetDetails(ticker),
    enabled: !!ticker,
  })
}



