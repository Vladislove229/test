/* ═══════════════════════════════════
   FZRTATTS — Shared JS v2
═══════════════════════════════════ */

/* ── CURSOR ── */
const cur = document.getElementById('cur');
const curR = document.getElementById('cur-r');
if (cur && curR) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  });
  (function loop() {
    rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
    curR.style.left = rx + 'px'; curR.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
}

/* ── PROGRESS BAR ── */
const prog = document.getElementById('prog');
if (prog) {
  document.addEventListener('scroll', () => {
    const ratio = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    prog.style.width = (Math.min(1, Math.max(0, ratio)) * 100) + '%';
  });
}

/* ── PRELOADER ── */
const preloader = document.getElementById('preloader');
if (preloader) {
  const hide = () => preloader.classList.add('gone');
  window.addEventListener('load', () => setTimeout(hide, 1400));
  setTimeout(hide, 5000); // fallback
}

/* ── YEAR ── */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

/* ── BURGER NAV + OVERLAY ── */
const burger  = document.getElementById('burger');
const mainNav = document.getElementById('mainNav');

// Create overlay dynamically and insert before nav
let navOverlay = document.querySelector('.nav-overlay');
if (!navOverlay && mainNav) {
  navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  document.body.appendChild(navOverlay);
}

// Create close button inside nav if not exists
let navClose = mainNav ? mainNav.querySelector('.nav-close') : null;
if (!navClose && mainNav) {
  navClose = document.createElement('button');
  navClose.className = 'nav-close';
  navClose.innerHTML = '×';
  navClose.setAttribute('aria-label', 'Закрыть меню');
  mainNav.insertBefore(navClose, mainNav.firstChild);
}

function openNav() {
  if (!mainNav) return;
  mainNav.classList.add('open');
  if (burger) burger.classList.add('open');
  if (navOverlay) navOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  if (!mainNav) return;
  mainNav.classList.remove('open');
  if (burger) burger.classList.remove('open');
  if (navOverlay) navOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

if (burger) burger.addEventListener('click', openNav);
if (navClose) navClose.addEventListener('click', closeNav);
if (navOverlay) navOverlay.addEventListener('click', closeNav);
if (mainNav) {
  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      // Only close on mobile
      if (window.innerWidth <= 768) closeNav();
    });
  });
}

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => ro.observe(el));
}

/* ── BOOKING MODAL ── */
const bookModal = document.getElementById('bookModal');
const bookClose = document.getElementById('bookClose');
const bookForm  = document.getElementById('bookForm');
const formMsg   = document.getElementById('formMsg');

function openModal(m) { if(m){ m.classList.add('open'); document.body.style.overflow='hidden'; } }
function closeModal(m){ if(m){ m.classList.remove('open'); document.body.style.overflow=''; } }

if (bookModal) {
  document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openModal(bookModal); });
  });
  if (bookClose) bookClose.addEventListener('click', () => closeModal(bookModal));
  bookModal.addEventListener('click', e => { if (e.target === bookModal) closeModal(bookModal); });
  if (bookForm && formMsg) {
    bookForm.addEventListener('submit', e => {
      e.preventDefault();
      const lang = localStorage.getItem('fzr_lang') || 'ru';
      formMsg.className = 'form-msg ok';
      formMsg.textContent = lang === 'en'
        ? 'Request sent! I\'ll contact you soon ✓'
        : 'Заявка отправлена! Скоро свяжусь с тобой ✓';
      setTimeout(() => {
        bookForm.reset();
        formMsg.className = 'form-msg';
        closeModal(bookModal);
      }, 3000);
    });
  }
}

/* ── ARTICLE MODAL ── */
const articleModal = document.getElementById('articleModal');
const artClose     = document.getElementById('artClose');
const artTitle     = document.getElementById('artTitle');
const artBody      = document.getElementById('artBody');

