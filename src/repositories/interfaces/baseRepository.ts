// src/repositories/interfaces/
export interface IBaseRepository<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>, Filters = any> {
    // Temel CRUD operasyonları
    create(data: CreateDTO): Promise<T>
    findById(id: string): Promise<T | null>
    update(id: string, data: UpdateDTO): Promise<T>
    delete(id: string): Promise<void>
    
    // Listeleme ve filtreleme
    findMany(filters?: Filters): Promise<T[]>
    findOne(filters: Filters): Promise<T | null>
    
    // Sayfalama
    findManyPaginated(filters?: Filters, page?: number, limit?: number): Promise<{
      data: T[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>
    
    // Varlık kontrolü
    exists(id: string): Promise<boolean>
    count(filters?: Filters): Promise<number>
    
    // Soft delete (eğer entity'de isActive field'ı varsa)
    softDelete(id: string): Promise<T>
    restore(id: string): Promise<T>
}