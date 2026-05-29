import request from './request';

// 1. 类型抽取 (完全对齐后端的 AdminSeckillVO)
export interface SeckillVO {
  id: number;
  productId: number;
  productName: string;
  productMainImage: string;
  seckillPrice: number;
  stockCount: number;
  limitPerUser: number;
  status: number;
  startTime: string;
  endTime: string;
}

export interface PageResult<T> {
  total: number;
  pages: number;
  list: T[];
}

export interface SeckillQuery {
  page?: number;
  pageSize?: number;
  productId?: number;
  status?: number;
}

// 2. 接口封装 (全面对齐 ADMIN_API_DOCUMENTATION.md)
export const getSeckillPage = (params: SeckillQuery) =>
  request.get<any, PageResult<SeckillVO>>('/admin/seckill/page', { params });

export const getSeckillDetail = (id: number) =>
  request.get<any, SeckillVO>(`/admin/seckill/${id}`);

export const addSeckill = (data: Partial<SeckillVO>) =>
  request.post<any, void>('/admin/seckill', data);

export const updateSeckill = (data: Partial<SeckillVO>) =>
  request.put<any, void>('/admin/seckill', data);

export const deleteSeckill = (id: number) =>
  request.delete<any, void>(`/admin/seckill/${id}`);

export const finishSeckill = (id: number) =>
  request.put<any, void>(`/admin/seckill/finish/${id}`);
