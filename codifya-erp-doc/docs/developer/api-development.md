# API Geliştirme

Bu doküman, Codifya ERP sisteminin API geliştirme standartlarını ve best practice'lerini detaylandırır.

## REST API Standartları

### Endpoint Yapısı

1. **URL Yapısı**
   ```
   /api/v1/{resource}/{id}/{sub-resource}
   ```

2. **HTTP Metodları**
   - `GET`: Veri okuma
   - `POST`: Yeni kayıt oluşturma
   - `PUT`: Tüm kaydı güncelleme
   - `PATCH`: Kısmi güncelleme
   - `DELETE`: Kayıt silme

3. **Status Kodları**
   - `200 OK`: Başarılı işlem
   - `201 Created`: Yeni kayıt oluşturuldu
   - `204 No Content`: Başarılı silme işlemi
   - `400 Bad Request`: Geçersiz istek
   - `401 Unauthorized`: Kimlik doğrulama gerekli
   - `403 Forbidden`: Yetkisiz erişim
   - `404 Not Found`: Kayıt bulunamadı
   - `422 Unprocessable Entity`: Validasyon hatası
   - `500 Internal Server Error`: Sunucu hatası

### Örnek Endpoint'ler

```typescript
// Kullanıcı işlemleri
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id

// Alt kaynaklar
GET    /api/v1/users/:id/roles
POST   /api/v1/users/:id/roles
DELETE /api/v1/users/:id/roles/:roleId
```

### Request/Response Formatı

1. **Request Formatı**
   ```typescript
   // GET /api/v1/users?page=1&limit=10&sort=name
   interface QueryParams {
     page?: number;
     limit?: number;
     sort?: string;
     filter?: Record<string, any>;
   }

   // POST /api/v1/users
   interface CreateUserRequest {
     name: string;
     email: string;
     password: string;
     role: string;
   }
   ```

2. **Response Formatı**
   ```typescript
   // Başarılı response
   interface SuccessResponse<T> {
     data: T;
     meta?: {
       page?: number;
       limit?: number;
       total?: number;
     };
   }

   // Hata response
   interface ErrorResponse {
     error: {
       code: string;
       message: string;
       details?: Record<string, any>;
     };
   }
   ```

## API Güvenliği

### Authentication

1. **JWT Kullanımı**
   ```typescript
   // Token oluşturma
   const token = jwt.sign(
     { userId: user.id, role: user.role },
     process.env.JWT_SECRET,
     { expiresIn: '1h' }
   );

   // Token doğrulama
   const verifyToken = (token: string) => {
     try {
       return jwt.verify(token, process.env.JWT_SECRET);
     } catch (error) {
       throw new UnauthorizedError('Invalid token');
     }
   };
   ```

2. **Refresh Token**
   ```typescript
   // Refresh token oluşturma
   const refreshToken = jwt.sign(
     { userId: user.id },
     process.env.REFRESH_TOKEN_SECRET,
     { expiresIn: '7d' }
   );

   // Token yenileme
   const refreshAccessToken = async (refreshToken: string) => {
     const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
     const user = await userService.findById(decoded.userId);
     return generateTokens(user);
   };
   ```

### Authorization

1. **Role-Based Access Control (RBAC)**
   ```typescript
   // Role tanımları
   enum UserRole {
     ADMIN = 'admin',
     MANAGER = 'manager',
     USER = 'user'
   }

   // Permission tanımları
   enum Permission {
     CREATE_USER = 'create:user',
     READ_USER = 'read:user',
     UPDATE_USER = 'update:user',
     DELETE_USER = 'delete:user'
   }

   // Role-Permission mapping
   const rolePermissions = {
     [UserRole.ADMIN]: [
       Permission.CREATE_USER,
       Permission.READ_USER,
       Permission.UPDATE_USER,
       Permission.DELETE_USER
     ],
     [UserRole.MANAGER]: [
       Permission.READ_USER,
       Permission.UPDATE_USER
     ],
     [UserRole.USER]: [
       Permission.READ_USER
     ]
   };
   ```

