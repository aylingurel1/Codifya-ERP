# Mikroservis Mimarisi

## 1. Genel Bakış
Codifya ERP sistemi, modern mikroservis mimarisi üzerine kurulmuştur. Her modül bağımsız bir mikroservis olarak çalışır ve kendi veritabanına sahiptir. Servisler arası iletişim REST API ve mesaj kuyruğu ile sağlanır.

## 2. Mimari Prensipler
- **Single Responsibility:** Her servis tek bir iş alanından sorumludur
- **Loose Coupling:** Servisler arası gevşek bağlantı
- **High Cohesion:** Servis içi yüksek iç tutarlılık
- **Independent Deployment:** Bağımsız dağıtım
- **Technology Diversity:** Farklı teknolojiler kullanılabilir
- **Fault Isolation:** Hata izolasyonu

## 3. Servis Mimarisi

### 3.1 API Gateway
```
┌─────────────────┐
│   API Gateway   │ ← Tüm isteklerin giriş noktası
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Load Balancer │ ← Yük dengeleme
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Service Mesh  │ ← Servisler arası iletişim
└─────────────────┘
```

### 3.2 Servis Katmanları
- **Presentation Layer:** API Gateway, Web UI
- **Business Layer:** Mikroservisler
- **Data Layer:** Veritabanları, Cache
- **Infrastructure Layer:** Monitoring, Logging

## 4. Mikroservisler

### 4.1 Finans Servisi
- **Port:** 3001
- **Database:** PostgreSQL
- **Responsibility:** Muhasebe, bütçe, nakit akışı
- **Dependencies:** Notification Service, Audit Service

### 4.2 İK Servisi
- **Port:** 3002
- **Database:** PostgreSQL
- **Responsibility:** Personel, bordro, izin yönetimi
- **Dependencies:** Notification Service, Document Service

### 4.3 CRM Servisi
- **Port:** 3003
- **Database:** MongoDB
- **Responsibility:** Müşteri yönetimi, satış pipeline
- **Dependencies:** Email Service, Analytics Service

### 4.4 Tedarik Zinciri Servisi
- **Port:** 3004
- **Database:** PostgreSQL
- **Responsibility:** Stok, satın alma, tedarikçi yönetimi
- **Dependencies:** Notification Service, Document Service

### 4.5 Üretim Servisi
- **Port:** 3005
- **Database:** PostgreSQL
- **Responsibility:** Üretim planlama, kalite yönetimi
- **Dependencies:** Supply Chain Service, Analytics Service

### 4.6 Proje Yönetimi Servisi
- **Port:** 3006
- **Database:** MongoDB
- **Responsibility:** Proje planlama, kaynak yönetimi
- **Dependencies:** Notification Service, Document Service

### 4.7 Raporlama Servisi
- **Port:** 3007
- **Database:** ClickHouse
- **Responsibility:** Analitik, raporlama, dashboard
- **Dependencies:** Tüm diğer servisler

## 5. Servisler Arası İletişim

### 5.1 Senkron İletişim (REST API)
```javascript
// Servisler arası HTTP istekleri
const response = await fetch('http://finance-service:3001/api/v1/accounts', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 5.2 Asenkron İletişim (Message Queue)
```javascript
// RabbitMQ ile mesaj gönderme
const channel = await connection.createChannel();
await channel.assertQueue('order.created');
channel.sendToQueue('order.created', Buffer.from(JSON.stringify(orderData)));
```

### 5.3 Event-Driven Architecture
```javascript
// Event publishing
class OrderService {
  async createOrder(orderData) {
    const order = await this.orderRepository.create(orderData);
    
    // Event publishing
    await this.eventBus.publish('order.created', {
      orderId: order.id,
      customerId: order.customerId,
      amount: order.amount
    });
    
    return order;
  }
}
```

## 6. Veri Yönetimi

### 6.1 Database per Service Pattern
- Her servis kendi veritabanına sahiptir
- Veritabanı şeması servis tarafından yönetilir
- Servisler arası veri paylaşımı API üzerinden yapılır

### 6.2 Saga Pattern (Distributed Transactions)
```javascript
// Saga orchestrator
class OrderSaga {
  async execute(orderData) {
    try {
      // 1. Create order
      const order = await this.orderService.create(orderData);
      
      // 2. Reserve inventory
      await this.inventoryService.reserve(order.items);
      
      // 3. Process payment
      await this.paymentService.process(order.payment);
      
      // 4. Confirm order
      await this.orderService.confirm(order.id);
      
    } catch (error) {
      // Compensation logic
      await this.compensate(order, error);
    }
  }
}
```

### 6.3 CQRS Pattern
```javascript
// Command side
class CreateOrderCommand {
  constructor(orderData) {
    this.orderData = orderData;
  }
}

