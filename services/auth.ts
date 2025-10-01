import { api } from '@/lib/api'
import { User, LoginRequest, LoginResponse, SignupRequest } from '@/types/auth'

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  register: async (data: SignupRequest): Promise<User> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  }
}


