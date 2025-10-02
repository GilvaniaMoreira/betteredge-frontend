'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { LoginForm } from '@/components/forms/login-form'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            🚀 Plataforma de Investimentos
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            BetterEdge
            <span className="text-blue-600"> Platform</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie seus investimentos de forma inteligente com nossa plataforma completa de análise e gestão de portfólio.
          </p>
        </div>

        {/* Login Section */}
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p className="text-sm">
            © 2024 BetterEdge Platform. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}


