export interface Client {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ClientCreate {
  name: string;
  email: string;
  is_active?: boolean;
}

export interface ClientUpdate {
  name?: string;
  email?: string;
  is_active?: boolean;
}

export interface ClientList {
  items: Client[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ClientFilter {
  search?: string;
  is_active?: boolean;
  page?: number;
  size?: number;
}


