import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { useLanguage } from '../i18n/LanguageContext.tsx'

function splitWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean)
}

function TitleWord({
  word,
  index,
  accent,
}: {
  word: string
  index: number
  accent?: boolean
}) {
  return (
    <span
      className={['title-word', accent ? 'accent-text' : ''].filter(Boolean).join(' ')}
      style={{ '--i': index } as CSSProperties}
    >
      {word}
    </span>
  )
}

export function Hero() {
  const { lang, t } = useLanguage()
  const heroRef = useRef<HTMLElement>(null)
  const titleWords = splitWords(t.hero.title)
  const line2Words = splitWords(t.hero.titleLine2)
  const line3Words = splitWords(t.hero.titleAccent)
  const accentWords = splitWords(t.hero.titleItalic)
  const line2Start = titleWords.length
  const line3Start = line2Start + line2Words.length
  const accentStart = line3Start + line3Words.length

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const copy = hero.querySelector<HTMLElement>('.hero-copy')
    let frame = 0
    let hx = 0
    let hy = 0
    let sx = 0
    let sy = 0
    let thx = 0
    let thy = 0
    let tsx = 0
    let tsy = 0

    const paintParallax = () => {
      if (!copy) return
      copy.style.setProperty('--hx', `${hx.toFixed(2)}px`)
      copy.style.setProperty('--hy', `${hy.toFixed(2)}px`)
      copy.style.setProperty('--sx', `${sx.toFixed(2)}px`)
      copy.style.setProperty('--sy', `${sy.toFixed(2)}px`)
    }

    const tickParallax = () => {
      hx += (thx - hx) * 0.06
      hy += (thy - hy) * 0.06
      sx += (tsx - sx) * 0.045
      sy += (tsy - sy) * 0.045
      paintParallax()
      frame = requestAnimationFrame(tickParallax)
    }

    const onScroll = () => {
      if (reduce.matches) {
        hero.style.opacity = '1'
        hero.style.pointerEvents = ''
        return
      }
      const top = hero.getBoundingClientRect().top
      const fade = Math.min(1, Math.max(0, -top / Math.max(hero.offsetHeight * 0.55, 1)))
      hero.style.opacity = `${1 - fade}`
      hero.style.pointerEvents = fade > 0.85 ? 'none' : ''
    }

    const onMove = (event: PointerEvent) => {
      if (!copy || reduce.matches || !fine.matches) return
      const nx = event.clientX / window.innerWidth - 0.5
      const ny = event.clientY / window.innerHeight - 0.5
      thx = nx * -16
      thy = ny * -12
      tsx = nx * -12
      tsy = ny * -8
    }

    onScroll()
    if (!reduce.matches && fine.matches) frame = requestAnimationFrame(tickParallax)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('pointermove', onMove, { passive: true })
    reduce.addEventListener('change', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onMove)
      reduce.removeEventListener('change', onScroll)
    }
  }, [lang])

  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1 key={lang}>
            <span className="title-line">
              {titleWords.map((word, index) => (
                <TitleWord key={`title-${index}`} word={word} index={index} />
              ))}
            </span>
            <span className="title-line">
              {line2Words.map((word, index) => (
                <TitleWord key={`line2-${index}`} word={word} index={line2Start + index} />
              ))}
            </span>
            <span className="title-line">
              {line3Words.map((word, index) => (
                <TitleWord key={`line3-${index}`} word={word} index={line3Start + index} />
              ))}
              {accentWords.map((word, index) => (
                <TitleWord
                  key={`accent-${index}`}
                  word={word}
                  index={accentStart + index}
                  accent
                />
              ))}
            </span>
          </h1>
          <p className="lede">{t.hero.subtitle}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#kontakt">
              {t.hero.ctaPrimary}
            </a>
            <a className="btn btn-ghost" href="#uslugi">
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
