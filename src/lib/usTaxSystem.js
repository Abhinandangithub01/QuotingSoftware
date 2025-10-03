// US Sales Tax System
// Handles state-specific tax rates and exemptions

export const US_STATE_TAX_RATES = {
  // No sales tax states
  'AK': { rate: 0, name: 'Alaska', hasLocalTax: true },
  'DE': { rate: 0, name: 'Delaware', hasLocalTax: false },
  'MT': { rate: 0, name: 'Montana', hasLocalTax: false },
  'NH': { rate: 0, name: 'New Hampshire', hasLocalTax: false },
  'OR': { rate: 0, name: 'Oregon', hasLocalTax: false },
  
  // States with sales tax (2024 rates)
  'AL': { rate: 4.00, name: 'Alabama', hasLocalTax: true },
  'AZ': { rate: 5.60, name: 'Arizona', hasLocalTax: true },
  'AR': { rate: 6.50, name: 'Arkansas', hasLocalTax: true },
  'CA': { rate: 7.25, name: 'California', hasLocalTax: true },
  'CO': { rate: 2.90, name: 'Colorado', hasLocalTax: true },
  'CT': { rate: 6.35, name: 'Connecticut', hasLocalTax: false },
  'FL': { rate: 6.00, name: 'Florida', hasLocalTax: true },
  'GA': { rate: 4.00, name: 'Georgia', hasLocalTax: true },
  'HI': { rate: 4.00, name: 'Hawaii', hasLocalTax: true },
  'ID': { rate: 6.00, name: 'Idaho', hasLocalTax: true },
  'IL': { rate: 6.25, name: 'Illinois', hasLocalTax: true },
  'IN': { rate: 7.00, name: 'Indiana', hasLocalTax: false },
  'IA': { rate: 6.00, name: 'Iowa', hasLocalTax: true },
  'KS': { rate: 6.50, name: 'Kansas', hasLocalTax: true },
  'KY': { rate: 6.00, name: 'Kentucky', hasLocalTax: false },
  'LA': { rate: 4.45, name: 'Louisiana', hasLocalTax: true },
  'ME': { rate: 5.50, name: 'Maine', hasLocalTax: false },
  'MD': { rate: 6.00, name: 'Maryland', hasLocalTax: false },
  'MA': { rate: 6.25, name: 'Massachusetts', hasLocalTax: false },
  'MI': { rate: 6.00, name: 'Michigan', hasLocalTax: false },
  'MN': { rate: 6.875, name: 'Minnesota', hasLocalTax: true },
  'MS': { rate: 7.00, name: 'Mississippi', hasLocalTax: true },
  'MO': { rate: 4.225, name: 'Missouri', hasLocalTax: true },
  'NE': { rate: 5.50, name: 'Nebraska', hasLocalTax: true },
  'NV': { rate: 6.85, name: 'Nevada', hasLocalTax: true },
  'NJ': { rate: 6.625, name: 'New Jersey', hasLocalTax: false },
  'NM': { rate: 5.125, name: 'New Mexico', hasLocalTax: true },
  'NY': { rate: 4.00, name: 'New York', hasLocalTax: true },
  'NC': { rate: 4.75, name: 'North Carolina', hasLocalTax: true },
  'ND': { rate: 5.00, name: 'North Dakota', hasLocalTax: true },
  'OH': { rate: 5.75, name: 'Ohio', hasLocalTax: true },
  'OK': { rate: 4.50, name: 'Oklahoma', hasLocalTax: true },
  'PA': { rate: 6.00, name: 'Pennsylvania', hasLocalTax: true },
  'RI': { rate: 7.00, name: 'Rhode Island', hasLocalTax: false },
  'SC': { rate: 6.00, name: 'South Carolina', hasLocalTax: true },
  'SD': { rate: 4.50, name: 'South Dakota', hasLocalTax: true },
  'TN': { rate: 7.00, name: 'Tennessee', hasLocalTax: true },
  'TX': { rate: 6.25, name: 'Texas', hasLocalTax: true },
  'UT': { rate: 6.10, name: 'Utah', hasLocalTax: true },
  'VT': { rate: 6.00, name: 'Vermont', hasLocalTax: true },
  'VA': { rate: 5.30, name: 'Virginia', hasLocalTax: true },
  'WA': { rate: 6.50, name: 'Washington', hasLocalTax: true },
  'WV': { rate: 6.00, name: 'West Virginia', hasLocalTax: true },
  'WI': { rate: 5.00, name: 'Wisconsin', hasLocalTax: true },
  'WY': { rate: 4.00, name: 'Wyoming', hasLocalTax: true },
  'DC': { rate: 6.00, name: 'District of Columbia', hasLocalTax: false },
}

// Product categories with different tax treatment
export const PRODUCT_TAX_CATEGORIES = {
  TANGIBLE: 'tangible', // Standard taxable goods
  EXEMPT: 'exempt', // Tax-exempt items
  REDUCED: 'reduced', // Reduced rate items
  SERVICES: 'services', // Services (varies by state)
}

// Items that may be exempt or have reduced rates in some states
export const TAX_EXEMPT_CATEGORIES = {
  // Common exemptions (varies by state)
  GROCERIES: ['food', 'groceries'],
  PRESCRIPTION: ['prescription', 'medical'],
  CLOTHING: ['clothing', 'apparel'], // Exempt in some states
  MANUFACTURING: ['manufacturing', 'industrial'], // B2B exemptions
}

