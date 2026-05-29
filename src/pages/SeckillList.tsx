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
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { Plus, Play, Clock, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { getSeckillPage, addSeckill, updateSeckill, deleteSeckill, finishSeckill, SeckillVO } from '../api/seckill';

export default function SeckillList() {
  const [seckills, setSeckills] = useState<SeckillVO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'publish' | 'delete', id: number } | null>(null);
  const [formData, setFormData] = useState({ 
    productId: '', 
    productName: '', 
    seckillPrice: '', 
    stockCount: '',
    startTime: '',
    endTime: ''
  });

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const fetchData = async () => {
    try {
      const res = await getSeckillPage({ page: 1, pageSize: 100 });
      setSeckills(res.list || []);
    } catch (e) {
      toast.error('获取列表数据失败');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (seckill: SeckillVO) => {
    setEditingId(seckill.id);
    setFormData({
      productId: seckill.productId.toString(),
      productName: seckill.productName,
      seckillPrice: seckill.seckillPrice.toString(),
      stockCount: seckill.stockCount.toString(),
      startTime: seckill.startTime,
      endTime: seckill.endTime
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.seckillPrice || !formData.stockCount || !formData.startTime || !formData.endTime) {
      toast.error('请填写完整信息');
      return;
    }
    
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    if (start <= new Date()) {
      toast.error('开始时间必须晚于当前系统时间');
      return;
    }
    if (end <= start) {
      toast.error('结束时间必须晚于开始时间');
      return;
    }

    try {
      await updateSeckill({
        id: editingId!,
        productId: Number(formData.productId),
        seckillPrice: Number(formData.seckillPrice),
        stockCount: Number(formData.stockCount),
        limitPerUser: 1, // mock limit
        startTime: formatDateTime(formData.startTime),
        endTime: formatDateTime(formData.endTime),
      });
      
      setIsEditModalOpen(false);
      setFormData({ productId: '', productName: '', seckillPrice: '', stockCount: '', startTime: '', endTime: '' });
      setEditingId(null);
      toast.success('修改成功');
      fetchData();
    } catch (e) {
      toast.error('修改失败');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.seckillPrice || !formData.stockCount || !formData.startTime || !formData.endTime) {
      toast.error('请填写完整信息');
      return;
    }
    
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    if (start <= new Date()) {
      toast.error('开始时间必须晚于当前系统时间');
      return;
    }
    if (end <= start) {
      toast.error('结束时间必须晚于开始时间');
      return;
    }

    try {
      await addSeckill({
        productId: Number(formData.productId),
        seckillPrice: Number(formData.seckillPrice),
        stockCount: Number(formData.stockCount),
        limitPerUser: 1, // mock
        startTime: formatDateTime(formData.startTime),
        endTime: formatDateTime(formData.endTime),
      });
      
      setIsModalOpen(false);
      setFormData({ productId: '', productName: '', seckillPrice: '', stockCount: '', startTime: '', endTime: '' });
      toast.success('创建成功');
      fetchData();
    } catch (e) {
      toast.error('创建失败');
    }
  };

  const handlePublishClick = (id: number) => {
    setConfirmAction({ type: 'publish', id });
    setIsConfirmOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setConfirmAction({ type: 'delete', id });
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === 'publish') {
        await updateSeckill({ id: confirmAction.id, status: 1 }); // 1 normally means ongoing/published
        toast.success('发布成功');
      } else if (confirmAction.type === 'delete') {
        await deleteSeckill(confirmAction.id);
        toast.success('删除成功');
      }
      fetchData();
    } catch (e) {
      toast.error('操作失败');
    } finally {
      setConfirmAction(null);
      setIsConfirmOpen(false);
    }
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
          <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f] font-display">秒杀活动</h1>
          <p className="text-[#86868b] mt-1">创建和管理限时促销秒杀活动</p>
        </div>
        <Button 
          className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl px-6 py-6 font-semibold shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98]" 
          onClick={() => {
            setFormData({ productId: '', productName: '', seckillPrice: '', stockCount: '', startTime: '', endTime: '' });
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-5 w-5" />
          创建活动
        </Button>
      </div>

      <div className="apple-card overflow-hidden">
        <Table>
          <TableHeader className="bg-[#f5f5f7]/50">
            <TableRow className="border-none">
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">活动ID</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">商品名称</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">秒杀价</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">活动库存</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">开始时间</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">结束时间</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">状态</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seckills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-[#86868b]">暂无数据</TableCell>
              </TableRow>
            ) : (
              seckills.map((item) => (
                <TableRow key={item.id} className="border-b border-[#f5f5f7] hover:bg-[#f5f5f7]/30 transition-colors">
                  <TableCell className="text-[#86868b] font-mono text-xs">{item.id}</TableCell>
                  <TableCell className="font-semibold text-[#1d1d1f]">{item.productName}</TableCell>
                  <TableCell className="text-[#ff3b30] font-bold">¥{item.seckillPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-[#1d1d1f]">{item.stockCount}</TableCell>
                  <TableCell className="text-[#86868b] text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {item.startTime.replace('T', ' ')}
                    </div>
                  </TableCell>
                  <TableCell className="text-[#86868b] text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {item.endTime.replace('T', ' ')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === '进行中' ? 'bg-[#e3f9e5] text-[#1a7d32]' :
                      item.status === '未开始' ? 'bg-[#e1f0ff] text-[#0071e3]' :
                      'bg-[#f5f5f7] text-[#86868b]'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.status === '未开始' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:bg-blue-50 rounded-xl transition-colors"
                          title="发布"
                          onClick={() => handlePublishClick(item.id)}
                        >
                          <Play className="h-4 w-4 text-[#0071e3]" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-emerald-50 rounded-xl transition-colors" 
                        title="编辑"
                        onClick={() => handleEditClick(item)}
                      >
                        <Edit className="h-4 w-4 text-[#1a7d32]" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-red-50 rounded-xl transition-colors"
                        title="删除"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-[#ff3b30]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="编辑秒杀活动"
      >
        <form onSubmit={handleEdit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">商品ID</label>
              <Input 
                type="number"
                required
                value={formData.productId}
                onChange={(e) => setFormData({...formData, productId: e.target.value})}
                placeholder="输入参与秒杀的商品ID"
                className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">秒杀价格</label>
                <Input 
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.seckillPrice}
                  onChange={(e) => setFormData({...formData, seckillPrice: e.target.value})}
                  placeholder="¥ 0.00"
                  className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">活动库存</label>
                <Input 
                  type="number"
                  min="1"
                  required
                  value={formData.stockCount}
                  onChange={(e) => setFormData({...formData, stockCount: e.target.value})}
                  placeholder="数量"
                  className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">开始时间</label>
              <Input 
                type="datetime-local"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">结束时间</label>
              <Input 
                type="datetime-local"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-2xl px-6 py-6 border-[#e8e8ed] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all"
              onClick={() => setIsEditModalOpen(false)}
            >
              取消
            </Button>
            <Button 
              type="submit"
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl px-8 py-6 font-bold shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98]"
            >
              保存修改
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="创建秒杀活动"
      >
        <form onSubmit={handleAdd} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">商品ID</label>
              <Input 
                type="number"
                required
                value={formData.productId}
                onChange={(e) => setFormData({...formData, productId: e.target.value})}
                placeholder="输入参与秒杀的商品ID"
                className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">秒杀价格</label>
                <Input 
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.seckillPrice}
                  onChange={(e) => setFormData({...formData, seckillPrice: e.target.value})}
                  placeholder="¥ 0.00"
                  className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">活动库存</label>
                <Input 
                  type="number"
                  min="1"
                  required
                  value={formData.stockCount}
                  onChange={(e) => setFormData({...formData, stockCount: e.target.value})}
                  placeholder="数量"
                  className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">开始时间</label>
              <Input 
                type="datetime-local"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">结束时间</label>
              <Input 
                type="datetime-local"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-2xl px-6 py-6 border-[#e8e8ed] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all"
              onClick={() => setIsModalOpen(false)}
            >
              取消
            </Button>
            <Button 
              type="submit"
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl px-8 py-6 font-bold shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98]"
            >
              保存活动
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title={confirmAction?.type === 'publish' ? "发布活动" : "删除活动"}
        message={confirmAction?.type === 'publish' ? "确定要发布该秒杀活动吗？" : "确定要删除该活动吗？此操作不可恢复。"}
      />
    </motion.div>
  );
}
