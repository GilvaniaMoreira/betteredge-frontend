export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal"
}

export interface Transaction {
  id: number;
  client_id: number;
  type: TransactionType;
  amount: number;
  date: string;
  note?: string;
  created_at: string;
  client?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface TransactionCreate {
  client_id: number;
  type: TransactionType;
  amount: number;
  date: string;
  note?: string;
}

export interface TransactionFilter {
  search?: string;
  client_id?: number;
  type?: TransactionType;
  start_date?: string;
  end_date?: string;
  page?: number;
  size?: number;
}

export interface TransactionList {
  items: Transaction[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CaptationSummary {
  total_deposits: number;
  total_withdrawals: number;
  net_captation: number;
  period_start?: string;
  period_end?: string;
}

export interface ClientCaptationSummary {
  client_id: number;
  client_name: string;
  client_email: string;
  total_deposits: number;
  total_withdrawals: number;
  net_captation: number;
}

export interface CaptationReport {
  summary: CaptationSummary;
  clients: ClientCaptationSummary[];
}
