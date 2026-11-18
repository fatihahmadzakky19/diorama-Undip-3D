import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import type { Portrait } from './types'
import { CORRIDOR_LENGTH, EYE_HEIGHT, START_Z } from './layout'
import { PORTRAITS } from './data/portraits'
import { GalleryEnvironment } from './GalleryEnvironment'
import { GalleryLighting } from './GalleryLighting'
import { GalleryWalls } from './GalleryWalls'
import { FirstPersonControls } from './FirstPersonControls'
import { DesktopHints } from './DesktopHints'
import { MobileControls } from './MobileControls'
import { PortraitInformationPanel } from './PortraitInformationPanel'
import './gallery.css'

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () =>
      setIsMobile(window.innerWidth <= 820 || window.matchMedia('(pointer: coarse)').matches)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

/**
 * Interactive 3D portrait gallery corridor.
 * The Canvas contains only three.js elements; all UI overlays are HTML
 * siblings of the Canvas so React DOM and the R3F reconciler stay separated.
 */
export function GalleryScene() {
  const isMobile = useIsMobile()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [resetSignal, setResetSignal] = useState(0)

  const moveInputRef = useRef(0)
  const hoveredRef = useRef<string | null>(null)
  const panelOpenRef = useRef(false)
  const draggedRef = useRef(false)

  useEffect(() => {
    hoveredRef.current = hoveredId
    document.body.style.cursor = hoveredId ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [hoveredId])

  useEffect(() => {
    panelOpenRef.current = selectedId !== null
  }, [selectedId])

  const handleSelect = useCallback((id: string) => {
    if (draggedRef.current) return // A look-drag must not count as a tap.
    setSelectedId(id)
  }, [])

  const handleHover = useCallback((id: string | null) => setHoveredId(id), [])
  const handleReset = useCallback(() => setResetSignal((signal) => signal + 1), [])
  const handleClose = useCallback(() => setSelectedId(null), [])

  const selected = selectedId ? (PORTRAITS.find((p) => p.id === selectedId) ?? null) : null
  const selectedIndex = selectedId ? PORTRAITS.findIndex((p) => p.id === selectedId) : -1

  return (
    <div className={`gr-root${isMobile ? ' is-mobile' : ''}`}>
      <Canvas
        shadows={!isMobile}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onPointerMissed={() => setSelectedId(null)}
      >
        <color attach="background" args={['#14100c']} />
        <fog attach="fog" args={['#14100c', 26, Math.round(CORRIDOR_LENGTH + 24)]} />
        <PerspectiveCamera
          makeDefault
          position={[0, EYE_HEIGHT, START_Z]}
          fov={isMobile ? 66 : 58}
          near={0.1}
          far={120}
        />
        <Suspense fallback={null}>
          <GalleryLighting castShadows={!isMobile} />
          <GalleryEnvironment />
          <GalleryWalls
            portraits={PORTRAITS}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onSelect={handleSelect}
            onHover={handleHover}
          />
        </Suspense>
        <FirstPersonControls
          resetSignal={resetSignal}
          moveInputRef={moveInputRef}
          hoveredRef={hoveredRef}
          panelOpenRef={panelOpenRef}
          draggedRef={draggedRef}
        />
      </Canvas>

      {!isMobile && <DesktopHints />}
      {isMobile && (
        <MobileControls
          moveInputRef={moveInputRef}
          visible={selectedId === null}
          onReset={handleReset}
        />
      )}
      <PortraitInformationPanel
        portrait={selected as Portrait | null}
        index={selectedIndex}
        total={PORTRAITS.length}
        onClose={handleClose}
      />
    </div>
  )
}
