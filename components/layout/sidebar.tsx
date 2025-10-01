'use client'

import { 
  BarChart3, 
  Users, 
  PieChart, 
  TrendingUp, 
  FileText, 
  Settings,
  LogOut,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { useRouter, usePathname } from 'next/navigation'

interface SidebarProps {
  activeView?: string
}

const navigationItems: { id: string; label: string; icon: any; path: string }[] = [
  { id: 'overview', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'clients', label: 'Clientes', icon: Users, path: '/clients' },
  { id: 'assets', label: 'Ativos', icon: PieChart, path: '/assets' },
  { id: 'allocations', label: 'Alocações', icon: TrendingUp, path: '/allocations' },
  { id: 'transactions', label: 'Transações', icon: BarChart3, path: '/transactions' },
]

export function Sidebar({ activeView }: SidebarProps) {
  const { logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="w-64 bg-slate-900 dark:bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold">BetterEdge</span>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left hover:bg-slate-800 dark:hover:bg-slate-800 transition-colors text-white",
                  pathname === item.path && "bg-slate-800 dark:bg-slate-800"
                )}
                onClick={() => router.push(item.path)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>
      
      {/* Spacer to push logout button to bottom */}
      <div className="flex-1"></div>
      
      {/* Logout Button - Fixed at bottom */}
      <div className="p-6 border-t border-slate-700 dark:border-slate-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-left hover:bg-slate-800 dark:hover:bg-slate-800 transition-colors text-white"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  )
}

