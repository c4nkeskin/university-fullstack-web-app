import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { newsAPI } from '../utils/api';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await newsAPI.getById(id);
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Haber yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link kopyalandı!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Haber Bulunamadı</h2>
          <Link to="/haberler" className="text-blue-600 hover:text-blue-700">
            Haberler sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="news-detail-page">
      <Navbar />

      <article className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Geri Butonu */}
          <Link
            to="/haberler"
            data-testid="back-to-news-button"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Haberlere Dön
          </Link>

          {/* Öne Çıkan Görsel */}
          <div className="rounded-2xl overflow-hidden shadow-2xl mb-8 animate-fade-in">
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Meta Bilgileri */}
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{new Date(news.published_date).toLocaleDateString('tr-TR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <button
              onClick={handleShare}
              data-testid="share-button"
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Paylaş
            </button>
          </div>

          {/* Başlık */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            {news.title}
          </h1>

          {/* Özet */}
          <p className="text-xl text-gray-700 leading-relaxed mb-8 animate-fade-in-up">
            {news.summary}
          </p>

          {/* İçerik */}
          <div 
            className="prose prose-lg max-w-none animate-fade-in-up"
            dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br />') }}
          />
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default NewsDetailPage;