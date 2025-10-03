import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

export function calculateArea(length, width, unit = 'sq ft') {
  const area = length * width
  return { area, unit }
}

export function parseBulkPaste(text) {
  const lines = text.trim().split('\n')
  return lines.map(line => {
    const parts = line.split(/[\t,]/).map(p => p.trim())
    return {
      code: parts[0] || '',
      name: parts[1] || '',
      qty: parseFloat(parts[2]) || 1,
      price: parseFloat(parts[3]) || 0,
    }
  })
}
