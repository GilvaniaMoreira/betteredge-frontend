'use client'

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FilterState } from "@/hooks/use-table-filters"
import { Search, X, Filter } from "lucide-react"

interface TableFiltersProps {
  filters: FilterState
  onSearch: (value: string) => void
  onStatus: (value: "active" | "inactive" | "all") => void
  onType?: (value: string) => void
  onClientId?: (value: number | undefined) => void
  onReset: () => void
  showStatusFilter?: boolean
  showTypeFilter?: boolean
  showClientFilter?: boolean
  clients?: Array<{ id: number; name: string }>
  placeholder?: string
}

export function TableFilters({ 
  filters, 
  onSearch, 
  onStatus, 
  onType,
  onClientId,
  onReset,
  showStatusFilter = true,
  showTypeFilter = false,
  showClientFilter = false,
  clients = [],
  placeholder = "Pesquisar..."
}: TableFiltersProps) {
  return (
    <div className="flex gap-4 items-center mb-6 flex-wrap">
      {/* Search Input */}
      <div className="flex-1 min-w-[300px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={placeholder}
            value={filters.search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Status Filter */}
      {showStatusFilter && (
        <Select value={filters.status || "all"} onValueChange={onStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Type Filter (for transactions) */}
      {showTypeFilter && onType && (
        <Select value={filters.type || "all"} onValueChange={onType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="deposit">Depósito</SelectItem>
            <SelectItem value="withdrawal">Saque</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Client Filter (for allocations and transactions) */}
      {showClientFilter && onClientId && (
        <Select 
          value={filters.clientId?.toString() || "all"} 
          onValueChange={(value) => onClientId(value === "all" ? undefined : parseInt(value))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clientes</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id.toString()}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Reset Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="flex items-center gap-2"
      >
        <X className="h-4 w-4" />
        Limpar
      </Button>
    </div>
  )
}


