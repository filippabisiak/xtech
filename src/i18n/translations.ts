export type Lang = 'pl' | 'en'

export type ServiceId = 'seo' | 'custom' | 'shops' | 'web'
export type ProcessId = 'contact' | 'plan' | 'build' | 'finish'
export type BeliefWord = {
  text: string
  elegant?: boolean
  accent?: boolean
  glue?: boolean
}

type TranslationTree = {
  meta: { title: string }
  nav: {
    services: string
    process: string
    about: string
    works: string
    contact: string
    openMenu: string
    closeMenu: string
  }
  lang: { pl: string; en: string; switchTo: string }
  ui: {
    scroll: string
    language: string
    theme: string
    settings: string
    light: string
    dark: string
  }
  hero: {
    title: string
    titleLine2: string
    titleAccent: string
    titleItalic: string
    subtitle: string
    ctaPrimary: string
    ctaSecondary: string
  }
  belief: {
    words: BeliefWord[]
  }
  bridge: {
    words: BeliefWord[]
  }
  services: {
    kicker: string
    title: string
    items: Record<ServiceId, { title: string; desc: string }>
  }
  process: {
    title: string
    items: Record<ProcessId, { title: string; desc: string }>
  }
  about: {
    kicker: string
    title: string
    subtitle: string
    body: string
  }
  works: {
    title: string
    subtitle: string
    visit: string
    close: string
    prev: string
    next: string
    items: Array<{
      id: string
      company: string
      quote: string
      url?: string
    }>
  }
  contact: {
    kicker: string
    title: string
    body: string
    emailLabel: string
    email: string
    phoneLabel: string
    phone: string
    phoneHref: string
    form: {
      name: string
      email: string
      company: string
      phone: string
      message: string
      submit: string
      sending: string
      sent: string
      error: string
      subject: string
    }
  }
  footer: {
    company: string
    contact: string
    tagline: string
    nip: string
    rights: string
  }
}

