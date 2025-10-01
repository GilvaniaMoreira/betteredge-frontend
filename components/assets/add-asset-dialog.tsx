'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { assetsService } from '@/services/assets'
import { Search, Plus, X } from 'lucide-react'

interface AddAssetDialogProps {
  onClose: () => void
}

export function AddAssetDialog({ onClose }: AddAssetDialogProps) {
  const [ticker, setTicker] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const queryClient = useQueryClient()

  const searchMutation = useMutation({
    mutationFn: (ticker: string) => assetsService.getYahooFinanceAsset(ticker),
    onSuccess: (data) => {
      setSearchResult(data)
      toast.success(`Dados do ${data.ticker} carregados com sucesso.`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Não foi possível buscar o ativo.')
    },
  })

  const saveMutation = useMutation({
    mutationFn: (ticker: string) => assetsService.saveFromYahooFinance(ticker),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Ativo foi adicionado com sucesso.')
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Não foi possível salvar o ativo.')
    },
  })

  const handleSearch = async () => {
    if (!ticker.trim()) return
    
    setIsSearching(true)
    try {
      await searchMutation.mutateAsync(ticker.toUpperCase())
    } finally {
      setIsSearching(false)
    }
  }

  const handleSave = async () => {
    if (!ticker.trim()) return
    await saveMutation.mutateAsync(ticker.toUpperCase())
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Adicionar Ativo do Yahoo Finance</CardTitle>
              <CardDescription>
                Busque e adicione ativos financeiros automaticamente
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Busca */}
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="ticker">Ticker do Ativo</Label>
                <Input
                  id="ticker"
                  placeholder="Ex: AAPL, MSFT, GOOGL"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !ticker.trim()}
                className="mt-6"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>
          </div>

          {/* Resultado da Busca */}
          {searchResult && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
                <h3 className="font-semibold text-lg mb-3">Dados do Ativo</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Ticker:</span> {searchResult.ticker}
                  </div>
                  <div>
                    <span className="font-medium">Nome:</span> {searchResult.name}
                  </div>
                  <div>
                    <span className="font-medium">Exchange:</span> {searchResult.exchange || '-'}
                  </div>
                  <div>
                    <span className="font-medium">Moeda:</span> {searchResult.currency || '-'}
                  </div>
                  <div>
                    <span className="font-medium">Preço Atual:</span> 
                    {searchResult.current_price ? ` $${searchResult.current_price.toFixed(2)}` : ' -'}
                  </div>
                  <div>
                    <span className="font-medium">Setor:</span> {searchResult.sector || '-'}
                  </div>
                  <div>
                    <span className="font-medium">Indústria:</span> {searchResult.industry || '-'}
                  </div>
                  <div>
                    <span className="font-medium">Market Cap:</span> 
                    {searchResult.market_cap ? ` $${(searchResult.market_cap / 1e9).toFixed(2)}B` : ' -'}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {saveMutation.isPending ? 'Salvando...' : 'Salvar Ativo'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
