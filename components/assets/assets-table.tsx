'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assetsService } from '@/services/assets'
import { Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { AddAssetDialog } from './add-asset-dialog'
import { DataTable } from '@/components/ui/data-table'
import { useTableFilters } from '@/hooks/use-table-filters'
import { exportToCSV } from '@/lib/export-csv'

export function AssetsTable() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [_editingAsset, setEditingAsset] = useState<any>(null)
  const queryClient = useQueryClient()
  const { filters, setSearch, setExchange, setCurrency, setDateRangePicker, resetFilters, getApiParams } = useTableFilters()

  const { data: assetsData, isLoading, refetch } = useQuery({
    queryKey: ['assets', filters],
    queryFn: () => assetsService.getAssets(getApiParams()),
  })


  const deleteAssetMutation = useMutation({
    mutationFn: (assetId: number) => assetsService.deleteAsset(assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Ativo excluído com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao excluir ativo')
    },
  })

  const handleDelete = (assetId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este ativo?')) {
      deleteAssetMutation.mutate(assetId)
    }
  }

  const handleEdit = (asset: any) => {
    setEditingAsset(asset)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingAsset(null)
  }

  const renderActions = (asset: any) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(asset)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDelete(asset.id)}
        disabled={deleteAssetMutation.isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  const renderCell = (row: any, columnKey: string) => {
    if (columnKey === 'current_price') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: row.currency || 'BRL'
      }).format(row.current_price || 0)
    }
    
    return null
  }

  const columns = [
    { key: 'ticker', label: 'Ticker', sortable: true },
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'exchange', label: 'Bolsa', sortable: true },
    { key: 'currency', label: 'Moeda', sortable: false },
    { key: 'current_price', label: 'Preço Atual', sortable: true },
    { key: 'created_at', label: 'Data de Criação', sortable: true },
  ]

  // Extrair listas únicas de bolsas e moedas
  const exchanges = Array.from(new Set(assetsData?.items?.map(asset => asset.exchange).filter(Boolean) || []))
  const currencies = Array.from(new Set(assetsData?.items?.map(asset => asset.currency).filter(Boolean) || []))

  const handleExport = () => {
    const exportData = assetsData?.items || []
    const headers = [
      { key: 'id', label: 'ID' },
      { key: 'ticker', label: 'Ticker' },
      { key: 'name', label: 'Nome' },
      { key: 'exchange', label: 'Bolsa' },
      { key: 'currency', label: 'Moeda' },
      { key: 'current_price', label: 'Preço Atual' },
      { key: 'created_at', label: 'Data de Criação' },
    ]
    exportToCSV(exportData, headers, 'ativos')
    toast.success('Dados exportados com sucesso!')
  }

  return (
    <>
      <DataTable
        title="Ativos Financeiros"
        filters={filters}
        onSearch={setSearch}
        onExchange={setExchange}
        onCurrency={setCurrency}
        onDateRange={setDateRangePicker}
        onReset={resetFilters}
        showStatusFilter={false}
        showExchangeFilter={true}
        showCurrencyFilter={true}
        showDateRangeFilter={true}
        exchanges={exchanges}
        currencies={currencies}
        dateRangePlaceholder="Data de criação"
        columns={columns}
        data={assetsData?.items || []}
        isLoading={isLoading}
        onRefresh={refetch}
        onAdd={() => setIsFormOpen(true)}
        onExport={handleExport}
        renderActions={renderActions}
        renderCell={renderCell}
        placeholder="Pesquisar ativos..."
      />

      {isFormOpen && (
        <AddAssetDialog
          onClose={handleFormClose}
        />
      )}
    </>
  )
}