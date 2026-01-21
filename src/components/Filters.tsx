import { MapPin, Settings, Star, CheckCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

interface FiltersProps {
  selectedCities: string[];
  onCityToggle: (city: string) => void;
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
}

const cities = ['Tallinn', 'Tartu', 'Narva', 'Pärnu']
const serviceTypes = ['Repair', 'Car Wash', 'Detailing', 'Tire Change']

const Filters: React.FC<FiltersProps> = ({ 
  selectedCities, 
  onCityToggle, 
  selectedTypes, 
  onTypeToggle,
  minRating,
  onRatingChange
}) => {
  const { t } = useLanguage();

  return (
    <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6 p-6 bg-background-secondary rounded-xl border border-border-light lg:sticky lg:top-24 h-fit">
      <div className="flex flex-col gap-1">
        <h1 className="text-text-charcoal text-xl font-bold">{t('filters.title')}</h1>
        <p className="text-text-slate text-sm">{t('filters.subtitle')}</p>
      </div>
      
      <div className="flex flex-col border-b border-border-light pb-6">
        <div className="flex items-center gap-2 mb-4 text-text-charcoal">
          <MapPin className="size-5" />
          <span className="font-bold text-sm uppercase tracking-wider">{t('filters.city')}</span>
        </div>
        <div className="space-y-1">
          {cities.map((city) => (
            <label key={city} className="flex items-center gap-3 py-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={selectedCities.includes(city)}
                onChange={() => onCityToggle(city)}
                className="h-5 w-5 rounded border-slate-300 border-2 bg-white text-primary checked:bg-primary checked:border-primary focus:ring-primary focus:ring-offset-0 focus:outline-none" 
              />
              <p className="text-text-slate text-sm font-medium group-hover:text-primary transition-colors">{city}</p>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col border-b border-border-light pb-6">
        <div className="flex items-center gap-2 mb-4 text-text-charcoal">
          <Settings className="size-5" />
          <span className="font-bold text-sm uppercase tracking-wider">{t('filters.type')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {serviceTypes.map((type) => {
            const isSelected = selectedTypes.includes(type)
            return (
              <div 
                key={type} 
                onClick={() => onTypeToggle(type)}
                className={`flex h-8 items-center justify-center rounded-lg px-3 py-1 cursor-pointer shadow-sm transition-all ${isSelected ? 'bg-primary text-white' : 'bg-white border border-border-light text-text-slate hover:border-primary/50'}`}
              >
                <p className="text-xs font-bold uppercase">{type}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-4 text-text-charcoal">
          <Star className="size-5" />
          <span className="font-bold text-sm uppercase tracking-wider">{t('filters.rating')}</span>
        </div>
        <div className="space-y-2">
          {[4, 3].map((rating) => (
            <button 
              key={rating}
              onClick={() => onRatingChange(rating)}
              className={`flex items-center justify-between w-full px-4 py-2 rounded-lg group transition-colors ${minRating === rating ? 'bg-primary/5 border border-primary/20' : 'bg-white border border-border-light hover:border-primary/40'}`}
            >
              <div className="flex items-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`size-3 ${i < rating ? 'fill-current' : 'text-slate-300'}`} />
                ))}
                <span className="ml-2 text-text-charcoal text-xs font-bold">{rating}.0+</span>
              </div>
              {minRating === rating && <CheckCircle className="size-5 text-primary" />}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default Filters
