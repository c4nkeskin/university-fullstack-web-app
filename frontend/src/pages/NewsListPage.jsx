import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { newsAPI } from '../utils/api';
import { Calendar, ChevronRight } from 'lucide-react';

const NewsListPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await newsAPI.getAll();
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
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
    <div className="min-h-screen" data-testid="news-list-page">
      <Navbar />

      {/* Öne Çıkan Bölüm */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Haberler</h1>
            <p className="text-lg sm:text-xl text-blue-100">
              Üniversitemizden son haberler ve gelişmeler
            </p>
          </div>
        </div>
      </section>

      {/*Haberler Izgaras */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {news.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/haberler/${item.id}`}
                  data-testid={`news-item-${index}`}
                  className="card-hover bg-white rounded-xl overflow-hidden shadow-lg animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="h-56 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-blue-600 font-semibold mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(item.published_date).toLocaleDateString('tr-TR')}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 mb-4">{item.summary}</p>
                    <div className="flex items-center text-blue-600 font-semibold">
                      Devamını Oku
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">Bu kategoride haber bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewsListPage;