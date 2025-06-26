# Proje Yönetimi Modülü

## 1. Modülün Amacı ve Kapsamı
Proje Yönetimi modülü, projelerin planlanması, kaynak yönetimi, görev takibi, bütçe ve risk yönetimi süreçlerinin dijital olarak yönetilmesini sağlar. Proje ilerleyişi, kilometre taşları ve ekip performansı bu modül üzerinden izlenir.

## 2. Temel Kavramlar ve Terimler
- **Proje:** Belirli bir hedefe ulaşmak için başlatılan, başlangıç ve bitiş tarihi olan çalışma.
- **Görev:** Proje kapsamında yapılacak işlerin her biri.
- **Kaynak:** Projede görev alan personel, ekipman veya bütçe.
- **Bütçe:** Proje için ayrılan finansal kaynak.
- **Risk:** Proje başarısını etkileyebilecek olası tehditler.

## 3. Ana Fonksiyonlar ve Ekranlar
- **Proje Planlama:** Proje oluşturma, kilometre taşı ve teslimat tanımlama.
- **Görev Yönetimi:** Görev atama, durum takibi, önceliklendirme.
- **Kaynak Yönetimi:** Personel ve ekipman atama, kapasite takibi.
- **Bütçe ve Harcama Takibi:** Bütçe oluşturma, harcama kaydı, raporlama.
- **Risk Yönetimi:** Risk analizi, önlem planı oluşturma.
- **Raporlama:** Proje ilerleme, görev ve bütçe raporları.

## 4. Sık Kullanılan İşlemler
### 4.1 Yeni Proje Oluşturma
1. "Projeler" menüsüne girin.
2. "Yeni Proje" butonuna tıklayın.
3. Proje adı, başlangıç ve bitiş tarihini girin.
4. Proje ekibini ve bütçesini belirleyin.
5. "Kaydet" ile projeyi oluşturun.

### 4.2 Görev Atama
1. "Görevler" menüsüne girin.
2. "Yeni Görev" butonuna tıklayın.
3. Görev adı, sorumlu ve teslim tarihini girin.
4. "Kaydet" ile görevi oluşturun.

### 4.3 Bütçe Takibi
1. "Bütçe" menüsüne girin.
2. Proje ve harcama kalemini seçin.
3. Harcama tutarını girin.
4. "Kaydet" ile harcamayı kaydedin.

## 5. Sıkça Sorulan Sorular (SSS)
- **Proje silindiğinde veriler kaybolur mu?**
  - Hayır, proje arşivlenir ve geçmiş kayıtlar saklanır.
- **Görevler toplu olarak atanabilir mi?**
  - Evet, birden fazla görev aynı anda atanabilir.
- **Bütçe aşımı nasıl bildirilir?**
  - Sistem otomatik uyarı gönderir.

## 6. Teknik Detaylar
### API Örnekleri
- **Proje Listeleme:**
  ```http
  GET /api/project/v1/projects?status=active
  ```
- **Yeni Görev Oluşturma:**
  ```http
  POST /api/project/v1/tasks
  Content-Type: application/json
  {
    "projectId": 88,
    "name": "Analiz Toplantısı",
    "assigneeId": 12,
    "dueDate": "2023-11-01"
  }
  ```
- **Bütçe Harcaması Kaydetme:**
  ```http
  POST /api/project/v1/budgets/expenses
  Content-Type: application/json
  {
    "projectId": 88,
    "amount": 5000,
    "description": "Donanım alımı"
  }
  ```

### Entegrasyonlar
- **Takvim ve Bildirim:** Proje takvimi ve e-posta bildirim entegrasyonu.
- **Finans Modülü:** Proje harcamalarının finans modülüne entegrasyonu.

## 7. En İyi Uygulamalar
- Proje planlarını ve görevleri düzenli güncelleyin.
- Kaynak kullanımını ve bütçeyi yakından takip edin.
- Riskleri önceden analiz edin ve önlem alın.

Daha fazla bilgi için proje yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 