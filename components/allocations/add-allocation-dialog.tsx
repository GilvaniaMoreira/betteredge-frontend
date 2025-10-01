'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import toast from 'react-hot-toast'
import { allocationsService } from '@/services/allocations'
import { clientsService } from '@/services/clients'
import { assetsService } from '@/services/assets'
import { X, TrendingUp } from 'lucide-react'

interface AddAllocationDialogProps {
  open: boolean
  onClose: () => void
  allocation?: any
}

export function AddAllocationDialog({ open, onClose, allocation }: AddAllocationDialogProps) {
  const queryClient = useQueryClient()


  const [formData, setFormData] = useState({
    client_id: '',
    asset_id: '',
    quantity: '',
    buy_price: '',
    buy_date: new Date().toISOString().split('T')[0]
  })
  const [selectedAsset, setSelectedAsset] = useState<any>(null)

  // Buscar clientes
  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsService.getClients({ size: 1000 }),
  })

  // Buscar ativos
  const { data: assetsData } = useQuery({
    queryKey: ['assets'],
    queryFn: () => assetsService.getAssets({ size: 1000 }),
  })

  // Update form data when allocation changes
  useEffect(() => {
    if (open && allocation) {
      const newFormData = {
        client_id: allocation.client_id?.toString() || '',
        asset_id: allocation.asset_id?.toString() || '',
        quantity: allocation.quantity?.toString() || '',
        buy_price: allocation.buy_price?.toString() || '',
        buy_date: allocation.buy_date ? allocation.buy_date.split('T')[0] : new Date().toISOString().split('T')[0]
      }
      setFormData(newFormData)
      setSelectedAsset(allocation.asset || null)
    } else if (open && !allocation) {
      // Reset form for new allocation
      const defaultFormData = {
        client_id: '',
        asset_id: '',
        quantity: '',
        buy_price: '',
        buy_date: new Date().toISOString().split('T')[0]
      }
      setFormData(defaultFormData)
      setSelectedAsset(null)
    } else if (!open) {
      // Reset form when dialog closes
      const defaultFormData = {
        client_id: '',
        asset_id: '',
        quantity: '',
        buy_price: '',
        buy_date: new Date().toISOString().split('T')[0]
      }
      setFormData(defaultFormData)
      setSelectedAsset(null)
    }
  }, [open, allocation])

  // Force form data to stay set when allocation exists
  useEffect(() => {
    if (open && allocation && formData.client_id === '') {
      const newFormData = {
        client_id: allocation.client_id?.toString() || '',
        asset_id: allocation.asset_id?.toString() || '',
        quantity: allocation.quantity?.toString() || '',
        buy_price: allocation.buy_price?.toString() || '',
        buy_date: allocation.buy_date ? allocation.buy_date.split('T')[0] : new Date().toISOString().split('T')[0]
      }
      setFormData(newFormData)
      setSelectedAsset(allocation.asset || null)
    }
  }, [open, allocation, formData.client_id])

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (allocation) {
        return allocationsService.updateAllocation(allocation.id, {
          ...data,
          buy_date: new Date(data.buy_date).toISOString()
        })
      } else {
        return allocationsService.createAllocation({
          ...data,
          buy_date: new Date(data.buy_date).toISOString()
        })
      }
    },
    onSuccess: () => {
      const message = allocation ? 'Alocação atualizada com sucesso!' : 'Alocação criada com sucesso!'
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['allocations'] })
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      onClose()
    },
    onError: (error: any) => {
      const message = allocation ? 'Erro ao atualizar alocação' : 'Erro ao criar alocação'
      toast.error(error.response?.data?.detail || message)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.client_id || !formData.asset_id || !formData.quantity || !formData.buy_price || !formData.buy_date) {
      toast.error('Preencha todos os campos obrigatórios.')
      return
    }

    await saveMutation.mutateAsync({
      ...formData,
      client_id: parseInt(formData.client_id),
      asset_id: parseInt(formData.asset_id),
      quantity: parseFloat(formData.quantity),
      buy_price: parseFloat(formData.buy_price)
    })
  }

  const handleAssetChange = useCallback((assetId: string) => {
    const asset = assetsData?.items?.find((a: any) => a.id.toString() === assetId)
    setSelectedAsset(asset)
    setFormData(prev => ({ 
      ...prev, 
      asset_id: assetId,
      buy_price: asset?.current_price ? asset.current_price.toFixed(2) : ''
    }))
  }, [assetsData?.items])

  const clients = clientsData?.items || []
  const assets = assetsData?.items || []


  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {allocation ? 'Editar Alocação' : 'Nova Alocação'}
              </CardTitle>
              <CardDescription>
                {allocation ? 'Atualize os dados da alocação.' : 'Crie uma nova alocação selecionando um ativo existente.'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="client_id">Cliente *</Label>
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client: any) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name} ({client.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ativo */}
            <div className="space-y-2">
              <Label htmlFor="asset_id">Ativo *</Label>
              <Select
                value={formData.asset_id}
                onValueChange={handleAssetChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um ativo" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset: any) => (
                    <SelectItem key={asset.id} value={asset.id.toString()}>
                      {asset.ticker} - {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Informações do Ativo Selecionado */}
            {selectedAsset && (
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
                <h3 className="font-semibold text-lg mb-3">Informações do Ativo</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Ticker:</span> {selectedAsset.ticker}
                  </div>
                  <div>
                    <span className="font-medium">Nome:</span> {selectedAsset.name}
                  </div>
                  <div>
                    <span className="font-medium">Preço Atual:</span> 
                    {selectedAsset.current_price ? ` R$ ${selectedAsset.current_price.toFixed(2)}` : ' -'}
                  </div>
                  <div>
                    <span className="font-medium">Bolsa:</span> {selectedAsset.exchange || '-'}
                  </div>
                </div>
              </div>
            )}

            {/* Quantidade e Preço */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 10"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buy_price">Preço de Compra *</Label>
                <Input
                  id="buy_price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 150.00"
                  value={formData.buy_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, buy_price: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Data de Compra */}
            <div className="space-y-2">
              <Label htmlFor="buy_date">Data de Compra *</Label>
              <Input
                id="buy_date"
                type="date"
                value={formData.buy_date}
                onChange={(e) => setFormData(prev => ({ ...prev, buy_date: e.target.value }))}
                required
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? 
                  (allocation ? 'Atualizando...' : 'Criando...') : 
                  (allocation ? 'Atualizar Alocação' : 'Criar Alocação')
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}