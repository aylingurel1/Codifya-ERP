# İnsan Kaynakları Modülü: Eğitim Yönetimi

## 1. Modülün Amacı ve Kapsamı
Eğitim Yönetimi modülü, şirketin eğitim planlamasını, eğitim ihtiyaç analizini, eğitim programlarının yönetimini ve eğitim sonuçlarının takibini dijital ortamda yönetmeyi sağlar. Çalışanların yetkinlik geliştirme süreçlerini, eğitim bütçesini ve eğitim etkinliğini kapsar.

## 2. Temel Kavramlar ve Terimler
- **Eğitim İhtiyaç Analizi:** Çalışanların mevcut yetkinlikleri ile gerekli yetkinlikler arasındaki farkın belirlenmesi.
- **Eğitim Programı:** Belirli bir konuda hazırlanmış eğitim içeriği ve süreci.
- **Eğitim Etkinliği:** Eğitimin hedeflenen sonuçlara ulaşma derecesi.
- **Yetkinlik Matrisi:** Çalışanların pozisyon bazında gerekli yetkinliklerinin haritası.
- **Eğitim Bütçesi:** Eğitim faaliyetleri için ayrılan finansal kaynak.
- **Eğitim Kataloğu:** Şirket içi ve dışı eğitim programlarının listesi.

## 3. Ana Fonksiyonlar ve Ekranlar
- **Eğitim İhtiyaç Analizi:** Yetkinlik değerlendirmesi ve ihtiyaç belirleme.
- **Eğitim Planlama:** Yıllık eğitim planı oluşturma ve yönetimi.
- **Eğitim Programı Yönetimi:** Eğitim içeriklerinin hazırlanması ve düzenlenmesi.
- **Eğitim Takibi:** Eğitim katılımı ve performans takibi.
- **Eğitim Değerlendirme:** Eğitim sonrası değerlendirme ve geri bildirim.
- **Eğitim Raporlama:** Eğitim etkinliği ve ROI analizleri.

## 4. Sık Kullanılan İşlemler
### 4.1 Eğitim İhtiyaç Analizi
1. "Eğitim Yönetimi" menüsüne girin.
2. "İhtiyaç Analizi" sekmesine tıklayın.
3. Departman veya pozisyon seçin.
4. Yetkinlik değerlendirmesi yapın.
5. "Analiz Raporu Oluştur" butonuna tıklayın.

### 4.2 Eğitim Programı Oluşturma
1. "Eğitim Programları" ekranına girin.
2. "Yeni Program" butonuna tıklayın.
3. Program adı, hedef kitle ve içerik bilgilerini girin.
4. Eğitmen ve tarih bilgilerini ekleyin.
5. "Kaydet" ile programı oluşturun.

### 4.3 Eğitim Kaydı
1. "Eğitim Kataloğu" ekranına girin.
2. İlgili eğitimi seçin.
3. "Kayıt Ol" butonuna tıklayın.
4. Onay sürecini bekleyin.

## 5. Eğitim Türleri
### 5.1 Yeni İşe Alınan Eğitimi
- Şirket oryantasyonu
- İş süreçleri eğitimi
- Güvenlik eğitimi
- Sistem kullanım eğitimi

### 5.2 Yetkinlik Geliştirme Eğitimi
- Teknik eğitimler
- Yönetsel eğitimler
- Kişisel gelişim eğitimleri
- Sertifika programları

### 5.3 Zorunlu Eğitimler
- İş sağlığı ve güvenliği
- Kalite yönetimi
- Çevre yönetimi
- Veri güvenliği

## 6. Eğitim Değerlendirme Sistemi
### 6.1 Kirkpatrick Modeli
- **Seviye 1 - Tepki:** Eğitim memnuniyeti
- **Seviye 2 - Öğrenme:** Bilgi ve beceri kazanımı
- **Seviye 3 - Davranış:** İş yerinde uygulama
- **Seviye 4 - Sonuç:** İş sonuçlarına etkisi

### 6.2 Değerlendirme Yöntemleri
- Anket ve geri bildirim formları
- Sınav ve testler
- Pratik uygulamalar
- Performans değerlendirmesi

## 7. Eğitim Teknolojileri
### 7.1 E-Öğrenme Platformu
- Online kurslar
- Video eğitimler
- İnteraktif modüller
- Mobil uygulama desteği

### 7.2 Hibrit Eğitim
- Yüz yüze + online kombinasyonu
- Webinar ve sanal sınıflar
- Mikro öğrenme modülleri
- Gamification öğeleri

## 8. Sıkça Sorulan Sorular (SSS)
- **Eğitim zorunlu mu?**
  - Pozisyon ve yetkinlik ihtiyacına göre zorunlu eğitimler belirlenir.
- **Eğitim sonrası sertifika verilir mi?**
  - Evet, başarılı tamamlanan eğitimler için sertifika verilir.
- **Eğitim bütçesi nasıl belirlenir?**
  - Yıllık planlama ve ihtiyaç analizi sonuçlarına göre belirlenir.

## 9. Teknik Detaylar
### API Örnekleri
- **Eğitim Programı Listeleme:**
  ```http
  GET /api/hr/v1/training/programs?department=IT&status=active
  ```
- **Eğitim Kaydı:**
  ```http
  POST /api/hr/v1/training/enrollments
  Content-Type: application/json
  {
    "employeeId": 123,
    "programId": 456,
    "enrollmentDate": "2024-01-15"
  }
  ```
- **Eğitim Değerlendirme:**
  ```http
  POST /api/hr/v1/training/evaluations
  Content-Type: application/json
  {
    "enrollmentId": 789,
    "satisfaction": 4.5,
    "learning": 4.2,
    "comments": "Çok faydalı bir eğitimdi"
  }
  ```

### Entegrasyonlar
- **Performans Yönetimi:** Eğitim sonuçları performans değerlendirmesine entegre edilir.
- **Kariyer Planlama:** Eğitim geçmişi kariyer planlamasında kullanılır.
- **Bütçe Yönetimi:** Eğitim maliyetleri bütçe takibine entegre edilir.

## 10. En İyi Uygulamalar
- Düzenli eğitim ihtiyaç analizi yapın.
- Eğitim sonuçlarını sürekli değerlendirin.
- Eğitim bütçesini etkin kullanın.
- Eğitim içeriklerini güncel tutun.
- Eğitim katılımını teşvik edin.

## 11. Güvenlik ve Yetkilendirme
- Eğitim verileri gizlilik kurallarına uygun korunur.
- Eğitim kayıtları tam olarak tutulur.
- Yetki seviyelerine göre erişim kontrolü yapılır.

Daha fazla bilgi için İK yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 