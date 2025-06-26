# Finans Modülü: Bütçe Yönetimi

## 1. Modülün Amacı ve Kapsamı
Bütçe Yönetimi modülü, şirketin finansal planlamasını, bütçe hazırlama süreçlerini, bütçe takibini ve sapma analizlerini dijital ortamda yönetmeyi sağlar. Yıllık, aylık ve proje bazlı bütçelerin oluşturulması, onaylanması ve gerçekleşen değerlerle karşılaştırılması işlemlerini kapsar.

## 2. Temel Kavramlar ve Terimler
- **Bütçe:** Belirli bir dönem için planlanan gelir ve giderlerin detaylı tahminidir.
- **Bütçe Merkezi:** Bütçe sorumluluğu olan organizasyonel birim.
- **Bütçe Kalemi:** Bütçe içinde yer alan gelir veya gider kategorisi.
- **Sapma Analizi:** Planlanan ile gerçekleşen değerler arasındaki farkın analizi.
- **Bütçe Revizyonu:** Mevcut bütçenin güncellenmesi işlemi.
- **Bütçe Onay Süreci:** Bütçenin yönetim tarafından onaylanması süreci.

## 3. Ana Fonksiyonlar ve Ekranlar
- **Bütçe Oluşturma:** Yeni bütçe tanımlama, bütçe kalemleri ekleme.
- **Bütçe Onay Süreci:** Workflow tabanlı onay mekanizması.
- **Bütçe Takibi:** Gerçekleşen değerlerle karşılaştırma.
- **Sapma Analizi:** Fark analizi ve raporlama.
- **Bütçe Revizyonu:** Mevcut bütçelerin güncellenmesi.
- **Raporlama:** Bütçe raporları, sapma raporları, trend analizleri.

## 4. Sık Kullanılan İşlemler
### 4.1 Yeni Bütçe Oluşturma
1. "Bütçe Yönetimi" menüsüne girin.
2. "Yeni Bütçe" butonuna tıklayın.
3. Bütçe adı, dönem ve bütçe merkezini seçin.
4. Bütçe kalemlerini ekleyin (gelir/gider kategorileri).
5. Her kalem için tutarları girin.
6. "Kaydet" ve "Onaya Gönder" butonlarına tıklayın.

### 4.2 Bütçe Onaylama
1. "Onay Bekleyen Bütçeler" listesine girin.
2. İlgili bütçeyi seçin ve detaylarını inceleyin.
3. Gerekirse revizyon isteyin veya "Onayla" butonuna tıklayın.

### 4.3 Bütçe Takibi
1. "Bütçe Takibi" ekranına girin.
2. Dönem ve bütçe merkezi seçin.
3. Planlanan vs gerçekleşen değerleri görüntüleyin.
4. Sapma analizini inceleyin.

## 5. Bütçe Türleri
### 5.1 Operasyonel Bütçe
- Günlük operasyonlar için hazırlanan bütçe
- Satış, üretim, pazarlama giderleri
- Aylık ve yıllık dönemler

### 5.2 Sermaye Bütçesi
- Büyük yatırımlar için hazırlanan bütçe
- Makine, bina, teknoloji yatırımları
- Çok yıllık planlama

### 5.3 Proje Bütçesi
- Belirli projeler için hazırlanan bütçe
- Proje süresi boyunca geçerli
- Proje bazlı takip

## 6. Sapma Analizi
### 6.1 Sapma Türleri
- **Olumlu Sapma:** Gerçekleşen değer planlanandan daha iyi
- **Olumsuz Sapma:** Gerçekleşen değer planlanandan kötü
- **Sıfır Sapma:** Planlanan ile gerçekleşen eşit

### 6.2 Sapma Hesaplama
```
Sapma Yüzdesi = ((Gerçekleşen - Planlanan) / Planlanan) × 100
```

## 7. Sıkça Sorulan Sorular (SSS)
- **Bütçe onaylandıktan sonra değiştirilebilir mi?**
  - Evet, bütçe revizyonu süreci ile değiştirilebilir.
- **Bütçe sapmaları otomatik bildirim gönderir mi?**
  - Evet, belirlenen eşik değerler aşıldığında otomatik bildirim gönderilir.
- **Bütçe raporları hangi formatlarda alınabilir?**
  - PDF, Excel, CSV formatlarında rapor alınabilir.

## 8. Teknik Detaylar
### API Örnekleri
- **Bütçe Listeleme:**
  ```http
  GET /api/finance/v1/budgets?year=2024&center=IT
  ```
- **Yeni Bütçe Oluşturma:**
  ```http
  POST /api/finance/v1/budgets
  Content-Type: application/json
  {
    "name": "2024 IT Bütçesi",
    "year": 2024,
    "center": "IT",
    "items": [
      { "category": "Yazılım", "type": "expense", "amount": 50000 },
      { "category": "Donanım", "type": "expense", "amount": 100000 }
    ]
  }
  ```
- **Sapma Analizi:**
  ```http
  GET /api/finance/v1/budgets/123/variance?period=2024Q1
  ```

### Entegrasyonlar
- **Genel Muhasebe:** Gerçekleşen değerler otomatik aktarım.
- **Proje Yönetimi:** Proje bütçeleri ile entegrasyon.
- **Satın Alma:** Bütçe kontrolü ile satın alma süreçleri.

## 9. En İyi Uygulamalar
- Bütçe hazırlarken geçmiş verileri analiz edin.
- Düzenli sapma analizi yapın ve aksiyon alın.
- Bütçe revizyonlarını minimum seviyede tutun.
- Bütçe sorumlularını net olarak tanımlayın.

## 10. Güvenlik ve Yetkilendirme
- Bütçe görüntüleme ve düzenleme yetkileri ayrı tanımlanır.
- Bütçe onay yetkileri hiyerarşik yapıda belirlenir.
- Bütçe değişiklik geçmişi tam olarak tutulur.

Daha fazla bilgi için finans yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 