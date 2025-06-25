'use client'

import { useState, useEffect } from 'react'
import { OrderStats } from '../types'

interface OrderDashboardProps {
  stats: OrderStats
}

export function OrderDashboard({ stats }: OrderDashboardProps) {
  return (
    <div className="space-y-6">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Toplam Sipariş</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Bekleyen</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pendingOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tamamlanan</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completedOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Toplam Gelir</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalRevenue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* En Çok Satan Ürünler */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            En Çok Satan Ürünler
          </h3>
          <div className="space-y-4">
            {stats.topProducts.map((topProduct, index) => (
              <div key={topProduct.product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {topProduct.product.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{topProduct.product.name}</div>
                    <div className="text-sm text-gray-500">{topProduct.product.sku}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {topProduct.totalQuantity} adet
                  </div>
                  <div className="text-sm text-gray-500">
                    {topProduct.totalRevenue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sipariş Büyüme Grafiği */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Sipariş Büyüme Grafiği (Son 6 Ay)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Sipariş Sayısı */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sipariş Sayısı</h4>
              <div className="flex items-end space-x-2 h-32">
                {stats.orderGrowth.map((growth, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${Math.max((growth.count / Math.max(...stats.orderGrowth.map(g => g.count))) * 100, 10)}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2 text-center">
                      {growth.month}
                    </div>
                    <div className="text-xs font-medium text-gray-900">
                      {growth.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gelir */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Gelir</h4>
              <div className="flex items-end space-x-2 h-32">
                {stats.orderGrowth.map((growth, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-500 rounded-t"
                      style={{ height: `${Math.max((growth.revenue / Math.max(...stats.orderGrowth.map(g => g.revenue))) * 100, 10)}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2 text-center">
                      {growth.month}
                    </div>
                    <div className="text-xs font-medium text-gray-900">
                      {growth.revenue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ortalama Sipariş Değeri */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Ortalama Sipariş Değeri
          </h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.averageOrderValue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Toplam {stats.totalOrders} siparişten ortalama
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 