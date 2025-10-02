export interface Asset {
  id: number;
  ticker: string;
  name: string;
  exchange: string;
  currency: string;
  current_price?: number;
  sector?: string;
  industry?: string;
  market_cap?: number;
  volume?: number;
  pe_ratio?: number;
  dividend_yield?: number;
  last_updated?: string;
  created_at: string;
  updated_at?: string;
}

export interface AssetCreate {
  ticker: string;
  name: string;
  exchange: string;
  currency: string;
  current_price?: number;
  sector?: string;
  industry?: string;
  market_cap?: number;
  volume?: number;
  pe_ratio?: number;
  dividend_yield?: number;
}

export interface AssetUpdate {
  ticker?: string;
  name?: string;
  exchange?: string;
  currency?: string;
  current_price?: number;
  sector?: string;
  industry?: string;
  market_cap?: number;
  volume?: number;
  pe_ratio?: number;
  dividend_yield?: number;
}

export interface AssetList {
  items: Asset[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface AssetFilter {
  search?: string;
  exchange?: string;
  currency?: string;
  sector?: string;
  page?: number;
  size?: number;
}

export interface YahooFinanceAsset {
  ticker: string;
  name: string;
  exchange: string;
  currency: string;
  current_price?: number;
  sector?: string;
  industry?: string;
  market_cap?: number;
  volume?: number;
  pe_ratio?: number;
  dividend_yield?: number;
  last_updated?: string;
}

export interface YahooSearchSimpleResult {
  ticker: string;
  name: string;
  exchange?: string;
}

export interface YahooSearchResult {
  ticker: string;
  name: string;
  exchange: string;
  currency: string;
  current_price?: number;
  sector?: string;
  industry?: string;
  market_cap?: number;
  volume?: number;
  pe_ratio?: number;
  dividend_yield?: number;
  last_updated?: string;
}


