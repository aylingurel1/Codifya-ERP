'use client'

import { useState } from 'react'
import { Order, OrderStatus } from '../types'

interface OrderListProps {
  orders: Order[]
  onEdit: (order: Order) => void
  onDelete: (orderId: string) => void
  onViewHistory: (orderId: string) => void
  onUpdateStatus: (orderId: string, status: OrderStatus) => void
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800'
    case 'PROCESSING':
      return 'bg-purple-100 text-purple-800'
    case 'SHIPPED':
      return 'bg-indigo-100 text-indigo-800'
    case 'DELIVERED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return 'Beklemede'
    case 'CONFIRMED':
      return 'Onaylandı'
    case 'PROCESSING':
      return 'İşleniyor'
    case 'SHIPPED':
      return 'Kargoda'
    case 'DELIVERED':
      return 'Teslim Edildi'
    case 'CANCELLED':
      return 'İptal Edildi'
    default:
      return status
  }
}

export function OrderList({ orders, onEdit, onDelete, onViewHistory, onUpdateStatus }: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sipariş
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Müşteri
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tutar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Durum
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tarih
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                <div className="text-sm text-gray-500">{order.items.length} ürün</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{order.customer?.name || 'Bilinmeyen'}</div>
                <div className="text-sm text-gray-500">{order.customer?.email || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {order.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </div>
                {order.discount > 0 && (
                  <div className="text-sm text-green-600">
                    -{order.discount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} indirim
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(order.orderDate).toLocaleDateString('tr-TR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewHistory(order.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Geçmiş
                  </button>
                  <button
                    onClick={() => onEdit(order)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Düzenle
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Durum
                    </button>
                    {selectedOrder === order.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                        <div className="py-1">
                          {(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as OrderStatus[]).map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                onUpdateStatus(order.id, status)
                                setSelectedOrder(null)
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                order.status === status ? 'bg-gray-100 font-medium' : ''
                              }`}
                            >
                              {getStatusText(status)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onDelete(order.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Sil
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 