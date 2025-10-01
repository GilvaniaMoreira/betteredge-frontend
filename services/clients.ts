import { api } from '@/lib/api'
import { Client, ClientCreate, ClientList, ClientFilter } from '@/types/client'

export const clientsService = {
  // Buscar clientes
  getClients: async (params: ClientFilter = {}): Promise<ClientList> => {
    const response = await api.get('/clients', { params })
    return response.data
  },

  // Buscar cliente por ID
  getClient: async (id: number): Promise<Client> => {
    const response = await api.get(`/clients/${id}`)
    return response.data
  },

  // Criar cliente
  createClient: async (data: ClientCreate): Promise<Client> => {
    const response = await api.post('/clients', data)
    return response.data
  },

  // Atualizar cliente
  updateClient: async (id: number, data: Partial<ClientCreate>): Promise<Client> => {
    const response = await api.put(`/clients/${id}`, data)
    return response.data
  },

  // Deletar cliente
  deleteClient: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`)
  },

  // Ativar/desativar cliente
  toggleClientStatus: async (id: number): Promise<Client> => {
    const response = await api.patch(`/clients/${id}/toggle`)
    return response.data
  }
}