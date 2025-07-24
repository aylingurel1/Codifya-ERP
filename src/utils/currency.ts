/**
 * Para birimi kodunu normalize eder
 * Geçersiz para birimi kodlarını geçerli ISO 4217 kodlarına dönüştürür
 */
export function normalizeCurrencyCode(currency?: string | null): string {
  if (!currency) return "TRY";

  // Geçersiz "TL" kodunu "TRY" olarak düzelt
  if (currency === "TL") return "TRY";

  // Diğer geçerli para birimi kodları için doğrudan döndür
  return currency;
}

/**
 * Miktar ve para birimini Türkçe locale ile formatlar
 */
export function formatCurrency(
  amount: number,
  currency?: string | null,
  locale: string = "tr-TR"
): string {
  const normalizedCurrency = normalizeCurrencyCode(currency);

  return amount.toLocaleString(locale, {
    style: "currency",
    currency: normalizedCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