const articles = {
  sketch: {
    ru: {
      title: 'Разработка эскиза',
      body: `<p>Эскиз входит в стоимость сеанса. Я разрабатываю его с учётом всех пожеланий:</p>
      <ul style="padding-left:20px;margin:12px 0;line-height:2;">
        <li>учитываю стиль, тематику и детали;</li>
        <li>адаптирую под выбранное место и размер;</li>
        <li>работаю с референсами, которые ты присылаешь.</li>
      </ul>
      <p>Также могу переработать готовый эскиз в своём стиле.</p>`
    },
    en: {
      title: 'Sketch Development',
      body: `<p>The sketch is included in the session cost. I develop it based on all your wishes:</p>
      <ul style="padding-left:20px;margin:12px 0;line-height:2;">
        <li>taking into account style, theme and details;</li>
        <li>adapting to the chosen placement and size;</li>
        <li>working with references you send me.</li>
      </ul>
      <p>I can also rework an existing sketch in my style.</p>`
    }
  },
  tattoo: {
    ru: {
      title: 'Татуировка',
      body: `<p>Минимальная стоимость — <strong>4 000 ₽</strong>. В неё входит:</p>
      <ul style="padding-left:20px;margin:12px 0;line-height:2;">
        <li>аренда студии;</li>
        <li>обсуждение идеи;</li>
        <li>индивидуальная разработка эскиза;</li>
        <li>выполнение татуировки;</li>
        <li>заживляющий набор;</li>
        <li>консультации по уходу в процессе заживления.</li>
      </ul>
      <p>Для расчёта точной стоимости — пишите в Telegram.</p>`
    },
    en: {
      title: 'Tattoo Session',
      body: `<p>Minimum price — <strong>4,000 ₽</strong>. Includes:</p>
      <ul style="padding-left:20px;margin:12px 0;line-height:2;">
        <li>studio rental;</li>
        <li>idea discussion;</li>
        <li>custom sketch development;</li>
        <li>tattooing;</li>
        <li>healing kit;</li>
        <li>aftercare consultations throughout healing.</li>
      </ul>
      <p>For an exact price — message me on Telegram.</p>`
    }
  },
  certificate: {
    ru: {
      title: 'Сертификаты',
      body: `<p>Отличный вариант подарка. Сертификаты от <strong>3 000 ₽</strong>.</p>
      <p style="margin-top:10px">В электронном формате — любой номинал. Физический — в конверте с лентой и стикерами.</p>
      <p style="margin-top:14px;font-weight:600;">Условия:</p>
      <ul style="padding-left:20px;margin:8px 0;line-height:2;">
        <li>Может использоваться частично.</li>
        <li>На наличные не обменивается.</li>
        <li>Действителен 6 месяцев.</li>
        <li>После использования изымается мастером.</li>
      </ul>`
    },
    en: {
      title: 'Gift Certificates',
      body: `<p>A great gift idea. Certificates from <strong>3,000 ₽</strong>.</p>
      <p style="margin-top:10px">Digital format — any amount. Physical — in an envelope with ribbon and stickers.</p>
      <p style="margin-top:14px;font-weight:600;">Terms:</p>
      <ul style="padding-left:20px;margin:8px 0;line-height:2;">
        <li>Can be used partially.</li>
        <li>Not exchangeable for cash.</li>
        <li>Valid for 6 months.</li>
        <li>Collected by the artist after use.</li>
      </ul>`
    }
  },
  healing: {
    ru: {
      title: 'Заживление',
      body: `<p>Заживление — такая же важная часть, как само нанесение.</p>
      <p style="margin-top:10px">Рассказываю про уход после каждого сеанса и выдаю набор для первых дней.</p>
      <p style="margin-top:14px;font-weight:600;">Два способа заживления:</p>
      <ol style="padding-left:20px;margin:8px 0;line-height:2;">
        <li><strong>Плёнка</strong> — носить 4 дня, снять под тёплой водой, далее пантенол 4 раза в день.</li>
        <li><strong>Пелёнка</strong> — первые 3 дня менять 3+ раз в день, потом мазь 4 раза в день.</li>
      </ol>
      <p style="margin-top:12px;color:#e8251a"><strong>Важно:</strong> не чесать, не мочить долго, избегать бани, спорта и солнца.</p>`
    },
    en: {
      title: 'Healing',
      body: `<p>Healing is just as important as the tattooing process itself.</p>
      <p style="margin-top:10px">I explain aftercare after every session and provide a kit for the first days.</p>
      <p style="margin-top:14px;font-weight:600;">Two healing methods:</p>
      <ol style="padding-left:20px;margin:8px 0;line-height:2;">
        <li><strong>Film wrap</strong> — wear 4 days, remove under warm water, then panthenol 4x/day for a week.</li>
        <li><strong>Pad method</strong> — change pads 3+ times/day for 3 days, then ointment 4x/day.</li>
      </ol>
      <p style="margin-top:12px;color:#e8251a"><strong>Important:</strong> don't scratch, avoid soaking, no sauna, sport or sun.</p>`
    }
  }
};

