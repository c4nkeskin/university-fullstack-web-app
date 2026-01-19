import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { academicUnitsAPI } from '../utils/api';
import { Building2, ChevronRight, Mail, Phone } from 'lucide-react';

const FacultiesPage = () => {
  const location = useLocation();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUnitType = () => {
    if (location.pathname.includes('fakulteler')) return 'faculty';
    if (location.pathname.includes('meslek-y') || location.pathname.includes('meslek-yuksekokullar')) return 'vocational_school';
    if (location.pathname.includes('enstituler')) return 'institute';
    return 'faculty';
  };

  const getPageTitle = () => {
    if (location.pathname.includes('fakulteler')) return 'Fakülteler';
    if (location.pathname.includes('meslek-y') || location.pathname.includes('meslek-yuksekokullar')) return 'Meslek Yüksekokulları';
    if (location.pathname.includes('enstituler')) return 'Enstitüler';
    return 'Akademik Birimler';
  };

  useEffect(() => {
    fetchUnits();
  }, [location.pathname]);

  const fetchUnits = async () => {
    try {
      const type = getUnitType();
      const response = await academicUnitsAPI.getAll(type);
      setUnits(response.data);
    } catch (error) {
      console.error('Error fetching units:', error);
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
    <div className="min-h-screen" data-testid="faculties-page">
      <Navbar />

      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">{getPageTitle()}</h1>
            <p className="text-lg sm:text-xl text-blue-100">
              Akademik birimlerimiz ve sundukları programlar
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {units.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {units.map((unit, index) => (
                <Link
                  key={unit.id}
                  to={`/akademik-birim/${unit.id}`}
                  data-testid={`unit-card-${index}`}
                  className="card-hover bg-white rounded-xl overflow-hidden shadow-lg animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {unit.image_url && (
                    <div className="h-56 overflow-hidden">
                      <img
                        src={unit.image_url}
                        alt={unit.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mr-4">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{unit.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">{unit.description}</p>
                    {unit.dean_name && (
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Dekan:</strong> {unit.dean_name}
                      </p>
                    )}
                    {unit.departments && unit.departments.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 font-semibold mb-2">Bölümler:</p>
                        <div className="flex flex-wrap gap-2">
                          {unit.departments.slice(0, 3).map((dept, i) => (
                            <span key={i} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                              {dept}
                            </span>
                          ))}
                          {unit.departments.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                              +{unit.departments.length - 3} daha
                            </span>
                          )}
                        </div>
                      </div>
                    )}
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
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">Henüz akademik birim eklenmemiştir.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FacultiesPage;