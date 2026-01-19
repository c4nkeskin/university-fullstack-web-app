import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Cloud, Droplets, Wind } from 'lucide-react';
import { api } from '../utils/api';


const Footer = () => {
  const [settings, setSettings] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [footerSettings, setFooterSettings] = useState(null);


  useEffect(() => {
    fetchSettings();
    fetchWeather();
    fetchFooterSettings();
  }, []);


  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };


  const fetchFooterSettings = async () => {
    try {
      const response = await api.get('/footer-settings');
      setFooterSettings(response.data);
    } catch (error) {
      console.error('Error fetching footer settings:', error);
    }
  };


  const fetchWeather = async () => {
    try {
      // Direkt Tirebolu koordinatları
      const response = await api.get('/weather', {
        params: { 
          lat: 41.0086,  // Tirebolu enlem
          lon: 38.8131   // Tirebolu boylam
        }
      });
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoadingWeather(false);
    }
  };


  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Üniversite Bilgileri */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center space-x-3">
              {settings?.site_logo ? (
                <img src={settings.site_logo} alt="Logo" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {settings?.site_name?.substring(0, 3) || 'ATA'}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold">{settings?.site_name || 'ATA ÜNİVERSİTESİ'}</h3>
                <p className="text-xs text-gray-300">{settings?.site_tagline || 'Geleceği İnşa Eden Üniversite'}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {footerSettings?.description || 'ATA Üniversitesi, eğitim ve araştırma alanında öncü, yenilikçi ve topluma katkı sağlayan bir kurumdur.'}
            </p>
            <div className="flex space-x-3">
              {footerSettings?.facebook_url && (
                <a href={footerSettings.facebook_url} target="_blank" rel="noopener noreferrer" data-testid="footer-facebook" className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all hover:scale-110" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {footerSettings?.twitter_url && (
                <a href={footerSettings.twitter_url} target="_blank" rel="noopener noreferrer" data-testid="footer-twitter" className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-400 flex items-center justify-center transition-all hover:scale-110" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {footerSettings?.instagram_url && (
                <a href={footerSettings.instagram_url} target="_blank" rel="noopener noreferrer" data-testid="footer-instagram" className="w-10 h-10 rounded-full bg-white/10 hover:bg-pink-600 flex items-center justify-center transition-all hover:scale-110" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {footerSettings?.linkedin_url && (
                <a href={footerSettings.linkedin_url} target="_blank" rel="noopener noreferrer" data-testid="footer-linkedin" className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-700 flex items-center justify-center transition-all hover:scale-110" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {footerSettings?.youtube_url && (
                <a href={footerSettings.youtube_url} target="_blank" rel="noopener noreferrer" data-testid="footer-youtube" className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-110" aria-label="YouTube">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>


          {/* Hızlı Bağlantılar */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li><Link to="/hakkimizda" data-testid="footer-link-hakkimizda" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">Hakkımızda</Link></li>
              <li><Link to="/fakulteler" data-testid="footer-link-fakulteler" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">Fakülteler</Link></li>
              <li><Link to="/meslek-yuksekokulları" data-testid="footer-link-meslek-yuksekokulları" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">Meslek Yüksekokulları</Link></li>
              <li><Link to="/enstituler" data-testid="footer-link-enstituler" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">Enstitüler</Link></li>
              <li><Link to="/haberler" data-testid="footer-link-haberler" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">Haberler</Link></li>
              <li><Link to="/etkinlikler" data-testid="footer-link-etkinlikler" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">Etkinlikler</Link></li>
            </ul>
          </div>


          {/* Akademik Bölümler */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-4">Akademik</h3>
            <ul className="space-y-2">
              <li><Link to="/akademik-kadro" data-testid="footer-link-akademik-kadro" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">Akademik Kadro</Link></li>
              <li><Link to="/akademik-takvim" data-testid="footer-link-akademik-takvim" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">Akademik Takvim</Link></li>
              <li><Link to="/ders-programlari" data-testid="footer-link-ders-programlari" className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all">Ders Programları</Link></li>
            </ul>
          </div>


          {/* İletişim Bilgileri */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-300">{footerSettings?.address || 'ATA Üniversitesi, Merkez Kampüs, Türkiye'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">{footerSettings?.phone || '+90 (123) 456 78 90'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">{footerSettings?.email || 'info@ata.edu.tr'}</span>
              </li>
            </ul>
          </div>


          {/* Hava Durumu Widget */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-4">Hava Durumu</h3>
            {loadingWeather ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-white/20 rounded w-3/4 mb-3"></div>
                <div className="h-12 bg-white/20 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-white/20 rounded w-full"></div>
              </div>
            ) : weather ? (
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-300" />
                    <span className="text-sm font-medium text-gray-200">{weather.name || 'Tirebolu'}</span>
                  </div>
                  <img 
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.description}
                    className="w-12 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-end space-x-2">
                    <span className="text-4xl font-bold text-white">{weather.temp}°</span>
                    <span className="text-sm text-gray-300 mb-2">C</span>
                  </div>
                  <p className="text-sm text-gray-200 capitalize">{weather.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-300 pt-2 border-t border-white/10">
                    <div className="flex items-center space-x-1">
                      <Cloud className="w-3 h-3" />
                      <span>Hissedilen: {weather.feels_like}°</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Droplets className="w-3 h-3" />
                      <span>{weather.humidity}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-gray-300">Hava durumu bilgisi alınamadı</p>
              </div>
            )}
          </div>
        </div>


        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {settings?.site_name || 'ATA Üniversitesi'}. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
