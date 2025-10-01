import { api } from '@/lib/api'
import { Asset, AssetCreate, AssetList, AssetFilter } from '@/types/asset'

export const assetsService = {
  // Buscar ativos
  getAssets: async (params: AssetFilter = {}): Promise<AssetList> => {
    const response = await api.get('/assets', { params })
    return response.data
  },

  // Buscar ativo por ID
  getAsset: async (id: number): Promise<Asset> => {
    const response = await api.get(`/assets/${id}`)
    return response.data
  },

  // Criar ativo
  createAsset: async (data: AssetCreate): Promise<Asset> => {
    const response = await api.post('/assets', data)
    return response.data
  },

  // Atualizar ativo
  updateAsset: async (id: number, data: Partial<AssetCreate>): Promise<Asset> => {
    const response = await api.put(`/assets/${id}`, data)
    return response.data
  },

  // Deletar ativo
  deleteAsset: async (id: number): Promise<void> => {
    await api.delete(`/assets/${id}`)
  },

  // Buscar ativos do Yahoo Finance
  searchYahooAssets: async (query: string) => {
    const response = await api.get('/assets/yahoo/search', { 
      params: { query } 
    })
    return response.data
  },

  // Buscar dados de um ativo específico do Yahoo Finance
  getYahooFinanceAsset: async (ticker: string) => {
    const response = await api.post('/assets/search', { ticker })
    return response.data
  },

  // Salvar ativo do Yahoo Finance
  saveYahooAsset: async (ticker: string) => {
    const response = await api.post('/assets/yahoo/save', { ticker })
    return response.data
  },

  // Atualizar preços dos ativos
  updateAssetPrices: async () => {
    const response = await api.post('/assets/update-prices')
    return response.data
  }
}