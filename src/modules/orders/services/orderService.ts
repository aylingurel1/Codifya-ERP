import { prisma } from "@/lib/prisma";
import {
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderFilters,
  OrderListResponse,
  OrderStatus,
  OrderItem,
  OrderStats,
  OrderHistory,
} from "../types";
import { logger } from "@/utils/logger";
import { Order, Customer, User, Product } from "@/types";

// Prisma'dan dönen veriyi User tipine uygun şekilde map'le
function mapUser(user: any): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: "",
    role: "USER",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Prisma'dan dönen veriyi Customer tipine uygun şekilde map'le
function mapCustomer(prismaCustomer: any): Customer {
  return {
    id: prismaCustomer.id,
    name: prismaCustomer.name,
    email: prismaCustomer.email,
    phone: prismaCustomer.phone,
    address: prismaCustomer.address,
    company: prismaCustomer.company,
    taxNumber: prismaCustomer.taxNumber,
    isActive: prismaCustomer.isActive,
    createdAt: prismaCustomer.createdAt,
    updatedAt: prismaCustomer.updatedAt,
    createdBy: prismaCustomer.createdBy,
    createdByUser: prismaCustomer.createdByUser
      ? mapUser(prismaCustomer.createdByUser)
      : undefined,
    orders: [],
    invoices: [],
  };
}

// Prisma'dan dönen veriyi Product tipine uygun şekilde map'le
function mapProduct(prismaProduct: any): Product {
  return {
    id: prismaProduct.id,
    name: prismaProduct.name,
    description: prismaProduct.description || undefined,
    sku: prismaProduct.sku,
    price: prismaProduct.price,
    cost: prismaProduct.cost,
    stock: prismaProduct.stock,
    minStock: prismaProduct.minStock,
    category: prismaProduct.category || null,
    isActive: prismaProduct.isActive,
    createdAt: prismaProduct.createdAt,
    updatedAt: prismaProduct.updatedAt,
    createdBy: prismaProduct.createdBy,
    createdByUser: prismaProduct.createdByUser
      ? mapUser(prismaProduct.createdByUser)
      : undefined,
  };
}

// Prisma'dan dönen veriyi Order tipine uygun şekilde map'le
function mapOrder(prismaOrder: any): Order {
  return {
    id: prismaOrder.id,
    orderNumber: prismaOrder.orderNumber,
    customerId: prismaOrder.customerId,
    customer: prismaOrder.customer
      ? mapCustomer(prismaOrder.customer)
      : undefined,
    status: prismaOrder.status,
    totalAmount: prismaOrder.totalAmount,
    taxAmount: prismaOrder.taxAmount,
    discount: prismaOrder.discount,
    notes: prismaOrder.notes,
    orderDate: prismaOrder.orderDate,
    createdAt: prismaOrder.createdAt,
    updatedAt: prismaOrder.updatedAt,
    createdBy: prismaOrder.createdBy,
    createdByUser: prismaOrder.createdByUser
      ? mapUser(prismaOrder.createdByUser)
      : undefined,
    items: prismaOrder.items || [],
    payments: prismaOrder.payments || [],
    invoices: prismaOrder.invoices || [],
  };
}

