import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.tsx'
import { useTheme } from '../theme/ThemeContext.tsx'
import type { Lang } from '../i18n/translations.ts'
import type { Theme } from '../theme/ThemeContext.tsx'
import { BrandLink } from './Logo.tsx'
import { getDriftHref } from '../lib/driftScroll.ts'
import { navItems } from '../lib/nav.ts'

type SwitchOption<T extends string> = { id: T; label: string }

function WordSwitch<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: [SwitchOption<T>, SwitchOption<T>]
  onChange: (id: T) => void
}) {
  const right = value === options[1].id

  return (
    <div className="prefs-row">
      <p className="prefs-row-label">{label}</p>
      <div className={`prefs-switch${right ? ' is-right' : ''}`} role="group" aria-label={label}>
        <span className="prefs-switch-thumb" aria-hidden="true" />
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            role="switch"
            aria-checked={value === option.id}
            className={value === option.id ? 'is-active' : ''}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Header() {
  const { lang, setLang, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [away, setAway] = useState(false)
  const [peek, setPeek] = useState(false)
  const [activeHref, setActiveHref] = useState('')
  const [thumb, setThumb] = useState({ x: 0, w: 0, on: false })
  const prefsRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const menuOpenRef = useRef(false)
  const prefsOpenRef = useRef(false)

  menuOpenRef.current = menuOpen
  prefsOpenRef.current = prefsOpen

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!prefsOpen) return
    const onPointer = (event: PointerEvent) => {
      if (!prefsRef.current?.contains(event.target as Node)) setPrefsOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPrefsOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [prefsOpen])

  useEffect(() => {
    const syncActive = () => {
      const driftingTo = getDriftHref()
      if (driftingTo) {
        setActiveHref(driftingTo)
        return
      }
      let current = ''
      const probe = Math.max(72, window.innerHeight * 0.22)
      for (const item of navItems) {
        const section = document.getElementById(item.href.slice(1))
        if (section && section.getBoundingClientRect().top <= probe) current = item.href
      }
      setActiveHref(current)
    }
    const onNavClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]')
      if (!(link instanceof HTMLAnchorElement)) return
      const href = link.getAttribute('href')
      if (href && navItems.some((item) => item.href === href)) setActiveHref(href)
    }
    syncActive()
    window.addEventListener('scroll', syncActive, { passive: true })
    window.addEventListener('resize', syncActive)
    document.addEventListener('click', onNavClick, true)
    return () => {
      window.removeEventListener('scroll', syncActive)
      window.removeEventListener('resize', syncActive)
      document.removeEventListener('click', onNavClick, true)
    }
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let hideTimer = 0

    const onLanding = () => {
      const hero = document.getElementById('top')
      if (!hero) return true
      return hero.getBoundingClientRect().bottom > window.innerHeight * 0.72
    }

    const keepOpen = () => menuOpenRef.current || prefsOpenRef.current

    const showPeek = () => {
      window.clearTimeout(hideTimer)
      setPeek(true)
    }

    const hidePeek = () => {
      window.clearTimeout(hideTimer)
      hideTimer = window.setTimeout(() => {
        if (keepOpen()) return
        setPeek(false)
      }, 180)
    }

    const syncAway = () => {
      if (reduce.matches) {
        setAway(false)
        setPeek(false)
        return
      }
      const landing = onLanding()
      setAway(!landing)
      if (landing) setPeek(false)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (reduce.matches || onLanding()) return
      const header = headerRef.current
      const overHeader = Boolean(header?.contains(event.target as Node))
      const nearTop = event.clientY <= 36
      if (overHeader || nearTop || keepOpen()) showPeek()
      else hidePeek()
    }

    const onTouchStart = (event: TouchEvent) => {
      if (reduce.matches || onLanding()) return
      if (event.touches[0] && event.touches[0].clientY <= 40) showPeek()
    }

    syncAway()
    window.addEventListener('scroll', syncAway, { passive: true })
    window.addEventListener('resize', syncAway)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    reduce.addEventListener('change', syncAway)
    return () => {
      window.clearTimeout(hideTimer)
      window.removeEventListener('scroll', syncAway)
      window.removeEventListener('resize', syncAway)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchstart', onTouchStart)
      reduce.removeEventListener('change', syncAway)
    }
  }, [])

  useLayoutEffect(() => {
    const nav = navRef.current
    const link = nav?.querySelector(`a[href="${activeHref}"]`)
    if (!(link instanceof HTMLElement) || !nav) {
      setThumb((current) => ({ ...current, on: false }))
      return
    }
    setThumb({ x: link.offsetLeft, w: link.offsetWidth, on: true })
  }, [activeHref, lang, t.nav.services, t.nav.process, t.nav.about, t.nav.works])

  function closeMenu() {
    setMenuOpen(false)
    setPrefsOpen(false)
  }

  const peeking = peek || menuOpen || prefsOpen

  return (
    <>
      <div
        className={`header-hotzone${away && !peeking ? ' is-on' : ''}`}
        aria-hidden="true"
        onPointerEnter={() => setPeek(true)}
      />
      <header
        className={['site-header', away ? 'is-away' : '', away && peeking ? 'is-peek' : '']
          .filter(Boolean)
          .join(' ')}
        ref={headerRef}
        onPointerEnter={() => setPeek(true)}
        onPointerLeave={() => {
          if (!menuOpen && !prefsOpen) setPeek(false)
        }}
        onFocusCapture={() => setPeek(true)}
        onBlurCapture={(event) => {
          if (menuOpen || prefsOpen) return
          if (!headerRef.current?.contains(event.relatedTarget as Node)) setPeek(false)
        }}
      >
      <div className="container header-inner">
        <BrandLink className="header-brand" />

        <nav className="nav-desktop" aria-label="Primary" ref={navRef}>
          <span
            className={`nav-thumb${thumb.on ? ' is-on' : ''}`}
            style={{ width: thumb.w, transform: `translate(${thumb.x}px, -50%)` }}
            aria-hidden="true"
          />
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={activeHref === item.href ? 'is-active' : ''}>
              {t.nav[item.key]}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <div className={`prefs-menu${prefsOpen ? ' is-open' : ''}`} ref={prefsRef}>
            <button
              type="button"
              className="icon-btn prefs-toggle"
              aria-label={t.ui.settings}
              aria-expanded={prefsOpen}
              aria-haspopup="menu"
              onClick={() => setPrefsOpen((open) => !open)}
            >
              <svg className="prefs-caret" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 10 12 15 17 10"
                />
              </svg>
            </button>
            <div className="prefs-menu-list" hidden={!prefsOpen}>
              <WordSwitch<Lang>
                label={t.ui.language}
                value={lang}
                options={[
                  { id: 'pl', label: 'Polski' },
                  { id: 'en', label: 'English' },
                ]}
                onChange={setLang}
              />
              <WordSwitch<Theme>
                label={t.ui.theme}
                value={theme}
                options={[
                  { id: 'light', label: t.ui.light },
                  { id: 'dark', label: t.ui.dark },
                ]}
                onChange={setTheme}
              />
            </div>
          </div>

          <button
            type="button"
            className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? t.nav.closeMenu : t.nav.openMenu}</span>
            <span className="menu-bar" />
            <span className="menu-bar" />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`mobile-nav${menuOpen ? ' is-open' : ''}`}
        hidden={!menuOpen}
      >
        <nav aria-label="Mobile">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {t.nav[item.key]}
            </a>
          ))}
        </nav>
      </div>
      </header>
    </>
  )
}
