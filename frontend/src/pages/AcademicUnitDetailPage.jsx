import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { academicUnitsAPI } from '../utils/api';
import { ArrowLeft, Mail, Phone, Building2, Users } from 'lucide-react';
import { toast } from 'sonner';

const AcademicUnitDetailPage = () => {
  const { id } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnit();
  }, [id]);

  const fetchUnit = async () => {
    try {
      const response = await academicUnitsAPI.getById(id);
      setUnit(response.data);
    } catch (error) {
      console.error('Error fetching unit:', error);
      toast.error('Akademik birim yüklenirken bir hata oluştu');
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

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Birim Bulunamadı</h2>
          <Link to="/fakulteler" className="text-blue-600 hover:text-blue-700">
            Geri dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="unit-detail-page">
      <Navbar />

      <article className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/fakulteler"
            data-testid="back-button"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri Dön
          </Link>

          {unit.image_url && (
            <div className="rounded-2xl overflow-hidden shadow-2xl mb-8 animate-fade-in">
              <img
                src={unit.image_url}
                alt={unit.name}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fade-in-up">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mr-4">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{unit.name}</h1>
                {unit.dean_name && (
                  <p className="text-gray-600 mt-2">
                    <strong>Dekan:</strong> {unit.dean_name}
                  </p>
                )}
              </div>
            </div>

            <div 
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: unit.description.replace(/\n/g, '<br />') }}
            />

            {unit.departments && unit.departments.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-600" />
                  Bölümler
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unit.departments.map((dept, index) => (
                    <div
                      key={index}
                      data-testid={`department-${index}`}
                      className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow"
                    >
                      <p className="font-medium text-gray-900">{dept}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">İletişim Bilgileri</h2>
              <div className="space-y-3">
                {unit.contact_email && (
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-5 h-5 mr-3 text-blue-600" />
                    <a href={`mailto:${unit.contact_email}`} className="hover:text-blue-600">
                      {unit.contact_email}
                    </a>
                  </div>
                )}
                {unit.contact_phone && (
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-5 h-5 mr-3 text-blue-600" />
                    <a href={`tel:${unit.contact_phone}`} className="hover:text-blue-600">
                      {unit.contact_phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default AcademicUnitDetailPage;