# Kasa Alt Modülü

## 1. Modülün Amacı ve Kapsamı
Kasa alt modülü, şirketin nakit işlemlerinin, kasa giriş-çıkışlarının ve günlük kasa bakiyesinin yönetilmesini sağlar. Nakit tahsilat, ödeme, avans ve kasa raporları bu modül üzerinden yürütülür.

## 2. Temel Kavramlar ve Terimler
- **Kasa:** Şirketin fiziksel veya sanal nakit varlığını temsil eden hesap.
- **Kasa İşlemi:** Nakit giriş veya çıkış hareketi.
- **Avans:** Personel veya tedarikçiye verilen/geri alınan nakit.
- **Kasa Raporu:** Belirli bir döneme ait kasa hareketlerinin ve bakiyesinin raporu.

## 3. Ana Fonksiyonlar ve Ekranlar
- **Kasa Yönetimi:** Kasa ekleme, güncelleme, silme.
- **Kasa İşlemleri:** Nakit tahsilat, ödeme, avans işlemleri.
- **Raporlama:** Kasa hareketleri, günlük ve dönemsel kasa bakiyesi.

## 4. Sık Kullanılan İşlemler
### 4.1 Yeni Kasa İşlemi Ekleme
1. "Kasa İşlemleri" menüsüne girin.
2. "Yeni İşlem" butonuna tıklayın.
3. İşlem türünü (tahsilat/ödeme/avans) seçin.
4. Tutar, açıklama ve ilgili kişiyi girin.
5. "Kaydet" ile işlemi tamamlayın.

### 4.2 Kasa Raporu Alma
1. "Raporlar" menüsüne girin.
2. "Kasa Raporu"nu seçin.
3. Tarih aralığını belirleyin.
4. "Raporu Getir" butonuna tıklayın.

## 5. Sıkça Sorulan Sorular (SSS)
- **Kasa silindiğinde ne olur?**
  - Kasa pasif hale getirilir, geçmiş işlemler saklanır.
- **Avans işlemleri nasıl takip edilir?**
  - Avanslar ayrı bir raporda izlenebilir.
- **Kasa bakiyesi negatif olabilir mi?**
  - Yetkili kullanıcılar için mümkündür, sistem uyarı verir.

## 6. Teknik Detaylar
### API Örnekleri
- **Kasa Listeleme:**
  ```http
  GET /api/finance/v1/cash/desks
  ```
- **Yeni Kasa İşlemi:**
  ```http
  POST /api/finance/v1/cash/transactions
  Content-Type: application/json
  {
    "cashDeskId": 2,
    "type": "tahsilat",
    "amount": 5000,
    "description": "Nakit tahsilat",
    "personId": 15
  }
  ```
- **Kasa Raporu:**
  ```http
  GET /api/finance/v1/cash/reports?startDate=2023-01-01&endDate=2023-01-31
  ```

### Entegrasyonlar
- **Muhasebe Modülü:** Kasa işlemlerinin muhasebe fişlerine otomatik aktarımı.

## 7. En İyi Uygulamalar
- Kasa işlemlerinde yetki kontrollerini uygulayın.
- Nakit hareketlerini günlük olarak kaydedin.
- Kasa bakiyesini düzenli kontrol edin.

Daha fazla bilgi için finans yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 