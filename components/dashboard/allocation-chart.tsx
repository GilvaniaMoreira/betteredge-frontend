'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { allocationsService } from '@/services/allocations'
import { clientsService } from '@/services/clients'

export function AllocationChart() {
  const [isClient, setIsClient] = useState(false)

  // Buscar lista de clientes primeiro
  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ['clients-list'],
    queryFn: () => clientsService.getClients({ page: 1, size: 100 }),
  })

  // Buscar estatísticas de alocação por cliente individual
  const { data: clientAllocations, isLoading, error } = useQuery({
    queryKey: ['client-allocation-stats', clientsData?.items?.map(c => c.id)],
    queryFn: async () => {
      if (!clientsData?.items) return []
      
      // Buscar dados de cada cliente individualmente
      const clientPromises = clientsData.items.map(async (client) => {
        const stats = await allocationsService.getAllocationSummary(client.id)
        return {
          client_id: client.id,
          client_name: client.name,
          client_email: client.email,
          total_value: stats.total_value,
          assets_count: stats.assets_count,
          total_quantity: stats.total_quantity
        }
      })
      
      const results = await Promise.all(clientPromises)
      // Filtrar clientes com valor > 0
      return results.filter(client => client.total_value > 0)
    },
    enabled: !!clientsData?.items
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Função para renderizar estados do componente
  const renderState = (message: string) => (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Alocação por Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{message}</p>
      </CardContent>
    </Card>
  )

  // Verificar estados de carregamento e erro
  if (isLoading || clientsLoading) {
    return renderState('Carregando dados...')
  }

  if (error) {
    return renderState(`Erro ao carregar dados: ${error.message}`)
  }

  if (!clientAllocations || clientAllocations.length === 0) {
    return renderState('Nenhum dado disponível')
  }

  if (!isClient) {
    return renderState('Carregando gráfico...')
  }

  // Função para gerar cores dinamicamente baseada no índice
  const generateColor = (index: number) => {
    const hue = (index * 137.5) % 360 // Usa o ângulo dourado para distribuição uniforme
    const saturation = 70 + (index % 3) * 10 // Varia entre 70-90%
    const lightness = 50 + (index % 2) * 10 // Varia entre 50-60%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }
  
  const chartData = clientAllocations.map((client, index) => ({
    name: client.client_name,
    value: client.total_value,
    fill: generateColor(index),
    client_id: client.client_id,
    assets_count: client.assets_count,
    total_quantity: client.total_quantity
  }))

  // Calcular valor total
  const totalValue = clientAllocations.reduce((sum, client) => sum + client.total_value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Alocação por Cliente</CardTitle>
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
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any, props: any) => [
                  formatCurrency(Number(value)),
                  props.payload.name
                ]}
                labelFormatter={(label: any, payload: any) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload
                    const percentage = ((data.value / totalValue) * 100).toFixed(1)
                    return `${data.name} (${percentage}%)`
                  }
                  return label
                }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <div className="text-3xl font-bold">
            {formatCurrency(totalValue)}
          </div>
          <div className="text-sm text-gray-600">
            Valor Total Alocado
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {clientAllocations.length} cliente(s) • {clientAllocations.reduce((sum, client) => sum + client.assets_count, 0)} ativo(s) total
          </div>
        </div>
        
        {/* Lista de clientes com percentuais */}
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Distribuição por Cliente:</h4>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
            {clientAllocations
              .sort((a, b) => b.total_value - a.total_value)
              .map((client) => {
                const percentage = ((client.total_value / totalValue) * 100).toFixed(1)
                return (
                  <div key={client.client_id} className="flex items-center justify-between text-xs">
                    <span className="truncate flex-1">{client.client_name}</span>
                    <span className="font-medium ml-2">{percentage}%</span>
                    <span className="text-gray-500 ml-2">{formatCurrency(client.total_value)}</span>
                  </div>
                )
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

