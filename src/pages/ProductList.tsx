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
import { Checkbox } from '../components/ui/Checkbox';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { Search, Plus, Edit, Trash2, Eye, ArrowUpCircle, ArrowDownCircle, Upload, X as CloseIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockCategories } from '../data/mock';
import { motion, AnimatePresence } from 'motion/react';

// Mock Data
const mockProducts = [
  { 
    id: 1, 
    name: '乳清蛋白粉 5磅', 
    price: 399.00, 
    stock: 150, 
    status: 1, 
    category: '运动营养',
    description: '高品质乳清蛋白，每份含有24克蛋白质，低糖低脂，助力肌肉恢复与生长。',
    specs: [
      { label: '规格', value: '5磅 (约2.27kg)' },
      { label: '口味', value: '巧克力味' },
      { label: '保质期', value: '24个月' },
      { label: '产地', value: '美国' }
    ],
    image: 'https://picsum.photos/seed/protein/800/800'
  },
  { 
    id: 2, 
    name: '维生素C咀嚼片', 
    price: 89.00, 
    stock: 500, 
    status: 1, 
    category: '基础营养',
    description: '天然萃取维生素C，增强免疫力，抗氧化，口感酸甜，全家适用。',
    specs: [
      { label: '规格', value: '100片/瓶' },
      { label: '含量', value: '500mg/片' },
      { label: '建议用量', value: '每日1片' }
    ],
    image: 'https://picsum.photos/seed/vitaminc/800/800'
  },
  { 
    id: 3, 
    name: 'BCAA支链氨基酸', 
    price: 159.00, 
    stock: 200, 
    status: 0, 
    category: '运动营养',
    description: '2:1:1黄金比例，减少运动中肌肉分解，缓解疲劳，提升运动表现。',
    specs: [
      { label: '规格', value: '300g/罐' },
      { label: '比例', value: '2:1:1' },
      { label: '口味', value: '柠檬味' }
    ],
    image: 'https://picsum.photos/seed/bcaa/800/800'
  },
  { 
    id: 4, 
    name: '左旋肉碱胶囊', 
    price: 129.00, 
    stock: 300, 
    status: 1, 
    category: '体重管理',
    description: '高纯度左旋肉碱，加速脂肪代谢，配合运动效果更佳。',
    specs: [
      { label: '规格', value: '60粒/瓶' },
      { label: '含量', value: '500mg/粒' }
    ],
    image: 'https://picsum.photos/seed/carnitine/800/800'
  },
];

