export interface Allocation {
  id: number;
  client_id: number;
  asset_id: number;
  quantity: number;
  buy_price: number;
  buy_date: string;
  created_at: string;
  updated_at?: string;
  client?: {
    id: number;
    name: string;
    email: string;
  };
  asset?: {
    id: number;
    ticker: string;
    name: string;
    exchange: string;
    currency: string;
    current_price?: number;
  };
}

export interface AllocationCreate {
  client_id: number;
  asset_id: number;
  quantity: number;
  buy_price: number;
  buy_date: string;
}

export interface AllocationUpdate {
  client_id?: number;
  asset_id?: number;
  quantity?: number;
  buy_price?: number;
  buy_date?: string;
}

export interface AllocationList {
  items: Allocation[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface AllocationFilter {
  search?: string;
  client_id?: number;
  asset_id?: number;
  ticker?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  size?: number;
}

export interface AllocationSummary {
  total_value: number;
  total_quantity: number;
  assets_count: number;
  clients_count: number;
}

export interface ClientAllocationSummary {
  client_id: number;
  client_name: string;
  client_email: string;
  total_value: number;
  total_quantity: number;
  assets_count: number;
}

export interface AssetAllocationSummary {
  asset_id: number;
  asset_ticker: string;
  asset_name: string;
  total_value: number;
  total_quantity: number;
  clients_count: number;
}


