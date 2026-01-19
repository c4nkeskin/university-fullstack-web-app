import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BookOpen } from 'lucide-react';

const SystemPage = ({ title, icon: Icon }) => {
  return (
    <div className="min-h-screen" data-testid="system-page">
      <Navbar />

      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-6">
              <Icon className="w-12 h-12" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">{title}</h1>
            <p className="text-lg sm:text-xl text-blue-100">
              ATA Üniversitesi {title} Sistemine hoş geldiniz
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mx-auto mb-6">
              <Icon className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title} Sistemi</h2>
            <p className="text-lg text-gray-600 mb-8">
              Bu sistem şu anda bakım aşamasındadır. Sisteme erişim için lütfen bilgi işlem birimi ile iletişime geçiniz.
            </p>
            <div className="space-y-4 text-left bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Sistem Bilgileri</h3>
                  <p className="text-gray-600">Sistemimiz 7/24 hizmet vermektedir.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Destek</h3>
                  <p className="text-gray-600">Teknik destek için: destek@ata.edu.tr</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Çalışma Saatleri</h3>
                  <p className="text-gray-600">Hafta içi 08:00 - 17:00</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <a
                href="/iletisim"
                className="btn-primary inline-block"
              >
                İletişime Geç
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SystemPage;