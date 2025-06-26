# Veritabanı

Bu doküman, Codifya ERP sisteminin veritabanı yapılandırmasını ve best practice'lerini detaylandırır.

## PostgreSQL

### Veritabanı Şeması

1. **Kullanıcılar Tablosu**
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     first_name VARCHAR(100) NOT NULL,
     last_name VARCHAR(100) NOT NULL,
     role VARCHAR(50) NOT NULL,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );

   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_users_role ON users(role);
   ```

2. **Roller Tablosu**
   ```sql
   CREATE TABLE roles (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name VARCHAR(50) UNIQUE NOT NULL,
     description TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE role_permissions (
     role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
     permission VARCHAR(100) NOT NULL,
     PRIMARY KEY (role_id, permission)
   );
   ```

3. **Müşteriler Tablosu**
   ```sql
   CREATE TABLE customers (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     company_name VARCHAR(255) NOT NULL,
     tax_number VARCHAR(50),
     tax_office VARCHAR(100),
     address TEXT,
     phone VARCHAR(20),
     email VARCHAR(255),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );

   CREATE INDEX idx_customers_company_name ON customers(company_name);
   CREATE INDEX idx_customers_tax_number ON customers(tax_number);
   ```

### İndeksler

1. **B-Tree İndeksler**
   ```sql
   -- Tekli kolon indeksi
   CREATE INDEX idx_users_email ON users(email);

   -- Çoklu kolon indeksi
   CREATE INDEX idx_users_name_role ON users(first_name, last_name, role);

   -- Kısmi indeks
   CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;
   ```

2. **Hash İndeksler**
   ```sql
   -- Hash indeks
   CREATE INDEX idx_users_password_hash ON users USING hash (password_hash);
   ```

3. **GIN İndeksler**
   ```sql
   -- JSON indeksi
   CREATE INDEX idx_users_metadata ON users USING gin (metadata);

   -- Array indeksi
   CREATE INDEX idx_users_tags ON users USING gin (tags);
   ```

### Stored Procedure'ler

1. **Kullanıcı İşlemleri**
   ```sql
   CREATE OR REPLACE FUNCTION create_user(
     p_email VARCHAR,
     p_password_hash VARCHAR,
     p_first_name VARCHAR,
     p_last_name VARCHAR,
     p_role VARCHAR
   ) RETURNS UUID AS $$
   DECLARE
     v_user_id UUID;
   BEGIN
     INSERT INTO users (
       email,
       password_hash,
       first_name,
       last_name,
       role
     ) VALUES (
       p_email,
       p_password_hash,
       p_first_name,
       p_last_name,
       p_role
     ) RETURNING id INTO v_user_id;

     RETURN v_user_id;
   END;
   $$ LANGUAGE plpgsql;
   ```

2. **Raporlama**
   ```sql
   CREATE OR REPLACE FUNCTION get_user_statistics(
     p_start_date TIMESTAMP,
     p_end_date TIMESTAMP
   ) RETURNS TABLE (
     total_users BIGINT,
     active_users BIGINT,
     new_users BIGINT
   ) AS $$
   BEGIN
     RETURN QUERY
     SELECT
       COUNT(*) as total_users,
       COUNT(*) FILTER (WHERE is_active = true) as active_users,
       COUNT(*) FILTER (WHERE created_at BETWEEN p_start_date AND p_end_date) as new_users
     FROM users;
   END;
   $$ LANGUAGE plpgsql;
   ```

### Transaction Yönetimi

1. **Basit Transaction**
   ```sql
   BEGIN;
   INSERT INTO users (email, password_hash, first_name, last_name, role)
   VALUES ('user@example.com', 'hash', 'John', 'Doe', 'user');
   INSERT INTO user_profiles (user_id, phone, address)
   VALUES (LASTVAL(), '1234567890', 'Address');
   COMMIT;
   ```

2. **Savepoint Kullanımı**
   ```sql
   BEGIN;
   INSERT INTO users (email, password_hash, first_name, last_name, role)
   VALUES ('user@example.com', 'hash', 'John', 'Doe', 'user');
   SAVEPOINT user_created;
   INSERT INTO user_profiles (user_id, phone, address)
   VALUES (LASTVAL(), '1234567890', 'Address');
   ROLLBACK TO SAVEPOINT user_created;
   COMMIT;
   ```

## MongoDB

### Koleksiyon Şemaları

1. **Log Koleksiyonu**
   ```javascript
   {
     _id: ObjectId,
     level: String,
     message: String,
     timestamp: Date,
     metadata: {
       userId: String,
       action: String,
       ip: String,
       userAgent: String
     }
   }
   ```

2. **Cache Koleksiyonu**
   ```javascript
   {
     _id: String,
     data: Mixed,
     expiresAt: Date,
     createdAt: Date,
     updatedAt: Date
   }
   ```

### İndeksler

1. **Tekli İndeks**
   ```javascript
   db.logs.createIndex({ timestamp: 1 });
   ```

2. **Bileşik İndeks**
   ```javascript
   db.logs.createIndex({ level: 1, timestamp: -1 });
   ```

3. **TTL İndeks**
   ```javascript
   db.cache.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
   ```

### Aggregation Pipeline

1. **Log Analizi**
   ```javascript
   db.logs.aggregate([
     {
       $match: {
         timestamp: {
           $gte: ISODate("2024-01-01"),
           $lte: ISODate("2024-12-31")
         }
       }
     },
     {
       $group: {
         _id: {
           level: "$level",
           date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
         },
         count: { $sum: 1 }
       }
     },
     {
       $sort: { "_id.date": 1, "_id.level": 1 }
     }
   ]);
   ```

2. **Kullanıcı Aktivite Analizi**
   ```javascript
   db.logs.aggregate([
     {
       $match: {
         "metadata.action": { $exists: true }
       }
     },
     {
       $group: {
         _id: "$metadata.userId",
         totalActions: { $sum: 1 },
         actions: {
           $push: {
             action: "$metadata.action",
             timestamp: "$timestamp"
           }
         }
       }
     },
     {
       $sort: { totalActions: -1 }
     }
   ]);
   ```

## Redis

### Veri Yapıları

1. **String**
   ```javascript
   // Cache
   SET user:123 "{\"name\":\"John\",\"role\":\"admin\"}"
   SETEX user:123 3600 "{\"name\":\"John\",\"role\":\"admin\"}"

   // Counter
   INCR page:views
   INCRBY user:123:points 10
   ```

2. **Hash**
   ```javascript
   // Kullanıcı profili
   HSET user:123 name "John" role "admin" email "john@example.com"
   HGETALL user:123
   HINCRBY user:123:points 10
   ```

3. **List**
   ```javascript
   // Son işlemler
   LPUSH user:123:actions "login"
   LPUSH user:123:actions "update_profile"
   LRANGE user:123:actions 0 9
   ```

4. **Set**
   ```javascript
   // Kullanıcı rolleri
   SADD user:123:roles "admin" "editor" "user"
   SMEMBERS user:123:roles
   SISMEMBER user:123:roles "admin"
   ```

5. **Sorted Set**
   ```javascript
   // Sıralı liste
   ZADD leaderboard 100 "user1" 200 "user2" 300 "user3"
   ZRANGE leaderboard 0 -1 WITHSCORES
   ZREVRANGE leaderboard 0 2 WITHSCORES
   ```

### Pub/Sub

1. **Kanal Aboneliği**
   ```javascript
   // Publisher
   PUBLISH notifications "New user registered"

   // Subscriber
   SUBSCRIBE notifications
   ```

2. **Pattern Aboneliği**
   ```javascript
   // Publisher
   PUBLISH user:123:notifications "Profile updated"
   PUBLISH user:456:notifications "New message"

   // Subscriber
   PSUBSCRIBE user:*:notifications
   ```

### Lua Scripts

1. **Rate Limiting**
   ```lua
   -- rate_limiter.lua
   local key = KEYS[1]
   local limit = tonumber(ARGV[1])
   local window = tonumber(ARGV[2])
   local current = redis.call('GET', key) or 0
   
   if tonumber(current) >= limit then
     return 0
   end
   
   redis.call('INCR', key)
   redis.call('EXPIRE', key, window)
   return 1
   ```

2. **Distributed Lock**
   ```lua
   -- acquire_lock.lua
   local lock_key = KEYS[1]
   local lock_value = ARGV[1]
   local ttl = tonumber(ARGV[2])
   
   if redis.call('SETNX', lock_key, lock_value) == 1 then
     redis.call('EXPIRE', lock_key, ttl)
     return 1
   end
   
   return 0
   ```

## Veritabanı Yönetimi

### Backup Stratejisi

1. **PostgreSQL Backup**
   ```bash
   # Tam yedekleme
   pg_dump -U postgres -F c -b -v -f backup.dump codifya_erp

   # Artırımlı yedekleme
   pg_basebackup -D /backup -Ft -z -P
   ```

2. **MongoDB Backup**
   ```bash
   # Tam yedekleme
   mongodump --db codifya_erp --out /backup

   # Artırımlı yedekleme
   mongodump --db codifya_erp --out /backup --oplog
   ```

3. **Redis Backup**
   ```bash
   # RDB yedekleme
   redis-cli SAVE

   # AOF yedekleme
   redis-cli BGREWRITEAOF
   ```

### Monitoring

1. **PostgreSQL Monitoring**
   ```sql
   -- Aktif bağlantılar
   SELECT * FROM pg_stat_activity;

   -- Tablo istatistikleri
   SELECT * FROM pg_stat_user_tables;

   -- İndeks kullanımı
   SELECT * FROM pg_stat_user_indexes;
   ```

2. **MongoDB Monitoring**
   ```javascript
   // Sunucu durumu
   db.serverStatus()

   // Koleksiyon istatistikleri
   db.collection.stats()

   // Aktif işlemler
   db.currentOp()
   ```

3. **Redis Monitoring**
   ```bash
   # Sunucu bilgisi
   redis-cli INFO

   # Memory kullanımı
   redis-cli INFO memory

   # Client bağlantıları
   redis-cli CLIENT LIST
   ```

### Performans Optimizasyonu

1. **PostgreSQL Optimizasyonu**
   ```sql
   -- Tablo analizi
   ANALYZE users;

   -- İndeks yeniden oluşturma
   REINDEX TABLE users;

   -- VACUUM
   VACUUM ANALYZE users;
   ```

2. **MongoDB Optimizasyonu**
   ```javascript
   // Koleksiyon analizi
   db.collection.analyze()

   // İndeks yeniden oluşturma
   db.collection.reIndex()

   // Compact
   db.runCommand({ compact: 'collection' })
   ```

3. **Redis Optimizasyonu**
   ```bash
   # Memory optimizasyonu
   redis-cli MEMORY PURGE

   # AOF yeniden yazma
   redis-cli BGREWRITEAOF
   ``` 