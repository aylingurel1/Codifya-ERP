# Banking Components

Bu klasör banka yönetim sisteminin modüler bileşenlerini içerir.

## Dosya Yapısı

### Bileşenler

- `BankAccountCard.tsx` - Banka hesabı kartı bileşeni
- `BankAccountsTab.tsx` - Banka hesapları sekmesi
- `NewAccountDialog.tsx` - Yeni hesap ekleme dialog'u
- `EditAccountDialog.tsx` - Hesap düzenleme dialog'u
- `DeleteAccountDialog.tsx` - Hesap silme onay dialog'u
- `TransactionsTab.tsx` - İşlemler sekmesi
- `NewTransactionDialog.tsx` - Yeni işlem dialog'u
- `TransactionFilters.tsx` - İşlem filtreleme bileşeni
- `TransactionTable.tsx` - İşlem tablosu
- `Pagination.tsx` - Sayfalama bileşeni
- `StatementsTab.tsx` - Ekstreler sekmesi

### Hooks

- `useBankingData.ts` - Banka verilerini yöneten custom hook

### Types

- `types.ts` - TypeScript tip tanımları

## Kullanım

```tsx
import {
  BankAccountsTab,
  TransactionsTab,
  StatementsTab,
  useBankingData,
} from "@/components/finance/banking";

export default function BankingPage() {
  const { accounts, transactions, loading } = useBankingData();

  return (
    <div>
      <BankAccountsTab accounts={accounts} loading={loading} ... />
    </div>
  );
}
```

## Özellikler

- ✅ Modüler yapı
- ✅ TypeScript desteği
- ✅ Custom hook ile veri yönetimi
- ✅ Yeniden kullanılabilir bileşenler
- ✅ Ayrılmış sorumluluklar
- ✅ Kolay test edilebilirlik

## Bileşen Sorumlulukları

### BankAccountsTab

- Banka hesaplarını listeler
- Yeni hesap ekleme
- Hesap düzenleme/silme işlemlerini yönetir

### TransactionsTab

- Banka işlemlerini listeler
- Filtreleme ve sayfalama
- Yeni işlem oluşturma
- İşlem onaylama

### StatementsTab

- Ekstre alma işlemleri
- Geçmiş ekstreleri görüntüleme

### useBankingData Hook

- API çağrılarını yönetir
- Loading ve error state'lerini handle eder
- CRUD operasyonlarını sağlar
