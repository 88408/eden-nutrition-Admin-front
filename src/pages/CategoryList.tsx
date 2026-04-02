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
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FolderTree,
  Dumbbell,
  Apple,
  Activity,
  Zap,
  Heart,
  Target,
  Trophy,
  Flame,
  Coffee,
  ShoppingBag,
  Package,
  Tag,
  Star,
  Smile,
  Check
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const PRESET_ICONS = [
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Apple', icon: Apple },
  { name: 'Activity', icon: Activity },
  { name: 'Zap', icon: Zap },
  { name: 'Heart', icon: Heart },
  { name: 'Target', icon: Target },
  { name: 'Trophy', icon: Trophy },
  { name: 'Flame', icon: Flame },
  { name: 'Coffee', icon: Coffee },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Package', icon: Package },
  { name: 'Tag', icon: Tag },
  { name: 'Star', icon: Star },
  { name: 'Smile', icon: Smile },
];
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

import { mockCategories } from '../data/mock';

export default function CategoryList() {
  const [categories, setCategories] = useState(mockCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', parentId: 0, sortOrder: 1, icon: '' });

  // Simple tree building
  const buildTree = (items: typeof mockCategories, parentId = 0, level = 0) => {
    let result: any[] = [];
    items.filter(item => item.parentId === parentId).forEach(item => {
      result.push({ ...item, level });
      result = result.concat(buildTree(items, item.id, level + 1));
    });
    return result;
  };

  const treeData = buildTree(categories);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', parentId: 0, sortOrder: 1, icon: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      parentId: category.parentId,
      sortOrder: category.sortOrder,
      icon: category.icon || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('分类名称不能为空');
      return;
    }

    if (editingId) {
      // Prevent setting parent to itself or its descendants
      if (formData.parentId === editingId || getDescendantIds(editingId, categories).includes(formData.parentId)) {
        toast.error('不能将父级分类设置为自己或自己的子分类');
        return;
      }

      setCategories(categories.map(c => 
        c.id === editingId 
          ? { ...c, ...formData, sortOrder: Number(formData.sortOrder) }
          : c
      ));
      toast.success('修改成功');
    } else {
      const newCategory = {
        id: Date.now(),
        ...formData,
        sortOrder: Number(formData.sortOrder)
      };
      setCategories([...categories, newCategory]);
      toast.success('添加成功');
    }
    
    setIsModalOpen(false);
    setFormData({ name: '', parentId: 0, sortOrder: 1, icon: '' });
    setEditingId(null);
  };

  const getDescendantIds = (parentId: number, allCategories: any[]): number[] => {
    const children = allCategories.filter(c => c.parentId === parentId);
    let ids = children.map(c => c.id);
    children.forEach(child => {
      ids = ids.concat(getDescendantIds(child.id, allCategories));
    });
    return ids;
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId !== null) {
      const idsToDelete = [deletingId, ...getDescendantIds(deletingId, categories)];
      setCategories(categories.filter(c => !idsToDelete.includes(c.id)));
      toast.success('删除成功');
      setDeletingId(null);
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
          <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f] font-display">分类管理</h1>
          <p className="text-[#86868b] mt-1">组织您的商品分类层级</p>
        </div>
        <Button 
          className="flex items-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl px-6 py-6 font-semibold shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98]" 
          onClick={openAddModal}
        >
          <Plus className="h-5 w-5" />
          添加分类
        </Button>
      </div>

      <div className="apple-card overflow-hidden">
        <Table>
          <TableHeader className="bg-[#f5f5f7]/50">
            <TableRow className="border-none">
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">分类名称</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">图标</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f]">排序</TableHead>
              <TableHead className="py-4 font-semibold text-[#1d1d1f] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treeData.map((category) => (
              <TableRow key={category.id} className="border-b border-[#f5f5f7] hover:bg-[#f5f5f7]/30 transition-colors">
                <TableCell>
                  <div 
                    className="flex items-center gap-2" 
                    style={{ paddingLeft: `${category.level * 2}rem` }}
                  >
                    {category.level === 0 ? (
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <FolderTree className="h-4 w-4 text-[#1a7d32]" />
                      </div>
                    ) : (
                      <div className="w-8 flex justify-center">
                        <div className="w-4 h-px bg-[#d2d2d7]" />
                      </div>
                    )}
                    <span className={category.level === 0 ? "font-semibold text-[#1d1d1f]" : "text-[#1d1d1f]"}>
                      {category.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {category.icon ? (
                    (() => {
                      const Icon = (LucideIcons as any)[category.icon];
                      return Icon ? <Icon className="h-4 w-4 text-[#86868b]" /> : <span className="text-[#86868b]">-</span>;
                    })()
                  ) : (
                    <span className="text-[#86868b]">-</span>
                  )}
                </TableCell>
                <TableCell className="text-[#86868b] font-mono text-xs">{category.sortOrder}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-emerald-50 rounded-xl transition-colors"
                      title="编辑"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4 text-[#1a7d32]" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-red-50 rounded-xl transition-colors"
                      title="删除"
                      onClick={() => handleDeleteClick(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-[#ff3b30]" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
        }}
        title={editingId ? "编辑分类" : "添加分类"}
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">分类名称</label>
              <Input 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="输入分类名称"
                className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">父级分类</label>
              <Select 
                value={formData.parentId}
                onChange={(e) => setFormData({...formData, parentId: Number(e.target.value)})}
              >
                <option value={0}>顶级分类</option>
                {categories.filter(c => c.parentId === 0).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">排序</label>
              <Input 
                type="number"
                min="1"
                required
                value={formData.sortOrder}
                onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})}
                className="rounded-2xl bg-[#f5f5f7] border-none py-3 px-4 focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[#1d1d1f] mb-2 ml-1">选择图标</label>
              <div className="grid grid-cols-7 gap-2 p-4 bg-[#f5f5f7] rounded-2xl border border-black/[0.03]">
                {PRESET_ICONS.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: item.name })}
                    className={`flex items-center justify-center p-3 rounded-xl transition-all ${
                      formData.icon === item.name 
                        ? 'bg-[#0071e3] text-white shadow-lg shadow-blue-500/20 scale-110' 
                        : 'bg-white text-[#86868b] hover:bg-white hover:text-[#1d1d1f] hover:scale-105'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: '' })}
                  className={`flex items-center justify-center p-3 rounded-xl transition-all ${
                    formData.icon === '' 
                      ? 'bg-[#1d1d1f] text-white shadow-lg scale-110' 
                      : 'bg-white text-[#86868b] hover:bg-white hover:text-[#1d1d1f] hover:scale-105'
                  }`}
                  title="清除图标"
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </button>
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
              保存分类
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="删除分类"
        message="确定要删除该分类及其所有子分类吗？此操作不可恢复。"
      />
    </motion.div>
  );
}
