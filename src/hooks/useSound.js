export function useSound() {
  const playNotification = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      ;[0, 0.18].forEach(t => {
        const osc = ctx.createOscillator(), gain = ctx.createGain()
        osc.connect(gain); gain.connect(ctx.destination)
        osc.frequency.setValueAtTime(880, ctx.currentTime + t)
        osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + t + 0.08)
        gain.gain.setValueAtTime(0.3, ctx.currentTime + t)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.18)
        osc.start(ctx.currentTime + t); osc.stop(ctx.currentTime + t + 0.2)
      })
      if (navigator.vibrate) navigator.vibrate([100, 50, 100])
    } catch { /* silent */ }
  }
  const playSuccess = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator(), gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      ;[523,659,784].forEach((f,i) => osc.frequency.setValueAtTime(f, ctx.currentTime + i*0.1))
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(); osc.stop(ctx.currentTime + 0.5)
    } catch { /* silent */ }
  }
  return { playNotification, playSuccess }
}
