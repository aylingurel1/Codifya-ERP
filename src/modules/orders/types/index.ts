import { User, Customer, Product, Payment } from '@/types'

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product: Product
  quantity: number
  price: number
  total: number
}

export interface CreateOrderItemRequest {
  productId: string
  quantity: number
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer: Customer
  status: OrderStatus
  totalAmount: number
  taxAmount: number
  discount: number
  notes?: string
  orderDate: Date
  createdAt: Date
  updatedAt: Date
  createdBy: string
  createdByUser: User
  items: OrderItem[]
  payments: Payment[]
}

export interface CreateOrderRequest {
  customerId: string
  items: CreateOrderItemRequest[]
  notes?: string
  discount?: number
}

export interface UpdateOrderRequest {
  customerId?: string
  status?: OrderStatus
  notes?: string
  discount?: number
}

export interface OrderFilters {
  search?: string
  customerId?: string
  status?: OrderStatus
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface OrderListResponse {
  orders: Order[]
  total: number
  page: number
  limit: number
  totalPages: number
} 