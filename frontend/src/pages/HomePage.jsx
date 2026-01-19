import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { newsAPI, announcementsAPI, sliderAPI, settingsAPI } from '../utils/api';
import { Calendar, ChevronRight, BookOpen, Users, Award, Building2, GraduationCap, Library, X } from 'lucide-react';

const HomePage = () => {
  const [sliderImages, setSliderImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [news, setNews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sliderRes, newsRes, announcementsRes, settingsRes] = await Promise.all([
        sliderAPI.getAll(),
        newsAPI.getAll(),
        announcementsAPI.getAll(),
        settingsAPI.get(),
      ]);

      const defaultSliders = [
        {
          id: '1',
          title: 'ATA Üniversitesine Hoş Geldiniz',
          subtitle: 'Geleceği İnşa Eden Üniversite',
          image_url: 'https://images.unsplash.com/photo-1536982679170-1b2277759c92',
          order: 0
        },
        {
          id: '2',
          title: 'Modern Eğitim Anlayışı',
          subtitle: 'Yenilikçi ve Araştırmacı Yaklaşım',
          image_url: 'https://images.unsplash.com/photo-1652781912434-441c245a8481',
          order: 1
        },
        {
          id: '3',
          title: 'Akademik Mükemmeliyet',
          subtitle: 'Dünya Standartlarında Eğitim',
          image_url: 'https://images.unsplash.com/photo-1698785029841-c1e907fb33b7',
          order: 2
        }
      ];

      setSliderImages(sliderRes.data.length > 0 ? sliderRes.data : defaultSliders);
      setNews(newsRes.data.slice(0, 3));
      setAnnouncements(announcementsRes.data.slice(0, 6));
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sliderImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [sliderImages.length]);

  const stats = [
    { icon: Users, value: `${settings?.students_count || 15000}+`, label: 'Öğrenci' },
    { icon: GraduationCap, value: `${settings?.faculty_count || 800}+`, label: 'Akademisyen' },
    { icon: Building2, value: settings?.faculties_count || 12, label: 'Fakülte' },
    { icon: Award, value: `${settings?.partnerships_count || 50}+`, label: 'Uluslararası İşbirliği' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="home-page">
      <Navbar />

      {/* Hero Slider – Azaltılmış yükseklik */}
      <section className="relative h-[500px] overflow-hidden" data-testid="hero-slider">
        {sliderImages.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image_url})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-transparent"></div>
            </div>
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl animate-fade-in-up">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to="/hakkimizda"
                      data-testid="hero-about-button"
                      className="btn-primary inline-flex items-center"
                    >
                      Hakkımızda
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Link>
                    <Link
                      to="/fakulteler"
                      data-testid="hero-faculties-button"
                      className="btn-secondary"
                    >
                      Akademik Birimler
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Kaydırıcı Noktaları */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-50 pointer-events-auto">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              data-testid={`slider-dot-${index}`}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all cursor-pointer hover:scale-110 pointer-events-auto ${
                index === currentSlide 
                  ? 'w-8 h-3 rounded-full bg-white shadow-lg' 
                  : 'w-3 h-3 rounded-full bg-white/50 hover:bg-white/70 shadow-md'
              }`}
              aria-label={`Slide ${index + 1}'e git`}
            />
          ))}
        </div>

        {/* Gezinme Okları */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all hover:scale-110"
          aria-label="Önceki slide"
        >
          <ChevronRight className="w-6 h-6 text-white rotate-180" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all hover:scale-110"
          aria-label="Sonraki slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </section>

      {/* Ana İçerik – 2 Sütunlu Düzen */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Sol Sütun – Ana İçerik (3/4 genişlik) */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Haberler Bölümü */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="bg-white/20 p-2 rounded-lg mr-3">📰</span>
                    Son Haberler
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {news.length > 0 ? (
                      news.map((item, index) => (
                        <Link
                          key={item.id}
                          to={`/haberler/${item.id}`}
                          className="flex items-start gap-4 p-4 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-200 hover:shadow-md group"
                        >
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 line-clamp-2 text-lg mb-2">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {item.summary}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(item.published_date).toLocaleDateString('tr-TR')}
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">Henüz haber bulunmamaktadır.</p>
                    )}
                  </div>
                  <Link 
                    to="/haberler" 
                    className="block mt-6 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Tüm Haberleri Görüntüle →
                  </Link>
                </div>
              </div>
              
              {/* Duyurular */}
              {announcements.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <span className="bg-white/20 p-2 rounded-lg mr-3">📢</span>
                      Duyurular
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {announcements.slice(0, 6).map((announcement, index) => (
                        <div
                          key={announcement.id}
                          onClick={() => setSelectedAnnouncement(announcement)}
                          className={`flex items-start gap-4 p-4 rounded-lg transition-all border-l-4 ${
                            announcement.priority === 'high' 
                              ? 'bg-red-50 border-red-500 hover:bg-red-100' 
                              : 'bg-blue-50 border-blue-500 hover:bg-blue-100'
                          } cursor-pointer hover:shadow-md`}
                        >
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            announcement.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'
                          } text-white font-bold`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 hover:text-blue-600 mb-1">
                              {announcement.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {announcement.content}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(announcement.published_date).toLocaleDateString('tr-TR')}
                              {announcement.priority === 'high' && (
                                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-semibold">
                                  ÖNEMLİ
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link 
                      to="/duyurular" 
                      className="block mt-6 text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      Tüm Duyuruları Görüntüle →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Sağ Kenar Çubuğu (1/4 genişlik) */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Hızlı İstatistikler */}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <span className="bg-white/20 p-2 rounded-lg mr-2">📊</span>
                  Rakamlarla ATA
                </h3>
                <div className="space-y-3">
                  {stats.map((stat, index) => (
                    <div 
                      key={index} 
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">{stat.value}</div>
                          <div className="text-sm text-white/80">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hızlı Bağlantılar */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <span className="bg-white/20 p-2 rounded-lg mr-2">🔗</span>
                  Hızlı Erişim
                </h3>
                <div className="space-y-2">
                  <Link 
                    to="/akademik-kadro" 
                    className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all hover:translate-x-1"
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>Akademik Kadro</span>
                  </Link>
                  <Link 
                    to="/akademik-takvim" 
                    className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all hover:translate-x-1"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Akademik Takvim</span>
                  </Link>
                  <Link 
                    to="/ders-programlari" 
                    className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all hover:translate-x-1"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Ders Programları</span>
                  </Link>
                </div>
              </div>

              {/* Öğrenci Portalı */}
              <Link 
                to="/obs/giris"
                className="block bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <span className="bg-white/20 p-2 rounded-lg mr-2">💻</span>
                    Öğrenci Bilgi Sistemi
                  </h3>
                  <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-white/90 text-sm mb-3">
                  Not görüntüleme, devamsızlık takibi, ders programı ve daha fazlası
                </p>
                <div className="flex items-center justify-between text-white/80 text-xs">
                  <span>📚 Akademik İşlemler</span>
                  <span>🔐 Güvenli Giriş</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Duyuru Penceresi */}
      {selectedAnnouncement && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Açılır Pencere Başlığı */}
            <div className={`${
              selectedAnnouncement.priority === 'high' 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600'
            } px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <span className="bg-white/20 p-2 rounded-lg text-2xl">📢</span>
                <h2 className="text-2xl font-bold text-white">
                  {selectedAnnouncement.priority === 'high' ? 'ÖNEMLİ DUYURU' : 'DUYURU'}
                </h2>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Açılır Pencere İçeriği */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedAnnouncement.title}
              </h3>
              
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedAnnouncement.published_date).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                {selectedAnnouncement.priority === 'high' && (
                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">
                    ÖNEMLİ
                  </span>
                )}
              </div>

              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className={`w-full ${
                    selectedAnnouncement.priority === 'high'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white font-semibold py-3 rounded-lg transition-colors`}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
