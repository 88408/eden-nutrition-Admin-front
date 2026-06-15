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
  return request.delete('/admin/product', { params: { id } });
};

/**
 * 切换商品上下架状态。
 * 后端接口只接收商品 ID 和目标状态两个路径参数，不能携带请求体，否则会命中错误的接口契约。
 */
export const updateProductStatus = (id: number, status: number) => {
  return request.put(`/admin/product/status/${id}/${status}`);
};
