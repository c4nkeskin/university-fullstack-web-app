import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { eventsAPI } from '../utils/api';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await eventsAPI.getById(id);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Etkinlik yüklenirken bir hata oluştu');
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

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Etkinlik Bulunamadı</h2>
          <Link to="/etkinlikler" className="text-blue-600 hover:text-blue-700">
            Etkinlikler sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="event-detail-page">
      <Navbar />

      <article className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/etkinlikler"
            data-testid="back-to-events-button"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Etkinliklere Dön
          </Link>

          {event.image_url && (
            <div className="rounded-2xl overflow-hidden shadow-2xl mb-8 animate-fade-in">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-4 mb-8 animate-fade-in-up">
            <div className="flex items-center text-gray-600 bg-white px-4 py-2 rounded-lg shadow">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              <span>{new Date(event.event_date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            <div className="flex items-center text-gray-600 bg-white px-4 py-2 rounded-lg shadow">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              <span>{event.location}</span>
            </div>
          </div>

          <div 
            className="prose prose-lg max-w-none bg-white rounded-xl p-8 shadow-lg animate-fade-in-up"
            dangerouslySetInnerHTML={{ __html: event.description.replace(/\n/g, '<br />') }}
          />
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default EventDetailPage;