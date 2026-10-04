import { useEffect, useRef } from 'react'

export function Atmosphere() {
  const lightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const light = lightRef.current
    if (!light) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    let frame = 0
    let x = window.innerWidth * 0.5
    let y = window.innerHeight * 0.4
    let tx = x
    let ty = y
    let opacity = 0
    let to = 0

    const paint = () => {
      light.style.setProperty('--lx', `${x}px`)
      light.style.setProperty('--ly', `${y}px`)
      light.style.opacity = opacity.toFixed(3)
    }

    const tick = () => {
      x += (tx - x) * 0.035
      y += (ty - y) * 0.035
      opacity += (to - opacity) * 0.04
      paint()
      frame = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      if (!fine.matches || reduce.matches) return
      tx = event.clientX
      ty = event.clientY
      to = 1
    }

    const onLeave = () => {
      to = 0
    }

    const sync = () => {
      cancelAnimationFrame(frame)
      if (reduce.matches || !fine.matches) {
        to = 0
        opacity = 0
        x = window.innerWidth * 0.5
        y = window.innerHeight * 0.35
        tx = x
        ty = y
        paint()
        return
      }
      frame = requestAnimationFrame(tick)
    }

    paint()
    sync()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    document.addEventListener('mouseleave', onLeave)
    reduce.addEventListener('change', sync)
    fine.addEventListener('change', sync)
    window.addEventListener('resize', sync)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', sync)
      reduce.removeEventListener('change', sync)
      fine.removeEventListener('change', sync)
    }
  }, [])

  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere-wash" />
      <div className="atmosphere-light" ref={lightRef} />
      <div className="atmosphere-grain" />
    </div>
  )
}
