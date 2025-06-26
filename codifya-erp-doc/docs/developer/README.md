# Codifya ERP Geliştirici Kılavuzu

## İçindekiler
1. [Başlangıç](./getting-started.md)
2. [Mimari](./architecture.md)
3. [Geliştirme Ortamı](./development-environment.md)
4. [Kod Standartları](./coding-standards.md)
5. [API Geliştirme](./api-development.md)
6. [Veritabanı](./database.md)
7. [Frontend Geliştirme](./frontend.md)
8. [Test](./testing.md)
9. [Deployment](./deployment.md)
10. [Güvenlik](./security.md)

## Başlangıç

### Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- MongoDB 6+
- Redis 7+
- Docker 20.10+
- Git 2.30+

### Kurulum
```bash
# Projeyi klonlama
git clone https://github.com/your-org/codifya-erp.git
cd codifya-erp

# Bağımlılıkları yükleme
npm install

# Ortam değişkenlerini ayarlama
cp .env.example .env

# Veritabanı migrasyonlarını çalıştırma
npm run migrate

# Geliştirme sunucusunu başlatma
npm run dev
```

## Mimari

### Mikroservis Mimarisi
- Her modül bağımsız bir mikroservis olarak çalışır
- Servisler arası iletişim REST API ve mesaj kuyruğu ile sağlanır
- Her servis kendi veritabanına sahiptir
- Servisler Docker container'larında çalışır

### Teknoloji Stack
- Backend: Node.js, Express.js, TypeScript
- Frontend: React.js, Redux, TypeScript
- Veritabanı: PostgreSQL, MongoDB, Redis
- Mesaj Kuyruğu: RabbitMQ
- Container: Docker, Kubernetes

## Geliştirme Ortamı

### IDE Ayarları
- VS Code önerilen IDE'dir
- Gerekli eklentiler:
  - ESLint
  - Prettier
  - TypeScript
  - Docker
  - GitLens

### Git Workflow
1. Feature branch'ler `feature/` prefix'i ile oluşturulur
2. Bug fix branch'ler `fix/` prefix'i ile oluşturulur
3. Release branch'ler `release/` prefix'i ile oluşturulur
4. Her branch için PR açılır
5. Code review sonrası merge yapılır

### Commit Mesajları
```
<type>(<scope>): <subject>

<body>

<footer>
```

Tipler:
- feat: Yeni özellik
- fix: Hata düzeltmesi
- docs: Dokümantasyon
- style: Kod formatı
- refactor: Kod düzenleme
- test: Test ekleme/düzenleme
- chore: Genel bakım

## Kod Standartları

### TypeScript
- Strict mode kullanılır
- Interface'ler tercih edilir
- Type assertion minimum düzeyde kullanılır
- Generic'ler uygun şekilde kullanılır

### JavaScript
- ES6+ özellikleri kullanılır
- Arrow function'lar tercih edilir
- Destructuring kullanılır
- Async/await tercih edilir

### Naming Conventions
- Değişkenler: camelCase
- Fonksiyonlar: camelCase
- Sınıflar: PascalCase
- Interface'ler: PascalCase
- Enum'lar: PascalCase
- Sabitler: UPPER_SNAKE_CASE

## API Geliştirme

### REST API
- RESTful prensipleri uygulanır
- HTTP metodları doğru kullanılır
- Status kodları doğru kullanılır
- API versiyonlama yapılır

### API Dokümantasyonu
- Swagger/OpenAPI kullanılır
- Her endpoint için açıklama yazılır
- Request/response örnekleri verilir
- Hata kodları dokümante edilir

### API Güvenliği
- JWT authentication kullanılır
- Rate limiting uygulanır
- Input validation yapılır
- CORS ayarları yapılır

## Veritabanı

### PostgreSQL
- İlişkisel veriler için kullanılır
- Transaction'lar kullanılır
- Index'ler optimize edilir
- Stored procedure'ler kullanılır

### MongoDB
- Doküman verileri için kullanılır
- Sharding yapılır
- Replication yapılır
- Backup stratejisi uygulanır

### Redis
- Cache için kullanılır
- Session yönetimi için kullanılır
- Pub/Sub için kullanılır
- Rate limiting için kullanılır

## Frontend Geliştirme

### React
- Functional component'ler kullanılır
- Hooks kullanılır
- Context API kullanılır
- Custom hook'lar yazılır

### Redux
- Redux Toolkit kullanılır
- Slice pattern uygulanır
- Async thunk'lar kullanılır
- Selector'lar optimize edilir

### Styling
- CSS Modules kullanılır
- Styled Components kullanılır
- Responsive design uygulanır
- Theme sistemi kullanılır

## Test

### Unit Test
- Jest kullanılır
- Her fonksiyon için test yazılır
- Mock'lar kullanılır
- Coverage hedefi: %80+

### Integration Test
- Supertest kullanılır
- API endpoint'leri test edilir
- Database işlemleri test edilir
- Error case'ler test edilir

### E2E Test
- Cypress kullanılır
- Kullanıcı senaryoları test edilir
- Cross-browser test yapılır
- Performance test yapılır

## Deployment

### Docker
- Multi-stage build kullanılır
- Docker Compose kullanılır
- Volume'lar kullanılır
- Network ayarları yapılır

### Kubernetes
- Deployment'lar kullanılır
- Service'ler kullanılır
- Ingress kullanılır
- ConfigMap ve Secret'lar kullanılır

### CI/CD
- GitHub Actions kullanılır
- Otomatik test çalıştırılır
- Otomatik build alınır
- Otomatik deployment yapılır

## Güvenlik

### Authentication
- JWT kullanılır
- Refresh token kullanılır
- Password hashing yapılır
- 2FA desteği sağlanır

### Authorization
- RBAC kullanılır
- Permission'lar tanımlanır
- Role'ler tanımlanır
- Access control yapılır

### Data Security
- Input validation yapılır
- SQL injection koruması
- XSS koruması
- CSRF koruması

### Infrastructure Security
- SSL/TLS kullanılır
- Firewall kuralları
- Network security
- Backup stratejisi

## Best Practices

### Code Quality
- ESLint kullanılır
- Prettier kullanılır
- SonarQube kullanılır
- Code review yapılır

### Performance
- Caching kullanılır
- Lazy loading yapılır
- Code splitting yapılır
- Bundle size optimize edilir

### Monitoring
- Prometheus kullanılır
- Grafana kullanılır
- ELK Stack kullanılır
- Alerting yapılır

### Documentation
- JSDoc kullanılır
- README dosyaları yazılır
- API dokümantasyonu yazılır
- Architecture diagram'ları çizilir

## Troubleshooting

### Debugging
- Chrome DevTools kullanılır
- Node.js debugger kullanılır
- Logging yapılır
- Error tracking yapılır

### Performance Issues
- Profiling yapılır
- Memory leak kontrolü
- CPU usage analizi
- Network latency analizi

### Security Issues
- Vulnerability scanning
- Penetration testing
- Security audit
- Compliance check

## Resources

### Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://reactjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/)
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)

### Communities
- [Stack Overflow](https://stackoverflow.com/)
- [GitHub](https://github.com/)
- [Dev.to](https://dev.to/)
- [Medium](https://medium.com/) 