export default function ProductList() {
  const [products, setProducts] = useState(mockProducts);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBatchEditModalOpen, setIsBatchEditModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [batchAction, setBatchAction] = useState<'delete' | 'online' | 'offline' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 1,
    image: ''
  });

  const [batchEditData, setBatchEditData] = useState({
    category: '',
    price: '',
    stock: '',
    updateCategory: false,
    updatePrice: false,
    updateStock: false
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('图片大小不能超过 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: '' });
  };

  const fetchProducts = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = mockProducts.filter(p => p.name.includes(keyword));
      setProducts(filtered);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const toggleStatus = (id: number, currentStatus: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: currentStatus === 1 ? 0 : 1 } : p));
    toast.success(currentStatus === 1 ? '已下架' : '已上架');
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setBatchAction(null);
    setIsConfirmOpen(true);
  };

  const handleBatchDeleteClick = () => {
    if (selectedIds.length === 0) return;
    setBatchAction('delete');
    setDeletingId(null);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (batchAction === 'delete') {
      setProducts(products.filter(p => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      toast.success(`成功删除 ${selectedIds.length} 个商品`);
    } else if (deletingId !== null) {
      setProducts(products.filter(p => p.id !== deletingId));
      setSelectedIds(selectedIds.filter(id => id !== deletingId));
      toast.success('删除成功');
    }
    setDeletingId(null);
    setBatchAction(null);
  };

  const handleBatchStatusChange = (status: number) => {
    if (selectedIds.length === 0) return;
    setProducts(products.map(p => selectedIds.includes(p.id) ? { ...p, status } : p));
    toast.success(`成功${status === 1 ? '上架' : '下架'} ${selectedIds.length} 个商品`);
    setSelectedIds([]);
  };

  const handleBatchEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchEditData.updateCategory && !batchEditData.updatePrice && !batchEditData.updateStock) {
      toast.error('请至少选择一个要修改的项目');
      return;
    }

    setProducts(products.map(p => {
      if (selectedIds.includes(p.id)) {
        return {
          ...p,
          category: batchEditData.updateCategory ? batchEditData.category : p.category,
          price: batchEditData.updatePrice ? Number(batchEditData.price) : p.price,
          stock: batchEditData.updateStock ? Number(batchEditData.stock) : p.stock,
        };
      }
      return p;
    }));

    toast.success(`成功批量修改 ${selectedIds.length} 个商品`);
    setIsBatchEditModalOpen(false);
    setSelectedIds([]);
    setBatchEditData({
      category: '',
      price: '',
      stock: '',
      updateCategory: false,
      updatePrice: false,
      updateStock: false
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(products.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(i => i !== id));
    }
  };

  const handleEditClick = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status,
      image: product.image
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast.error('请填写完整信息');
      return;
    }
    setProducts(products.map(p => p.id === editingId ? {
      ...p,
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      status: Number(formData.status),
      image: formData.image
    } : p));
    setIsEditModalOpen(false);
    setFormData({ name: '', category: '', price: '', stock: '', status: 1, image: '' });
    setEditingId(null);
    toast.success('修改成功');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast.error('请填写完整信息');
      return;
    }
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      status: Number(formData.status),
      image: formData.image || 'https://picsum.photos/seed/newproduct/800/800',
      description: '新添加的商品描述。',
      specs: [
        { label: '规格', value: '默认规格' }
      ]
    };
    setProducts([newProduct, ...products]);
    setIsModalOpen(false);
    setFormData({ name: '', category: '', price: '', stock: '', status: 1, image: '' });
    toast.success('添加成功');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-24 relative"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f] font-display">商品管理</h1>
          <p className="text-[#86868b] mt-1">管理您的商品目录、库存和状态</p>
        </div>
          <Button 
            className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl px-6 py-6 font-semibold shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98]" 
            onClick={() => {
              setFormData({ name: '', category: '', price: '', stock: '', status: 1, image: '' });
              setIsModalOpen(true);
            }}
          >
            <Plus className="h-5 w-5" />
            添加商品
          </Button>
      </div>

      <div className="apple-card p-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#86868b]" />
            <Input 
              placeholder="搜索商品名称..." 
              className="pl-12 bg-[#f5f5f7] border-none rounded-2xl py-6 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Button 
            type="submit" 
            variant="secondary"
            className="w-full sm:w-auto bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] rounded-2xl px-8 py-6 font-semibold transition-all"
          >
            搜索
          </Button>
        </form>
      </div>

      <div className="apple-card overflow-hidden">
        <Table>
          <TableHeader className="bg-[#f5f5f7]/50">
            <TableRow className="border-none">
              <TableHead className="w-12 py-4">
                <Checkbox 
                  checked={selectedIds.length === products.length && products.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">ID</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">商品名称</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">分类</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">价格</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">库存</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">状态</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-[#86868b]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#0071e3]/30 border-t-[#0071e3] rounded-full animate-spin"></div>
                    <span>加载中...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-[#86868b]">暂无数据</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="border-b border-[#f5f5f7] hover:bg-[#f5f5f7]/30 transition-colors">
                  <TableCell className="w-12">
                    <Checkbox 
                      checked={selectedIds.includes(product.id)}
                      onChange={(e) => handleSelectItem(product.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell className="text-[#86868b] font-mono text-xs tracking-tighter">{product.id}</TableCell>
                  <TableCell className="font-bold text-[#1d1d1f]">{product.name}</TableCell>
                  <TableCell>
                    <span className="px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] rounded-lg text-xs font-semibold">
                      {product.category}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-[#1d1d1f] font-mono whitespace-nowrap">¥{product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-[#86868b] font-mono text-xs">{product.stock}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      product.status === 1 
                        ? 'bg-[#e3f9e5] text-[#1a7d32]' 
                        : 'bg-[#f5f5f7] text-[#86868b]'
                    }`}>
                      {product.status === 1 ? '上架中' : '已下架'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-blue-50 rounded-xl transition-colors" 
                        title="查看详情"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 text-[#0071e3]" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-emerald-50 rounded-xl transition-colors" 
                        title="编辑"
                        onClick={() => handleEditClick(product)}
                      >
                        <Edit className="h-4 w-4 text-[#1a7d32]" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="hover:bg-[#f5f5f7] rounded-xl px-3 transition-colors text-xs font-bold text-[#1d1d1f]"
                        onClick={() => toggleStatus(product.id, product.status)}
                      >
                        {product.status === 1 ? '下架' : '上架'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-red-50 rounded-xl transition-colors"
                        title="删除"
                        onClick={() => handleDeleteClick(product.id)}
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

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="bg-[#1d1d1f] text-white px-8 py-4 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center gap-8">
              <div className="flex items-center gap-3 pr-8 border-r border-white/10">
                <span className="text-sm font-semibold">已选择 {selectedIds.length} 项</span>
                <Button 
                  variant="ghost" 
                  className="text-white/60 hover:text-white hover:bg-white/10 rounded-xl px-3 py-1 h-auto text-xs"
                  onClick={() => setSelectedIds([])}
                >
                  取消选择
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 rounded-xl gap-2 px-4"
                  onClick={() => setIsBatchEditModalOpen(true)}
                >
                  <Edit className="h-5 w-5 text-blue-400" />
                  批量编辑
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 rounded-xl gap-2 px-4"
                  onClick={() => handleBatchStatusChange(1)}
                >
                  <ArrowUpCircle className="h-5 w-5 text-[#30d158]" />
                  批量上架
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 rounded-xl gap-2 px-4"
                  onClick={() => handleBatchStatusChange(0)}
                >
                  <ArrowDownCircle className="h-5 w-5 text-[#ff9f0a]" />
                  批量下架
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-[#ff453a] hover:bg-[#ff453a]/10 rounded-xl gap-2 px-4"
                  onClick={handleBatchDeleteClick}
                >
                  <Trash2 className="h-5 w-5" />
                  批量删除
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="商品详情"
        className="max-w-5xl"
      >
        {selectedProduct && (
          <div className="space-y-10 pt-4">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="w-full lg:w-2/5">
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-[#f5f5f7] border border-black/[0.03] shadow-inner">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="mt-6 flex items-center justify-between px-2">
                  <span className="text-xs font-mono text-[#86868b]">Product ID: {selectedProduct.id}</span>
                  <span className="text-xs font-medium text-[#86868b]">最后更新: 2024-03-20</span>
                </div>
              </div>

              <div className="flex-1 space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] rounded-lg text-xs font-bold tracking-tight">
                      {selectedProduct.category}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      selectedProduct.status === 1 
                        ? 'bg-[#e3f9e5] text-[#1a7d32]' 
                        : 'bg-[#f5f5f7] text-[#86868b]'
                    }`}>
                      {selectedProduct.status === 1 ? '上架中' : '已下架'}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-[#1d1d1f] font-display tracking-tight leading-tight">{selectedProduct.name}</h3>
                  <p className="text-[#86868b] mt-4 text-base leading-relaxed font-medium">{selectedProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#f5f5f7] p-6 rounded-3xl overflow-hidden group hover:bg-[#f2f2f7] transition-colors">
                    <span className="text-[#86868b] block text-xs font-bold uppercase tracking-wider mb-2">零售价格</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-[#1d1d1f]">¥</span>
                      <span className="text-3xl font-bold text-[#1d1d1f] font-mono break-all tracking-tighter">{selectedProduct.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="bg-[#f5f5f7] p-6 rounded-3xl overflow-hidden group hover:bg-[#f2f2f7] transition-colors">
                    <span className="text-[#86868b] block text-xs font-bold uppercase tracking-wider mb-2">当前库存</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-[#1d1d1f] font-mono truncate tracking-tighter">{selectedProduct.stock}</span>
                      <span className="text-sm font-bold text-[#86868b]">件</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f5f5f7]/50 p-8 rounded-[2rem] border border-black/[0.02]">
                  <h4 className="text-sm font-bold text-[#1d1d1f] mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#0071e3] rounded-full" />
                    技术规格
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                    {selectedProduct.specs?.map((spec: any, idx: number) => (
                      <div key={idx} className="flex flex-col py-3 border-b border-black/[0.03]">
                        <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">{spec.label}</span>
                        <span className="font-semibold text-[#1d1d1f] text-sm">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-[#f5f5f7]">
              <Button 
                className="bg-[#1d1d1f] hover:bg-black text-white rounded-2xl px-12 py-7 font-bold shadow-xl shadow-black/10 transition-all active:scale-[0.98] text-base"
                onClick={() => setIsDetailModalOpen(false)}
              >
                完成
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="编辑商品"
      >
        <form onSubmit={handleEdit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">商品封面</label>
              <div className="relative group">
                {formData.image ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#f5f5f7] border border-black/[0.03]">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed border-[#e8e8ed] bg-[#f5f5f7] hover:bg-[#f2f2f7] hover:border-[#0071e3]/30 transition-all cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-[#0071e3]" />
                      </div>
                      <p className="text-sm font-semibold text-[#1d1d1f]">点击或拖拽上传图片</p>
                      <p className="text-xs text-[#86868b] mt-1">支持 JPG, PNG, GIF (最大 2MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">商品名称</label>
              <Input 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="输入商品名称"
                className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">分类</label>
                <Select 
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">请选择分类</option>
                  {mockCategories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">状态</label>
                <Select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: Number(e.target.value)})}
                >
                  <option value={1}>上架</option>
                  <option value={0}>下架</option>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">价格</label>
                <Input 
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="¥ 0.00"
                  className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">库存</label>
                <Input 
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  placeholder="数量"
                  className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
                />
              </div>
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
        title="添加商品"
      >
        <form onSubmit={handleAdd} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">商品封面</label>
              <div className="relative group">
                {formData.image ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#f5f5f7] border border-black/[0.03]">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed border-[#e8e8ed] bg-[#f5f5f7] hover:bg-[#f2f2f7] hover:border-[#0071e3]/30 transition-all cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-[#0071e3]" />
                      </div>
                      <p className="text-sm font-semibold text-[#1d1d1f]">点击或拖拽上传图片</p>
                      <p className="text-xs text-[#86868b] mt-1">支持 JPG, PNG, GIF (最大 2MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">商品名称</label>
              <Input 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="输入商品名称"
                className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">分类</label>
                <Select 
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">请选择分类</option>
                  {mockCategories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">状态</label>
                <Select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: Number(e.target.value)})}
                >
                  <option value={1}>上架</option>
                  <option value={0}>下架</option>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">价格</label>
                <Input 
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="¥ 0.00"
                  className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">库存</label>
                <Input 
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  placeholder="数量"
                  className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
                />
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
              取消
            </Button>
            <Button 
              type="submit"
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl px-8 py-6 font-bold shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98]"
            >
              保存商品
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isBatchEditModalOpen}
        onClose={() => setIsBatchEditModalOpen(false)}
        title={`批量编辑商品 (${selectedIds.length}项)`}
      >
        <form onSubmit={handleBatchEditSubmit} className="space-y-6 pt-4">
          <div className="space-y-6">
            <div className="p-4 bg-[#f5f5f7] rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="updateCategory"
                  checked={batchEditData.updateCategory}
                  onChange={(e) => setBatchEditData({...batchEditData, updateCategory: e.target.checked})}
                />
                <label htmlFor="updateCategory" className="text-sm font-semibold text-[#1d1d1f] cursor-pointer">修改分类</label>
              </div>
              {batchEditData.updateCategory && (
                <Select 
                  required
                  className="bg-white"
                  value={batchEditData.category}
                  onChange={(e) => setBatchEditData({...batchEditData, category: e.target.value})}
                >
                  <option value="">请选择新分类</option>
                  {mockCategories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </Select>
              )}
            </div>

            <div className="p-4 bg-[#f5f5f7] rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="updatePrice"
                  checked={batchEditData.updatePrice}
                  onChange={(e) => setBatchEditData({...batchEditData, updatePrice: e.target.checked})}
                />
                <label htmlFor="updatePrice" className="text-sm font-semibold text-[#1d1d1f] cursor-pointer">修改价格</label>
              </div>
              {batchEditData.updatePrice && (
                <Input 
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={batchEditData.price}
                  onChange={(e) => setBatchEditData({...batchEditData, price: e.target.value})}
                  placeholder="输入新价格 ¥ 0.00"
                  className="rounded-2xl bg-white border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
                />
              )}
            </div>

            <div className="p-4 bg-[#f5f5f7] rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="updateStock"
                  checked={batchEditData.updateStock}
                  onChange={(e) => setBatchEditData({...batchEditData, updateStock: e.target.checked})}
                />
                <label htmlFor="updateStock" className="text-sm font-semibold text-[#1d1d1f] cursor-pointer">修改库存</label>
              </div>
              {batchEditData.updateStock && (
                <Input 
                  type="number"
                  min="0"
                  required
                  value={batchEditData.stock}
                  onChange={(e) => setBatchEditData({...batchEditData, stock: e.target.value})}
                  placeholder="输入新库存数量"
                  className="rounded-2xl bg-white border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-2xl px-6 py-6 border-[#e8e8ed] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all"
              onClick={() => setIsBatchEditModalOpen(false)}
            >
              取消
            </Button>
            <Button 
              type="submit"
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl px-8 py-6 font-bold shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98]"
            >
              确认修改
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={batchAction === 'delete' ? "批量删除商品" : "删除商品"}
        message={batchAction === 'delete' ? `确定要删除选中的 ${selectedIds.length} 个商品吗？此操作不可恢复。` : "确定要删除该商品吗？此操作不可恢复。"}
      />
    </motion.div>
  );
}

