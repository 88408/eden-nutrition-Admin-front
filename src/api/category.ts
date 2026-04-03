import request from './request';

export interface CategoryTreeVO {
  id: number;
  name: string;
  parentId: number;
  level: number;
  sort: number;
  status: number;
  children: CategoryTreeVO[];
}

export const getCategoryTree = () => {
  return request.get<CategoryTreeVO[]>('/admin/category/tree');
};

export const addCategory = (data: Omit<CategoryTreeVO, 'id' | 'children'>) => request.post('/admin/category', data);
export const updateCategory = (data: Partial<CategoryTreeVO>) => request.put('/admin/category', data);
export const deleteCategory = (id: number) => request.delete(`/admin/category/${id}`);
export const updateCategoryStatus = (id: number, status: number) => request.put(`/admin/category/status/${id}/${status}`);