export const translations: Record<Lang, TranslationTree> = {
  pl: {
    meta: {
      title: 'XTech - Web design i programowanie',
    },
    nav: {
      services: 'Usługi',
      process: 'Proces',
      about: 'O nas',
      works: 'Realizacje',
      contact: 'Kontakt',
      openMenu: 'Otwórz menu',
      closeMenu: 'Zamknij menu',
    },
    lang: {
      pl: 'PL',
      en: 'EN',
      switchTo: 'Zmień język',
    },
    ui: {
      scroll: 'Przewiń',
      language: 'Język',
      theme: 'Motyw',
      settings: 'Język i motyw',
      light: 'Jasny motyw',
      dark: 'Ciemny motyw',
    },
    hero: {
      title: 'XTech - strony',
      titleLine2: 'internetowe które',
      titleAccent: 'robią',
      titleItalic: 'różnicę.',
      subtitle:
        'XTech projektuje i programuje strony oraz aplikacje webowe dla firm, które chcą wyglądać nowocześnie i działać niezawodnie.',
      ctaPrimary: 'Porozmawiajmy',
      ctaSecondary: 'Zobacz usługi',
    },
    belief: {
      words: [
        { text: 'W' },
        { text: 'XTech' },
        { text: 'wierzymy', elegant: true },
        { text: ',', glue: true },
        { text: 'że' },
        { text: 'każdy', accent: true },
        { text: 'sukces' },
        { text: 'zaczyna' },
        { text: 'się' },
        { text: 'od' },
        { text: 'dobrego' },
        { text: 'pomysłu', accent: true },
        { text: '.', glue: true },
      ],
    },
    bridge: {
      words: [
        { text: 'Ten' },
        { text: 'pomysł', accent: true },
        { text: 'prowadzimy', elegant: true },
        { text: 'aż' },
        { text: 'do' },
        { text: 'wdrożenia', accent: true },
        { text: '.', glue: true },
      ],
    },
    services: {
      kicker: 'Oferta',
      title: 'Co robimy?',
      items: {
        seo: {
          title: 'SEO',
          desc: 'Widoczność w Google: frazy, treść i poprawki techniczne, które pomagają klientom Cię znaleźć.',
        },
        custom: {
          title: 'Realizacja',
          desc: 'Realizacja kompleksowych projektów na zamówienie według pomysłu klienta – od początku do końca.',
        },
        shops: {
          title: 'Sklepy internetowe',
          desc: 'Zakładanie i uruchamianie sklepów internetowych, które zamieniają odwiedzających w klientów.',
        },
        web: {
          title: 'Strony internetowe',
          desc: 'Tworzenie i obsługa techniczna stron internetowych, które pchną Twoją firmę na wyższy poziom.',
        },
      },
    },
    process: {
      title: 'Jak pracujemy?',
      items: {
        contact: {
          title: 'Pomysł',
          desc: 'Przedstawiasz nam swoją wizję i oczekiwania – my odpowiadamy z kolejnym krokiem.',
        },
        plan: {
          title: 'Plan projektu',
          desc: 'Ustalamy zakres, kolejność prac i termin. Wiesz, jak będzie wyglądał cały proces.',
        },
        build: {
          title: 'Realizacja',
          desc: 'Projektujemy i kodujemy. Na bieżąco informujemy Cię o postępach w pracy.',
        },
        finish: {
          title: 'Gotowy projekt',
          desc: 'Przekazujemy Ci gotowy sklep lub stronę i zajmujemy się obsługą techniczną i SEO.',
        },
      },
    },
    about: {
      kicker: 'O nas',
      title: 'Polska firma. Pełny stack.',
      subtitle: 'Nasz zespół',
      body: 'To my tworzymy XTech - studio web designu i programowania. Łączymy projektowanie z inżynierią, żeby klient nie musiał sklejać zespołu z kilku firm.',
    },
    works: {
      title: 'Nasze ostatnie realizacje',
      subtitle: 'Najnowsze zrealizowane przez nas zlecenia.',
      visit: 'Odwiedź stronę',
      close: 'Zamknij',
      prev: 'Poprzednie zdjęcie',
      next: 'Następne zdjęcie',
      items: [
        {
          id: 'smoltech',
          company: 'Smoltech',
          quote: 'Strona internetowa krajowego lidera w branży zgrzewalniczej.',
        },
        {
          id: 'wrohaus',
          company: 'Wrohaus',
          quote: 'Strona internetowa dla sklepu z meblami, razem z w pełni funkcjonalnym admin panelem.',
          url: 'https://wrohaus.pl/',
        },
        {
          id: 'yume',
          company: 'Yume',
          quote: 'Sklep internetowy dla start up\'u zajmującego się napojami energetycznymi.',
        },
      ],
    },
    contact: {
      kicker: 'Kontakt',
      title: 'Opowiedz o projekcie',
      body: 'Opisz nam swój pomysł, my odezwiemy się z propozycją realizacji.',
      emailLabel: 'E-mail',
      email: 'kontakt@xtechart.com',
      phoneLabel: 'Telefon',
      phone: '+48 734 794 118',
      phoneHref: 'tel:+48734794118',
      form: {
        name: 'Imię i nazwisko',
        email: 'E-mail',
        company: 'Nazwa firmy',
        phone: 'Telefon',
        message: 'Treść',
        submit: 'Wyślij wiadomość',
        sending: 'Wysyłanie…',
        sent: 'Wiadomość wysłana. Odezwemy się na podany adres.',
        error: 'Nie udało się wysłać. Spróbuj ponownie za chwilę.',
        subject: 'Wiadomość ze strony XTech',
      },
    },
    footer: {
      company: 'Firma',
      contact: 'Kontakt',
      tagline: 'Web design i programowanie.',
      nip: 'NIP 8961669211',
      rights: '© 2026 XTech. Wszelkie prawa zastrzeżone.',
    },
  },
  en: {
    meta: {
      title: 'XTech - Web design and programming',
    },
    nav: {
      services: 'Services',
      process: 'Process',
      about: 'About',
      works: 'Work',
      contact: 'Contact',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    lang: {
      pl: 'PL',
      en: 'EN',
      switchTo: 'Switch language',
    },
    ui: {
      scroll: 'Scroll',
      language: 'Language',
      theme: 'Theme',
      settings: 'Language and theme',
      light: 'Light theme',
      dark: 'Dark theme',
    },
    hero: {
      title: 'XTech',
      titleLine2: 'websites that',
      titleAccent: 'make a',
      titleItalic: 'difference.',
      subtitle:
        'XTech designs and builds websites and web apps for companies that want to look modern and run reliably.',
      ctaPrimary: "Let's talk",
      ctaSecondary: 'See services',
    },
    belief: {
      words: [
        { text: 'At' },
        { text: 'XTech' },
        { text: 'we' },
        { text: 'believe', elegant: true },
        { text: 'that' },
        { text: 'every', accent: true },
        { text: 'success' },
        { text: 'starts' },
        { text: 'with' },
        { text: 'a' },
        { text: 'good' },
        { text: 'idea', accent: true },
        { text: '.', glue: true },
      ],
    },
    bridge: {
      words: [
        { text: 'We' },
        { text: 'take', elegant: true },
        { text: 'that' },
        { text: 'idea', accent: true },
        { text: 'all' },
        { text: 'the' },
        { text: 'way' },
        { text: 'to' },
        { text: 'launch', accent: true },
        { text: '.', glue: true },
      ],
    },
    services: {
      kicker: 'What we do',
      title: 'What do we do?',
      items: {
        seo: {
          title: 'SEO',
          desc: 'Visibility in Google: keywords, content, and technical fixes that help customers find you.',
        },
        custom: {
          title: 'Custom work',
          desc: 'End-to-end custom projects built to the client\'s idea — from start to finish.',
        },
        shops: {
          title: 'Online stores',
          desc: 'Setting up and launching online shops that turn visitors into customers.',
        },
        web: {
          title: 'Websites',
          desc: 'Building and technical maintenance of websites that take your company to the next level.',
        },
      },
    },
    process: {
      title: 'How do we work?',
      items: {
        contact: {
          title: 'Idea',
          desc: 'You share your vision and expectations — we come back with the next step.',
        },
        plan: {
          title: 'Project plan',
          desc: 'We set the scope, the order of work, and a date. You know what the whole process will look like.',
        },
        build: {
          title: 'Build',
          desc: 'We design and code. We keep you informed about progress as we go.',
        },
        finish: {
          title: 'Ready project',
          desc: 'We hand over the finished shop or website and take care of technical support and SEO.',
        },
      },
    },
    about: {
      kicker: 'About',
      title: 'A Polish studio. Full stack.',
      subtitle: 'Our team',
      body: 'We are the team that builds XTech - a web design and programming studio. We combine design with engineering so you do not have to stitch a team together from several vendors.',
    },
    works: {
      title: 'Our recent work',
      subtitle: 'The latest commissions we have delivered.',
      visit: 'Visit site',
      close: 'Close',
      prev: 'Previous photo',
      next: 'Next photo',
      items: [
        {
          id: 'smoltech',
          company: 'Smoltech',
          quote: 'A website for a national leader in the resistance welding industry.',
        },
        {
          id: 'wrohaus',
          company: 'Wrohaus',
          quote: 'A website for a furniture store, together with a fully functional admin panel.',
          url: 'https://wrohaus.pl/',
        },
        {
          id: 'yume',
          company: 'Yume',
          quote: 'An online shop for an energy-drink startup.',
        },
      ],
    },
    contact: {
      kicker: 'Contact',
      title: 'Tell us about the project',
      body: 'Tell us about your idea, and we will come back with a proposal.',
      emailLabel: 'Email',
      email: 'kontakt@xtechart.com',
      phoneLabel: 'Phone',
      phone: '+48 734 794 118',
      phoneHref: 'tel:+48734794118',
      form: {
        name: 'Full name',
        email: 'Email',
        company: 'Company name',
        phone: 'Phone',
        message: 'Message',
        submit: 'Send message',
        sending: 'Sending…',
        sent: 'Message sent. We will reply to the address you entered.',
        error: 'Could not send. Please try again in a moment.',
        subject: 'Message from the XTech website',
      },
    },
    footer: {
      company: 'Company',
      contact: 'Contact',
      tagline: 'Web design and programming.',
      nip: 'NIP 8961669211',
      rights: '© 2026 XTech. All rights reserved.',
    },
  },
}
