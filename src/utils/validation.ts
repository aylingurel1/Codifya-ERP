// Merkezi validation fonksiyonları
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  // En az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export const validateSKU = (sku: string): boolean => {
  // SKU formatı: En az 3 karakter, sadece harf, rakam ve tire
  const skuRegex = /^[A-Za-z0-9-]{3,}$/
  return skuRegex.test(sku)
}

export const validatePrice = (price: number): boolean => {
  return price >= 0 && Number.isFinite(price)
}

export const validateStock = (stock: number): boolean => {
  return stock >= 0 && Number.isInteger(stock)
}

export const validatePhone = (phone: string): boolean => {
  // Türkiye telefon numarası formatı
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const validateTaxNumber = (taxNumber: string): boolean => {
  // Türkiye vergi numarası formatı (10 haneli)
  const taxRegex = /^[0-9]{10}$/
  return taxRegex.test(taxNumber)
} 