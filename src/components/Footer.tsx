import { useLanguage } from '../i18n/LanguageContext.tsx'
import { navItems } from '../lib/nav.ts'
import { BrandLink } from './Logo.tsx'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <BrandLink />
          <p>{t.footer.tagline}</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <p className="footer-heading">{t.footer.company}</p>
            <nav aria-label={t.footer.company}>
              {navItems.map((item) => (
                <a key={item.href} href={item.href}>
                  {t.nav[item.key]}
                </a>
              ))}
              <a href="#kontakt">{t.nav.contact}</a>
            </nav>
          </div>
          <div className="footer-col">
            <p className="footer-heading">{t.footer.contact}</p>
            <a href={t.contact.phoneHref}>{t.contact.phone}</a>
            <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
          </div>
        </div>
      </div>
      <div className="container footer-legal">
        <p className="footer-rights">{t.footer.rights}</p>
        <p className="footer-nip">{t.footer.nip}</p>
      </div>
    </footer>
  )
}
