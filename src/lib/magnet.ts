const REACH = 88
const PULL = 12

export function bindMagnet(root: ParentNode = document) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
  const buttons = [...root.querySelectorAll<HTMLElement>('.btn-primary')]
  if (!buttons.length) return () => {}

  let frame = 0
  let px = 0
  let py = 0

  const reset = (button: HTMLElement) => {
    button.style.removeProperty('--mx')
    button.style.removeProperty('--my')
    button.classList.remove('is-magnet')
  }

  const apply = () => {
    if (reduce.matches || !fine.matches) {
      for (const button of buttons) reset(button)
      return
    }
    for (const button of buttons) {
      const box = button.getBoundingClientRect()
      const cx = box.left + box.width / 2
      const cy = box.top + box.height / 2
      const dx = px - cx
      const dy = py - cy
      const dist = Math.hypot(dx, dy)
      if (dist > REACH || dist < 0.001) {
        reset(button)
        continue
      }
      const t = 1 - dist / REACH
      button.style.setProperty('--mx', `${((dx / dist) * PULL * t).toFixed(2)}px`)
      button.style.setProperty('--my', `${((dy / dist) * PULL * t).toFixed(2)}px`)
      button.classList.add('is-magnet')
    }
  }

  const onMove = (event: PointerEvent) => {
    px = event.clientX
    py = event.clientY
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(apply)
  }

  const onLeave = () => {
    for (const button of buttons) reset(button)
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerleave', onLeave)
  reduce.addEventListener('change', apply)
  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerleave', onLeave)
    reduce.removeEventListener('change', apply)
    for (const button of buttons) reset(button)
  }
}
