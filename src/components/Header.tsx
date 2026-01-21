import { Search, Mail, PlusCircle, Menu, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { useState, useRef, useEffect } from 'react'
import ContactModals from './ContactModals'

interface HeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
}

const Header: React.FC<HeaderProps> = ({ search, onSearchChange }) => {
  const { language, setLanguage, t } = useLanguage();
  const [modalOpen, setModalOpen] = useState<'contact' | 'addService' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <ContactModals isOpen={modalOpen} onClose={() => setModalOpen(null)} />
      <header className="sticky top-0 z-50 w-full border-b border-border-light bg-white/90 backdrop-blur-md px-4 lg:px-10 py-1.5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 lg:gap-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <div className="size-14 flex items-center justify-center">
              <img src="/logo.png" alt="Autotop Logo" className="w-full h-full object-contain scale-150" />
            </div>
            <h2 className="text-text-charcoal text-xl font-extrabold tracking-tight hidden sm:block">Autotop.ee</h2>
          </Link>
          <div className="hidden md:flex flex-col min-w-64 h-10 max-w-md">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-background-secondary border border-border-light">
              <div className="text-text-slate flex items-center justify-center pl-4">
                <Search className="size-5" />
              </div>
              <input 
                className="flex w-full min-w-0 flex-1 border-none bg-transparent text-text-charcoal focus:outline-0 focus:ring-0 placeholder:text-slate-400 px-4 pl-2 text-sm font-normal" 
                placeholder={t('header.searchPlaceholder')}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 lg:gap-8">
          <nav className="hidden lg:flex items-center gap-6">
            <button 
              onClick={() => setModalOpen('contact')}
              className="flex items-center gap-2 text-text-slate hover:text-primary text-sm font-bold transition-colors"
            >
              <Mail className="size-4" />
              {t('nav.contact')}
            </button>
            <button 
              onClick={() => setModalOpen('addService')}
              className="flex items-center gap-2 text-text-slate hover:text-primary text-sm font-bold transition-colors"
            >
              <PlusCircle className="size-4" />
              {t('nav.addService')}
            </button>
          </nav>
          
          <div className="flex items-center gap-2 bg-background-secondary p-1 rounded-lg border border-border-light">
            <button 
              onClick={() => setLanguage('ru')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${language === 'ru' ? 'bg-white text-primary shadow-sm' : 'text-text-slate'}`}
            >
              RU
            </button>
            <button 
              onClick={() => setLanguage('et')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${language === 'et' ? 'bg-white text-primary shadow-sm' : 'text-text-slate'}`}
            >
              ET
            </button>
          </div>

          <div className="h-6 w-px bg-border-light hidden lg:block"></div>
          
          {/* Mobile Menu Button */}
          <div className="relative lg:hidden" ref={menuRef}>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-background-secondary border border-border-light rounded-lg text-text-charcoal font-bold text-sm"
            >
              <Menu className="size-4" />
              <ChevronDown className={`size-3 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {mobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-soft border border-border-light py-2 animate-in fade-in zoom-in-95 duration-200">
                <button 
                  onClick={() => { setModalOpen('contact'); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-text-charcoal hover:bg-background-secondary font-bold text-sm transition-colors"
                >
                  <Mail className="size-4 text-primary" />
                  {t('nav.contact')}
                </button>
                <button 
                  onClick={() => { setModalOpen('addService'); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-text-charcoal hover:bg-background-secondary font-bold text-sm transition-colors"
                >
                  <PlusCircle className="size-4 text-primary" />
                  {t('nav.addService')}
                </button>
              </div>
            )}
          </div>

          {/* Desktop Add Review Button */}
          <div className="hidden lg:block">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold transition-transform active:scale-95 shadow-sm hover:opacity-90">
                  <span>{t('header.addReview')}</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold transition-transform active:scale-95 shadow-sm hover:opacity-90">
                <span>{t('header.addReview')}</span>
              </button>
            </SignedIn>
          </div>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
    </>
  )
}

export default Header
