import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.tsx'

export function ScrollHint() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <p className={`scroll-hint${scrolled ? ' is-scrolled' : ''}`} aria-hidden="true">
      <span className="scroll-hint-label">{t.ui.scroll}</span>
      <svg className="scroll-hint-arrow" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 10 12 16 18 10"
        />
      </svg>
    </p>
  )
}
