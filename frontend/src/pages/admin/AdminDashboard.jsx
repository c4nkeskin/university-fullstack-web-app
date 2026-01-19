import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Newspaper, 
  Megaphone, 
  Calendar, 
  Building2, 
  Images, 
  Settings, 
  LogOut,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Mail as MailIcon,
  Users,
  UserCheck,
  GraduationCap,
  CalendarDays,
  BookOpen,
  Phone,
  FileText
} from 'lucide-react';
import { newsAPI, announcementsAPI, eventsAPI, academicUnitsAPI, sliderAPI, api, usersAPI, footerAPI, academicStaffAPI, academicCalendarAPI, courseDepartmentsAPI, courseSchedulesAPI, contactPageSettingsAPI, aboutSettingsAPI, studentAPI } from '../../utils/api';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/admin/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchSettings();
  }, [navigate]);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Çıkış yapıldı');
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Kontrol Paneli', path: '/admin/dashboard', roles: ['admin', 'writer', 'support'] },
    { icon: Newspaper, label: 'Haberler', path: '/admin/news', roles: ['admin', 'writer'] },
    { icon: Megaphone, label: 'Duyurular', path: '/admin/announcements', roles: ['admin', 'writer'] },
    { icon: Calendar, label: 'Etkinlikler', path: '/admin/events', roles: ['admin', 'writer'] },
    { icon: Building2, label: 'Akademik Birimler', path: '/admin/units', roles: ['admin'] },
    { icon: GraduationCap, label: 'Akademik Kadro', path: '/admin/academic-staff', roles: ['admin'] },
    { icon: CalendarDays, label: 'Akademik Takvim', path: '/admin/academic-calendar', roles: ['admin'] },
    { icon: BookOpen, label: 'Ders Programları', path: '/admin/course-schedules', roles: ['admin'] },
    { icon: UserCheck, label: 'Öğrenci Yönetimi', path: '/admin/students', roles: ['admin'] },
    { icon: Images, label: 'Slider', path: '/admin/slider', roles: ['admin'] },
    { icon: FileText, label: 'Hakkımızda', path: '/admin/about-settings', roles: ['admin'] },
    { icon: Settings, label: 'Footer Ayarları', path: '/admin/footer', roles: ['admin'] },
    { icon: Phone, label: 'İletişim Ayarları', path: '/admin/contact-settings', roles: ['admin'] },
    { icon: MailIcon, label: 'Mesajlar', path: '/admin/messages', roles: ['admin', 'support'] },
    { icon: Users, label: 'Kullanıcı Yönetimi', path: '/admin/users', roles: ['admin'] },
  ];

  //Kullanıcı rolüne göre menü öğelerini filtrele
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'writer')
  );

  if (!user) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100" data-testid="admin-dashboard">
      {/* Kenar Çubuğu */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform transition-transform duration-300 lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Üst Bilgi (Başlık) */}
        <div className="flex items-center justify-between p-6 border-b border-blue-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            {settings?.site_logo ? (
              <img src={settings.site_logo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold">
                {settings?.site_name?.substring(0, 3) || 'ATA'}
              </div>
            )}
            <span className="font-bold">{settings?.site_name || 'Admin Panel'}</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Gezinme – Kaydırılabilir */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              data-testid={`menu-${item.label.toLowerCase().replace(/\s/g, '-')}`}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Kullanıcı Bilgileri ve Çıkış – Altta sabit */}
        <div className="p-4 border-t border-blue-700 flex-shrink-0">
          <div className="mb-3">
            <p className="text-sm text-blue-200">Hoş geldiniz,</p>
            <p className="font-semibold truncate">{user.full_name}</p>
            <p className="text-xs text-blue-300 mt-1 capitalize">{user.role === 'admin' ? 'Yönetici' : user.role === 'writer' ? 'Yazar' : 'Destek Ekibi'}</p>
          </div>
          <button
            onClick={handleLogout}
            data-testid="logout-button"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Ana içerik */}
      <div className="lg:ml-64">
        {/* Üst çubuk */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              data-testid="open-sidebar-button"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{settings?.site_name || 'Yönetim Paneli'}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
            </div>
          </div>
        </header>

        {/* Ana içerik */}
        <main className="p-6">
          <Routes>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardHome user={user} />} />
            <Route path="news" element={<NewsManager />} />
            <Route path="announcements" element={<AnnouncementsManager />} />
            <Route path="events" element={<EventsManager />} />
            <Route path="units" element={<UnitsManager />} />
            <Route path="academic-staff" element={<AcademicStaffManager />} />
            <Route path="academic-calendar" element={<AcademicCalendarManager />} />
            <Route path="course-schedules" element={<CourseScheduleManager />} />
            <Route path="students" element={<StudentsManager />} />
            <Route path="slider" element={<SliderManager />} />
            <Route path="about-settings" element={<AboutSettingsManager />} />
            <Route path="footer" element={<FooterManager />} />
            <Route path="contact-settings" element={<ContactSettingsManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="users" element={<UsersManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Kontrol Paneli Ana Bileşeni
const DashboardHome = ({ user }) => {
  const [stats, setStats] = useState({
    news: 0,
    announcements: 0,
    events: 0,
    units: 0
  });
  const [settings, setSettings] = useState(null);
  const [editingSettings, setEditingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    site_name: 'ATA ÜNİVERSİTESİ',
    site_tagline: 'Geleceği İnşa Eden Üniversite',
    site_logo: '',
    students_count: 15000,
    faculty_count: 800,
    faculties_count: 12,
    partnerships_count: 50
  });

  useEffect(() => {
    fetchStats();
    fetchSettings();
  }, []);

  const fetchStats = async () => {
    try {
      const [newsRes, announcementsRes, eventsRes, unitsRes] = await Promise.all([
        newsAPI.getAll(),
        announcementsAPI.getAll(),
        eventsAPI.getAll(),
        academicUnitsAPI.getAll()
      ]);

      setStats({
        news: newsRes.data.length,
        announcements: announcementsRes.data.length,
        events: eventsRes.data.length,
        units: unitsRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data);
      setSettingsForm({
        site_name: response.data.site_name || 'ATA ÜNİVERSİTESİ',
        site_tagline: response.data.site_tagline || 'Geleceği İnşa Eden Üniversite',
        site_logo: response.data.site_logo || '',
        students_count: response.data.students_count,
        faculty_count: response.data.faculty_count,
        faculties_count: response.data.faculties_count,
        partnerships_count: response.data.partnerships_count
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await api.put('/settings', settingsForm);
      toast.success('Ayarlar güncellendi');
      setEditingSettings(false);
      fetchSettings();
      window.location.reload(); // Gezinme çubuğunu güncellemek için yeniden yükle
    } catch (error) {
      toast.error('Hata oluştu');
    }
  };

  const cards = [
    { label: 'Toplam Haber', value: stats.news, color: 'from-blue-500 to-blue-700', icon: Newspaper },
    { label: 'Toplam Duyuru', value: stats.announcements, color: 'from-green-500 to-green-700', icon: Megaphone },
    { label: 'Toplam Etkinlik', value: stats.events, color: 'from-purple-500 to-purple-700', icon: Calendar },
    { label: 'Akademik Birim', value: stats.units, color: 'from-orange-500 to-orange-700', icon: Building2 },
  ];

  return (
    <div data-testid="dashboard-home">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Kontrol Paneli</h2>
      
      {/* Content Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            data-testid={`stat-card-${index}`}
            className="bg-white rounded-xl shadow-lg p-6 card-hover"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} text-white flex items-center justify-center mb-4`}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
            <p className="text-gray-600">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Site Ayarları – Yalnızca Yönetici için */}
      {user?.role === 'admin' && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Site Ayarları</h3>
              <p className="text-gray-600 mt-1">Logo, site adı, slogan ve istatistik ayarları</p>
            </div>
            {!editingSettings && (
              <Button 
                onClick={() => setEditingSettings(true)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
              >
                <Edit className="w-5 h-5" />
                <span>Düzenle</span>
              </Button>
            )}
          </div>

          {editingSettings ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Site Adı</label>
                <input
                  type="text"
                  value={settingsForm.site_name}
                  onChange={(e) => setSettingsForm({...settingsForm, site_name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slogan</label>
                <input
                  type="text"
                  value={settingsForm.site_tagline}
                  onChange={(e) => setSettingsForm({...settingsForm, site_tagline: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Logo URL (opsiyonel)</label>
                <input
                  type="url"
                  value={settingsForm.site_logo}
                  onChange={(e) => setSettingsForm({...settingsForm, site_logo: e.target.value})}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Öğrenci Sayısı</label>
                  <input
                    type="number"
                    value={settingsForm.students_count}
                    onChange={(e) => setSettingsForm({...settingsForm, students_count: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Akademisyen Sayısı</label>
                  <input
                    type="number"
                    value={settingsForm.faculty_count}
                    onChange={(e) => setSettingsForm({...settingsForm, faculty_count: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fakülte Sayısı</label>
                  <input
                    type="number"
                    value={settingsForm.faculties_count}
                    onChange={(e) => setSettingsForm({...settingsForm, faculties_count: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Uluslararası İşbirliği</label>
                  <input
                    type="number"
                    value={settingsForm.partnerships_count}
                    onChange={(e) => setSettingsForm({...settingsForm, partnerships_count: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={handleUpdateSettings}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Kaydet
                </Button>
                <Button 
                  onClick={() => setEditingSettings(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600"
                >
                  İptal
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-xl">
                  {settings?.site_name?.substring(0, 3) || 'ATA'}
                </div>
                <div>
                  <h4 className="text-xl font-bold">{settings?.site_name}</h4>
                  <p className="text-gray-600">{settings?.site_tagline}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Öğrenci</p>
                  <p className="text-2xl font-bold text-gray-900">{settings?.students_count?.toLocaleString('tr-TR')}+</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Akademisyen</p>
                  <p className="text-2xl font-bold text-gray-900">{settings?.faculty_count?.toLocaleString('tr-TR')}+</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Fakülte</p>
                  <p className="text-2xl font-bold text-gray-900">{settings?.faculties_count}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">İşbirliği</p>
                  <p className="text-2xl font-bold text-gray-900">{settings?.partnerships_count}+</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Haber Yöneticisi Bileşeni
const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image_url: '',
    is_featured: false
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await newsAPI.getAll();
      setNews(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await newsAPI.update(editingNews.id, formData);
        toast.success('Haber güncellendi');
      } else {
        await newsAPI.create(formData);
        toast.success('Haber eklendi');
      }
      setDialogOpen(false);
      resetForm();
      fetchNews();
    } catch (error) {
      toast.error('Hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu haberi silmek istediğinizden emin misiniz?')) {
      try {
        await newsAPI.delete(id);
        toast.success('Haber silindi');
        fetchNews();
      } catch (error) {
        toast.error('Hata oluştu');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      summary: item.summary,
      content: item.content,
      image_url: item.image_url,
      is_featured: item.is_featured
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      summary: '',
      content: '',
      image_url: '',
      is_featured: false
    });
  };

  return (
    <div data-testid="news-manager">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Haberler</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} data-testid="add-news-button" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5" />
              <span>Yeni Haber</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingNews ? 'Haber Düzenle' : 'Yeni Haber Ekle'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Başlık *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Özet *</label>
                <textarea
                  required
                  rows="2"
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">İçerik *</label>
                <textarea
                  required
                  rows="4"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Görsel URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Öne Çıkan</label>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {editingNews ? 'Güncelle' : 'Ekle'}
                </Button>
                <Button type="button" onClick={() => setDialogOpen(false)} className="flex-1 bg-gray-500 hover:bg-gray-600">
                  İptal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Görsel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {news.map((item) => (
                <tr key={item.id} data-testid={`news-row-${item.id}`}>
                  <td className="px-6 py-4">
                    <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate">{item.title}</td>
                  <td className="px-6 py-4">{new Date(item.published_date).toLocaleDateString('tr-TR')}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-700 mr-3"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      data-testid={`delete-news-${item.id}`}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Duyuru Yöneticisi – Benzer uygulama
const AnnouncementsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    is_active: true
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await announcementsAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await announcementsAPI.update(editingItem.id, formData);
        toast.success('Duyuru güncellendi');
      } else {
        await announcementsAPI.create(formData);
        toast.success('Duyuru eklendi');
      }
      setDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error) {
      toast.error('Hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
      try {
        await announcementsAPI.delete(id);
        toast.success('Duyuru silindi');
        fetchItems();
      } catch (error) {
        toast.error('Hata oluştu');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      priority: item.priority,
      is_active: item.is_active
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      content: '',
      priority: 'normal',
      is_active: true
    });
  };

  return (
    <div data-testid="announcements-manager">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Duyurular</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700">
              <Plus className="w-5 h-5" />
              <span>Yeni Duyuru</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Duyuru Düzenle' : 'Yeni Duyuru Ekle'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Başlık *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">İçerik *</label>
                <textarea
                  required
                  rows="4"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Öncelik</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="low">Düşük</option>
                  <option value="normal">Normal</option>
                  <option value="high">Yüksek</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Aktif</label>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  {editingItem ? 'Güncelle' : 'Ekle'}
                </Button>
                <Button type="button" onClick={() => setDialogOpen(false)} className="flex-1 bg-gray-500 hover:bg-gray-600">
                  İptal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.priority === 'high' ? 'bg-red-100 text-red-700' :
                    item.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.priority === 'high' ? 'Yüksek' : item.priority === 'normal' ? 'Normal' : 'Düşük'}
                  </span>
                  {item.is_active && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Aktif</span>
                  )}
                </div>
                <p className="text-gray-600">{item.content}</p>
                <p className="text-sm text-gray-400 mt-2">{new Date(item.published_date).toLocaleDateString('tr-TR')}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Etkinlik Yöneticisi – Haberlere benzer
const EventsManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    image_url: '',
    category: 'etkinlik'
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await eventsAPI.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await eventsAPI.update(editingItem.id, formData);
        toast.success('Etkinlik güncellendi');
      } else {
        await eventsAPI.create(formData);
        toast.success('Etkinlik eklendi');
      }
      setDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error) {
      toast.error('Hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
      try {
        await eventsAPI.delete(id);
        toast.success('Etkinlik silindi');
        fetchItems();
      } catch (error) {
        toast.error('Hata oluştu');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      event_date: item.event_date,
      location: item.location,
      image_url: item.image_url || '',
      category: item.category
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      event_date: '',
      location: '',
      image_url: '',
      category: 'etkinlik'
    });
  };

  return (
    <div data-testid="events-manager">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Etkinlikler</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700">
              <Plus className="w-5 h-5" />
              <span>Yeni Etkinlik</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Etkinlik Düzenle' : 'Yeni Etkinlik Ekle'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Başlık *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Açıklama *</label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Etkinlik Tarihi *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.event_date}
                  onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Konum *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Görsel URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                  {editingItem ? 'Güncelle' : 'Ekle'}
                </Button>
                <Button type="button" onClick={() => setDialogOpen(false)} className="flex-1 bg-gray-500 hover:bg-gray-600">
                  İptal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Konum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4">{new Date(item.event_date).toLocaleDateString('tr-TR')}</td>
                  <td className="px-6 py-4">{item.location}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-700 mr-3"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Birim Yöneticisi – Tam uygulama
const UnitsManager = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'faculty',
    description: '',
    dean_name: '',
    contact_email: '',
    contact_phone: '',
    departments: [],
    image_url: ''
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await academicUnitsAPI.getAll();
      setUnits(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUnit) {
        await academicUnitsAPI.update(editingUnit.id, formData);
        toast.success('Akademik birim güncellendi');
      } else {
        await academicUnitsAPI.create(formData);
        toast.success('Akademik birim eklendi');
      }
      setDialogOpen(false);
      resetForm();
      fetchUnits();
    } catch (error) {
      toast.error('Hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu birimi silmek istediğinizden emin misiniz?')) {
      try {
        await academicUnitsAPI.delete(id);
        toast.success('Akademik birim silindi');
        fetchUnits();
      } catch (error) {
        toast.error('Hata oluştu');
      }
    }
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setFormData({
      name: unit.name,
      type: unit.type,
      description: unit.description,
      dean_name: unit.dean_name || '',
      contact_email: unit.contact_email || '',
      contact_phone: unit.contact_phone || '',
      departments: unit.departments || [],
      image_url: unit.image_url || ''
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingUnit(null);
    setFormData({
      name: '',
      type: 'faculty',
      description: '',
      dean_name: '',
      contact_email: '',
      contact_phone: '',
      departments: [],
      image_url: ''
    });
  };

  return (
    <div data-testid="units-manager">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Akademik Birimler</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700">
              <Plus className="w-5 h-5" />
              <span>Yeni Birim</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingUnit ? 'Birim Düzenle' : 'Yeni Akademik Birim Ekle'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Birim Adı *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Birim Türü *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="faculty">Fakülte</option>
                  <option value="vocational_school">Meslek Yüksekokulu</option>
                  <option value="institute">Enstitü</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Açıklama *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dekan/Müdür Adı</label>
                <input
                  type="text"
                  value={formData.dean_name}
                  onChange={(e) => setFormData({...formData, dean_name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">E-posta</label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Görsel URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bölümler (virgülle ayırın)</label>
                <input
                  type="text"
                  value={formData.departments.join(', ')}
                  onChange={(e) => setFormData({...formData, departments: e.target.value.split(',').map(d => d.trim()).filter(d => d)})}
                  placeholder="Bilgisayar Mühendisliği, Elektrik Mühendisliği"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
                  {editingUnit ? 'Güncelle' : 'Ekle'}
                </Button>
                <Button type="button" onClick={() => setDialogOpen(false)} className="flex-1 bg-gray-500 hover:bg-gray-600">
                  İptal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Birim Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tür</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dekan/Müdür</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {units.map((unit) => (
                <tr key={unit.id}>
                  <td className="px-6 py-4">{unit.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                      {unit.type === 'faculty' ? 'Fakülte' : unit.type === 'vocational_school' ? 'MYO' : 'Enstitü'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{unit.dean_name || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(unit)}
                      className="text-blue-600 hover:text-blue-700 mr-3"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(unit.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Slider Yöneticisi – Tam uygulama
const SliderManager = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await sliderAPI.getAll();
      setSliders(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSlider) {
        await sliderAPI.update(editingSlider.id, formData);
        toast.success('Slider güncellendi');
      } else {
        await sliderAPI.create(formData);
        toast.success('Slider eklendi');
      }
      setDialogOpen(false);
      resetForm();
      fetchSliders();
    } catch (error) {
      toast.error('Hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu slider\'ı silmek istediğinizden emin misiniz?')) {
      try {
        await sliderAPI.delete(id);
        toast.success('Slider silindi');
        fetchSliders();
      } catch (error) {
        toast.error('Hata oluştu');
      }
    }
  };

  const handleEdit = (slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle || '',
      image_url: slider.image_url,
      link_url: slider.link_url || '',
      order: slider.order,
      is_active: slider.is_active
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingSlider(null);
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '',
      order: 0,
      is_active: true
    });
  };

  return (
    <div data-testid="slider-manager">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Slider Yönetimi</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-5 h-5" />
              <span>Yeni Slider</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSlider ? 'Slider Düzenle' : 'Yeni Slider Ekle'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Başlık *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Alt Başlık</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Görsel URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Link URL</label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sıra</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Aktif</label>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  {editingSlider ? 'Güncelle' : 'Ekle'}
                </Button>
                <Button type="button" onClick={() => setDialogOpen(false)} className="flex-1 bg-gray-500 hover:bg-gray-600">
                  İptal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {sliders.map((slider) => (
            <div key={slider.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex">
              <img src={slider.image_url} alt={slider.title} className="w-48 h-32 object-cover" />
              <div className="flex-1 p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">{slider.title}</h3>
                  <p className="text-gray-600 mb-2">{slider.subtitle}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Sıra: {slider.order}</span>
                    {slider.is_active && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Aktif
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(slider)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(slider.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Mesaj Yöneticisi – İletişim Formu Mesajları
const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/contact-messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/contact-messages/${id}/read`);
      toast.success('Mesaj okundu olarak işaretlendi');
      fetchMessages();
    } catch (error) {
      toast.error('Hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/contact-messages/${id}`);
        toast.success('Mesaj silindi');
        fetchMessages();
        setDialogOpen(false);
      } catch (error) {
        toast.error('Hata oluştu');
      }
    }
  };

  const handleView = (message) => {
    setSelectedMessage(message);
    setDialogOpen(true);
    if (!message.is_read) {
      handleMarkRead(message.id);
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div data-testid="messages-manager">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">İletişim Mesajları</h2>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 && (
              <span className="text-blue-600 font-semibold">{unreadCount} okunmamış mesaj</span>
            )}
            {unreadCount === 0 && <span>Tüm mesajlar okundu</span>}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : messages.length > 0 ? (
        <div className="grid gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl ${
                !message.is_read ? 'border-l-4 border-blue-600' : ''
              }`}
              onClick={() => handleView(message)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{message.name}</h3>
                    {!message.is_read && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        Yeni
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">E-posta:</span> {message.email}
                  </p>
                  <p className="text-gray-900 font-semibold mb-2">
                    <span className="text-gray-600 font-normal">Konu:</span> {message.subject}
                  </p>
                  <p className="text-gray-600 line-clamp-2">{message.message}</p>
                  <p className="text-sm text-gray-400 mt-3">
                    {new Date(message.created_at).toLocaleString('tr-TR')}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(message.id);
                  }}
                  className="text-red-600 hover:text-red-700 ml-4"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
          <MailIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">Henüz mesaj bulunmamaktadır.</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mesaj Detayı</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <p className="text-lg font-semibold">{selectedMessage.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                <p className="text-lg font-semibold">{selectedMessage.subject}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gönderilme Tarihi</label>
                <p className="text-gray-600">{new Date(selectedMessage.created_at).toLocaleString('tr-TR')}</p>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Sil
                </Button>
                <Button
                  onClick={() => setDialogOpen(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600"
                >
                  Kapat
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Kullanıcı Yöneticisi Bileşeni
const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: 'writer'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Kullanıcılar yüklenirken hata oluştu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingUser) {
        // Kullanıcıyı güncelle – yalnızca değişen alanları gönder
        const updateData = {};
        if (formData.username !== editingUser.username) updateData.username = formData.username;
        if (formData.email !== editingUser.email) updateData.email = formData.email;
        if (formData.full_name !== editingUser.full_name) updateData.full_name = formData.full_name;
        if (formData.role !== editingUser.role) updateData.role = formData.role;
        if (formData.password) updateData.password = formData.password;

        await usersAPI.update(editingUser.id, updateData);
        toast.success('Kullanıcı güncellendi');
      } else {
        // Create new user
        await usersAPI.create(formData);
        toast.success('Kullanıcı oluşturuldu');
      }
      
      setDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(error.response?.data?.detail || 'Kullanıcı kaydedilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      full_name: user.full_name,
      role: user.role
    });
    setDialogOpen(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;

    try {
      await usersAPI.delete(userId);
      toast.success('Kullanıcı silindi');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.detail || 'Kullanıcı silinirken hata oluştu');
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      full_name: '',
      role: 'writer'
    });
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: 'bg-purple-100 text-purple-800',
      writer: 'bg-blue-100 text-blue-800',
      support: 'bg-green-100 text-green-800'
    };
    const roleNames = {
      admin: 'Yönetici',
      writer: 'Yazar',
      support: 'Destek Ekibi'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[role]}`}>
        {roleNames[role]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>
          <p className="text-gray-600 mt-1">Toplam {users.length} kullanıcı</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              Yeni Kullanıcı
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre {editingUser && '(Boş bırakılırsa değiştirilmez)'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={editingUser ? 'Şifre değiştirmek için yazın' : 'Şifre'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="writer">Yazar</option>
                  <option value="support">Destek Ekibi</option>
                  <option value="admin">Yönetici</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600"
                >
                  İptal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{user.full_name}</h3>
                  {getRoleBadge(user.role)}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Kullanıcı Adı:</span> {user.username}</p>
                  <p><span className="font-medium">E-posta:</span> {user.email}</p>
                  <p><span className="font-medium">Kayıt Tarihi:</span> {new Date(user.created_at).toLocaleDateString('tr-TR')}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {user.username !== 'admin' ? (
                  <>
                    <Button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                    Default Admin (Korumalı)
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Henüz kullanıcı bulunmuyor</p>
        </div>
      )}
    </div>
  );
};

// Alt Bilgi Yöneticisi Bileşeni
const FooterManager = () => {
  const [footerSettings, setFooterSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    try {
      const response = await footerAPI.getSettings();
      setFooterSettings(response.data);
    } catch (error) {
      console.error('Error fetching footer settings:', error);
      toast.error('Footer ayarları yüklenirken hata oluştu');
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await footerAPI.updateSettings(footerSettings);
      toast.success('Footer ayarları güncellendi');
    } catch (error) {
      console.error('Error updating footer settings:', error);
      toast.error('Ayarlar güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Footer Ayarları</h2>
      </div>

      {footerSettings && (
        <div className="bg-white rounded-xl shadow p-6">
          <form onSubmit={handleUpdateSettings} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama Metni</label>
              <textarea
                value={footerSettings.description}
                onChange={(e) => setFooterSettings({ ...footerSettings, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                <input
                  type="text"
                  value={footerSettings.address}
                  onChange={(e) => setFooterSettings({ ...footerSettings, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <input
                  type="text"
                  value={footerSettings.phone}
                  onChange={(e) => setFooterSettings({ ...footerSettings, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                <input
                  type="email"
                  value={footerSettings.email}
                  onChange={(e) => setFooterSettings({ ...footerSettings, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sosyal Medya Linkleri</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                  <input
                    type="url"
                    value={footerSettings.facebook_url || ''}
                    onChange={(e) => setFooterSettings({ ...footerSettings, facebook_url: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                  <input
                    type="url"
                    value={footerSettings.twitter_url || ''}
                    onChange={(e) => setFooterSettings({ ...footerSettings, twitter_url: e.target.value })}
                    placeholder="https://twitter.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                  <input
                    type="url"
                    value={footerSettings.instagram_url || ''}
                    onChange={(e) => setFooterSettings({ ...footerSettings, instagram_url: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={footerSettings.linkedin_url || ''}
                    onChange={(e) => setFooterSettings({ ...footerSettings, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                  <input
                    type="url"
                    value={footerSettings.youtube_url || ''}
                    onChange={(e) => setFooterSettings({ ...footerSettings, youtube_url: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

// Akademik Personel Yöneticisi Bileşeni
const AcademicStaffManager = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    department: '',
    email: '',
    phone: '',
    office: '',
    bio: '',
    image_url: '',
    order: 0
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await academicStaffAPI.getAll();
      setStaff(response.data);
    } catch (error) {
      toast.error('Kadro bilgileri alınamadı');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingStaff) {
        await academicStaffAPI.update(editingStaff.id, formData);
        toast.success('Akademisyen güncellendi');
      } else {
        await academicStaffAPI.create(formData);
        toast.success('Akademisyen eklendi');
      }
      fetchStaff();
      resetForm();
    } catch (error) {
      toast.error('İşlem başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData(staffMember);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu akademisyeni silmek istediğinizden emin misiniz?')) {
      try {
        await academicStaffAPI.delete(id);
        toast.success('Akademisyen silindi');
        fetchStaff();
      } catch (error) {
        toast.error('Silme işlemi başarısız');
      }
    }
  };

  const resetForm = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      title: '',
      department: '',
      email: '',
      phone: '',
      office: '',
      bio: '',
      image_url: '',
      order: 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Akademik Kadro Yönetimi</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingStaff ? 'Akademisyen Düzenle' : 'Yeni Akademisyen Ekle'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unvan *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Prof. Dr., Doç. Dr., vb."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bölüm *</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ofis</label>
              <input
                type="text"
                value={formData.office}
                onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fotoğraf URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Biyografi</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Kaydediliyor...' : editingStaff ? 'Güncelle' : 'Ekle'}
              </Button>
              {editingStaff && (
                <Button type="button" onClick={resetForm} variant="outline">
                  İptal
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Liste */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Akademik Kadro Listesi</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {staff.map((member) => (
              <div key={member.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{member.name}</h4>
                  <p className="text-sm text-blue-600">{member.title}</p>
                  <p className="text-sm text-gray-600">{member.department}</p>
                  <p className="text-xs text-gray-500 mt-1">{member.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Akademik Takvim Yöneticisi Bileşeni
const AcademicCalendarManager = () => {
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    start_date: '',
    end_date: '',
    description: '',
    semester: 'Güz',
    year: '2024-2025',
    order: 0
  });

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      const response = await academicCalendarAPI.getAll();
      setCalendar(response.data);
    } catch (error) {
      toast.error('Takvim bilgileri alınamadı');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingEvent) {
        await academicCalendarAPI.update(editingEvent.id, formData);
        toast.success('Etkinlik güncellendi');
      } else {
        await academicCalendarAPI.create(formData);
        toast.success('Etkinlik eklendi');
      }
      fetchCalendar();
      resetForm();
    } catch (error) {
      toast.error('İşlem başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData(event);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
      try {
        await academicCalendarAPI.delete(id);
        toast.success('Etkinlik silindi');
        fetchCalendar();
      } catch (error) {
        toast.error('Silme işlemi başarısız');
      }
    }
  };

  const resetForm = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      start_date: '',
      end_date: '',
      description: '',
      semester: 'Güz',
      year: '2024-2025',
      order: 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Akademik Takvim Yönetimi</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingEvent ? 'Etkinlik Düzenle' : 'Yeni Etkinlik Ekle'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dönem *</label>
                <select
                  required
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Güz">Güz</option>
                  <option value="Bahar">Bahar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Akademik Yıl *</label>
                <input
                  type="text"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2024-2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç Tarihi *</label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi *</label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Kaydediliyor...' : editingEvent ? 'Güncelle' : 'Ekle'}
              </Button>
              {editingEvent && (
                <Button type="button" onClick={resetForm} variant="outline">
                  İptal
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Liste */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Takvim Etkinlikleri</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {calendar.map((event) => (
              <div key={event.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                  <p className="text-sm text-blue-600">{event.semester} {event.year}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {event.start_date} - {event.end_date}
                  </p>
                  {event.description && (
                    <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Ders Programı Yöneticisi Bileşeni
const CourseScheduleManager = () => {
  const [departments, setDepartments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [deptFormData, setDeptFormData] = useState({ name: '', order: 0 });
  const [scheduleFormData, setScheduleFormData] = useState({
    department_id: '',
    day: 'Pazartesi',
    start_time: '09:00',
    end_time: '10:00',
    course_name: '',
    room: '',
    instructor: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchSchedules(selectedDepartment);
    }
  }, [selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const response = await courseDepartmentsAPI.getAll();
      setDepartments(response.data);
      if (response.data.length > 0 && !selectedDepartment) {
        setSelectedDepartment(response.data[0].id);
      }
    } catch (error) {
      toast.error('Bölüm bilgileri alınamadı');
    }
  };

  const fetchSchedules = async (deptId) => {
    try {
      const response = await courseSchedulesAPI.getAll(deptId);
      setSchedules(response.data);
    } catch (error) {
      toast.error('Ders programı alınamadı');
    }
  };

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await courseDepartmentsAPI.create(deptFormData);
      toast.success('Bölüm eklendi');
      fetchDepartments();
      setShowDeptForm(false);
      setDeptFormData({ name: '', order: 0 });
    } catch (error) {
      toast.error('Bölüm eklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { ...scheduleFormData, department_id: selectedDepartment };

    try {
      if (editingSchedule) {
        await courseSchedulesAPI.update(editingSchedule.id, data);
        toast.success('Ders güncellendi');
      } else {
        await courseSchedulesAPI.create(data);
        toast.success('Ders eklendi');
      }
      fetchSchedules(selectedDepartment);
      resetScheduleForm();
    } catch (error) {
      toast.error('İşlem başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      try {
        await courseSchedulesAPI.delete(id);
        toast.success('Ders silindi');
        fetchSchedules(selectedDepartment);
      } catch (error) {
        toast.error('Silme işlemi başarısız');
      }
    }
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setScheduleFormData({
      department_id: schedule.department_id,
      day: schedule.day,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      course_name: schedule.course_name,
      room: schedule.room,
      instructor: schedule.instructor || ''
    });
  };

  const resetScheduleForm = () => {
    setEditingSchedule(null);
    setScheduleFormData({
      department_id: selectedDepartment,
      day: 'Pazartesi',
      start_time: '09:00',
      end_time: '10:00',
      course_name: '',
      room: '',
      instructor: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Ders Programları Yönetimi</h2>
        <Button onClick={() => setShowDeptForm(!showDeptForm)} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Bölüm Ekle
        </Button>
      </div>

      {/* Bölüm Formu */}
      {showDeptForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Yeni Bölüm Ekle</h3>
          <form onSubmit={handleDeptSubmit} className="flex gap-4">
            <input
              type="text"
              required
              placeholder="Bölüm Adı"
              value={deptFormData.name}
              onChange={(e) => setDeptFormData({ ...deptFormData, name: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Sıra"
              value={deptFormData.order}
              onChange={(e) => setDeptFormData({ ...deptFormData, order: parseInt(e.target.value) })}
              className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" disabled={loading}>
              Ekle
            </Button>
            <Button type="button" onClick={() => setShowDeptForm(false)} variant="outline">
              İptal
            </Button>
          </form>
        </div>
      )}

      {/* Bölüm Sekmeleri */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setSelectedDepartment(dept.id)}
            className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap ${
              selectedDepartment === dept.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {dept.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program Formu */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingSchedule ? 'Ders Düzenle' : 'Yeni Ders Ekle'}
          </h3>
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gün *</label>
              <select
                required
                value={scheduleFormData.day}
                onChange={(e) => setScheduleFormData({ ...scheduleFormData, day: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pazartesi">Pazartesi</option>
                <option value="Salı">Salı</option>
                <option value="Çarşamba">Çarşamba</option>
                <option value="Perşembe">Perşembe</option>
                <option value="Cuma">Cuma</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlangıç *</label>
                <input
                  type="time"
                  required
                  value={scheduleFormData.start_time}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, start_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş *</label>
                <input
                  type="time"
                  required
                  value={scheduleFormData.end_time}
                  onChange={(e) => setScheduleFormData({ ...scheduleFormData, end_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ders Adı *</label>
              <input
                type="text"
                required
                value={scheduleFormData.course_name}
                onChange={(e) => setScheduleFormData({ ...scheduleFormData, course_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Derslik *</label>
              <input
                type="text"
                required
                value={scheduleFormData.room}
                onChange={(e) => setScheduleFormData({ ...scheduleFormData, room: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Öğretim Görevlisi</label>
              <input
                type="text"
                value={scheduleFormData.instructor}
                onChange={(e) => setScheduleFormData({ ...scheduleFormData, instructor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Kaydediliyor...' : editingSchedule ? 'Güncelle' : 'Ekle'}
              </Button>
              {editingSchedule && (
                <Button type="button" onClick={resetScheduleForm} variant="outline">
                  İptal
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Program Listesi */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Ders Listesi ({departments.find(d => d.id === selectedDepartment)?.name})
          </h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{schedule.course_name}</h4>
                  <p className="text-sm text-blue-600">{schedule.day} • {schedule.start_time} - {schedule.end_time}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Derslik: {schedule.room}
                    {schedule.instructor && ` • ${schedule.instructor}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSchedule(schedule)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Öğrenci Yöneticisi Bileşeni
const StudentsManager = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    tc_no: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: '',
    class_level: '1',
    password: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await studentAPI.approve(id);
      toast.success('Öğrenci onaylandı');
      fetchStudents();
    } catch (error) {
      toast.error('Hata oluştu');
    }
  };

  const handleReject = async (id) => {
    try {
      await studentAPI.reject(id);
      toast.success('Öğrenci reddedildi');
      fetchStudents();
    } catch (error) {
      toast.error('Hata oluştu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentAPI.update(editingStudent.id, formData);
        toast.success('Öğrenci güncellendi');
      } else {
        await studentAPI.register(formData);
        toast.success('Öğrenci eklendi');
      }
      setDialogOpen(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      try {
        await studentAPI.delete(id);
        toast.success('Öğrenci silindi');
        fetchStudents();
      } catch (error) {
        toast.error('Hata oluştu');
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      tc_no: student.tc_no,
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      phone: student.phone || '',
      department: student.department,
      class_level: student.class_level,
      password: '',
      status: student.status
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingStudent(null);
    setFormData({
      tc_no: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      department: '',
      class_level: '1',
      password: '',
      status: 'pending'
    });
  };

  return (
    <div data-testid="students-manager">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Öğrenci Yönetimi</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5" />
              <span>Yeni Öğrenci</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStudent ? 'Öğrenci Düzenle' : 'Yeni Öğrenci Ekle'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">TC Kimlik No *</label>
                <input
                  type="text"
                  required
                  maxLength="11"
                  value={formData.tc_no}
                  onChange={(e) => setFormData({...formData, tc_no: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="11 haneli TC No"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ad *</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Soyad *</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">E-posta *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bölüm *</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Bölüm Seçin</option>
                  <option value="Bilgisayar Programcılığı">Bilgisayar Programcılığı</option>
                  <option value="Yazılım Mühendisliği">Yazılım Mühendisliği</option>
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sınıf *</label>
                  <select
                    value={formData.class_level}
                    onChange={(e) => setFormData({...formData, class_level: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">1. Sınıf</option>
                    <option value="2">2. Sınıf</option>
                    <option value="3">3. Sınıf</option>
                    <option value="4">4. Sınıf</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Durum *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Onay Bekliyor</option>
                    <option value="approved">Onaylandı</option>
                    <option value="rejected">Reddedildi</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Şifre {editingStudent ? '(Değiştirmek için doldurun)' : '*'}</label>
                <input
                  type="password"
                  required={!editingStudent}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="En az 6 karakter"
                  minLength="6"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {editingStudent ? 'Güncelle' : 'Ekle'}
                </Button>
                <Button type="button" onClick={() => setDialogOpen(false)} className="flex-1 bg-gray-500 hover:bg-gray-600">
                  İptal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Öğrenci No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ad Soyad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bölüm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sınıf</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} data-testid={`student-row-${student.id}`}>
                  <td className="px-6 py-4 font-mono">{student.student_no}</td>
                  <td className="px-6 py-4">{student.first_name} {student.last_name}</td>
                  <td className="px-6 py-4">{student.department}</td>
                  <td className="px-6 py-4">{student.class_level}. Sınıf</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      student.status === 'approved' ? 'bg-green-100 text-green-700' :
                      student.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {student.status === 'approved' ? 'Onaylandı' :
                       student.status === 'rejected' ? 'Reddedildi' : 'Onay Bekliyor'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {student.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(student.id)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Onayla
                        </button>
                        <button
                          onClick={() => handleReject(student.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Reddet
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      data-testid={`delete-student-${student.id}`}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Hakkında Ayarları Yöneticisi Bileşeni
const AboutSettingsManager = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    hero_title: '',
    hero_description: '',
    main_title: '',
    main_image_url: '',
    main_paragraph1: '',
    main_paragraph2: '',
    mission_title: '',
    mission_description: '',
    vision_title: '',
    vision_description: '',
    values_title: '',
    values_description: '',
    social_title: '',
    social_description: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await aboutSettingsAPI.get();
      setSettings(response.data);
    } catch (error) {
      toast.error('Ayarlar alınamadı');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await aboutSettingsAPI.update(settings);
      toast.success('Hakkımızda ayarları güncellendi');
    } catch (error) {
      toast.error('Güncelleme başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Hakkımızda Sayfası Ayarları</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Öne Çıkan Bölüm */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Hero Bölümü</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                <input
                  type="text"
                  value={settings.hero_title}
                  onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={settings.hero_description}
                  onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Ana İçerik */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Ana İçerik</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                <input
                  type="text"
                  value={settings.main_title}
                  onChange={(e) => setSettings({ ...settings, main_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Görsel URL</label>
                <input
                  type="url"
                  value={settings.main_image_url}
                  onChange={(e) => setSettings({ ...settings, main_image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraf 1</label>
                <textarea
                  value={settings.main_paragraph1}
                  onChange={(e) => setSettings({ ...settings, main_paragraph1: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraf 2</label>
                <textarea
                  value={settings.main_paragraph2}
                  onChange={(e) => setSettings({ ...settings, main_paragraph2: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Değerler – Misyon */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Misyon</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                <input
                  type="text"
                  value={settings.mission_title}
                  onChange={(e) => setSettings({ ...settings, mission_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={settings.mission_description}
                  onChange={(e) => setSettings({ ...settings, mission_description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Değerler – Vizyon */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Vizyon</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                <input
                  type="text"
                  value={settings.vision_title}
                  onChange={(e) => setSettings({ ...settings, vision_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={settings.vision_description}
                  onChange={(e) => setSettings({ ...settings, vision_description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/*Değerler – Değerler */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Değerler</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                <input
                  type="text"
                  value={settings.values_title}
                  onChange={(e) => setSettings({ ...settings, values_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={settings.values_description}
                  onChange={(e) => setSettings({ ...settings, values_description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Değerler – Toplumsal Sorumluluk */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Toplumsal Sorumluluk</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                <input
                  type="text"
                  value={settings.social_title}
                  onChange={(e) => setSettings({ ...settings, social_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={settings.social_description}
                  onChange={(e) => setSettings({ ...settings, social_description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
            {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </Button>
        </form>
      </div>
    </div>
  );
};

// İletişim Ayarları Yöneticisi Bileşeni
const ContactSettingsManager = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    address: '',
    phone: '',
    email: '',
    map_lat: 39.9334,
    map_lng: 32.8597
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await contactPageSettingsAPI.get();
      setSettings(response.data);
    } catch (error) {
      toast.error('Ayarlar alınamadı');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactPageSettingsAPI.update(settings);
      toast.success('İletişim ayarları güncellendi');
    } catch (error) {
      toast.error('Güncelleme başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">İletişim Sayfası Ayarları</h2>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adres *</label>
            <textarea
              required
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="+90 (123) 456 78 90"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta *</label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="info@ata.edu.tr"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harita Enlem</label>
              <input
                type="number"
                step="any"
                value={settings.map_lat}
                onChange={(e) => setSettings({ ...settings, map_lat: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Harita Boylam</label>
              <input
                type="number"
                step="any"
                value={settings.map_lng}
                onChange={(e) => setSettings({ ...settings, map_lng: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
