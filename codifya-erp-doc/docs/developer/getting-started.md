# Başlangıç

Bu bölüm, Codifya ERP sisteminin geliştirme ortamını kurmak ve projeye başlamak için gerekli adımları içerir.

## Gereksinimler

### Sistem Gereksinimleri
- İşletim Sistemi: macOS 12+, Ubuntu 20.04+, Windows 10+
- RAM: Minimum 8GB, Önerilen 16GB
- CPU: Minimum 4 çekirdek
- Disk Alanı: Minimum 20GB boş alan

### Yazılım Gereksinimleri
- Node.js 18+
- PostgreSQL 14+
- MongoDB 6+
- Redis 7+
- Docker 20.10+
- Git 2.30+
- VS Code (önerilen IDE)

## Kurulum Adımları

### 1. Geliştirme Ortamının Hazırlanması

#### Node.js Kurulumu
```bash
# nvm kullanarak Node.js kurulumu
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc  # veya source ~/.zshrc
nvm install 18
nvm use 18
```

#### PostgreSQL Kurulumu
```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu
sudo apt update
sudo apt install postgresql-14
sudo systemctl start postgresql
```

#### MongoDB Kurulumu
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0

# Ubuntu
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Redis Kurulumu
```bash
# macOS
brew install redis@7
brew services start redis@7

# Ubuntu
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

#### Docker Kurulumu
```bash
# macOS
brew install --cask docker

# Ubuntu
sudo apt update
sudo apt install docker.io
sudo systemctl start docker
sudo usermod -aG docker $USER
```

### 2. Proje Kurulumu

#### Projeyi Klonlama
```bash
git clone https://github.com/your-org/codifya-erp.git
cd codifya-erp
```

#### Bağımlılıkların Yüklenmesi
```bash
# Ana proje bağımlılıkları
npm install

# Frontend bağımlılıkları
cd frontend
npm install

# Backend bağımlılıkları
cd ../backend
npm install
```

#### Ortam Değişkenlerinin Ayarlanması
```bash
# Ana proje için
cp .env.example .env

# Frontend için
cd frontend
cp .env.example .env

# Backend için
cd ../backend
cp .env.example .env
```

#### Veritabanı Kurulumu
```bash
# PostgreSQL veritabanı oluşturma
createdb codifya_erp

# Migrasyonları çalıştırma
npm run migrate

# Seed verilerini yükleme
npm run seed
```

### 3. Geliştirme Sunucusunu Başlatma

```bash
# Tüm servisleri başlatma (Docker ile)
docker-compose up -d

# veya manuel olarak
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## İlk Değişikliği Yapma

1. Yeni bir branch oluşturun:
```bash
git checkout -b feature/your-feature-name
```

2. Değişikliklerinizi yapın

3. Değişikliklerinizi commit edin:
```bash
git add .
git commit -m "feat: your feature description"
```

4. Branch'inizi push edin:
```bash
git push origin feature/your-feature-name
```

5. Pull Request oluşturun

## Sık Karşılaşılan Sorunlar

### Port Çakışmaları
Eğer port çakışması yaşıyorsanız, `.env` dosyasında port numaralarını değiştirebilirsiniz.

### Veritabanı Bağlantı Hataları
- PostgreSQL servisinin çalıştığından emin olun
- Veritabanı kullanıcı adı ve şifresinin doğru olduğunu kontrol edin
- Veritabanının oluşturulduğundan emin olun

### Node.js Sürüm Uyumsuzluğu
Projenin Node.js 18+ gerektirdiğinden emin olun:
```bash
node -v
```

## Sonraki Adımlar

1. [Mimari](./architecture.md) dokümanını inceleyin
2. [Kod Standartları](./coding-standards.md) dokümanını okuyun
3. [API Geliştirme](./api-development.md) kılavuzunu takip edin
4. [Test](./testing.md) stratejilerini öğrenin 