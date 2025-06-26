# Çek/Senet Alt Modülü

## 1. Modülün Amacı ve Kapsamı
Çek/Senet alt modülü, şirketin çek ve senet işlemlerinin, takibinin ve raporlanmasının dijital olarak yönetilmesini sağlar. Alınan/Verilen çek ve senetlerin kaydı, vade takibi ve tahsilat/ödeme işlemleri bu modül üzerinden yürütülür.

## 2. Temel Kavramlar ve Terimler
- **Çek:** Belirli bir vadede ödenmek üzere düzenlenen kıymetli evrak.
- **Senet:** Borç veya alacak ilişkisini belgeleyen, vadeli ödeme aracı.
- **Portföy:** Şirkete ait çek/senetlerin toplu listesi.
- **Vade:** Çek/senetin ödeneceği tarih.

## 3. Ana Fonksiyonlar ve Ekranlar
- **Çek/Senet Kayıtları:** Alınan ve verilen çek/senet ekleme, güncelleme, silme.
- **Vade Takibi:** Vadesi yaklaşan, tahsil edilen ve ödenen çek/senetlerin takibi.
- **Portföy Yönetimi:** Portföydeki çek/senetlerin listelenmesi ve durumu.
- **Raporlama:** Vade, portföy ve işlem raporları.

## 4. Sık Kullanılan İşlemler
### 4.1 Yeni Çek/Senet Kaydı Ekleme
1. "Çek/Senet" menüsüne girin.
2. "Yeni Kayıt" butonuna tıklayın.
3. Evrak türü (çek/senet), alınan/verilen, tutar, vade ve müşteri/tedarikçi bilgilerini girin.
4. "Kaydet" ile kaydı oluşturun.

### 4.2 Vade Takibi
1. "Vade Takibi" menüsüne girin.
2. Vadesi yaklaşan evrakları görüntüleyin.
3. Tahsilat veya ödeme işlemini başlatın.

### 4.3 Portföy Raporu Alma
1. "Raporlar" menüsüne girin.
2. "Portföy Raporu"nu seçin.
3. Tarih aralığını belirleyin.
4. "Raporu Getir" butonuna tıklayın.

## 5. Sıkça Sorulan Sorular (SSS)
- **Çek/senet silindiğinde ne olur?**
  - Evrak pasif hale getirilir, geçmiş işlemler saklanır.
- **Vade geçmiş çek/senetler için uyarı gelir mi?**
  - Evet, sistem otomatik uyarı verir.
- **Portföy raporu dışa aktarılabilir mi?**
  - Evet, PDF veya Excel olarak dışa aktarılabilir.

## 6. Teknik Detaylar
### API Örnekleri
- **Çek/Senet Listeleme:**
  ```http
  GET /api/finance/v1/cheques-bonds?status=active
  ```
- **Yeni Çek/Senet Kaydı:**
  ```http
  POST /api/finance/v1/cheques-bonds
  Content-Type: application/json
  {
    "type": "çek",
    "direction": "alınan",
    "amount": 10000,
    "dueDate": "2023-12-01",
    "customerId": 22
  }
  ```
- **Vade Takibi:**
  ```http
  GET /api/finance/v1/cheques-bonds/due?startDate=2023-11-01&endDate=2023-12-31
  ```

### Entegrasyonlar
- **Muhasebe Modülü:** Çek/senet işlemlerinin muhasebe fişlerine otomatik aktarımı.

## 7. En İyi Uygulamalar
- Vade takibini düzenli yapın.
- Evrak işlemlerinde yetki kontrollerini uygulayın.
- Portföy raporlarını periyodik olarak alın.

Daha fazla bilgi için finans yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 