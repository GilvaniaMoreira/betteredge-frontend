'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientsService } from '@/services/clients'
import { Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { ClientForm } from './client-form'
import { DataTable } from '@/components/ui/data-table'
import { useTableFilters } from '@/hooks/use-table-filters'
import { exportToCSV } from '@/lib/export-csv'

export function ClientsTable() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(null)
  const queryClient = useQueryClient()
  const { filters, setSearch, setStatus, setDateRangePicker, resetFilters, getApiParams } = useTableFilters()

  const { data: clientsData, isLoading, refetch } = useQuery({
    queryKey: ['clients', filters],
    queryFn: () => clientsService.getClients(getApiParams()),
  })

  const deleteClientMutation = useMutation({
    mutationFn: (clientId: number) => clientsService.deleteClient(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente excluído com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao excluir cliente')
    },
  })

  const handleDelete = (clientId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteClientMutation.mutate(clientId)
    }
  }

  const handleEdit = (client: any) => {
    setEditingClient(client)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingClient(null)
  }

  const renderActions = (client: any) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(client)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDelete(client.id)}
        disabled={deleteClientMutation.isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  const columns = [
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'is_active', label: 'Status', sortable: false },
    { key: 'created_at', label: 'Data de Criação', sortable: true },
  ]

  const handleExport = () => {
    const exportData = clientsData?.items || []
    const headers = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nome' },
      { key: 'email', label: 'Email' },
      { key: 'is_active', label: 'Status' },
      { key: 'created_at', label: 'Data de Criação' },
    ]
    exportToCSV(exportData, headers, 'clientes')
    toast.success('Dados exportados com sucesso!')
  }

  return (
    <>
      <DataTable
        title="Clientes"
        filters={filters}
        onSearch={setSearch}
        onStatus={setStatus}
        onDateRange={setDateRangePicker}
        onReset={resetFilters}
        showStatusFilter={true}
        showDateRangeFilter={true}
        dateRangePlaceholder="Data de criação"
        columns={columns}
        data={clientsData?.items || []}
        isLoading={isLoading}
        onRefresh={refetch}
        onAdd={() => setIsFormOpen(true)}
        onExport={handleExport}
        renderActions={renderActions}
        placeholder="Pesquisar clientes..."
      />

      {isFormOpen && (
        <ClientForm
          client={editingClient}
          onClose={handleFormClose}
        />
      )}
    </>
  )
}