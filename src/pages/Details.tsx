import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Star, ArrowLeft, Phone, Globe, MessageSquare, Loader2, Wrench, Settings, Navigation, Clock } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useLanguage } from '../context/LanguageContext'
import { Service } from '../data/services'
import { useUser, SignInButton } from '@clerk/clerk-react'

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { language, t } = useLanguage();
  const { user, isSignedIn } = useUser();
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [imgLoading, setImgLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewData, setReviewData] = useState({ rating: 5, author: '', text: '' })
  const [submitting, setSubmitting] = useState(false)

  const getImageUrl = (url: string) => {
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=1200`;
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services?id=${id}`)
        if (response.ok) {
          const data = await response.json()
          setService(data)
        }
      } catch (err) {
        console.error('Failed to fetch service details:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [id])

  useEffect(() => {
    if (user && !reviewData.author) {
      setReviewData(prev => ({ ...prev, author: user.fullName || user.firstName || '' }));
    }
  }, [user]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: id,
          rating: reviewData.rating,
          comment: reviewData.text,
          authorName: reviewData.author,
          userId: user?.id,
          userEmail: user?.primaryEmailAddress?.emailAddress
        })
      });

      if (response.ok) {
        const newReview = await response.json();
        setService(prev => prev ? {
          ...prev,
          reviews: [newReview, ...(prev.reviews || [])],
          reviewsCount: prev.reviewsCount + 1,
          rating: Number(((prev.rating * prev.reviewsCount + newReview.rating) / (prev.reviewsCount + 1)).toFixed(1))
        } : null);
        setShowReviewForm(false);
        setReviewData({ rating: 5, author: '', text: '' });
        alert(language === 'ru' ? 'Отзыв успешно добавлен!' : 'Arvustus on edukalt lisatud!');
      } else {
        const errorData = await response.json();
        alert((language === 'ru' ? 'Ошибка: ' : 'Viga: ') + (errorData.message || errorData.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('Failed to submit review:', err);
      alert(language === 'ru' ? 'Произошла ошибка при отправке.' : 'Tekkis viga saatmisel.');
    } finally {
      setSubmitting(false);
    }
  };

  const isOpenNow = () => {
    if (!service?.workingHours) return null;
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1 is Monday...
    const time = now.getHours() * 100 + now.getMinutes();
    
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todaySchedule = service.workingHours[days[day] as keyof typeof service.workingHours];
    
    if (!todaySchedule || todaySchedule === 'Closed' || todaySchedule === 'Suletud') return false;
    
    const [start, end] = todaySchedule.split('-').map(t => parseInt(t.replace(':', '')));
    return time >= start && time <= end;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-charcoal">Service not found</h1>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">Back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-main">
      <Helmet>
        <title>{`${service.name[language]} — ${service.city || 'Estonia'} | Autotop`}</title>
        <meta name="description" content={`${service.name[language]} в ${service.city || 'Эстонии'}. ${service.description[language].slice(0, 150)}...`} />
        <link rel="canonical" href={`https://www.autotop.ee/service/${id}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${service.name[language]} — Autotop`} />
        <meta property="og:description" content={service.description[language].slice(0, 150)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.autotop.ee/service/${id}`} />
        <meta property="og:image" content={service.website ? getImageUrl(service.website) : "https://www.autotop.ee/logo.png"} />
        
        {/* Structured Data for Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": service.name[language],
            "image": service.website ? getImageUrl(service.website) : "https://www.autotop.ee/logo.png",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": service.address,
              "addressLocality": service.city || "Estonia",
              "addressCountry": "EE"
            },
            ...(service.reviewsCount > 0 && service.rating >= 1 && service.rating <= 5 ? {
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": service.rating,
                "reviewCount": service.reviewsCount
              }
            } : {}),
            "telephone": service.phone || "+372 555 0000",
            "url": `https://www.autotop.ee/service/${id}`
          })}
        </script>
      </Helmet>
      <Header search="" onSearchChange={() => {}} />
      
      <main className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8">
        <Link to="/" className="flex items-center gap-2 text-text-slate hover:text-primary transition-colors mb-6 font-semibold text-sm">
          <ArrowLeft className="size-4" /> {t('details.back')}
        </Link>

        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-2xl overflow-hidden border border-border-light shadow-soft">
              <div className="h-[400px] relative overflow-hidden bg-slate-100 flex items-center justify-center">
                {service.website ? (
                  <>
                    <img 
                      src={getImageUrl(service.website)} 
                      alt={service.name[language]} 
                      className={`w-full h-full object-cover transition-all duration-500 ${imgLoading ? 'opacity-0' : 'opacity-100'}`} 
                      onLoad={() => setImgLoading(false)}
                    />
                    {imgLoading && (
                      <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                        <Loader2 className="size-8 text-slate-400 animate-spin" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-slate-50 relative">
                    <div className="relative">
                      <Wrench className="size-24 text-slate-300 rotate-45" />
                      <Settings className="size-16 text-slate-200 absolute -bottom-2 -right-2 animate-spin-slow" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                      {service.type}
                    </span>
                    <h1 className="text-3xl font-extrabold text-text-charcoal">{service.name[language]}</h1>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold shadow-sm">
                      <Star className="size-5 fill-current" /> {service.rating}
                    </div>
                    {service.workingHours && (
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm border ${
                        isOpenNow() 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        <div className={`size-1.5 rounded-full ${isOpenNow() ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        {isOpenNow() ? t('details.openNow') : t('details.closed')}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-6 text-text-slate mb-8 border-y border-border-light py-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-5 text-primary" />
                    <span className="font-medium">{service.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-5 text-primary" />
                    <span className="font-medium">{service.phone || '+372 555 0000'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="size-5 text-primary" />
                    <span className="font-medium">
                      {service.website ? service.website.replace(/^https?:\/\//, '').replace(/\/$/, '') : `www.${service.name[language].toLowerCase().replace(/\s+/g, '')}.ee`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-text-charcoal">{t('details.about')}</h2>
                  <p className="text-text-slate leading-relaxed">
                    {service.description[language]} 
                  </p>
                </div>

                {/* Working Hours */}
                {service.workingHours && (
                  <div className="mt-8 flex flex-col gap-4 bg-background-secondary p-6 rounded-2xl border border-border-light">
                    <div className="flex items-center gap-2 text-text-charcoal font-bold">
                      <Clock className="size-5 text-primary" />
                      {t('details.workingHours')}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-12">
                      {[
                        { key: 'mon', label: t('details.mon') },
                        { key: 'tue', label: t('details.tue') },
                        { key: 'wed', label: t('details.wed') },
                        { key: 'thu', label: t('details.thu') },
                        { key: 'fri', label: t('details.fri') },
                        { key: 'sat', label: t('details.sat') },
                        { key: 'sun', label: t('details.sun') },
                      ].map((day) => (
                        <div key={day.key} className="flex justify-between items-center py-1 border-b border-border-light last:border-0 sm:last:border-b">
                          <span className="text-sm font-bold text-text-slate">{day.label}</span>
                          <span className={`text-sm font-medium ${service.workingHours?.[day.key as keyof typeof service.workingHours] === 'Closed' ? 'text-rose-500' : 'text-text-charcoal'}`}>
                            {service.workingHours?.[day.key as keyof typeof service.workingHours]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Google Maps Embed */}
                <div className="mt-8 flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-text-charcoal">{t('details.address')}</h2>
                  <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-border-light shadow-sm bg-slate-100">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(service.address + ', ' + (service.city || 'Estonia'))}&output=embed`}
                      allowFullScreen
                    ></iframe>
                  </div>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(service.address + ', ' + (service.city || 'Estonia'))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all shadow-soft active:scale-95"
                  >
                    <Navigation className="size-5" />
                    {t('details.getDirections')}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-border-light shadow-soft">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-charcoal">{t('details.reviews')}</h2>
                {isSignedIn ? (
                  <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-primary font-bold hover:underline flex items-center gap-2"
                  >
                    <MessageSquare className="size-4" /> {t('details.writeReview')}
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button className="text-primary font-bold hover:underline flex items-center gap-2">
                      <MessageSquare className="size-4" /> {t('details.writeReview')}
                    </button>
                  </SignInButton>
                )}
              </div>

              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-background-secondary rounded-xl border border-border-light">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col flex-1">
                        <label className="text-xs font-bold text-text-slate uppercase mb-1">Имя</label>
                        <input 
                          type="text" 
                          required
                          readOnly={!!user}
                          value={reviewData.author}
                          onChange={(e) => setReviewData({...reviewData, author: e.target.value})}
                          className={`px-4 py-2 rounded-lg border border-border-light focus:outline-none focus:border-primary ${user ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                          placeholder="Ваше имя"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-text-slate uppercase mb-1">Оценка</label>
                        <div className="flex items-center gap-1 h-10">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewData({...reviewData, rating: star})}
                              className="focus:outline-none"
                            >
                              <Star className={`size-5 ${star <= reviewData.rating ? 'fill-primary text-primary' : 'text-slate-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-text-slate uppercase mb-1">Ваш отзыв</label>
                      <textarea 
                        required
                        value={reviewData.text}
                        onChange={(e) => setReviewData({...reviewData, text: e.target.value})}
                        className="px-4 py-2 rounded-lg border border-border-light focus:outline-none focus:border-primary min-h-[100px]"
                        placeholder="Поделитесь вашим опытом..."
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-2">
                      <button 
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-6 py-2 text-text-slate font-bold hover:text-text-charcoal"
                      >
                        Отмена
                      </button>
                      <button 
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        {submitting ? 'Отправка...' : 'Опубликовать'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="space-y-6">
                {service.reviews && service.reviews.length > 0 ? (
                  service.reviews.map((rev) => (
                    <div key={rev.id} className="pb-6 border-b border-border-light last:border-0 last:pb-0">
                      <div className="flex justify-between mb-2">
                        <div className="font-bold text-text-charcoal">{rev.author}</div>
                        <div className="flex text-primary">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={`size-3 ${j < rev.rating ? 'fill-current' : 'text-slate-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-text-slate text-sm">{rev.text}</p>
                      <div className="text-[10px] text-slate-400 mt-2 font-bold uppercase">
                        {new Date(rev.createdAt).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'et-EE', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-text-slate text-center py-8 italic">Отзывов пока нет. Будьте первым!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Details
