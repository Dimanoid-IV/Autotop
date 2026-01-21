import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { List, LayoutGrid, Search } from 'lucide-react'
import Header from '../components/Header'
import Filters from '../components/Filters'
import ServiceCard from '../components/ServiceCard'
import ServiceCardSkeleton from '../components/ServiceCardSkeleton'
import Footer from '../components/Footer'
import { useLanguage } from '../context/LanguageContext'
import { Service } from '../data/services'

const Home: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { city: cityParamFromRoute } = useParams()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [visibleCount, setVisibleCount] = useState(21) // 7 rows of 3 columns
  
  const { language, t } = useLanguage();

  const seoTitle = selectedCities.length === 1 
    ? t('home.seoCityTitle').replace(/{city}/g, selectedCities[0])
    : t('home.seoTitle');

  const seoDescription = selectedCities.length === 1
    ? t('home.seoCityDescription').replace(/{city}/g, selectedCities[0])
    : t('home.seoDescription');

  const canonicalUrl = `https://www.autotop.ee${cityParamFromRoute ? `/${cityParamFromRoute.toLowerCase()}` : ''}`;

  useEffect(() => {
    // Read filters from URL route and search params
    const cityParam = searchParams.get('city');
    const typeParam = searchParams.get('type');
    
    if (cityParamFromRoute) {
      // Capitalize first letter if needed, or match with cities list
      const city = cityParamFromRoute.charAt(0).toUpperCase() + cityParamFromRoute.slice(1).toLowerCase();
      setSelectedCities([city]);
    } else if (cityParam) {
      setSelectedCities([cityParam]);
    } else {
      setSelectedCities([]);
    }

    if (typeParam) {
      setSelectedTypes([typeParam]);
    } else {
      setSelectedTypes([]);
    }
  }, [searchParams, cityParamFromRoute]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        const data = await response.json()
        setServices(data)
      } catch (err) {
        console.error('Failed to fetch services:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const handleCityToggle = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    )
  }

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const filteredServices = useMemo(() => {
    // Reset pagination when filters change
    setVisibleCount(21);
    const searchLower = search.toLowerCase();
    
    return services.filter(service => {
      const matchesSearch = 
        service.name[language].toLowerCase().includes(searchLower) || 
        service.description[language].toLowerCase().includes(searchLower) ||
        service.type.toLowerCase().includes(searchLower) ||
        service.address.toLowerCase().includes(searchLower);
        
      const matchesCity = selectedCities.length === 0 || 
                          selectedCities.some(c => c.toLowerCase() === service.city?.toLowerCase())
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(service.type)
      const matchesRating = service.rating >= minRating

      return matchesSearch && matchesCity && matchesType && matchesRating
    })
  }, [services, search, selectedCities, selectedTypes, minRating, language])

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:image" content="https://www.autotop.ee/logo.png" />
      </Helmet>
      <Header search={search} onSearchChange={setSearch} />

      <main className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 px-6 lg:px-10 py-8">
        <div className="lg:w-72 shrink-0 flex flex-col gap-6">
          <h1 className="lg:hidden text-2xl font-extrabold text-text-charcoal px-2 leading-tight">
            {t('home.welcome')}
          </h1>
          <Filters 
            selectedCities={selectedCities}
            onCityToggle={handleCityToggle}
            selectedTypes={selectedTypes}
            onTypeToggle={handleTypeToggle}
            minRating={minRating}
            onRatingChange={setMinRating}
          />
          {/* Mobile Search */}
          <div className="lg:hidden flex flex-col gap-2 px-2">
            <p className="text-[10px] text-text-slate uppercase tracking-widest font-bold">
              {t('home.searchLabel')}
            </p>
            <div className="flex w-full items-stretch rounded-xl h-12 bg-white border border-border-light shadow-soft overflow-hidden group focus-within:border-primary transition-colors">
              <div className="text-text-slate flex items-center justify-center pl-4">
                <Search className="size-5 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                className="flex w-full min-w-0 flex-1 border-none bg-transparent text-text-charcoal focus:outline-0 focus:ring-0 placeholder:text-slate-400 px-4 pl-2 text-sm font-medium" 
                placeholder={t('header.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <h1 className="hidden lg:block text-2xl font-extrabold text-text-charcoal px-2 leading-tight">
            {t('home.welcome')}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-soft border border-border-light">
            <div>
              <h2 className="text-text-charcoal text-lg font-bold">
                {t('home.found')} <span className="text-primary">{filteredServices.length}</span> {t('home.servicesIn')} 
                {selectedCities.length > 0 ? ` ${selectedCities.join(', ')}` : ' Estonia'}
              </h2>
              <p className="text-text-slate text-xs font-medium">{t('home.sortedBy')}</p>
            </div>
            <div className="flex items-center bg-background-secondary p-1 rounded-lg border border-border-light">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white text-text-charcoal shadow-sm border border-border-light' : 'text-text-slate hover:text-text-charcoal'}`}
              >
                <List className="size-4" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-text-charcoal shadow-sm border border-border-light' : 'text-text-slate hover:text-text-charcoal'}`}
              >
                <LayoutGrid className="size-4" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-text-slate uppercase tracking-widest font-bold px-2">
            Find the best rated auto services in Estonia faster than anyone else
          </p>

          {loading ? (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {Array.from({ length: 9 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredServices.length > 0 ? (
                  filteredServices.slice(0, visibleCount).map((service) => (
                    <ServiceCard key={service.id} service={service} viewMode={viewMode} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-border-light col-span-full">
                    <p className="text-text-slate font-medium">{t('home.noResults')}</p>
                    <button 
                      onClick={() => {
                        setSelectedCities([])
                        setSelectedTypes([])
                        setMinRating(0)
                        setSearch('')
                      }}
                      className="mt-4 text-primary font-bold hover:underline"
                    >
                      {t('home.clearFilters')}
                    </button>
                  </div>
                )}
              </div>

              {filteredServices.length > visibleCount && (
                <div className="flex justify-center mt-12 mb-8">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 10)}
                    className="px-12 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-all active:scale-95 shadow-soft"
                  >
                    {t('home.loadMore')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
