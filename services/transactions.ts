import { api } from '@/lib/api'
import { Transaction, TransactionCreate, TransactionList, TransactionFilter, CaptationReport } from '@/types/transaction'

export const transactionsService = {
  getTransactions: async (params: TransactionFilter = {}): Promise<TransactionList> => {
    const response = await api.get('/transactions', { params })
    return response.data
  },

  getTransaction: async (id: number): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`)
    return response.data
  },

  createTransaction: async (data: TransactionCreate): Promise<Transaction> => {
    const response = await api.post('/transactions', data)
    return response.data
  },

  updateTransaction: async (id: number, data: Partial<TransactionCreate>): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, data)
    return response.data
  },

  deleteTransaction: async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`)
  },

  getCaptationReport: async (params: {
    start_date?: string
    end_date?: string
    client_id?: number
  } = {}): Promise<CaptationReport> => {
    const response = await api.get('/transactions/reports/captation', { params })
    return response.data
  }
}