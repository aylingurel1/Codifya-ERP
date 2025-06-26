# Performans Alt Modülü

## 1. Modülün Amacı ve Kapsamı
Performans alt modülü, çalışanların dönemsel olarak hedef bazlı veya yetkinlik bazlı değerlendirilmesini, performans formlarının doldurulmasını ve sonuçların raporlanmasını sağlar. Terfi, prim ve gelişim planları bu modül üzerinden yönetilir.

## 2. Temel Kavramlar ve Terimler
- **Performans Değerlendirme:** Çalışanın belirli kriterlere göre puanlanması.
- **Hedef Bazlı Değerlendirme:** Yıl sonu veya dönemsel hedeflerin gerçekleşme oranına göre değerlendirme.
- **Yetkinlik Bazlı Değerlendirme:** Davranışsal ve teknik yetkinliklerin ölçülmesi.
- **Performans Formu:** Değerlendirme kriterlerinin ve puanların yer aldığı form.
- **Gelişim Planı:** Çalışanın gelişimi için belirlenen aksiyonlar.

## 3. Ana Fonksiyonlar ve Ekranlar
- **Değerlendirme Formu Oluşturma:** Hedef ve yetkinlik kriterlerinin tanımlanması.
- **Değerlendirme Süreci:** Yöneticinin ve/veya çalışanın formu doldurması.
- **Sonuç Raporlama:** Puanların ve gelişim önerilerinin raporlanması.
- **Gelişim Planı Takibi:** Aksiyonların atanması ve izlenmesi.

## 4. Sık Kullanılan İşlemler
### 4.1 Performans Değerlendirme Başlatma
1. "Performans" menüsüne girin.
2. "Yeni Değerlendirme" butonuna tıklayın.
3. Dönem, çalışan ve kriterleri seçin.
4. Formu doldurun ve "Kaydet" ile işlemi tamamlayın.

### 4.2 Sonuç Raporu Alma
1. "Raporlar" menüsüne girin.
2. "Performans Sonuçları" raporunu seçin.
3. Dönem ve çalışan(lar)ı belirleyin.
4. "Raporu Getir" ile sonuçları görüntüleyin.

### 4.3 Gelişim Planı Oluşturma
1. "Gelişim Planı" menüsüne girin.
2. Çalışan ve aksiyonları belirleyin.
3. "Kaydet" ile planı oluşturun.

## 5. Sıkça Sorulan Sorular (SSS)
- **Değerlendirme formu kimler tarafından doldurulur?**
  - Yönetici, çalışan veya 360 derece değerlendirme ile birden fazla kişi.
- **Performans sonuçları gizli midir?**
  - Evet, sadece yetkili kişiler görüntüleyebilir.
- **Gelişim planı zorunlu mudur?**
  - Şirket politikasına göre değişir, genellikle önerilir.

## 6. Teknik Detaylar
### API Örnekleri
- **Performans Değerlendirme Listeleme:**
  ```http
  GET /api/hr/v1/performance/reviews?period=2023-Q2
  ```
- **Yeni Değerlendirme Başlatma:**
  ```http
  POST /api/hr/v1/performance/reviews
  Content-Type: application/json
  {
    "employeeId": 123,
    "period": "2023-Q2",
    "criteria": [
      { "name": "Hedef Gerçekleşme", "score": 90 },
      { "name": "Takım Çalışması", "score": 85 }
    ]
  }
  ```
- **Gelişim Planı Oluşturma:**
  ```http
  POST /api/hr/v1/performance/development-plans
  Content-Type: application/json
  {
    "employeeId": 123,
    "actions": ["Eğitim", "Mentorluk"]
  }
  ```

### Entegrasyonlar
- **Bordro Modülü:** Performans primlerinin bordroya otomatik yansıması.

## 7. En İyi Uygulamalar
- Değerlendirme kriterlerini net ve ölçülebilir belirleyin.
- Sonuçları çalışanlarla şeffaf şekilde paylaşın.
- Gelişim planlarını düzenli takip edin.

Daha fazla bilgi için İK yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 