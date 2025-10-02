import { api } from '@/lib/api'
import { Asset, AssetCreate, AssetList, AssetFilter } from '@/types/asset'

export const assetsService = {
  getAssets: async (params: AssetFilter = {}): Promise<AssetList> => {
    const response = await api.get('/assets', { params })
    return response.data
  },

  getAsset: async (id: number): Promise<Asset> => {
    const response = await api.get(`/assets/${id}`)
    return response.data
  },

  createAsset: async (data: AssetCreate): Promise<Asset> => {
    const response = await api.post('/assets', data)
    return response.data
  },

  updateAsset: async (id: number, data: Partial<AssetCreate>): Promise<Asset> => {
    const response = await api.put(`/assets/${id}`, data)
    return response.data
  },

  deleteAsset: async (id: number): Promise<void> => {
    await api.delete(`/assets/${id}`)
  },

  searchYahooAssets: async (query: string) => {
    const response = await api.get('/assets/yahoo/search', { 
      params: { query } 
    })
    return response.data
  },

  getYahooFinanceAsset: async (ticker: string) => {
    const response = await api.post('/assets/search', { ticker })
    return response.data
  },

  saveYahooAsset: async (ticker: string) => {
    const response = await api.post('/assets/yahoo/save', { ticker })
    return response.data
  },

  updateAssetPrices: async () => {
    const response = await api.post('/assets/update-prices')
    return response.data
  }
}