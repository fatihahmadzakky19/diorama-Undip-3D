import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import type { InteractiveTarget } from '../core/ObjectManager'
import {
  EXHIBIT_DATA,
  PHYSICAL_EXHIBITS,
  BOOKSHELF_CATEGORIES,
  MUSEUM_BOOKS,
  type ExhibitData,
  type ExhibitSubItem,
  type HistoryBookPage,
  type MuseumBook,
} from '../data/historyData'
import { AssetManager } from '../core/AssetManager'
import { SoundManager } from '../core/SoundManager'

interface MuseumUIProps {
  hoveredTarget: InteractiveTarget | null
  activeExhibitId: string | null
  activeBook: MuseumBook | null
  initialSubItemIndex: number
  isStarted: boolean
  onStartExploration: () => void
  onCloseModal: () => void
  onResetCamera: () => void
  onFocusExhibit: (exhibitId: string) => void
  onFocusBookshelf: (shelfId: string) => void
  onOpenBook: (book: MuseumBook) => void
  onJoystickMove?: (x: number, y: number) => void
  onTouchLook?: (dx: number, dy: number) => void
  onInteractButton?: () => void
  onTurnBookPage?: () => void
  onSensitivityChange?: (val: number) => void
}

const ZOOM_STEPS = [1, 1.5, 2, 2.5]

// ============================================================================
// 1. HEADER (Zero re-renders during walking or camera look)
// ============================================================================
interface HeaderProps {
  isFullscreen: boolean
  isMuted: boolean
  onResetCamera: () => void
  onToggleSound: () => void
  onToggleSettings: () => void
  onOpenHelp: () => void
  onToggleFullscreen: () => void
  onToggleSidebar: () => void
}

const MuseumHeader = React.memo(function MuseumHeader({
  isFullscreen,
  isMuted,
  onResetCamera,
  onToggleSound,
  onToggleSettings,
  onOpenHelp,
  onToggleFullscreen,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="museum-hud-header">
      <div className="museum-hud-brand">
        <button
          className="hud-btn hud-btn-sidebar-toggle"
          onClick={onToggleSidebar}
          title="Buka Panduan & Rak Buku Museum"
        >
          <span className="hud-btn-icon">🏛</span>
          <span className="hud-btn-label">Pameran & Buku</span>
        </button>
        <div className="museum-brand-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="museum-brand-text">
          <h1>Museum Sejarah Universitas Diponegoro</h1>
          <p>The Archive Room · Ruang Pameran & Perpustakaan Sejarah 1957 — Kini</p>
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
// 2. CROSSHAIR & INTERACTION PROMPT
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
      <div className="prompt-hint"><kbd>E</kbd> Tekan untuk membuka informasi</div>
    </div>
  )
})

const ControlsGuide = React.memo(function ControlsGuide() {
  return (
    <div className="museum-controls-guide">
      <span><kbd>WASD</kbd> Bergerak</span>
      <span><kbd>Mouse</kbd> Pandangan 360°</span>
      <span><kbd>E / Klik</kbd> Baca Buku / Periksa Objek</span>
      <span><kbd>Esc</kbd> Lepas Kursor</span>
    </div>
  )
})

// ============================================================================
// 3. ZERO-RERENDER VIRTUAL JOYSTICK & TOUCH LOOK
// ============================================================================
interface JoystickProps {
  onMove?: (x: number, y: number) => void
}

