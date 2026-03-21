export const mockCategories = [
  { id: 1, name: '运动营养', parentId: 0, sortOrder: 1, icon: 'dumbbell' },
  { id: 2, name: '蛋白粉', parentId: 1, sortOrder: 1, icon: '' },
  { id: 3, name: '氨基酸', parentId: 1, sortOrder: 2, icon: '' },
  { id: 4, name: '基础营养', parentId: 0, sortOrder: 2, icon: 'pill' },
  { id: 5, name: '维生素', parentId: 4, sortOrder: 1, icon: '' },
  { id: 6, name: '矿物质', parentId: 4, sortOrder: 2, icon: '' },
  { id: 7, name: '体重管理', parentId: 0, sortOrder: 3, icon: 'scale' },
  // { id: 7, name: '体重管理', parentId: 0, sortOrder: 3, icon: 'scale' },
];

export const salesTrendData = [
  { name: '周一', sales: 4000, orders: 240 },
  { name: '周二', sales: 3000, orders: 198 },
  { name: '周三', sales: 2000, orders: 150 },
  { name: '周四', sales: 2780, orders: 210 },
  { name: '周五', sales: 1890, orders: 140 },
  { name: '周六', sales: 2390, orders: 180 },
  { name: '周日', sales: 3490, orders: 250 },
];

export const categoryDistributionData = [
  { name: '运动营养', value: 400 },
  { name: '基础营养', value: 300 },
  { name: '体重管理', value: 300 },
  { name: '健康零食', value: 200 },
];
