import * as THREE from 'three'
import type { Portrait } from './types'

function makeCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return [canvas, canvas.getContext('2d') as CanvasRenderingContext2D]
}

function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  weight: string,
  style: string,
  maxWidth: number,
  startSize: number,
  minSize: number,
): number {
  let size = startSize
  while (size > minSize) {
    ctx.font = `${style} ${weight} ${size}px ${family}`
    if (ctx.measureText(text).width <= maxWidth) break
    size -= 2
  }
  ctx.font = `${style} ${weight} ${size}px ${family}`
  return size
}

function hash(text: string): number {
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Polished dark walnut floor planks. */
export function createFloorTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(1024, 1024)
  ctx.fillStyle = '#2a1f14'
  ctx.fillRect(0, 0, 1024, 1024)

  const planks = 8
  const width = 1024 / planks
  for (let i = 0; i < planks; i++) {
    const x = i * width
    ctx.fillStyle = `hsl(${26 + ((i * 5) % 10)}, ${32 + (i % 3) * 5}%, ${19 + (i % 4) * 3}%)`
    ctx.fillRect(x, 0, width, 1024)

    // Wood grain
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.14)'
    for (let g = 0; g < 22; g++) {
      ctx.lineWidth = 1 + Math.random() * 1.5
      ctx.beginPath()
      const gx = x + Math.random() * width
      ctx.moveTo(gx, 0)
      for (let y = 0; y <= 1024; y += 64) {
        ctx.lineTo(gx + Math.sin((y + g * 40) / 120) * 6, y)
      }
      ctx.stroke()
    }

    // Plank seams
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
    ctx.fillRect(x, 0, 2, 1024)

    // Board joints (staggered)
    const offset = (i * 173) % 512
    for (let y = offset; y < 1024; y += 512) ctx.fillRect(x, y, width, 2)
  }

  // Subtle sheen
  const sheen = ctx.createRadialGradient(400, 350, 60, 512, 512, 760)
  sheen.addColorStop(0, 'rgba(255, 236, 205, 0.07)')
  sheen.addColorStop(1, 'rgba(255, 236, 205, 0)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, 1024, 1024)

  return toTexture(canvas)
}

/** Ivory museum label with name, years, and position. */
export function createLabelTexture(portrait: Portrait): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(640, 220)

  ctx.fillStyle = '#efe6d5'
  ctx.fillRect(0, 0, 640, 220)

  ctx.strokeStyle = '#a9803f'
  ctx.lineWidth = 5
  ctx.strokeRect(10, 10, 620, 200)
  ctx.strokeStyle = 'rgba(70, 50, 25, 0.35)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(20, 20, 600, 180)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  ctx.fillStyle = '#2a2018'
  fitFont(ctx, portrait.name, 'Georgia, serif', 'bold', 'normal', 560, 52, 30)
  ctx.fillText(portrait.name, 320, 95)

  ctx.fillStyle = '#7c5c2c'
  fitFont(ctx, portrait.years, 'Georgia, serif', 'normal', 'italic', 560, 34, 22)
  ctx.fillText(portrait.years, 320, 158)

  return toTexture(canvas)
}

/** Draws the generated sepia portrait placeholder onto a canvas. */
export function createPortraitCanvas(portrait: Portrait): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas(512, 640)
  const seed = hash(portrait.id)
  const hue = 24 + (seed % 16)

  const bg = ctx.createLinearGradient(0, 0, 0, 640)
  bg.addColorStop(0, `hsl(${hue}, 34%, 52%)`)
  bg.addColorStop(1, `hsl(${hue + 8}, 38%, 30%)`)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 512, 640)

  // Silhouette: shoulders and head
  ctx.fillStyle = 'rgba(38, 24, 13, 0.55)'
  ctx.beginPath()
  ctx.ellipse(256, 660, 178, 150, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(256, 318, 88, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillRect(226, 380, 60, 60)

  // Vignette
  const vignette = ctx.createRadialGradient(256, 300, 120, 256, 320, 430)
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.38)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, 512, 640)

  return canvas
}

/** Generated sepia portrait placeholder with a silhouette. */
export function createPortraitTexture(portrait: Portrait): THREE.CanvasTexture {
  return toTexture(createPortraitCanvas(portrait))
}

/** Same placeholder as a data URL, for use in the HTML information panel. */
export function createPortraitDataURL(portrait: Portrait): string {
  return createPortraitCanvas(portrait).toDataURL('image/jpeg', 0.85)
}

/** End-of-corridor plaque with the museum title. */
export function createTitleTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(1024, 640)

  ctx.fillStyle = '#211a13'
  ctx.fillRect(0, 0, 1024, 640)

  ctx.strokeStyle = '#c9a25f'
  ctx.lineWidth = 6
  ctx.strokeRect(28, 28, 968, 584)
  ctx.strokeStyle = 'rgba(201, 162, 95, 0.45)'
  ctx.lineWidth = 2
  ctx.strokeRect(46, 46, 932, 548)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#ecd9b0'
  fitFont(ctx, 'MUSEUM VIRTUAL UNDIP', 'Georgia, serif', 'bold', 'normal', 880, 84, 44)
  ctx.fillText('MUSEUM VIRTUAL UNDIP', 512, 300)

  ctx.fillStyle = '#c9a25f'
  fitFont(ctx, 'Galeri Tokoh & Warisan', 'Georgia, serif', 'normal', 'italic', 780, 44, 26)
  ctx.fillText('Galeri Tokoh & Warisan', 512, 382)

  return toTexture(canvas)
}
