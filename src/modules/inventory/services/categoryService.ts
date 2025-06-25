import { prisma } from '@/lib/prisma'
import { CreateCategoryRequest, UpdateCategoryRequest, Category } from '../types'

export class CategoryService {
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    // Kategori adı benzersizlik kontrolü
    const existingCategory = await prisma.category.findFirst({
      where: { 
        name: data.name,
        parentId: data.parentId || null
      }
    })

    if (existingCategory) {
      throw new Error('Bu isimde bir kategori zaten mevcut')
    }

    // Parent kategori kontrolü
    if (data.parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: data.parentId }
      })

      if (!parentCategory) {
        throw new Error('Üst kategori bulunamadı')
      }
    }

    const category = await prisma.category.create({
      data,
      include: {
        parent: true,
        children: true
      }
    })

    return category
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          select: {
            id: true,
            name: true,
            sku: true
          }
        }
      }
    })

    if (!category) {
      throw new Error('Kategori bulunamadı')
    }

    return category
  }

  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
    // Kategori varlık kontrolü
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      throw new Error('Kategori bulunamadı')
    }

    // Parent kategori kontrolü (kendisini parent olarak seçemez)
    if (data.parentId === id) {
      throw new Error('Kategori kendisini üst kategori olarak seçemez')
    }

    // Parent kategori kontrolü
    if (data.parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: data.parentId }
      })

      if (!parentCategory) {
        throw new Error('Üst kategori bulunamadı')
      }
    }

    // Kategori adı benzersizlik kontrolü
    if (data.name && data.name !== existingCategory.name) {
      const nameExists = await prisma.category.findFirst({
        where: { 
          name: data.name,
          parentId: data.parentId || existingCategory.parentId,
          id: { not: id }
        }
      })

      if (nameExists) {
        throw new Error('Bu isimde bir kategori zaten mevcut')
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
        children: true
      }
    })

    return category
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true
      }
    })

    if (!category) {
      throw new Error('Kategori bulunamadı')
    }

    // Alt kategorileri varsa silme
    if (category.children.length > 0) {
      throw new Error('Bu kategorinin alt kategorileri var. Önce onları silin.')
    }

    // Ürünleri varsa silme
    if (category.products.length > 0) {
      throw new Error('Bu kategoride ürünler var. Önce ürünleri başka kategoriye taşıyın.')
    }

    await prisma.category.delete({
      where: { id }
    })

    return { message: 'Kategori başarıyla silindi' }
  }

  async getAllCategories(): Promise<Category[]> {
    return prisma.category.findMany({
      where: { isActive: true },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })
  }

  async getCategoryTree(): Promise<Category[]> {
    return prisma.category.findMany({
      where: { 
        isActive: true,
        parentId: null // Sadece ana kategoriler
      },
      include: {
        children: {
          where: { isActive: true },
          include: {
            children: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })
  }

  async getCategoriesWithProductCount(): Promise<Category[]> {
    return prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })
  }
} 