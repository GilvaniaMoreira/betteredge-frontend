'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { transactionsService } from '@/services/transactions'
import { allocationsService } from '@/services/allocations'
import { clientsService } from '@/services/clients'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Users, PieChart } from 'lucide-react'

export function OverviewCards() {
  const { data: captationStats } = useQuery({
    queryKey: ['captation-stats'],
    queryFn: () => transactionsService.getCaptationReport(),
  })

  const { data: allocationStats } = useQuery({
    queryKey: ['allocation-stats'],
    queryFn: () => allocationsService.getAllocationSummary(),
  })

  const { data: clientsData } = useQuery({
    queryKey: ['clients-count'],
    queryFn: () => clientsService.getClients({ size: 1 }),
  })

  const cards = [
    {
      title: 'Receita Bruta',
      value: formatCurrency(captationStats?.summary?.total_deposits || 0),
      icon: TrendingUp,
    },
    {
      title: 'Receita Líquida',
      value: formatCurrency(captationStats?.summary?.net_captation || 0),
      icon: TrendingUp,
    },
    {
      title: 'Total de Clientes',
      value: clientsData?.total?.toString() || '0',
      icon: Users,
    },
    {
      title: 'Alocação Total',
      value: formatCurrency(allocationStats?.total_value || 0),
      icon: PieChart,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

