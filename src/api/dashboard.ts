import request from './request';

export interface DashboardStatItem {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

export interface SalesRevenue {
  date: string; // or Date
  revenue: number;
}

export const getDashboardStats = () => {
  return request.get<DashboardStatItem[]>('/admin/dashboard/stats');
};

export const getSalesRevenue = (days: number = 7) => {
  return request.get<SalesRevenue[]>('/admin/dashboard/sales', { params: { days } });
};

