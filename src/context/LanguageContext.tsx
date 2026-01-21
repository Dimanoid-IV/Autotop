import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'ru' | 'et';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ru: {
    'nav.contact': 'Связаться с нами',
    'nav.addService': 'Добавить сервис',
    'header.addReview': 'Добавить отзыв',
    'header.searchPlaceholder': 'Поиск мастерских, моек...',
    'filters.title': 'Фильтры',
    'filters.subtitle': 'Уточните параметры поиска',
    'filters.city': 'Город',
    'filters.type': 'Тип услуг',
    'filters.price': 'Цена (€)',
    'filters.rating': 'Мин. рейтинг',
    'home.found': 'Найдено',
    'home.servicesIn': 'услуг в',
    'home.sortedBy': 'Сортировка: По релевантности',
    'home.welcome': 'Найдите свой идеальный автосервис в Эстонии — быстро, удобно и надёжно!',
    'home.noResults': 'Услуги по вашим фильтрам не найдены.',
    'home.clearFilters': 'Очистить фильтры',
    'home.loadMore': 'Еще',
    'home.searchLabel': 'или введи название сервиса',
    'home.seoTitle': 'Autotop — Лучшие автосервисы Эстонии',
    'home.seoDescription': 'Найдите идеальный автосервис в Эстонии. Ремонт, мойка, детейлинг — всё в одном месте с честными отзывами.',
    'home.seoCityTitle': 'Автосервисы в г. {city} — Ремонт и обслуживание | Autotop',
    'home.seoCityDescription': 'Лучшие автосервисы и мастерские в г. {city}. Реальные отзывы, актуальные цены и контакты проверенных специалистов в {city}.',
    'footer.about': 'О проекте',
    'footer.aboutText': 'Autotop — это крупнейший агрегатор автосервисов в Эстонии. Мы помогаем автовладельцам находить лучшие мастерские, мойки и детейлинг-центры на основе реальных отзывов и актуальных данных.',
    'footer.quickLinks': 'Быстрые ссылки',
    'footer.cities': 'Города',
    'footer.popularTypes': 'Популярные услуги',
    'footer.rights': 'Все права защищены.',
    'card.from': 'От',
    'card.reviews': 'Отзывов',
    'card.viewDetails': 'Подробнее',
    'details.back': 'Назад к результатам',
    'details.about': 'Об услуге',
    'details.reviews': 'Отзывы клиентов',
    'details.writeReview': 'Написать отзыв',
    'details.book': 'Записаться',
    'details.nextAvailable': 'Ближайшее время',
    'details.message': 'Отправить сообщение',
    'details.cta': 'Узнавайте о записи быстрее всех',
    'details.today': 'Сегодня',
    'details.getDirections': 'Проложить маршрут',
    'details.address': 'Адрес',
    'details.workingHours': 'Часы работы',
    'details.openNow': 'Открыто',
    'details.closed': 'Закрыто',
    'details.mon': 'Пн',
    'details.tue': 'Вт',
    'details.wed': 'Ср',
    'details.thu': 'Чт',
    'details.fri': 'Пт',
    'details.sat': 'Сб',
    'details.sun': 'Вс',
    'contact.title': 'Связаться с нами',
    'contact.name': 'Ваше имя',
    'contact.email': 'Ваш Email',
    'contact.message': 'Сообщение',
    'contact.send': 'Отправить',
    'contact.success': 'Сообщение успешно отправлено!',
    'addService.title': 'Добавить сервис',
    'addService.businessName': 'Название фирмы',
    'addService.city': 'Город',
    'addService.address': 'Адрес',
    'addService.phone': 'Телефон',
    'addService.website': 'Сайт',
    'addService.success': 'Заявка на добавление отправлена!',
  },
  et: {
    'nav.contact': 'Võta ühendust',
    'nav.addService': 'Lisa teenus',
    'header.addReview': 'Lisa arvustus',
    'header.searchPlaceholder': 'Otsi töökodasid, pesulaid...',
    'filters.title': 'Filtrid',
    'filters.subtitle': 'Täpsusta otsingut',
    'filters.city': 'Linn',
    'filters.type': 'Teenuse tüüp',
    'filters.price': 'Hinnavahemik (€)',
    'filters.rating': 'Min. reiting',
    'home.found': 'Leitud',
    'home.servicesIn': 'teenust linnas',
    'home.sortedBy': 'Sorteeri: Asjakohasus',
    'home.welcome': 'Leia oma ideaalne autoteenindus Eestis – kiiresti, mugavalt ja usaldusväärselt!',
    'home.noResults': 'Teie filtritele vastavaid teenuseid ei leitud.',
    'home.clearFilters': 'Puhasta filtrid',
    'home.loadMore': 'Veel',
    'home.searchLabel': 'või sisesta teenuse nimi',
    'home.seoTitle': 'Autotop — Eesti parimad autoteenindused',
    'home.seoDescription': 'Leia täiuslik autoteenindus Eestis. Remont, pesula, detailing — kõik ühes kohas koos ausate arvustustega.',
    'home.seoCityTitle': 'Autoteenindused linnas {city} — Remont ja hooldus | Autotop',
    'home.seoCityDescription': 'Parimad autoteenindused ja töökojad linnas {city}. Reaalsed arvustused, ajakohased hinnad ja kontrollitud spetsialistide kontaktid linnas {city}.',
    'footer.about': 'Meist',
    'footer.aboutText': 'Autotop on Eesti suurim autoteeninduste koondleht. Aitame autoomanikel leida parimaid töökodasid, pesulaid ja detailing-keskusi reaalsete arvustuste ja ajakohaste andmete põhjal.',
    'footer.quickLinks': 'Kiirlingid',
    'footer.cities': 'Linnad',
    'footer.popularTypes': 'Populaarsed teenused',
    'footer.rights': 'Kõik õigused kaitstud.',
    'card.from': 'Alates',
    'card.reviews': 'Arvustust',
    'card.viewDetails': 'Vaata lähemalt',
    'details.back': 'Tagasi tulemuste juurde',
    'details.about': 'Teenusest',
    'details.reviews': 'Klientide arvustused',
    'details.writeReview': 'Kirjuta arvustus',
    'details.book': 'Broneeri aeg',
    'details.nextAvailable': 'Järgmine vaba aeg',
    'details.message': 'Saada sõnum',
    'details.cta': 'Saa teavitusi broneeringust kiiremini kui keegi teine',
    'details.today': 'Täna',
    'details.getDirections': 'Saa juhised',
    'details.address': 'Aadress',
    'details.workingHours': 'Lahtiolekuajad',
    'details.openNow': 'Avatud',
    'details.closed': 'Suletud',
    'details.mon': 'E',
    'details.tue': 'T',
    'details.wed': 'K',
    'details.thu': 'N',
    'details.fri': 'R',
    'details.sat': 'L',
    'details.sun': 'P',
    'contact.title': 'Võta ühendust',
    'contact.name': 'Teie nimi',
    'contact.email': 'Teie Email',
    'contact.message': 'Sõnum',
    'contact.send': 'Saada',
    'contact.success': 'Sõnum on edukalt saadetud!',
    'addService.title': 'Lisa teenus',
    'addService.businessName': 'Ettevõtte nimi',
    'addService.city': 'Linn',
    'addService.address': 'Aadress',
    'addService.phone': 'Telefon',
    'addService.website': 'Veebileht',
    'addService.success': 'Taotlus teenuse lisamiseks on saadetud!',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['ru']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
