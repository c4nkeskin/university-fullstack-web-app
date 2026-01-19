import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, MapPin, User, ArrowLeft } from 'lucide-react';
import { api } from '../utils/api';

const CourseSchedulePage = () => {
  const [departments, setDepartments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [deptResponse, scheduleResponse] = await Promise.all([
        api.get('/course-departments'),
        api.get('/course-schedules')
      ]);
      
      setDepartments(deptResponse.data);
      setSchedules(scheduleResponse.data);
      
      // Varsayılan olarak ilk departmanı seç
      if (deptResponse.data.length > 0) {
        setSelectedDepartment(deptResponse.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];

  const getDepartmentSchedules = () => {
    if (!selectedDepartment) return [];
    return schedules.filter(s => s.department_id === selectedDepartment);
  };

  // Gerçek programlara göre dinamik zaman aralıkları oluştur
  const getTimeSlots = () => {
    const deptSchedules = getDepartmentSchedules();
    if (deptSchedules.length === 0) {
      return ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
    }
    
    // Programlardan tüm benzersiz başlangıç saatlerini al
    const times = new Set();
    deptSchedules.forEach(schedule => {
      times.add(schedule.start_time);
    });
    
    // Saatleri sırala
    return Array.from(times).sort();
  };

  const timeSlots = getTimeSlots();

  const getScheduleForDayAndTime = (day, time) => {
    const deptSchedules = getDepartmentSchedules();
    return deptSchedules.find(s => 
      s.day === day && s.start_time === time
    );
  };

  const selectedDeptName = departments.find(d => d.id === selectedDepartment)?.name || '';

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

        {/* Üst Bilgi (Başlık) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ders Programları
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Bölümlere göre haftalık ders programları
          </p>
        </motion.div>

        {/* Departman Sekmeleri */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDepartment(dept.id)}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                selectedDepartment === dept.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl scale-105'
                  : 'bg-white text-gray-700 hover:bg-blue-50 shadow-lg hover:shadow-xl'
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Departman Başlığı */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BookOpen className="w-8 h-8 mr-3" />
                {selectedDeptName} - Haftalık Ders Programı
              </h2>
            </div>

            {/* Program Tablosu */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200 w-24">
                      Saat
                    </th>
                    {days.map((day) => (
                      <th key={day} className="px-4 py-4 text-center text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {timeSlots.map((time, timeIndex) => (
                    <tr key={time} className={timeIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r-2 border-gray-200">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          {time}
                        </div>
                      </td>
                      {days.map((day) => {
                        const schedule = getScheduleForDayAndTime(day, time);
                        return (
                          <td key={`${day}-${time}`} className="px-2 py-2">
                            {schedule ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border-l-4 border-blue-500 hover:shadow-md transition-all"
                              >
                                <h4 className="font-semibold text-gray-900 text-sm mb-2 leading-tight">
                                  {schedule.course_name}
                                </h4>
                                <div className="space-y-1 text-xs text-gray-600">
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1 text-blue-600 flex-shrink-0" />
                                    <span className="truncate">
                                      {schedule.start_time} - {schedule.end_time}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="w-3 h-3 mr-1 text-blue-600 flex-shrink-0" />
                                    <span className="truncate">{schedule.room}</span>
                                  </div>
                                  {schedule.instructor && (
                                    <div className="flex items-center">
                                      <User className="w-3 h-3 mr-1 text-blue-600 flex-shrink-0" />
                                      <span className="truncate">{schedule.instructor}</span>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ) : (
                              <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                                -
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Açıklama  */}
            <div className="bg-gray-50 p-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-blue-600" />
                  <span>Ders Saati</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                  <span>Derslik</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1 text-blue-600" />
                  <span>Öğretim Görevlisi</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bilgilendirme Kartı */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Bilgilendirme
          </h3>
          <p className="text-blue-800 text-sm leading-relaxed">
            Ders programları her dönem başında güncellenmektedir. 
            Değişiklikler öğrenci bilgi sisteminden duyurulacaktır. 
            Daha detaylı bilgi için ilgili bölüm koordinatörlüğü ile iletişime geçebilirsiniz.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseSchedulePage;
