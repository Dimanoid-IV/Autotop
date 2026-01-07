import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default function PrivacyPolicyPage({ params }: { params: { locale: string } }) {
  const isRussian = params.locale === 'ru'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <LanguageSwitcher />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-card shadow-card p-8">
          {isRussian ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Политика конфиденциальности</h1>
              
              <p className="text-gray-600 mb-4">
                Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
              </p>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Введение</h2>
                <p className="text-gray-700 mb-2">
                  Добро пожаловать в Autotop Estonia. Мы ценим вашу конфиденциальность и стремимся защищать ваши персональные данные. 
                  Эта политика конфиденциальности описывает, как мы собираем, используем и защищаем вашу информацию.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Собираемые данные</h2>
                <p className="text-gray-700 mb-2">Мы можем собирать следующую информацию:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Имя и адрес электронной почты при регистрации</li>
                  <li>Профильная информация из социальных сетей (при входе через Google/Facebook)</li>
                  <li>Отзывы и рейтинги, которые вы оставляете</li>
                  <li>Информация об использовании сайта (через cookies)</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Использование данных</h2>
                <p className="text-gray-700 mb-2">Мы используем собранные данные для:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Предоставления и улучшения наших услуг</li>
                  <li>Аутентификации пользователей</li>
                  <li>Отображения отзывов и рейтингов</li>
                  <li>Отправки уведомлений (с вашего согласия)</li>
                  <li>Анализа использования платформы</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Защита данных</h2>
                <p className="text-gray-700 mb-2">
                  Мы применяем современные меры безопасности для защиты ваших данных, включая:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Шифрование данных при передаче (SSL/TLS)</li>
                  <li>Безопасное хранение паролей (хеширование)</li>
                  <li>Ограниченный доступ к персональным данным</li>
                  <li>Регулярные проверки безопасности</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Обмен данными с третьими лицами</h2>
                <p className="text-gray-700 mb-2">
                  Мы не продаём ваши персональные данные третьим лицам. Мы можем делиться данными только:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>С вашего явного согласия</li>
                  <li>По требованию закона</li>
                  <li>С сервис-провайдерами (Google, Facebook) при использовании OAuth аутентификации</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Ваши права</h2>
                <p className="text-gray-700 mb-2">Вы имеете право:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Получить доступ к вашим персональным данным</li>
                  <li>Исправить неточные данные</li>
                  <li>Удалить свою учётную запись и данные</li>
                  <li>Отозвать согласие на обработку данных</li>
                  <li>Экспортировать ваши данные</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Cookies</h2>
                <p className="text-gray-700 mb-2">
                  Мы используем cookies для улучшения работы сайта и сохранения вашей сессии. 
                  Вы можете управлять cookies в настройках вашего браузера.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Удаление данных</h2>
                <p className="text-gray-700 mb-2">
                  Чтобы удалить вашу учётную запись и все связанные данные, свяжитесь с нами по адресу:{' '}
                  <a href="mailto:autotop.ee@gmail.com" className="text-primary hover:underline">
                    autotop.ee@gmail.com
                  </a>
                </p>
                <p className="text-gray-700 mt-2">
                  Мы удалим ваши данные в течение 30 дней после получения запроса.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Изменения политики</h2>
                <p className="text-gray-700 mb-2">
                  Мы можем обновлять эту политику конфиденциальности. Мы уведомим вас о существенных изменениях 
                  через email или уведомление на сайте.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Контакты</h2>
                <p className="text-gray-700 mb-2">
                  Если у вас есть вопросы о нашей политике конфиденциальности, свяжитесь с нами:
                </p>
                <ul className="list-none text-gray-700 space-y-1">
                  <li>Email: <a href="mailto:autotop.ee@gmail.com" className="text-primary hover:underline">autotop.ee@gmail.com</a></li>
                  <li>Веб-сайт: <a href="https://autotop.vercel.app" className="text-primary hover:underline">autotop.vercel.app</a></li>
                </ul>
              </section>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Privaatsuspoliitika</h1>
              
              <p className="text-gray-600 mb-4">
                Viimati uuendatud: {new Date().toLocaleDateString('et-EE')}
              </p>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Sissejuhatus</h2>
                <p className="text-gray-700 mb-2">
                  Tere tulemast Autotop Estoniasse. Väärtustame teie privaatsust ja püüame kaitsta teie isikuandmeid. 
                  See privaatsuspoliitika kirjeldab, kuidas me kogume, kasutame ja kaitseme teie teavet.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Kogutud andmed</h2>
                <p className="text-gray-700 mb-2">Me võime koguda järgmist teavet:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Nimi ja e-posti aadress registreerimisel</li>
                  <li>Profiiliteave sotsiaalmeediast (Google/Facebook sisselogimisel)</li>
                  <li>Arvustused ja hinnangud, mille jätate</li>
                  <li>Veebisaidi kasutamise teave (küpsiste kaudu)</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Andmete kasutamine</h2>
                <p className="text-gray-700 mb-2">Kasutame kogutud andmeid:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Teenuste pakkumiseks ja parandamiseks</li>
                  <li>Kasutajate autentimiseks</li>
                  <li>Arvustuste ja hinnangute kuvamiseks</li>
                  <li>Teatiste saatmiseks (teie nõusolekul)</li>
                  <li>Platvormi kasutamise analüüsimiseks</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Andmekaitse</h2>
                <p className="text-gray-700 mb-2">
                  Rakendame kaasaegseid turvameetmeid teie andmete kaitsmiseks, sealhulgas:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Andmete krüpteerimine ülekandmisel (SSL/TLS)</li>
                  <li>Turvaline paroolide salvestamine (räsimine)</li>
                  <li>Piiratud juurdepääs isikuandmetele</li>
                  <li>Regulaarsed turvakontrollid</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Andmete jagamine kolmandate osapooltega</h2>
                <p className="text-gray-700 mb-2">
                  Me ei müü teie isikuandmeid kolmandatele osapooltele. Võime andmeid jagada ainult:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Teie selge nõusolekul</li>
                  <li>Seaduse nõudmisel</li>
                  <li>Teenusepakkujatega (Google, Facebook) OAuth autentimise kasutamisel</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Teie õigused</h2>
                <p className="text-gray-700 mb-2">Teil on õigus:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Pääseda juurde oma isikuandmetele</li>
                  <li>Parandada ebatäpseid andmeid</li>
                  <li>Kustutada oma konto ja andmed</li>
                  <li>Tühistada nõusolek andmete töötlemiseks</li>
                  <li>Eksportida oma andmed</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Küpsised</h2>
                <p className="text-gray-700 mb-2">
                  Kasutame küpsiseid veebisaidi töö parandamiseks ja teie seansi salvestamiseks. 
                  Saate hallata küpsiseid oma brauseri seadetes.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Andmete kustutamine</h2>
                <p className="text-gray-700 mb-2">
                  Oma konto ja kõigi seotud andmete kustutamiseks võtke meiega ühendust:{' '}
                  <a href="mailto:autotop.ee@gmail.com" className="text-primary hover:underline">
                    autotop.ee@gmail.com
                  </a>
                </p>
                <p className="text-gray-700 mt-2">
                  Kustutame teie andmed 30 päeva jooksul pärast taotluse saamist.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Poliitika muudatused</h2>
                <p className="text-gray-700 mb-2">
                  Võime seda privaatsuspoliitikat uuendada. Teavitame teid olulistest muudatustest 
                  e-posti või veebisaidil oleva teatise kaudu.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Kontaktandmed</h2>
                <p className="text-gray-700 mb-2">
                  Kui teil on küsimusi meie privaatsuspoliitika kohta, võtke meiega ühendust:
                </p>
                <ul className="list-none text-gray-700 space-y-1">
                  <li>E-post: <a href="mailto:autotop.ee@gmail.com" className="text-primary hover:underline">autotop.ee@gmail.com</a></li>
                  <li>Veebisait: <a href="https://autotop.vercel.app" className="text-primary hover:underline">autotop.vercel.app</a></li>
                </ul>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

