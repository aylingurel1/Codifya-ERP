// Temel API Response tipleri
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Kullanıcı tipleri
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'MANAGER' | 'USER';
}

// Müşteri tipleri
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  taxNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUser: User;
}

export interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  taxNumber?: string;
}

// Ürün tipleri
export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUser: User;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  minStock?: number;
  category?: string;
}

// Sipariş tipleri
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: Customer;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  taxAmount: number;
  discount: number;
  notes?: string;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUser: User;
  items: OrderItem[];
  payments: Payment[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface CreateOrderRequest {
  customerId: string;
  items: CreateOrderItemRequest[];
  notes?: string;
  discount?: number;
}

export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
}

// Ödeme tipleri
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CHECK';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  reference?: string;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  method: 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CHECK';
  reference?: string;
} 