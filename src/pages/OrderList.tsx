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
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { Search, Eye, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [shippingOrderNo, setShippingOrderNo] = useState<string | null>(null);

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

  const handleShipClick = (orderNo: string) => {
    setShippingOrderNo(orderNo);
    setIsConfirmOpen(true);
  };

  const handleConfirmShip = () => {
    if (shippingOrderNo) {
      setOrders(orders.map(o => o.orderNo === shippingOrderNo ? { ...o, status: '已发货' } : o));
      toast.success('发货成功');
      setShippingOrderNo(null);
    }
  };

  const viewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f] font-display">订单管理</h1>
          <p className="text-[#86868b] mt-1">查看和处理您的客户订单</p>
        </div>
      </div>

      <div className="apple-card p-6 flex flex-col lg:flex-row gap-6 justify-between items-end lg:items-center">
        <form onSubmit={handleSearch} className="flex items-center gap-4 flex-1 w-full max-w-2xl">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#86868b]" />
            <Input 
              placeholder="搜索订单号或客户姓名..." 
              className="pl-12 bg-[#f5f5f7] border-none rounded-2xl py-6 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Button 
            type="submit" 
            variant="secondary"
            className="bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] rounded-2xl px-8 py-6 font-semibold transition-all"
          >
            搜索
          </Button>
        </form>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <span className="text-sm font-semibold text-[#1d1d1f] whitespace-nowrap">订单状态:</span>
          <Select 
            className="flex-1 lg:w-40"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="全部">全部</option>
            <option value="待发货">待发货</option>
            <option value="已发货">已发货</option>
            <option value="已完成">已完成</option>
            <option value="已取消">已取消</option>
          </Select>
        </div>
      </div>

      <div className="apple-card overflow-hidden">
        <Table>
          <TableHeader className="bg-[#f5f5f7]/50">
            <TableRow className="border-none">
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">订单号</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">客户姓名</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">联系电话</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">订单金额</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">状态</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">创建时间</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-[#86868b]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#0071e3]/30 border-t-[#0071e3] rounded-full animate-spin"></div>
                    <span>加载中...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-[#86868b]">暂无数据</TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.orderNo} className="border-b border-[#f5f5f7] hover:bg-[#f5f5f7]/30 transition-colors">
                  <TableCell className="font-bold text-[#1d1d1f] font-mono text-xs tracking-tighter">{order.orderNo}</TableCell>
                  <TableCell className="text-[#1d1d1f] font-medium">{order.customer}</TableCell>
                  <TableCell className="text-[#86868b]">{order.phone}</TableCell>
                  <TableCell className="font-bold text-[#1d1d1f] font-mono whitespace-nowrap">¥{order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === '已完成' ? 'bg-[#e3f9e5] text-[#1a7d32]' :
                      order.status === '已发货' ? 'bg-[#e1f0ff] text-[#0071e3]' :
                      order.status === '待发货' ? 'bg-[#fff4e5] text-[#b45309]' :
                      'bg-[#f5f5f7] text-[#86868b]'
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-[#86868b] text-xs">{order.createTime}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="hover:bg-blue-50 rounded-xl transition-colors" title="查看详情" onClick={() => viewDetails(order)}>
                        <Eye className="h-4 w-4 text-[#0071e3]" />
                      </Button>
                      {order.status === '待发货' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-emerald-50 rounded-xl transition-colors"
                          title="发货"
                          onClick={() => handleShipClick(order.orderNo)}
                        >
                          <Truck className="h-4 w-4 text-[#1a7d32]" />
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
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="bg-[#f5f5f7] p-4 rounded-2xl">
                <span className="text-[#86868b] block mb-1 font-semibold">订单号</span>
                <span className="font-bold text-[#1d1d1f] font-mono">{selectedOrder.orderNo}</span>
              </div>
              <div className="bg-[#f5f5f7] p-4 rounded-2xl">
                <span className="text-[#86868b] block mb-1 font-semibold">订单状态</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  selectedOrder.status === '已完成' ? 'bg-[#e3f9e5] text-[#1a7d32]' :
                  selectedOrder.status === '已发货' ? 'bg-[#e1f0ff] text-[#0071e3]' :
                  selectedOrder.status === '待发货' ? 'bg-[#fff4e5] text-[#b45309]' :
                  'bg-[#f5f5f7] text-[#86868b]'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="bg-[#f5f5f7] p-4 rounded-2xl">
                <span className="text-[#86868b] block mb-1 font-semibold">客户姓名</span>
                <span className="font-bold text-[#1d1d1f]">{selectedOrder.customer}</span>
              </div>
              <div className="bg-[#f5f5f7] p-4 rounded-2xl">
                <span className="text-[#86868b] block mb-1 font-semibold">联系电话</span>
                <span className="font-bold text-[#1d1d1f]">{selectedOrder.phone}</span>
              </div>
              <div className="bg-[#f5f5f7] p-4 rounded-2xl">
                <span className="text-[#86868b] block mb-1 font-semibold">创建时间</span>
                <span className="font-bold text-[#1d1d1f]">{selectedOrder.createTime}</span>
              </div>
              <div className="bg-[#f5f5f7] p-4 rounded-2xl">
                <span className="text-[#86868b] block mb-1 font-semibold">订单总额</span>
                <span className="font-bold text-[#1a7d32] text-xl">¥{selectedOrder.amount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="apple-card p-6 mt-4">
              <h4 className="text-sm font-bold text-[#1d1d1f] mb-4">商品清单</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-[#f5f5f7] last:border-0">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#1d1d1f]">示例商品 1</span>
                    <span className="text-xs text-[#86868b]">规格: 默认</span>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-[#86868b]">x1</span>
                    <span className="font-bold text-[#1d1d1f]">¥{selectedOrder.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button 
                type="button" 
                variant="outline" 
                className="rounded-2xl px-6 py-6 border-[#e8e8ed] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all"
                onClick={() => setIsModalOpen(false)}
              >
                关闭
              </Button>
              {selectedOrder.status === '待发货' && (
                <Button 
                  className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl px-8 py-6 font-bold shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98]"
                  onClick={() => {
                    handleShipClick(selectedOrder.orderNo);
                    setIsModalOpen(false);
                  }}
                >
                  确认发货
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmShip}
        title="确认发货"
        message={`确定要对订单 ${shippingOrderNo} 进行发货处理吗？`}
      />
    </motion.div>
  );
}
