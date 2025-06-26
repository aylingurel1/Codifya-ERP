# İnsan Kaynakları (İK) Modülü

## 1. Modülün Amacı ve Kapsamı
İK modülü, şirketin personel yönetimi, bordro, izin, performans ve özlük işlemlerinin dijital ortamda yönetilmesini sağlar. Tüm çalışan verileri, izinler, maaşlar, performans değerlendirmeleri ve yasal raporlamalar bu modül üzerinden yürütülür.

## 2. Temel Kavramlar ve Terimler
- **Personel Kartı:** Çalışana ait kimlik, iletişim, pozisyon ve maaş bilgilerinin tutulduğu kayıt.
- **Bordro:** Çalışan maaşlarının ve yasal kesintilerin hesaplandığı belge.
- **İzin Yönetimi:** Yıllık, mazeret, hastalık gibi izinlerin takibi ve onay süreçleri.
- **Performans Değerlendirme:** Çalışanların dönemsel olarak değerlendirilmesi.
- **Özlük Dosyası:** Çalışana ait tüm yasal ve idari belgelerin dijital arşivi.

## 3. Ana Fonksiyonlar ve Ekranlar
- **Personel Yönetimi:** Personel ekleme, güncelleme, işten çıkış işlemleri.
- **Bordro İşlemleri:** Maaş bordrosu oluşturma, ek ödeme ve kesinti tanımlama.
- **İzin Yönetimi:** İzin talebi oluşturma, onaylama, izin bakiyesi takibi.
- **Performans Yönetimi:** Hedef belirleme, değerlendirme formları, sonuç raporları.
- **Raporlama:** Personel listesi, izin raporları, bordro dökümleri.

## 4. Sık Kullanılan İşlemler
### 4.1 Yeni Personel Ekleme
1. "Personeller" menüsüne girin.
2. "Yeni Personel" butonuna tıklayın.
3. Kimlik, iletişim ve pozisyon bilgilerini girin.
4. Maaş ve başlangıç tarihi ekleyin.
5. "Kaydet" ile personeli oluşturun.

### 4.2 İzin Talebi Oluşturma
1. "İzinler" menüsüne girin.
2. "Yeni İzin Talebi" butonuna tıklayın.
3. İzin türü, başlangıç ve bitiş tarihini seçin.
4. Açıklama ekleyin ve "Gönder" butonuna tıklayın.

### 4.3 Bordro Oluşturma
1. "Bordro" menüsüne girin.
2. Dönem ve personel seçin.
3. Ek ödeme veya kesinti ekleyin.
4. "Bordro Hesapla" ve ardından "Onayla" butonuna tıklayın.

## 5. Sıkça Sorulan Sorular (SSS)
- **Personel silindiğinde veriler kaybolur mu?**
  - Hayır, personel pasif hale getirilir ve geçmiş kayıtlar saklanır.
- **İzin bakiyesi nasıl hesaplanır?**
  - Yıllık izin hakkı, işe giriş tarihi ve kullanılan izinlere göre otomatik hesaplanır.
- **Bordro çıktısı alınabilir mi?**
  - Evet, PDF veya Excel formatında çıktı alınabilir.

## 6. Teknik Detaylar
### API Örnekleri
- **Personel Listeleme:**
  ```http
  GET /api/hr/v1/employees?status=active
  ```
- **Yeni Personel Ekleme:**
  ```http
  POST /api/hr/v1/employees
  Content-Type: application/json
  {
    "firstName": "Ayşe",
    "lastName": "Yılmaz",
    "position": "Muhasebe Uzmanı",
    "salary": 25000,
    "startDate": "2023-04-01"
  }
  ```
- **İzin Talebi Oluşturma:**
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
- **Bordro Oluşturma:**
  ```http
  POST /api/hr/v1/payrolls
  Content-Type: application/json
  {
    "employeeId": 123,
    "period": "2023-07",
    "bonuses": 1000,
    "deductions": 500
  }
  ```

### Entegrasyonlar
- **SGK Bildirimleri:** Otomatik SGK e-bildirge entegrasyonu.
- **Bordro Aktarımı:** Muhasebe modülüne otomatik bordro aktarımı.

## 7. En İyi Uygulamalar
- Personel verilerinin gizliliğine dikkat edin.
- İzin ve bordro işlemlerinde onay mekanizması kullanın.
- Yasal raporlamaları düzenli olarak kontrol edin.

Daha fazla bilgi için İK yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 