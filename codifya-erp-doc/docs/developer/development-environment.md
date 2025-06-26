# Geliştirme Ortamı

Bu doküman, Codifya ERP projesinin geliştirme ortamı kurulumunu ve yapılandırmasını detaylandırır.

## IDE Ayarları

### VS Code Önerilen Ayarlar

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

### Önerilen Eklentiler

1. **ESLint**
   - Kod kalitesi kontrolü
   - Otomatik düzeltme
   - Kod standartları uygulama

2. **Prettier**
   - Kod formatı
   - Tutarlı stil
   - Otomatik formatlama

3. **TypeScript**
   - TypeScript desteği
   - Tip kontrolü
   - IntelliSense

4. **Docker**
   - Docker dosya desteği
   - Container yönetimi
   - Docker Compose desteği

5. **GitLens**
   - Git geçmişi
   - Branch yönetimi
   - Commit detayları

6. **REST Client**
   - API testi
   - HTTP istekleri
   - Response görüntüleme

7. **Thunder Client**
   - API testi
   - Collection yönetimi
   - Environment yönetimi

8. **MongoDB for VS Code**
   - MongoDB bağlantısı
   - Query yazma
   - Veri görüntüleme

## Git Workflow

### Branch Stratejisi

1. **Ana Branch'ler**
   - `main`: Production branch
   - `develop`: Development branch
   - `release/*`: Release branch'leri

2. **Feature Branch'ler**
   - `feature/*`: Yeni özellikler
   - `bugfix/*`: Hata düzeltmeleri
   - `hotfix/*`: Acil düzeltmeler

### Branch Oluşturma Kuralları

```bash
# Feature branch
git checkout -b feature/feature-name

# Bug fix branch
git checkout -b bugfix/bug-description

# Hotfix branch
git checkout -b hotfix/issue-description
```

### Commit Mesaj Formatı

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Commit Tipleri
- `feat`: Yeni özellik
- `fix`: Hata düzeltmesi
- `docs`: Dokümantasyon
- `style`: Kod formatı
- `refactor`: Kod düzenleme
- `test`: Test ekleme/düzenleme
- `chore`: Genel bakım

#### Örnek Commit Mesajları

```
feat(auth): implement JWT authentication

- Add JWT token generation
- Add token validation
- Add refresh token mechanism

Closes #123
```

```
fix(api): resolve rate limiting issue

- Fix rate limiting configuration
- Add proper error handling
- Update documentation

Fixes #456
```

## Code Review Süreci

### Pull Request Şablonu

```markdown
## Değişiklik Açıklaması
[Değişikliklerin detaylı açıklaması]

## Test Edildi mi?
- [ ] Evet
- [ ] Hayır

## Test Senaryoları
[Test senaryolarının açıklaması]

## Ekran Görüntüleri
[Varsa ekran görüntüleri]

## İlgili Issue
[Issue numarası]
```

### Code Review Kontrol Listesi

1. **Kod Kalitesi**
   - [ ] Kod standartlarına uygun
   - [ ] DRY prensibine uygun
   - [ ] SOLID prensiplerine uygun
   - [ ] Temiz kod prensiplerine uygun

2. **Test**
   - [ ] Unit testler eklenmiş
   - [ ] Integration testler eklenmiş
   - [ ] Test coverage yeterli
   - [ ] Testler başarılı

3. **Dokümantasyon**
   - [ ] Kod dokümantasyonu eklenmiş
   - [ ] API dokümantasyonu güncellenmiş
   - [ ] README güncellenmiş
   - [ ] Değişiklik log'u güncellenmiş

4. **Güvenlik**
   - [ ] Güvenlik açığı yok
   - [ ] Input validation yapılmış
   - [ ] Authentication kontrolü yapılmış
   - [ ] Authorization kontrolü yapılmış

## Geliştirme Araçları

### API Geliştirme
- Postman
- Insomnia
- Thunder Client

### Veritabanı
- pgAdmin
- MongoDB Compass
- Redis Commander

### Container
- Docker Desktop
- Kubernetes Dashboard
- Portainer

### Monitoring
- Grafana
- Prometheus
- ELK Stack

## Debugging

### Backend Debugging
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/index.ts"
    }
  ]
}
```

### Frontend Debugging
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Frontend",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/frontend"
    }
  ]
}
```

## Performans Analizi

### Backend Profiling
```bash
# Node.js profiling
node --prof app.js

# Heap snapshot
node --heapsnapshot app.js
```

### Frontend Profiling
- Chrome DevTools Performance
- React DevTools
- Redux DevTools

## Sık Karşılaşılan Sorunlar

### Port Çakışmaları
```bash
# Kullanılan portları listele
lsof -i :3000

# Portu kullanan process'i sonlandır
kill -9 <PID>
```

### Docker Sorunları
```bash
# Container'ları temizle
docker system prune

# Volume'ları temizle
docker volume prune

# Network'leri temizle
docker network prune
```

### Node.js Sorunları
```bash
# node_modules'u temizle
rm -rf node_modules

# npm cache'i temizle
npm cache clean --force

# Bağımlılıkları yeniden yükle
npm install
``` 