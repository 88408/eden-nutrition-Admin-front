import React, { useState } from 'react';
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
import { Plus, Play, Clock, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Data
const mockSeckills = [
  { id: 1, productId: 1, productName: '乳清蛋白粉 5磅', seckillPrice: 299.00, stock: 50, startTime: '2026-03-18T10:00', endTime: '2026-03-18T12:00', status: '未开始' },
  { id: 2, productId: 2, productName: '维生素C咀嚼片', seckillPrice: 49.00, stock: 100, startTime: '2026-03-17T08:00', endTime: '2026-03-17T20:00', status: '进行中' },
  { id: 3, productId: 3, productName: 'BCAA支链氨基酸', seckillPrice: 99.00, stock: 30, startTime: '2026-03-16T10:00', endTime: '2026-03-16T12:00', status: '已结束' },
];

export default function SeckillList() {
  const [seckills, setSeckills] = useState(mockSeckills);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    productId: '', 
    productName: '', 
    seckillPrice: '', 
    stock: '', 
    startTime: '', 
    endTime: '' 
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.seckillPrice || !formData.stock || !formData.startTime || !formData.endTime) {
      toast.error('请填写完整信息');
      return;
    }
    
    const newSeckill = {
      id: Date.now(),
      productId: Number(formData.productId),
      productName: `商品ID: ${formData.productId}`, // Mock name
      seckillPrice: Number(formData.seckillPrice),
      stock: Number(formData.stock),
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: '未开始'
    };
    
    setSeckills([newSeckill, ...seckills]);
    setIsModalOpen(false);
    setFormData({ productId: '', productName: '', seckillPrice: '', stock: '', startTime: '', endTime: '' });
    toast.success('创建成功');
  };

  const handlePublish = (id: number) => {
    if (window.confirm('确认发布该秒杀活动吗？')) {
      setSeckills(seckills.map(s => s.id === id ? { ...s, status: '进行中' } : s));
      toast.success('发布成功');
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('确定要删除该活动吗？')) {
      setSeckills(seckills.filter(s => s.id !== id));
      toast.success('删除成功');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">秒杀活动管理</h1>
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          创建活动
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>活动ID</TableHead>
              <TableHead>商品名称</TableHead>
              <TableHead>秒杀价</TableHead>
              <TableHead>活动库存</TableHead>
              <TableHead>开始时间</TableHead>
              <TableHead>结束时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seckills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">暂无数据</TableCell>
              </TableRow>
            ) : (
              seckills.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="text-red-600 font-medium">¥{item.seckillPrice.toFixed(2)}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell className="text-gray-500 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.startTime.replace('T', ' ')}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.endTime.replace('T', ' ')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === '进行中' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === '未开始' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === '未开始' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="发布"
                          onClick={() => handlePublish(item.id)}
                        >
                          <Play className="h-4 w-4 text-blue-600" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" title="编辑">
                        <Edit className="h-4 w-4 text-emerald-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="删除"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="创建秒杀活动"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">商品ID</label>
            <Input 
              type="number"
              required
              value={formData.productId}
              onChange={(e) => setFormData({...formData, productId: e.target.value})}
              placeholder="输入参与秒杀的商品ID"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">秒杀价格</label>
              <Input 
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.seckillPrice}
                onChange={(e) => setFormData({...formData, seckillPrice: e.target.value})}
                placeholder="¥ 0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">活动库存</label>
              <Input 
                type="number"
                min="1"
                required
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                placeholder="数量"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
            <Input 
              type="datetime-local"
              required
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
            <Input 
              type="datetime-local"
              required
              value={formData.endTime}
              onChange={(e) => setFormData({...formData, endTime: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
