'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, RefreshCw, Download } from "lucide-react"
import { FilterState } from "@/hooks/use-table-filters"
import { TableFilters } from "@/components/filters/table-filters"

interface DataTableProps {
  title: string
  filters: FilterState
  onSearch: (value: string) => void
  onStatus?: (value: "active" | "inactive" | "all") => void
  onType?: (value: string) => void
  onClientId?: (value: number | undefined) => void
  onAssetId?: (value: number | undefined) => void
  onExchange?: (value: string | undefined) => void
  onCurrency?: (value: string | undefined) => void
  onDateRange?: (dateRange: any) => void
  onReset: () => void
  showStatusFilter?: boolean
  showTypeFilter?: boolean
  showClientFilter?: boolean
  showAssetFilter?: boolean
  showExchangeFilter?: boolean
  showCurrencyFilter?: boolean
  showDateRangeFilter?: boolean
  clients?: Array<{ id: number; name: string }>
  assets?: Array<{ id: number; name: string; ticker: string }>
  exchanges?: Array<string>
  currencies?: Array<string>
  dateRangePlaceholder?: string
  placeholder?: string
  columns: Array<{
    key: string
    label: string
    sortable?: boolean
  }>
  data: any[]
  isLoading?: boolean
  onRefresh?: () => void
  onAdd?: () => void
  onExport?: () => void
  renderCell?: (row: any, columnKey: string) => React.ReactNode
  renderActions?: (row: any) => React.ReactNode
}

export function DataTable({
  title,
  filters,
  onSearch,
  onStatus,
  onType,
  onClientId,
  onAssetId,
  onExchange,
  onCurrency,
  onDateRange,
  onReset,
  showStatusFilter = true,
  showTypeFilter = false,
  showClientFilter = false,
  showAssetFilter = false,
  showExchangeFilter = false,
  showCurrencyFilter = false,
  showDateRangeFilter = false,
  clients = [],
  assets = [],
  exchanges = [],
  currencies = [],
  dateRangePlaceholder = "Selecionar período",
  placeholder = "Pesquisar...",
  columns,
  data,
  isLoading = false,
  onRefresh,
  onAdd,
  onExport,
  renderCell,
  renderActions
}: DataTableProps) {
  const getNestedValue = (obj: any, path: string) => {
    if (!obj || !path) return undefined
    
    try {
      return path.split('.').reduce((current, key) => {
        if (current === null || current === undefined) return undefined
        return current[key]
      }, obj)
    } catch (error) {
      console.error(`Error getting nested value for path "${path}":`, error)
      return undefined
    }
  }

  const defaultRenderCell = (row: any, columnKey: string) => {
    const value = getNestedValue(row, columnKey)
    
    // Format dates
    if (columnKey.includes('date') || columnKey.includes('_at')) {
      if (!value) return '-'
      try {
        return new Date(value).toLocaleDateString('pt-BR')
      } catch {
        return '-'
      }
    }
    
    // Format currency
    if (columnKey.includes('amount') || columnKey.includes('price') || columnKey.includes('value')) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value || 0)
    }
    
    // Format status
    if (columnKey === 'is_active') {
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Ativo" : "Inativo"}
        </Badge>
      )
    }
    
    return value?.toString() || '-'
  }

  const defaultRenderActions = (row: any) => (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        Editar
      </Button>
      <Button variant="outline" size="sm">
        Excluir
      </Button>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {title}
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {onExport && (
              <Button onClick={onExport} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            )}
            {onAdd && (
              <Button onClick={onAdd} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TableFilters
          filters={filters}
          onSearch={onSearch}
          onStatus={onStatus}
          onType={onType}
          onClientId={onClientId}
          onAssetId={onAssetId}
          onExchange={onExchange}
          onCurrency={onCurrency}
          onDateRange={onDateRange}
          onReset={onReset}
          showStatusFilter={showStatusFilter}
          showTypeFilter={showTypeFilter}
          showClientFilter={showClientFilter}
          showAssetFilter={showAssetFilter}
          showExchangeFilter={showExchangeFilter}
          showCurrencyFilter={showCurrencyFilter}
          showDateRangeFilter={showDateRangeFilter}
          clients={clients}
          assets={assets}
          exchanges={exchanges}
          currencies={currencies}
          dateRangePlaceholder={dateRangePlaceholder}
          placeholder={placeholder}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Carregando...
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key}>
                      {column.label}
                    </TableHead>
                  ))}
                  {renderActions && <TableHead>Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-8">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, index) => (
                    <TableRow key={row.id || index}>
                      {columns.map((column) => {
                        const customRender = renderCell ? renderCell(row, column.key) : null
                        return (
                          <TableCell key={column.key}>
                            {customRender !== null ? customRender : defaultRenderCell(row, column.key)}
                          </TableCell>
                        )
                      })}
                      {renderActions && (
                        <TableCell>
                          {renderActions(row)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
