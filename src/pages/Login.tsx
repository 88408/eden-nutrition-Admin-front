import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import request from '../api/request';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Leaf } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
      // Mock API call if real backend is not available
      // const res = await request.post('/user/login', { username, password });
      
      // Simulating successful login for now
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div>
          <div className="mx-auto h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <Leaf className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Eden Nutrition
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            管理后台登录
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">用户名</label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">密码</label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? '登录中...' : '登 录'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
