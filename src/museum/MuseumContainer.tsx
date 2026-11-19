import { useEffect, useRef, useState, useCallback } from 'react'
import { SceneManager } from './core/SceneManager'
import type { InteractiveTarget } from './core/ObjectManager'
import { MuseumUI } from './ui/MuseumUI'
import { SoundManager } from './core/SoundManager'
import type { MuseumBook } from './data/historyData'
import './ui/museum.css'

export function MuseumContainer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneManagerRef = useRef<SceneManager | null>(null)

  const [isStarted, setIsStarted] = useState(false)
  const [hoveredTarget, setHoveredTarget] = useState<InteractiveTarget | null>(null)
  const [activeExhibitId, setActiveExhibitId] = useState<string | null>(null)
  const [activeBook, setActiveBook] = useState<MuseumBook | null>(null)
  const [openedSubItemIndex, setOpenedSubItemIndex] = useState(0)

  const activeExhibitIdRef = useRef<string | null>(null)
  const activeBookRef = useRef<MuseumBook | null>(null)

  // Keep interaction callback in sync & pause WebGL rendering while modal is open
  useEffect(() => {
    activeExhibitIdRef.current = activeExhibitId
    activeBookRef.current = activeBook
    const isModalOpen = Boolean(activeExhibitId || activeBook)
    sceneManagerRef.current?.setModalOpen(isModalOpen)
  }, [activeExhibitId, activeBook])

  // Initialize Three.js SceneManager
  useEffect(() => {
    if (!containerRef.current) return

    const sceneManager = new SceneManager(
      containerRef.current,
      (target) => {
        setHoveredTarget(target)
      },
      (target) => {
        if (!activeExhibitIdRef.current && !activeBookRef.current) {
          sceneManager.getCameraController().unlock()

          // If target is an interactive book on a shelf
          if (target.bookData) {
            setActiveBook(target.bookData)
            return
          }

          // If target is a bookcase banner
          if (target.id.startsWith('bookshelf_')) {
            const shelfNum = target.id.replace('bookshelf_', '')
            sceneManager.focusOnBookshelf(`shelf_z${shelfNum}`)
            return
          }

          // If target is a physical exhibit
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
    const isTouch =
      'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 840
    if (sceneManagerRef.current && !isTouch) {
      sceneManagerRef.current.getCameraController().lock()
    }
  }, [])

  // Close exhibit / book modal and resume exploration
  const handleCloseModal = useCallback(() => {
    setActiveExhibitId(null)
    setActiveBook(null)
    const isTouch =
      'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 840
    if (sceneManagerRef.current && !isTouch) {
      sceneManagerRef.current.getCameraController().lock()
    }
  }, [])

  // Reset camera position to room entrance
  const handleResetCamera = useCallback(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.resetCameraToActiveZone()
    }
  }, [])

  // Focus camera on physical exhibit
  const handleFocusExhibit = useCallback((exhibitId: string) => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.focusOnExhibit(exhibitId)
    }
  }, [])

  // Focus camera on bookshelf category
  const handleFocusBookshelf = useCallback((shelfId: string) => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.focusOnBookshelf(shelfId)
    }
  }, [])

  // Open a specific book directly from sidebar
  const handleOpenBook = useCallback((book: MuseumBook) => {
    sceneManagerRef.current?.getCameraController().unlock()
    setActiveBook(book)
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
    if (hoveredTarget && sceneManagerRef.current) {
      sceneManagerRef.current.getCameraController().unlock()
      if (hoveredTarget.bookData) {
        setActiveBook(hoveredTarget.bookData)
      } else {
        setOpenedSubItemIndex(hoveredTarget.subItemIndex ?? 0)
        setActiveExhibitId(hoveredTarget.id)
      }
    }
  }, [hoveredTarget])

  const handleTurnBookPage = useCallback(() => {
    sceneManagerRef.current?.triggerBookPageTurn()
  }, [])

  const handleSensitivityChange = useCallback((val: number) => {
    sceneManagerRef.current?.setLookSensitivity(val)
  }, [])

  return (
    <div className="museum-viewport" ref={containerRef}>
      <MuseumUI
        hoveredTarget={hoveredTarget}
        activeExhibitId={activeExhibitId}
        activeBook={activeBook}
        initialSubItemIndex={openedSubItemIndex}
        isStarted={isStarted}
        onStartExploration={handleStartExploration}
        onCloseModal={handleCloseModal}
        onResetCamera={handleResetCamera}
        onFocusExhibit={handleFocusExhibit}
        onFocusBookshelf={handleFocusBookshelf}
        onOpenBook={handleOpenBook}
        onJoystickMove={handleJoystickMove}
        onTouchLook={handleTouchLook}
        onInteractButton={handleInteractButton}
        onTurnBookPage={handleTurnBookPage}
        onSensitivityChange={handleSensitivityChange}
      />
    </div>
  )
}
