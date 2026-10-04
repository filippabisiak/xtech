let frame = 0
let targetY = 0
let targetId = ''
let fromY = 0
let startTime = 0
let duration = 0
let running = false
let drifting = false
let cancel = new AbortController()

function stop() {
  running = false
  drifting = false
  targetId = ''
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  cancel.abort()
}

export function isDrifting() {
  return drifting
}

export function getDriftHref() {
  return targetId ? `#${targetId}` : ''
}

export function stopDrift() {
  stop()
}

function yFor(element: HTMLElement) {
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  return Math.min(max, Math.max(0, window.scrollY + element.getBoundingClientRect().top))
}

function tick(now: number) {
  if (!running) return
  const t = Math.min(1, (now - startTime) / duration)
  const eased = 1 - (1 - t) ** 3
  window.scrollTo(0, fromY + (targetY - fromY) * eased)
  if (t < 1) {
    frame = requestAnimationFrame(tick)
    return
  }
  window.scrollTo(0, targetY)
  stop()
}

export function driftToId(id: string) {
  const element = document.getElementById(id)
  if (!element) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.scrollIntoView()
    return
  }

  const nextY = yFor(element)
  if (Math.abs(nextY - window.scrollY) < 1) return

  stop()
  targetId = id
  targetY = nextY
  fromY = window.scrollY
  startTime = performance.now()
  duration = Math.min(1100, Math.max(480, Math.abs(targetY - fromY) * 0.12))
  cancel = new AbortController()
  const opts = { signal: cancel.signal, passive: true as const }
  window.addEventListener('wheel', stop, opts)
  window.addEventListener('touchstart', stop, opts)
  window.addEventListener(
    'keydown',
    (event) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Escape'].includes(event.key)) stop()
    },
    { signal: cancel.signal },
  )
  drifting = true
  running = true
  frame = requestAnimationFrame(tick)
}

export function bindDriftLinks() {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    const link = (event.target as Element | null)?.closest?.('a[href^="#"]')
    if (!(link instanceof HTMLAnchorElement)) return
    const href = link.getAttribute('href')
    if (!href || href === '#') return
    const id = decodeURIComponent(href.slice(1))
    if (!document.getElementById(id)) return
    event.preventDefault()
    driftToId(id)
    history.replaceState(null, '', href)
  }

  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}
