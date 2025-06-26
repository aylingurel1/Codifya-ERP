# Test

Bu bölümde Codifya ERP projesinde kullanılan test stratejileri, araçları ve en iyi uygulamalar detaylandırılmıştır.

## Test Türleri

### 1. Birim Testleri (Unit Tests)
- **Amaç:** Fonksiyon, bileşen veya modülün izole şekilde doğru çalıştığını doğrulamak.
- **Araçlar:** Jest, React Testing Library
- **Örnek:**
  ```typescript
  // utils/__tests__/math.test.ts
  import { sum } from '../math';

  describe('sum', () => {
    it('iki sayının toplamını döndürür', () => {
      expect(sum(2, 3)).toBe(5);
    });
  });
  ```

### 2. Entegrasyon Testleri (Integration Tests)
- **Amaç:** Birden fazla modülün/bileşenin birlikte doğru çalıştığını doğrulamak.
- **Araçlar:** Jest, React Testing Library, Supertest (backend için)
- **Örnek:**
  ```typescript
  // components/__tests__/UserForm.test.tsx
  import { render, screen, fireEvent } from '@testing-library/react';
  import UserForm from '../UserForm';

  describe('UserForm', () => {
    it('formu doğru şekilde submit eder', () => {
      const handleSubmit = jest.fn();
      render(<UserForm onSubmit={handleSubmit} />);
      fireEvent.change(screen.getByLabelText('Ad'), { target: { value: 'Ali' } });
      fireEvent.change(screen.getByLabelText('Soyad'), { target: { value: 'Veli' } });
      fireEvent.click(screen.getByText('Kaydet'));
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
  ```

### 3. Uçtan Uca Testler (End-to-End / E2E)
- **Amaç:** Gerçek kullanıcı davranışlarını taklit ederek sistemin tamamının doğru çalıştığını doğrulamak.
- **Araçlar:** Cypress, Playwright
- **Örnek:**
  ```javascript
  // e2e/login.spec.js
  describe('Giriş Akışı', () => {
    it('Kullanıcı başarılı şekilde giriş yapar', () => {
      cy.visit('/login');
      cy.get('input[name=email]').type('test@codifya.com');
      cy.get('input[name=password]').type('12345678');
      cy.get('button[type=submit]').click();
      cy.url().should('include', '/dashboard');
      cy.contains('Hoşgeldiniz');
    });
  });
  ```

## Test Araçları ve Yapılandırma

- **Jest:** Birim ve entegrasyon testleri için ana test framework'ü.
- **React Testing Library:** React bileşenlerinin test edilmesi için.
- **Supertest:** Backend API entegrasyon testleri için.
- **Cypress/Playwright:** Uçtan uca testler için.

### Jest Yapılandırması (jest.config.js)
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
};
```

### Cypress Kurulumu
```bash
npm install --save-dev cypress
npx cypress open
```

## Test Kapsamı ve Raporlama
- **Coverage:**
  ```bash
  npm run test -- --coverage
  ```
- **Raporlama:** Jest ve Cypress ile HTML/JSON raporları alınabilir.

## CI/CD'de Test Otomasyonu
- Tüm testler CI pipeline'ında otomatik olarak çalıştırılır.
- Başarısız testler merge edilmez.
- Test sonuçları ve coverage raporları pipeline sonunda sunulur.

## En İyi Uygulamalar
- Her yeni özellik için birim ve entegrasyon testleri yazın.
- Hatalar için test ekleyin (regression).
- Mock ve stub kullanarak dış bağımlılıkları izole edin.
- Test isimlerini ve açıklamalarını açık yazın.
- Kod review sırasında testler de gözden geçirilir.

## Sık Karşılaşılan Sorunlar
- **Testler lokal çalışıyor, CI'da başarısız:** Ortam değişkenlerini ve bağımlılıkları kontrol edin.
- **Yavaş testler:** Gereksiz bağımlılıkları mock'layın, sadece gerekli testleri çalıştırın.
- **Flaky testler:** Zamanlayıcıları ve asenkron işlemleri doğru yönetin.

Daha fazla bilgi için Jest, Cypress ve Playwright dökümantasyonlarına başvurabilirsiniz. 