# Tedarik Zinciri Modülü

## 1. Modülün Amacı ve Kapsamı
Tedarik Zinciri modülü, stok yönetimi, satın alma, tedarikçi ilişkileri ve depo operasyonlarının dijital olarak yönetilmesini sağlar. Malzeme talepleri, siparişler, stok hareketleri ve tedarikçi performansı bu modül üzerinden takip edilir.

## 2. Temel Kavramlar ve Terimler
- **Stok Kartı:** Ürün veya malzemenin temel bilgilerinin tutulduğu kayıt.
- **Satın Alma Siparişi:** Tedarikçiye iletilen malzeme veya hizmet talebi.
- **Stok Hareketi:** Depoya giriş, çıkış ve transfer işlemleri.
- **Tedarikçi:** Mal veya hizmet alınan firma.
- **Depo:** Stokların fiziksel olarak tutulduğu alan.

## 3. Ana Fonksiyonlar ve Ekranlar
- **Stok Yönetimi:** Stok kartı oluşturma, güncelleme, stok seviyelerini izleme.
- **Satın Alma Yönetimi:** Satın alma talebi, siparişi, onay ve teslim alma işlemleri.
- **Tedarikçi Yönetimi:** Tedarikçi ekleme, değerlendirme, sözleşme takibi.
- **Depo Operasyonları:** Depo transferi, sayım, envanter raporları.
- **Raporlama:** Stok durumu, satın alma analizi, tedarikçi performansı.

## 4. Sık Kullanılan İşlemler
### 4.1 Yeni Satın Alma Siparişi Oluşturma
1. "Satın Alma" menüsüne girin.
2. "Yeni Sipariş" butonuna tıklayın.
3. Tedarikçi ve ürün(ler) seçin.
4. Miktar, fiyat ve teslimat tarihini girin.
5. "Kaydet" ile siparişi oluşturun.

### 4.2 Stok Girişi Yapma
1. "Stoklar" menüsüne girin.
2. İlgili stok kartını seçin.
3. "Giriş" işlemini başlatın.
4. Miktar ve açıklama girin.
5. "Kaydet" ile işlemi tamamlayın.

### 4.3 Depo Transferi
1. "Depolar" menüsüne girin.
2. Transfer yapılacak depoları seçin.
3. Ürün ve miktarı belirleyin.
4. "Transfer Et" ile işlemi tamamlayın.

## 5. Sıkça Sorulan Sorular (SSS)
- **Stok kartı silinebilir mi?**
  - Sadece hareket görmemiş stok kartları silinebilir.
- **Satın alma siparişi iptal edilebilir mi?**
  - Teslim alınmamış siparişler iptal edilebilir.
- **Tedarikçi puanlaması nasıl yapılır?**
  - Teslimat süresi, kalite ve fiyat kriterlerine göre otomatik puanlama yapılır.

## 6. Teknik Detaylar
### API Örnekleri
- **Stok Listeleme:**
  ```http
  GET /api/supply/v1/stocks?status=active
  ```
- **Yeni Satın Alma Siparişi:**
  ```http
  POST /api/supply/v1/purchase-orders
  Content-Type: application/json
  {
    "supplierId": 321,
    "items": [
      { "stockId": 45, "quantity": 100, "unitPrice": 20 }
    ],
    "deliveryDate": "2023-09-01"
  }
  ```
- **Depo Transferi:**
  ```http
  POST /api/supply/v1/warehouse-transfers
  Content-Type: application/json
  {
    "fromWarehouseId": 1,
    "toWarehouseId": 2,
    "items": [
      { "stockId": 45, "quantity": 50 }
    ]
  }
  ```

### Entegrasyonlar
- **Tedarikçi Portalı:** Tedarikçilerle online sipariş ve teklif entegrasyonu.
- **ERP Entegrasyonu:** Satın alma ve stok hareketlerinin finans modülüne entegrasyonu.

## 7. En İyi Uygulamalar
- Stok seviyelerini düzenli kontrol edin.
- Satın alma ve depo işlemlerinde onay mekanizması kullanın.
- Tedarikçi performansını periyodik olarak değerlendirin.

Daha fazla bilgi için tedarik zinciri yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 