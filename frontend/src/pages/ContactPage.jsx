import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { contactAPI } from '../utils/api';
import { api } from '../utils/api';
import { MapPin, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

const ContactPage = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await api.get('/contact-page-settings');
      setContact(response.data);
    } catch (error) {
      console.error('Error fetching contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    try {
      await api.post('/contact-messages', formData);
      toast.success('Mesajınız başarıyla gönderildi!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Mesaj gönderilirken bir hata oluştu');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="contact-page">
      <Navbar />

      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">İletişim</h1>
            <p className="text-lg sm:text-xl text-blue-100">
              Bize ulaşın, sorularınızı yanıtlamaktan mutluluk duyarız
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="card-hover bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 shadow-lg animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Adres</h3>
              <p className="text-gray-600">{contact?.address || 'ATA Üniversitesi, Merkez Kampüs, Türkiye'}</p>
            </div>

            <div className="card-hover bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 shadow-lg animate-fade-in-up delay-100">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Telefon</h3>
              <p className="text-gray-600">{contact?.phone || '+90 (123) 456 78 90'}</p>
              {contact?.fax && (
                <>
                  <p className="text-sm text-gray-500 mt-2">Fax:</p>
                  <p className="text-gray-600">{contact.fax}</p>
                </>
              )}
            </div>

            <div className="card-hover bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 shadow-lg animate-fade-in-up delay-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">E-posta</h3>
              <a href={`mailto:${contact?.email || 'info@ata.edu.tr'}`} className="text-blue-600 hover:text-blue-700">
                {contact?.email || 'info@ata.edu.tr'}
              </a>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Bize Mesaj Gönderin</h2>
              <form onSubmit={handleSubmit} data-testid="contact-form" className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    data-testid="contact-name-input"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    data-testid="contact-email-input"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Konu *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    data-testid="contact-subject-input"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="6"
                    data-testid="contact-message-input"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  type="submit"
                  data-testid="contact-submit-button"
                  disabled={sending}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
              </form>
            </div>

            <div className="animate-slide-in-right">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Konumumuz</h2>
              <div className="rounded-xl overflow-hidden shadow-2xl" style={{ height: '450px' }}>
                <iframe
                  title="ATA Üniversitesi Konumu"
                  src="https://maps.google.com/maps?q=40.9827,29.1266&hl=tr&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;