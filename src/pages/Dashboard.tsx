import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { getDashboardStats, getSalesRevenue, DashboardStatItem, SalesRevenue } from '../api/dashboard';
import { getOrderPage } from '../api/order';
import { exportReport } from '../api/export';
import { downloadBase64Csv, downloadBase64Excel } from '../utils/download';

const statUIConfigs: Record<string, { icon: any, color: string }> = {
  '今日订单': { icon: ShoppingCart, color: 'bg-blue-500' },
  '总销售额': { icon: DollarSign, color: 'bg-emerald-500' },
  '新增用户': { icon: Users, color: 'bg-orange-500' },
  '转化率': { icon: TrendingUp, color: 'bg-purple-500' },
};

const quickActions = [
  { name: '添加商品', icon: Plus, color: 'bg-blue-50 text-blue-600', path: '/product/list' },
  { name: '添加分类', icon: FileText, color: 'bg-emerald-50 text-emerald-600', path: '/category/list' },
  { name: '管理订单', icon: ShoppingCart, color: 'bg-orange-50 text-orange-600', path: '/order/list' },
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

const getRelativeTime = (timeStr: string): string => {
  if (!timeStr) return '刚刚';
  const now = Date.now();
  const then = new Date(timeStr).getTime();
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  return new Date(timeStr).toLocaleDateString('zh-CN');
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [dbStats, setDbStats] = useState<any[]>(Object.entries(statUIConfigs).map(([name, config]) => ({
    name,
    value: '-',
    change: '-',
    changeType: 'positive',
    icon: config.icon,
    color: config.color
  })));
  const [dbSalesData, setDbSalesData] = useState<any[]>([]);
  const [dbRecentOrders, setDbRecentOrders] = useState<any[]>([]);
  const [dbTasks, setDbTasks] = useState<any[]>([]);
  const [reportRange, setReportRange] = useState('最近7天');
  const [reportFormat, setReportFormat] = useState<'csv' | 'xlsx'>('csv');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, salesRes, ordersRes, unshippedRes] = await Promise.all([
        getDashboardStats(),
        getSalesRevenue(7),
        getOrderPage({ page: 1, pageSize: 5 }),
        getOrderPage({ page: 1, pageSize: 10, status: 1 })
      ]);
      
      // statsRes is the array directly due to axios interceptor returning res.data
      if (Array.isArray(statsRes)) {
        const trueStats = statsRes.map((stat: any) => {
           const uiConfig = statUIConfigs[stat.name] || { icon: TrendingUp, color: 'bg-gray-500' };

           let changeStr = stat.change || '-';
           let changeVal = parseFloat(changeStr.replace('%', '').replace('+', ''));
           if (!isNaN(changeVal)) {
             changeStr = (changeVal > 0 ? '+' : '') + changeVal.toFixed(1) + '%';
           }

           return {
             name: stat.name,
             value: stat.value,
             change: changeStr,
             changeType: stat.changeType,
             icon: uiConfig.icon,
             color: uiConfig.color
           };
        });
        setDbStats(trueStats);
      }

      // salesRes is the array
      if (Array.isArray(salesRes)) {
        setDbSalesData(salesRes.map((item: any) => {
          let dateObj = new Date();
          if (Array.isArray(item.date)) {
            // [yyyy, mm, dd]
            dateObj = new Date(item.date[0], item.date[1] - 1, item.date[2]);
          } else if (item.date) {
            dateObj = new Date(item.date);
          }
          return {
            name: dateObj.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
            sales: item.revenue || 0
          };
        }));
      }

      // ordersRes is the object containing list
      const orderList = (ordersRes as any)?.list || [];
      if (orderList.length > 0) {
        setDbRecentOrders(orderList.map((o: any) => ({
          id: o.orderNo || o.id,
          customer: o.receiverName || o.userId || '未知客户',
          product: '查看详情', // 商品详情可通过后续展开查看
          amount: `¥${(o.payAmount || 0).toFixed(2)}`,
          status: o.status === 1 ? '待发货' : o.status === 2 ? '已发货' : o.status === 3 ? '已完成' : o.status === 4 ? '已关闭' : '待付款',
          date: o.createTime ? new Date(o.createTime).toLocaleDateString('zh-CN') : '刚刚'
        })));
      }

      // 未发货订单 → 任务列表
      const unshippedList = (unshippedRes as any)?.list || [];
      if (unshippedList.length > 0) {
        setDbTasks(unshippedList.map((o: any) => ({
          id: o.id,
          title: `订单 ${o.orderNo || o.id}`,
          priority: (o.payAmount || 0) > 1000 ? '高' : (o.payAmount || 0) > 500 ? '中' : '低',
          status: 'pending',
          icon: ShoppingCart,
          time: getRelativeTime(o.createTime)
        })));
      }
    } catch (e) {
      console.error('Failed to fetch dashboard data', e);
    }
  };

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
              <AreaChart data={dbSalesData}>
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
                onClick={() => navigate(action.path)}
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
        {dbStats.map((stat) => (
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
              <h4 className="text-xl 2xl:text-2xl font-bold text-[#1d1d1f] mt-1 font-display tracking-tight" title={stat.value}>{stat.value}</h4>
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
            {dbTasks.slice(0, 3).map((task) => (
              <div key={task.id} onClick={() => navigate('/order/list')} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group">
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
                {dbRecentOrders.slice(0, 3).map((order) => (
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
          <p className="text-[#86868b] text-sm">选择格式和时间范围，下载销售报表。</p>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1d1d1f] ml-1">文件格式</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setReportFormat('csv')}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl transition-all ${
                  reportFormat === 'csv'
                    ? 'border-2 border-[#0071e3] bg-blue-50/50'
                    : 'border border-black/[0.05] hover:bg-gray-50'
                }`}
              >
                <FileText className={`h-8 w-8 ${reportFormat === 'csv' ? 'text-[#0071e3]' : 'text-emerald-500'}`} />
                <span className="font-bold text-[#1d1d1f]">CSV 格式</span>
              </button>
              <button
                onClick={() => setReportFormat('xlsx')}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl transition-all ${
                  reportFormat === 'xlsx'
                    ? 'border-2 border-[#0071e3] bg-blue-50/50'
                    : 'border border-black/[0.05] hover:bg-gray-50'
                }`}
              >
                <Download className={`h-8 w-8 ${reportFormat === 'xlsx' ? 'text-[#0071e3]' : 'text-emerald-500'}`} />
                <span className="font-bold text-[#1d1d1f]">Excel 格式</span>
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1d1d1f] ml-1">时间范围</label>
            <div className="grid grid-cols-3 gap-2">
              {['最近7天', '最近30天', '本季度'].map(range => (
                <button
                  key={range}
                  onClick={() => setReportRange(range)}
                  className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                    reportRange === range
                      ? 'bg-[#0071e3] text-white shadow-sm'
                      : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl px-8 py-6 font-bold shadow-lg shadow-blue-500/10"
              onClick={async () => {
                toast.success('报表生成中，请稍候...');
                const now = new Date();
                const nowStr = now.toISOString().slice(0, 10);
                let startTime: string;
                if (reportRange === '最近7天') {
                  const d = new Date(now); d.setDate(d.getDate() - 7);
                  startTime = d.toISOString().slice(0, 10);
                } else if (reportRange === '最近30天') {
                  const d = new Date(now); d.setDate(d.getDate() - 30);
                  startTime = d.toISOString().slice(0, 10);
                } else {
                  const d = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                  startTime = d.toISOString().slice(0, 10);
                }
                try {
                  const data: string = await (exportReport({ startTime, endTime: nowStr, grain: 'day', limit: 10 }) as any);
                  const filename = `report_${startTime}_${nowStr}.${reportFormat}`;
                  if (reportFormat === 'csv') {
                    downloadBase64Csv(data, filename);
                  } else {
                    downloadBase64Excel(data, filename);
                  }
                  toast.success('报表下载完成');
                } catch {
                  toast.error('报表导出失败');
                }
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
              <span className="text-sm font-medium text-[#86868b]">筛选: 全部待发货订单</span>
            </div>
            <span className="text-xs text-[#86868b]">共 {dbTasks.length} 个待发货订单</span>
          </div>
          <div className="space-y-3">
            {dbTasks.map((task) => (
              <div key={task.id} onClick={() => { navigate('/order/list'); closeModal(); }} className="flex items-center gap-4 p-4 rounded-2xl border border-black/[0.03] hover:bg-[#f5f5f7]/50 transition-all cursor-pointer group">
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
                {dbRecentOrders.map((order) => (
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
