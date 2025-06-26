# Banka Alt Modülü

## 1. Modülün Amacı ve Kapsamı
Banka alt modülü, şirketin tüm banka hesaplarının, banka işlemlerinin ve banka entegrasyonlarının yönetilmesini sağlar. Havale, EFT, banka bakiyesi takibi ve banka ekstrelerinin alınması bu modül üzerinden yürütülür.

## 2. Temel Kavramlar ve Terimler
- **Banka Hesabı:** Şirkete ait bir bankada açılmış hesap.
- **Havale/EFT:** Bankalar arası para transfer işlemleri.
- **Banka Ekstresi:** Banka tarafından sağlanan hesap hareketleri dökümü.
- **Banka İşlemi:** Banka hesabında gerçekleşen tüm finansal hareketler.

## 3. Ana Fonksiyonlar ve Ekranlar
- **Banka Hesap Yönetimi:** Hesap ekleme, güncelleme, silme.
- **Banka İşlemleri:** Havale, EFT, virman, tahsilat ve ödeme işlemleri.
- **Ekstre Yönetimi:** Banka ekstrelerinin manuel veya otomatik alınması.
- **Raporlama:** Banka bakiyesi, hareket raporları, mutabakat.

## 4. Sık Kullanılan İşlemler
### 4.1 Yeni Banka Hesabı Ekleme
1. "Banka Hesapları" menüsüne girin.
2. "Yeni Hesap" butonuna tıklayın.
3. Banka adı, şube, IBAN ve hesap numarasını girin.
4. "Kaydet" ile hesabı oluşturun.

### 4.2 Havale/EFT İşlemi Yapma
1. "Banka İşlemleri" menüsüne girin.
2. "Yeni İşlem" butonuna tıklayın.
3. İşlem türünü (havale/EFT) seçin.
4. Gönderen ve alıcı hesapları, tutarı ve açıklamayı girin.
5. "Kaydet" ile işlemi tamamlayın.

### 4.3 Banka Ekstresi Alma
1. "Ekstreler" menüsüne girin.
2. İlgili banka hesabını seçin.
3. Tarih aralığını belirleyin.
4. "Ekstre Al" butonuna tıklayın.

## 5. Sıkça Sorulan Sorular (SSS)
- **Banka hesabı silindiğinde ne olur?**
  - Hesap pasif hale getirilir, geçmiş işlemler saklanır.
- **Ekstreler otomatik alınabilir mi?**
  - Evet, entegrasyon ile otomatik ekstre alınabilir.
- **Banka bakiyesi raporu alınabilir mi?**
  - Evet, istenen tarih aralığı için bakiye raporu alınabilir.

## 6. Teknik Detaylar
### API Örnekleri
- **Banka Hesap Listeleme:**
  ```http
  GET /api/finance/v1/banks/accounts
  ```
- **Yeni Banka Hesabı Ekleme:**
  ```http
  POST /api/finance/v1/banks/accounts
  Content-Type: application/json
  {
    "bankName": "ABC Bankası",
    "branch": "Merkez",
    "iban": "TR000000000000000000000000",
    "accountNumber": "12345678"
  }
  ```
- **Banka Ekstresi Alma:**
  ```http
  GET /api/finance/v1/banks/statements?accountId=1&startDate=2023-01-01&endDate=2023-01-31
  ```

### Entegrasyonlar
- **Banka API:** Otomatik ekstre ve bakiye entegrasyonu.
- **Muhasebe Modülü:** Banka işlemlerinin muhasebe fişlerine otomatik aktarımı.

## 7. En İyi Uygulamalar
- Banka hesaplarını düzenli olarak kontrol edin.
- Otomatik ekstre entegrasyonunu aktif kullanın.
- Banka işlemlerinde yetki kontrollerini uygulayın.

Daha fazla bilgi için finans yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 