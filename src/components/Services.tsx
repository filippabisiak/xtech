import { useEffect, useRef } from 'react'
import type { PointerEvent } from 'react'
import { useLanguage } from '../i18n/LanguageContext.tsx'
import type { ServiceId } from '../i18n/translations.ts'
import { applyTilt, resetTilt } from '../lib/tilt.ts'
import { ServiceIcon } from './ServiceIcons.tsx'

const order: ServiceId[] = ['web', 'shops', 'custom', 'seo']

export function Services() {
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

  function onMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    applyTilt(event.currentTarget, event.clientX, event.clientY)
  }

  function onLeave(event: PointerEvent<HTMLElement>) {
    resetTilt(event.currentTarget)
  }

  return (
    <section className="services" id="uslugi" ref={sectionRef}>
      <div className="services-pin">
        <div className="container">
          <h2 className="services-title">
            <span className="route-title-text">{t.services.title}</span>
          </h2>
          <ul className="service-grid">
            {order.map((id) => {
              const item = t.services.items[id]
              return (
                <li key={id}>
                  <article className="service-card" onPointerMove={onMove} onPointerLeave={onLeave}>
                    <ServiceIcon id={id} />
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
