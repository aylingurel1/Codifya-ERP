# Bordro Alt Modülü

## 1. Modülün Amacı ve Kapsamı
Bordro alt modülü, çalışanların maaş, ek ödeme, kesinti ve yasal yükümlülüklerinin hesaplanmasını ve raporlanmasını sağlar. Bordro hesaplama, onay, raporlama ve yasal bildirimler bu modül üzerinden yürütülür.

## 2. Temel Kavramlar ve Terimler
- **Bordro:** Çalışan maaş ve kesintilerinin detaylı dökümü.
- **Ek Ödeme:** Prim, ikramiye, fazla mesai gibi ek gelirler.
- **Kesinti:** Vergi, SGK, avans gibi yasal ve idari kesintiler.
- **Net Ücret:** Çalışana ödenecek son tutar.

## 3. Ana Fonksiyonlar ve Ekranlar
- **Bordro Hesaplama:** Dönem seçimi, personel seçimi, ek ödeme ve kesinti ekleme.
- **Bordro Onay:** Hesaplanan bordronun kontrolü ve onayı.
- **Bordro Raporlama:** PDF/Excel çıktısı, toplu bordro raporları.
- **Yasal Bildirimler:** SGK ve vergi bildirim dosyalarının oluşturulması.

## 4. Sık Kullanılan İşlemler
### 4.1 Yeni Bordro Hesaplama
1. "Bordro" menüsüne girin.
2. Dönem ve personel(ler)i seçin.
3. Ek ödeme ve kesintileri ekleyin.
4. "Bordro Hesapla" butonuna tıklayın.
5. Sonuçları kontrol edip "Onayla" ile işlemi tamamlayın.

### 4.2 Bordro Raporu Alma
1. "Raporlar" menüsüne girin.
2. "Bordro Raporu"nu seçin.
3. Dönem ve personel(ler)i belirleyin.
4. "Raporu Getir" ile raporu görüntüleyin veya dışa aktarın.

## 5. Sıkça Sorulan Sorular (SSS)
- **Bordro iptal edilebilir mi?**
  - Onaylanmamış bordrolar iptal edilebilir.
- **Bordro çıktısı alınabilir mi?**
  - Evet, PDF veya Excel olarak alınabilir.
- **Yasal bildirimler otomatik oluşturulur mu?**
  - Evet, SGK ve vergi dosyaları otomatik hazırlanır.

## 6. Teknik Detaylar
### API Örnekleri
- **Bordro Listeleme:**
  ```http
  GET /api/hr/v1/payrolls?period=2023-07
  ```
- **Yeni Bordro Hesaplama:**
  ```http
  POST /api/hr/v1/payrolls/calculate
  Content-Type: application/json
  {
    "period": "2023-07",
    "employeeIds": [1,2,3],
    "bonuses": 1000,
    "deductions": 500
  }
  ```
- **Bordro Onaylama:**
  ```http
  POST /api/hr/v1/payrolls/approve
  Content-Type: application/json
  {
    "payrollId": 123
  }
  ```

### Entegrasyonlar
- **Muhasebe Modülü:** Bordro verilerinin muhasebeye otomatik aktarımı.
- **SGK Bildirimleri:** Yasal dosya entegrasyonu.

## 7. En İyi Uygulamalar
- Bordro hesaplamalarını dönem sonunda topluca yapın.
- Yasal bildirimleri zamanında oluşturun.
- Bordroda değişiklik yaparken onay mekanizmasını kullanın.

Daha fazla bilgi için İK yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 