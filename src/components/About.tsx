import { useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext.tsx'
import TailwindImageAccordion from './ui/tailwind-image-accordion.tsx'

export function About() {
  const { lang, t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const show = () => {
      const top = section.getBoundingClientRect().top
      const entered = top < window.innerHeight * 0.78
      const pinned = top <= 12
      if (reduce.matches || entered) section.classList.add('is-in')
      section.classList.toggle('is-pinned', reduce.matches || pinned)
    }
    show()
    window.addEventListener('scroll', show, { passive: true })
    window.addEventListener('resize', show)
    reduce.addEventListener('change', show)
    return () => {
      window.removeEventListener('scroll', show)
      window.removeEventListener('resize', show)
      reduce.removeEventListener('change', show)
    }
  }, [lang])

  return (
    <section className="about" id="o-nas" ref={sectionRef}>
      <div className="about-pin">
        <div className="container about-stage">
          <div className="about-copy">
            <h2 className="about-title">{t.nav.about}</h2>
            <p className="about-subtitle">{t.about.subtitle}</p>
          </div>
          <div className="about-accordion">
            <TailwindImageAccordion />
          </div>
          <p className="about-desc">{t.about.body}</p>
        </div>
      </div>
    </section>
  )
}
