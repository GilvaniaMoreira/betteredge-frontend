'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { allocationsService } from '@/services/allocations'
import { formatCurrency } from '@/lib/utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useState, useEffect } from 'react'

export function AllocationChart() {
  const [isClient, setIsClient] = useState(false)
  const { data: allocationStats, isLoading, error } = useQuery({
    queryKey: ['allocation-stats'],
    queryFn: () => allocationsService.getAllocationSummary(),
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alocação Total</CardTitle>
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
          <CardTitle>Alocação Total</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Erro ao carregar dados: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  if (!allocationStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alocação Total</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nenhum dado disponível</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = [
    {
      name: 'Alocação Total',
      value: allocationStats?.total_value || 0,
      fill: '#3b82f6'
    }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alocação Total</CardTitle>
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
        <CardTitle>Alocação Total</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <div className="text-3xl font-bold">
            {formatCurrency(allocationStats?.total_value || 0)}
          </div>
          <div className="text-sm text-gray-600">Valor Total Alocado</div>
        </div>
      </CardContent>
    </Card>
  )
}

