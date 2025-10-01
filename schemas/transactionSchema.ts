import { z } from 'zod'

export const transactionTypeSchema = z.enum(['deposit', 'withdrawal'])

export const transactionSchema = z.object({
  client_id: z.number()
    .min(1, 'Cliente é obrigatório'),
  
  type: transactionTypeSchema,
  
  amount: z.number()
    .min(0.01, 'Valor deve ser maior que zero')
    .max(999999999, 'Valor deve ser menor que 1 bilhão'),
  
  date: z.string()
    .min(1, 'Data é obrigatória')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  
  note: z.string()
    .max(500, 'Nota deve ter no máximo 500 caracteres')
    .optional()
})

export const transactionUpdateSchema = transactionSchema.partial()

export type TransactionFormData = z.infer<typeof transactionSchema>
export type TransactionUpdateFormData = z.infer<typeof transactionUpdateSchema>
export type TransactionType = z.infer<typeof transactionTypeSchema>


