import request from './request';

export interface ProductVO {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  stock: number;
  status: number;
  mainImage: string;
  createTime: string;
  updateTime: string;
}

export interface ProductQuery {
  page: number;
  pageSize: number;
  name?: string;
  categoryId?: number;
  status?: number;
}

export interface PageResult<T> {
  total: number;
  list: T[];
}

export const getProductPage = (params: ProductQuery) => {
  return request.get<PageResult<ProductVO>>('/admin/product/page', { params });
};

export const addProduct = (data: Partial<ProductVO>) => {
  return request.post('/admin/product', data);
};

export const updateProduct = (data: Partial<ProductVO>) => {
  return request.put('/admin/product', data);
};

export const deleteProduct = (id: number) => {
  return request.delete(`/admin/product/${id}`);
};

export const updateProductStatus = (id: number, status: number) => {
  return request.put(`/admin/product/status/${id}/${status}`);
};
