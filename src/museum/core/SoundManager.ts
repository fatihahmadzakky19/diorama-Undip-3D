export class SoundManager {
  private static instance: SoundManager
  private ctx: AudioContext | null = null
  private ambientGain: GainNode | null = null
  private isMuted = false
  private ambientOsc: OscillatorNode | null = null

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  private initContext(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // Soft vintage grandfather clock tick
  public playClockTick(isTock = false): void {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(isTock ? 480 : 620, now)
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.04)

    gain.gain.setValueAtTime(0.06, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.045)
  }

  // Subtle paper page rustle sound when opening historic archives
  public playPaperTurn(): void {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    // Generate filtered buffer noise
    const bufferSize = this.ctx.sampleRate * 0.18
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1400, now)
    filter.frequency.exponentialRampToValueAtTime(700, now + 0.18)
    filter.Q.value = 2.5

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(now)
    noise.stop(now + 0.18)
  }

  // Soft brass chime when selecting items
  public playBrassChime(): void {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.25)

    gain.gain.setValueAtTime(0.05, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.26)
  }

  // Warm gentle ambient room presence
  public startAmbient(): void {
    if (this.ambientOsc || this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(75, now) // Deep warm hum

    gain.gain.setValueAtTime(0.015, now)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    this.ambientOsc = osc
    this.ambientGain = gain
  }

  public stopAmbient(): void {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop()
        this.ambientOsc.disconnect()
        if (this.ambientGain) {
          this.ambientGain.disconnect()
        }
      } catch {
        // ignore
      }
      this.ambientOsc = null
      this.ambientGain = null
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted
    if (this.isMuted) {
      this.stopAmbient()
    } else {
      this.startAmbient()
    }
    return this.isMuted
  }

  public getMuted(): boolean {
    return this.isMuted
  }
}