export class USTaxCalculator {
  constructor() {
    this.defaultState = 'CA' // Set your default state
    this.localTaxRates = {} // Store local tax rates by ZIP
  }

  /**
   * Calculate sales tax for a quote/invoice
   */
  calculateTax(params) {
    const {
      subtotal,
      state,
      zipCode = null,
      city = null,
      customerType = 'retail', // 'retail' or 'wholesale'
      taxExemptCertificate = null,
      items = [],
    } = params

    // Check for tax exemption
    if (taxExemptCertificate) {
      return {
        stateTax: 0,
        localTax: 0,
        totalTax: 0,
        taxRate: 0,
        exempt: true,
        exemptReason: 'Tax Exempt Certificate',
      }
    }

    // Get state tax rate
    const stateInfo = US_STATE_TAX_RATES[state] || US_STATE_TAX_RATES[this.defaultState]
    const stateTaxRate = stateInfo.rate

    // Calculate state tax
    const stateTax = (subtotal * stateTaxRate) / 100

    // Calculate local tax if applicable
    let localTax = 0
    let localTaxRate = 0

    if (stateInfo.hasLocalTax && zipCode) {
      localTaxRate = this.getLocalTaxRate(state, zipCode, city)
      localTax = (subtotal * localTaxRate) / 100
    }

    const totalTaxRate = stateTaxRate + localTaxRate
    const totalTax = stateTax + localTax

    return {
      stateTax,
      stateTaxRate,
      localTax,
      localTaxRate,
      totalTax,
      totalTaxRate,
      exempt: false,
      breakdown: {
        state: { rate: stateTaxRate, amount: stateTax },
        local: { rate: localTaxRate, amount: localTax },
      },
    }
  }

  /**
   * Get local tax rate by ZIP code
   * In production, integrate with TaxJar, Avalara, or similar API
   */
  getLocalTaxRate(state, zipCode, city) {
    // This should be replaced with actual API call
    // For now, return common local rates
    const commonLocalRates = {
      'CA': 2.5, // California cities often add 2-3%
      'TX': 2.0, // Texas cities add 1-2%
      'NY': 4.5, // NYC adds 4.5%
      'IL': 3.0, // Chicago adds ~3%
      'WA': 3.1, // Seattle adds ~3.1%
    }

    return commonLocalRates[state] || 0
  }

  /**
   * Check if customer is tax exempt
   */
  isCustomerTaxExempt(customer) {
    return !!(
      customer.taxExemptCertificate &&
      customer.taxExemptCertificateExpiry &&
      new Date(customer.taxExemptCertificateExpiry) > new Date()
    )
  }

  /**
   * Validate tax exempt certificate
   */
  validateTaxExemptCertificate(certificate) {
    // Validate certificate format and expiry
    if (!certificate.number || !certificate.state || !certificate.expiry) {
      return { valid: false, reason: 'Missing required fields' }
    }

    if (new Date(certificate.expiry) < new Date()) {
      return { valid: false, reason: 'Certificate expired' }
    }

    return { valid: true }
  }

  /**
   * Get tax rate for display
   */
  getTaxRateDisplay(state, zipCode = null) {
    const stateInfo = US_STATE_TAX_RATES[state]
    if (!stateInfo) return 'N/A'

    if (stateInfo.rate === 0) {
      return 'No sales tax'
    }

    let display = `${stateInfo.rate}% (State)`

    if (stateInfo.hasLocalTax && zipCode) {
      const localRate = this.getLocalTaxRate(state, zipCode)
      if (localRate > 0) {
        display += ` + ${localRate}% (Local)`
      }
    }

    return display
  }

  /**
   * Calculate nexus (where you have tax obligation)
   * Economic nexus thresholds vary by state
   */
  hasNexus(state, annualSales = 0, transactionCount = 0) {
    // Economic nexus thresholds (2024)
    const nexusThresholds = {
      'CA': { sales: 500000, transactions: null },
      'TX': { sales: 500000, transactions: null },
      'NY': { sales: 500000, transactions: null },
      'FL': { sales: 100000, transactions: null },
      // ... add more states
    }

    const threshold = nexusThresholds[state]
    if (!threshold) return false

    if (threshold.sales && annualSales >= threshold.sales) return true
    if (threshold.transactions && transactionCount >= threshold.transactions) return true

    return false
  }

  /**
   * Get all states where you have nexus
   */
  getNexusStates(salesByState = {}) {
    return Object.keys(salesByState).filter(state =>
      this.hasNexus(state, salesByState[state].sales, salesByState[state].transactions)
    )
  }
}

// Export singleton instance
export const taxCalculator = new USTaxCalculator()

// Helper function for quick tax calculation
export function calculateUSTax(subtotal, state, zipCode = null, options = {}) {
  return taxCalculator.calculateTax({
    subtotal,
    state,
    zipCode,
    ...options,
  })
}

// Format tax for display
export function formatTaxBreakdown(taxResult) {
  if (taxResult.exempt) {
    return `Tax Exempt: ${taxResult.exemptReason}`
  }

  const parts = []
  
  if (taxResult.stateTaxRate > 0) {
    parts.push(`State: ${taxResult.stateTaxRate}%`)
  }
  
  if (taxResult.localTaxRate > 0) {
    parts.push(`Local: ${taxResult.localTaxRate}%`)
  }

  return parts.join(' + ') + ` = ${taxResult.totalTaxRate.toFixed(3)}%`
}