if (articleModal) {
  document.querySelectorAll('.read-article-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key  = btn.dataset.article;
      const lang = localStorage.getItem('fzr_lang') || 'ru';
      const art  = articles[key];
      if (art) {
        const content = art[lang] || art.ru;
        if (artTitle) artTitle.textContent = content.title;
        if (artBody)  artBody.innerHTML    = content.body;
        openModal(articleModal);
      }
    });
  });
  if (artClose) artClose.addEventListener('click', () => closeModal(articleModal));
  articleModal.addEventListener('click', e => { if (e.target === articleModal) closeModal(articleModal); });
}

/* ═════════════════════════════════════════
   FULL i18n — every text element on every page
═════════════════════════════════════════ */
const i18n = {
  ru: {
    /* NAV */
    'nav.portfolio'    : 'Портфолио',
    'nav.sketches'     : 'Эскизы',
    'nav.services'     : 'Услуги',
    'nav.cert'         : 'Сертификат',
    'nav.heal'         : 'Заживление',
    'nav.book'         : 'Записаться',
    /* HERO */
    'hero.tag'         : 'Казань · Тату-мастер',
    'hero.sub'         : 'Индивидуальные эскизы, графические линии и внимание к каждой детали',
    'hero.city'        : 'Казань · Опыт 2 года · Каждый эскиз единственный',
    /* BUTTONS */
    'btn.book'         : 'Записаться',
    'btn.portfolio'    : 'Смотреть работы',
    'btn.sketches'     : 'Смотреть эскизы →',
    'btn.more'         : 'Загрузить ещё',
    'btn.read'         : 'Читать →',
    'btn.telegram'     : 'Написать в Telegram',
    'btn.pinterest'    : 'Мой Pinterest',
    /* SECTION LABELS */
    'sec.portfolio'    : 'Портфолио',
    'sec.about'        : 'О мне',
    'sec.contacts'     : 'Контакты',
    'sec.sketches'     : 'Коллекция',
    /* GALLERY TITLES */
    'gallery.title'    : 'Мои',
    'gallery.title.em' : 'работы',
    /* ARTICLE CARDS */
    'art1.title'       : 'Как выбрать первую татуировку?',
    'art1.body'        : 'Эскиз входит в стоимость. Разрабатываю с учётом всех пожеланий, адаптирую под место и размер.',
    'art2.title'       : 'Как подготовиться к сеансу?',
    'art2.body'        : 'Минимум 4 000 ₽. Включает аренду студии, эскиз, нанесение, заживляющий набор и консультацию.',
    'art3.title'       : 'Рассчитать стоимость',
    'art3.body'        : 'Сертификаты от 3 000 ₽ — отличный подарок. В электронном формате — любой номинал.',
    /* ABOUT */
    'about.heading'    : 'Марьям',
    'about.sub'        : 'тату-мастер',
    'about.p1'         : 'Меня зовут Марьям, делаю татуировки в Казани. Опыт — 2 года. Работаю в студии в центре города.',
    'about.p2'         : 'Использую одноразовые расходники, оборудование стерилизуется, рабочее место дезинфицируется.',
    'about.p3'         : 'Каждый эскиз делаю только один раз — без повторов.',
    'contact.note'     : 'Лучше писать в Telegram — отвечаю быстрее:',
    /* FOOTER */
    'footer.copy'      : 'Тату-мастер',
    /* MODAL */
    'modal.title'      : 'Запись на сессию',
    'modal.name'       : 'Имя',
    'modal.contact'    : 'Telegram или телефон',
    'modal.service'    : 'Услуга',
    'modal.idea'       : 'Опишите идею',
    'modal.submit'     : 'Отправить заявку',
    'modal.opt1'       : 'Татуировка',
    'modal.opt2'       : 'Эскиз',
    'modal.opt3'       : 'Другое',
    /* SKETCHES PAGE */
    'sketches.sec'     : 'Коллекция',
    'sketches.title'   : 'Эс',
    'sketches.title.em': 'кизы',
    'sketches.sub'     : 'Паки готовых эскизов. Каждая работа уникальна — набивается только один раз.',
    'sketches.count'   : 'эскизов',
    /* SERVICES PAGE */
    'services.sec'     : 'FZRTATTS',
    'services.title'   : 'Ус',
    'services.title.em': 'луги',
    's1.title'         : 'Разработка эскиза',
    's1.body'          : 'Каждый эскиз разрабатывается индивидуально — с учётом пожеланий, места на теле и стиля. Без повторов.',
    's1.li1'           : 'Учитываю стиль, тематику и все детали',
    's1.li2'           : 'Адаптирую под выбранное место и размер',
    's1.li3'           : 'Работаю с твоими референсами',
    's1.li4'           : 'Могу переработать готовый эскиз в своём стиле',
    's1.price'         : 'Входит в стоимость',
    's1.price.note'    : 'сеанса',
    's1.btn'           : 'Обсудить эскиз',
    's2.title'         : 'Татуировка',
    's2.body'          : 'Полный сеанс от обсуждения идеи до готовой работы. Одноразовые расходники, стерилизованное оборудование.',
    's2.li1'           : 'Аренда студии',
    's2.li2'           : 'Обсуждение идеи и разработка эскиза',
    's2.li3'           : 'Выполнение татуировки',
    's2.li4'           : 'Заживляющий набор в подарок',
    's2.li5'           : 'Консультации по уходу в процессе заживления',
    's2.price'         : 'от 4 000 ₽',
    's2.price.note'    : 'минимум',
    's2.btn'           : 'Рассчитать стоимость',
    's3.title'         : 'Сертификаты',
    's3.body'          : 'Отличный подарок близкому человеку. Электронный или в красивом конверте с лентой и стикерами.',
    's3.li1'           : 'Физический — номинал от 3 000 ₽',
    's3.li2'           : 'Электронный — любой номинал',
    's3.li3'           : 'Действителен 6 месяцев',
    's3.li4'           : 'Оформление за 1 день',
    's3.price'         : 'от 3 000 ₽',
    's3.btn1'          : 'Заказать сертификат',
    's3.btn2'          : 'Подробнее',
    /* CERTIFICATE PAGE */
    'cert.sec'         : 'Подарок',
    'cert.title'       : 'Серти',
    'cert.title.em'    : 'фикат',
    'cert.label'       : 'Подарок на татуировку',
    'cert.heading'     : 'Лучший',
    'cert.heading.em'  : 'подарок',
    'cert.text1'       : 'Отличный вариант для друга или близкого человека. Сертификат даёт возможность получить уникальную татуировку по индивидуальному эскизу.',
    'cert.f1.name'     : 'Физический',
    'cert.f1.desc'     : 'В плотном конверте с лентой и фирменными стикерами. От 3 000 ₽.',
    'cert.f2.name'     : 'Электронный',
    'cert.f2.desc'     : 'Любой номинал. Отправлю в мессенджер или на email.',
    'cert.btn'         : 'Заказать сертификат',
    'cert.terms.title' : 'Условия',
    'cert.terms.em'    : 'использования',
    'cert.t1'          : 'Сертификат является средством оплаты. Может быть использован полностью или частично.',
    'cert.t2'          : 'При превышении суммы клиент доплачивает разницу. На наличные не обменивается.',
    'cert.t3'          : 'Действителен 6 месяцев с момента выдачи. После использования изымается мастером.',
    /* HEALING PAGE */
    'heal.sec'         : 'Уход',
    'heal.title'       : 'Зажив',
    'heal.title.em'    : 'ление',
    'heal.sub'         : 'Заживление — такая же важная часть процесса, как само нанесение. Следуй инструкции — и татуировка будет яркой.',
    'heal.tab1'        : 'Заживление плёнкой',
    'heal.tab2'        : 'Заживление пелёнкой',
    'heal.film.d1'     : '1–3',
    'heal.film.d1u'    : 'день',
    'heal.film.t1'     : 'Плёнка на месте',
    'heal.film.p1'     : 'Мастер наносит плёнку сразу после сеанса. Носи её 4 дня — не снимай раньше. На 2–3 день под плёнкой начнёт скапливаться сукровица — это нормально.',
    'heal.film.d2'     : '4',
    'heal.film.d2u'    : 'день',
    'heal.film.t2'     : 'Снять плёнку',
    'heal.film.p2'     : 'Снимай медленно под тёплой водой — оттягивающим движением. Промой мягкими движениями. Не три!',
    'heal.film.d3'     : '5–10',
    'heal.film.d3u'    : 'день',
    'heal.film.t3'     : 'Пантенол 4 раза в день',
    'heal.film.p3'     : 'Наноси пантенол 4 раза в день тонким слоем. Держи увлажнённой. Зуд — нормально. Не чеши!',
    'heal.warn.title'  : 'Важно — запрещено',
    'heal.warn.1'      : 'Чесать татуировку, отдирать корочки',
    'heal.warn.2'      : 'Принимать ванну, посещать баню / сауну',
    'heal.warn.3'      : 'Загорать и ходить в солярий',
    'heal.warn.4'      : 'Заниматься активным спортом первую неделю',
    'heal.warn.5'      : 'Использовать спиртосодержащие средства',
    'heal.diap.d1'     : '1',
    'heal.diap.d1u'    : 'этап',
    'heal.diap.t1'     : 'Первые 2–4 часа',
    'heal.diap.p1'     : 'После сеанса мастер очистит место, нанесёт заживляющее средство и укроет плёнкой. Носи 2–4 часа.',
    'heal.diap.d2'     : '2',
    'heal.diap.d2u'    : 'этап',
    'heal.diap.t2'     : '3 дня с пелёнкой',
    'heal.diap.p2'     : 'Сними первичную защиту. Промой прохладной водой с мылом. Нанеси мазь. Меняй пелёнку минимум 3 раза в день. Так 3 дня.',
    'heal.diap.d3'     : '3',
    'heal.diap.d3u'    : 'этап',
    'heal.diap.t3'     : 'Без пелёнки + мазь',
    'heal.diap.p3'     : 'После 3 дней пелёнка не нужна. Мажь мазью 4 раза в день. Держи влажной. Защищай от влаги, грязи и солнца.',
    'heal.diap.d4'     : '4',
    'heal.diap.d4u'    : 'этап',
    'heal.diap.t4'     : '2–3 недели восстановления',
    'heal.diap.p4'     : 'Полное восстановление кожи. Продолжай использовать заживляющее средство ещё 2–3 недели.',
  },

  en: {
    /* NAV */
    'nav.portfolio'    : 'Portfolio',
    'nav.sketches'     : 'Sketches',
    'nav.services'     : 'Services',
    'nav.cert'         : 'Certificate',
    'nav.heal'         : 'Healing',
    'nav.book'         : 'Book Session',
    /* HERO */
    'hero.tag'         : 'Kazan · Tattoo Artist',
    'hero.sub'         : 'Custom sketches, graphic lines and attention to every detail',
    'hero.city'        : 'Kazan · 2 years experience · Every sketch is one of a kind',
    /* BUTTONS */
    'btn.book'         : 'Book Session',
    'btn.portfolio'    : 'View Portfolio',
    'btn.sketches'     : 'View Sketches →',
    'btn.more'         : 'Load More',
    'btn.read'         : 'Read →',
    'btn.telegram'     : 'Message on Telegram',
    'btn.pinterest'    : 'My Pinterest',
    /* SECTION LABELS */
    'sec.portfolio'    : 'Portfolio',
    'sec.about'        : 'About Me',
    'sec.contacts'     : 'Contacts',
    'sec.sketches'     : 'Collection',
    /* GALLERY TITLES */
    'gallery.title'    : 'My',
    'gallery.title.em' : 'Works',
    /* ARTICLE CARDS */
    'art1.title'       : 'How to choose your first tattoo?',
    'art1.body'        : 'Sketch included in the price. Developed based on your wishes, adapted to placement and size.',
    'art2.title'       : 'How to prepare for a session?',
    'art2.body'        : 'From 4,000 ₽. Includes studio rental, sketch, tattooing, healing kit and aftercare consultation.',
    'art3.title'       : 'Calculate cost',
    'art3.body'        : 'Gift certificates from 3,000 ₽. Digital format — any amount.',
    /* ABOUT */
    'about.heading'    : 'Maryam',
    'about.sub'        : 'tattoo artist',
    'about.p1'         : 'My name is Maryam. I tattoo in Kazan with 2 years of experience, working in a central studio.',
    'about.p2'         : 'Single-use supplies, sterilized equipment, sanitized workspace before every client.',
    'about.p3'         : 'Each sketch is made only once — no repeats ever.',
    'contact.note'     : 'Best to write on Telegram — I respond faster:',
    /* FOOTER */
    'footer.copy'      : 'Tattoo Artist',
    /* MODAL */
    'modal.title'      : 'Book a Session',
    'modal.name'       : 'Name',
    'modal.contact'    : 'Telegram or Phone',
    'modal.service'    : 'Service',
    'modal.idea'       : 'Describe your idea',
    'modal.submit'     : 'Send Request',
    'modal.opt1'       : 'Tattoo',
    'modal.opt2'       : 'Sketch',
    'modal.opt3'       : 'Other',
    /* SKETCHES PAGE */
    'sketches.sec'     : 'Collection',
    'sketches.title'   : 'Sket',
    'sketches.title.em': 'ches',
    'sketches.sub'     : 'Ready-made sketch packs. Each design is unique — tattooed only once.',
    'sketches.count'   : 'sketches',
    /* SERVICES PAGE */
    'services.sec'     : 'FZRTATTS',
    'services.title'   : 'Ser',
    'services.title.em': 'vices',
    's1.title'         : 'Sketch Development',
    's1.body'          : 'Every sketch is developed individually — based on your wishes, placement and style. No repeats.',
    's1.li1'           : 'Style, theme and every detail considered',
    's1.li2'           : 'Adapted to the chosen placement and size',
    's1.li3'           : 'I work with your references',
    's1.li4'           : 'Can rework an existing sketch in my style',
    's1.price'         : 'Included in session cost',
    's1.price.note'    : '',
    's1.btn'           : 'Discuss a Sketch',
    's2.title'         : 'Tattoo Session',
    's2.body'          : 'Full session from concept to finished tattoo. Single-use supplies, sterilized equipment.',
    's2.li1'           : 'Studio rental',
    's2.li2'           : 'Idea discussion and sketch development',
    's2.li3'           : 'Tattooing',
    's2.li4'           : 'Healing kit included',
    's2.li5'           : 'Aftercare consultations throughout healing',
    's2.price'         : 'from 4,000 ₽',
    's2.price.note'    : 'minimum',
    's2.btn'           : 'Get a Price Quote',
    's3.title'         : 'Gift Certificates',
    's3.body'          : 'A great gift for someone special. Physical in a beautiful envelope, or digital in any amount.',
    's3.li1'           : 'Physical — from 3,000 ₽',
    's3.li2'           : 'Digital — any amount',
    's3.li3'           : 'Valid for 6 months',
    's3.li4'           : 'Ready within 1 day',
    's3.price'         : 'from 3,000 ₽',
    's3.btn1'          : 'Order a Certificate',
    's3.btn2'          : 'Learn More',
    /* CERTIFICATE PAGE */
    'cert.sec'         : 'Gift',
    'cert.title'       : 'Certi',
    'cert.title.em'    : 'ficate',
    'cert.label'       : 'Tattoo Gift Certificate',
    'cert.heading'     : 'The Best',
    'cert.heading.em'  : 'Gift',
    'cert.text1'       : 'A perfect gift for a friend or loved one. The certificate allows getting a unique tattoo with a custom sketch.',
    'cert.f1.name'     : 'Physical',
    'cert.f1.desc'     : 'In a thick envelope with ribbon and branded stickers. From 3,000 ₽.',
    'cert.f2.name'     : 'Digital',
    'cert.f2.desc'     : 'Any amount. Sent via messenger or email.',
    'cert.btn'         : 'Order a Certificate',
    'cert.terms.title' : 'Terms of',
    'cert.terms.em'    : 'Use',
    'cert.t1'          : 'The certificate serves as payment. Can be used in full or partially.',
    'cert.t2'          : 'If the tattoo costs more than the certificate, the client pays the difference. Not redeemable for cash.',
    'cert.t3'          : 'Valid for 6 months from issue date. Collected by the artist after use.',
    /* HEALING PAGE */
    'heal.sec'         : 'Aftercare',
    'heal.title'       : 'Hea',
    'heal.title.em'    : 'ling',
    'heal.sub'         : 'Healing is just as important as the tattooing process. Follow the instructions for a vivid result.',
    'heal.tab1'        : 'Film Method',
    'heal.tab2'        : 'Pad Method',
    'heal.film.d1'     : '1–3',
    'heal.film.d1u'    : 'day',
    'heal.film.t1'     : 'Film in place',
    'heal.film.p1'     : 'The artist applies the film right after the session. Keep it on for 4 days. On days 2–3 fluid may collect under the film — that\'s normal.',
    'heal.film.d2'     : '4',
    'heal.film.d2u'    : 'day',
    'heal.film.t2'     : 'Remove the film',
    'heal.film.p2'     : 'Remove slowly under warm water with a peeling motion — no jerking. Rinse gently. Don\'t rub!',
    'heal.film.d3'     : '5–10',
    'heal.film.d3u'    : 'day',
    'heal.film.t3'     : 'Panthenol 4x daily',
    'heal.film.p3'     : 'Apply panthenol (or Bepanthen) 4 times a day in a thin layer. Keep it moisturized. Itching is normal. Don\'t scratch!',
    'heal.warn.title'  : 'Strictly forbidden',
    'heal.warn.1'      : 'Scratching or picking at the tattoo',
    'heal.warn.2'      : 'Baths, sauna or steam room',
    'heal.warn.3'      : 'Sunbathing or tanning beds',
    'heal.warn.4'      : 'Intense sport in the first week',
    'heal.warn.5'      : 'Alcohol-based skin products',
    'heal.diap.d1'     : '1',
    'heal.diap.d1u'    : 'step',
    'heal.diap.t1'     : 'First 2–4 hours',
    'heal.diap.p1'     : 'After the session the artist cleans the area, applies healing ointment and covers with film. Keep it for 2–4 hours.',
    'heal.diap.d2'     : '2',
    'heal.diap.d2u'    : 'step',
    'heal.diap.t2'     : '3 days with pads',
    'heal.diap.p2'     : 'Remove the initial cover. Rinse with cool soapy water using light patting motions. Apply ointment. Change pads at least 3 times/day for 3 days.',
    'heal.diap.d3'     : '3',
    'heal.diap.d3u'    : 'step',
    'heal.diap.t3'     : 'No pad + ointment',
    'heal.diap.p3'     : 'After 3 days no pad needed. Apply healing ointment 4x/day. Keep moist. Protect from moisture, dirt and sun.',
    'heal.diap.d4'     : '4',
    'heal.diap.d4u'    : 'step',
    'heal.diap.t4'     : '2–3 weeks recovery',
    'heal.diap.p4'     : 'Full skin recovery. Continue using healing ointment for another 2–3 weeks.',
  }
};

function applyLang(lang) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  document.documentElement.lang = lang;
  const map = i18n[lang] || i18n.ru;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (map[key] !== undefined) el.textContent = map[key];
  });
  // Update sketch pack count labels if present
  document.querySelectorAll('.pack-count').forEach(el => {
    const n = el.dataset.count;
    if (n) el.textContent = n + ' ' + (map['sketches.count'] || 'эскизов');
  });
  localStorage.setItem('fzr_lang', lang);
}

const savedLang = localStorage.getItem('fzr_lang') || (navigator.language.startsWith('ru') ? 'ru' : 'en');
applyLang(savedLang);

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

/* ── ESC CLOSE ── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  [bookModal, articleModal].forEach(m => { if (m && m.classList.contains('open')) closeModal(m); });
  closeNav();
});
