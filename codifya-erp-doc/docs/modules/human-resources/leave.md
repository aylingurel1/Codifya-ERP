# İzin Alt Modülü

## 1. Modülün Amacı ve Kapsamı
İzin alt modülü, çalışanların yıllık, mazeret, hastalık ve diğer izinlerinin dijital olarak talep edilmesini, onaylanmasını ve raporlanmasını sağlar. İzin bakiyesi, izin geçmişi ve onay süreçleri bu modül üzerinden yürütülür.

## 2. Temel Kavramlar ve Terimler
- **Yıllık İzin:** Çalışanın yasal hakkı olan yıllık izin süresi.
- **Mazeret İzni:** Kısa süreli, gerekçeli izinler.
- **İzin Bakiyesi:** Çalışanın kullanılabilir izin günü.
- **İzin Talebi:** Çalışan tarafından başlatılan izin isteği.

## 3. Ana Fonksiyonlar ve Ekranlar
- **İzin Talebi Oluşturma:** İzin türü, tarih aralığı ve açıklama girilerek talep oluşturma.
- **İzin Onay Süreci:** Yöneticinin izin talebini onaylaması veya reddetmesi.
- **İzin Bakiyesi Takibi:** Kullanılan ve kalan izinlerin görüntülenmesi.
- **Raporlama:** İzin geçmişi ve toplu izin raporları.

## 4. Sık Kullanılan İşlemler
### 4.1 Yeni İzin Talebi Oluşturma
1. "İzinler" menüsüne girin.
2. "Yeni İzin Talebi" butonuna tıklayın.
3. İzin türü, başlangıç ve bitiş tarihini seçin.
4. Açıklama ekleyin ve "Gönder" butonuna tıklayın.

### 4.2 İzin Onaylama
1. "Onay Bekleyen İzinler" menüsüne girin.
2. İlgili talebi seçin.
3. "Onayla" veya "Reddet" butonuna tıklayın.

### 4.3 İzin Bakiyesi Görüntüleme
1. "İzin Bakiyesi" ekranına girin.
2. Kendi veya bağlı çalışanların izin bakiyesini görüntüleyin.

## 5. Sıkça Sorulan Sorular (SSS)
- **İzin bakiyesi nasıl hesaplanır?**
  - İşe giriş tarihi ve kullanılan izinlere göre otomatik hesaplanır.
- **Reddedilen izin tekrar talep edilebilir mi?**
  - Evet, yeni bir talep oluşturulabilir.
- **Toplu izin raporu alınabilir mi?**
  - Evet, tüm çalışanlar için toplu rapor alınabilir.

## 6. Teknik Detaylar
### API Örnekleri
- **İzin Listeleme:**
  ```http
  GET /api/hr/v1/leaves?status=pending
  ```
- **Yeni İzin Talebi:**
  ```http
  POST /api/hr/v1/leaves
  Content-Type: application/json
  {
    "employeeId": 123,
    "type": "yillik",
    "startDate": "2023-07-10",
    "endDate": "2023-07-14",
    "description": "Yaz tatili"
  }
  ```
- **İzin Onaylama:**
  ```http
  POST /api/hr/v1/leaves/approve
  Content-Type: application/json
  {
    "leaveId": 456
  }
  ```

### Entegrasyonlar
- **Bordro Modülü:** İzinlerin bordro hesaplamasına otomatik yansıması.

## 7. En İyi Uygulamalar
- İzin taleplerini zamanında onaylayın veya reddedin.
- İzin bakiyelerini düzenli kontrol edin.
- Toplu izin raporlarını periyodik olarak alın.

Daha fazla bilgi için İK yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 