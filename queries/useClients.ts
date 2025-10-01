import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientsService } from '@/services/clients'
import { Client, ClientCreate, ClientFilter } from '@/types/client'
import { toast } from 'react-hot-toast'

export function useClients(params: ClientFilter = {}) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientsService.getClients(params),
  })
}

export function useClient(id: number) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => clientsService.getClient(id),
    enabled: !!id,
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ClientCreate) => clientsService.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente criado com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao criar cliente')
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ClientCreate> }) =>
      clientsService.updateClient(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['client', id] })
      toast.success('Cliente atualizado com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao atualizar cliente')
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => clientsService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente deletado com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao deletar cliente')
    },
  })
}

export function useToggleClientStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => clientsService.toggleClientStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Status do cliente atualizado!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao atualizar status')
    },
  })
}


