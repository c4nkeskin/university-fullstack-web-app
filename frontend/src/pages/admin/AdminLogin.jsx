import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import { Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login({
        username: formData.username,
        password: formData.password
      });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Giriş başarılı!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
      
      // --- DÜZELTME BAŞLANGICI ---
      // Eğer hata kodu 401 ise (Yetkisiz Giriş) veya mesaj "Invalid credentials" ise:
      if (error.response?.status === 401 || error.response?.data?.detail === 'Invalid credentials') {
        toast.error('Hatalı kullanıcı adı veya şifre');
      } else {
        // Bunun dışındaki hatalarda (Sunucu hatası vb.) gelen mesajı göster
        toast.error(error.response?.data?.detail || 'Sunucu ile bağlantı kurulamadı.');
      }
      // --- DÜZELTME BİTİŞİ ---
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center px-4" data-testid="admin-login-page">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-3xl font-bold text-blue-600">ATA</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Yönetim Paneli</h1>
          <p className="text-blue-100">ATA Üniversitesi İçerik Yönetim Sistemi</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in-up delay-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Yönetici Girişi</h2>

          <form onSubmit={handleSubmit} data-testid="admin-auth-form" className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Kullanıcı Adı veya E-posta
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  data-testid="username-input"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="kullanıcı_adınız veya email@ata.edu.tr"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  data-testid="password-input"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              data-testid="submit-button"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'İşleniyor...' : 'Giriş Yap'}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              <span className="font-medium">Varsayılan:</span> admin / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;