import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { announcementsAPI } from '../utils/api';
import { Calendar, Megaphone } from 'lucide-react';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementsAPI.getAll();
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="announcements-page">
      <Navbar />

      {/* Öne Çıkan Bölüm */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-6">
              <Megaphone className="w-12 h-12" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Duyurular</h1>
            <p className="text-lg sm:text-xl text-blue-100">
              Önemli duyurular ve bilgilendirmeler
            </p>
          </div>
        </div>
      </section>

      {/* Duyuru Listesi */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {announcements.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement, index) => (
                <div
                  key={announcement.id}
                  data-testid={`announcement-item-${index}`}
                  className={`card-hover bg-gradient-to-br ${
                    announcement.priority === 'high' 
                      ? 'from-red-50 to-orange-50 border-2 border-red-200' 
                      : announcement.priority === 'normal'
                      ? 'from-blue-50 to-indigo-50 border-2 border-blue-200'
                      : 'from-gray-50 to-slate-50 border-2 border-gray-200'
                  } rounded-xl p-6 shadow-lg animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      announcement.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : announcement.priority === 'normal'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {announcement.priority === 'high' ? 'Acil' : announcement.priority === 'normal' ? 'Normal' : 'Düşük'}
                    </span>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{announcement.title}</h3>
                  <p className="text-gray-600 mb-4">{announcement.content}</p>
                  <div className="text-sm text-gray-500">
                    {new Date(announcement.published_date).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-lg">
              <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">Henüz duyuru bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AnnouncementsPage;
