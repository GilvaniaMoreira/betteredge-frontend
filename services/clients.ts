import { api } from '@/lib/api'
import { Client, ClientCreate, ClientList, ClientFilter } from '@/types/client'

export const clientsService = {
  getClients: async (params: ClientFilter = {}): Promise<ClientList> => {
    const response = await api.get('/clients', { params })
    return response.data
  },

  getClient: async (id: number): Promise<Client> => {
    const response = await api.get(`/clients/${id}`)
    return response.data
  },

  createClient: async (data: ClientCreate): Promise<Client> => {
    const response = await api.post('/clients', data)
    return response.data
  },

  updateClient: async (id: number, data: Partial<ClientCreate>): Promise<Client> => {
    const response = await api.put(`/clients/${id}`, data)
    return response.data
  },

  deleteClient: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`)
  },

  toggleClientStatus: async (id: number): Promise<Client> => {
    const response = await api.patch(`/clients/${id}/toggle`)
    return response.data
  }
}