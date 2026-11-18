import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { FirstPersonControlsProps } from './types'
import {
  DRAG_SENSITIVITY,
  DRAG_THRESHOLD,
  EYE_HEIGHT,
  LOOK_SENSITIVITY,
  MOVE_MAX_Z,
  MOVE_MIN_Z,
  PITCH_LIMIT,
  START_Z,
  WALK_SPEED,
} from './layout'

const FORWARD_KEYS = new Set(['KeyW', 'ArrowUp'])
const BACKWARD_KEYS = new Set(['KeyS', 'ArrowDown'])

/**
 * Constrained first-person controls (renders no DOM of its own):
 * - Desktop: click empty space to lock the mouse, move the mouse to look,
 *   W/S or arrows to walk along the corridor axis only, ESC to release.
 * - Touch: drag anywhere on the scene to look around.
 * Movement is clamped to the corridor; pitch is clamped to a comfortable range.
 */
export function FirstPersonControls({
  resetSignal,
  moveInputRef,
  hoveredRef,
  panelOpenRef,
  draggedRef,
}: FirstPersonControlsProps) {
  const { camera, gl } = useThree()
  const keys = useRef(new Set<string>())
  const yaw = useRef(0)
  const pitch = useRef(0)
  const z = useRef(START_Z)
  const drag = useRef<{ id: number; x: number; y: number } | null>(null)

  // Keyboard
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (FORWARD_KEYS.has(event.code) || BACKWARD_KEYS.has(event.code)) {
        event.preventDefault()
        keys.current.add(event.code)
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      keys.current.delete(event.code)
    }
    window.addEventListener('keydown', onKeyDown, { passive: false })
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  // Pointer look (pointer lock on desktop, drag on touch/edge cases)
  useEffect(() => {
    const element = gl.domElement

    const onPointerDown = (event: PointerEvent) => {
      draggedRef.current = false
      if (event.button !== 0) return
      drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
      element.setPointerCapture?.(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      const locked = document.pointerLockElement === element
      if (locked) {
        yaw.current -= event.movementX * LOOK_SENSITIVITY
        pitch.current = THREEClamp(pitch.current - event.movementY * LOOK_SENSITIVITY)
        return
      }
      const active = drag.current
      if (!active || active.id !== event.pointerId) return
      const dx = event.clientX - active.x
      const dy = event.clientY - active.y
      if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) draggedRef.current = true
      yaw.current -= dx * DRAG_SENSITIVITY
      pitch.current = THREEClamp(pitch.current - dy * DRAG_SENSITIVITY)
      active.x = event.clientX
      active.y = event.clientY
    }

    const onPointerUp = (event: PointerEvent) => {
      if (drag.current?.id === event.pointerId) {
        drag.current = null
        element.releasePointerCapture?.(event.pointerId)
      }
    }

    const onClick = () => {
      // Only lock when clicking empty space (not a portrait) and no panel is open.
      if (panelOpenRef.current || hoveredRef.current) return
      if (document.pointerLockElement === element) return
      if (!window.matchMedia('(pointer: fine)').matches) return
      try {
        const result = element.requestPointerLock() as unknown as Promise<void> | undefined
        if (result && typeof result.catch === 'function') result.catch(() => {})
      } catch {
        // Pointer lock may be unavailable; drag-look still works.
      }
    }

    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerup', onPointerUp)
    element.addEventListener('pointercancel', onPointerUp)
    element.addEventListener('click', onClick)
    return () => {
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerup', onPointerUp)
      element.removeEventListener('pointercancel', onPointerUp)
      element.removeEventListener('click', onClick)
    }
  }, [camera, gl, panelOpenRef, hoveredRef, draggedRef])

  // Reset view
  useEffect(() => {
    if (resetSignal === 0) return
    yaw.current = 0
    pitch.current = 0
    z.current = START_Z
    keys.current.clear()
    moveInputRef.current = 0
    drag.current = null
    if (document.pointerLockElement) document.exitPointerLock()
  }, [resetSignal, moveInputRef])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)

    let direction = 0
    if (Array.from(keys.current).some((code) => FORWARD_KEYS.has(code))) direction -= 1
    if (Array.from(keys.current).some((code) => BACKWARD_KEYS.has(code))) direction += 1
    direction += moveInputRef.current
    direction = Math.max(-1, Math.min(1, direction))

    // Longitudinal axis only (Z), clamped inside the corridor.
    z.current = Math.max(MOVE_MIN_Z, Math.min(MOVE_MAX_Z, z.current + direction * WALK_SPEED * dt))

    camera.position.set(0, EYE_HEIGHT, z.current)
    // 'YXZ' order keeps yaw/pitch intuitive for first-person look.
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')
  })

  return null
}

function THREEClamp(value: number): number {
  return Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, value))
}
