import React, { useState } from 'react';
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Zap,
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronLeft,
  Settings,
  User,
  Shield,
  Palette,
  Globe,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'motion/react';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { path: '/product/list', label: '商品管理', icon: Package },
  { path: '/category/list', label: '分类管理', icon: Tags },
  { path: '/order/list', label: '订单管理', icon: ShoppingCart },
  { path: '/marketing/seckill', label: '营销活动', icon: Zap },
];

const notifications = [
  { id: 1, title: '新订单通知', message: '您收到了一个新的订单 ORD-20260317-005', type: 'success', time: '5 分钟前', icon: ShoppingCart },
  { id: 2, title: '库存预警', message: '乳清蛋白粉 5磅 库存低于 10 件', type: 'warning', time: '1 小时前', icon: Package },
  { id: 3, title: '系统更新', message: '系统将于今晚 2:00 进行例行维护', type: 'info', time: '3 小时前', icon: Info },
];

export default function AdminLayout() {
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('已安全退出登录');
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="flex h-screen bg-[#f5f5f7] overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 88 }}
        className="bg-white border-r border-black/[0.03] flex flex-col relative z-20"
      >
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0071e3] to-[#00c7ff] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Zap size={22} fill="currentColor" />
            </div>
            <AnimatePresence mode="wait">
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-display font-bold text-xl tracking-tight text-[#1d1d1f]"
                >
                  Eden
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-[#0071e3] text-white shadow-md shadow-blue-500/20" 
                  : "text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
              )}
            >
              <item.icon size={20} className={cn("shrink-0 transition-transform group-hover:scale-110")} />
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-black/[0.03] space-y-2">
          <button 
            onClick={() => setActiveModal('settings')}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f] transition-all",
              !isSidebarOpen && "justify-center"
            )}
          >
            <Settings size={20} />
            {isSidebarOpen && <span>设置</span>}
          </button>
          <button
            onClick={() => setActiveModal('logout')}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>退出登录</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-24 w-6 h-6 bg-white border border-black/[0.05] rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all z-30"
        >
          <ChevronLeft size={14} className={cn("transition-transform", !isSidebarOpen && "rotate-180")} />
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 apple-blur border-b border-black/[0.03] flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" size={18} />
              <input 
                type="text" 
                placeholder="搜索任何内容..." 
                className="w-full bg-[#f5f5f7] border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveModal('notifications')}
              className="p-2.5 rounded-full hover:bg-[#f5f5f7] text-[#86868b] transition-all relative"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-[1px] bg-black/[0.05] mx-2"></div>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[#1d1d1f] leading-tight">{user?.username || '管理员'}</p>
                <p className="text-xs text-[#86868b]">店铺经理</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-100 to-gray-200 border border-black/[0.05] flex items-center justify-center text-[#1d1d1f] font-bold shadow-sm overflow-hidden">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Modals */}
      <Modal
        isOpen={activeModal === 'settings'}
        onClose={closeModal}
        title="系统设置"
        className="max-w-2xl"
      >
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex items-center gap-4 p-4 rounded-2xl border border-black/[0.03] hover:bg-[#f5f5f7] transition-all text-left group">
              <div className="p-3 bg-blue-50 text-[#0071e3] rounded-xl group-hover:scale-110 transition-transform">
                <User size={20} />
              </div>
              <div>
                <p className="font-bold text-[#1d1d1f]">个人资料</p>
                <p className="text-xs text-[#86868b]">管理您的账号信息和头像</p>
              </div>
            </button>
            <button className="flex items-center gap-4 p-4 rounded-2xl border border-black/[0.03] hover:bg-[#f5f5f7] transition-all text-left group">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                <Shield size={20} />
              </div>
              <div>
                <p className="font-bold text-[#1d1d1f]">安全设置</p>
                <p className="text-xs text-[#86868b]">修改密码和两步验证</p>
              </div>
            </button>
            <button className="flex items-center gap-4 p-4 rounded-2xl border border-black/[0.03] hover:bg-[#f5f5f7] transition-all text-left group">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <Palette size={20} />
              </div>
              <div>
                <p className="font-bold text-[#1d1d1f]">界面外观</p>
                <p className="text-xs text-[#86868b]">自定义主题颜色和布局</p>
              </div>
            </button>
            <button className="flex items-center gap-4 p-4 rounded-2xl border border-black/[0.03] hover:bg-[#f5f5f7] transition-all text-left group">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                <Globe size={20} />
              </div>
              <div>
                <p className="font-bold text-[#1d1d1f]">语言与地区</p>
                <p className="text-xs text-[#86868b]">设置系统语言和时区</p>
              </div>
            </button>
          </div>
          <div className="flex justify-end pt-4">
            <Button 
              className="bg-[#1d1d1f] hover:bg-black text-white rounded-2xl px-8 py-6 font-bold"
              onClick={closeModal}
            >
              保存更改
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'notifications'}
        onClose={closeModal}
        title="通知中心"
      >
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#1d1d1f]">最近通知</span>
            <button className="text-xs font-bold text-[#0071e3] hover:underline">全部标记为已读</button>
          </div>
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-start gap-4 p-4 rounded-2xl border border-black/[0.03] hover:bg-[#f5f5f7]/50 transition-all cursor-pointer">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  n.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                  n.type === 'warning' ? 'bg-orange-50 text-orange-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  <n.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-[#1d1d1f] truncate">{n.title}</p>
                    <span className="text-[10px] text-[#86868b] font-medium">{n.time}</span>
                  </div>
                  <p className="text-xs text-[#86868b] leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center pt-4">
            <button onClick={closeModal} className="text-sm font-semibold text-[#86868b] hover:text-[#1d1d1f]">
              查看所有历史通知
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={activeModal === 'logout'}
        onClose={closeModal}
        onConfirm={handleLogout}
        title="退出登录"
        message="确定要退出当前账号吗？未保存的更改可能会丢失。"
      />
    </div>
  );
}