2. **Authorization Middleware**
   ```typescript
   const checkPermission = (permission: Permission) => {
     return async (req: Request, res: Response, next: NextFunction) => {
       const user = req.user;
       const userPermissions = rolePermissions[user.role];

       if (!userPermissions.includes(permission)) {
         throw new ForbiddenError('Insufficient permissions');
       }

       next();
     };
   };
   ```

### Rate Limiting

1. **Redis ile Rate Limiting**
   ```typescript
   const rateLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 dakika
     max: 100, // IP başına maksimum istek
     message: 'Too many requests from this IP'
   });

   app.use('/api/', rateLimiter);
   ```

2. **API Key Rate Limiting**
   ```typescript
   const apiKeyRateLimiter = rateLimit({
     windowMs: 60 * 60 * 1000, // 1 saat
     max: 1000, // API key başına maksimum istek
     keyGenerator: (req) => req.headers['x-api-key']
   });

   app.use('/api/v1/', apiKeyRateLimiter);
   ```

## API Dokümantasyonu

### Swagger/OpenAPI

1. **Swagger Tanımları**
   ```typescript
   const swaggerOptions = {
     definition: {
       openapi: '3.0.0',
       info: {
         title: 'Codifya ERP API',
         version: '1.0.0',
         description: 'Codifya ERP API Documentation'
       },
       servers: [
         {
           url: 'http://localhost:3000',
           description: 'Development server'
         }
       ]
     },
     apis: ['./src/routes/*.ts']
   };
   ```

2. **Endpoint Dokümantasyonu**
   ```typescript
   /**
    * @swagger
    * /api/v1/users:
    *   get:
    *     summary: Kullanıcı listesini getirir
    *     tags: [Users]
    *     parameters:
    *       - in: query
    *         name: page
    *         schema:
    *           type: integer
    *         description: Sayfa numarası
    *       - in: query
    *         name: limit
    *         schema:
    *           type: integer
    *         description: Sayfa başına kayıt sayısı
    *     responses:
    *       200:
    *         description: Başarılı
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 data:
    *                   type: array
    *                   items:
    *                     $ref: '#/components/schemas/User'
    */
   ```

## API Versiyonlama

### URL Versiyonlama

1. **Endpoint Yapısı**
   ```
   /api/v1/users
   /api/v2/users
   ```

2. **Versiyon Kontrolü**
   ```typescript
   const versionMiddleware = (version: string) => {
     return (req: Request, res: Response, next: NextFunction) => {
       req.apiVersion = version;
       next();
     };
   };

   app.use('/api/v1', versionMiddleware('v1'), v1Router);
   app.use('/api/v2', versionMiddleware('v2'), v2Router);
   ```

### Header Versiyonlama

1. **Accept Header**
   ```
   Accept: application/vnd.codifya.v1+json
   ```

2. **Custom Header**
   ```
   X-API-Version: 1
   ```

## Error Handling

### Global Error Handler

```typescript
const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ValidationError) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: error.details
      }
    });
  }

  if (error instanceof UnauthorizedError) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: error.message
      }
    });
  }

  if (error instanceof ForbiddenError) {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: error.message
      }
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: error.message
      }
    });
  }

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};

app.use(errorHandler);
```

### Custom Error Sınıfları

```typescript
class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message: string, public details: Record<string, any>) {
    super('VALIDATION_ERROR', message, 422);
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message: string = 'Not found') {
    super('NOT_FOUND', message, 404);
  }
}
```

## API Testing

### Unit Tests

```typescript
describe('UserController', () => {
  describe('GET /api/v1/users', () => {
    it('should return list of users', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/v1/users');

      expect(response.status).toBe(401);
    });
  });
});
```

### Integration Tests

```typescript
describe('User API', () => {
  beforeAll(async () => {
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  beforeEach(async () => {
    await database.clear();
  });

  it('should create and get user', async () => {
    // Create user
    const createResponse = await request(app)
      .post('/api/v1/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });

    expect(createResponse.status).toBe(201);
    const userId = createResponse.body.data.id;

    // Get user
    const getResponse = await request(app)
      .get(`/api/v1/users/${userId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.name).toBe('John Doe');
  });
});
``` 