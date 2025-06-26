# Codifya ERP Kurulum Kılavuzu

## Sistem Gereksinimleri

### Donanım Gereksinimleri
- CPU: 8+ çekirdek
- RAM: 32GB+
- Disk: 500GB+ SSD
- Network: 1Gbps+

### Yazılım Gereksinimleri
- İşletim Sistemi: Ubuntu 20.04 LTS veya üzeri
- Docker: 20.10+
- Docker Compose: 2.0+
- Kubernetes: 1.22+
- Git: 2.30+

## Kurulum Adımları

### 1. Geliştirme Ortamı Kurulumu

```bash
# Sistem güncellemeleri
sudo apt update && sudo apt upgrade -y

# Gerekli paketlerin kurulumu
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common \
    git

# Docker kurulumu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose kurulumu
sudo curl -L "https://github.com/docker/compose/releases/download/v2.5.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Kubernetes kurulumu
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### 2. Proje Klonlama

```bash
# Projeyi klonlama
git clone https://github.com/your-org/codifya-erp.git
cd codifya-erp

# Geliştirme branch'ine geçiş
git checkout develop
```

### 3. Ortam Değişkenlerinin Ayarlanması

```bash
# .env dosyasını oluşturma
cp .env.example .env

# .env dosyasını düzenleme
nano .env
```

Örnek .env içeriği:
```env
# Veritabanı
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codifya_erp
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# API
API_PORT=3000
API_HOST=localhost
```

### 4. Docker Container'larının Başlatılması

```bash
# Docker container'larını başlatma
docker-compose up -d

# Container'ların durumunu kontrol etme
docker-compose ps
```

### 5. Veritabanı Migrasyonları

```bash
# Migrasyonları çalıştırma
npm run migrate

# Seed verilerini yükleme
npm run seed
```

### 6. Uygulamanın Başlatılması

```bash
# Bağımlılıkları yükleme
npm install

# Geliştirme sunucusunu başlatma
npm run dev
```

## Kubernetes Deployment

### 1. Cluster Kurulumu

```bash
# Minikube kurulumu (geliştirme için)
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Minikube'u başlatma
minikube start
```

### 2. Kubernetes Manifest'lerinin Uygulanması

```bash
# Namespace oluşturma
kubectl create namespace codifya-erp

# ConfigMap ve Secret'ları uygulama
kubectl apply -f k8s/config/

# Deployment'ları uygulama
kubectl apply -f k8s/deployments/

# Service'leri uygulama
kubectl apply -f k8s/services/

# Ingress'i uygulama
kubectl apply -f k8s/ingress/
```

## Monitoring Kurulumu

### 1. Prometheus ve Grafana

```bash
# Prometheus kurulumu
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack

# Grafana kurulumu
helm repo add grafana https://grafana.github.io/helm-charts
helm install grafana grafana/grafana
```

### 2. ELK Stack

```bash
# Elasticsearch kurulumu
helm repo add elastic https://helm.elastic.co
helm install elasticsearch elastic/elasticsearch

# Kibana kurulumu
helm install kibana elastic/kibana

# Logstash kurulumu
helm install logstash elastic/logstash
```

## Güvenlik Kontrolleri

### 1. SSL/TLS Sertifikası

```bash
# Let's Encrypt sertifikası alma
certbot certonly --standalone -d your-domain.com
```

### 2. Güvenlik Duvarı Ayarları

```bash
# UFW kurulumu
sudo apt install ufw

# Güvenlik duvarı kuralları
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

## Sorun Giderme

### 1. Log Kontrolü

```bash
# Container loglarını görüntüleme
docker-compose logs -f

# Kubernetes pod loglarını görüntüleme
kubectl logs -f <pod-name> -n codifya-erp
```

### 2. Servis Durumu Kontrolü

```bash
# Docker servis durumu
docker-compose ps

# Kubernetes servis durumu
kubectl get all -n codifya-erp
```

### 3. Veritabanı Bağlantı Kontrolü

```bash
# PostgreSQL bağlantı testi
psql -h localhost -U postgres -d codifya_erp

# Redis bağlantı testi
redis-cli ping
```

## Bakım ve Güncelleme

### 1. Yedekleme

```bash
# Veritabanı yedeği alma
pg_dump -U postgres codifya_erp > backup.sql

# Dosya sistemi yedeği
tar -czf backup.tar.gz /path/to/codifya-erp
```

### 2. Güncelleme

```bash
# Kod güncellemesi
git pull origin develop

# Bağımlılıkları güncelleme
npm install

# Container'ları yeniden başlatma
docker-compose down
docker-compose up -d
```

## Destek ve İletişim

- Teknik Destek: support@codifya-erp.com
- Dokümantasyon: docs.codifya-erp.com
- GitHub Issues: github.com/your-org/codifya-erp/issues 