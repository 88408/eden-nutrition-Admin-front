import React, { useState } from 'react';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  Package,
  Zap,
  ChevronRight,
  Download,
  FileText,
  Calendar,
  Filter
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table"
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { salesTrendData } from '../data/mock';
import toast from 'react-hot-toast';

const stats = [
  { 
    name: '今日订单', 
    value: '156', 
    icon: ShoppingCart, 
    change: '+12.5%', 
    changeType: 'positive',
    color: 'bg-blue-500'
  },
  { 
    name: '总销售额', 
    value: '¥45,231', 
    icon: DollarSign, 
    change: '+8.2%', 
    changeType: 'positive',
    color: 'bg-emerald-500'
  },
  { 
    name: '新增用户', 
    value: '42', 
    icon: Users, 
    change: '-2.4%', 
    changeType: 'negative',
    color: 'bg-orange-500'
  },
  { 
    name: '转化率', 
    value: '3.2%', 
    icon: TrendingUp, 
    change: '+1.1%', 
    changeType: 'positive',
    color: 'bg-purple-500'
  },
];

const tasks = [
  { id: 1, title: '补货乳清蛋白粉 5磅', priority: '高', status: 'pending', icon: Package, time: '2小时前' },
  { id: 2, title: '审核 12 个新订单', priority: '中', status: 'in-progress', icon: ShoppingCart, time: '4小时前' },
  { id: 3, title: '更新维生素 C 价格', priority: '低', status: 'completed', icon: Zap, time: '昨天' },
  { id: 4, title: '检查库存预警', priority: '高', status: 'pending', icon: AlertCircle, time: '3小时前' },
  { id: 5, title: '准备月度销售报告', priority: '中', status: 'pending', icon: FileText, time: '5小时前' },
];

const quickActions = [
  { name: '添加商品', icon: Plus, color: 'bg-blue-50 text-blue-600', description: '快速上架新商品到目录' },
  { name: '新建订单', icon: ShoppingCart, color: 'bg-emerald-50 text-emerald-600', description: '手动为客户创建新订单' },
  { name: '搜索', icon: Search, color: 'bg-gray-50 text-gray-600', description: '在全站范围内搜索资源' },
  { name: '报表', icon: TrendingUp, color: 'bg-purple-50 text-purple-600', description: '查看详细的业务分析报表' },
];

