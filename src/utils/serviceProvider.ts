import { AuthService } from '@/modules/auth/services/authService'
import { CustomerService } from '@/modules/crm/services/customerService'

export class ServiceProvider {
  static getAuthService(): AuthService {
    return AuthService.create() as AuthService
  }

  static getCustomerService(): CustomerService {
    return CustomerService.create() as CustomerService
  }
} 