# Codifya ERP API Dokümantasyonu

## Genel Bilgiler

### Base URL
```
https://api.codifya-erp.com/v1
```

### Kimlik Doğrulama
Tüm API istekleri JWT token ile kimlik doğrulaması gerektirir. Token'ı HTTP header'da `Authorization` alanında göndermelisiniz:

```
Authorization: Bearer <your_jwt_token>
```

### Hata Kodları
- 200: Başarılı
- 201: Oluşturuldu
- 400: Geçersiz İstek
- 401: Yetkisiz
- 403: Yasaklı
- 404: Bulunamadı
- 500: Sunucu Hatası

## Finans API

### Hesap Planı

#### Hesap Listesi
```http
GET /accounts

Query Parameters:
- page: Sayfa numarası (default: 1)
- limit: Sayfa başına kayıt (default: 20)
- search: Arama terimi
- type: Hesap tipi
- parent_id: Üst hesap ID'si

Response:
{
  "data": [
    {
      "id": 1,
      "code": "100",
      "name": "Kasa",
      "type": "asset",
      "parent_id": null,
      "created_at": "2024-03-20T10:00:00Z",
      "updated_at": "2024-03-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

#### Hesap Detayı
```http
GET /accounts/{id}

Response:
{
  "id": 1,
  "code": "100",
  "name": "Kasa",
  "type": "asset",
  "parent_id": null,
  "created_at": "2024-03-20T10:00:00Z",
  "updated_at": "2024-03-20T10:00:00Z"
}
```

#### Hesap Oluşturma
```http
POST /accounts

Request Body:
{
  "code": "100",
  "name": "Kasa",
  "type": "asset",
  "parent_id": null
}

Response:
{
  "id": 1,
  "code": "100",
  "name": "Kasa",
  "type": "asset",
  "parent_id": null,
  "created_at": "2024-03-20T10:00:00Z",
  "updated_at": "2024-03-20T10:00:00Z"
}
```

### Fiş İşlemleri

#### Fiş Listesi
```http
GET /vouchers

Query Parameters:
- page: Sayfa numarası (default: 1)
- limit: Sayfa başına kayıt (default: 20)
- start_date: Başlangıç tarihi
- end_date: Bitiş tarihi
- type: Fiş tipi
- status: Fiş durumu

