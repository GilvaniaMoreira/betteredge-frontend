/**
 * Converte um array de objetos para formato CSV
 */
export function convertToCSV(data: any[], headers: { key: string; label: string }[]): string {
  if (!data || data.length === 0) {
    return ''
  }

  // Header row
  const headerRow = headers.map(h => `"${h.label}"`).join(',')
  
  // Data rows
  const dataRows = data.map(item => {
    return headers.map(header => {
      const value = getNestedValue(item, header.key)
      // Escape quotes and wrap in quotes
      const stringValue = value?.toString() || ''
      return `"${stringValue.replace(/"/g, '""')}"`
    }).join(',')
  }).join('\n')

  return `${headerRow}\n${dataRows}`
}

/**
 * Obtém valor aninhado de um objeto usando notação de ponto
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * Faz o download de um arquivo CSV
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Exporta dados para CSV
 */
export function exportToCSV(
  data: any[], 
  headers: { key: string; label: string }[], 
  filename: string
): void {
  const csv = convertToCSV(data, headers)
  if (csv) {
    downloadCSV(csv, `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  }
}


