# Deployment (Canlıya Alma ve Dağıtım)

Bu bölümde Codifya ERP sisteminin canlıya alma, dağıtım ve otomasyon süreçleri detaylandırılmıştır.

## 1. Docker ile Konteynerleştirme

### Dockerfile Örneği
```dockerfile
# Backend için örnek Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
  frontend:
    build:
      context: ./frontend
    ports:
      - "8080:80"
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: codifya
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: codifya_db
    ports:
      - "5432:5432"
  redis:
    image: redis:7
    ports:
      - "6379:6379"
```

## 2. Kubernetes ile Orkestrasyon

### Deployment ve Service Tanımı
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: registry.example.com/codifya-backend:latest
          ports:
            - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
    - port: 3000
      targetPort: 3000
```

### ConfigMap ve Secret Kullanımı
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: default
data:
  NODE_ENV: production
  API_URL: https://api.codifya.com
---
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
  namespace: default
type: Opaque
data:
  POSTGRES_PASSWORD: c2VjcmV0 # base64('secret')
```

### Helm ile Dağıtım
- Helm chart'ları ile parametrik ve tekrarlanabilir dağıtım yapılabilir.
- Örnek komut:
  ```bash
  helm install codifya-backend ./charts/backend
  ```

## 3. CI/CD Süreçleri

### GitHub Actions ile Pipeline
```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Node.js Kurulumu
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Bağımlılıkların Yüklenmesi
        run: npm ci
      - name: Testlerin Çalıştırılması
        run: npm test
      - name: Docker Image Build
        run: docker build -t registry.example.com/codifya-backend:${{ github.sha }} .
      - name: Docker Push
        run: docker push registry.example.com/codifya-backend:${{ github.sha }}
      - name: Kubernetes Deploy
        run: |
          kubectl set image deployment/backend-deployment backend=registry.example.com/codifya-backend:${{ github.sha }}
```

### Diğer CI/CD Araçları
- **Jenkins, GitLab CI, CircleCI** gibi araçlar da benzer şekilde kullanılabilir.

## 4. Ortamlar
- **Development:** Lokal geliştirme ortamı, genellikle Docker Compose ile.
- **Staging:** Üretim öncesi test ortamı, gerçek veritabanı ve servislerle.
- **Production:** Canlı ortam, yüksek erişilebilirlik ve ölçeklenebilirlik için Kubernetes üzerinde çalışır.

## 5. İzleme ve Loglama
- **Prometheus & Grafana:** Servislerin metriklerini izlemek için.
- **ELK Stack (Elasticsearch, Logstash, Kibana):** Log toplama ve analiz için.
- **Alertmanager:** Otomatik uyarı ve bildirimler için.

## 6. En İyi Uygulamalar
- Her değişiklikte otomatik test ve build.
- Sürüm numaralandırma ve rollback desteği.
- Ortam değişkenlerini ve gizli anahtarları (secret) asla koda gömmeyin.
- Dağıtım sonrası otomatik sağlık kontrolleri (readiness/liveness probes).
- Yedekleme ve felaket kurtarma planı oluşturun.

Daha fazla bilgi için Docker, Kubernetes ve CI/CD araçlarının resmi dökümantasyonlarına başvurabilirsiniz. 