const VirtualJoystick = React.memo(function VirtualJoystick({ onMove }: JoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const touchIdRef = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchIdRef.current !== null) return
    const touch = e.changedTouches[0]
    touchIdRef.current = touch.identifier
    updateJoystick(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    for (const touch of Array.from(e.changedTouches)) {
      if (touch.identifier === touchIdRef.current) {
        updateJoystick(touch.clientX, touch.clientY)
        break
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    for (const touch of Array.from(e.changedTouches)) {
      if (touch.identifier === touchIdRef.current) {
        touchIdRef.current = null
        if (knobRef.current) {
          knobRef.current.style.transform = 'translate(0px, 0px)'
        }
        onMove?.(0, 0)
        break
      }
    }
  }

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!baseRef.current || !knobRef.current) return
    const rect = baseRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const maxRadius = rect.width / 2 - 16

    let dx = clientX - centerX
    let dy = clientY - centerY
    const dist = Math.hypot(dx, dy)

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius
      dy = (dy / dist) * maxRadius
    }

    knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`
    onMove?.(dx / maxRadius, dy / maxRadius)
  }

  return (
    <div
      ref={baseRef}
      className="museum-virtual-joystick"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div ref={knobRef} className="joystick-knob" />
    </div>
  )
})

interface SwipeLookZoneProps {
  onLook?: (dx: number, dy: number) => void
}

const SwipeLookZone = React.memo(function SwipeLookZone({ onLook }: SwipeLookZoneProps) {
  const lastPosRef = useRef({ x: 0, y: 0 })
  const touchIdRef = useRef<number | null>(null)

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
      <div className="touch-look-hint">Geser layar untuk melihat sekeliling</div>
    </div>
  )
})

// ============================================================================
// 4. INTERACTIVE VINTAGE BOOK READER MODAL
// ============================================================================
interface BookReaderModalProps {
  book: MuseumBook
  onClose: () => void
  onTurnPage?: () => void
}

const BookReaderModal = React.memo(function BookReaderModal({
  book,
  onClose,
  onTurnPage,
}: BookReaderModalProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const chapter = book.chapters[currentChapterIndex] || book.chapters[0]
  const assetManager = AssetManager.getInstance()

  const imageUrl = useMemo(() => {
    if (!chapter?.imageKey) return null
    return assetManager.getImageDataUrl(chapter.imageKey)
  }, [chapter?.imageKey, assetManager])

  const handleNext = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1)
      onTurnPage?.()
    }
  }

  const handlePrev = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1)
      onTurnPage?.()
    }
  }

  return (
    <div className="museum-modal-backdrop" onClick={onClose}>
      <div className="museum-vintage-book-modal" onClick={(e) => e.stopPropagation()}>
        <div className="book-leather-frame">
          <div className="sheet-handle" />
          <div className="book-header-strip">
            <div className="book-shelf-category-tag">
              <span>{book.shelfCategory}</span>
            </div>
            <button className="btn-close-book" onClick={onClose}>Tutup Buku ✕</button>
          </div>

          <div className="book-open-spread">
            {/* Left Page: Illustration, Metadata & Milestones */}
            <div className="book-page page-left">
              <div className="page-watermark-seal">UNDIP</div>
              <div className="page-top-rule">
                <span className="page-num">{currentChapterIndex * 2 + 1}</span>
                <span className="page-header-text">{chapter.pageHeader}</span>
              </div>

              <div className="page-chapter-badge">
                <span className="badge-period">{chapter.period}</span>
              </div>

              {imageUrl && (
                <div className="book-illustration-box">
                  <img src={imageUrl} alt={chapter.title} loading="lazy" />
                  <div className="illustration-caption">
                    Dokumentasi Arsip Sejarah Undip · {chapter.period}
                  </div>
                </div>
              )}

              {chapter.historicalQuote && (
                <blockquote className="book-historical-quote">
                  {chapter.historicalQuote}
                </blockquote>
              )}

              {chapter.keyMilestones && chapter.keyMilestones.length > 0 && (
                <div className="book-milestones-box">
                  <div className="milestones-heading">Tonggak Peristiwa Penting</div>
                  <ul>
                    {chapter.keyMilestones.map((ms, i) => (
                      <li key={i}>{ms}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Page: Narrative Content & Citations */}
            <div className="book-page page-right">
              <div className="page-top-rule">
                <span className="page-header-text">{book.title}</span>
                <span className="page-num">{currentChapterIndex * 2 + 2}</span>
              </div>

              <h2 className="book-chapter-title">{chapter.title}</h2>
              <div className="chapter-ornament">❖ ❖ ❖</div>

              <div className="book-text-body">
                {chapter.narrativeParagraphs.map((para, i) => (
                  <p key={i} className={i === 0 ? 'drop-cap-paragraph' : ''}>
                    {para}
                  </p>
                ))}
              </div>

              {book.referenceUrl && (
                <div className="book-source-attribution">
                  <span>Rujukan Resmi: </span>
                  <a href={book.referenceUrl} target="_blank" rel="noopener noreferrer">
                    {book.referenceUrl}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Book Footer Controls */}
          <div className="book-footer-strip">
            <button
              className="btn-book-nav"
              onClick={handlePrev}
              disabled={currentChapterIndex === 0}
            >
              ← Halaman Sebelumnya
            </button>

            <div className="book-chapter-indicator">
              <span>Bab {currentChapterIndex + 1} dari {book.chapters.length}</span>
            </div>

            <button
              className="btn-book-nav"
              onClick={handleNext}
              disabled={currentChapterIndex === book.chapters.length - 1}
            >
              Halaman Berikutnya →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

// ============================================================================
// 5. MAIN HISTORY LECTERN BOOK MODAL
// ============================================================================
interface MainHistoryModalProps {
  exhibitData: ExhibitData
  pageIndex: number
  onClose: () => void
  onPrevPage: () => void
  onNextPage: () => void
}

const MainHistoryBookModal = React.memo(function MainHistoryBookModal({
  exhibitData,
  pageIndex,
  onClose,
  onPrevPage,
  onNextPage,
}: MainHistoryModalProps) {
  const currentBookPage: HistoryBookPage | null = exhibitData.bookPages?.[pageIndex] ?? null
  const assetManager = AssetManager.getInstance()

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
            <span className="book-meta-title">Buku Sejarah Resmi Universitas Diponegoro (undip.ac.id/sejarah-2)</span>
            <button className="btn-close-book" onClick={onClose}>Tutup Buku ✕</button>
          </div>
          {currentBookPage && (
            <div className="book-open-spread">
              <div className="book-page page-left">
                <div className="page-watermark-seal">1957</div>
                <div className="page-top-rule">
                  <span className="page-num">{pageIndex * 2 + 1}</span>
                  <span className="page-header-text">{currentBookPage.pageHeader}</span>
                </div>
                <div className="page-chapter-badge">
                  <span className="badge-period">{currentBookPage.period}</span>
                </div>
                {bookImageUrl && (
                  <div className="book-illustration-box">
                    <img src={bookImageUrl} alt={currentBookPage.chapterTitle} loading="lazy" />
                    <div className="illustration-caption">
                      Arsip Sejarah Resmi Undip · {currentBookPage.period}
                    </div>
                  </div>
                )}
                {currentBookPage.historicalQuote && (
                  <blockquote className="book-historical-quote">
                    {currentBookPage.historicalQuote}
                  </blockquote>
                )}
                {currentBookPage.keyMilestones && (
                  <div className="book-milestones-box">
                    <div className="milestones-heading">Tonggak Peristiwa Penting</div>
                    <ul>
                      {currentBookPage.keyMilestones.map((ms, i) => (
                        <li key={i}>{ms}</li>
                      ))}
                    </ul>
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
                <div className="book-text-body">
                  {currentBookPage.narrativeParagraphs.map((para, i) => (
                    <p key={i} className={i === 0 ? 'drop-cap-paragraph' : ''}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="book-footer-strip">
            <button className="btn-book-nav" onClick={onPrevPage} disabled={pageIndex === 0}>
              ← Halaman Sebelumnya
            </button>
            <div className="book-chapter-indicator">
              <span>Halaman {pageIndex + 1} dari {exhibitData.bookPages?.length ?? 1}</span>
            </div>
            <button
              className="btn-book-nav"
              onClick={onNextPage}
              disabled={!exhibitData.bookPages || pageIndex >= exhibitData.bookPages.length - 1}
            >
              Halaman Berikutnya →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

// ============================================================================
// 6. PHYSICAL COLLECTION MODAL (13 Directors, 5 Founders, Photos, Miniature)
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
  const subItems = exhibitData.items || []
  const currentItem: ExhibitSubItem | null = subItems[subItemIndex] || subItems[0] || null
  const assetManager = AssetManager.getInstance()

  const currentImageUrl = useMemo(() => {
    if (!currentItem?.imageKey) return null
    return assetManager.getImageDataUrl(currentItem.imageKey)
  }, [currentItem?.imageKey, assetManager])

  return (
    <div className="museum-modal-backdrop" onClick={onClose}>
      <div className="museum-collection-modal" onClick={(e) => e.stopPropagation()}>
        <div className="collection-modal-inner">
          {/* Header */}
          <div className="modal-header-strip">
            <div className="modal-header-titles">
              <span className="modal-badge">{exhibitData.badgeText}</span>
              <h2 className="modal-title">{exhibitData.title}</h2>
              <div className="modal-subtitle">{exhibitData.subtitle}</div>
            </div>
            <button className="btn-close-modal" onClick={onClose} title="Tutup Koleksi">✕</button>
          </div>

          {/* Sub-item Carousel Tabs */}
          {subItems.length > 1 && (
            <div className="modal-subitem-tabs">
              {subItems.map((item, idx) => (
                <button
                  key={item.id}
                  className={`subitem-tab-btn ${idx === subItemIndex ? 'is-active' : ''}`}
                  onClick={() => onSelectSubItem(idx)}
                >
                  <span className="tab-number">{idx + 1}</span>
                  <span className="tab-label">{item.title.replace(/^\d+\.\s*/, '')}</span>
                </button>
              ))}
            </div>
          )}

          {/* Main Content Body */}
          <div className="modal-content-grid">
            {/* Visual Frame */}
            <div className="modal-visual-panel">
              <div className="visual-zoom-controls">
                <span className="zoom-label">Zoom:</span>
                {ZOOM_STEPS.map((z) => (
                  <button
                    key={z}
                    className={`btn-zoom ${zoomStep === z ? 'is-active' : ''}`}
                    onClick={() => onSetZoom(z)}
                  >
                    {z}x
                  </button>
                ))}
              </div>

              <div className="modal-image-viewport">
                {currentImageUrl ? (
                  <img
                    src={currentImageUrl}
                    alt={currentItem?.title || exhibitData.title}
                    style={{ transform: `scale(${zoomStep})` }}
                    className="modal-image-display"
                  />
                ) : (
                  <div className="modal-image-placeholder">
                    <span>Arsip Universitas Diponegoro</span>
                  </div>
                )}
              </div>

              {currentItem?.dateOrYear && (
                <div className="modal-image-caption">
                  <span>{currentItem.dateOrYear}</span>
                  {currentItem.leadershipPeriod && (
                    <span className="caption-period"> · {currentItem.leadershipPeriod}</span>
                  )}
                </div>
              )}
            </div>

            {/* Narrative & Details Panel */}
            <div className="modal-info-panel">
              {currentItem ? (
                <>
                  <div className="item-heading-block">
                    <h3 className="item-title">{currentItem.title}</h3>
                    {currentItem.subtitle && <p className="item-subtitle">{currentItem.subtitle}</p>}
                  </div>

                  {currentItem.quote && (
                    <blockquote className="item-quote">“{currentItem.quote}”</blockquote>
                  )}

                  <p className="item-description">{currentItem.description}</p>

                  {currentItem.details && currentItem.details.length > 0 && (
                    <div className="item-details-list">
                      <h4>Catatan Sejarah:</h4>
                      <ul>
                        {currentItem.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="item-description">{exhibitData.mainDescription}</p>
              )}

              {/* Historical Context & Significance */}
              <div className="item-context-box">
                <h4>Konteks Sejarah & Signifikansi:</h4>
                <p>{exhibitData.historicalContext}</p>
                <p className="significance-text">{exhibitData.significance}</p>
              </div>

              {/* Quick Stats Bar */}
              {exhibitData.stats && (
                <div className="modal-stats-grid">
                  {exhibitData.stats.map((st, i) => (
                    <div key={i} className="stat-card">
                      <span className="stat-label">{st.label}</span>
                      <span className="stat-value">{st.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="modal-footer-bar">
            <span>Universitas Diponegoro · Arsip Digital Sejarah</span>
            <button className="btn-resume" onClick={onClose}>Lanjutkan Eksplorasi →</button>
          </div>
        </div>
      </div>
    </div>
  )
})

// ============================================================================
// 7. IN-ROOM SIDEBAR NAVIGATOR (Guide & Book Catalog Drawer)
// ============================================================================
interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onFocusExhibit: (exhibitId: string) => void
  onFocusBookshelf: (shelfId: string) => void
  onOpenBook: (book: MuseumBook) => void
}

const MuseumSidebar = React.memo(function MuseumSidebar({
  isOpen,
  onClose,
  onFocusExhibit,
  onFocusBookshelf,
  onOpenBook,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'exhibits' | 'books'>('books')

  if (!isOpen) return null

  return (
    <aside className="museum-sidebar-overlay" onClick={onClose}>
      <div className="museum-sidebar-panel" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <div className="sidebar-brand-title">
            <span className="sidebar-badge">PANDUAN & RAK BUKU</span>
            <h3>Museum Sejarah Undip</h3>
            <p className="sidebar-subtitle">The Archive Room · Ruang Pameran Tunggal</p>
          </div>
          <button className="sidebar-close-btn" onClick={onClose} title="Tutup Navigasi">✕</button>
        </div>

        {/* Navigation Category Tabs */}
        <div className="sidebar-nav-tabs">
          <button
            className={`sidebar-tab-btn ${activeTab === 'books' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            📚 5 Rak Buku Sejarah
          </button>
          <button
            className={`sidebar-tab-btn ${activeTab === 'exhibits' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('exhibits')}
          >
            🏛 5 Koleksi Fisik
          </button>
        </div>

        <div className="sidebar-body">
          {activeTab === 'books' ? (
            <div className="sidebar-bookshelf-section">
              <p className="sidebar-section-intro">
                Materi Zona 1 s/d Zona 5 disajikan melalui buku-buku sejarah di rak museum. Klik buku untuk membaca langsung, atau klik tombol fokus untuk mengarahkan pandangan ke rak.
              </p>

              {BOOKSHELF_CATEGORIES.map((shelf) => {
                const booksOnShelf = MUSEUM_BOOKS.filter((b) => b.shelfId === shelf.shelfId)

                return (
                  <div key={shelf.shelfId} className="sidebar-shelf-card">
                    <div className="shelf-card-header">
                      <div className="shelf-card-info">
                        <span className="shelf-badge">ZONA {shelf.zoneNumber}</span>
                        <h4 className="shelf-title">{shelf.label}</h4>
                        <p className="shelf-subtitle">{shelf.subtitle}</p>
                      </div>
                      <button
                        className="btn-focus-shelf"
                        onClick={() => {
                          onFocusBookshelf(shelf.shelfId)
                          onClose()
                        }}
                        title="Arahkan kamera ke rak ini"
                      >
                        Fokus Rak 🎯
                      </button>
                    </div>

                    <div className="shelf-book-list">
                      {booksOnShelf.map((b) => (
                        <div key={b.id} className="shelf-book-item">
                          <div className="book-item-left">
                            <span className="book-item-icon">📖</span>
                            <div className="book-item-text">
                              <span className="book-item-title">{b.title}</span>
                              <span className="book-item-period">{b.period}</span>
                            </div>
                          </div>
                          <button
                            className="btn-read-book"
                            onClick={() => {
                              onOpenBook(b)
                              onClose()
                            }}
                          >
                            Buka Buku →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="sidebar-physical-section">
              <p className="sidebar-section-intro">
                Pameran fisik 3D yang terpajang di dalam ruangan museum. Klik untuk memusatkan kamera secara langsung ke objek pameran.
              </p>

              {PHYSICAL_EXHIBITS.map((ex) => (
                <div
                  key={ex.id}
                  className="sidebar-exhibit-card"
                  onClick={() => {
                    onFocusExhibit(ex.id)
                    onClose()
                  }}
                >
                  <div className="exhibit-card-body">
                    <h4 className="exhibit-card-title">{ex.title}</h4>
                    <p className="exhibit-card-subtitle">{ex.subtitle}</p>
                  </div>
                  <div className="exhibit-card-action">
                    <span className="action-tag">Arahkan Kamera 🎯</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <p className="sidebar-footer-hint">
            ✦ Dekati rak buku atau pameran di ruangan 3D lalu tekan <strong>E</strong> untuk berinteraksi.
          </p>
        </div>
      </div>
    </aside>
  )
})

// ============================================================================
// 8. WELCOME SCREEN
// ============================================================================
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
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10M6 10h10M6 14h6" />
          </svg>
        </div>
        <div className="welcome-pretitle">Museum Digital Interaktif 3D · The Archive Room</div>
        <h2 className="welcome-title">Museum Sejarah Universitas Diponegoro</h2>
        <div className="welcome-subtitle">Ruang Arsip Sejarah, Galeri Pimpinan Rektorat & Rak Buku Interaktif 1957 — Kini</div>
        <div className="welcome-divider" />
        <p className="welcome-prologue">
          Selamat datang di Museum Sejarah Universitas Diponegoro. Ruangan arsip klasik ini menyajikan:
          <br /><br />
          • <strong>5 Pameran Fisik Utama:</strong> Sejarah Undip (Mimbar Baca), Galeri 5 Pendiri Utama, Galeri Tokoh Direktorat & Rektorat dari Periode ke Periode (13 Tokoh), Galeri Foto Dokumentasi Kampus Awal (1957–1962), dan Maket 3D Transformasi Kampus.
          <br /><br />
          • <strong>Sistem Rak Buku Interaktif (Zona 1 s/d Zona 5):</strong> Jelajahi buku-buku sejarah di rak kayu antik yang dapat dibuka dan dibaca langsung.
        </p>
        <button className="welcome-btn-start" onClick={onStart}>MULAI EKSPLORASI MUSEUM</button>
        <div className="welcome-hint">
          {isTouchDevice
            ? 'Gunakan joystick untuk berjalan, geser layar untuk melihat sekeliling, dan tombol aksi untuk membuka buku atau koleksi.'
            : 'WASD untuk bergerak · Mouse untuk pandangan 360° · E / Klik untuk membaca buku atau melihat pameran · Esc untuk melepas kursor.'}
        </div>
      </div>
    </div>
  )
})

// ============================================================================
// 9. SETTINGS & HELP MODALS
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
      <div className="museum-help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-strip">
          <h3>Pengaturan Pandangan</h3>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>
        <div className="settings-body" style={{ padding: '24px 0' }}>
          <label style={{ display: 'block', marginBottom: 12, color: 'var(--c-parchment)' }}>
            Sensitivitas Mouse / Sentuhan: <strong>{sensitivity.toFixed(1)}x</strong>
          </label>
          <input
            type="range"
            min="0.4"
            max="2.5"
            step="0.1"
            value={sensitivity}
            onChange={(e) => onChangeSensitivity(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--c-brown)' }}
          />
        </div>
        <div className="modal-footer-bar">
          <button className="btn-resume" onClick={onClose}>Selesai</button>
        </div>
      </div>
    </div>
  )
})

const HelpModal = React.memo(function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="museum-modal-backdrop" onClick={onClose}>
      <div className="museum-help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-strip">
          <h3>Petunjuk Navigasi Museum</h3>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>
        <div className="help-content-body">
          <div className="help-key-row">
            <kbd>W A S D</kbd>
            <span>Berjalan maju, ke kiri, mundur, dan ke kanan</span>
          </div>
          <div className="help-key-row">
            <kbd>Mouse</kbd>
            <span>Mengarahkan pandangan 360 derajat</span>
          </div>
          <div className="help-key-row">
            <kbd>E / Klik</kbd>
            <span>Membaca buku sejarah atau membuka informasi detail pameran fisik</span>
          </div>
          <div className="help-key-row">
            <kbd>Esc</kbd>
            <span>Melepas kursor mouse untuk membuka menu</span>
          </div>
          <p className="modal-main-narrative" style={{ marginTop: 18 }}>
            Dekati objek pameran atau rak buku. Indikator nama akan muncul, lalu tekan <strong>E</strong> (atau tombol aksi di smartphone) untuk membuka naskah sejarah lengkapnya.
          </p>
        </div>
        <div className="modal-footer-bar">
          <button className="btn-resume" onClick={onClose}>Mengerti →</button>
        </div>
      </div>
    </div>
  )
})

// ============================================================================
// MAIN MUSEUM UI COMPONENT
// ============================================================================
export const MuseumUI = React.memo(function MuseumUI({
  hoveredTarget,
  activeExhibitId,
  activeBook,
  initialSubItemIndex,
  isStarted,
  onStartExploration,
  onCloseModal,
  onResetCamera,
  onFocusExhibit,
  onFocusBookshelf,
  onOpenBook,
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
  const [showSidebar, setShowSidebar] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [sensitivity, setSensitivity] = useState(1.0)

  const [selectedSubItemIndex, setSelectedSubItemIndex] = useState(initialSubItemIndex)
  const [bookPageIndex, setBookPageIndex] = useState(0)
  const [zoomStep, setZoomStep] = useState(1)

  useEffect(() => {
    setSelectedSubItemIndex(initialSubItemIndex)
  }, [initialSubItemIndex])

  useEffect(() => {
    setBookPageIndex(0)
    setZoomStep(1)
  }, [activeExhibitId, activeBook])

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
        if (activeExhibitId || activeBook) onCloseModal()
        else if (showHelp) setShowHelp(false)
        else if (showSettings) setShowSettings(false)
        else if (showSidebar) setShowSidebar(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeExhibitId, activeBook, showHelp, showSettings, showSidebar, onCloseModal])

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

  const handleNextMainHistoryPage = useCallback(() => {
    const data = activeExhibitId ? EXHIBIT_DATA[activeExhibitId] : null
    if (data?.bookPages && bookPageIndex < data.bookPages.length - 1) {
      setBookPageIndex(bookPageIndex + 1)
      onTurnBookPage?.()
    }
  }, [activeExhibitId, bookPageIndex, onTurnBookPage])

  const handlePrevMainHistoryPage = useCallback(() => {
    if (bookPageIndex > 0) {
      setBookPageIndex(bookPageIndex - 1)
      onTurnBookPage?.()
    }
  }, [bookPageIndex, onTurnBookPage])

  const exhibitData: ExhibitData | null = useMemo(() => {
    return activeExhibitId ? (EXHIBIT_DATA[activeExhibitId] ?? null) : null
  }, [activeExhibitId])

  const isAnyModalOpen = Boolean(activeExhibitId || activeBook)

  return (
    <>
      {/* 1. HEADER */}
      <MuseumHeader
        isFullscreen={isFullscreen}
        isMuted={isMuted}
        onResetCamera={onResetCamera}
        onToggleSound={toggleSound}
        onToggleSettings={() => setShowSettings((prev) => !prev)}
        onOpenHelp={() => setShowHelp(true)}
        onToggleFullscreen={toggleFullscreen}
        onToggleSidebar={() => setShowSidebar((s) => !s)}
      />

      {/* Floating Sidebar Toggle Button on the Left */}
      {isStarted && !showSidebar && (
        <button
          className="museum-floating-sidebar-toggle"
          onClick={() => setShowSidebar(true)}
          title="Buka Navigasi Pameran & Rak Buku"
        >
          <span className="toggle-icon">📚</span>
          <span className="toggle-label">BUKU & PAMERAN</span>
        </button>
      )}

      {/* IN-ROOM SIDEBAR NAVIGATOR */}
      <MuseumSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onFocusExhibit={onFocusExhibit}
        onFocusBookshelf={onFocusBookshelf}
        onOpenBook={onOpenBook}
      />

      {/* 2. CROSSHAIR */}
      {isStarted && !isAnyModalOpen && !showHelp && !isTouchDevice && (
        <MuseumCrosshair isHovering={Boolean(hoveredTarget)} />
      )}

      {/* 3. INTERACTION PROMPT */}
      {isStarted && !isAnyModalOpen && !isTouchDevice && hoveredTarget && (
        <InteractionPrompt name={hoveredTarget.name} />
      )}

      {/* 4. CONTROLS GUIDE */}
      {isStarted && !isAnyModalOpen && !isTouchDevice && (
        <ControlsGuide />
      )}

      {/* 5. MOBILE TOUCH CONTROLS */}
      {isStarted && !isAnyModalOpen && isTouchDevice && (
        <>
          <SwipeLookZone onLook={onTouchLook} />
          <VirtualJoystick onMove={onJoystickMove} />
          {hoveredTarget && (
            <div className="museum-mobile-interaction">
              <div className="mobile-target-name">{hoveredTarget.name}</div>
              <button className="museum-mobile-action-btn" onClick={onInteractButton}>
                {hoveredTarget.bookData ? 'BACA BUKU 📖' : 'LIHAT KOLEKSI 🔍'}
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

      {/* 8. INTERACTIVE BOOK READER MODAL (For Bookshelf Books) */}
      {activeBook && (
        <BookReaderModal
          book={activeBook}
          onClose={onCloseModal}
          onTurnPage={onTurnBookPage}
        />
      )}

      {/* 9. MAIN HISTORY BOOK MODAL (For History Lectern) */}
      {activeExhibitId === 'history' && exhibitData?.bookPages && (
        <MainHistoryBookModal
          exhibitData={exhibitData}
          pageIndex={bookPageIndex}
          onClose={onCloseModal}
          onPrevPage={handlePrevMainHistoryPage}
          onNextPage={handleNextMainHistoryPage}
        />
      )}

      {/* 10. GENERAL PHYSICAL COLLECTION MODAL (13 Directors, 5 Founders, Photos, Miniature) */}
      {activeExhibitId && activeExhibitId !== 'history' && exhibitData && (
        <CollectionModal
          exhibitData={exhibitData}
          subItemIndex={selectedSubItemIndex}
          zoomStep={zoomStep}
          onClose={onCloseModal}
          onSelectSubItem={setSelectedSubItemIndex}
          onSetZoom={setZoomStep}
        />
      )}

      {/* 11. HELP MODAL */}
      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}
    </>
  )
})
