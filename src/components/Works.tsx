import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.tsx'

const gallery: Record<string, string[]> = {
  smoltech: ['/works/smoltech-1.png', '/works/smoltech-2.png', '/works/smoltech-3.png'],
  wrohaus: ['/works/wrohaus-1.png', '/works/wrohaus-2.png', '/works/wrohaus-3.png'],
  yume: ['/works/yume-1.png', '/works/yume-2.png', '/works/yume-3.png'],
}

const MOVE =
  'top 520ms cubic-bezier(0.16, 1, 0.3, 1), left 520ms cubic-bezier(0.16, 1, 0.3, 1), width 520ms cubic-bezier(0.16, 1, 0.3, 1), height 520ms cubic-bezier(0.16, 1, 0.3, 1), border-radius 520ms cubic-bezier(0.16, 1, 0.3, 1)'

type Phase = 'idle' | 'opening' | 'ready' | 'closing'
type Box = Pick<DOMRect, 'top' | 'left' | 'width' | 'height'>

function Chrome() {
  return (
    <span className="work-chrome" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}

function boxOf(node: HTMLElement): Box {
  const rect = node.getBoundingClientRect()
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
}

function place(node: HTMLElement, rect: Box, radius: string) {
  node.style.top = `${rect.top}px`
  node.style.left = `${rect.left}px`
  node.style.width = `${rect.width}px`
  node.style.height = `${rect.height}px`
  node.style.borderRadius = radius
}

function toFull(node: HTMLElement) {
  node.style.top = '3vh'
  node.style.left = '3vw'
  node.style.width = '94vw'
  node.style.height = '94vh'
  node.style.borderRadius = '20px'
}

export function Works() {
  const { lang, t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const sourceRef = useRef<HTMLElement | null>(null)
  const originRef = useRef<Box | null>(null)
  const scrollYRef = useRef(0)
  const [openId, setOpenId] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [slide, setSlide] = useState(0)
  const items = t.works.items.slice(0, 3)
  const openItem = items.find((item) => item.id === openId) ?? null
  const photos = openItem ? (gallery[openItem.id] ?? []) : []
  const ready = phase === 'ready'

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

  useLayoutEffect(() => {
    const stage = stageRef.current
    const origin = originRef.current
    if (!stage || !origin || !openId) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let alive = true
    let timer = 0

    const finishClose = () => {
      if (!alive) return
      alive = false
      document.documentElement.classList.remove('is-work-open')
      window.scrollTo(0, scrollYRef.current)
      sourceRef.current?.classList.remove('is-source')
      sourceRef.current = null
      originRef.current = null
      setOpenId(null)
      setPhase('idle')
      setSlide(0)
    }

    if (phase === 'opening') {
      scrollYRef.current = window.scrollY
      document.documentElement.classList.add('is-work-open')
      sourceRef.current?.classList.add('is-source')
      const from = sourceRef.current ? boxOf(sourceRef.current) : origin
      originRef.current = from
      stage.style.transition = 'none'
      place(stage, from, '16px')
      stage.style.visibility = 'visible'
      void stage.offsetWidth
      if (reduce) {
        toFull(stage)
        setPhase('ready')
        return
      }
      stage.style.transition = MOVE
      toFull(stage)
      const done = (event: TransitionEvent) => {
        if (!alive || event.target !== stage || event.propertyName !== 'width') return
        setPhase('ready')
      }
      stage.addEventListener('transitionend', done)
      timer = window.setTimeout(() => {
        if (alive) setPhase('ready')
      }, 640)
      return () => {
        alive = false
        stage.removeEventListener('transitionend', done)
        window.clearTimeout(timer)
      }
    }

    if (phase === 'closing') {
      const target = sourceRef.current ? boxOf(sourceRef.current) : origin
      if (scrollerRef.current) scrollerRef.current.scrollLeft = 0
      if (reduce) {
        finishClose()
        return
      }
      const current = boxOf(stage)
      stage.style.transition = 'none'
      place(stage, current, '20px')
      stage.style.visibility = 'visible'
      void stage.offsetWidth
      stage.style.transition = MOVE
      place(stage, target, '16px')
      const done = (event: TransitionEvent) => {
        if (!alive || event.target !== stage || event.propertyName !== 'width') return
        finishClose()
      }
      stage.addEventListener('transitionend', done)
      timer = window.setTimeout(() => {
        if (alive) finishClose()
      }, 640)
      return () => {
        alive = false
        stage.removeEventListener('transitionend', done)
        window.clearTimeout(timer)
      }
    }
  }, [openId, phase])

  useEffect(() => {
    if (!openId) return
    const y = window.scrollY
    scrollYRef.current = y
    const freeze = () => {
      if (window.scrollY !== y) window.scrollTo(0, y)
    }
    const block = (event: Event) => {
      const target = event.target
      if (target instanceof Node && scrollerRef.current?.contains(target)) return
      event.preventDefault()
    }
    window.addEventListener('scroll', freeze)
    window.addEventListener('wheel', block, { passive: false })
    window.addEventListener('touchmove', block, { passive: false })
    return () => {
      window.removeEventListener('scroll', freeze)
      window.removeEventListener('wheel', block)
      window.removeEventListener('touchmove', block)
    }
  }, [openId])

  useEffect(() => {
    if (!ready) return
    const scroller = scrollerRef.current
    if (!scroller) return
    const onWheel = (event: WheelEvent) => {
      if (scroller.scrollWidth <= scroller.clientWidth + 4) return
      event.preventDefault()
      scroller.scrollLeft += event.deltaY + event.deltaX
    }
    const onScroll = () => {
      const width = scroller.clientWidth
      if (width < 1) return
      setSlide(Math.round(scroller.scrollLeft / width))
    }
    scroller.addEventListener('wheel', onWheel, { passive: false })
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scroller.removeEventListener('wheel', onWheel)
      scroller.removeEventListener('scroll', onScroll)
    }
  }, [ready, openId])

  useEffect(() => {
    if (!openId) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && ready) setPhase('closing')
      if (!ready) return
      if (event.key === 'ArrowRight') goTo(slide + 1)
      if (event.key === 'ArrowLeft') goTo(slide - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openId, ready, slide, photos.length])

  function goTo(index: number) {
    const scroller = scrollerRef.current
    if (!scroller || photos.length < 2) return
    const next = Math.min(photos.length - 1, Math.max(0, index))
    scroller.scrollTo({ left: next * scroller.clientWidth, behavior: 'smooth' })
    setSlide(next)
  }

  function closeLightbox() {
    if (phase !== 'ready') return
    setPhase('closing')
  }

  function openFrom(id: string, node: HTMLElement) {
    if (phase !== 'idle') return
    const frame = node.querySelector('.work-frame')
    if (!(frame instanceof HTMLElement)) return
    frame.style.transition = 'none'
    frame.style.transform = 'none'
    originRef.current = boxOf(frame)
    frame.style.transform = ''
    frame.style.transition = ''
    sourceRef.current = frame
    setSlide(0)
    setOpenId(id)
    setPhase('opening')
  }

  return (
    <section className="works" id="realizacje" ref={sectionRef}>
      <div className="works-pin">
        <div className="container works-stage">
          <div className="works-head">
            <h2 className="works-title">
              <span className="route-title-text">{t.works.title}</span>
            </h2>
            <p className="works-lede">{t.works.subtitle}</p>
          </div>
          <ul className="works-gallery">
            {items.map((item) => {
              const cover = (gallery[item.id] ?? [])[0]
              return (
                <li key={item.id}>
                  <article className="work-pane">
                    <div
                      className="work-hover"
                      onClick={(event) => openFrom(item.id, event.currentTarget)}
                    >
                      <div className="work-frame">
                        <Chrome />
                        <div className="work-scroller">
                          {cover ? (
                            <img src={cover} alt={item.company} width={1400} height={900} draggable={false} />
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="work-side">
                      <h3>{item.company}</h3>
                      <p>{item.quote}</p>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      {openItem ? (
        <div className={`work-lightbox is-${phase}`} role="dialog" aria-modal="true" aria-label={openItem.company}>
          <button className="work-lightbox-back" type="button" aria-label={t.works.close} onClick={closeLightbox} />
          <button className="work-lightbox-close" type="button" onClick={closeLightbox}>
            {t.works.close}
          </button>
          <div className="work-lightbox-stage" ref={stageRef}>
            <Chrome />
            <div className="work-scroller" ref={scrollerRef}>
              {photos.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={index === 0 ? openItem.company : ''}
                  width={1400}
                  height={900}
                  draggable={false}
                />
              ))}
            </div>
            <div className="work-expand">
              <p>{openItem.quote}</p>
              {openItem.url ? (
                <a className="btn btn-primary work-visit" href={openItem.url} target="_blank" rel="noreferrer">
                  {t.works.visit}
                </a>
              ) : null}
            </div>
            {ready && photos.length > 1 ? (
              <>
                <button
                  className="work-gallery-nav is-prev"
                  type="button"
                  aria-label={t.works.prev}
                  disabled={slide <= 0}
                  onClick={() => goTo(slide - 1)}
                >
                  ‹
                </button>
                <button
                  className="work-gallery-nav is-next"
                  type="button"
                  aria-label={t.works.next}
                  disabled={slide >= photos.length - 1}
                  onClick={() => goTo(slide + 1)}
                >
                  ›
                </button>
                <div className="work-gallery-dots" aria-hidden="true">
                  {photos.map((src, index) => (
                    <i key={src} className={index === slide ? 'is-on' : ''} />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}
