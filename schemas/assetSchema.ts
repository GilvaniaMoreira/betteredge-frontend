import { z } from 'zod'

export const assetSchema = z.object({
  ticker: z.string()
    .min(1, 'Ticker é obrigatório')
    .min(2, 'Ticker deve ter pelo menos 2 caracteres')
    .max(20, 'Ticker deve ter no máximo 20 caracteres')
    .regex(/^[A-Z0-9.-]+$/, 'Ticker deve conter apenas letras maiúsculas, números, pontos e hífens'),
  
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  
  exchange: z.string()
    .min(1, 'Exchange é obrigatório')
    .max(50, 'Exchange deve ter no máximo 50 caracteres'),
  
  currency: z.string()
    .min(1, 'Moeda é obrigatória')
    .max(10, 'Moeda deve ter no máximo 10 caracteres'),
  
  current_price: z.number()
    .min(0, 'Preço deve ser maior ou igual a zero')
    .optional()
})

export const assetUpdateSchema = assetSchema.partial()

export const yahooAssetSchema = z.object({
  ticker: z.string()
    .min(1, 'Ticker é obrigatório')
    .max(20, 'Ticker deve ter no máximo 20 caracteres')
})

export type AssetFormData = z.infer<typeof assetSchema>
export type AssetUpdateFormData = z.infer<typeof assetUpdateSchema>
export type YahooAssetFormData = z.infer<typeof yahooAssetSchema>


