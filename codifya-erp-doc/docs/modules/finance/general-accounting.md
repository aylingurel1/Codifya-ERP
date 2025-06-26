# Finans Modülü: Genel Muhasebe

## 1. Modülün Amacı ve Kapsamı
Genel Muhasebe modülü, şirketin tüm finansal işlemlerinin kayıt altına alınmasını, raporlanmasını ve yasal mevzuata uygun şekilde yönetilmesini sağlar. Hesap planı, fiş işlemleri, defterler, mizan, bilanço ve gelir tablosu gibi temel muhasebe fonksiyonlarını kapsar.

## 2. Temel Kavramlar ve Terimler
- **Hesap Planı:** Tüm muhasebe hesaplarının hiyerarşik yapıda tanımlandığı tablo.
- **Muhasebe Fişi:** Finansal işlemlerin kaydedildiği belge.
- **Defter-i Kebir:** Hesap bazında hareketlerin izlendiği defter.
- **Mizan:** Dönem sonu hesap bakiyelerinin kontrol edildiği tablo.
- **Bilanço:** Varlık, borç ve özkaynakların gösterildiği finansal tablo.
- **Gelir Tablosu:** Dönem içi gelir ve giderlerin özetlendiği tablo.

## 3. Ana Fonksiyonlar ve Ekranlar
- **Hesap Planı Yönetimi:** Hesap ekleme, düzenleme, silme, hiyerarşi oluşturma.
- **Fiş İşlemleri:** Yeni fiş oluşturma, fiş düzenleme, onaylama, iptal etme.
- **Defter ve Mizan:** Defter-i Kebir, Yevmiye Defteri, Mizan raporları.
- **Raporlama:** Bilanço, Gelir Tablosu, Kasa Defteri, Banka Ekstresi.
- **Dönem İşlemleri:** Dönem açma/kapama, devir işlemleri.

## 4. Sık Kullanılan İşlemler
### 4.1 Yeni Muhasebe Fişi Oluşturma
1. "Fişler" menüsüne girin.
2. "Yeni Fiş" butonuna tıklayın.
3. Fiş türünü (tahsilat, ödeme, mahsup vb.) seçin.
4. Tarih, açıklama ve ilgili hesapları girin.
5. Tutarları ve açıklamaları doldurun.
6. "Kaydet" ile fişi oluşturun.

### 4.2 Hesap Planı Ekleme
1. "Hesap Planı" ekranına girin.
2. "Yeni Hesap" butonuna tıklayın.
3. Hesap kodu, adı ve üst hesabı seçin.
4. "Kaydet" ile hesabı ekleyin.

### 4.3 Mizan Raporu Alma
1. "Raporlar" menüsüne girin.
2. "Mizan" raporunu seçin.
3. Tarih aralığını belirleyin.
4. "Raporu Getir" butonuna tıklayın.

## 5. Sıkça Sorulan Sorular (SSS)
- **Fiş silindiğinde ne olur?**
  - Fiş silindiğinde ilgili hesap hareketleri de silinir ve raporlara yansımaz.
- **Dönem kapama işlemi geri alınabilir mi?**
  - Yalnızca yetkili kullanıcılar tarafından dönem tekrar açılabilir.
- **Hesap planı dışa aktarılabilir mi?**
  - Evet, Excel veya PDF formatında dışa aktarım mümkündür.

## 6. Teknik Detaylar
### API Örnekleri
- **Fiş Listeleme:**
  ```http
  GET /api/finance/v1/vouchers?startDate=2023-01-01&endDate=2023-12-31
  ```
- **Yeni Fiş Oluşturma:**
  ```http
  POST /api/finance/v1/vouchers
  Content-Type: application/json
  {
    "date": "2023-05-01",
    "type": "mahsup",
    "lines": [
      { "accountCode": "100", "debit": 1000, "credit": 0 },
      { "accountCode": "500", "debit": 0, "credit": 1000 }
    ],
    "description": "Kasa tahsilatı"
  }
  ```
- **Mizan Raporu:**
  ```http
  GET /api/finance/v1/trial-balance?period=2023Q1
  ```

### Entegrasyonlar
- **e-Fatura/e-Defter:** GİB ile entegrasyon için XML ve web servis desteği.
- **Banka Entegrasyonu:** Otomatik banka hareketi aktarımı için API.

## 7. En İyi Uygulamalar
- Fiş ve hesap işlemlerinde yetki kontrollerini kullanın.
- Dönem kapama öncesi tüm raporları kontrol edin.
- Yedekleme ve veri bütünlüğü kontrollerini düzenli yapın.

Daha fazla bilgi için sistem yöneticiniz veya destek ekibiyle iletişime geçebilirsiniz. 