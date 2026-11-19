import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { InteractiveTarget } from '../core/ObjectManager'
import { EXHIBIT_DATA, type ExhibitData, type ExhibitSubItem, type HistoryBookPage } from '../data/historyData'
import { AssetManager } from '../core/AssetManager'
import { SoundManager } from '../core/SoundManager'

interface MuseumUIProps {
  hoveredTarget: InteractiveTarget | null
  activeExhibitId: string | null
  initialSubItemIndex: number
  isStarted: boolean
  onStartExploration: () => void
  onCloseExhibit: () => void
  onResetCamera: () => void
  onJoystickMove?: (x: number, y: number) => void
  onTouchLook?: (dx: number, dy: number) => void
  onInteractButton?: () => void
  onTurnBookPage?: () => void
  onSensitivityChange?: (val: number) => void
}

const ZOOM_STEPS = [1, 1.5, 2, 2.5]

// ============================================================================
// 1. MEMOIZED HEADER (Zero re-renders during walking or camera look)
// ============================================================================
interface HeaderProps {
  isFullscreen: boolean
  isMuted: boolean
  onResetCamera: () => void
  onToggleSound: () => void
  onToggleSettings: () => void
  onOpenHelp: () => void
  onToggleFullscreen: () => void
}

const MuseumHeader = React.memo(function MuseumHeader({
  isFullscreen,
  isMuted,
  onResetCamera,
  onToggleSound,
  onToggleSettings,
  onOpenHelp,
  onToggleFullscreen,
}: HeaderProps) {
  return (
    <header className="museum-hud-header">
      <div className="museum-hud-brand">
        <div className="museum-brand-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="museum-brand-text">
          <h1>Museum Sejarah Universitas Diponegoro</h1>
          <p>Zona 1 — The Origin of Undip · Arsip Warisan 1957</p>
        </div>
      </div>
      <div className="museum-hud-actions">
        <button className="hud-btn" onClick={onResetCamera} title="Kembalikan posisi tengah ruangan">
          <span className="hud-btn-icon">↺</span><span className="hud-btn-label">Reset</span>
        </button>
        <button className="hud-btn" onClick={onToggleSound} title="Audio ambient">
          <span className="hud-btn-icon">{isMuted ? '♪̸' : '♪'}</span><span className="hud-btn-label">Audio</span>
        </button>
        <button className="hud-btn" onClick={onToggleSettings} title="Sensitivitas pandangan">
          <span className="hud-btn-icon">◎</span><span className="hud-btn-label">Sensitivitas</span>
        </button>
        <button className="hud-btn" onClick={onOpenHelp} title="Petunjuk kontrol">
          <span className="hud-btn-icon">?</span><span className="hud-btn-label">Bantuan</span>
        </button>
        <button className="hud-btn" onClick={onToggleFullscreen} title={isFullscreen ? 'Keluar layar penuh' : 'Layar penuh'}>
          <span className="hud-btn-icon">⛶</span><span className="hud-btn-label">Fullscreen</span>
        </button>
      </div>
    </header>
  )
})

// ============================================================================
// 2. MEMOIZED CROSSHAIR & PROMPT (Only re-renders on hover changes)
// ============================================================================
const MuseumCrosshair = React.memo(function MuseumCrosshair({ isHovering }: { isHovering: boolean }) {
  return (
    <div className={`museum-crosshair ${isHovering ? 'is-hovering' : ''}`}>
      <div className="crosshair-dot" />
      <div className="crosshair-ring" />
    </div>
  )
})

const InteractionPrompt = React.memo(function InteractionPrompt({ name }: { name: string }) {
  return (
    <div className="museum-interaction-prompt is-active">
      <div className="prompt-name">{name}</div>
      <div className="prompt-hint"><kbd>E</kbd> Tekan untuk melihat</div>
    </div>
  )
})

