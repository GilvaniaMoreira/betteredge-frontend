import { z } from 'zod'

export const allocationSchema = z.object({
  client_id: z.number()
    .min(1, 'Cliente é obrigatório'),
  
  asset_id: z.number()
    .min(1, 'Ativo é obrigatório'),
  
  quantity: z.number()
    .min(0.000001, 'Quantidade deve ser maior que zero')
    .max(999999999, 'Quantidade deve ser menor que 1 bilhão'),
  
  buy_price: z.number()
    .min(0, 'Preço de compra deve ser maior ou igual a zero')
    .max(999999999, 'Preço de compra deve ser menor que 1 bilhão'),
  
  buy_date: z.string()
    .min(1, 'Data de compra é obrigatória')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
})

export const allocationUpdateSchema = allocationSchema.partial()

export type AllocationFormData = z.infer<typeof allocationSchema>
export type AllocationUpdateFormData = z.infer<typeof allocationUpdateSchema>