export class OrderService {
  // Sipariş oluşturma
  async createOrder(data: CreateOrderRequest, createdBy: string) {
    // Müşteri kontrolü
    const customer = await prisma.customer.findUnique({
      where: { id: data.customerId },
    });
    if (!customer) throw new Error("Müşteri bulunamadı");

    // Ürün kontrolü ve toplam hesaplama
    let totalAmount = 0;
    let taxAmount = 0;
    const items: {
      productId: string;
      quantity: number;
      price: number;
      total: number;
    }[] = [];
    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) throw new Error("Ürün bulunamadı");
      if (!product.isActive) throw new Error("Ürün aktif değil");
      if (product.stock < item.quantity)
        throw new Error("Yetersiz stok: " + product.name);
      const price = product.price;
      const total = price * item.quantity;
      totalAmount += total;
      // Basit vergi: %18
      taxAmount += total * 0.18;
      items.push({
        productId: product.id,
        quantity: item.quantity,
        price,
        total,
      });
    }
    // İndirim
    const discount = data.discount || 0;
    totalAmount = totalAmount - discount;
    if (totalAmount < 0) totalAmount = 0;

    // Sipariş numarası üret
    const orderNumber = "ORD-" + Date.now();

    // Transaction ile sipariş ve stok güncelle
    const order = await prisma.$transaction(async (tx) => {
      // Sipariş oluştur
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: data.customerId,
          status: "PENDING",
          totalAmount,
          taxAmount,
          discount,
          notes: data.notes,
          orderDate: new Date(),
          createdBy,
          items: {
            create: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              price: i.price,
              total: i.total,
            })),
          },
        },
        include: {
          items: true,
          customer: {
            include: {
              createdByUser: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payments: true,
        },
      });
      // Stok güncelle
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      return createdOrder;
    });

    logger.info("Sipariş oluşturuldu", {
      orderId: order.id,
      orderNumber: order.orderNumber,
      createdBy,
    });
    return mapOrder(order);
  }

  // Sipariş güncelleme
  async updateOrder(id: string, data: UpdateOrderRequest) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new Error("Sipariş bulunamadı");
    // Sadece not, müşteri, indirim ve durum güncellenebilir
    const updated = await prisma.order.update({
      where: { id },
      data: {
        customerId: data.customerId,
        notes: data.notes,
        discount: data.discount,
        status: data.status,
      },
      include: {
        items: true,
        customer: {
          include: {
            createdByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: true,
      },
    });

    logger.info("Sipariş güncellendi", { orderId: id });
    return mapOrder(updated);
  }

  // Sipariş silme
  async deleteOrder(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new Error("Sipariş bulunamadı");
    // Sipariş silinince stok geri eklenir
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      await tx.order.delete({ where: { id } });
    });

    logger.info("Sipariş silindi", { orderId: id });
    return { message: "Sipariş silindi" };
  }

  // Sipariş listeleme/filtreleme
  async getOrders(filters: OrderFilters): Promise<OrderListResponse> {
    const {
      search,
      customerId,
      status,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
    } = filters;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;
    if (dateFrom) where.orderDate = { gte: new Date(dateFrom) };
    if (dateTo) where.orderDate = { ...where.orderDate, lte: new Date(dateTo) };
    const total = await prisma.order.count({ where });
    const rawOrders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        customer: {
          include: {
            createdByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const orders = rawOrders.map(mapOrder);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Sipariş detayı
  async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        customer: {
          include: {
            createdByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: true,
      },
    });
    if (!order) throw new Error("Sipariş bulunamadı");
    return mapOrder(order);
  }

  // Sipariş durumunu güncelle
  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new Error("Sipariş bulunamadı");
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
        customer: {
          include: {
            createdByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: true,
      },
    });

    logger.info("Sipariş durumu güncellendi", { orderId: id, status });
    return mapOrder(updated);
  }

  // Siparişe ürün ekle (ekstra endpoint için)
  async addOrderItem(orderId: string, productId: string, quantity: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new Error("Sipariş bulunamadı");
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new Error("Ürün bulunamadı");
    if (product.stock < quantity) throw new Error("Yetersiz stok");
    const price = product.price;
    const total = price * quantity;
    // Siparişe ürün ekle
    const item = await prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
        price,
        total,
      },
    });
    // Stok güncelle
    await prisma.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } },
    });
    // Sipariş toplamını güncelle
    await this.recalculateOrderTotals(orderId);
    return item;
  }

  // Siparişten ürün çıkar (ekstra endpoint için)
  async removeOrderItem(orderItemId: string) {
    const item = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
    });
    if (!item) throw new Error("Sipariş ürünü bulunamadı");
    // Stok geri ekle
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
    // Ürünü sil
    await prisma.orderItem.delete({ where: { id: orderItemId } });
    // Sipariş toplamını güncelle
    await this.recalculateOrderTotals(item.orderId);
    return { message: "Sipariş ürünü silindi" };
  }

  // Sipariş toplamını yeniden hesapla
  async recalculateOrderTotals(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) return;
    let totalAmount = 0;
    let taxAmount = 0;
    for (const item of order.items) {
      totalAmount += item.total;
      taxAmount += item.total * 0.18;
    }
    totalAmount = totalAmount - (order.discount || 0);
    if (totalAmount < 0) totalAmount = 0;
    await prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount,
        taxAmount,
      },
    });
  }

  // Sipariş istatistikleri
  async getOrderStats(): Promise<OrderStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Toplam sipariş sayısı
    const totalOrders = await prisma.order.count();

    // Durum bazında sipariş sayıları
    const pendingOrders = await prisma.order.count({
      where: { status: "PENDING" },
    });

    const completedOrders = await prisma.order.count({
      where: { status: "DELIVERED" },
    });

    const cancelledOrders = await prisma.order.count({
      where: { status: "CANCELLED" },
    });

    // Toplam gelir
    const revenueResult = await prisma.order.aggregate({
      where: { status: "DELIVERED" },
      _sum: { totalAmount: true },
    });
    const totalRevenue = revenueResult._sum.totalAmount || 0;

    // Ortalama sipariş değeri
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // En çok satılan ürünler
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
        total: true,
      },
      orderBy: {
        _sum: {
          total: "desc",
        },
      },
      take: 5,
    });

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: {
            category: true,
          },
        });
        return {
          product: product ? mapProduct(product) : undefined,
          totalQuantity: item._sum.quantity || 0,
          totalRevenue: item._sum.total || 0,
        };
      })
    );

    // Sipariş büyüme grafiği (son 6 ay)
    const orderGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const count = await prisma.order.count({
        where: {
          orderDate: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      const revenue = await prisma.order.aggregate({
        where: {
          orderDate: {
            gte: monthStart,
            lte: monthEnd,
          },
          status: "DELIVERED",
        },
        _sum: { totalAmount: true },
      });

      orderGrowth.push({
        month: monthStart.toLocaleDateString("tr-TR", {
          month: "short",
          year: "numeric",
        }),
        count,
        revenue: revenue._sum.totalAmount || 0,
      });
    }

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      averageOrderValue,
      topProducts: topProductsWithDetails,
      orderGrowth,
    };
  }

  // Sipariş geçmişi
  async getOrderHistory(orderId: string): Promise<OrderHistory> {
    const rawOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        customer: {
          include: {
            createdByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: true,
      },
    });

    if (!rawOrder) {
      throw new Error("Sipariş bulunamadı");
    }

    const order = mapOrder(rawOrder);

    // Basit status history (gerçek uygulamada ayrı bir tablo olabilir)
    const statusHistory = [
      {
        status: order.status as OrderStatus,
        changedAt: order.updatedAt,
        changedBy: order.createdByUser,
      },
    ];

    return {
      order,
      statusHistory,
      paymentHistory: order.payments,
    };
  }
}
