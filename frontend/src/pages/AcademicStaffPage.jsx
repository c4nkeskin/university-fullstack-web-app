import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, User, ArrowLeft } from 'lucide-react';
import { api } from '../utils/api';

const AcademicStaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('Tümü');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/academic-staff');
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching academic staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const departments = ['Tümü', ...new Set(staff.map(s => s.department))];
  
  const filteredStaff = selectedDepartment === 'Tümü' 
    ? staff 
    : staff.filter(s => s.department === selectedDepartment);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/*Ana Sayfaya Dön Butonu */}
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
            Akademik Kadro
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Deneyimli ve uzman akademik kadromuz ile tanışın
          </p>
        </motion.div>

        {/* Bölüm Filtresi */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedDepartment === dept
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-blue-50 shadow'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/*Personel Izgarası */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Henüz akademik kadro bilgisi eklenmemiş</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStaff.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Görsel */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                      {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                  )}
                </div>

                {/* İçerik */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">{member.title}</p>
                  <p className="text-gray-600 text-sm mb-4 pb-4 border-b border-gray-200">
                    {member.department}
                  </p>

                  {/* İletişim Bilgileri */}
                  <div className="space-y-2">
                    {member.email && (
                      <div className="flex items-center text-sm text-gray-600 group/item">
                        <Mail className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                        <a 
                          href={`mailto:${member.email}`}
                          className="hover:text-blue-600 transition-colors truncate"
                        >
                          {member.email}
                        </a>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.office && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                        <span>{member.office}</span>
                      </div>
                    )}
                  </div>

                  {/*Biyografi*/}
                  {member.bio && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {member.bio}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicStaffPage;
