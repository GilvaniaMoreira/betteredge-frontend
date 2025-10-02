'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { allocationsService } from '@/services/allocations'
import { clientsService } from '@/services/clients'
import { assetsService } from '@/services/assets'
import { AddAllocationDialog } from './add-allocation-dialog'
import { DataTable } from '@/components/ui/data-table'
import { useTableFilters } from '@/hooks/use-table-filters'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { exportToCSV } from '@/lib/export-csv'

export function AllocationsTable() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAllocation, setEditingAllocation] = useState<any>(null)
  const queryClient = useQueryClient()
  const { filters, setSearch, setClientId, setAssetId, setDateRangePicker, resetFilters, getApiParams } = useTableFilters()

  const { data: allocationsData, isLoading, refetch } = useQuery({
    queryKey: ['allocations', filters],
    queryFn: () => allocationsService.getAllocations(getApiParams()),
  })


  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsService.getClients({}),
  })

  const { data: assetsData } = useQuery({
    queryKey: ['assets'],
    queryFn: () => assetsService.getAssets({ size: 1000 }),
  })

  const deleteAllocationMutation = useMutation({
    mutationFn: (allocationId: number) => allocationsService.deleteAllocation(allocationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
      toast.success('Alocação excluída com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao excluir alocação')
    },
  })

  const handleEdit = (allocation: any) => {
    console.log('handleEdit called with allocation:', allocation)
    setEditingAllocation(allocation)
    setIsFormOpen(true)
  }

  const handleDelete = (allocationId: number) => {
    if (confirm('Tem certeza que deseja excluir esta alocação?')) {
      deleteAllocationMutation.mutate(allocationId)
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingAllocation(null)
  }

  const renderCell = (row: any, columnKey: string) => {
    if (columnKey === 'total_value') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(row.quantity * row.buy_price || 0)
    }
    if (columnKey === 'buy_price') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(row.buy_price || 0)
    }
    
    return null
  }

  const renderActions = (allocation: any) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(allocation)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDelete(allocation.id)}
        disabled={deleteAllocationMutation.isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  const columns = [
    { key: 'client.name', label: 'Cliente', sortable: true },
    { key: 'asset.ticker', label: 'Ativo', sortable: true },
    { key: 'asset.name', label: 'Nome do Ativo', sortable: true },
    { key: 'quantity', label: 'Quantidade', sortable: true },
    { key: 'buy_price', label: 'Preço de Compra', sortable: true },
    { key: 'buy_date', label: 'Data de Compra', sortable: true },
    { key: 'total_value', label: 'Valor Total', sortable: true },
  ]

  const clients = clientsData?.items?.map(client => ({
    id: client.id,
    name: client.name
  })) || []

  const assets = assetsData?.items?.map(asset => ({
    id: asset.id,
    name: asset.name,
    ticker: asset.ticker
  })) || []

  const handleExport = () => {
    const exportData = allocationsData?.items || []
    const headers = [
      { key: 'id', label: 'ID' },
      { key: 'client.name', label: 'Cliente' },
      { key: 'asset.ticker', label: 'Ticker' },
      { key: 'asset.name', label: 'Nome do Ativo' },
      { key: 'quantity', label: 'Quantidade' },
      { key: 'buy_price', label: 'Preço de Compra' },
      { key: 'buy_date', label: 'Data de Compra' },
    ]
    exportToCSV(exportData, headers, 'alocacoes')
    toast.success('Dados exportados com sucesso!')
  }

  return (
    <>
      <DataTable
        title="Alocações"
        filters={filters}
        onSearch={setSearch}
        onClientId={setClientId}
        onAssetId={setAssetId}
        onDateRange={setDateRangePicker}
        onReset={resetFilters}
        showStatusFilter={false}
        showClientFilter={true}
        showAssetFilter={true}
        showDateRangeFilter={true}
        clients={clients}
        assets={assets}
        dateRangePlaceholder="Data da compra"
        columns={columns}
        data={allocationsData?.items || []}
        isLoading={isLoading}
        onRefresh={refetch}
        onAdd={() => setIsFormOpen(true)}
        onExport={handleExport}
        renderCell={renderCell}
        renderActions={renderActions}
        placeholder="Pesquisar alocações..."
      />

      <AddAllocationDialog
        open={isFormOpen}
        onClose={handleFormClose}
        allocation={editingAllocation}
      />
    </>
  )
}