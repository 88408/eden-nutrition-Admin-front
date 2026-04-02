import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Zap, Mail, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('请输入用户名和密码');
      return;
    }

    setLoading(true);
    try {
      // Simulating successful login
      setTimeout(() => {
        setAuth('mock-jwt-token-123', { id: '1', username, role: 'admin' });
        toast.success('登录成功');
        navigate('/dashboard');
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-black/[0.02]"
      >
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-linear-to-br from-[#0071e3] to-[#00c7ff] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-6">
            <Zap size={32} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#1d1d1f] font-display">
            Eden 商家后台
          </h2>
          <p className="mt-2 text-[#86868b] font-semibold">
            登录以管理您的店铺
          </p>
        </div>
        
        <form className="mt-10 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] mb-2 ml-1">用户名</label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                className="rounded-2xl bg-[#f5f5f7] border-none py-4 px-5 focus:ring-2 focus:ring-[#0071e3]/20 transition-all font-medium"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] mb-2 ml-1">密码</label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="rounded-2xl bg-[#f5f5f7] border-none py-4 px-5 focus:ring-2 focus:ring-[#0071e3]/20 transition-all font-medium"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-5 w-5 text-[#0071e3] focus:ring-[#0071e3]/20 border-[#d2d2d7] rounded-lg cursor-pointer transition-all"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm font-semibold text-[#86868b]">
                记住我
              </label>
            </div>

            <div className="text-sm">
              <button 
                type="button"
                onClick={() => setActiveModal('forgotPassword')}
                className="font-bold text-[#0071e3] hover:underline"
              >
                忘记密码？
              </button>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-2xl py-7 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] text-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>登录中...</span>
                </div>
              ) : '登 录'}
            </Button>
          </div>
        </form>
        
        <p className="text-center text-sm text-[#86868b]">
          还没有账号？{' '}
          <button 
            onClick={() => setActiveModal('contactSupport')}
            className="font-semibold text-[#0071e3] hover:underline"
          >
            联系支持
          </button>
        </p>
      </motion.div>

      {/* Modals */}
      <Modal
        isOpen={activeModal === 'forgotPassword'}
        onClose={closeModal}
        title="重置密码"
      >
        <div className="space-y-6 pt-4">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0071e3] mb-4">
            <ShieldCheck size={32} />
          </div>
          <div className="text-center space-y-2">
            <h4 className="text-xl font-bold text-[#1d1d1f]">需要重置密码？</h4>
            <p className="text-[#86868b] text-sm">请输入您的注册邮箱，我们将向您发送重置链接。</p>
          </div>
          <div className="space-y-4">
            <Input placeholder="your@email.com" className="rounded-xl bg-[#f5f5f7] border-none py-4" />
            <Button 
              className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl py-6 font-bold"
              onClick={() => {
                toast.success('重置邮件已发送，请检查您的收件箱');
                closeModal();
              }}
            >
              发送重置链接
            </Button>
          </div>
          <div className="text-center">
            <button onClick={closeModal} className="text-sm font-semibold text-[#86868b] hover:text-[#1d1d1f]">
              返回登录
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'contactSupport'}
        onClose={closeModal}
        title="联系支持"
      >
        <div className="space-y-6 pt-4">
          <div className="text-center space-y-2 mb-8">
            <h4 className="text-xl font-bold text-[#1d1d1f]">我们随时为您提供帮助</h4>
            <p className="text-[#86868b] text-sm">选择以下方式之一与我们的支持团队取得联系。</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button className="flex items-center gap-4 p-4 rounded-2xl border border-black/[0.03] hover:bg-[#f5f5f7] transition-all text-left group">
              <div className="p-3 bg-blue-50 text-[#0071e3] rounded-xl group-hover:scale-110 transition-transform">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-bold text-[#1d1d1f]">发送邮件</p>
                <p className="text-xs text-[#86868b]">support@eden.com</p>
              </div>
            </button>
            <button className="flex items-center gap-4 p-4 rounded-2xl border border-black/[0.03] hover:bg-[#f5f5f7] transition-all text-left group">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="font-bold text-[#1d1d1f]">在线聊天</p>
                <p className="text-xs text-[#86868b]">预计响应时间：5 分钟</p>
              </div>
            </button>
            <button className="flex items-center gap-4 p-4 rounded-2xl border border-black/[0.03] hover:bg-[#f5f5f7] transition-all text-left group">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                <Phone size={20} />
              </div>
              <div>
                <p className="font-bold text-[#1d1d1f]">拨打电话</p>
                <p className="text-xs text-[#86868b]">400-123-4567</p>
              </div>
            </button>
          </div>
          <div className="flex justify-center pt-4">
            <Button 
              variant="outline"
              className="rounded-xl px-8 border-black/[0.05]"
              onClick={closeModal}
            >
              关闭
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
