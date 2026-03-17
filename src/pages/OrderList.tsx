import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Search, Eye, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Data
const mockOrders = [
  { orderNo: 'ORD-20260317-001', customer: '张三', phone: '13800138000', amount: 399.00, status: '已发货', createTime: '2026-03-17 10:00:00' },
  { orderNo: 'ORD-20260317-002', customer: '李四', phone: '13900139000', amount: 89.00, status: '待发货', createTime: '2026-03-17 11:30:00' },
  { orderNo: 'ORD-20260316-003', customer: '王五', phone: '13700137000', amount: 159.00, status: '已完成', createTime: '2026-03-16 14:20:00' },
  { orderNo: 'ORD-20260316-004', customer: '赵六', phone: '13600136000', amount: 129.00, status: '已取消', createTime: '2026-03-16 16:45:00' },
];

export default function OrderList() {
  const [orders, setOrders] = useState(mockOrders);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = mockOrders.filter(o => o.orderNo.includes(keyword) || o.customer.includes(keyword));
      if (statusFilter !== '全部') {
        filtered = filtered.filter(o => o.status === statusFilter);
      }
      setOrders(filtered);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleShip = (orderNo: string) => {
    if (window.confirm(`确认发货订单 ${orderNo} 吗？`)) {
      setOrders(orders.map(o => o.orderNo === orderNo ? { ...o, status: '已发货' } : o));
      toast.success('发货成功');
    }
  };

  const viewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
        <form onSubmit={handleSearch} className="flex items-center gap-4 flex-1 max-w-md">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="搜索订单号或客户姓名..." 
              className="pl-9"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">搜索</Button>
        </form>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">订单状态:</span>
          <select 
            className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="全部">全部</option>
            <option value="待发货">待发货</option>
            <option value="已发货">已发货</option>
            <option value="已完成">已完成</option>
            <option value="已取消">已取消</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>订单号</TableHead>
              <TableHead>客户姓名</TableHead>
              <TableHead>联系电话</TableHead>
              <TableHead>订单金额</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">加载中...</TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">暂无数据</TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.orderNo}>
                  <TableCell className="font-medium">{order.orderNo}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>¥{order.amount.toFixed(2)}</TableCell>
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
                  <TableCell className="text-gray-500">{order.createTime}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" title="查看详情" onClick={() => viewDetails(order)}>
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      {order.status === '待发货' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="发货"
                          onClick={() => handleShip(order.orderNo)}
                        >
                          <Truck className="h-4 w-4 text-emerald-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="订单详情"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block mb-1">订单号</span>
                <span className="font-medium text-gray-900">{selectedOrder.orderNo}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">订单状态</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedOrder.status === '已完成' ? 'bg-emerald-100 text-emerald-800' :
                  selectedOrder.status === '已发货' ? 'bg-blue-100 text-blue-800' :
                  selectedOrder.status === '待发货' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">客户姓名</span>
                <span className="font-medium text-gray-900">{selectedOrder.customer}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">联系电话</span>
                <span className="font-medium text-gray-900">{selectedOrder.phone}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">创建时间</span>
                <span className="font-medium text-gray-900">{selectedOrder.createTime}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">订单总额</span>
                <span className="font-medium text-emerald-600 text-lg">¥{selectedOrder.amount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">商品清单</h4>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                  <span>示例商品 1</span>
                  <span>x1</span>
                  <span className="font-medium text-gray-900">¥{selectedOrder.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>关闭</Button>
              {selectedOrder.status === '待发货' && (
                <Button onClick={() => {
                  handleShip(selectedOrder.orderNo);
                  setIsModalOpen(false);
                }}>确认发货</Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
