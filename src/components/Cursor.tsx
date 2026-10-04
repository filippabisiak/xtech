import { useEffect, useRef } from 'react'

function hoverable(node: EventTarget | null) {
  if (!(node instanceof Element)) return false
  return Boolean(
    node.closest(
      'a, button, .btn, [role="button"], .prefs-toggle, .menu-toggle, label, .work-hover, .work-lightbox-close, .work-gallery-nav',
    ),
  )
}

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    let frame = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let hot = false

    const syncClass = () => {
      const on = fine.matches && !reduce.matches
      document.documentElement.classList.toggle('has-cursor', on)
      dot.classList.toggle('is-off', !on)
      ring.classList.toggle('is-off', !on)
    }

    const tick = () => {
      x += (tx - x) * 0.42
      y += (ty - y) * 0.42
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      frame = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      if (!fine.matches || reduce.matches) return
      tx = event.clientX
      ty = event.clientY
      const next = hoverable(event.target)
      if (next !== hot) {
        hot = next
        dot.classList.toggle('is-hot', hot)
        ring.classList.toggle('is-hot', hot)
      }
    }

    const onChange = () => {
      cancelAnimationFrame(frame)
      syncClass()
      if (fine.matches && !reduce.matches) frame = requestAnimationFrame(tick)
    }

    syncClass()
    onChange()
    window.addEventListener('pointermove', onMove, { passive: true })
    reduce.addEventListener('change', onChange)
    fine.addEventListener('change', onChange)
    return () => {
      cancelAnimationFrame(frame)
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      reduce.removeEventListener('change', onChange)
      fine.removeEventListener('change', onChange)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot is-off" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring is-off" ref={ringRef} aria-hidden="true" />
    </>
  )
}
