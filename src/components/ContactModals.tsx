import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactModalsProps {
  isOpen: 'contact' | 'addService' | null;
  onClose: () => void;
}

const ContactModals: React.FC<ContactModalsProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    businessName: '',
    city: '',
    address: '',
    phone: '',
    website: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: isOpen }),
      });

      if (response.ok) {
        alert(isOpen === 'contact' ? t('contact.success') : t('addService.success'));
        onClose();
        setFormData({
          name: '',
          email: '',
          message: '',
          businessName: '',
          city: '',
          address: '',
          phone: '',
          website: ''
        });
      } else {
        alert('Failed to send. Please try again later.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto pt-32">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-soft border border-border-light overflow-hidden animate-in zoom-in-95 slide-in-from-top-10 duration-300 relative mb-20">
        <div className="flex items-center justify-between p-6 border-b border-border-light bg-background-secondary">
          <h2 className="text-xl font-extrabold text-text-charcoal">
            {isOpen === 'contact' ? t('contact.title') : t('addService.title')}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors">
            <X className="size-5 text-text-slate" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-text-slate uppercase">{t('contact.name')}</label>
              <input 
                required
                type="text"
                className="px-4 py-2 rounded-lg border border-border-light focus:outline-none focus:border-primary bg-background-secondary focus:bg-white transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-text-slate uppercase">{t('contact.email')}</label>
              <input 
                required
                type="email"
                className="px-4 py-2 rounded-lg border border-border-light focus:outline-none focus:border-primary bg-background-secondary focus:bg-white transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {isOpen === 'addService' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-slate uppercase">{t('addService.businessName')}</label>
                <input 
                  required
                  type="text"
                  className="px-4 py-2 rounded-lg border border-border-light focus:outline-none focus:border-primary bg-background-secondary focus:bg-white transition-all"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-slate uppercase">{t('addService.city')}</label>
                  <input 
                    required
                    type="text"
                    className="px-4 py-2 rounded-lg border border-border-light focus:outline-none focus:border-primary bg-background-secondary focus:bg-white transition-all"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-slate uppercase">{t('addService.phone')}</label>
                  <input 
                    required
                    type="text"
                    className="px-4 py-2 rounded-lg border border-border-light focus:outline-none focus:border-primary bg-background-secondary focus:bg-white transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-slate uppercase">{t('addService.address')}</label>
                <input 
                  required
                  type="text"
                  className="px-4 py-2 rounded-lg border border-border-light focus:outline-none focus:border-primary bg-background-secondary focus:bg-white transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-slate uppercase">{t('addService.website')}</label>
                <input 
                  type="text"
                  className="px-4 py-2 rounded-lg border border-border-light focus:outline-none focus:border-primary bg-background-secondary focus:bg-white transition-all"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                />
              </div>
            </>
          )}

          {isOpen === 'contact' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-text-slate uppercase">{t('contact.message')}</label>
              <textarea 
                required
                rows={4}
                className="px-4 py-2 rounded-lg border border-border-light focus:outline-none focus:border-primary bg-background-secondary focus:bg-white transition-all resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>
          )}

          <button 
            disabled={loading}
            type="submit"
            className="mt-4 w-full py-3 bg-primary text-white font-bold rounded-xl shadow-sm hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {t('contact.send')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModals;