// Query side
class OrderQueryService {
  async getOrderById(id) {
    return await this.readModel.findById(id);
  }
  
  async getOrdersByCustomer(customerId) {
    return await this.readModel.findByCustomer(customerId);
  }
}
```

## 7. Güvenlik

### 7.1 Authentication & Authorization
```javascript
// JWT token validation middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401);
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

### 7.2 API Gateway Security
- Rate limiting
- Request validation
- CORS configuration
- SSL/TLS termination

## 8. Monitoring ve Observability

### 8.1 Distributed Tracing
```javascript
// Jaeger integration
const tracer = require('jaeger-client').initTracer({
  serviceName: 'finance-service',
  sampler: {
    type: 'const',
    param: 1
  },
  reporter: {
    logSpans: true,
    agentHost: 'jaeger-agent',
    agentPort: 6832
  }
});
```

### 8.2 Metrics Collection
```javascript
// Prometheus metrics
const prometheus = require('prom-client');
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});
```

### 8.3 Centralized Logging
```javascript
// Winston logger with ELK stack
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.Http({
      host: 'logstash',
      port: 5000
    })
  ]
});
```

## 9. Deployment ve DevOps

### 9.1 Docker Containerization
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### 9.2 Kubernetes Deployment
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: finance-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: finance-service
  template:
    metadata:
      labels:
        app: finance-service
    spec:
      containers:
      - name: finance-service
        image: codifya/finance-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

### 9.3 Service Mesh (Istio)
```yaml
# virtual-service.yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: finance-service
spec:
  hosts:
  - finance-service
  http:
  - route:
    - destination:
        host: finance-service
        subset: v1
      weight: 90
    - destination:
        host: finance-service
        subset: v2
      weight: 10
```

## 10. Performance Optimization

### 10.1 Caching Strategy
```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient();

class CacheService {
  async get(key) {
    const cached = await client.get(key);
    return cached ? JSON.parse(cached) : null;
  }
  
  async set(key, value, ttl = 3600) {
    await client.setex(key, ttl, JSON.stringify(value));
  }
}
```

### 10.2 Database Optimization
- Connection pooling
- Query optimization
- Indexing strategy
- Read replicas

### 10.3 Load Balancing
- Round-robin
- Least connections
- Weighted round-robin
- Health checks

## 11. Disaster Recovery

### 11.1 Backup Strategy
- Database backups (daily)
- Configuration backups
- Code repository backups
- Cross-region replication

### 11.2 Failover Strategy
- Active-passive setup
- Automatic failover
- Data consistency checks
- Recovery time objectives (RTO)

## 12. Best Practices

### 12.1 Service Design
- Keep services small and focused
- Use domain-driven design
- Implement circuit breakers
- Use bulkhead pattern

### 12.2 Data Management
- Avoid distributed transactions
- Use eventual consistency
- Implement idempotency
- Handle partial failures

### 12.3 Testing Strategy
- Unit tests for each service
- Integration tests for APIs
- Contract tests for service interfaces
- End-to-end tests for critical paths

Bu dokümantasyon, Codifya ERP sisteminin mikroservis mimarisini detaylı olarak açıklamaktadır. Geliştirme ekibi bu prensiplere uygun olarak çalışmalıdır. 