const recentOrders = [
  { id: 'ORD-001', customer: '张三', product: '乳清蛋白粉 5磅', amount: '¥399.00', status: '已发货', date: '2026-03-17' },
  { id: 'ORD-002', customer: '李四', product: '维生素 C', amount: '¥89.00', status: '待处理', date: '2026-03-17' },
  { id: 'ORD-003', customer: '王五', product: 'BCAA 粉末', amount: '¥159.00', status: '已完成', date: '2026-03-16' },
  { id: 'ORD-004', customer: '赵六', product: '左旋肉碱', amount: '¥129.00', status: '已完成', date: '2026-03-16' },
  { id: 'ORD-005', customer: '孙七', product: '蛋白棒', amount: '¥199.00', status: '已发货', date: '2026-03-15' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<any>(null);

  const handleQuickAction = (action: any) => {
    setSelectedAction(action);
    setActiveModal('quickAction');
  };

  const handleDownloadReport = () => {
    setActiveModal('downloadReport');
  };

  const handleExportData = () => {
    setActiveModal('exportData');
  };

  const handleViewAllTasks = () => {
    setActiveModal('allTasks');
  };

  const handleViewHistory = () => {
    setActiveModal('orderHistory');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedAction(null);
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-[1600px] mx-auto space-y-8 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f] font-display">概览</h1>
          <p className="text-[#86868b] mt-1">欢迎回来，这是今天的业务动态。</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadReport}
            className="apple-blur px-4 py-2 rounded-full border border-black/[0.05] text-sm font-medium hover:bg-white transition-all"
          >
            下载报表
          </button>
          <button 
            onClick={handleExportData}
            className="bg-[#0071e3] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#0077ed] transition-all shadow-lg shadow-blue-500/20"
          >
            导出数据
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
        
        {/* Sales Overview - Large Widget */}
        <motion.div variants={item} className="md:col-span-4 lg:col-span-4 apple-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#1d1d1f] font-display">销售概览</h3>
              <p className="text-sm text-[#86868b]">过去 7 天的收入趋势</p>
            </div>
          </div>
          <div className="flex-1 h-[300px] -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0071e3" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0071e3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f7" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#86868b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#86868b', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    backgroundColor: '#ffffff',
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#0071e3" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions - Medium Widget */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-2 apple-card p-6">
          <h3 className="text-lg font-bold text-[#1d1d1f] mb-6 font-display">快捷操作</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <button 
                key={action.name}
                onClick={() => handleQuickAction(action)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl border border-black/[0.03] hover:bg-gray-50 transition-all group"
              >
                <div className={`p-3 rounded-xl ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon size={20} />
                </div>
                <span className="text-sm font-medium text-[#1d1d1f]">{action.name}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-2xl bg-linear-to-br from-[#0071e3] to-[#00c7ff] text-white">
            <p className="text-xs font-medium opacity-80 uppercase tracking-wider mb-1">专业提示</p>
            <p className="text-sm font-medium">使用快捷键可以更快速地在仪表盘中导航。</p>
          </div>
        </motion.div>

        {/* Stats Widgets */}
        {stats.map((stat) => (
          <motion.div 
            key={stat.name} 
            variants={item}
            className="md:col-span-2 lg:col-span-1 apple-card p-6 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                <stat.icon size={18} />
              </div>
              <div className={`flex items-center text-xs font-bold ${
                stat.changeType === 'positive' ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {stat.changeType === 'positive' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4 overflow-hidden">
              <p className="text-sm font-medium text-[#86868b] truncate">{stat.name}</p>
              <h4 className="text-2xl font-bold text-[#1d1d1f] mt-1 font-display tracking-tight truncate" title={stat.value}>{stat.value}</h4>
            </div>
          </motion.div>
        ))}

        {/* Task List - Medium Widget */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-2 apple-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#1d1d1f] font-display">任务列表</h3>
            <button 
              onClick={handleViewAllTasks}
              className="text-[#0071e3] text-sm font-semibold hover:underline"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-4">
            {tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group">
                <div className={`p-2 rounded-lg ${
                  task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                  task.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                  'bg-orange-50 text-orange-600'
                }`}>
                  <task.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1d1d1f] truncate">{task.title}</p>
                  <p className="text-xs text-[#86868b]">{task.priority} 优先级</p>
                </div>
                <ChevronRight size={16} className="text-[#86868b] group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders - Large Widget */}
        <motion.div variants={item} className="md:col-span-4 lg:col-span-6 apple-card overflow-hidden">
          <div className="px-6 py-5 border-b border-black/[0.03] flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1d1d1f] font-display">最近订单</h3>
            <button 
              onClick={handleViewHistory}
              className="apple-blur px-3 py-1 rounded-full border border-black/[0.05] text-xs font-semibold"
            >
              查看历史
            </button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-black/[0.03]">
                  <TableHead className="text-[#86868b] font-medium">订单号</TableHead>
                  <TableHead className="text-[#86868b] font-medium">客户</TableHead>
                  <TableHead className="text-[#86868b] font-medium">商品</TableHead>
                  <TableHead className="text-[#86868b] font-medium">金额</TableHead>
                  <TableHead className="text-[#86868b] font-medium">状态</TableHead>
                  <TableHead className="text-[#86868b] font-medium text-right">日期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.slice(0, 3).map((order) => (
                  <TableRow key={order.id} className="border-black/[0.03] hover:bg-gray-50/50">
                    <TableCell className="font-bold text-[#1d1d1f] font-mono text-xs tracking-tighter">{order.id}</TableCell>
                    <TableCell className="text-[#1d1d1f] font-medium">{order.customer}</TableCell>
                    <TableCell className="text-[#1d1d1f]">{order.product}</TableCell>
                    <TableCell className="text-[#1d1d1f] font-bold font-mono whitespace-nowrap">{order.amount}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === '已完成' ? 'bg-emerald-50 text-emerald-600' :
                        order.status === '已发货' ? 'bg-blue-50 text-blue-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#86868b] text-right">{order.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>

      </div>

      {/* Modals */}
      <Modal
        isOpen={activeModal === 'downloadReport'}
        onClose={closeModal}
        title="下载报表"
      >
        <div className="space-y-6 pt-4">
          <p className="text-[#86868b] text-sm">选择您想要下载的报表格式和时间范围。</p>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-[#0071e3] bg-blue-50/50">
              <Download className="h-8 w-8 text-[#0071e3]" />
              <span className="font-bold text-[#1d1d1f]">PDF 格式</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-black/[0.05] hover:bg-gray-50 transition-all">
              <FileText className="h-8 w-8 text-emerald-500" />
              <span className="font-bold text-[#1d1d1f]">Excel 格式</span>
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1d1d1f] ml-1">时间范围</label>
            <div className="grid grid-cols-3 gap-2">
              {['最近7天', '最近30天', '本季度'].map(range => (
                <button key={range} className="py-2 px-4 rounded-xl bg-[#f5f5f7] text-sm font-medium text-[#1d1d1f] hover:bg-[#e8e8ed]">
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button 
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl px-8 py-6 font-bold shadow-lg shadow-blue-500/10"
              onClick={() => {
                toast.success('报表生成中，请稍候...');
                closeModal();
              }}
            >
              开始下载
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'exportData'}
        onClose={closeModal}
        title="导出数据"
      >
        <div className="space-y-6 pt-4">
          <p className="text-[#86868b] text-sm">配置导出参数以获取详细的原始数据。</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1d1d1f] ml-1">数据类型</label>
              <div className="flex flex-wrap gap-2">
                {['订单数据', '商品数据', '用户数据', '库存日志'].map(type => (
                  <button key={type} className="py-2 px-4 rounded-xl border border-black/[0.05] text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]">
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1d1d1f] ml-1">自定义日期</label>
              <div className="flex items-center gap-3">
                <Input type="date" className="rounded-xl bg-[#f5f5f7] border-none" />
                <span className="text-[#86868b]">至</span>
                <Input type="date" className="rounded-xl bg-[#f5f5f7] border-none" />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button 
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl px-8 py-6 font-bold shadow-lg shadow-blue-500/10"
              onClick={() => {
                toast.success('数据导出任务已创建');
                closeModal();
              }}
            >
              确认导出
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'quickAction'}
        onClose={closeModal}
        title={selectedAction?.name}
      >
        <div className="space-y-6 pt-4 text-center">
          <div className={`mx-auto p-6 rounded-[2rem] ${selectedAction?.color} w-fit mb-4`}>
            {selectedAction && <selectedAction.icon size={48} />}
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-[#1d1d1f]">{selectedAction?.name}</h4>
            <p className="text-[#86868b]">{selectedAction?.description}</p>
          </div>
          <div className="bg-[#f5f5f7] p-6 rounded-3xl text-left space-y-4">
            <p className="text-sm font-semibold text-[#1d1d1f]">快速入口</p>
            <div className="space-y-2">
              <Input placeholder={`输入${selectedAction?.name}相关信息...`} className="rounded-xl bg-white border-none shadow-sm" />
              <Button className="w-full bg-[#1d1d1f] hover:bg-black text-white rounded-xl py-4 font-bold">
                立即执行
              </Button>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <button onClick={closeModal} className="text-[#0071e3] font-semibold hover:underline">
              取消
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'allTasks'}
        onClose={closeModal}
        title="所有任务"
        className="max-w-2xl"
      >
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[#86868b]" />
              <span className="text-sm font-medium text-[#86868b]">筛选: 全部任务</span>
            </div>
            <span className="text-xs text-[#86868b]">共 {tasks.length} 个任务</span>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-4 rounded-2xl border border-black/[0.03] hover:bg-[#f5f5f7]/50 transition-all group">
                <div className={`p-3 rounded-xl ${
                  task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                  task.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                  'bg-orange-50 text-orange-600'
                }`}>
                  <task.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-[#1d1d1f] truncate">{task.title}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      task.priority === '高' ? 'bg-red-100 text-red-600' :
                      task.priority === '中' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#86868b]">
                    <span className="flex items-center gap-1"><Clock size={12} /> {task.time}</span>
                    <span className="flex items-center gap-1"><CheckCircle2 size={12} /> {task.status === 'completed' ? '已完成' : '进行中'}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={18} />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <Button 
              className="bg-[#1d1d1f] hover:bg-black text-white rounded-2xl px-8 py-6 font-bold"
              onClick={closeModal}
            >
              关闭
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'orderHistory'}
        onClose={closeModal}
        title="历史订单"
        className="max-w-4xl"
      >
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
              <Input placeholder="搜索历史订单..." className="pl-10 rounded-xl bg-[#f5f5f7] border-none h-10" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl h-10 gap-2 border-black/[0.05]">
                <Calendar size={16} />
                选择日期
              </Button>
              <Button variant="outline" className="rounded-xl h-10 gap-2 border-black/[0.05]">
                <Filter size={16} />
                筛选
              </Button>
            </div>
          </div>
          <div className="apple-card overflow-hidden border border-black/[0.03]">
            <Table>
              <TableHeader className="bg-[#f5f5f7]/50">
                <TableRow className="hover:bg-transparent border-black/[0.03]">
                  <TableHead className="text-[#86868b] font-medium">订单号</TableHead>
                  <TableHead className="text-[#86868b] font-medium">客户</TableHead>
                  <TableHead className="text-[#86868b] font-medium">金额</TableHead>
                  <TableHead className="text-[#86868b] font-medium">状态</TableHead>
                  <TableHead className="text-[#86868b] font-medium text-right">日期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} className="border-black/[0.03] hover:bg-gray-50/50">
                    <TableCell className="font-bold text-[#1d1d1f] font-mono text-xs tracking-tighter">{order.id}</TableCell>
                    <TableCell className="text-[#1d1d1f] font-medium">{order.customer}</TableCell>
                    <TableCell className="text-[#1d1d1f] font-bold font-mono whitespace-nowrap">{order.amount}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === '已完成' ? 'bg-emerald-50 text-emerald-600' :
                        order.status === '已发货' ? 'bg-blue-50 text-blue-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#86868b] text-right text-xs">{order.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end pt-4">
            <Button 
              className="bg-[#1d1d1f] hover:bg-black text-white rounded-2xl px-8 py-6 font-bold"
              onClick={closeModal}
            >
              关闭
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
