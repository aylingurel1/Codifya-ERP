// Temel API Response tipleri
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  details?: Record<string, any>;
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

// Kategori tipi
export interface Category {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
}

// Müşteri tipleri
export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  company: string | null;
  taxNumber: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUser: User;
  orders?: Order[];
  invoices?: Invoice[];
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
  description: string | null;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  category: Category | null;
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
  notes: string | null;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUser: User;
  items: OrderItem[];
  payments: Payment[];
  invoices?: Invoice[];
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
  order?: Order;
  amount: number;
  method: 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CHECK';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  reference: string | null;
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

// Fatura tipleri
export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId?: string | null;
  order?: Order | null;
  customerId?: string | null;
  customer?: Customer | null;
  type: 'SALES' | 'PURCHASE' | 'EXPENSE';
  status: 'DRAFT' | 'SENT' | 'PAID' | 'CANCELLED';
  subtotal: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  dueDate: Date;
  issueDate: Date;
  paidDate?: Date | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUser: User;
} 