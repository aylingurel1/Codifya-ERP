# Özlük (Personel Kartı) Alt Modülü

## 1. Modülün Amacı ve Kapsamı
Özlük alt modülü, çalışanların kimlik, iletişim, pozisyon, maaş, eğitim ve yasal belgelerinin merkezi olarak kaydedilmesini ve yönetilmesini sağlar. Tüm personel verileri güvenli şekilde arşivlenir ve güncellenir.

## 2. Temel Kavramlar ve Terimler
- **Personel Kartı:** Çalışana ait tüm temel ve yasal bilgilerin tutulduğu kayıt.
- **Pozisyon:** Çalışanın şirketteki görevi ve departmanı.
- **Eğitim Bilgisi:** Çalışanın mezuniyet ve sertifika bilgileri.
- **Yasal Belgeler:** Kimlik, SGK, ikametgâh gibi zorunlu evraklar.

## 3. Ana Fonksiyonlar ve Ekranlar
- **Personel Kartı Oluşturma:** Kimlik, iletişim, pozisyon, maaş ve diğer bilgilerin kaydı.
- **Bilgi Güncelleme:** Personel kartındaki bilgilerin güncellenmesi.
- **Belge Yükleme:** Yasal evrakların dijital olarak eklenmesi.
- **Raporlama:** Personel listesi, pozisyon ve departman bazlı raporlar.

## 4. Sık Kullanılan İşlemler
### 4.1 Yeni Personel Kartı Oluşturma
1. "Personeller" menüsüne girin.
2. "Yeni Personel" butonuna tıklayın.
3. Kimlik, iletişim, pozisyon ve maaş bilgilerini girin.
4. Gerekli belgeleri yükleyin.
5. "Kaydet" ile personel kartını oluşturun.

### 4.2 Bilgi Güncelleme
1. "Personeller" menüsünden ilgili personeli seçin.
2. "Düzenle" butonuna tıklayın.
3. Bilgileri güncelleyin ve "Kaydet" ile işlemi tamamlayın.

### 4.3 Belge Yükleme
1. "Personeller" menüsünden ilgili personeli seçin.
2. "Belgeler" sekmesine girin.
3. "Belge Yükle" butonuna tıklayın ve dosyayı seçin.

## 5. Sıkça Sorulan Sorular (SSS)
- **Personel kartı silindiğinde ne olur?**
  - Kart pasif hale getirilir, geçmiş veriler saklanır.
- **Belgeler güvenli mi saklanır?**
  - Evet, belgeler şifreli ve erişim kontrollü olarak saklanır.
- **Personel listesi dışa aktarılabilir mi?**
  - Evet, Excel veya PDF olarak dışa aktarılabilir.

## 6. Teknik Detaylar
### API Örnekleri
- **Personel Listeleme:**
  ```http
  GET /api/hr/v1/employees?status=active
  ```
- **Yeni Personel Kartı Oluşturma:**
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
- **Belge Yükleme:**
  ```http
  POST /api/hr/v1/employees/123/documents
  Content-Type: multipart/form-data
  {
    "file": "kimlik.pdf"
  }
  ```

### Entegrasyonlar
- **SGK Bildirimleri:** Personel bilgilerinin SGK sistemine otomatik aktarımı.

## 7. En İyi Uygulamalar
- Personel verilerini düzenli güncelleyin.
- Belgeleri eksiksiz ve güncel tutun.
- Erişim yetkilerini rol bazlı yönetin.

Daha fazla bilgi için İK yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 