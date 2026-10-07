import { useLayoutEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.tsx'
import type { ProcessId } from '../i18n/translations.ts'

const order: ProcessId[] = ['contact', 'plan', 'build', 'finish']

const stopSide: Record<ProcessId, 'left' | 'right'> = {
  contact: 'right',
  plan: 'left',
  build: 'right',
  finish: 'left',
}

type Point = { x: number; y: number }

const apex: Record<ProcessId, Point> = {
  contact: { x: 0.6, y: 0.16 },
  plan: { x: 0.37, y: 0.29 },
  build: { x: 0.75, y: 0.49 },
  finish: { x: 0.26, y: 0.82 },
}

const SEGMENTS = 90
const widthAt = (t: number) => 2.2 + 1.8 * t

function hexRgb(hex: string): [number, number, number] {
  const raw = hex.replace('#', '').trim()
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw
  const value = Number.parseInt(full, 16)
  if (!Number.isFinite(value)) return [122, 30, 44]
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function mixHex(from: string, to: string, t: number) {
  const clamped = Math.min(1, Math.max(0, t))
  const [ar, ag, ab] = hexRgb(from)
  const [br, bg, bb] = hexRgb(to)
  const mix = (a: number, b: number) => Math.round(a + (b - a) * clamped)
  return `rgb(${mix(ar, br)} ${mix(ag, bg)} ${mix(ab, bb)})`
}

function routeColors() {
  const styles = getComputedStyle(document.documentElement)
  return {
    from: styles.getPropertyValue('--route-from').trim() || '#3a0e16',
    to: styles.getPropertyValue('--route-to').trim() || '#e87884',
  }
}

function routePath(points: Point[]) {
  if (points.length < 2) return ''
  const fmt = (value: number) => value.toFixed(1)
  const bend = 0.62
  const last = points.length - 2
  let path = `M ${fmt(points[0].x)} ${fmt(points[0].y)}`
  for (let i = 0; i <= last; i++) {
    const a = points[i]
    const b = points[i + 1]
    const dy = b.y - a.y
    const c1 = { x: a.x, y: a.y + dy * bend }
    const c2 = i === last ? { x: b.x + (a.x - b.x) * 0.45, y: b.y } : { x: b.x, y: b.y - dy * bend }
    path += ` C ${fmt(c1.x)} ${fmt(c1.y)} ${fmt(c2.x)} ${fmt(c2.y)} ${fmt(b.x)} ${fmt(b.y)}`
  }
  return path
}

type Segment = { core: SVGPathElement; glow: SVGPathElement; start: number; len: number }

function buildSegments(
  guide: SVGPathElement,
  total: number,
  coreGroup: SVGGElement,
  glowGroup: SVGGElement,
  from: string,
  to: string,
) {
  coreGroup.replaceChildren()
  glowGroup.replaceChildren()
  const ns = 'http://www.w3.org/2000/svg'
  const step = total / SEGMENTS
  const segments: Segment[] = []
  for (let i = 0; i < SEGMENTS; i++) {
    const start = i * step
    const end = Math.min(total, start + step + 0.6)
    let d = ''
    for (let s = 0; s <= 6; s++) {
      const p = guide.getPointAtLength(start + ((end - start) * s) / 6)
      d += `${s === 0 ? 'M' : ' L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    }
    const t = (start + step / 2) / total
    const width = widthAt(t)
    const color = mixHex(from, to, t)
    const core = document.createElementNS(ns, 'path')
    const glow = document.createElementNS(ns, 'path')
    core.setAttribute('d', d)
    glow.setAttribute('d', d)
    core.style.strokeWidth = `${width}`
    glow.style.strokeWidth = `${width * 2.4 + 2}`
    core.style.stroke = color
    glow.style.stroke = color
    const len = end - start
    for (const el of [core, glow]) {
      el.style.strokeDasharray = `${len} ${len + 2}`
      el.style.visibility = 'hidden'
    }
    coreGroup.append(core)
    glowGroup.append(glow)
    segments.push({ core, glow, start, len })
  }
  return segments
}

function lengthNear(path: SVGPathElement, point: Point, total: number, start = 0) {
  let best = start
  let bestDist = Infinity
  const steps = 240
  const span = Math.max(total - start, 0)
  for (let i = 0; i <= steps; i++) {
    const len = start + (span * i) / steps
    const sample = path.getPointAtLength(len)
    const dist = (sample.x - point.x) ** 2 + (sample.y - point.y) ** 2
    if (dist < bestDist) {
      bestDist = dist
      best = len
    }
  }
  const window = span / steps
  for (let i = -8; i <= 8; i++) {
    const len = Math.min(total, Math.max(start, best + (window * i) / 8))
    const sample = path.getPointAtLength(len)
    const dist = (sample.x - point.x) ** 2 + (sample.y - point.y) ** 2
    if (dist < bestDist) {
      bestDist = dist
      best = len
    }
  }
  return best
}

export function Process() {
  const { lang, t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const guideRef = useRef<SVGPathElement>(null)
  const coreGroupRef = useRef<SVGGElement>(null)
  const glowGroupRef = useRef<SVGGElement>(null)
  const tipRef = useRef<SVGRectElement>(null)
  const reachedKey = useRef('')
  const [reached, setReached] = useState<ProcessId[]>([])

  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const title = titleRef.current
    const svg = svgRef.current
    const guide = guideRef.current
    const coreGroup = coreGroupRef.current
    const glowGroup = glowGroupRef.current
    const tip = tipRef.current
    if (!section || !stage || !title || !svg || !guide || !coreGroup || !glowGroup || !tip) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const stack = window.matchMedia('(max-width: 860px)')
    const stacked = () => window.innerWidth <= 860 || stack.matches
    let frame = 0
    const seen = new Set<ProcessId>()

    const layout = () => {
      if (stacked()) return null
      const stageBox = stage.getBoundingClientRect()
      if (!stageBox.width || !stageBox.height) return null

      const nodeCenter = (id: ProcessId) => {
        const node = stage.querySelector<HTMLElement>(`[data-id="${id}"] [data-node]`)
        if (!node) return null
        const box = node.getBoundingClientRect()
        return {
          x: box.left - stageBox.left + box.width / 2,
          y: box.top - stageBox.top + box.height / 2,
        }
      }

      const nodes: (Point & { id: ProcessId })[] = []
      for (const id of order) {
        const spot = apex[id]
        const stop = stage.querySelector<HTMLElement>(`[data-id="${id}"]`)
        if (!stop) return null
        const left = `${(spot.x * 100).toFixed(2)}%`
        const top = `${(spot.y * 100).toFixed(2)}%`
        stop.style.left = left
        stop.style.top = top
        const measured = nodeCenter(id)
        if (!measured) return null
        const dx = spot.x * stageBox.width - measured.x
        const dy = spot.y * stageBox.height - measured.y
        stop.style.left = `calc(${left} + ${dx.toFixed(1)}px)`
        stop.style.top = `calc(${top} + ${dy.toFixed(1)}px)`
        const center = nodeCenter(id)
        if (!center) return null
        nodes.push({ id, ...center })
      }

      svg.setAttribute('viewBox', `0 0 ${stageBox.width} ${stageBox.height}`)
      svg.setAttribute('width', `${stageBox.width}`)
      svg.setAttribute('height', `${stageBox.height}`)
      const d = routePath(nodes)
      guide.setAttribute('d', d)
      const total = guide.getTotalLength()
      if (!Number.isFinite(total) || total < 1) return null
      const { from, to } = routeColors()
      const segments = buildSegments(guide, total, coreGroup, glowGroup, from, to)

      let cursor = 0
      const marks = nodes.map((node) => {
        const at = lengthNear(guide, node, total, cursor)
        cursor = at
        return { id: node.id, at }
      })
      return { total, segments, stops: marks }
    }

    let geom = stacked() ? null : layout()
    let maxProgress = 0

    const label = title.querySelector<HTMLElement>('.route-title-text')
    if (label) {
      label.style.opacity = ''
      label.style.translate = ''
    }
    const showTitle = () => {
      if (!label) return
      const top = section.getBoundingClientRect().top
      const entered = top < window.innerHeight * 0.72
      if (reduce.matches || entered) label.classList.add('is-in')
    }

    const clearStopPins = () => {
      for (const id of order) {
        const stop = stage.querySelector<HTMLElement>(`[data-id="${id}"]`)
        if (!stop) continue
        stop.style.left = ''
        stop.style.top = ''
      }
    }

    const revealStack = () => {
      const on = stacked()
      section.classList.toggle('is-stack', on)
      if (!on) return false
      clearStopPins()
      showTitle()
      for (const id of order) {
        const el = stage.querySelector(`[data-id="${id}"]`)
        if (!(el instanceof HTMLElement)) continue
        if (reduce.matches || el.getBoundingClientRect().top < window.innerHeight * 0.84) seen.add(id)
      }
      const next = order.filter((id) => seen.has(id))
      const key = next.join(',')
      if (key !== reachedKey.current) {
        reachedKey.current = key
        setReached(next)
      }
      return true
    }

    const draw = () => {
      if (revealStack()) return
      showTitle()
      if (!geom) geom = layout()
      if (!geom) return
      const top = section.getBoundingClientRect().top
      const pin = section.querySelector<HTMLElement>('.route-pin')
      const pinHeight = pin?.offsetHeight ?? window.innerHeight
      const travel = Math.max(section.offsetHeight - pinHeight, 1)
      const scrolled = Math.min(travel, Math.max(0, -top))
      const live = reduce.matches ? 1 : Math.min(1, scrolled / (travel * 0.62))
      maxProgress = Math.max(maxProgress, live)
      const progress = maxProgress
      const shown = progress * geom.total
      for (const seg of geom.segments) {
        const visible = Math.min(seg.len, shown - seg.start)
        const hidden = visible <= 0
        const offset = `${seg.len - Math.max(visible, 0)}`
        for (const el of [seg.core, seg.glow]) {
          el.style.visibility = hidden ? 'hidden' : 'visible'
          el.style.strokeDashoffset = offset
        }
      }
      const { from, to } = routeColors()
      const head = guide.getPointAtLength(Math.min(shown, geom.total))
      const size = widthAt(shown / geom.total) + 2.4
      tip.setAttribute('width', `${size}`)
      tip.setAttribute('height', `${size}`)
      tip.setAttribute('rx', `${size / 2}`)
      tip.setAttribute('ry', `${size / 2}`)
      tip.setAttribute('x', `${head.x - size / 2}`)
      tip.setAttribute('y', `${head.y - size / 2}`)
      tip.style.fill = mixHex(from, to, shown / geom.total)
      tip.style.opacity = progress > 0.03 && progress < 0.99 ? '1' : '0'
      const started = reduce.matches || progress > 0.03
      const next = geom.stops
        .filter((stop) => started && shown + 10 >= Math.max(stop.at, 1))
        .map((stop) => stop.id)
      const key = next.join(',')
      if (key !== reachedKey.current) {
        reachedKey.current = key
        setReached(next)
      }
    }

    const onScroll = () => {
      if (stacked()) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(draw)
    }
    const onResize = () => {
      if (stacked()) {
        geom = null
        return
      }
      geom = layout()
      draw()
    }

    draw()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    stack.addEventListener('change', onResize)
    const observer = new ResizeObserver(onResize)
    observer.observe(stage)
    reduce.addEventListener('change', onResize)
    const fonts = document.fonts?.ready.then(onResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      stack.removeEventListener('change', onResize)
      observer.disconnect()
      reduce.removeEventListener('change', onResize)
      void fonts
    }
  }, [lang])

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const stack = window.matchMedia('(max-width: 860px)')
    const seen = new Set<ProcessId>()
    const tick = () => {
      if (window.innerWidth > 860 && !stack.matches) {
        section.classList.remove('is-stack')
        return
      }
      section.classList.add('is-stack')
      for (const id of order) {
        const el = section.querySelector(`[data-id="${id}"]`)
        if (!(el instanceof HTMLElement)) continue
        el.style.left = ''
        el.style.top = ''
        if (el.getBoundingClientRect().top < window.innerHeight * 0.72) seen.add(id)
      }
      const next = order.filter((id) => seen.has(id))
      const key = `stack:${next.join(',')}`
      if (key !== reachedKey.current) {
        reachedKey.current = key
        setReached(next)
      }
    }
    tick()
    window.addEventListener('scroll', tick, { passive: true })
    window.addEventListener('resize', tick)
    stack.addEventListener('change', tick)
    return () => {
      window.removeEventListener('scroll', tick)
      window.removeEventListener('resize', tick)
      stack.removeEventListener('change', tick)
    }
  }, [lang])

  return (
    <section className="route" id="proces" ref={sectionRef}>
      <div className="route-pin">
        <div className="route-stage" ref={stageRef}>
          <h2 className="route-title" ref={titleRef}>
            <span className="route-title-text">{t.process.title}</span>
          </h2>
          <svg className="route-svg" ref={svgRef} aria-hidden="true">
            <path ref={guideRef} className="route-guide" />
            <g ref={glowGroupRef} className="route-glow" />
            <g ref={coreGroupRef} className="route-line" />
            <rect ref={tipRef} className="route-tip" width="8" height="8" rx="4" ry="4" />
          </svg>
          {order.map((id) => {
            const item = t.process.items[id]
            const isReached = reached.includes(id)
            const outward = stopSide[id]
            return (
              <div
                key={id}
                data-id={id}
                className={`route-stop route-stop--${outward}${isReached ? ' is-reached' : ''}`}
                aria-hidden={!isReached}
              >
                {outward === 'left' ? (
                  <>
                    <span className="route-label">{item.title}</span>
                    <span className="route-node-slot">
                      <span className="route-anchor" data-node="" />
                      <span className="route-node" />
                    </span>
                    <span className="route-desc">{item.desc}</span>
                  </>
                ) : (
                  <>
                    <span className="route-node-slot">
                      <span className="route-anchor" data-node="" />
                      <span className="route-node" />
                    </span>
                    <span className="route-label">{item.title}</span>
                    <span className="route-desc">{item.desc}</span>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
