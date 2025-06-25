# ERP Sistemi

Modern işletme yönetimi için geliştirilmiş kapsamlı ERP (Enterprise Resource Planning) sistemi.

## 🚀 Özellikler

### 🔐 Kullanıcı Yönetimi (Authentication & Authorization)
- Kullanıcı kayıt ve giriş sistemi
- JWT tabanlı kimlik doğrulama
- Rol tabanlı yetkilendirme (Admin, Manager, User)
- Güvenli şifre hashleme

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

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication APIs
│   │   └── inventory/     # Inventory APIs
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Shared components
├── lib/                   # Library configurations
│   ├── auth.ts           # Authentication middleware
│   └── prisma.ts         # Prisma client
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
│   └── auth.ts          # Authentication utilities
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
cp .env.example .env
```

4. **Veritabanını oluşturun:**
```bash
npx prisma migrate dev
```

5. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

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
  "message": "İşlem başarılı"
}
```

## 🧪 Test

```bash
# Lint kontrolü
npm run lint

# Type kontrolü
npm run type-check

# Build test
npm run build
```

## 📝 Geliştirme Notları

### Tamamlanan İşler ✅
1. **Base Proje Yapısı**
   - Next.js 15 + TypeScript kurulumu
   - Tailwind CSS entegrasyonu
   - ESLint yapılandırması

2. **Veritabanı Tasarımı**
   - Prisma ORM kurulumu
   - SQLite veritabanı yapılandırması
   - ERP modülleri için veritabanı şeması

3. **Authentication Sistemi**
   - JWT tabanlı kimlik doğrulama
   - bcryptjs ile şifre hashleme
   - Rol tabanlı yetkilendirme middleware'i
   - Register ve Login API endpoint'leri

4. **Inventory Modülü** ✅
   - Ürün yönetimi (CRUD işlemleri)
   - Kategori yönetimi (hiyerarşik yapı)
   - Stok hareketi takibi
   - Stok uyarıları ve dashboard
   - Filtreleme ve arama özellikleri
   - API endpoint'leri

5. **SOLID Prensipleri**
   - Modüler klasör yapısı
   - Service katmanı implementasyonu
   - Interface segregation
   - Dependency injection hazırlığı

6. **Temel UI**
   - Responsive giriş/kayıt formu
   - Modern tasarım
   - Form validasyonu

### Devam Eden İşler 🔄
- CRM modülü geliştirme
- Order management modülü
- Financial management modülü

### Planlanan İşler 📋
- Dashboard geliştirme
- Raporlama sistemi
- Export/Import özellikleri
- Real-time bildirimler
- Mobile responsive tasarım

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.
