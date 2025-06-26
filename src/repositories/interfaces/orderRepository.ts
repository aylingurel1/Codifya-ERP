import { Order } from '@/types'
import { IBaseRepository } from './baseRepository'

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface CreateOrderDTO {
  orderNumber: string
  customerId: string
  status: OrderStatus
  totalAmount: number
  taxAmount: number
  discount: number
  notes?: string
  orderDate: Date
  createdBy: string
}

export interface UpdateOrderDTO {
  customerId?: string
  status?: OrderStatus
  totalAmount?: number
  taxAmount?: number
  discount?: number
  notes?: string
}

export interface OrderFilters {
  search?: string
  customerId?: string
  status?: OrderStatus
  dateFrom?: Date
  dateTo?: Date
  createdBy?: string
}

export interface IOrderRepository extends IBaseRepository<Order, CreateOrderDTO, UpdateOrderDTO, OrderFilters> {
  findByOrderNumber(orderNumber: string): Promise<Order | null>
  findByCustomer(customerId: string): Promise<Order[]>
  findByStatus(status: OrderStatus): Promise<Order[]>
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order>
  getOrderStats(): Promise<{
    total: number
    pending: number
    confirmed: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
    totalRevenue: number
    averageOrderValue: number
  }>
  getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]>
  getRecentOrders(limit: number): Promise<Order[]>
} 