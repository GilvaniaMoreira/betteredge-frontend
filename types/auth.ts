export interface User {
  id: number
  name: string
  email: string
  roles: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
}
