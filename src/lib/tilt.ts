export const TILT = 14

export function applyTilt(card: HTMLElement, clientX: number, clientY: number) {
  const box = card.getBoundingClientRect()
  const x = (clientX - box.left) / box.width
  const y = (clientY - box.top) / box.height
  card.style.setProperty('--rx', `${((0.5 - y) * TILT).toFixed(2)}deg`)
  card.style.setProperty('--ry', `${((x - 0.5) * TILT).toFixed(2)}deg`)
  card.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`)
  card.style.setProperty('--my', `${(y * 100).toFixed(2)}%`)
  card.classList.add('is-hot')
}

export function resetTilt(card: HTMLElement) {
  card.classList.remove('is-hot')
  card.style.removeProperty('--rx')
  card.style.removeProperty('--ry')
}
