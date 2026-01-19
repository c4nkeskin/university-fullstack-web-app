import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Users, Target, Award, Globe } from 'lucide-react';
import { aboutSettingsAPI } from '../utils/api';

const AboutPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await aboutSettingsAPI.get();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching about settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const values = [
    {
      icon: Target,
      title: settings?.mission_title || 'Misyonumuz',
      description: settings?.mission_description || 'Bilim, teknoloji ve sanatta öncü, yenilikçi ve topluma katkı sağlayan bireyler yetiştirmek.'
    },
    {
      icon: Globe,
      title: settings?.vision_title || 'Vizyonumuz',
      description: settings?.vision_description || 'Dünya standartlarında eğitim ve araştırma ile uluslararası alanda tanınan bir üniversite olmak.'
    },
    {
      icon: Award,
      title: settings?.values_title || 'Değerlerimiz',
      description: settings?.values_description || 'Kalite, dürüstlük, saygı, yenilikçilik ve sürekli gelişim ilkelerimizdir.'
    },
    {
      icon: Users,
      title: settings?.social_title || 'Toplumsal Sorumluluk',
      description: settings?.social_description || 'Topluma ve çevreye duyarlı, sosyal sorumluluk bilinci yüksek bireyler yetiştiriyoruz.'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="about-page">
      <Navbar />

      {/* Öne Çıkan Bölüm */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              {settings?.hero_title || 'Hakkımızda'}
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
              {settings?.hero_description || 'ATA Üniversitesi olarak, eğitim ve araştırma alanında öncü, yenilikçi ve topluma katkı sağlayan bir kurum olmayı hedefliyoruz.'}
            </p>
          </div>
        </div>
      </section>

      {/* Hakkında İçeriği */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <img
                src={settings?.main_image_url || "https://images.unsplash.com/photo-1704748082614-8163a88e56b8"}
                alt={settings?.main_title || "ATA Üniversitesi"}
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="animate-slide-in-right space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {settings?.main_title || 'ATA Üniversitesi'}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {settings?.main_paragraph1 || 'ATA Üniversitesi, Türkiye\'nin önde gelen eğitim kurumlarından biri olarak, akademik mükemmelliği ve araştırma odaklı yaklaşımı ile tanınmaktadır. Üniversitemiz, öğrencilerine sadece teorik bilgi değil, aynı zamanda pratik deneyim ve yaşam boyu öğrenme becerilerini kazandırmayı amaçlamaktadır.'}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {settings?.main_paragraph2 || 'Modern eğitim olanaklarımız, deneyimli akademik kadromuz ve uluslararası işbirliklikleri sayesinde, öğrencilerimize dünya çapında bir eğitim sunuyoruz. Üniversitemiz, 12 fakülte, 5 meslek yüksekokulu ve 3 enstitü ile geniş bir akademik yelpazede hizmet vermektedir.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Değerler Bölümü */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-lg text-gray-600">ATA Üniversitesi'ni özel kılan değerler</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                data-testid={`value-card-${index}`}
                className="card-hover bg-white rounded-xl p-8 shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;