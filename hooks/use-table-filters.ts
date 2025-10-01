import { useState } from "react";

export interface FilterState {
  search: string;
  status?: "active" | "inactive" | "all";
  startDate?: Date;
  endDate?: Date;
  type?: string; // Para transactions (deposit/withdrawal)
  clientId?: number; // Para allocations e transactions
}

export function useTableFilters(initialState?: Partial<FilterState>) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    ...initialState,
  });

  function setSearch(search: string) {
    setFilters(prev => ({ ...prev, search }));
  }

  function setStatus(status: "active" | "inactive" | "all") {
    setFilters(prev => ({ ...prev, status }));
  }

  function setDateRange(startDate?: Date, endDate?: Date) {
    setFilters(prev => ({ ...prev, startDate, endDate }));
  }

  function setType(type: string) {
    setFilters(prev => ({ ...prev, type }));
  }

  function setClientId(clientId: number | undefined) {
    setFilters(prev => ({ ...prev, clientId }));
  }

  function resetFilters() {
    setFilters({
      search: "",
      status: "all",
    });
  }

  // Função para mapear filtros para parâmetros da API
  function getApiParams() {
    const params: any = {};
    
    if (filters.search) {
      params.search = filters.search;
    }
    
    if (filters.status && filters.status !== "all") {
      params.is_active = filters.status === "active";
    }
    
    if (filters.type && filters.type !== "all") {
      params.type = filters.type;
    }
    
    if (filters.clientId) {
      params.client_id = filters.clientId;
    }
    
    if (filters.startDate) {
      params.start_date = filters.startDate.toISOString().split('T')[0];
    }
    
    if (filters.endDate) {
      params.end_date = filters.endDate.toISOString().split('T')[0];
    }
    
    return params;
  }

  return { 
    filters, 
    setSearch, 
    setStatus, 
    setDateRange, 
    setType, 
    setClientId,
    resetFilters,
    getApiParams
  };
}
