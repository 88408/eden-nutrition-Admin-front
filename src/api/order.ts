import request from './request';

export interface OrderQueryDTO {
  page: number;
  pageSize: number;
  orderNo?: string;
  status?: number;
}

export const getOrderPage = (params: OrderQueryDTO) => {
  return request.get<any>('/admin/order/list', { params });
};

export const getOrderDetail = (id: number) => {
  return request.get<any>(`/admin/order/${id}`);
};

export const deliverOrder = (data: { orderId: number; trackingNo: string; trackingCompany?: string }) => {
  return request.post<void>('/admin/order/deliver', data);
};
