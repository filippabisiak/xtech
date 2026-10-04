import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import { getDriftHref, isDrifting, stopDrift } from './driftScroll.ts'

const LOCK_KEYS = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']

function yFor(element: HTMLElement) {
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  return Math.min(max, Math.max(0, window.scrollY + element.getBoundingClientRect().top))
}

export function useQuoteLock(
  sectionRef: RefObject<HTMLElement | null>,
  {
    prevId,
    selfId,
    lang,
    resetHrefs,
    glideMs = 280,
  }: {
    prevId: string
    selfId: string
    lang: string
    resetHrefs: string[]
    glideMs?: number
  },
) {
  const resetKey = resetHrefs.join()
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const html = document.documentElement
    let phase: 'idle' | 'locking' | 'playing' | 'done' = 'idle'
    let lockY = 0
    let holdTimer = 0
    let fallbackTimer = 0
    let glideFrame = 0
    let settleFrame = 0
    let lockAbort: AbortController | null = null

    const prev = () => document.getElementById(prevId)
    let prevBottom = prev()?.getBoundingClientRect().bottom ?? 0

    const prevGone = () => {
      const node = prev()
      if (!node) return true
      return node.getBoundingClientRect().bottom <= 2
    }

    const prevMostlyBack = () => {
      const node = prev()
      if (!node) return false
      return node.getBoundingClientRect().bottom > window.innerHeight * 0.55
    }

    const lock = (onSettled: () => void) => {
      if (getDriftHref() && getDriftHref() !== `#${selfId}`) return
      unlock()
      stopDrift()
      const target = yFor(section)
      const from = window.scrollY
      lockY = from
      html.classList.add('is-quote-locked')
      lockAbort = new AbortController()
      const { signal } = lockAbort
      const prevent = (event: Event) => event.preventDefault()
      window.addEventListener('wheel', prevent, { passive: false, capture: true, signal })
      window.addEventListener('touchmove', prevent, { passive: false, capture: true, signal })
      window.addEventListener(
        'keydown',
        (event) => {
          if (LOCK_KEYS.includes(event.key)) event.preventDefault()
        },
        { capture: true, signal },
      )
      window.addEventListener(
        'scroll',
        () => {
          if (Math.abs(window.scrollY - lockY) > 0.5) window.scrollTo(0, lockY)
        },
        { passive: true, signal },
      )

      const settle = () => {
        lockY = yFor(section)
        window.scrollTo(0, lockY)
        cancelAnimationFrame(settleFrame)
        settleFrame = requestAnimationFrame(() => {
          settleFrame = requestAnimationFrame(onSettled)
        })
      }

      if (glideMs <= 0 || Math.abs(target - from) < 2) {
        settle()
        return
      }

      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / glideMs)
        const eased = 1 - (1 - t) ** 3
        lockY = from + (target - from) * eased
        window.scrollTo(0, lockY)
        if (t < 1) {
          glideFrame = requestAnimationFrame(step)
          return
        }
        glideFrame = 0
        settle()
      }
      glideFrame = requestAnimationFrame(step)
    }

    function unlock() {
      cancelAnimationFrame(glideFrame)
      cancelAnimationFrame(settleFrame)
      glideFrame = 0
      settleFrame = 0
      lockAbort?.abort()
      lockAbort = null
      html.classList.remove('is-quote-locked')
    }

    const clearTimers = () => {
      window.clearTimeout(holdTimer)
      window.clearTimeout(fallbackTimer)
    }

    const showDone = () => {
      section.classList.add('is-done')
      section.classList.remove('is-playing')
    }

    const finish = () => {
      if (phase !== 'playing') return
      phase = 'done'
      window.clearTimeout(fallbackTimer)
      showDone()
      holdTimer = window.setTimeout(unlock, 120)
    }

    const startWords = () => {
      if (phase !== 'locking') return
      phase = 'playing'
      section.classList.remove('is-playing', 'is-done')
      void section.offsetWidth
      section.classList.add('is-playing')
      const list = [...section.querySelectorAll<HTMLElement>('.belief-word')]
      list.at(-1)?.addEventListener('animationend', finish, { once: true })
      const slots = Math.max(list.filter((word) => word.dataset.glue !== '1').length, 1)
      fallbackTimer = window.setTimeout(finish, slots * 100 + 520 + 250)
    }

    const play = () => {
      if (phase !== 'idle' || reduce.matches) return
      if (getDriftHref() && getDriftHref() !== `#${selfId}`) return
      phase = 'locking'
      lock(startWords)
    }

    const reset = () => {
      clearTimers()
      unlock()
      phase = 'idle'
      section.classList.remove('is-playing', 'is-done')
    }

    const markDone = () => {
      clearTimers()
      unlock()
      phase = 'done'
      showDone()
    }

    const quoteIntersecting = () => {
      const rect = section.getBoundingClientRect()
      return rect.top < window.innerHeight * 0.65 && rect.bottom > window.innerHeight * 0.2
    }

    const headingToOtherSection = () => {
      const href = getDriftHref() || window.location.hash
      if (!href || href === `#${selfId}` || href === `#${prevId}`) return false
      const id = href.startsWith('#') ? href.slice(1) : href
      const dest = document.getElementById(id)
      if (!dest) return false
      return dest.getBoundingClientRect().top < window.innerHeight * 0.55
    }

    const onTick = () => {
      if (reduce.matches) {
        markDone()
        return
      }

      const node = prev()
      const bottom = node ? node.getBoundingClientRect().bottom : 0
      const crossed = prevBottom > 2 && bottom <= 2
      prevBottom = bottom

      const away = (Boolean(getDriftHref()) && getDriftHref() !== `#${selfId}`) || headingToOtherSection()
      if (away) {
        if (phase !== 'done') markDone()
        return
      }

      if (phase === 'locking' || phase === 'playing' || isDrifting()) return

      if (phase === 'done') {
        if (prevMostlyBack()) reset()
        return
      }

      if (crossed || (prevGone() && quoteIntersecting())) play()
      else if (prevGone() && !quoteIntersecting()) markDone()
    }

    const onNav = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]')
      if (!(link instanceof HTMLAnchorElement)) return
      const href = link.getAttribute('href')
      if (!href || href === '#') return
      if (resetHrefs.includes(href)) reset()
      else if (href !== `#${selfId}`) markDone()
    }

    onTick()
    window.addEventListener('scroll', onTick, { passive: true })
    window.addEventListener('resize', onTick)
    reduce.addEventListener('change', onTick)
    document.addEventListener('click', onNav, true)
    return () => {
      clearTimers()
      unlock()
      section.classList.remove('is-playing', 'is-done')
      window.removeEventListener('scroll', onTick)
      window.removeEventListener('resize', onTick)
      reduce.removeEventListener('change', onTick)
      document.removeEventListener('click', onNav, true)
    }
  }, [glideMs, lang, prevId, resetKey, resetHrefs, sectionRef, selfId])
}