const ControlsGuide = React.memo(function ControlsGuide() {
  return (
    <div className="museum-controls-guide">
      <span><kbd>WASD</kbd> Bergerak</span>
      <span><kbd>Mouse</kbd> Pandangan 360°</span>
      <span><kbd>E / Klik</kbd> Interaksi</span>
      <span><kbd>Esc</kbd> Lepas kursor</span>
    </div>
  )
})

// ============================================================================
// 3. ZERO-RERENDER VIRTUAL JOYSTICK (Direct DOM transform at 60/120fps)
// ============================================================================
interface JoystickProps {
  onMove?: (x: number, y: number) => void
}

const VirtualJoystick = React.memo(function VirtualJoystick({ onMove }: JoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const touchIdRef = useRef<number | null>(null)

  const updatePosition = (clientX: number, clientY: number) => {
    if (!baseRef.current || !knobRef.current) return
    const rect = baseRef.current.getBoundingClientRect()
    let dx = clientX - (rect.left + rect.width / 2)
    let dy = clientY - (rect.top + rect.height / 2)
    const maxRadius = rect.width / 2 - 12
    const dist = Math.hypot(dx, dy)
    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius
      dy = (dy / dist) * maxRadius
    }
    // Direct hardware-accelerated transform without causing React state re-render
    knobRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
    onMove?.(dx / maxRadius, dy / maxRadius)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchIdRef.current !== null) return
    const touch = e.changedTouches[0]
    touchIdRef.current = touch.identifier
    updatePosition(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    for (const touch of Array.from(e.changedTouches)) {
      if (touch.identifier === touchIdRef.current) {
        updatePosition(touch.clientX, touch.clientY)
        break
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    for (const touch of Array.from(e.changedTouches)) {
      if (touch.identifier === touchIdRef.current) {
        touchIdRef.current = null
        if (knobRef.current) {
          knobRef.current.style.transform = 'translate3d(0px, 0px, 0)'
        }
        onMove?.(0, 0)
        break
      }
    }
  }

  return (
    <div
      ref={baseRef}
      className="museum-virtual-joystick-base"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div ref={knobRef} className="joystick-knob" style={{ transform: 'translate3d(0px, 0px, 0)' }} />
    </div>
  )
})

// ============================================================================
// 4. MEMOIZED SWIPE LOOK ZONE
// ============================================================================
interface SwipeLookProps {
  onLook?: (dx: number, dy: number) => void
}

const SwipeLookZone = React.memo(function SwipeLookZone({ onLook }: SwipeLookProps) {
  const touchIdRef = useRef<number | null>(null)
  const lastPosRef = useRef({ x: 0, y: 0 })

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchIdRef.current !== null) return
    const touch = e.changedTouches[0]
    touchIdRef.current = touch.identifier
    lastPosRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    for (const touch of Array.from(e.changedTouches)) {
      if (touch.identifier === touchIdRef.current) {
        onLook?.(
          touch.clientX - lastPosRef.current.x,
          touch.clientY - lastPosRef.current.y,
        )
        lastPosRef.current = { x: touch.clientX, y: touch.clientY }
        break
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    for (const touch of Array.from(e.changedTouches)) {
      if (touch.identifier === touchIdRef.current) {
        touchIdRef.current = null
        break
      }
    }
  }

  return (
    <div
      className="museum-touch-look-zone"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="touch-look-hint">Geser untuk melihat sekeliling</div>
    </div>
  )
})

// ============================================================================
// 5. MEMOIZED VINTAGE HISTORY BOOK MODAL
// ============================================================================
interface HistoryBookModalProps {
  exhibitData: ExhibitData
  pageIndex: number
  onClose: () => void
  onPrevPage: () => void
  onNextPage: () => void
}

const HistoryBookModal = React.memo(function HistoryBookModal({
  exhibitData,
  pageIndex,
  onClose,
  onPrevPage,
  onNextPage,
}: HistoryBookModalProps) {
  const currentBookPage: HistoryBookPage | null = exhibitData.bookPages?.[pageIndex] ?? null
  const assetManager = AssetManager.getInstance()

  // Cached data URL lookup
  const bookImageUrl = useMemo(() => {
    if (!currentBookPage?.imageKey) return null
    return assetManager.getImageDataUrl(currentBookPage.imageKey)
  }, [currentBookPage?.imageKey, assetManager])

  return (
    <div className="museum-modal-backdrop" onClick={onClose}>
      <div className="museum-vintage-book-modal" onClick={(e) => e.stopPropagation()}>
        <div className="book-leather-frame">
          <div className="sheet-handle" />
          <div className="book-header-strip">
            <span className="book-meta-title">Buku Sejarah Resmi Universitas Diponegoro</span>
            <button className="btn-close-book" onClick={onClose}>Tutup ✕</button>
          </div>
          {currentBookPage && (
            <div className="book-open-spread">
              <div className="book-page page-left">
                <div className="page-watermark-seal">1957</div>
                <div className="page-top-rule">
                  <span className="page-num">{pageIndex * 2 + 1}</span>
                  <span className="page-header-text">{currentBookPage.pageHeader}</span>
                </div>
                <div className="page-chapter-badge"><span className="badge-period">{currentBookPage.period}</span></div>
                {bookImageUrl && (
                  <div className="book-illustration-box">
                    <img src={bookImageUrl} alt={currentBookPage.chapterTitle} loading="lazy" />
                    <div className="illustration-caption">Arsip Sejarah Resmi Undip · {currentBookPage.period}</div>
                  </div>
                )}
                {currentBookPage.historicalQuote && (
                  <blockquote className="book-historical-quote">{currentBookPage.historicalQuote}</blockquote>
                )}
                {currentBookPage.keyMilestones && (
                  <div className="book-milestones-box">
                    <div className="milestones-heading">Tonggak Peristiwa Penting</div>
                    <ul>{currentBookPage.keyMilestones.map((ms, i) => <li key={i}>{ms}</li>)}</ul>
                  </div>
                )}
              </div>
              <div className="book-page page-right">
                <div className="page-top-rule">
                  <span className="page-header-text">Sejarah Universitas Diponegoro</span>
                  <span className="page-num">{pageIndex * 2 + 2}</span>
                </div>
                <h2 className="book-chapter-title">{currentBookPage.chapterTitle}</h2>
                <div className="chapter-ornament">❖ ❖ ❖</div>
                <div className="book-narrative-text">
                  {currentBookPage.narrativeParagraphs.map((para, i) => (
                    <p key={i} className={i === 0 ? 'drop-cap-paragraph' : ''}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="book-footer-nav">
            <button className="book-nav-btn" onClick={onPrevPage} disabled={pageIndex === 0}>◀ Sebelumnya</button>
            <div className="book-page-counter">Bab <strong>{pageIndex + 1}</strong> / {exhibitData.bookPages?.length ?? 1}</div>
            <button className="book-nav-btn" onClick={onNextPage} disabled={!exhibitData.bookPages || pageIndex === exhibitData.bookPages.length - 1}>Selanjutnya ▶</button>
          </div>
        </div>
      </div>
    </div>
  )
})

// ============================================================================
// 6. MEMOIZED GENERAL COLLECTION MODAL (13 Founders, Photos, Documents)
// ============================================================================
interface CollectionModalProps {
  exhibitData: ExhibitData
  subItemIndex: number
  zoomStep: number
  onClose: () => void
  onSelectSubItem: (idx: number) => void
  onSetZoom: (zoom: number) => void
}

const CollectionModal = React.memo(function CollectionModal({
  exhibitData,
  subItemIndex,
  zoomStep,
  onClose,
  onSelectSubItem,
  onSetZoom,
}: CollectionModalProps) {
  const currentSubItem: ExhibitSubItem | null = exhibitData.items?.[subItemIndex] ?? null
  const isDocumentExhibit = exhibitData.code === 'documents' || exhibitData.code === 'archive'
  const isFounderExhibit = exhibitData.code === 'founders'
  const isPhotoExhibit = exhibitData.code === 'photos'
  const assetManager = AssetManager.getInstance()

  // Memoized and cached data URL
  const itemImageUrl = useMemo(() => {
    if (!currentSubItem?.imageKey) return null
    return assetManager.getImageDataUrl(currentSubItem.imageKey)
  }, [currentSubItem?.imageKey, assetManager])

  return (
    <div className="museum-modal-backdrop" onClick={onClose}>
      <div className="museum-parchment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="modal-header-banner">
          <div>
            <span className="header-area-tag">{exhibitData.areaName}</span>
            <h2>{exhibitData.title}</h2>
            <h3>{exhibitData.subtitle}</h3>
          </div>
          <button className="btn-close-modal" onClick={onClose} title="Tutup (Esc)">✕</button>
        </div>

        <div className="modal-body-scrollable">
          <div className="modal-main-narrative">
            <p>{exhibitData.mainDescription}</p>
          </div>

          {exhibitData.items && exhibitData.items.length > 0 && (
            <div className="subitems-section">
              <div className="subitems-tabs">
                {exhibitData.items.map((item, idx) => (
                  <button
                    key={item.id}
                    className={`tab-btn ${subItemIndex === idx ? 'is-active' : ''}`}
                    onClick={() => onSelectSubItem(idx)}
                  >
                    {isFounderExhibit ? item.title.replace(/^\d+\.\s*/, '') : item.title}
                  </button>
                ))}
              </div>

              {currentSubItem && (
                <div className="subitem-detail-card">
                  {itemImageUrl && (
                    <div className="subitem-image-wrapper">
                      <img
                        src={itemImageUrl}
                        alt={currentSubItem.title}
                        className="subitem-image"
                        style={{ transform: `scale(${ZOOM_STEPS[zoomStep]})` }}
                        loading="lazy"
                      />
                      {isDocumentExhibit && (
                        <div className="doc-zoom-controls">
                          <button onClick={() => onSetZoom(Math.max(0, zoomStep - 1))} disabled={zoomStep === 0}>−</button>
                          <span>{ZOOM_STEPS[zoomStep]}×</span>
                          <button onClick={() => onSetZoom(Math.min(ZOOM_STEPS.length - 1, zoomStep + 1))} disabled={zoomStep === ZOOM_STEPS.length - 1}>+</button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="subitem-info-wrapper">
                    <h4>{currentSubItem.title}</h4>
                    {isFounderExhibit && <div className="detail-label">Jabatan & Kepemimpinan Rektorat</div>}
                    {isPhotoExhibit && <div className="detail-label">Tahun</div>}
                    {isDocumentExhibit && <div className="detail-label">Nomor / Tahun Dokumen</div>}
                    {currentSubItem.subtitle && <div className="subitem-subtitle">{currentSubItem.subtitle}</div>}
                    {currentSubItem.dateOrYear && <div className="subitem-year">{currentSubItem.dateOrYear}</div>}
                    {isFounderExhibit && currentSubItem.leadershipPeriod && (
                      <>
                        <div className="detail-label">Masa Jabatan / Periode Kepemimpinan</div>
                        <div className="subitem-year">{currentSubItem.leadershipPeriod}</div>
                      </>
                    )}

                    <div className="detail-label">{isFounderExhibit ? 'Biografi & Kepemimpinan' : 'Keterangan Sejarah'}</div>
                    <p className="subitem-desc">{currentSubItem.description}</p>

                    {currentSubItem.details && (
                      <>
                        <div className="detail-label">{isFounderExhibit ? 'Kiprah, Kebijakan & Prestasi' : 'Rincian'}</div>
                        <ul className="subitem-details-list">
                          {currentSubItem.details.map((detail, i) => <li key={i}>{detail}</li>)}
                        </ul>
                      </>
                    )}
                    {currentSubItem.quote && <div className="subitem-quote">{currentSubItem.quote}</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="modal-context-note">
            <p>{exhibitData.historicalContext}</p>
            <p>{exhibitData.significance}</p>
          </div>
        </div>

        <div className="modal-footer-bar">
          <span>Tekan <kbd>Esc</kbd> untuk kembali menjelajah.</span>
          <button className="btn-resume" onClick={onClose}>Lanjutkan Eksplorasi →</button>
        </div>
      </div>
    </div>
  )
})

// ============================================================================
// 7. MEMOIZED SETTINGS, HELP, & WELCOME
// ============================================================================
const SettingsModal = React.memo(function SettingsModal({
  sensitivity,
  onClose,
  onChangeSensitivity,
}: {
  sensitivity: number
  onClose: () => void
  onChangeSensitivity: (val: number) => void
}) {
  return (
    <div className="museum-modal-backdrop" onClick={onClose}>
      <div className="museum-settings-popup" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="settings-header">
          <h3>Pengaturan Navigasi</h3>
          <button className="btn-close-sm" onClick={onClose}>✕</button>
        </div>
        <div className="settings-body">
          <label className="setting-label">Sensitivitas pandangan: <strong>{sensitivity.toFixed(1)}x</strong></label>
          <input
            type="range"
            min="0.4"
            max="2.5"
            step="0.1"
            value={sensitivity}
            onChange={(e) => onChangeSensitivity(parseFloat(e.target.value))}
            className="setting-slider"
          />
          <div className="slider-labels"><span>Halus</span><span>Standar</span><span>Cepat</span></div>
        </div>
      </div>
    </div>
  )
})

const HelpModal = React.memo(function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="museum-modal-backdrop" onClick={onClose}>
      <div className="museum-parchment-modal help-card" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="modal-header-banner">
          <div>
            <span className="header-area-tag">Panduan Pengunjung</span>
            <h2>Petunjuk Eksplorasi Museum</h2>
          </div>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body-scrollable">
          <div className="help-grid">
            <div className="help-box">
              <h4>Kontrol Eksplorasi</h4>
              <ul>
                <li><strong>WASD</strong> — bergerak maju, mundur, dan menyamping</li>
                <li><strong>Mouse</strong> — pandangan 360°</li>
                <li><strong>E / Klik</strong> — membuka koleksi terdekat</li>
                <li><strong>Esc</strong> — melepas kursor / menutup panel</li>
              </ul>
            </div>
            <div className="help-box">
              <h4>Koleksi di Ruangan Ini</h4>
              <ul>
                <li><strong>Sayap barat</strong> — buku sejarah di mimbar baca & lemari arsip 1956</li>
                <li><strong>Dinding utara</strong> — galeri foto kampus awal Pleburan & GRIS</li>
                <li><strong>Dinding selatan</strong> — galeri rektor & pimpinan rektorat dari periode ke periode</li>
                <li><strong>Sayap timur</strong> — etalase dokumen resmi penegerian</li>
              </ul>
            </div>
          </div>
          <p className="modal-main-narrative">
            Tidak ada denah yang dibutuhkan: mendekatlah ke objek pameran. Nama koleksi akan muncul,
            lalu tekan <strong>E</strong> (atau tombol aksi di smartphone) untuk membuka informasi lengkapnya.
          </p>
        </div>
        <div className="modal-footer-bar">
          <span>Selamat menjelajah.</span>
          <button className="btn-resume" onClick={onClose}>Mengerti →</button>
        </div>
      </div>
    </div>
  )
})

const WelcomeScreen = React.memo(function WelcomeScreen({
  isTouchDevice,
  onStart,
}: {
  isTouchDevice: boolean
  onStart: () => void
}) {
  return (
    <div className="museum-welcome-screen">
      <div className="welcome-card">
        <div className="welcome-emblem">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10M6 10h10M6 14h6" />
          </svg>
        </div>
        <div className="welcome-pretitle">Diorama Sejarah Virtual 3D · Zona 1 — The Origin of Undip</div>
        <h2 className="welcome-title">Museum Sejarah Universitas Diponegoro</h2>
        <div className="welcome-subtitle">Kronik Pendirian, Tokoh Pimpinan Rektorat & Arsip Resmi 1957 — Kini</div>
        <div className="welcome-divider" />
        <p className="welcome-prologue">
          Jelajahi ruang arsip ini secara alami. Dekati koleksi untuk melihat nama pameran, lalu tekan
          <strong> E </strong> untuk membaca buku sejarah, galeri pimpinan rektorat dari periode ke periode, foto kampus awal, atau dokumen resmi penegerian.
        </p>
        <button className="welcome-btn-start" onClick={onStart}>MULAI EKSPLORASI</button>
        <div className="welcome-hint">
          {isTouchDevice
            ? 'Gunakan joystick untuk bergerak, geser layar untuk melihat, dan tombol aksi untuk membuka koleksi.'
            : 'WASD untuk bergerak · Mouse untuk pandangan 360° · E / Klik untuk berinteraksi · Esc untuk melepas kursor.'}
        </div>
      </div>
    </div>
  )
})

// ============================================================================
// MAIN COMPONENT (Optimized with Sub-Component Isolation & Memoization)
// ============================================================================
export const MuseumUI = React.memo(function MuseumUI({
  hoveredTarget,
  activeExhibitId,
  initialSubItemIndex,
  isStarted,
  onStartExploration,
  onCloseExhibit,
  onResetCamera,
  onJoystickMove,
  onTouchLook,
  onInteractButton,
  onTurnBookPage,
  onSensitivityChange,
}: MuseumUIProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [sensitivity, setSensitivity] = useState(1.0)

  // Panel state is keyed by exhibit id
  const [panelState, setPanelState] = useState<{
    exhibitId: string | null
    itemIndex: number
    bookPage: number
    zoomStep: number
  }>({ exhibitId: null, itemIndex: 0, bookPage: 0, zoomStep: 0 })

  const isFreshPanel = panelState.exhibitId !== activeExhibitId
  const selectedSubItemIndex = isFreshPanel ? initialSubItemIndex : panelState.itemIndex
  const bookPageIndex = isFreshPanel ? 0 : panelState.bookPage
  const zoomStep = isFreshPanel ? 0 : panelState.zoomStep

  const setSelectedSubItemIndex = useCallback((itemIndex: number) => {
    SoundManager.getInstance().playBrassChime()
    setPanelState((s) => ({ exhibitId: activeExhibitId, itemIndex, bookPage: s.bookPage, zoomStep: 0 }))
  }, [activeExhibitId])

  const setBookPageIndex = useCallback((bookPage: number) => {
    setPanelState((s) => ({ exhibitId: activeExhibitId, itemIndex: s.itemIndex, bookPage, zoomStep: s.zoomStep }))
  }, [activeExhibitId])

  const setZoomLevel = useCallback((zoom: number) => {
    setPanelState((s) => ({ exhibitId: activeExhibitId, itemIndex: s.itemIndex, bookPage: s.bookPage, zoomStep: zoom }))
  }, [activeExhibitId])

  const soundManager = SoundManager.getInstance()

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 840)
    }
    checkTouch()
    window.addEventListener('resize', checkTouch)
    return () => window.removeEventListener('resize', checkTouch)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeExhibitId) onCloseExhibit()
        else if (showHelp) setShowHelp(false)
        else if (showSettings) setShowSettings(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeExhibitId, showHelp, showSettings, onCloseExhibit])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }, [])

  const toggleSound = useCallback(() => {
    setIsMuted(soundManager.toggleMute())
  }, [soundManager])

  const handleSensitivityChange = useCallback((val: number) => {
    setSensitivity(val)
    onSensitivityChange?.(val)
  }, [onSensitivityChange])

  const handleNextPage = useCallback(() => {
    const data = activeExhibitId ? EXHIBIT_DATA[activeExhibitId] : null
    if (data?.bookPages && bookPageIndex < data.bookPages.length - 1) {
      setBookPageIndex(bookPageIndex + 1)
      onTurnBookPage?.()
    }
  }, [activeExhibitId, bookPageIndex, setBookPageIndex, onTurnBookPage])

  const handlePrevPage = useCallback(() => {
    if (bookPageIndex > 0) {
      setBookPageIndex(bookPageIndex - 1)
      onTurnBookPage?.()
    }
  }, [bookPageIndex, setBookPageIndex, onTurnBookPage])

  const exhibitData: ExhibitData | null = useMemo(() => {
    return activeExhibitId ? (EXHIBIT_DATA[activeExhibitId] ?? null) : null
  }, [activeExhibitId])

  return (
    <>
      {/* 1. HEADER (Only updates when actions are clicked) */}
      <MuseumHeader
        isFullscreen={isFullscreen}
        isMuted={isMuted}
        onResetCamera={onResetCamera}
        onToggleSound={toggleSound}
        onToggleSettings={() => setShowSettings((prev) => !prev)}
        onOpenHelp={() => setShowHelp(true)}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 2. CROSSHAIR (Only updates when hover state changes) */}
      {isStarted && !activeExhibitId && !showHelp && !isTouchDevice && (
        <MuseumCrosshair isHovering={Boolean(hoveredTarget)} />
      )}

      {/* 3. INTERACTION PROMPT */}
      {isStarted && !activeExhibitId && !isTouchDevice && hoveredTarget && (
        <InteractionPrompt name={hoveredTarget.name} />
      )}

      {/* 4. CONTROLS GUIDE (Static, never re-renders) */}
      {isStarted && !activeExhibitId && !isTouchDevice && (
        <ControlsGuide />
      )}

      {/* 5. MOBILE TOUCH CONTROLS (Isolated, zero parent re-renders while moving) */}
      {isStarted && !activeExhibitId && isTouchDevice && (
        <>
          <SwipeLookZone onLook={onTouchLook} />
          <VirtualJoystick onMove={onJoystickMove} />
          {hoveredTarget && (
            <div className="museum-mobile-interaction">
              <div className="mobile-target-name">{hoveredTarget.name}</div>
              <button className="museum-mobile-action-btn" onClick={onInteractButton}>
                {hoveredTarget.id === 'history' ? 'BACA BUKU' : 'LIHAT KOLEKSI'}
              </button>
            </div>
          )}
        </>
      )}

      {/* 6. SETTINGS MODAL */}
      {showSettings && (
        <SettingsModal
          sensitivity={sensitivity}
          onClose={() => setShowSettings(false)}
          onChangeSensitivity={handleSensitivityChange}
        />
      )}

      {/* 7. WELCOME SCREEN */}
      {!isStarted && (
        <WelcomeScreen isTouchDevice={isTouchDevice} onStart={onStartExploration} />
      )}

      {/* 8. VINTAGE HISTORY BOOK MODAL */}
      {activeExhibitId === 'history' && exhibitData?.bookPages && (
        <HistoryBookModal
          exhibitData={exhibitData}
          pageIndex={bookPageIndex}
          onClose={onCloseExhibit}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      )}

      {/* 9. GENERAL COLLECTION MODAL (13 Founders, Photos, Documents) */}
      {activeExhibitId && activeExhibitId !== 'history' && exhibitData && (
        <CollectionModal
          exhibitData={exhibitData}
          subItemIndex={selectedSubItemIndex}
          zoomStep={zoomStep}
          onClose={onCloseExhibit}
          onSelectSubItem={setSelectedSubItemIndex}
          onSetZoom={setZoomLevel}
        />
      )}

      {/* 10. HELP MODAL */}
      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}
    </>
  )
})
