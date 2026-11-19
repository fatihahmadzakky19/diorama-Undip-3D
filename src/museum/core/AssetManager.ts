import * as THREE from 'three'

interface CanvasHelper {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

function createHelper(width: number, height: number): CanvasHelper {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  return { canvas, ctx }
}

function canvasToTexture(canvas: HTMLCanvasElement, repeatX = 1, repeatY = 1): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(repeatX, repeatY)
  texture.anisotropy = 8
  return texture
}

export class AssetManager {
  private static instance: AssetManager
  private textureCache = new Map<string, THREE.CanvasTexture>()
  private dataUrlCache = new Map<string, string>()
  private canvasCache = new Map<string, HTMLCanvasElement>()

  public static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager()
    }
    return AssetManager.instance
  }

  // ==========================================
  // 1. FLOOR: Natural Heritage Parquet Hardwood
  // Palette: Dark Chocolate / Warm Walnut Wood (Matte Satin)
  // ==========================================
  public getFloorTexture(): THREE.CanvasTexture {
    if (this.textureCache.has('floor')) return this.textureCache.get('floor')!

    const { canvas, ctx } = createHelper(1024, 1024)
    // Dark walnut under-base
    ctx.fillStyle = '#2d1c12'
    ctx.fillRect(0, 0, 1024, 1024)

    const plankCount = 10
    const plankWidth = 1024 / plankCount

    for (let i = 0; i < plankCount; i++) {
      const x = i * plankWidth
      // Irregular, low-contrast walnut tones avoid an obviously repeating pattern
      const hue = 25 + ((i * 5) % 7)
      const sat = 26 + (i % 4) * 2
      const light = 28 + (i % 5)
      ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`
      ctx.fillRect(x, 0, plankWidth, 1024)

      // Fine, uneven natural grain
      ctx.strokeStyle = 'rgba(12, 7, 4, 0.10)'
      for (let g = 0; g < 16; g++) {
        ctx.lineWidth = 0.5 + ((g + i) % 3) * 0.35
        ctx.beginPath()
        const gx = x + ((g + 0.5) / 16) * plankWidth
        ctx.moveTo(gx, 0)
        for (let y = 0; y <= 1024; y += 48) {
          ctx.lineTo(gx + Math.sin((y + g * 37 + i * 19) / 130) * 3.2, y)
        }
        ctx.stroke()
      }

      // Soft plank seam
      ctx.fillStyle = 'rgba(9, 5, 3, 0.38)'
      ctx.fillRect(x, 0, 1.2, 1024)

      // Staggered end joints, offset per plank
      const jointOffset = ((i * 7) % 10) * 100
      ctx.fillRect(x, jointOffset, plankWidth, 1.2)
      ctx.fillRect(x, (jointOffset + 620) % 1024, plankWidth, 1.2)
    }

    // Sparse, subtle patina speckles break up flat repetition
    ctx.fillStyle = 'rgba(214, 186, 145, 0.025)'
    for (let i = 0; i < 900; i++) {
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2)
    }

    const texture = canvasToTexture(canvas, 2, 2)
    this.textureCache.set('floor', texture)
    return texture
  }

  // ==========================================
  // 2. WALL: Minimalist Heritage Museum Wall (Warm White & Dark Walnut)
  // Palette: Strictly Black, White, and Brown
  // ==========================================
  public getWallTexture(): THREE.CanvasTexture {
    if (this.textureCache.has('wall')) return this.textureCache.get('wall')!

    const { canvas, ctx } = createHelper(1024, 1024)

    // Upper ~76%: Elegant museum warm-white plaster — this is the exhibition field.
    // Chair rail sits at about 1.15 m so every frame hangs on the light plaster.
    const upperGrad = ctx.createLinearGradient(0, 0, 0, 770)
    upperGrad.addColorStop(0, '#f9f5ed')
    upperGrad.addColorStop(0.6, '#f1eae0')
    upperGrad.addColorStop(1, '#e8e0d4')
    ctx.fillStyle = upperGrad
    ctx.fillRect(0, 0, 1024, 770)

    // Subtle classical picture molding line near the top
    ctx.fillStyle = 'rgba(50, 32, 20, 0.14)'
    ctx.fillRect(0, 70, 1024, 3)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
    ctx.fillRect(0, 73, 1024, 1.5)

    // Restrained boiserie outlines on the plaster
    const upperPanelWidth = 512
    for (let p = 0; p < 2; p++) {
      const px = p * upperPanelWidth + 24
      const pwInner = upperPanelWidth - 48
      ctx.strokeStyle = 'rgba(70, 50, 36, 0.1)'
      ctx.lineWidth = 2
      ctx.strokeRect(px, 100, pwInner, 620)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
      ctx.lineWidth = 1
      ctx.strokeRect(px + 1, 101, pwInner - 2, 618)
    }

    // Chair rail / dado molding — low, proportional walnut band
    const molding = ctx.createLinearGradient(0, 765, 0, 805)
    molding.addColorStop(0, '#1a0f08')
    molding.addColorStop(0.3, '#382215')
    molding.addColorStop(0.7, '#24150d')
    molding.addColorStop(1, '#140a05')
    ctx.fillStyle = molding
    ctx.fillRect(0, 765, 1024, 40)

    // Lower ~22%: dark walnut wainscot panels
    ctx.fillStyle = '#24150d'
    ctx.fillRect(0, 805, 1024, 219)

    const panelCount = 4
    const pw = 1024 / panelCount
    for (let p = 0; p < panelCount; p++) {
      const px = p * pw + 16
      const py = 820
      const pwInner = pw - 32
      const phInner = 158

      ctx.fillStyle = '#140a05'
      ctx.fillRect(px, py, pwInner, phInner)

      const woodGrad = ctx.createLinearGradient(px, py, px, py + phInner)
      woodGrad.addColorStop(0, '#352014')
      woodGrad.addColorStop(0.5, '#2a180e')
      woodGrad.addColorStop(1, '#20120a')
      ctx.fillStyle = woodGrad
      ctx.fillRect(px + 8, py + 8, pwInner - 16, phInner - 16)

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)'
      ctx.lineWidth = 1.5
      ctx.strokeRect(px + 12, py + 12, pwInner - 24, phInner - 24)
    }

    // Deep walnut baseboard
    const baseboard = ctx.createLinearGradient(0, 985, 0, 1024)
    baseboard.addColorStop(0, '#2a180e')
    baseboard.addColorStop(1, '#120904')
    ctx.fillStyle = baseboard
    ctx.fillRect(0, 985, 1024, 39)

    const texture = canvasToTexture(canvas, 3, 1)
    this.textureCache.set('wall', texture)
    return texture
  }

  // ==========================================
  // 3. CEILING: Clean Heritage Coffered Ceiling
  // Palette: Soft Off-White & Slim Dark Walnut Ribs
  // ==========================================
  public getCeilingTexture(): THREE.CanvasTexture {
    if (this.textureCache.has('ceiling')) return this.textureCache.get('ceiling')!

    const { canvas, ctx } = createHelper(1024, 1024)
    ctx.fillStyle = '#24150d'
    ctx.fillRect(0, 0, 1024, 1024)

    const gridSize = 3
    const cellSize = 1024 / gridSize

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const x = c * cellSize
        const y = r * cellSize

        // Shallow inset — deliberately low contrast
        ctx.fillStyle = '#1c110a'
        ctx.fillRect(x + 6, y + 6, cellSize - 12, cellSize - 12)

        // Warm ivory coffer field
        const innerGrad = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize)
        innerGrad.addColorStop(0, '#eee8dd')
        innerGrad.addColorStop(0.55, '#e8e0d2')
        innerGrad.addColorStop(1, '#ded5c6')
        ctx.fillStyle = innerGrad
        ctx.fillRect(x + 12, y + 12, cellSize - 24, cellSize - 24)

        // Single delicate contour
        ctx.strokeStyle = 'rgba(50, 32, 18, 0.12)'
        ctx.lineWidth = 1
        ctx.strokeRect(x + 20, y + 20, cellSize - 40, cellSize - 40)
      }
    }

    // Slim walnut ribs — classical but never heavy
    ctx.fillStyle = '#2e1d13'
    for (let i = 0; i <= gridSize; i++) {
      ctx.fillRect(i * cellSize - 3, 0, 6, 1024)
      ctx.fillRect(0, i * cellSize - 3, 1024, 6)
    }

    const texture = canvasToTexture(canvas, 2, 2)
    this.textureCache.set('ceiling', texture)
    return texture
  }

  // ==========================================
  // 4. PERSIAN RUG (Center Room)
  // ==========================================
  public getRugTexture(): THREE.CanvasTexture {
    if (this.textureCache.has('rug')) return this.textureCache.get('rug')!

    const { canvas, ctx } = createHelper(1024, 1024)

    // Rich burgundy / crimson field
    ctx.fillStyle = '#5c1a22'
    ctx.fillRect(0, 0, 1024, 1024)

    // Outer Navy Border
    ctx.strokeStyle = '#1b263e'
    ctx.lineWidth = 55
    ctx.strokeRect(30, 30, 964, 964)

    // Antique Gold Inner Border
    ctx.strokeStyle = '#dcb267'
    ctx.lineWidth = 15
    ctx.strokeRect(65, 65, 894, 894)

    // Muted Olive Secondary Guard
    ctx.strokeStyle = '#485539'
    ctx.lineWidth = 18
    ctx.strokeRect(82, 82, 860, 860)

    // Central Medallion
    ctx.fillStyle = '#22304d'
    ctx.beginPath()
    ctx.ellipse(512, 512, 220, 170, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#e2be72'
    ctx.lineWidth = 9
    ctx.stroke()

    // Inner medallion floral star
    ctx.fillStyle = '#dfba70'
    ctx.beginPath()
    for (let a = 0; a < 16; a++) {
      const angle = (a * Math.PI) / 8
      const r = a % 2 === 0 ? 110 : 50
      const x = 512 + Math.cos(angle) * r
      const y = 512 + Math.sin(angle) * r
      if (a === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()

    // Corner arabesques
    const corners = [
      [100, 100],
      [924, 100],
      [100, 924],
      [924, 924],
    ]
    ctx.fillStyle = '#dfba70'
    corners.forEach(([cx, cy]) => {
      ctx.beginPath()
      ctx.arc(cx, cy, 95, 0, Math.PI * 2)
      ctx.fill()
    })

    // Fringe on top and bottom edges
    ctx.fillStyle = '#eadeca'
    for (let f = 20; f < 1004; f += 8) {
      ctx.fillRect(f, 0, 4, 18)
      ctx.fillRect(f, 1006, 4, 18)
    }

    const texture = canvasToTexture(canvas, 1, 1)
    this.textureCache.set('rug', texture)
    return texture
  }

  // ==========================================
  // 5. HERITAGE PLAQUE TEXTURE (DARK BRONZE / WALNUT & IVORY)
  // Palette: Strictly Black, White, and Brown
  // ==========================================
  public createBrassPlaque(title: string, subtitle?: string): THREE.CanvasTexture {
    const key = `plaque_${title}_${subtitle || ''}`
    if (this.textureCache.has(key)) return this.textureCache.get(key)!

    const { canvas, ctx } = createHelper(768, 256)

    // Deep Dark Bronze / Charcoal Walnut Base
    const bronze = ctx.createLinearGradient(0, 0, 768, 256)
    bronze.addColorStop(0, '#1c1510')
    bronze.addColorStop(0.5, '#281e17')
    bronze.addColorStop(1, '#18120d')
    ctx.fillStyle = bronze
    ctx.fillRect(0, 0, 768, 256)

    // Subtle corner screws
    const screws = [
      [24, 24],
      [744, 24],
      [24, 232],
      [744, 232],
    ]
    screws.forEach(([sx, sy]) => {
      ctx.fillStyle = '#423328'
      ctx.beginPath()
      ctx.arc(sx, sy, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#120d09'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(sx - 4, sy)
      ctx.lineTo(sx + 4, sy)
      ctx.stroke()
    })

    // Engraved Double Border in subtle warm bronze line
    ctx.strokeStyle = '#443528'
    ctx.lineWidth = 3
    ctx.strokeRect(16, 16, 736, 224)
    ctx.strokeStyle = 'rgba(235, 220, 200, 0.3)'
    ctx.lineWidth = 1.2
    ctx.strokeRect(20, 20, 728, 216)

    // Engraved Title in Warm White / Ivory
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#f8f3ea'

    ctx.font = 'bold 32px "Cinzel", "Times New Roman", serif'
    ctx.fillText(title, 384, subtitle ? 104 : 128)

    if (subtitle) {
      ctx.font = 'italic 20px "EB Garamond", Georgia, serif'
      ctx.fillStyle = '#cfbeaa'
      ctx.fillText(subtitle, 384, 162)
    }

    const texture = canvasToTexture(canvas)
    this.textureCache.set(key, texture)
    return texture
  }

  /**
   * Compact, legible exhibit label for museum walls.
   * Uses a short canvas with generous type so text stays readable in 3D.
   */
  public createExhibitLabel(title: string, subtitle?: string): THREE.CanvasTexture {
    const key = `label_${title}_${subtitle || ''}`
    if (this.textureCache.has(key)) return this.textureCache.get(key)!

    const { canvas, ctx } = createHelper(640, 192)
    const bg = ctx.createLinearGradient(0, 0, 640, 192)
    bg.addColorStop(0, '#1d1510')
    bg.addColorStop(0.5, '#2a1e16')
    bg.addColorStop(1, '#17100b')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, 640, 192)

    ctx.strokeStyle = 'rgba(232, 220, 200, 0.34)'
    ctx.lineWidth = 2
    ctx.strokeRect(10, 10, 620, 172)

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#f8f3ea'
    const titleSize = title.length > 42 ? 40 : title.length > 28 ? 48 : 56
    ctx.font = `600 ${titleSize}px "Cinzel", "Times New Roman", serif`
    ctx.fillText(title, 320, subtitle ? 76 : 96, 592)

    if (subtitle) {
      ctx.fillStyle = '#cfc0a9'
      ctx.font = 'italic 30px "EB Garamond", Georgia, serif'
      ctx.fillText(subtitle, 320, 140, 592)
    }

    const texture = canvasToTexture(canvas)
    this.textureCache.set(key, texture)
    return texture
  }

  // ==========================================
  // 6. HISTORICAL PORTRAITS (13 FOUNDERS) & PHOTOS
  // ==========================================
  public getImageCanvas(imageKey: string): HTMLCanvasElement {
    if (this.canvasCache.has(imageKey)) return this.canvasCache.get(imageKey)!
    const canvas = this.generateImageCanvas(imageKey)
    this.canvasCache.set(imageKey, canvas)
    return canvas
  }

  public getImageTexture(imageKey: string): THREE.CanvasTexture {
    if (this.textureCache.has(imageKey)) return this.textureCache.get(imageKey)!
    const canvas = this.getImageCanvas(imageKey)
    const texture = canvasToTexture(canvas)
    this.textureCache.set(imageKey, texture)
    return texture
  }

  public getImageDataUrl(imageKey: string): string {
    if (this.dataUrlCache.has(imageKey)) return this.dataUrlCache.get(imageKey)!
    const canvas = this.getImageCanvas(imageKey)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88)
    this.dataUrlCache.set(imageKey, dataUrl)
    return dataUrl
  }

  private generateImageCanvas(key: string): HTMLCanvasElement {
    const isPortrait = key.startsWith('founder') || key.startsWith('rector') || key === 'history_soekarno'
    const w = isPortrait ? 512 : 640
    const h = isPortrait ? 680 : 480
    const { canvas, ctx } = createHelper(w, h)

    // Luminous Warm Sepia Vignette Background
    const bg = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, Math.max(w, h) / 1.25)
    bg.addColorStop(0, '#f2e7cd')
    bg.addColorStop(0.65, '#ceb58c')
    bg.addColorStop(1, '#664a2b')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    // Weathered paper fibers
    ctx.fillStyle = 'rgba(60, 40, 20, 0.04)'
    for (let i = 0; i < 2000; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5)
    }

    // SUKSESI TOKOH REKTORAT DARI MASA KE MASA (1957 — KINI)
    const rectorsMap: Record<
      string,
      { name: string; years: string; role: string; peci: boolean; glasses: boolean }
    > = {
      rector_imam_bardjo: { name: '1. Prof. Mr. Imam Bardjo', years: '1957–1961', role: 'Presiden Univ. I', peci: true, glasses: false },
      rector_soedarto: { name: '2. Prof. Mr. Soedarto, S.H.', years: '1961–62 & 1977–86', role: 'Rektor Undip Ke-2', peci: false, glasses: true },
      rector_jakub_rais: { name: '3. Prof. Dr. Ir. Jakub Rais', years: '1965–1966', role: 'Caretaker Rektor', peci: false, glasses: true },
      rector_moeljono_sostro: { name: '4. Drs. Moeljono Sostrohadikoesoemo', years: '1966–1973', role: 'Rektor Undip Ke-4', peci: false, glasses: false },
      rector_soenarjo: { name: '5. Prof. Dr. Soenarjo, S.H.', years: '1973–1977', role: 'Rektor Undip Ke-5', peci: false, glasses: false },
      rector_muladi: { name: '6. Prof. Dr. H. Muladi, S.H.', years: '1986–1994', role: 'Rektor Undip Ke-6', peci: false, glasses: true },
      rector_eko_budihardjo: { name: '7. Prof. Ir. Eko Budihardjo, M.Sc.', years: '1994–1998', role: 'Rektor Undip Ke-7', peci: false, glasses: true },
      rector_temijo: { name: '8. Prof. Dr. Temijo, S.H.', years: '1998–2006', role: 'Rektor Undip Ke-8', peci: false, glasses: false },
      rector_susilo_wibowo: { name: '9. Prof. Dr. dr. H. Susilo Wibowo', years: '2006–2010', role: 'Rektor Undip Ke-9', peci: false, glasses: true },
      rector_sudharto_hadi: { name: '10. Prof. Ir. Sudharto P. Hadi', years: '2010–2015', role: 'Rektor Undip Ke-10', peci: false, glasses: true },
      rector_yos_johan: { name: '11. Prof. Dr. Yos Johan Utama', years: '2015–2024', role: 'Rektor Undip Ke-11', peci: true, glasses: true },
      rector_suharnomo: { name: '12. Prof. Dr. Suharnomo, S.E.', years: '2024–2029', role: 'Rektor Undip Ke-12 (Kini)', peci: true, glasses: true },
    }

    // 13 FOUNDERS DATA MAPPING (Berdasarkan Akta Notaris No. 59 Th. 1956 - undip.ac.id/sejarah-2)
    const foundersMap: Record<
      string,
      { name: string; years: string; role: string; peci: boolean; glasses: boolean; female?: boolean }
    > = {
      founder_soedarto: { name: '1. Mr. Sudarto', years: '1923–1986', role: 'Ketua Yayasan', peci: false, glasses: true },
      founder_danuwidjojo: { name: '2. Mr. Dan Soelaiman', years: '1910–1978', role: 'Wakil Ketua Yayasan', peci: false, glasses: false },
      founder_goenawan: { name: '3. Mr. Soesanto Kartoatmodjo', years: '1912–1980', role: 'Panitera Yayasan', peci: true, glasses: false },
      founder_tan_tjiang_bie: { name: '4. Achmad Tjokrokoesoemo', years: '1908–1976', role: 'Bendahara Yayasan', peci: true, glasses: false },
      founder_imam_bardjo: { name: '5. Mr. Imam Bardjo', years: '1903–1969', role: 'Presiden Universitas I', peci: true, glasses: false },
      founder_soenardi: { name: '6. Mr. Goenawan Goetomo', years: '1914–1985', role: 'Anggota Pengurus', peci: false, glasses: true },
      founder_marjono: { name: '7. Mr. Tan Tjing Hak', years: '1911–1979', role: 'Anggota Pengurus', peci: false, glasses: true },
      founder_soemarman: { name: '8. Mr. Koo Swan Ik', years: '1915–1982', role: 'Anggota Pengurus', peci: false, glasses: false },
      founder_soerodjo: { name: '9. Hadi Soebeno Sosrowardoyo', years: '1912–1971', role: 'Ketua Dewan Kurator / Walikota', peci: true, glasses: false },
      founder_boentaran: { name: '10. Dr. Marzuki', years: '1907–1975', role: 'Dewan Kurator / Tokoh Medis', peci: false, glasses: true },
      founder_hurustiati: { name: '11. Dr. V. Soedjito', years: '1909–1980', role: 'Dewan Kurator / Dokter', peci: false, glasses: false },
      founder_soejono: { name: '12. Mr. Abdulmadjid Djojodhiningrat', years: '1906–1974', role: 'Dewan Kurator / Pakar Hukum', peci: true, glasses: true },
      founder_soeprapto: { name: '13. R.M. Soeprapto', years: '1905–1972', role: 'Notaris Akta Pendirian & Kurator', peci: true, glasses: true },
    }

    if (rectorsMap[key]) {
      const r = rectorsMap[key]
      this.drawArtisticFigure(ctx, w, h, r.name, r.years, r.role, r.peci, r.glasses)
    } else if (foundersMap[key]) {
      const f = foundersMap[key]
      this.drawArtisticFigure(ctx, w, h, f.name, f.years, f.role, f.peci, f.glasses, f.female)
    } else if (key === 'photo_campus_pleburan' || key === 'history_founding') {
      this.drawCampusFacade(ctx, w, h)
    } else if (
      key === 'photo_lecture_gris' ||
      key === 'photo_campus_gris' ||
      key === 'photo_historic_lecture' ||
      key === 'history_background'
    ) {
      this.drawLectureHall(ctx, w, h)
    } else if (key === 'photo_dies_soekarno' || key === 'history_soekarno') {
      this.drawHistoricCeremony(ctx, w, h)
    } else if (
      key === 'photo_lab_tech' ||
      key === 'photo_historic_lab' ||
      key === 'history_ptn'
    ) {
      this.drawLaboratory(ctx, w, h)
    } else if (key.startsWith('doc_') || key.startsWith('archive_')) {
      this.drawOfficialDocument(ctx, w, h, key)
    } else {
      this.drawGenericHeritage(ctx, w, h, key)
    }

    // Crisp rectangular gold museum inner and outer borders
    ctx.strokeStyle = 'rgba(255, 245, 215, 0.65)'
    ctx.lineWidth = 3
    ctx.strokeRect(12, 12, w - 24, h - 24)

    ctx.strokeStyle = '#c9a25f'
    ctx.lineWidth = 8
    ctx.strokeRect(4, 4, w - 8, h - 8)

    ctx.strokeStyle = '#2b1b0e'
    ctx.lineWidth = 4
    ctx.strokeRect(0, 0, w, h)

    return canvas
  }

  // Draw historical founder portraits with distinct facial/garment styling
  private drawArtisticFigure(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    _name: string,
    _years: string,
    _role: string,
    hasPeci: boolean,
    hasGlasses: boolean,
    isFemale?: boolean,
  ) {
    const cx = w / 2
    const cy = h / 2 - 20

    // Warm museum back-halo
    const halo = ctx.createRadialGradient(cx, cy, 30, cx, cy, 180)
    halo.addColorStop(0, 'rgba(255, 250, 230, 0.6)')
    halo.addColorStop(1, 'rgba(255, 245, 220, 0)')
    ctx.fillStyle = halo
    ctx.fillRect(0, 0, w, h)

    // Coat / Kebaya Shoulders
    ctx.fillStyle = isFemale ? '#452129' : '#27190f'
    ctx.beginPath()
    ctx.ellipse(cx, cy + 220, 160, 130, 0, 0, Math.PI * 2)
    ctx.fill()

    if (!isFemale) {
      // White Collar & Necktie
      ctx.fillStyle = '#ebe1ce'
      ctx.beginPath()
      ctx.moveTo(cx - 30, cy + 105)
      ctx.lineTo(cx, cy + 155)
      ctx.lineTo(cx + 30, cy + 105)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#170e08'
      ctx.beginPath()
      ctx.moveTo(cx - 12, cy + 120)
      ctx.lineTo(cx + 12, cy + 120)
      ctx.lineTo(cx + 18, cy + 210)
      ctx.lineTo(cx, cy + 225)
      ctx.lineTo(cx - 18, cy + 210)
      ctx.closePath()
      ctx.fill()
    } else {
      // Traditional Kebaya Shawl
      ctx.fillStyle = '#d4af37'
      ctx.fillRect(cx - 60, cy + 115, 120, 18)
    }

    // Neck & Head
    ctx.fillStyle = '#b79772'
    ctx.fillRect(cx - 26, cy + 70, 52, 50)

    ctx.fillStyle = '#d8bd99'
    ctx.beginPath()
    ctx.ellipse(cx, cy + 20, 68, 82, 0, 0, Math.PI * 2)
    ctx.fill()

    // Hair / Sanggal
    ctx.fillStyle = '#22140a'
    if (isFemale) {
      ctx.beginPath()
      ctx.arc(cx, cy - 35, 76, Math.PI, 0)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(cx, cy - 65, 45, 30, 0, 0, Math.PI * 2) // Sanggul konde
      ctx.fill()
    } else {
      ctx.beginPath()
      ctx.ellipse(cx, cy - 25, 72, 45, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    // Peci (National Cap)
    if (hasPeci && !isFemale) {
      ctx.fillStyle = '#110a05'
      ctx.beginPath()
      ctx.moveTo(cx - 72, cy - 10)
      ctx.lineTo(cx - 62, cy - 68)
      ctx.lineTo(cx + 62, cy - 68)
      ctx.lineTo(cx + 72, cy - 10)
      ctx.closePath()
      ctx.fill()
    }

    // Glasses
    if (hasGlasses) {
      ctx.strokeStyle = '#dfba72'
      ctx.lineWidth = 3
      ctx.strokeRect(cx - 52, cy + 5, 42, 28)
      ctx.strokeRect(cx + 10, cy + 5, 42, 28)
      ctx.beginPath()
      ctx.moveTo(cx - 10, cy + 18)
      ctx.lineTo(cx + 10, cy + 18)
      ctx.stroke()
    }

    // Facial Features
    ctx.fillStyle = 'rgba(50, 30, 15, 0.5)'
    // Eyebrows
    ctx.fillRect(cx - 48, cy - 2, 32, 5)
    ctx.fillRect(cx + 16, cy - 2, 32, 5)
    // Eyes
    ctx.beginPath()
    ctx.arc(cx - 32, cy + 14, 5, 0, Math.PI * 2)
    ctx.arc(cx + 32, cy + 14, 5, 0, Math.PI * 2)
    ctx.fill()
    // Nose
    ctx.beginPath()
    ctx.moveTo(cx, cy + 18)
    ctx.lineTo(cx - 6, cy + 42)
    ctx.lineTo(cx + 6, cy + 42)
    ctx.fill()
    // Mouth
    ctx.fillRect(cx - 24, cy + 62, 48, 5)

    // Note: Clean photo frame without text burned inside (per user instruction)
  }

  private drawCampusFacade(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const sky = ctx.createLinearGradient(0, 0, 0, 300)
    sky.addColorStop(0, '#d8c7a3')
    sky.addColorStop(1, '#f0e6ce')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, w, 280)

    ctx.fillStyle = '#5c4b35'
    for (let t = 0; t < 12; t++) {
      ctx.beginPath()
      ctx.arc(t * 60 + 30, 180 + Math.sin(t) * 15, 45, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = '#f6f0e4'
    ctx.fillRect(80, 170, w - 160, 150)

    ctx.fillStyle = '#7a462d'
    ctx.beginPath()
    ctx.moveTo(w / 2 - 110, 170)
    ctx.lineTo(w / 2, 90)
    ctx.lineTo(w / 2 + 110, 170)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#dfd2c0'
    for (let c = 0; c < 6; c++) {
      const px = w / 2 - 90 + c * 36
      ctx.fillRect(px, 170, 14, 150)
    }

    ctx.fillStyle = '#22160d'
    ctx.fillRect(110, 200, 35, 60)
    ctx.fillRect(170, 200, 35, 60)
    ctx.fillRect(w - 205, 200, 35, 60)
    ctx.fillRect(w - 145, 200, 35, 60)

    ctx.fillStyle = '#9e8971'
    ctx.fillRect(0, 320, w, h - 320)

  }

  private drawLectureHall(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.fillStyle = '#4c3828'
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = '#202a1e'
    ctx.fillRect(140, 60, w - 280, 140)
    ctx.strokeStyle = '#7b5735'
    ctx.lineWidth = 8
    ctx.strokeRect(140, 60, w - 280, 140)

    ctx.fillStyle = 'rgba(240, 240, 230, 0.75)'
    ctx.font = '16px "EB Garamond", serif'
    ctx.fillText('UNIVERSITAS SEMARANG — 1957', 160, 100)
    ctx.fillText('Fakultas Hukum & Masyarakat', 160, 130)
    ctx.fillText('Kuliah Perdana: Dasar Hukum Positif', 160, 160)

    ctx.fillStyle = '#1c120a'
    ctx.fillRect(w / 2 - 35, 170, 70, 90)
    ctx.beginPath()
    ctx.arc(w / 2, 150, 22, 0, Math.PI * 2)
    ctx.fill()

    for (let row = 0; row < 3; row++) {
      const y = 280 + row * 45
      ctx.fillStyle = `hsl(28, 25%, ${22 - row * 3}%)`
      ctx.fillRect(40, y, w - 80, 24)
      for (let s = 0; s < 7; s++) {
        const sx = 70 + s * 75
        ctx.fillStyle = '#160e07'
        ctx.beginPath()
        ctx.arc(sx, y - 8, 12, 0, Math.PI * 2)
        ctx.fill()
      }
    }

  }

  private drawHistoricCeremony(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.fillStyle = '#3c291b'
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = '#9b262f'
    ctx.fillRect(60, 40, w - 120, 35)
    ctx.fillStyle = '#f0e8d7'
    ctx.fillRect(60, 75, w - 120, 35)

    ctx.fillStyle = '#5c3d24'
    ctx.fillRect(w / 2 - 50, 180, 100, 120)

    ctx.strokeStyle = '#dcb267'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(w / 2 - 20, 180)
    ctx.lineTo(w / 2 - 15, 140)
    ctx.moveTo(w / 2 + 20, 180)
    ctx.lineTo(w / 2 + 15, 140)
    ctx.stroke()

    ctx.fillStyle = '#100a06'
    ctx.fillRect(w / 2 - 22, 85, 44, 25)
    ctx.fillStyle = '#c7ab86'
    ctx.beginPath()
    ctx.arc(w / 2, 125, 20, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#f4ede0'
    ctx.fillRect(w / 2 - 40, 145, 80, 60)

    for (let p = 0; p < 18; p++) {
      ctx.fillStyle = '#1c1108'
      ctx.beginPath()
      ctx.arc(p * 36 + 20, 320 + Math.sin(p) * 10, 14, 0, Math.PI * 2)
      ctx.fill()
    }

  }

  private drawLaboratory(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.fillStyle = '#3c2e22'
    ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = '#5c442f'
    ctx.fillRect(40, 220, w - 80, 70)

    ctx.strokeStyle = '#dcb267'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(w / 2, 130)
    ctx.lineTo(w / 2 - 50, 220)
    ctx.moveTo(w / 2, 130)
    ctx.lineTo(w / 2 + 50, 220)
    ctx.moveTo(w / 2, 130)
    ctx.lineTo(w / 2, 220)
    ctx.stroke()

    ctx.fillStyle = '#222'
    ctx.fillRect(w / 2 - 22, 110, 44, 25)

  }

  private drawOfficialDocument(ctx: CanvasRenderingContext2D, w: number, h: number, key: string) {
    ctx.fillStyle = '#f4ebd8'
    ctx.fillRect(40, 30, w - 80, h - 60)

    ctx.strokeStyle = '#8c6632'
    ctx.lineWidth = 3
    ctx.strokeRect(55, 45, w - 110, h - 90)

    ctx.fillStyle = '#a6242a'
    ctx.beginPath()
    ctx.arc(w - 110, h - 100, 36, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#dfba72'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(w - 110, h - 100, 30, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = '#221509'
    ctx.font = 'bold 20px "Cinzel", "Times New Roman", serif'
    ctx.textAlign = 'center'

    if (key.includes('presidential') || key.includes('226')) {
      ctx.fillText('KEPUTUSAN PRESIDEN REPUBLIK INDONESIA', w / 2, 85)
      ctx.font = '14px "EB Garamond", serif'
      ctx.fillText('NOMOR 226 TAHUN 1960', w / 2, 112)
      ctx.fillText('PENEGERIAN UNIVERSITAS DIPONEGORO', w / 2, 134)
    } else {
      ctx.fillText('AKTA NOTARIS R.M. SOEPRAPTO', w / 2, 85)
      ctx.font = '14px "EB Garamond", serif'
      ctx.fillText('NO. 59 TANGGAL 9 JANUARI 1957', w / 2, 112)
      ctx.fillText('JAJASAN UNIVERSITAS SEMARANG', w / 2, 134)
    }

    ctx.fillStyle = 'rgba(40, 26, 14, 0.75)'
    for (let line = 0; line < 10; line++) {
      const ly = 170 + line * 22
      if (ly < h - 140) {
        ctx.fillRect(80, ly, w - 160 - (line % 3 === 0 ? 60 : 0), 3)
      }
    }
  }

  private drawGenericHeritage(ctx: CanvasRenderingContext2D, w: number, h: number, title: string) {
    ctx.fillStyle = '#3c2819'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = '#dfba72'
    ctx.lineWidth = 4
    ctx.strokeRect(20, 20, w - 40, h - 40)

    ctx.textAlign = 'center'
    ctx.fillStyle = '#f8f1e2'
    ctx.font = 'bold 24px "Cinzel", serif'
    ctx.fillText('WARISAN SEJARAH UNDIP', w / 2, h / 2 - 10)
    ctx.font = '16px "EB Garamond", serif'
    ctx.fillStyle = '#dfba72'
    ctx.fillText(title, w / 2, h / 2 + 25)
  }

  // ==========================================
  // AREA 1 WALL HERITAGE DEDICATION PANEL
  // ==========================================
  public getArea1WallPanelTexture(): THREE.CanvasTexture {
    if (this.textureCache.has('area1_wall_panel')) return this.textureCache.get('area1_wall_panel')!

    const { canvas, ctx } = createHelper(2048, 1024)

    // Deep Dark Walnut Wood Background
    const bg = ctx.createLinearGradient(0, 0, 0, 1024)
    bg.addColorStop(0, '#1c1109')
    bg.addColorStop(0.5, '#29180e')
    bg.addColorStop(1, '#1a0f08')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, 2048, 1024)

    // Inner Warm White / Ivory Inset Matting
    ctx.fillStyle = '#f6f0e4'
    ctx.fillRect(50, 50, 1948, 924)

    // Sleek Dark Bronze Border
    ctx.strokeStyle = '#2b1a10'
    ctx.lineWidth = 12
    ctx.strokeRect(60, 60, 1928, 904)

    ctx.strokeStyle = '#6e4f35'
    ctx.lineWidth = 2
    ctx.strokeRect(76, 76, 1896, 872)

    // Official Undip Seal Medallion Graphic
    ctx.save()
    ctx.translate(1024, 250)

    ctx.fillStyle = '#26160e'
    ctx.beginPath()
    ctx.arc(0, 0, 72, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#bfa16a'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(0, 0, 64, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = '#f6f0e4'
    ctx.font = 'bold 36px "Cinzel", serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('1957', 0, 0)
    ctx.restore()

    // Title & Subtitle
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#1e1108'
    ctx.font = 'bold 54px "Cinzel", "Times New Roman", serif'
    ctx.fillText('SEJARAH PENDIRIAN & ARSIP RESMI', 1024, 430)

    ctx.fillStyle = '#4c301c'
    ctx.font = 'bold 38px "Cinzel", "Times New Roman", serif'
    ctx.fillText('UNIVERSITAS DIPONEGORO', 1024, 490)

    ctx.strokeStyle = '#8a6542'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(400, 530)
    ctx.lineTo(1648, 530)
    ctx.stroke()

    ctx.fillStyle = '#563820'
    ctx.font = 'italic 28px "EB Garamond", Georgia, serif'
    ctx.fillText(
      'Koleksi Arsip Akta Notaris No. 59 Th. 1956 • Buku Kronik Perintis • Transformasi Menuju Kampus Tembalang',
      1024,
      590,
    )

    // 3 Heritage Pillars Box
    const pillars = [
      {
        title: 'I. KEBUTUHAN PENDIDIKAN',
        desc: 'Didirikan awal 1950-an untuk menjawab kebutuhan mendesak sarjana dan lulusan SMA di Jawa Tengah utara.',
      },
      {
        title: 'II. GOTONG ROYONG 13 PERINTIS',
        desc: 'Akta Notaris R.M. Soeprapto No. 59 tgl 4 Des 1956 melegitimasi pembentukan Yayasan Universitas Semarang.',
      },
      {
        title: 'III. DIES NATALIS 15 OKTOBER',
        desc: 'Penetapan nama Diponegoro oleh Presiden Soekarno 1960 & peneladanan Pertempuran Lima Hari Semarang.',
      },
    ]

    const colW = 540
    const colY = 660
    pillars.forEach((p, idx) => {
      const colX = 140 + idx * (colW + 70)

      ctx.fillStyle = '#eee4d2'
      ctx.fillRect(colX, colY, colW, 190)

      ctx.strokeStyle = '#2d1b10'
      ctx.lineWidth = 2
      ctx.strokeRect(colX, colY, colW, 190)

      ctx.fillStyle = '#1c1009'
      ctx.font = 'bold 22px "Cinzel", serif'
      ctx.textAlign = 'center'
      ctx.fillText(p.title, colX + colW / 2, colY + 50)

      ctx.fillStyle = '#3a2415'
      ctx.font = '19px "EB Garamond", serif'
      ctx.textAlign = 'left'

      // Wrap text
      const words = p.desc.split(' ')
      let line = ''
      let ly = colY + 95
      words.forEach((w) => {
        const test = line + w + ' '
        if (ctx.measureText(test).width > colW - 40) {
          ctx.fillText(line, colX + 20, ly)
          line = w + ' '
          ly += 30
        } else {
          line = test
        }
      })
      if (line) ctx.fillText(line, colX + 20, ly)
    })

    // Footer instruction
    ctx.textAlign = 'center'
    ctx.fillStyle = '#22130a'
    ctx.font = 'bold 20px "Cinzel", serif'
    ctx.fillText('✦ BUKA BUKU SEJARAH DI LECTERN & PERIKSA LEMARI ARSIP DOKUMEN DI SEKITAR AREA INI ✦', 1024, 915)

    const texture = canvasToTexture(canvas)
    this.textureCache.set('area1_wall_panel', texture)
    return texture
  }

  public getClockFaceTexture(): THREE.CanvasTexture {
    if (this.textureCache.has('clock_face')) return this.textureCache.get('clock_face')!

    const { canvas, ctx } = createHelper(512, 512)
    const dial = ctx.createRadialGradient(256, 256, 40, 256, 256, 240)
    dial.addColorStop(0, '#fffdf7')
    dial.addColorStop(0.85, '#f2e8d3')
    dial.addColorStop(1, '#baa070')
    ctx.fillStyle = dial
    ctx.fillRect(0, 0, 512, 512)

    ctx.strokeStyle = '#8a672a'
    ctx.lineWidth = 14
    ctx.beginPath()
    ctx.arc(256, 256, 240, 0, Math.PI * 2)
    ctx.stroke()

    const numerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#1c1106'
    ctx.font = 'bold 38px "Cinzel", serif'

    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6 - Math.PI / 2
      const x = 256 + Math.cos(angle) * 185
      const y = 256 + Math.sin(angle) * 185
      ctx.fillText(numerals[i], x, y)
    }

    ctx.fillStyle = '#110a04'
    ctx.save()
    ctx.translate(256, 256)
    ctx.rotate((-50 * Math.PI) / 180)
    ctx.fillRect(-6, -110, 12, 110)
    ctx.restore()

    ctx.save()
    ctx.translate(256, 256)
    ctx.rotate((60 * Math.PI) / 180)
    ctx.fillRect(-4, -165, 8, 165)
    ctx.restore()

    ctx.fillStyle = '#dfba72'
    ctx.beginPath()
    ctx.arc(256, 256, 16, 0, Math.PI * 2)
    ctx.fill()

    const texture = canvasToTexture(canvas)
    this.textureCache.set('clock_face', texture)
    return texture
  }

  public getBookCoverTexture(): THREE.CanvasTexture {
    if (this.textureCache.has('book_cover')) return this.textureCache.get('book_cover')!

    const { canvas, ctx } = createHelper(512, 512)
    ctx.fillStyle = '#4c251c'
    ctx.fillRect(0, 0, 512, 512)

    ctx.strokeStyle = '#dfba72'
    ctx.lineWidth = 6
    ctx.strokeRect(30, 30, 452, 452)
    ctx.lineWidth = 2
    ctx.strokeRect(45, 45, 422, 422)

    ctx.textAlign = 'center'
    ctx.fillStyle = '#fae1a0'
    ctx.font = 'bold 32px "Cinzel", serif'
    ctx.fillText('SEJARAH UNDIP', 256, 210)
    ctx.fillText('KAMPUS TEMBALANG', 256, 260)
    ctx.font = 'italic 20px "EB Garamond", serif'
    ctx.fillStyle = '#dfba72'
    ctx.fillText('1957 — Kini', 256, 310)

    const texture = canvasToTexture(canvas)
    this.textureCache.set('book_cover', texture)
    return texture
  }

  public getOpenBookPagesTexture(): THREE.CanvasTexture {
    if (this.textureCache.has('open_book_pages')) return this.textureCache.get('open_book_pages')!

    const { canvas, ctx } = createHelper(1024, 512)
    ctx.fillStyle = '#f8f2e2'
    ctx.fillRect(0, 0, 1024, 512)

    const spine = ctx.createLinearGradient(480, 0, 544, 0)
    spine.addColorStop(0, 'rgba(0, 0, 0, 0)')
    spine.addColorStop(0.5, 'rgba(40, 20, 10, 0.4)')
    spine.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = spine
    ctx.fillRect(480, 0, 64, 512)

    ctx.fillStyle = '#1e1207'
    ctx.font = 'bold 24px "Cinzel", serif'
    ctx.fillText('ZONA 1: SEJARAH PENDIRIAN UNDIP', 60, 70)
    ctx.font = '16px "EB Garamond", serif'
    ctx.fillStyle = '#342012'

    const linesLeft = [
      'Awal 1950-an, masyarakat Jawa Tengah mendambakan',
      'pendidikan tinggi guna menampung lulusan SMA Jateng utara',
      'yang tak tertampung di UGM (satu-satunya PTN Jateng/DIY).',
      '',
      'Dibentuk Yayasan Universitas Semarang melalui',
      'Akta Notaris R.M. Soeprapto No. 59 tgl 4 Des 1956.',
      'Universitas Semarang dibuka resmi 9 Januari 1957',
      'dengan Presiden Universitas pertama Mr. Imam Bardjo.',
      '',
      'Perkuliahan perdana digelar di GRIS Jl. Pemuda & Pleburan',
      'dengan fakultas hukum, ekonomi, teknik, & tata praja.',
    ]
    linesLeft.forEach((line, i) => ctx.fillText(line, 60, 115 + i * 28))

    ctx.fillStyle = '#1e1207'
    ctx.font = 'bold 24px "Cinzel", serif'
    ctx.fillText('PENEGERIAN, DIES NATALIS & TEMBALANG', 560, 70)
    ctx.font = '16px "EB Garamond", serif'
    ctx.fillStyle = '#342012'

    const linesRight = [
      'Pada Dies Natalis III (9 Jan 1960), Presiden Soekarno',
      'mengubah nama menjadi “UNIVERSITAS DIPONEGORO”.',
      'Status PTN ditetapkan melalui PP No. 7 Tahun 1961.',
      '',
      'Hari Jadi / Dies Natalis ditetapkan tgl 15 Oktober 1957,',
      'merujuk peristiwa heroik Pertempuran Lima Hari di Semarang.',
      '',
      'Kini Undip berkembang pesat berpusat di Kampus Tembalang',
      'dan resmi berstatus PTN Badan Hukum (PTN-BH) berdasarkan',
      'PP No. 81 Tahun 2014 dan PP No. 52 Tahun 2015.',
    ]
    linesRight.forEach((line, i) => ctx.fillText(line, 560, 115 + i * 28))

    const texture = canvasToTexture(canvas)
    this.textureCache.set('open_book_pages', texture)
    return texture
  }

  // ==========================================
  // 10. LARGE HORIZONTAL HISTORY WALL DISPLAY (ZONE 1)
  // ==========================================
  public getBigHistoryWallTexture(): THREE.CanvasTexture {
    if (this.textureCache.has('big_history_wall')) return this.textureCache.get('big_history_wall')!

    const { canvas, ctx } = createHelper(2048, 1024)

    // 1. Rich dark walnut & parchment canvas base
    const grad = ctx.createLinearGradient(0, 0, 0, 1024)
    grad.addColorStop(0, '#1c100a')
    grad.addColorStop(0.08, '#2a170e')
    grad.addColorStop(0.5, '#351f14')
    grad.addColorStop(0.92, '#2a170e')
    grad.addColorStop(1, '#1c100a')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 2048, 1024)

    // Inner parchment plate
    ctx.fillStyle = '#f8f2e2'
    ctx.fillRect(40, 40, 1968, 944)

    // Subtle paper grain & vintage aging vignette
    const parchmentVignette = ctx.createRadialGradient(1024, 512, 400, 1024, 512, 1100)
    parchmentVignette.addColorStop(0, 'rgba(248, 242, 226, 0)')
    parchmentVignette.addColorStop(0.7, 'rgba(224, 202, 160, 0.45)')
    parchmentVignette.addColorStop(1, 'rgba(148, 112, 72, 0.75)')
    ctx.fillStyle = parchmentVignette
    ctx.fillRect(40, 40, 1968, 944)

    // 2. Ornate Double Antique Gold Borders
    ctx.strokeStyle = '#c59d53'
    ctx.lineWidth = 10
    ctx.strokeRect(55, 55, 1938, 914)

    ctx.strokeStyle = '#e9cc88'
    ctx.lineWidth = 3
    ctx.strokeRect(70, 70, 1908, 884)

    // Ornate Gold Corner Accents
    const drawCorner = (cx: number, cy: number, signX: number, signY: number) => {
      ctx.strokeStyle = '#c59d53'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(cx, cy + signY * 50)
      ctx.lineTo(cx, cy)
      ctx.lineTo(cx + signX * 50, cy)
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(cx + signX * 24, cy + signY * 24, 10, 0, Math.PI * 2)
      ctx.fillStyle = '#dfba72'
      ctx.fill()
    }
    drawCorner(85, 85, 1, 1)
    drawCorner(1963, 85, -1, 1)
    drawCorner(85, 939, 1, -1)
    drawCorner(1963, 939, -1, -1)

    // 3. Header Emblem & Titles
    // Gold Emblem of Undip / Laurel Wreath
    ctx.save()
    ctx.translate(1024, 140)
    ctx.fillStyle = '#c59d53'
    ctx.beginPath()
    ctx.arc(0, 0, 36, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#2a170e'
    ctx.beginPath()
    ctx.arc(0, 0, 30, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#fae1a0'
    ctx.font = 'bold 22px "Cinzel", serif'
    ctx.textAlign = 'center'
    ctx.fillText('1957', 0, 8)
    ctx.restore()

    // Title & Subtitle
    ctx.textAlign = 'center'
    ctx.fillStyle = '#22130a'
    ctx.font = 'bold 50px "Cinzel", "Times New Roman", serif'
    ctx.fillText('SEJARAH UNIVERSITAS DIPONEGORO', 1024, 230)

    ctx.fillStyle = '#6e4526'
    ctx.font = 'italic 23px "EB Garamond", Georgia, serif'
    ctx.fillText(
      'Kronik Perjuangan dari Universitas Semarang (1956/1957) hingga Penetapan PTN Badan Hukum Kampus Tembalang',
      1024,
      270,
    )

    // Ornamental Divider Line
    ctx.strokeStyle = '#c59d53'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(340, 292)
    ctx.lineTo(1708, 292)
    ctx.stroke()

    ctx.fillStyle = '#c59d53'
    ctx.beginPath()
    ctx.arc(1024, 292, 6, 0, Math.PI * 2)
    ctx.fill()

    // 4. Five Milestone Timeline Columns
    const milestones = [
      {
        year: '1956',
        date: '4 Desember 1956',
        title: 'Akta Notaris No. 59',
        sub: 'Yayasan Universitas Semarang',
        desc: 'Didirikan resmi di hadapan Notaris R.M. Soeprapto oleh 13 tokoh pejuang & cendekiawan untuk memenuhi kebutuhan perguruan tinggi di Jateng utara.',
        badge: 'Dasar Hukum Yayasan',
      },
      {
        year: '1957',
        date: '9 Januari 1957',
        title: 'Pembukaan di GRIS',
        sub: 'Kuliah Perdana & Mr. Imam Bardjo',
        desc: 'Secara khidmat diresmikan di Gedung Rakyat Indonesia Semarang (GRIS) Jl. Pemuda. Mr. Imam Bardjo dilantik sebagai Presiden Universitas pertama.',
        badge: 'Peresmian Kampus',
      },
      {
        year: '1960',
        date: '9 Januari 1960',
        title: 'Restu Presiden Soekarno',
        sub: 'Penganugerahan Nama Diponegoro',
        desc: 'Presiden Soekarno menganugerahkan nama agung “Universitas Diponegoro” pada Dies Natalis III sebagai obor kejujuran budi dan pengabdian bangsa.',
        badge: 'Kurnia Nama Agung',
      },
      {
        year: '1961',
        date: '15 Oktober 1957/1961',
        title: 'Penegerian PP No. 7/1961',
        sub: 'Dies Natalis 15 Oktober',
        desc: 'Ditetapkan sebagai Perguruan Tinggi Negeri. Dies Natalis 15 Oktober dipilih meneladani patriotisme Pertempuran Lima Hari di Semarang 1945.',
        badge: 'Pengukuhan PTN',
      },
      {
        year: 'KINI',
        date: 'Kampus Tembalang',
        title: 'Transformasi PTN-BH',
        sub: 'World Class University',
        desc: 'Ekspansi kampus terpadu ke perbukitan Tembalang. Resmi berstatus PTN Badan Hukum (PP No. 81/2014) bereputasi riset unggul internasional.',
        badge: 'Reputasi Dunia',
      },
    ]

    const colWidth = 345
    const gap = 32
    const startX = 100
    const cardTop = 330
    const cardHeight = 490

    milestones.forEach((m, idx) => {
      const cx = startX + idx * (colWidth + gap)

      // Card Background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(cx, cardTop, colWidth, cardHeight)

      // Border with gold accent
      ctx.strokeStyle = '#d7bc82'
      ctx.lineWidth = 2
      ctx.strokeRect(cx, cardTop, colWidth, cardHeight)

      // Year Banner Top
      const yearGrad = ctx.createLinearGradient(cx, cardTop, cx + colWidth, cardTop)
      yearGrad.addColorStop(0, '#351f14')
      yearGrad.addColorStop(0.5, '#4a2c1d')
      yearGrad.addColorStop(1, '#351f14')
      ctx.fillStyle = yearGrad
      ctx.fillRect(cx, cardTop, colWidth, 68)

      ctx.fillStyle = '#fae1a0'
      ctx.font = 'bold 30px "Cinzel", serif'
      ctx.textAlign = 'center'
      ctx.fillText(m.year, cx + colWidth / 2, cardTop + 46)

      // Badge
      ctx.fillStyle = '#c59d53'
      ctx.fillRect(cx + 20, cardTop + 82, colWidth - 40, 26)
      ctx.fillStyle = '#1c100a'
      ctx.font = 'bold 12px "Cinzel", sans-serif'
      ctx.fillText(m.badge.toUpperCase(), cx + colWidth / 2, cardTop + 99)

      // Title & Subtitle
      ctx.fillStyle = '#1e1108'
      ctx.font = 'bold 19px "Cinzel", serif'
      ctx.fillText(m.title, cx + colWidth / 2, cardTop + 144)

      ctx.fillStyle = '#7a4e28'
      ctx.font = 'italic 14px "EB Garamond", serif'
      ctx.fillText(m.sub, cx + colWidth / 2, cardTop + 168)

      ctx.strokeStyle = '#ecd7ad'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cx + 30, cardTop + 185)
      ctx.lineTo(cx + colWidth - 30, cardTop + 185)
      ctx.stroke()

      // Description text wrapping
      ctx.fillStyle = '#2e1c10'
      ctx.font = '14.5px "EB Garamond", serif'
      ctx.textAlign = 'left'

      // Custom wrap
      const words = m.desc.split(' ')
      let line = ''
      let lineY = cardTop + 215
      const maxLineWidth = colWidth - 44

      words.forEach((word) => {
        const testLine = line + word + ' '
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxLineWidth) {
          ctx.fillText(line, cx + 22, lineY)
          line = word + ' '
          lineY += 25
        } else {
          line = testLine
        }
      })
      if (line) {
        ctx.fillText(line, cx + 22, lineY)
      }

      // Card bottom date tag
      ctx.fillStyle = '#8f633c'
      ctx.font = 'bold 12px "Cinzel", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(m.date, cx + colWidth / 2, cardTop + cardHeight - 24)
    })

    // 5. Footer Guidance Bar
    ctx.fillStyle = '#2a170e'
    ctx.fillRect(80, 855, 1888, 70)

    ctx.strokeStyle = '#c59d53'
    ctx.lineWidth = 1.5
    ctx.strokeRect(82, 857, 1884, 66)

    ctx.fillStyle = '#fae1a0'
    ctx.font = 'bold 17px "Cinzel", serif'
    ctx.textAlign = 'center'
    ctx.fillText(
      '✦ RUJUKAN SEJARAH RESMI: undip.ac.id/sejarah-2 • DEKATI LECTERN DI DEPAN UNTUK MEMBACA BUKU SEJARAH INTERAKTIF ✦',
      1024,
      898,
    )

    const texture = canvasToTexture(canvas)
    this.textureCache.set('big_history_wall', texture)
    return texture
  }

  public dispose(): void {
    this.textureCache.forEach((tex) => tex.dispose())
    this.textureCache.clear()
    this.dataUrlCache.clear()
    this.canvasCache.clear()
  }
}
