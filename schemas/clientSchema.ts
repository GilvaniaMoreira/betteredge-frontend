import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  email: z.string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter um formato válido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  
  is_active: z.boolean().default(true)
})

export const clientUpdateSchema = clientSchema.partial()

export type ClientFormData = z.infer<typeof clientSchema>
export type ClientUpdateFormData = z.infer<typeof clientUpdateSchema>


