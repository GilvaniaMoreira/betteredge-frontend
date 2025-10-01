import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionsService } from '@/services/transactions'
import { Transaction, TransactionCreate, TransactionFilter } from '@/types/transaction'
import { toast } from 'react-hot-toast'

export function useTransactions(params: TransactionFilter = {}) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionsService.getTransactions(params),
  })
}

export function useTransaction(id: number) {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionsService.getTransaction(id),
    enabled: !!id,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TransactionCreate) => transactionsService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['captation-stats'] })
      queryClient.invalidateQueries({ queryKey: ['captation-chart'] })
      toast.success('Transação criada com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao criar transação')
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TransactionCreate> }) =>
      transactionsService.updateTransaction(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transaction', id] })
      queryClient.invalidateQueries({ queryKey: ['captation-stats'] })
      queryClient.invalidateQueries({ queryKey: ['captation-chart'] })
      toast.success('Transação atualizada com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao atualizar transação')
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => transactionsService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['captation-stats'] })
      queryClient.invalidateQueries({ queryKey: ['captation-chart'] })
      toast.success('Transação deletada com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao deletar transação')
    },
  })
}

export function useCaptationReport(params: {
  start_date?: string
  end_date?: string
  client_id?: number
} = {}) {
  return useQuery({
    queryKey: ['captation-chart', params],
    queryFn: () => transactionsService.getCaptationReport(params),
  })
}


