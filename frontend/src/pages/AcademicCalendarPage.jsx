import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { api } from '../utils/api';

const AcademicCalendarPage = () => {
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('Tümü');
  const [selectedYear, setSelectedYear] = useState('Tümü');

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      const response = await api.get('/academic-calendar');
      setCalendar(response.data);
    } catch (error) {
      console.error('Error fetching academic calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const semesters = ['Tümü', ...new Set(calendar.map(c => c.semester))];
  const years = ['Tümü', ...new Set(calendar.map(c => c.year))];

  const filteredCalendar = calendar.filter(event => {
    const semesterMatch = selectedSemester === 'Tümü' || event.semester === selectedSemester;
    const yearMatch = selectedYear === 'Tümü' || event.year === selectedYear;
    return semesterMatch && yearMatch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getSemesterColor = (semester) => {
    return semester === 'Güz' 
      ? 'from-orange-500 to-red-500' 
      : 'from-green-500 to-teal-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ana Sayfaya Dön Butonu */}
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Ana Sayfaya Dön
        </Link>

        {/* Üst Bilgi (Başlık)*/}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Akademik Takvim
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Önemli akademik tarih ve etkinlikler
          </p>
        </motion.div>

        {/* Filtreler */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dönem Filtresi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Dönem Seçin
              </label>
              <div className="flex flex-wrap gap-2">
                {semesters.map((semester) => (
                  <button
                    key={semester}
                    onClick={() => setSelectedSemester(semester)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedSemester === semester
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {semester}
                  </button>
                ))}
              </div>
            </div>

            {/* Yıl Filtresi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Akademik Yıl Seçin
              </label>
              <div className="flex flex-wrap gap-2">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedYear === year
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Takvim Etkinlikleri */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCalendar.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Seçilen kriterlere uygun etkinlik bulunamadı</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCalendar.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Tarih Rozeti */}
                  <div className={`md:w-48 bg-gradient-to-br ${getSemesterColor(event.semester)} p-6 flex flex-col items-center justify-center text-white`}>
                    <Calendar className="w-12 h-12 mb-3 opacity-90" />
                    <div className="text-center">
                      <p className="text-sm font-medium opacity-90">
                        {event.semester} Dönemi
                      </p>
                      <p className="text-lg font-bold mt-1">
                        {event.year}
                      </p>
                    </div>
                  </div>

                  {/* Etkinlik Detayları */}
                  <div className="flex-1 p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {event.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-medium">
                          {formatDate(event.start_date)}
                          {event.start_date !== event.end_date && (
                            <> - {formatDate(event.end_date)}</>
                          )}
                        </span>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-gray-700 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicCalendarPage;
