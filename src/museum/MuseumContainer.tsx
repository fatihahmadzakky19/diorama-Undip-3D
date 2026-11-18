import { useEffect, useRef, useState, useCallback } from 'react'
import { SceneManager } from './core/SceneManager'
import type { InteractiveTarget } from './core/ObjectManager'
import { MuseumUI } from './ui/MuseumUI'
import { SoundManager } from './core/SoundManager'
import './ui/museum.css'

export function MuseumContainer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneManagerRef = useRef<SceneManager | null>(null)

  const [isStarted, setIsStarted] = useState(false)
  const [hoveredTarget, setHoveredTarget] = useState<InteractiveTarget | null>(null)
  const [activeExhibitId, setActiveExhibitId] = useState<string | null>(null)
  const [openedSubItemIndex, setOpenedSubItemIndex] = useState(0)

  const activeExhibitIdRef = useRef<string | null>(null)

  // Keep interaction callback in sync & pause WebGL rendering while modal is open
  useEffect(() => {
    activeExhibitIdRef.current = activeExhibitId
    sceneManagerRef.current?.setModalOpen(Boolean(activeExhibitId))
  }, [activeExhibitId])

  // Initialize pure Three.js SceneManager
  useEffect(() => {
    if (!containerRef.current) return

    const sceneManager = new SceneManager(
      containerRef.current,
      (target) => {
        setHoveredTarget(target)
      },
      (target) => {
        if (!activeExhibitIdRef.current) {
          sceneManager.getCameraController().unlock()
          setOpenedSubItemIndex(target.subItemIndex ?? 0)
          setActiveExhibitId(target.id)
        }
      },
    )

    sceneManagerRef.current = sceneManager

    return () => {
      sceneManager.dispose()
      sceneManagerRef.current = null
    }
  }, [])

  // Start exploration from landing screen
  const handleStartExploration = useCallback(() => {
    setIsStarted(true)
    SoundManager.getInstance().startAmbient()
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 840
    if (sceneManagerRef.current && !isTouch) {
      sceneManagerRef.current.getCameraController().lock()
    }
  }, [])

  // Close exhibit modal and resume exploration
  const handleCloseExhibit = useCallback(() => {
    setActiveExhibitId(null)
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 840
    if (sceneManagerRef.current && !isTouch) {
      sceneManagerRef.current.getCameraController().lock()
    }
  }, [])

  // Reset camera position to room center
  const handleResetCamera = useCallback(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.getCameraController().reset()
    }
  }, [])

  // Touch controls handlers
  const handleJoystickMove = useCallback((x: number, y: number) => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setJoystickInput(x, y)
    }
  }, [])

  const handleTouchLook = useCallback((dx: number, dy: number) => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.addTouchLook(dx, dy)
    }
  }, [])

  const handleInteractButton = useCallback(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.interactCurrentTarget()
    }
  }, [])

  const handleTurnBookPage = useCallback(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.triggerBookPageTurn()
    }
  }, [])

  const handleSensitivityChange = useCallback((val: number) => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setLookSensitivity(val)
    }
  }, [])

  // Click on viewport when unlocked to re-lock (Desktop only)
  const handleViewportClick = useCallback(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 840
    if (isStarted && !activeExhibitId && sceneManagerRef.current && !isTouch) {
      if (!sceneManagerRef.current.getCameraController().isLocked()) {
        sceneManagerRef.current.getCameraController().lock()
      }
    }
  }, [isStarted, activeExhibitId])

  return (
    <div className="museum-viewport" onClick={handleViewportClick}>
      {/* Three.js Canvas Mount */}
      <div ref={containerRef} className="museum-canvas-container" />

      {/* HTML / CSS Minimalist Vintage UI Layer */}
      <MuseumUI
        hoveredTarget={hoveredTarget}
        activeExhibitId={activeExhibitId}
        initialSubItemIndex={openedSubItemIndex}
        isStarted={isStarted}
        onStartExploration={handleStartExploration}
        onCloseExhibit={handleCloseExhibit}
        onResetCamera={handleResetCamera}
        onJoystickMove={handleJoystickMove}
        onTouchLook={handleTouchLook}
        onInteractButton={handleInteractButton}
        onTurnBookPage={handleTurnBookPage}
        onSensitivityChange={handleSensitivityChange}
      />
    </div>
  )
}
