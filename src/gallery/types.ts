import type { RefObject } from 'react'

export interface Portrait {
  id: string
  name: string
  /** Year of office / relevant years, e.g. "1945–1967". */
  years: string
  /** Optional local image path. Falls back to a generated placeholder when missing. */
  imagePath?: string
}

export interface PortraitFrameProps {
  portrait: Portrait
  position: [number, number, number]
  rotationY: number
  isSelected: boolean
  isHovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

export interface PortraitLabelProps {
  portrait: Portrait
}

export interface GalleryWallsProps {
  portraits: Portrait[]
  selectedId: string | null
  hoveredId: string | null
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

export interface GalleryLightingProps {
  castShadows: boolean
}

export interface FirstPersonControlsProps {
  resetSignal: number
  moveInputRef: RefObject<number>
  hoveredRef: RefObject<string | null>
  panelOpenRef: RefObject<boolean>
  draggedRef: RefObject<boolean>
}

export interface MobileControlsProps {
  moveInputRef: RefObject<number>
  visible: boolean
  onReset: () => void
  onBack?: () => void
}

export interface PortraitInformationPanelProps {
  portrait: Portrait | null
  index: number
  total: number
  onClose: () => void
}
