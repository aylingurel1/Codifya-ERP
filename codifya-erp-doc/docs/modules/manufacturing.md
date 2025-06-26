# Üretim Modülü

## 1. Modülün Amacı ve Kapsamı
Üretim modülü, üretim planlama, iş emri, malzeme ihtiyaç planlaması (MRP), kalite kontrol ve bakım yönetimi süreçlerinin dijital olarak yönetilmesini sağlar. Üretim süreçlerinin izlenmesi, verimlilik ve kalite takibi bu modül üzerinden yapılır.

## 2. Temel Kavramlar ve Terimler
- **İş Emri:** Belirli bir ürünün üretimi için açılan talimat.
- **MRP (Malzeme İhtiyaç Planlaması):** Üretim için gerekli malzeme ve miktarların hesaplanması.
- **Kalite Kontrol:** Üretim sürecinde ve sonunda yapılan kalite testleri.
- **Bakım Yönetimi:** Üretim ekipmanlarının periyodik bakımı ve arıza yönetimi.
- **Üretim Raporu:** Gerçekleşen üretim miktarı, fire ve verimlilik bilgileri.

## 3. Ana Fonksiyonlar ve Ekranlar
- **Üretim Planlama:** Üretim takvimi oluşturma, kapasite planlama.
- **İş Emri Yönetimi:** İş emri açma, takip, kapama.
- **MRP:** Malzeme ihtiyaçlarının otomatik hesaplanması.
- **Kalite Kontrol:** Numune alma, test sonuçları, kalite raporları.
- **Bakım Yönetimi:** Bakım planı oluşturma, arıza kaydı, bakım raporları.
- **Raporlama:** Üretim, kalite ve bakım raporları.

## 4. Sık Kullanılan İşlemler
### 4.1 Yeni İş Emri Açma
1. "İş Emirleri" menüsüne girin.
2. "Yeni İş Emri" butonuna tıklayın.
3. Ürün, miktar ve teslimat tarihini girin.
4. "Kaydet" ile iş emrini oluşturun.

### 4.2 MRP Hesaplama
1. "MRP" menüsüne girin.
2. Üretim planını seçin.
3. "Hesapla" butonuna tıklayın.
4. Malzeme ihtiyaç listesi görüntülenir.

### 4.3 Kalite Kontrol Sonucu Girmek
1. "Kalite Kontrol" menüsüne girin.
2. İlgili iş emrini seçin.
3. Numune ve test sonuçlarını girin.
4. "Kaydet" ile kalite kontrolü tamamlayın.

## 5. Sıkça Sorulan Sorular (SSS)
- **İş emri iptal edilebilir mi?**
  - Üretime başlanmamış iş emirleri iptal edilebilir.
- **MRP sonuçları dışa aktarılabilir mi?**
  - Evet, Excel veya PDF olarak dışa aktarılabilir.
- **Bakım geçmişi nasıl görüntülenir?**
  - Bakım raporları ekranından geçmiş işlemler listelenir.

## 6. Teknik Detaylar
### API Örnekleri
- **İş Emri Listeleme:**
  ```http
  GET /api/manufacturing/v1/work-orders?status=open
  ```
- **Yeni İş Emri Açma:**
  ```http
  POST /api/manufacturing/v1/work-orders
  Content-Type: application/json
  {
    "productId": 67,
    "quantity": 1000,
    "dueDate": "2023-10-01"
  }
  ```
- **MRP Hesaplama:**
  ```http
  POST /api/manufacturing/v1/mrp/calculate
  Content-Type: application/json
  {
    "workOrderId": 123
  }
  ```

### Entegrasyonlar
- **Makine Otomasyon Sistemleri:** Üretim verilerinin otomatik aktarımı.
- **Stok ve Satın Alma:** Malzeme ihtiyaçlarının otomatik iletimi.

## 7. En İyi Uygulamalar
- Üretim planlarını düzenli olarak güncelleyin.
- Kalite kontrol sonuçlarını zamanında girin.
- Bakım işlemlerini kaydedin ve takip edin.

Daha fazla bilgi için üretim yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 