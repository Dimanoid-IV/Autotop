import { MapPin, Star, Loader2, Wrench, Settings } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Service } from '../data/services'
import { useLanguage } from '../context/LanguageContext'

interface ServiceCardProps {
  service: Service;
  viewMode?: 'list' | 'grid';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, viewMode = 'grid' }) => {
  const { language, t } = useLanguage();
  const [imgLoading, setImgLoading] = useState(true);

  const getImageUrl = () => {
    if (service.website) {
      // Use WordPress mshots service for website thumbnails
      const cleanUrl = service.website.startsWith('http') ? service.website : `https://${service.website}`;
      return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=600`;
    }
    return service.image;
  };

  if (viewMode === 'grid') {
    const hasWebsite = !!service.website;
    return (
      <div className="flex flex-col bg-white rounded-xl shadow-soft border border-border-light overflow-hidden hover:border-primary/50 transition-colors group">
        <div className="h-40 relative overflow-hidden bg-slate-100 flex items-center justify-center">
          {hasWebsite ? (
            <>
              <img 
                src={getImageUrl()} 
                alt={service.name[language]} 
                className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${imgLoading ? 'opacity-0' : 'opacity-100'}`} 
                loading="lazy"
                onLoad={() => setImgLoading(false)}
              />
              {imgLoading && (
                <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                  <Loader2 className="size-5 text-slate-400 animate-spin" />
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-slate-50 relative">
              <div className="relative">
                <Wrench className="size-12 text-slate-300 rotate-45" />
                <Settings className="size-8 text-slate-200 absolute -bottom-1 -right-1 animate-spin-slow" />
              </div>
            </div>
          )}
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur rounded text-[9px] font-bold uppercase tracking-wider text-primary shadow-sm z-10">
            {service.type}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-text-charcoal text-sm font-bold group-hover:text-primary transition-colors line-clamp-1">
              {service.name[language]}
            </h3>
            <div className="flex items-center gap-1 text-primary font-bold text-xs shrink-0">
              <Star className="size-3 fill-current" /> {service.rating}
            </div>
          </div>
          <div className="flex items-center gap-2 text-text-slate text-[10px] mb-4">
            <MapPin className="size-2.5" /> {service.address}
          </div>
          <div className="flex items-center justify-end pt-3 border-t border-border-light">
            <Link 
              to={`/service/${service.id}`}
              className="px-3 py-1.5 bg-background-secondary hover:bg-primary hover:text-white text-text-charcoal text-[10px] font-bold rounded-lg border border-border-light hover:border-primary transition-all active:scale-95"
            >
              {t('card.viewDetails')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-soft border border-border-light overflow-hidden hover:border-primary/50 transition-colors group">
      <div className="md:w-56 h-40 md:h-auto relative overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
        {service.website ? (
          <>
            <img 
              src={getImageUrl()} 
              alt={service.name[language]} 
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${imgLoading ? 'opacity-0' : 'opacity-100'}`} 
              loading="lazy"
              onLoad={() => setImgLoading(false)}
            />
            {imgLoading && (
              <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                <Loader2 className="size-6 text-slate-400 animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-slate-50 min-h-[160px]">
            <div className="relative">
              <Wrench className="size-16 text-slate-300 rotate-45" />
              <Settings className="size-10 text-slate-200 absolute -bottom-2 -right-2 animate-spin-slow" />
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm z-10">
          {service.type}
        </div>
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-start">
            <h3 className="text-text-charcoal text-base font-bold group-hover:text-primary transition-colors">
              {service.name[language]}
            </h3>
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
              <Star className="size-3.5 fill-current" /> {service.rating}
            </div>
          </div>
          <div className="flex items-center gap-2 text-text-slate text-xs">
            <MapPin className="size-3.5" /> {service.address}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-light">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] text-text-slate font-bold uppercase tracking-tight">{t('card.reviews')}</span>
              <span className="text-text-charcoal font-bold text-sm">{service.reviewsCount}</span>
            </div>
          </div>
          <Link 
            to={`/service/${service.id}`}
            className="px-5 py-1.5 bg-background-secondary hover:bg-primary hover:text-white text-text-charcoal text-xs font-bold rounded-lg border border-border-light hover:border-primary transition-all active:scale-95"
          >
            {t('card.viewDetails')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard
