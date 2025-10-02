import { api } from '@/lib/api'
import { Asset, AssetCreate, AssetList, AssetFilter, YahooSearchResult, YahooSearchSimpleResult } from '@/types/asset'

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

      searchYahooAssets: async (query: string, limit: number = 10): Promise<YahooSearchSimpleResult[]> => {
        const response = await api.get('/assets/yahoo/search', {
          params: { query, limit }
        })
        return response.data
      },

      getYahooAssetDetails: async (ticker: string): Promise<YahooSearchResult> => {
        const response = await api.get(`/assets/yahoo/details/${ticker}`)
        return response.data
      },

}