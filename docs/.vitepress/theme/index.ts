import DefaultTheme from 'vitepress/theme'
import './custom.css'

function bindSpotlight() {
  const cards = document.querySelectorAll<HTMLElement>('.VPFeature, .case-card')
  cards.forEach((card) => {
    if (card.dataset.spotlight === '1') return
    card.dataset.spotlight = '1'
    card.addEventListener(
      'pointermove',
      (ev: PointerEvent) => {
        const rect = card.getBoundingClientRect()
        card.style.setProperty('--card-x', `${ev.clientX - rect.left}px`)
        card.style.setProperty('--card-y', `${ev.clientY - rect.top}px`)
      },
      { passive: true }
    )
  })
}

function setupScrollProgress() {
  if (document.getElementById('scroll-progress')) return
  const bar = document.createElement('div')
  bar.id = 'scroll-progress'
  document.body.appendChild(bar)
  const update = () => {
    const doc = document.documentElement
    const max = doc.scrollHeight - doc.clientHeight
    const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0
    bar.style.width = `${pct}%`
  }
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
  update()
}

export default {
  extends: DefaultTheme,

  enhanceApp({ router }) {
    if (typeof window === 'undefined') return

    setupScrollProgress()

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    bindSpotlight()
    router.onAfterRouteChanged = () => requestAnimationFrame(bindSpotlight)
  }
}
