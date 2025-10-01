'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { clientsService } from '@/services/clients'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

const clientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  is_active: z.boolean().default(true),
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientFormProps {
  client?: any
  onClose: () => void
}

export function ClientForm({ client, onClose }: ClientFormProps) {
  const queryClient = useQueryClient()
  const isEditing = !!client

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client || {
      name: '',
      email: '',
      is_active: true,
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: ClientFormData) => clientsService.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente criado com sucesso!')
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao criar cliente')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: ClientFormData) => clientsService.updateClient(client.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast.success('Cliente atualizado com sucesso!')
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Erro ao atualizar cliente')
    },
  })

  const onSubmit = async (data: ClientFormData) => {
    if (isEditing) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Nome do cliente"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                {...register('is_active')}
                className="rounded"
              />
              <Label htmlFor="is_active">Cliente ativo</Label>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

