import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border-light pt-16 pb-8 px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* About Section */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity w-fit">
              <div className="size-18 flex items-center justify-center">
                <img src="/logo.png" alt="Autotop Logo" className="w-full h-full object-contain scale-110" />
              </div>
              <span className="text-text-charcoal text-xl font-extrabold tracking-tight">Autotop.ee</span>
            </Link>
            <p className="text-text-slate text-sm leading-relaxed">
              {t('footer.aboutText')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text-charcoal font-bold mb-6">{t('footer.quickLinks')}</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/?type=Repair" className="text-text-slate hover:text-primary text-sm transition-colors">{t('nav.repair')}</Link></li>
              <li><Link to="/?type=Car Wash" className="text-text-slate hover:text-primary text-sm transition-colors">{t('nav.wash')}</Link></li>
              <li><Link to="/?type=Detailing" className="text-text-slate hover:text-primary text-sm transition-colors">{t('nav.detailing')}</Link></li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="text-text-charcoal font-bold mb-6">{t('footer.cities')}</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/tallinn" className="text-text-slate hover:text-primary text-sm transition-colors">Tallinn</Link></li>
              <li><Link to="/tartu" className="text-text-slate hover:text-primary text-sm transition-colors">Tartu</Link></li>
              <li><Link to="/narva" className="text-text-slate hover:text-primary text-sm transition-colors">Narva</Link></li>
              <li><Link to="/parnu" className="text-text-slate hover:text-primary text-sm transition-colors">Pärnu</Link></li>
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h3 className="text-text-charcoal font-bold mb-6">{t('footer.popularTypes')}</h3>
            <ul className="flex flex-col gap-3 text-text-slate text-sm">
              <li>Hoolduse broneerimine</li>
              <li>Rehvivahetus Tallinnas</li>
              <li>Autopesula lähedal</li>
              <li>Kliimaseadme täitmine</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-4 text-text-slate text-xs font-medium uppercase tracking-wider">
          <p>© {currentYear} Autotop.ee. {t('footer.rights')}</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
