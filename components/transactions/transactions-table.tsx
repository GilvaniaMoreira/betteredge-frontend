'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionsService } from '@/services/transactions'
import { clientsService } from '@/services/clients'
import { Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { AddTransactionDialog } from './add-transaction-dialog'
import { DataTable } from '@/components/ui/data-table'
import { useTableFilters } from '@/hooks/use-table-filters'
import { exportToCSV } from '@/lib/export-csv'

export function TransactionsTable() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const queryClient = useQueryClient()
  const { filters, setSearch, setStatus, setType, setClientId, resetFilters, getApiParams } = useTableFilters()

  const { data: transactionsData, isLoading, refetch } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsService.getTransactions(getApiParams()),
  })


  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsService.getClients({}),
  })

  const deleteTransactionMutation = useMutation({
    mutationFn: (transactionId: number) => transactionsService.deleteTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transação excluída com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao excluir transação')
    },
  })

  const handleDelete = (transactionId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransactionMutation.mutate(transactionId)
    }
  }

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingTransaction(null)
  }

  const renderCell = (row: any, columnKey: string) => {
    if (columnKey === 'amount') {
      return (
        <div className={`font-medium ${
          row.type === 'deposit' ? 'text-green-600' : 'text-red-600'
        }`}>
          {row.type === 'deposit' ? '+' : '-'}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(row.amount || 0)}
        </div>
      )
    }
    if (columnKey === 'type') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.type === 'deposit' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.type === 'deposit' ? 'Depósito' : 'Saque'}
        </span>
      )
    }
    
    return null
  }

  const renderActions = (transaction: any) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(transaction)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDelete(transaction.id)}
        disabled={deleteTransactionMutation.isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  const columns = [
    { key: 'client.name', label: 'Cliente', sortable: true },
    { key: 'type', label: 'Tipo', sortable: true },
    { key: 'amount', label: 'Valor', sortable: true },
    { key: 'date', label: 'Data', sortable: true },
    { key: 'note', label: 'Observação', sortable: false },
    { key: 'created_at', label: 'Data de Criação', sortable: true },
  ]

  const clients = clientsData?.items?.map(client => ({
    id: client.id,
    name: client.name
  })) || []

  const handleExport = () => {
    const exportData = transactionsData?.items || []
    const headers = [
      { key: 'id', label: 'ID' },
      { key: 'client.name', label: 'Cliente' },
      { key: 'type', label: 'Tipo' },
      { key: 'amount', label: 'Valor' },
      { key: 'date', label: 'Data' },
      { key: 'note', label: 'Observação' },
      { key: 'created_at', label: 'Data de Criação' },
    ]
    exportToCSV(exportData, headers, 'transacoes')
    toast.success('Dados exportados com sucesso!')
  }

  return (
    <>
      <DataTable
        title="Transações"
        filters={filters}
        onSearch={setSearch}
        onStatus={setStatus}
        onType={setType}
        onClientId={setClientId}
        onReset={resetFilters}
        showStatusFilter={false}
        showTypeFilter={true}
        showClientFilter={true}
        clients={clients}
        columns={columns}
        data={transactionsData?.items || []}
        isLoading={isLoading}
        onRefresh={refetch}
        onAdd={() => setIsFormOpen(true)}
        onExport={handleExport}
        renderActions={renderActions}
        renderCell={renderCell}
        placeholder="Pesquisar transações..."
      />

      <AddTransactionDialog
        open={isFormOpen}
        onClose={handleFormClose}
        transaction={editingTransaction}
      />
    </>
  )
}