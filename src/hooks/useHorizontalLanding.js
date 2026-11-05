import { useCallback, useEffect, useRef, useState } from 'react'

const editable = target => target instanceof Element && Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))
const canRead = (pane, direction) => pane && (direction > 0
  ? pane.scrollTop < pane.scrollHeight - pane.clientHeight - 2
  : pane.scrollTop > 2)

export function useHorizontalLanding(ids) {
  const trackRef = useRef(null)
  const activeRef = useRef(0)
  const animationRef = useRef(null)
  const [active, setActive] = useState(0)
  const reduced = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  const goTo = useCallback((index, instant = false, entry = null) => {
    const track = trackRef.current
    if (!track) return
    animationRef.current?.cancel()
    const next = ((index % ids.length) + ids.length) % ids.length
    const wrapping = index < 0 || index >= ids.length
    const arrive = entry || (wrapping ? (index < 0 ? 'end' : 'start') : null)
    const move = () => {
      const pane = track.children[next]?.querySelector('[data-scene-scroll]')
      if (pane && arrive) pane.scrollTop = arrive === 'end' ? pane.scrollHeight - pane.clientHeight : 0
      // A loop crosses directly to its destination, without travelling over all other slides.
      track.scrollTo({ left: next * track.clientWidth, behavior: instant || reduced.current || wrapping ? 'instant' : 'smooth' })
      activeRef.current = next
      setActive(next)
      window.history.replaceState(window.history.state, '', `#${ids[next]}`)
    }
    if (wrapping && !instant && !reduced.current && track.animate) {
      const fade = track.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100, fill: 'forwards' })
      animationRef.current = fade
      fade.onfinish = () => {
        fade.cancel()
        move()
        animationRef.current = track.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' })
      }
    } else move()
  }, [ids])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    let frame = 0
    let wheelTotal = 0
    let lastWheel = 0
    let lockedUntil = 0
    let lastDirection = 0
    let gestureConsumed = false
    let touch = null
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const motionChanged = () => { reduced.current = media.matches }
    const initial = ids.indexOf(window.location.hash.slice(1))
    goTo(initial >= 0 ? initial : 0, true)

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const current = Math.max(0, Math.min(ids.length - 1, Math.round(track.scrollLeft / track.clientWidth)))
        if (current === activeRef.current) return
        activeRef.current = current
        setActive(current)
        window.history.replaceState(window.history.state, '', `#${ids[current]}`)
      })
    }
    const onWheel = event => {
      if (event.ctrlKey || event.metaKey || editable(event.target)) return
      const horizontal = event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)
      const raw = horizontal ? (event.deltaX || event.deltaY) : event.deltaY
      const delta = raw * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? (horizontal ? track.clientWidth : track.clientHeight) : 1)
      if (!delta) return
      const direction = Math.sign(delta)
      const now = performance.now()
      const gap = now - lastWheel
      lastWheel = now
      if (gap > 180 || direction !== lastDirection) gestureConsumed = false
      // Consume momentum after a transition so one gesture cannot skip several slides.
      if (direction === lastDirection && (now < lockedUntil || gestureConsumed)) {
        event.preventDefault()
        return
      }
      const pane = event.target.closest?.('[data-scene-scroll]') || track.children[activeRef.current]?.querySelector('[data-scene-scroll]')
      if (!horizontal && canRead(pane, direction)) {
        wheelTotal = 0
        return
      }
      event.preventDefault()
      if (gap > 180 || Math.sign(wheelTotal) !== direction) wheelTotal = 0
      wheelTotal += delta
      if (Math.abs(wheelTotal) < 36) return
      lastDirection = direction
      gestureConsumed = true
      goTo(activeRef.current + direction, false, horizontal ? null : (direction > 0 ? 'start' : 'end'))
      wheelTotal = 0
      lockedUntil = now + (reduced.current ? 160 : 650)
    }
    const onKey = event => {
      if (editable(event.target) || event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        goTo(activeRef.current + (event.key === 'ArrowRight' ? 1 : -1))
      }
    }
    const onTouchStart = event => {
      if (event.touches.length !== 1 || editable(event.target)) { touch = null; return }
      const point = event.touches[0]
      const pane = event.target.closest?.('[data-scene-scroll]')
      touch = { x: point.clientX, y: point.clientY, pane, index: activeRef.current, axis: null, captured: false, delta: 0,
        top: !canRead(pane, -1), bottom: !canRead(pane, 1), edgeY: null }
    }
    const onTouchMove = event => {
      if (!touch || event.touches.length !== 1) return
      const point = event.touches[0]
      const dx = touch.x - point.clientX
      const dy = touch.y - point.clientY
      if (!touch.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 12) touch.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (!event.cancelable) return
      if (touch.axis === 'x') {
        // Middle slides keep native swipes; only the outer boundaries need loop handling.
        if ((touch.index === ids.length - 1 && dx > 0) || (touch.index === 0 && dx < 0)) {
          event.preventDefault(); touch.captured = true; touch.delta = dx
        }
      } else if (touch.axis === 'y') {
        if (!touch.captured && canRead(touch.pane, Math.sign(dy))) return
        if (touch.edgeY === null) touch.edgeY = (dy > 0 ? touch.bottom : touch.top) ? touch.y : point.clientY
        event.preventDefault(); touch.captured = true; touch.delta = touch.edgeY - point.clientY
      }
    }
    const onTouchEnd = () => {
      if (touch?.captured && Math.abs(touch.delta) > 48) {
        const direction = Math.sign(touch.delta)
        goTo(touch.index + direction, false, touch.axis === 'y' ? (direction > 0 ? 'start' : 'end') : null)
      }
      touch = null
    }
    const onTouchCancel = () => { touch = null }
    const onHash = () => {
      const index = ids.indexOf(window.location.hash.slice(1))
      if (index >= 0) goTo(index)
    }
    const onResize = () => goTo(activeRef.current, true)
    track.addEventListener('scroll', onScroll, { passive: true })
    track.addEventListener('wheel', onWheel, { passive: false })
    track.addEventListener('touchstart', onTouchStart, { passive: true })
    track.addEventListener('touchmove', onTouchMove, { passive: false })
    track.addEventListener('touchend', onTouchEnd, { passive: true })
    track.addEventListener('touchcancel', onTouchCancel, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('hashchange', onHash)
    window.addEventListener('resize', onResize)
    media.addEventListener('change', motionChanged)
    return () => {
      document.body.style.overflow = previousOverflow
      cancelAnimationFrame(frame)
      animationRef.current?.cancel()
      track.removeEventListener('scroll', onScroll)
      track.removeEventListener('wheel', onWheel)
      track.removeEventListener('touchstart', onTouchStart)
      track.removeEventListener('touchmove', onTouchMove)
      track.removeEventListener('touchend', onTouchEnd)
      track.removeEventListener('touchcancel', onTouchCancel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('resize', onResize)
      media.removeEventListener('change', motionChanged)
    }
  }, [goTo, ids])
  return { trackRef, active, goTo }
}
