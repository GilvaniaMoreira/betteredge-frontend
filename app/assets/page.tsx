'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { AssetsTable } from '@/components/assets/assets-table'
import { Loading } from '@/components/ui/loading'
import { useAuth } from '@/hooks/use-auth'

export default function AssetsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-slate-900">
          <AssetsTable />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
