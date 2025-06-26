// Dependency Injection Types
export const TYPES = {
  // Database
  PrismaClient: Symbol.for('PrismaClient'),
  
  // Logger
  ILogger: Symbol.for('ILogger'),
  
  // Repositories
  IUserRepository: Symbol.for('IUserRepository'),
  ICustomerRepository: Symbol.for('ICustomerRepository'),
  IProductRepository: Symbol.for('IProductRepository'),
  IOrderRepository: Symbol.for('IOrderRepository'),
  IPaymentRepository: Symbol.for('IPaymentRepository'),
  IInvoiceRepository: Symbol.for('IInvoiceRepository'),
  
  // Services
  IAuthService: Symbol.for('IAuthService'),
  ICustomerService: Symbol.for('ICustomerService'),
  IProductService: Symbol.for('IProductService'),
  IOrderService: Symbol.for('IOrderService'),
  IPaymentService: Symbol.for('IPaymentService'),
  IInvoiceService: Symbol.for('IInvoiceService'),
  ITransactionService: Symbol.for('ITransactionService'),
} as const 