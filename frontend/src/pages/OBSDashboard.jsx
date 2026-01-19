import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, BookOpen, Calendar, TrendingUp, LogOut, AlertCircle, Award, Clock } from 'lucide-react';
import { studentAPI } from '../utils/api';
import { toast } from 'sonner';

const OBSDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('student_token');
    if (!token) {
      navigate('/obs/giris');
      return;
    }

    try {
      const response = await studentAPI.getMe();
      setStudent(response.data);
      fetchGrades(response.data.id);
      fetchAttendance(response.data.id);
    } catch (error) {
      localStorage.removeItem('student_token');
      localStorage.removeItem('student');
      navigate('/obs/giris');
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async (studentId) => {
    try {
      const response = await studentAPI.getGrades(studentId);
      setGrades(response.data);
    } catch (error) {
      console.error('Notlar yüklenemedi:', error);
    }
  };

  const fetchAttendance = async (studentId) => {
    try {
      const response = await studentAPI.getAttendance(studentId);
      setAttendance(response.data);
    } catch (error) {
      console.error('Devamsızlık bilgileri yüklenemedi:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student');
    toast.success('Çıkış yapıldı');
    navigate('/obs/giris');
  };

  const getGradeColor = (grade) => {
    const colors = {
      'AA': 'text-green-600 bg-green-100',
      'BA': 'text-green-500 bg-green-100',
      'BB': 'text-blue-600 bg-blue-100',
      'CB': 'text-blue-500 bg-blue-100',
      'CC': 'text-yellow-600 bg-yellow-100',
      'DC': 'text-orange-500 bg-orange-100',
      'DD': 'text-orange-600 bg-orange-100',
      'FD': 'text-red-500 bg-red-100',
      'FF': 'text-red-600 bg-red-100'
    };
    return colors[grade] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Bilgi (Başlık) */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Öğrenci Bilgi Sistemi</h1>
              <p className="text-blue-100 mt-1">Hoş geldiniz, {student?.first_name} {student?.last_name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Çıkış</span>
            </button>
          </div>

          {/* Öğrenci Bilgi Çubuğu */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-blue-100">Öğrenci No</div>
              <div className="text-xl font-bold">{student?.student_no}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-blue-100">Bölüm</div>
              <div className="text-lg font-semibold">{student?.department}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-blue-100">Sınıf</div>
              <div className="text-xl font-bold">{student?.class_level}. Sınıf</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-blue-100">GPA</div>
              <div className="text-xl font-bold flex items-center gap-2">
                {student?.gpa?.toFixed(2) || '0.00'}
                <Award className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gezinme Sekmeleri */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Genel Bakış', icon: User },
              { id: 'grades', label: 'Notlarım', icon: BookOpen },
              { id: 'attendance', label: 'Devamsızlık', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Genel Bakış Sekmesi */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Kişisel Bilgiler */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                Kişisel Bilgiler
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">Ad Soyad</label>
                  <p className="text-lg font-semibold">{student?.first_name} {student?.last_name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">TC Kimlik No</label>
                  <p className="text-lg font-semibold">{student?.tc_no}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">E-posta</label>
                  <p className="text-lg font-semibold">{student?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Telefon</label>
                  <p className="text-lg font-semibold">{student?.phone}</p>
                </div>
              </div>
            </div>

            {/* Hızlı İstatistikler */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="w-8 h-8" />
                  <span className="text-3xl font-bold">{grades.length}</span>
                </div>
                <p className="text-blue-100">Toplam Ders</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8" />
                  <span className="text-3xl font-bold">{student?.gpa?.toFixed(2) || '0.00'}</span>
                </div>
                <p className="text-green-100">Genel Ortalama</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="w-8 h-8" />
                  <span className="text-3xl font-bold">{attendance.length}</span>
                </div>
                <p className="text-orange-100">Devamsızlık Kaydı</p>
              </div>
            </div>
          </div>
        )}

        {/* Notlar Sekmesi */}
        {activeTab === 'grades' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Not Transkripti
              </h2>
            </div>
            <div className="p-6">
              {grades.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ders Kodu</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ders Adı</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Kredi</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Vize</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Final</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Harf Notu</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dönem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {grades.map((grade) => (
                        <tr key={grade.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">{grade.course_code}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{grade.course_name}</td>
                          <td className="px-4 py-4 text-sm text-center text-gray-900">{grade.credit}</td>
                          <td className="px-4 py-4 text-sm text-center text-gray-900">{grade.midterm || '-'}</td>
                          <td className="px-4 py-4 text-sm text-center text-gray-900">{grade.final || '-'}</td>
                          <td className="px-4 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(grade.grade)}`}>
                              {grade.grade || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">{grade.semester}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Henüz not kaydı bulunmamaktadır</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Devam Durumu Sekmesi */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Devamsızlık Durumu
              </h2>
            </div>
            <div className="p-6">
              {attendance.length > 0 ? (
                <div className="space-y-4">
                  {attendance.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{record.course_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          record.absence_percentage > 20 ? 'bg-red-100 text-red-600' : 
                          record.absence_percentage > 10 ? 'bg-yellow-100 text-yellow-600' : 
                          'bg-green-100 text-green-600'
                        }`}>
                          %{record.absence_percentage.toFixed(1)} Devamsızlık
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Toplam Saat:</span>
                          <span className="ml-2 font-semibold">{record.total_hours}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Katılım:</span>
                          <span className="ml-2 font-semibold text-green-600">{record.attended_hours}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Devamsızlık:</span>
                          <span className="ml-2 font-semibold text-red-600">{record.total_hours - record.attended_hours}</span>
                        </div>
                      </div>
                      {record.absence_percentage > 20 && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span>Dikkat! Devamsızlık limitini aştınız.</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Henüz devamsızlık kaydı bulunmamaktadır</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OBSDashboard;
