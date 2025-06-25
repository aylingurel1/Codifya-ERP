# ERP Sistemi

Modern işletme yönetimi için geliştirilmiş kapsamlı ERP (Enterprise Resource Planning) sistemi.

## 🚀 Özellikler

### 🔐 Kullanıcı Yönetimi (Authentication & Authorization)
- Kullanıcı kayıt ve giriş sistemi
- JWT tabanlı kimlik doğrulama
- Rol tabanlı yetkilendirme (Admin, Manager, User)
- Güvenli şifre hashleme
- Rate limiting koruması

### 👥 Müşteri Yönetimi (CRM)
- Müşteri kayıt ve profil yönetimi
- Müşteri arama ve filtreleme
- Müşteri geçmişi takibi

### 📦 Ürün Yönetimi (Inventory) ✅
- Ürün katalog yönetimi
- Stok takibi ve uyarıları
- SKU ve kategori yönetimi
- Fiyat ve maliyet yönetimi
- Stok hareketi takibi
- Kategori hiyerarşisi
- Düşük stok uyarıları

### 🛒 Sipariş Yönetimi
- Sipariş oluşturma ve takibi
- Sipariş durumu yönetimi
- Sipariş geçmişi
- Otomatik fiyat hesaplama

### 💰 Finansal Yönetim
- Ödeme takibi
- Fatura yönetimi
- Finansal raporlama

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Veritabanı**: SQLite (Prisma ORM)
- **Kimlik Doğrulama**: JWT, bcryptjs
- **UI Bileşenleri**: Lucide React, Headless UI
- **Validation**: Custom validation utilities
- **Logging**: Structured logging system
- **Error Handling**: Centralized error management

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication APIs
│   │   ├── inventory/     # Inventory APIs
│   │   ├── orders/        # Order APIs
│   │   ├── crm/           # Customer APIs
│   │   └── accounting/    # Financial APIs
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Shared components
├── lib/                   # Library configurations
│   ├── auth.ts           # Authentication middleware
│   └── prisma.ts         # Prisma client
├── middleware/            # Custom middleware
│   └── rateLimit.ts      # Rate limiting
├── modules/              # Feature modules
│   ├── auth/             # Authentication module
│   │   ├── components/   # Auth components
│   │   ├── services/     # Auth services
│   │   └── types/        # Auth types
│   ├── inventory/        # Product management ✅
│   │   ├── components/   # Inventory components
│   │   ├── services/     # Inventory services
│   │   └── types/        # Inventory types
│   ├── crm/              # Customer management
│   ├── orders/           # Order management
│   └── accounting/       # Financial management
├── types/                # Global TypeScript types
├── utils/                # Utility functions
│   ├── api.ts           # API response utilities
│   ├── auth.ts          # Authentication utilities
│   ├── validation.ts    # Validation utilities
│   ├── logger.ts        # Logging utilities
│   └── errors.ts        # Error handling utilities
└── hooks/                # Custom React hooks
```

## 🏗️ SOLID Prensipleri

Proje SOLID prensiplerine uygun olarak geliştirilmiştir:

- **Single Responsibility**: Her modül ve servis tek bir sorumluluğa sahip
- **Open/Closed**: Yeni özellikler mevcut kodu değiştirmeden eklenebilir
- **Liskov Substitution**: Interface'ler tutarlı şekilde implement edilir
- **Interface Segregation**: Küçük ve spesifik interface'ler
- **Dependency Inversion**: Yüksek seviye modüller düşük seviye detaylara bağımlı değil

## 🚀 Kurulum

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd epoxy-ecommerce
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın:**
```bash
# .env dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"
NODE_ENV="development"
```

4. **Veritabanını oluşturun:**
```bash
npx prisma migrate dev
```

5. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

## 🔧 Yeni Özellikler

### Validation Sistemi
- Email, şifre, SKU, fiyat validasyonu
- Türkiye telefon numarası ve vergi numarası formatı
- Merkezi validation utilities

### Logging Sistemi
- Structured logging
- Development ve production modları
- Error tracking

### Error Handling
- Merkezi error management
- Custom error sınıfları
- Consistent error responses

### Rate Limiting
- API endpoint koruması
- Auth endpoint'leri için daha sıkı limitler
- IP tabanlı rate limiting

### Enhanced API Responses
- Pagination desteği
- Detailed error responses
- Consistent response format

## 📊 Veritabanı Şeması

### Kullanıcılar (Users)
- `id`: Benzersiz kullanıcı ID'si
- `email`: E-posta adresi
- `password`: Hashlenmiş şifre
- `name`: Kullanıcı adı
- `role`: Kullanıcı rolü (ADMIN, MANAGER, USER)
- `isActive`: Aktiflik durumu

### Kategoriler (Categories)
- `id`: Benzersiz kategori ID'si
- `name`: Kategori adı
- `description`: Kategori açıklaması
- `parentId`: Üst kategori ID'si
- `isActive`: Aktiflik durumu

### Ürünler (Products)
- `id`: Benzersiz ürün ID'si
- `name`: Ürün adı
- `description`: Ürün açıklaması
- `sku`: Stok kodu
- `price`: Satış fiyatı
- `cost`: Maliyet
- `stock`: Stok miktarı
- `minStock`: Minimum stok seviyesi
- `categoryId`: Kategori ID'si
- `isActive`: Aktiflik durumu

### Stok Hareketleri (StockMovements)
- `id`: Benzersiz hareket ID'si
- `productId`: Ürün ID'si
- `type`: Hareket tipi (IN, OUT, ADJUSTMENT)
- `quantity`: Miktar
- `previousStock`: Önceki stok
- `newStock`: Yeni stok
- `reason`: Hareket nedeni
- `reference`: Referans bilgisi

### Müşteriler (Customers)
- `id`: Benzersiz müşteri ID'si
- `name`: Müşteri adı
- `email`: E-posta adresi
- `phone`: Telefon numarası
- `address`: Adres bilgisi
- `company`: Şirket adı
- `taxNumber`: Vergi numarası

### Siparişler (Orders)
- `id`: Benzersiz sipariş ID'si
- `orderNumber`: Sipariş numarası
- `customerId`: Müşteri ID'si
- `status`: Sipariş durumu
- `totalAmount`: Toplam tutar
- `taxAmount`: Vergi tutarı
- `discount`: İndirim tutarı
- `notes`: Sipariş notları

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Inventory Management
- `GET /api/inventory/products` - Ürün listesi
- `POST /api/inventory/products` - Yeni ürün oluşturma
- `GET /api/inventory/products/[id]` - Ürün detayı
- `PUT /api/inventory/products/[id]` - Ürün güncelleme
- `DELETE /api/inventory/products/[id]` - Ürün silme
- `GET /api/inventory/categories` - Kategori listesi
- `POST /api/inventory/categories` - Yeni kategori oluşturma
- `GET /api/inventory/stock-movements` - Stok hareketleri
- `POST /api/inventory/stock-movements` - Stok hareketi ekleme
- `GET /api/inventory/dashboard` - Inventory dashboard

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "İşlem başarılı",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🔒 Güvenlik

- JWT token expiration
- Password hashing (bcrypt)
- Rate limiting
- Input validation
- SQL injection koruması (Prisma)
- XSS koruması

## 📝 Geliştirme Notları

- TypeScript strict mode aktif
- ESLint kuralları uygulanıyor
- Prettier code formatting
- Modular architecture
- SOLID principles
- Error handling best practices