Response:
{
  "data": [
    {
      "id": 1,
      "voucher_no": "F2024001",
      "voucher_date": "2024-03-20",
      "type": "receipt",
      "description": "Kasa tahsilatı",
      "status": "approved",
      "created_by": 1,
      "created_at": "2024-03-20T10:00:00Z",
      "updated_at": "2024-03-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

#### Fiş Oluşturma
```http
POST /vouchers

Request Body:
{
  "voucher_date": "2024-03-20",
  "type": "receipt",
  "description": "Kasa tahsilatı",
  "lines": [
    {
      "account_id": 1,
      "debit": 1000.00,
      "credit": 0.00,
      "description": "Tahsilat"
    },
    {
      "account_id": 2,
      "debit": 0.00,
      "credit": 1000.00,
      "description": "Tahsilat"
    }
  ]
}

Response:
{
  "id": 1,
  "voucher_no": "F2024001",
  "voucher_date": "2024-03-20",
  "type": "receipt",
  "description": "Kasa tahsilatı",
  "status": "draft",
  "created_by": 1,
  "created_at": "2024-03-20T10:00:00Z",
  "updated_at": "2024-03-20T10:00:00Z",
  "lines": [
    {
      "id": 1,
      "account_id": 1,
      "debit": 1000.00,
      "credit": 0.00,
      "description": "Tahsilat"
    },
    {
      "id": 2,
      "account_id": 2,
      "debit": 0.00,
      "credit": 1000.00,
      "description": "Tahsilat"
    }
  ]
}
```

## İK API

### Personel

#### Personel Listesi
```http
GET /employees

Query Parameters:
- page: Sayfa numarası (default: 1)
- limit: Sayfa başına kayıt (default: 20)
- search: Arama terimi
- department_id: Departman ID'si
- status: Personel durumu

Response:
{
  "data": [
    {
      "id": 1,
      "employee_no": "EMP001",
      "first_name": "Ahmet",
      "last_name": "Yılmaz",
      "email": "ahmet.yilmaz@company.com",
      "department_id": 1,
      "position": "Yazılım Geliştirici",
      "status": "active",
      "created_at": "2024-03-20T10:00:00Z",
      "updated_at": "2024-03-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

#### Personel Oluşturma
```http
POST /employees

Request Body:
{
  "employee_no": "EMP001",
  "first_name": "Ahmet",
  "last_name": "Yılmaz",
  "email": "ahmet.yilmaz@company.com",
  "department_id": 1,
  "position": "Yazılım Geliştirici",
  "hire_date": "2024-03-20",
  "salary": 15000.00
}

Response:
{
  "id": 1,
  "employee_no": "EMP001",
  "first_name": "Ahmet",
  "last_name": "Yılmaz",
  "email": "ahmet.yilmaz@company.com",
  "department_id": 1,
  "position": "Yazılım Geliştirici",
  "status": "active",
  "created_at": "2024-03-20T10:00:00Z",
  "updated_at": "2024-03-20T10:00:00Z"
}
```

## Satış API

### Müşteriler

#### Müşteri Listesi
```http
GET /customers

Query Parameters:
- page: Sayfa numarası (default: 1)
- limit: Sayfa başına kayıt (default: 20)
- search: Arama terimi
- type: Müşteri tipi
- status: Müşteri durumu

Response:
{
  "data": [
    {
      "id": 1,
      "customer_no": "CUST001",
      "name": "ABC Ltd. Şti.",
      "type": "corporate",
      "tax_number": "1234567890",
      "tax_office": "Kadıköy",
      "address": "İstanbul, Türkiye",
      "phone": "+90 212 123 4567",
      "email": "info@abcltd.com",
      "status": "active",
      "created_at": "2024-03-20T10:00:00Z",
      "updated_at": "2024-03-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

#### Müşteri Oluşturma
```http
POST /customers

Request Body:
{
  "customer_no": "CUST001",
  "name": "ABC Ltd. Şti.",
  "type": "corporate",
  "tax_number": "1234567890",
  "tax_office": "Kadıköy",
  "address": "İstanbul, Türkiye",
  "phone": "+90 212 123 4567",
  "email": "info@abcltd.com"
}

Response:
{
  "id": 1,
  "customer_no": "CUST001",
  "name": "ABC Ltd. Şti.",
  "type": "corporate",
  "tax_number": "1234567890",
  "tax_office": "Kadıköy",
  "address": "İstanbul, Türkiye",
  "phone": "+90 212 123 4567",
  "email": "info@abcltd.com",
  "status": "active",
  "created_at": "2024-03-20T10:00:00Z",
  "updated_at": "2024-03-20T10:00:00Z"
}
```

## Tedarik Zinciri API

### Stok

#### Stok Listesi
```http
GET /inventory

Query Parameters:
- page: Sayfa numarası (default: 1)
- limit: Sayfa başına kayıt (default: 20)
- search: Arama terimi
- category_id: Kategori ID'si
- warehouse_id: Depo ID'si

Response:
{
  "data": [
    {
      "id": 1,
      "item_code": "ITEM001",
      "name": "Laptop",
      "category_id": 1,
      "unit": "adet",
      "quantity": 100,
      "warehouse_id": 1,
      "created_at": "2024-03-20T10:00:00Z",
      "updated_at": "2024-03-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

#### Stok Hareketi Oluşturma
```http
POST /inventory/movements

Request Body:
{
  "item_id": 1,
  "warehouse_id": 1,
  "movement_type": "in",
  "quantity": 10,
  "reference_type": "purchase",
  "reference_id": 1,
  "description": "Satın alma girişi"
}

Response:
{
  "id": 1,
  "item_id": 1,
  "warehouse_id": 1,
  "movement_type": "in",
  "quantity": 10,
  "reference_type": "purchase",
  "reference_id": 1,
  "description": "Satın alma girişi",
  "created_at": "2024-03-20T10:00:00Z",
  "updated_at": "2024-03-20T10:00:00Z"
}
```

## Üretim API

### Üretim Emirleri

#### Üretim Emri Listesi
```http
GET /production/orders

Query Parameters:
- page: Sayfa numarası (default: 1)
- limit: Sayfa başına kayıt (default: 20)
- search: Arama terimi
- status: Emir durumu
- start_date: Başlangıç tarihi
- end_date: Bitiş tarihi

Response:
{
  "data": [
    {
      "id": 1,
      "order_no": "PO2024001",
      "product_id": 1,
      "quantity": 100,
      "planned_start_date": "2024-03-20",
      "planned_end_date": "2024-03-25",
      "status": "planned",
      "created_at": "2024-03-20T10:00:00Z",
      "updated_at": "2024-03-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

#### Üretim Emri Oluşturma
```http
POST /production/orders

Request Body:
{
  "product_id": 1,
  "quantity": 100,
  "planned_start_date": "2024-03-20",
  "planned_end_date": "2024-03-25",
  "bom_id": 1,
  "routing_id": 1
}

Response:
{
  "id": 1,
  "order_no": "PO2024001",
  "product_id": 1,
  "quantity": 100,
  "planned_start_date": "2024-03-20",
  "planned_end_date": "2024-03-25",
  "status": "planned",
  "created_at": "2024-03-20T10:00:00Z",
  "updated_at": "2024-03-20T10:00:00Z"
}
```

## Proje Yönetimi API

### Projeler

#### Proje Listesi
```http
GET /projects

Query Parameters:
- page: Sayfa numarası (default: 1)
- limit: Sayfa başına kayıt (default: 20)
- search: Arama terimi
- status: Proje durumu
- manager_id: Proje yöneticisi ID'si

Response:
{
  "data": [
    {
      "id": 1,
      "project_no": "PRJ001",
      "name": "Yeni Ürün Geliştirme",
      "description": "Yeni ürün geliştirme projesi",
      "manager_id": 1,
      "start_date": "2024-03-20",
      "end_date": "2024-06-20",
      "status": "active",
      "created_at": "2024-03-20T10:00:00Z",
      "updated_at": "2024-03-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

#### Proje Oluşturma
```http
POST /projects

Request Body:
{
  "name": "Yeni Ürün Geliştirme",
  "description": "Yeni ürün geliştirme projesi",
  "manager_id": 1,
  "start_date": "2024-03-20",
  "end_date": "2024-06-20",
  "budget": 100000.00
}

Response:
{
  "id": 1,
  "project_no": "PRJ001",
  "name": "Yeni Ürün Geliştirme",
  "description": "Yeni ürün geliştirme projesi",
  "manager_id": 1,
  "start_date": "2024-03-20",
  "end_date": "2024-06-20",
  "status": "active",
  "created_at": "2024-03-20T10:00:00Z",
  "updated_at": "2024-03-20T10:00:00Z"
}
```

## Analitik API

### Raporlar

#### Rapor Listesi
```http
GET /reports

Query Parameters:
- page: Sayfa numarası (default: 1)
- limit: Sayfa başına kayıt (default: 20)
- type: Rapor tipi
- category: Rapor kategorisi

Response:
{
  "data": [
    {
      "id": 1,
      "name": "Gelir Tablosu",
      "type": "financial",
      "category": "finance",
      "description": "Gelir tablosu raporu",
      "created_at": "2024-03-20T10:00:00Z",
      "updated_at": "2024-03-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

#### Rapor Oluşturma
```http
POST /reports/generate

Request Body:
{
  "report_id": 1,
  "parameters": {
    "start_date": "2024-01-01",
    "end_date": "2024-03-20",
    "format": "pdf"
  }
}

Response:
{
  "id": 1,
  "report_id": 1,
  "status": "processing",
  "download_url": "https://api.codifya-erp.com/v1/reports/download/1",
  "created_at": "2024-03-20T10:00:00Z",
  "updated_at": "2024-03-20T10:00:00Z"
}
```

## Sistem API

### Kullanıcılar

#### Kullanıcı Listesi
```http
GET /users

Query Parameters:
- page: Sayfa numarası (default: 1)
- limit: Sayfa başına kayıt (default: 20)
- search: Arama terimi
- role_id: Rol ID'si
- status: Kullanıcı durumu

Response:
{
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@company.com",
      "role_id": 1,
      "status": "active",
      "created_at": "2024-03-20T10:00:00Z",
      "updated_at": "2024-03-20T10:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

#### Kullanıcı Oluşturma
```http
POST /users

Request Body:
{
  "username": "admin",
  "email": "admin@company.com",
  "password": "password123",
  "role_id": 1
}

Response:
{
  "id": 1,
  "username": "admin",
  "email": "admin@company.com",
  "role_id": 1,
  "status": "active",
  "created_at": "2024-03-20T10:00:00Z",
  "updated_at": "2024-03-20T10:00:00Z"
}
``` 