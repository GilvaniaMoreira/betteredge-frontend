'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, X, CheckCircle, Building2, DollarSign, TrendingUp, Loader2 } from 'lucide-react'
import { YahooSearchSimpleResult, YahooSearchResult } from '@/types/asset'
import { useSearchYahooAssets, useYahooAssetDetails, useCreateAsset } from '@/queries/useAssets'

interface AddAssetDialogProps {
  onClose: () => void
}

export function AddAssetDialog({ onClose }: AddAssetDialogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  // Buscar resultados simplificados (autocomplete)
  const { data: searchResults = [], isLoading: isSearching } = useSearchYahooAssets(searchQuery, 10)

  // Obter informações detalhadas quando um ticker é selecionado
  const { data: selectedAsset, isLoading: isLoadingDetails } = useYahooAssetDetails(selectedTicker || '')

  // Mutação para criar ativo
  const createAssetMutation = useCreateAsset()

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setShowResults(value.length > 0)
    setSelectedTicker(null)
  }

  const handleSelectAsset = (asset: YahooSearchSimpleResult) => {
    setSelectedTicker(asset.ticker)
    setSearchQuery(`${asset.ticker} - ${asset.name}`)
    setShowResults(false)
  }

  const handleSave = async () => {
    if (!selectedAsset) return

    try {
      await createAssetMutation.mutateAsync(selectedAsset)
      onClose()
    } catch (error) {
      console.error('Error creating asset:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Adicionar Ativo</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Campo de Busca */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar Ativo</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                placeholder="Digite o nome ou ticker do ativo..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
              )}
            </div>
          </div>

          {/* Resultados da Busca (Autocomplete) */}
          {showResults && searchQuery.length > 0 && (
            <div className="space-y-2">
              <Label>Resultados da Busca</Label>
              <div className="max-h-48 overflow-y-auto border rounded-md">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {isSearching ? 'Buscando...' : 'Nenhum ativo encontrado'}
                  </div>
                ) : (
                  searchResults.map((asset, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleSelectAsset(asset)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{asset.ticker}</div>
                          <div className="text-sm text-gray-600">{asset.name}</div>
                        </div>
                        {asset.exchange && (
                          <Badge variant="secondary">{asset.exchange}</Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Detalhes do Ativo Selecionado */}
          {selectedAsset && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Ativo Selecionado</span>
              </div>

              {isLoadingDetails ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Carregando detalhes...</span>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {selectedAsset.ticker} - {selectedAsset.name}
                    </CardTitle>
                    <CardDescription>
                      {selectedAsset.exchange} • {selectedAsset.currency}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {selectedAsset.current_price && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <div>
                            <div className="text-sm text-gray-600">Preço Atual</div>
                            <div className="font-medium">
                              ${selectedAsset.current_price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedAsset.sector && (
                        <div>
                          <div className="text-sm text-gray-600">Setor</div>
                          <div className="font-medium">{selectedAsset.sector}</div>
                        </div>
                      )}

                      {selectedAsset.industry && (
                        <div>
                          <div className="text-sm text-gray-600">Indústria</div>
                          <div className="font-medium">{selectedAsset.industry}</div>
                        </div>
                      )}

                      {selectedAsset.market_cap && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="text-sm text-gray-600">Market Cap</div>
                            <div className="font-medium">
                              ${(selectedAsset.market_cap / 1e9).toFixed(2)}B
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedAsset.pe_ratio && (
                        <div>
                          <div className="text-sm text-gray-600">P/E Ratio</div>
                          <div className="font-medium">{selectedAsset.pe_ratio.toFixed(2)}</div>
                        </div>
                      )}

                      {selectedAsset.dividend_yield && (
                        <div>
                          <div className="text-sm text-gray-600">Dividend Yield</div>
                          <div className="font-medium">
                            {(selectedAsset.dividend_yield * 100).toFixed(2)}%
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedAsset || isLoadingDetails || createAssetMutation.isPending}
            >
              {createAssetMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Ativo
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}