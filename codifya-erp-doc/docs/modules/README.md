# Codifya ERP Modülleri

## Finans Modülü
- [Genel Muhasebe](./finance/general-accounting.md)
- [Bütçe Yönetimi](./finance/budget-management.md)
- [Nakit Akışı Yönetimi](./finance/cash-flow.md)
- [Varlık Yönetimi](./finance/asset-management.md)
- [Maliyet Muhasebesi](./finance/cost-accounting.md)
- [Banka İşlemleri](./finance/bank.md)
- [Kasa Yönetimi](./finance/cash.md)
- [Çek/Senet Yönetimi](./finance/cheque-bond.md)

## İnsan Kaynakları Modülü
- [Personel Yönetimi](./human-resources/personnel-record.md)
- [Bordro](./human-resources/payroll.md)
- [İzin Yönetimi](./human-resources/leave.md)
- [Performans Değerlendirme](./human-resources/performance.md)
- [Eğitim Yönetimi](./human-resources/training-management.md)

## Satış ve Pazarlama Modülü
- [Müşteri İlişkileri Yönetimi (CRM)](./customer-relationship-management.md)
- [Satış Yönetimi](./sales-and-marketing.md)
- [Fiyatlandırma](./sales-and-marketing.md)
- [Sipariş Yönetimi](./sales-and-marketing.md)
- [Müşteri Hizmetleri](./sales-and-marketing.md)

## Tedarik Zinciri Modülü
- [Stok Yönetimi](./supply-chain.md)
- [Satın Alma](./supply-chain.md)
- [Tedarikçi Yönetimi](./supply-chain.md)
- [Lojistik](./supply-chain.md)
- [Kalite Kontrol](./supply-chain.md)

## Üretim Modülü
- [Üretim Planlama](./manufacturing.md)
- [Kalite Yönetimi](./manufacturing.md)
- [Bakım Yönetimi](./manufacturing.md)
- [Üretim Takibi](./manufacturing.md)
- [Malzeme İhtiyaç Planlaması](./manufacturing.md)

## Proje Yönetimi Modülü
- [Proje Planlama](./project-management.md)
- [Kaynak Yönetimi](./project-management.md)
- [Risk Yönetimi](./project-management.md)
- [Proje Takibi](./project-management.md)
- [Doküman Yönetimi](./project-management.md)

## Raporlama ve Analitik Modülü
- [İş Zekası](./reporting-analytics.md)
- [Dashboard](./reporting-analytics.md)
- [Raporlama](./reporting-analytics.md)
- [Veri Analizi](./reporting-analytics.md)
- [Performans Göstergeleri](./reporting-analytics.md)

## İş Akışı Yönetimi Modülü
- [Workflow Designer](./workflow-management.md)
- [Süreç Yönetimi](./workflow-management.md)
- [Form Builder](./workflow-management.md)
- [Onay Süreçleri](./workflow-management.md)
- [Süreç Analizi](./workflow-management.md)

## Sistem Yönetimi
- [Kullanıcı Yönetimi](./system-management.md)
- [Güvenlik](./system-management.md)
- [Yedekleme ve Geri Yükleme](./system-management.md)
- [Sistem Konfigürasyonu](./system-management.md)
- [Entegrasyon](./system-management.md)

## Modüller Arası Entegrasyon

### Veri Akışı
- **CRM → Satış:** Müşteri bilgileri satış süreçlerine aktarılır
- **Satış → Stok:** Siparişler stok rezervasyonu tetikler
- **Stok → Üretim:** Stok seviyeleri üretim planlamasını etkiler
- **Üretim → Finans:** Üretim maliyetleri muhasebeye aktarılır
- **İK → Finans:** Bordro bilgileri muhasebeye aktarılır

### Ortak Servisler
- **Notification Service:** Tüm modüller için bildirim servisi
- **Document Service:** Doküman yönetimi ve arşivleme
- **Audit Service:** Sistem logları ve audit trail
- **Workflow Service:** İş akışı yönetimi
- **Analytics Service:** Veri analizi ve raporlama

## Modül Geliştirme Standartları

### API Standartları
- RESTful API tasarımı
- OpenAPI 3.0 dokümantasyonu
- JWT tabanlı kimlik doğrulama
- Rate limiting ve throttling
- Error handling standartları

### Veritabanı Standartları
- Her modül kendi veritabanına sahiptir
- Veri tutarlılığı için event-driven architecture
- Backup ve recovery stratejileri
- Performance monitoring

### Güvenlik Standartları
- KVKK uyumluluğu
- Veri şifreleme (at rest ve in transit)
- Rol tabanlı erişim kontrolü (RBAC)
- Audit logging

## Modül Test Stratejisi

### Test Seviyeleri
- **Unit Tests:** Her modül için %80+ coverage
- **Integration Tests:** Modüller arası entegrasyon
- **API Tests:** REST API endpoint testleri
- **E2E Tests:** Kullanıcı senaryoları

### Test Otomasyonu
- CI/CD pipeline entegrasyonu
- Automated testing tools
- Performance testing
- Security testing

## Modül Deployment

### Containerization
- Her modül Docker container'ında çalışır
- Kubernetes orchestration
- Service mesh (Istio) entegrasyonu
- Auto-scaling capabilities

### Monitoring
- Application performance monitoring (APM)
- Infrastructure monitoring
- Log aggregation (ELK stack)
- Alerting ve notification

Bu dokümantasyon, Codifya ERP sisteminin tüm modüllerini ve aralarındaki ilişkileri açıklamaktadır. Geliştirme ekibi bu standartlara uygun olarak çalışmalıdır. 