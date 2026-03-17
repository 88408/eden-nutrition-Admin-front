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
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import toast from 'react-hot-toast';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
        <Button className="flex items-center gap-2" onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          添加分类
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>分类名称</TableHead>
              <TableHead>图标</TableHead>
              <TableHead>排序</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treeData.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div 
                    className="flex items-center gap-2" 
                    style={{ paddingLeft: `${category.level * 2}rem` }}
                  >
                    {category.level === 0 ? (
                      <FolderTree className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <div className="w-4 h-px bg-gray-300 ml-2" />
                    )}
                    <span className={category.level === 0 ? "font-medium" : "text-gray-600"}>
                      {category.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{category.icon || '-'}</TableCell>
                <TableCell>{category.sortOrder}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="编辑"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4 text-emerald-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="删除"
                      onClick={() => handleDeleteClick(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
            <Input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="输入分类名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">父级分类</label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              value={formData.parentId}
              onChange={(e) => setFormData({...formData, parentId: Number(e.target.value)})}
            >
              <option value={0}>顶级分类</option>
              {categories.filter(c => c.parentId === 0).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
            <Input 
              type="number"
              min="1"
              required
              value={formData.sortOrder}
              onChange={(e) => setFormData({...formData, sortOrder: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">图标 (可选)</label>
            <Input 
              value={formData.icon}
              onChange={(e) => setFormData({...formData, icon: e.target.value})}
              placeholder="输入图标名称"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button type="submit">保存</Button>
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
    </div>
  );
}
