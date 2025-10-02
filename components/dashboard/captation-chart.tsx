'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { transactionsService } from '@/services/transactions'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { useState, useEffect } from 'react'

export function CaptationChart() {
  const [isClient, setIsClient] = useState(false)
  const { data: captationReport, isLoading, error } = useQuery({
    queryKey: ['captation-chart'],
    queryFn: () => transactionsService.getCaptationReport(),
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Captação</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Carregando dados...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Captação</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Erro ao carregar dados</p>
        </CardContent>
      </Card>
    )
  }

  if (!captationReport || !captationReport.summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Captação</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nenhum dado disponível</p>
        </CardContent>
      </Card>
    )
  }

  const { total_deposits, total_withdrawals, net_captation } = captationReport.summary

  const chartData = [
    {
      name: 'Depósitos',
      value: total_deposits || 0,
      fill: '#10b981'
    },
    {
      name: 'Saques',
      value: total_withdrawals || 0,
      fill: '#ef4444'
    }
  ]

  const COLORS = ['#10b981', '#ef4444']

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Captação</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Carregando gráfico...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório de Captação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Resumo numérico */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Depósitos</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {(total_deposits || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Saques</p>
              <p className="text-2xl font-bold text-red-600">
                R$ {(total_withdrawals || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Captação Líquida</p>
              <p className={`text-2xl font-bold ${(net_captation || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {(net_captation || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Gráfico de barras */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                <Bar dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}