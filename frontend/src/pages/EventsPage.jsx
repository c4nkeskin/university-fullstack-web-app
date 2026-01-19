import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { eventsAPI } from '../utils/api';
import { Calendar as CalendarIcon, MapPin, ChevronRight } from 'lucide-react';
import { Calendar } from '../components/ui/calendar';
import { tr } from 'date-fns/locale';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) {
      const filtered = events.filter(event => {
        const eventDate = new Date(event.event_date);
        return eventDate.toDateString() === date.toDateString();
      });
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
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
    <div className="min-h-screen" data-testid="events-page">
      <Navbar />

      {/*Öne Çıkan Bölüm */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Etkinlikler</h1>
            <p className="text-lg sm:text-xl text-blue-100">
              Üniversitemizde gerçekleşen ve gerçekleşecek etkinlikler
            </p>
          </div>
        </div>
      </section>

      {/* Etkinlik İçeriği */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Takvim Yan Paneli */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Etkinlik Takvimi</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  locale={tr}
                  className="rounded-md border"
                />
              </div>
            </div>

            {/* Etkinlik Listesi */}
            <div className="lg:col-span-2">
              {filteredEvents.length > 0 ? (
                <div className="space-y-6">
                  {filteredEvents.map((event, index) => (
                    <Link
                      key={event.id}
                      to={`/etkinlikler/${event.id}`}
                      data-testid={`event-item-${index}`}
                      className="card-hover bg-white rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {event.image_url && (
                        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="p-6 flex-1">
                        <div className="flex items-center text-sm text-blue-600 font-semibold mb-3">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {new Date(event.event_date).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>
                        <p className="text-gray-600 line-clamp-2 mb-4">{event.description}</p>
                        <div className="flex items-center text-gray-500 mb-4">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-blue-600 font-semibold">
                          Detayları Gör
                          <ChevronRight className="ml-1 w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                  <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-500">Seçili tarihte etkinlik bulunmamaktadır.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventsPage;