import { useRef, useState } from 'react'
import type { MobileControlsProps } from './types'

const JOYSTICK_RADIUS = 44

/**
 * Touch controls (HTML, outside the Canvas): virtual joystick for movement,
 * a clearly visible back button, and a reset-view button.
 * The joystick hides while the information panel is open so it never
 * obstructs portrait information.
 */
export function MobileControls({ moveInputRef, visible, onReset, onBack }: MobileControlsProps) {
  const padRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(false)
  const [knob, setKnob] = useState({ x: 0, y: 0 })

  const update = (clientX: number, clientY: number) => {
    const pad = padRef.current
    if (!pad) return
    const rect = pad.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    let dx = clientX - centerX
    let dy = clientY - centerY
    const length = Math.hypot(dx, dy)
    if (length > JOYSTICK_RADIUS) {
      dx = (dx / length) * JOYSTICK_RADIUS
      dy = (dy / length) * JOYSTICK_RADIUS
    }
    setKnob({ x: dx, y: dy })
    moveInputRef.current = Math.max(-1, Math.min(1, -dy / JOYSTICK_RADIUS))
  }

  const end = () => {
    activeRef.current = false
    moveInputRef.current = 0
    setKnob({ x: 0, y: 0 })
  }

  return (
    <div className="gr-mobile">
      <button type="button" className="gr-back" onClick={onBack ?? (() => window.history.back())}>
        ← Back to map
      </button>
      <button type="button" className="gr-reset" onClick={onReset}>
        Reset view
      </button>

      <div
        ref={padRef}
        className={`gr-joystick${visible ? '' : ' gr-hidden'}`}
        aria-label="Movement joystick"
        onPointerDown={(event) => {
          activeRef.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          update(event.clientX, event.clientY)
        }}
        onPointerMove={(event) => {
          if (activeRef.current) update(event.clientX, event.clientY)
        }}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <div
          className="gr-knob"
          style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
        />
        <span className="gr-joy-label">Move</span>
      </div>

      <p className="gr-mobile-hint">Drag to look around · Tap a portrait for details</p>
    </div>
  )
}
