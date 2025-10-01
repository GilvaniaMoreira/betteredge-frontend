import { api } from '@/lib/api'
import { Transaction, TransactionCreate, TransactionList, TransactionFilter, CaptationReport } from '@/types/transaction'

export const transactionsService = {
  // Buscar transações
  getTransactions: async (params: TransactionFilter = {}): Promise<TransactionList> => {
    const response = await api.get('/transactions', { params })
    return response.data
  },

  // Buscar transação por ID
  getTransaction: async (id: number): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`)
    return response.data
  },

  // Criar transação
  createTransaction: async (data: TransactionCreate): Promise<Transaction> => {
    const response = await api.post('/transactions', data)
    return response.data
  },

  // Atualizar transação
  updateTransaction: async (id: number, data: Partial<TransactionCreate>): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, data)
    return response.data
  },

  // Deletar transação
  deleteTransaction: async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`)
  },

  // Buscar relatório de captação
  getCaptationReport: async (params: {
    start_date?: string
    end_date?: string
    client_id?: number
  } = {}): Promise<CaptationReport> => {
    const response = await api.get('/transactions/reports/captation', { params })
    return response.data
  }
}