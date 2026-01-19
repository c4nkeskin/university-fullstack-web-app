import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { api } from '../utils/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [settings, setSettings] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    fetchSettings();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const menuItems = [
    { title: 'Ana Sayfa', path: '/' },
    { title: 'Hakkımızda', path: '/hakkimizda' },
    {
      title: 'Akademik Birimler',
      dropdown: [
        { title: 'Fakülteler', path: '/fakulteler' },
        { title: 'Meslek Yüksekokulları', path: '/meslek-yuksekokulları' },
        { title: 'Enstitüler', path: '/enstituler' }
      ]
    },
    { title: 'Duyurular', path: '/duyurular' },
    { title: 'Haberler', path: '/haberler' },
    { title: 'Etkinlikler', path: '/etkinlikler' },
    { title: 'İletişim', path: '/iletisim' }
  ];

  return (
    <nav
      data-testid="main-navbar"
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" data-testid="nav-logo-link">
            {settings?.site_logo ? (
              <img src={settings.site_logo} alt="Logo" className="w-14 h-14 rounded-full object-cover shadow-lg" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {settings?.site_name?.substring(0, 3) || 'ATA'}
              </div>
            )}
            <div className="flex flex-col">
              <span
                className={`text-xl font-bold transition-colors ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}
              >
                {settings?.site_name || 'ATA ÜNİVERSİTESİ'}
              </span>
              <span
                className={`text-xs transition-colors ${
                  scrolled ? 'text-gray-600' : 'text-gray-200'
                }`}
              >
                {settings?.site_tagline || 'Geleceği İnşa Eden Üniversite'}
              </span>
            </div>
          </Link>

          {/* Masaüstü Menüsü */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
              >
                {item.dropdown ? (
                  <>
                    <button
                      data-testid={`nav-dropdown-${item.title.toLowerCase().replace(/\s/g, '-')}`}
                      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-1 ${
                        scrolled
                          ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{item.title}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 transition-all duration-200">
                      {item.dropdown.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          data-testid={`nav-dropdown-item-${subItem.title.toLowerCase().replace(/\s/g, '-')}`}
                          className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    data-testid={`nav-link-${item.title.toLowerCase().replace(/\s/g, '-')}`}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      location.pathname === item.path
                        ? scrolled
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-white bg-white/20'
                        : scrolled
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            data-testid="mobile-menu-button"
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-gray-700 hover:bg-blue-50' : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 animate-fade-in" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.dropdown ? (
                  <>
                    <button
                      data-testid={`mobile-dropdown-${item.title.toLowerCase().replace(/\s/g, '-')}`}
                      onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                      className="w-full flex justify-between items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      <span>{item.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {activeDropdown === index && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.dropdown.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            data-testid={`mobile-dropdown-item-${subItem.title.toLowerCase().replace(/\s/g, '-')}`}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    data-testid={`mobile-link-${item.title.toLowerCase().replace(/\s/g, '-')}`}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;