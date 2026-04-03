import request from './request';

export interface AdminLoginDTO {
  username: string;
  password: string;
}

export interface AdminLoginVO {
  token: string;
  userId: number;
  username: string;
  nickname: string;
  avatar: string;
  role: string;
}

/**
 * 管理员登录
 */
export const adminLogin = (data: AdminLoginDTO) => {
  return request.post<AdminLoginVO>('/admin/user/login', data);
};

/**
 * 获取当前管理员信息
 */
export const getAdminInfo = () => {
  return request.get<any>('/admin/user/info');
};

/**
 * 退出登录
 */
export const adminLogout = () => {
  return request.post<void>('/admin/user/logout');
};
