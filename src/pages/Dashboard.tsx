import React from 'react';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table"

const stats = [
  { name: '今日订单', value: '156', icon: ShoppingCart, change: '+12.5%', changeType: 'positive' },
  { name: '总销售额', value: '¥45,231', icon: DollarSign, change: '+8.2%', changeType: 'positive' },
  { name: '新增用户', value: '42', icon: Users, change: '-2.4%', changeType: 'negative' },
  { name: '转化率', value: '3.2%', icon: TrendingUp, change: '+1.1%', changeType: 'positive' },
];

const recentOrders = [
  { id: 'ORD-001', customer: '张三', product: '乳清蛋白粉 5磅', amount: '¥399.00', status: '已发货', date: '2026-03-17' },
  { id: 'ORD-002', customer: '李四', product: '维生素C咀嚼片', amount: '¥89.00', status: '待发货', date: '2026-03-17' },
  { id: 'ORD-003', customer: '王五', product: 'BCAA支链氨基酸', amount: '¥159.00', status: '已完成', date: '2026-03-16' },
  { id: 'ORD-004', customer: '赵六', product: '左旋肉碱胶囊', amount: '¥129.00', status: '已取消', date: '2026-03-16' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <item.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{item.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      item.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {item.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg leading-6 font-medium text-gray-900">最近订单</h3>
        </div>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>客户</TableHead>
                <TableHead>商品</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>日期</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === '已完成' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === '已发货' ? 'bg-blue-100 text-blue-800' :
                      order.status === '待发货' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500">{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
