import { useState } from "react";
import { DateRange } from "react-day-picker";

export interface FilterState {
  search: string;
  status?: "active" | "inactive" | "all";
  startDate?: Date;
  endDate?: Date;
  dateRange?: DateRange;
  type?: string; // Para transactions (deposit/withdrawal)
  clientId?: number; // Para allocations e transactions
  assetId?: number; // Para allocations
  exchange?: string; // Para assets (bolsa)
  currency?: string; // Para assets (moeda)
}

export function useTableFilters(initialState?: Partial<FilterState>) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    ...initialState,
  });

  function setSearch(search: string) {
    setFilters((prev: FilterState) => ({ ...prev, search }));
  }

  function setStatus(status: "active" | "inactive" | "all") {
    setFilters((prev: FilterState) => ({ ...prev, status }));
  }

  function setDateRange(startDate?: Date, endDate?: Date) {
    setFilters((prev: FilterState) => ({ ...prev, startDate, endDate }));
  }

  function setType(type: string) {
    setFilters((prev: FilterState) => ({ ...prev, type }));
  }

  function setClientId(clientId: number | undefined) {
    setFilters((prev: FilterState) => ({ ...prev, clientId }));
  }

  function setAssetId(assetId: number | undefined) {
    setFilters((prev: FilterState) => ({ ...prev, assetId }));
  }

  function setExchange(exchange: string | undefined) {
    setFilters((prev: FilterState) => ({ ...prev, exchange }));
  }

  function setCurrency(currency: string | undefined) {
    setFilters((prev: FilterState) => ({ ...prev, currency }));
  }

  function setDateRangePicker(dateRange: DateRange | undefined) {
    setFilters((prev: FilterState) => ({ 
      ...prev, 
      dateRange,
      startDate: dateRange?.from,
      endDate: dateRange?.to
    }));
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

    if (filters.assetId) {
      params.asset_id = filters.assetId;
    }

    if (filters.exchange) {
      params.exchange = filters.exchange;
    }

    if (filters.currency) {
      params.currency = filters.currency;
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
    setAssetId,
    setExchange,
    setCurrency,
    setDateRangePicker,
    resetFilters,
    getApiParams
  };
}
