// VAT and Levy helpers

// Standard VAT rate
export const VAT_RATE = 0.15

// Effective VAT rate for imports (16.5%)
export const IMPORT_VAT_RATE = 0.165

// Plastic bag levy (N$ 1.00)
export const PLASTIC_BAG_LEVY = 1.0

// Products that are zero-rated
export const ZERO_RATED_PRODUCTS = [
  "maize meal",
  "mahango",
  "mahango meal",
  "beans",
  "sunflower cooking oil",
  "animal fat",
  "bread flour",
  "cake flour",
  "sugar",
  "fresh milk",
  "funeral services",
  "international transport",
  "residential land/buildings",
  "sanitary pads"
]

// Check if product is zero-rated
export const isZeroRated = (productName: string): boolean => {
  const lowerName = productName.toLowerCase()
  return ZERO_RATED_PRODUCTS.some(item => lowerName.includes(item.toLowerCase()))
}

// Calculate VAT (if not zero-rated)
export const calculateVAT = (price: number, productName: string): number => {
  if (isZeroRated(productName)) return 0
  return price * VAT_RATE
}

// Calculate total with VAT and plastic bag
export const calculateTotal = (
  price: number,
  quantity: number,
  productName: string,
  bags: number = 0
) => {
  const subtotal = price * quantity
  const vat = calculateVAT(subtotal, productName)
  const bagFee = bags * PLASTIC_BAG_LEVY
  return {
    subtotal,
    vat,
    bagFee,
    total: subtotal + vat + bagFee
  }
}
