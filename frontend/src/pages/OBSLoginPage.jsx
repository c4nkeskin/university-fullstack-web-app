import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Mail, Phone, Building2, GraduationCap } from 'lucide-react';
import { studentAPI } from '../utils/api';
import { toast } from 'sonner';

const OBSLoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    student_no: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    tc_no: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    class_level: '1',
    password: '',
    password_confirm: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await studentAPI.login(loginData);
      localStorage.setItem('student_token', response.data.access_token);
      localStorage.setItem('student', JSON.stringify(response.data.student));
      toast.success('Giriş başarılı!');
      navigate('/obs/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.password_confirm) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);

    try {
      const { password_confirm, ...data } = registerData;
      await studentAPI.register(data);
      toast.success('Kayıt başarılı! Hesabınız onay bekliyor.');
      setActiveTab('login');
      setRegisterData({
        tc_no: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department: '',
        class_level: '1',
        password: '',
        password_confirm: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        {/* Üst Bilgi (Başlık) */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Öğrenci Bilgi Sistemi</h1>
          <p className="text-blue-200">ATA Üniversitesi</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Sol Taraf – Bilgi */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white hidden md:flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6">Hoş Geldiniz</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Notlarınızı Görüntüleyin</h3>
                    <p className="text-sm text-blue-100">Tüm ders notlarınıza ve GPA'nıza ulaşın</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ders Programı</h3>
                    <p className="text-sm text-blue-100">Haftalık ders programınızı takip edin</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Güvenli Sistem</h3>
                    <p className="text-sm text-blue-100">Bilgileriniz güvende</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Taraf – Formlar */}
            <div className="p-8">
              {/* Sekmeler */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === 'login'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === 'register'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Kayıt Ol
                </button>
              </div>

              {/* Giriş Formu */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Öğrenci Numarası
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={loginData.student_no}
                        onChange={(e) => setLoginData({ ...loginData, student_no: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Örn: 2025001"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                  </button>
                </form>
              )}

              {/*Kayıt Formu */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                      <input
                        type="text"
                        required
                        value={registerData.first_name}
                        onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                      <input
                        type="text"
                        required
                        value={registerData.last_name}
                        onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">TC Kimlik No</label>
                    <input
                      type="text"
                      required
                      maxLength="11"
                      value={registerData.tc_no}
                      onChange={(e) => setRegisterData({ ...registerData, tc_no: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="11 haneli TC No"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0555 555 55 55"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bölüm</label>
                    <select
                      required
                      value={registerData.department}
                      onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Bölüm Seçin</option>
                      <option value="Bilgisayar Programcılığı">Bilgisayar Programcılığı</option>
                      <option value="Yazılım Mühendisliği">Yazılım Mühendisliği</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sınıf</label>
                    <select
                      required
                      value={registerData.class_level}
                      onChange={(e) => setRegisterData({ ...registerData, class_level: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1">1. Sınıf</option>
                      <option value="2">2. Sınıf</option>
                      <option value="3">3. Sınıf</option>
                      <option value="4">4. Sınıf</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
                    <input
                      type="password"
                      required
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="En az 6 karakter"
                      minLength="6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Şifre Tekrar</label>
                    <input
                      type="password"
                      required
                      value={registerData.password_confirm}
                      onChange={(e) => setRegisterData({ ...registerData, password_confirm: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Şifrenizi tekrar girin"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                  </button>

                  <p className="text-xs text-gray-600 text-center">
                    Kaydınız admin onayından sonra aktif olacaktır.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-white hover:text-blue-200 transition-colors"
          >
            ← Ana Sayfaya Dön
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OBSLoginPage;
