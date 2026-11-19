import * as THREE from 'three'
import { AssetManager } from './AssetManager'
import {
  MUSEUM_BOOKS,
  BOOKSHELF_CATEGORIES,
  type MuseumBook,
} from '../data/historyData'

export interface InteractiveTarget {
  id: string
  zoneNumber: number
  name: string
  areaName: string
  subItemIndex?: number
  mesh: THREE.Object3D
  highlightMeshes: THREE.Mesh[]
  position: THREE.Vector3
  bookData?: MuseumBook
}

export interface ObstacleBox {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

/**
 * ObjectManager — Minimalist · Elegant · Vintage Heritage Architecture
 *
 * Single Main Exhibition Room ("The Archive Room"):
 * 1. 5 Mandatory Physical 3D Display Exhibits:
 *    - Center: 3D Campus Transformation Miniature with glass vitrine
 *    - West Wall: Sejarah Undip (Reading lectern + big historical wall display)
 *    - South-West Wall: Galeri 5 Pendiri Utama Undip
 *    - South Wall: Galeri Tokoh Direktorat & Rektorat dari Periode ke Periode (13 Gambar Berjarak)
 *    - North Wall: Galeri Foto Dokumentasi Kampus Awal (1957–1962)
 * 2. 5 Interactive Bookshelves (Rak 01 s/d Rak 05):
 *    - Classical dark walnut bookcases with carved crowns and brass plaques
 *    - Real 3D books on shelves with raycast interaction and hover highlight
 *    - Clicking a book opens the Vintage Leather/Parchment Book Reader modal
 *
 * Strict 3-color palette: Hitam (#171513), Putih/Ivory (#E8E2D8), Cokelat Walnut (#79583E).
 */
export class ObjectManager {
  private group: THREE.Group
  private assetManager: AssetManager
  private interactiveTargets: InteractiveTarget[] = []
  private obstacleBoxes: ObstacleBox[] = []

  private bookPagePivot: THREE.Group | null = null
  private isPageTurning = false
  private pageTurnProgress = 0
  private labelMaterialCache = new Map<string, THREE.MeshStandardMaterial>()

  constructor() {
    this.assetManager = AssetManager.getInstance()
    this.group = new THREE.Group()
    this.group.name = 'SingleArchiveRoomObjectGroup'

    this.buildAllExhibits()
  }

  public getGroup(): THREE.Group {
    return this.group
  }

  public getInteractiveTargets(): InteractiveTarget[] {
    return this.interactiveTargets
  }

  public getObstacles(): ObstacleBox[] {
    return this.obstacleBoxes
  }

  // Backwards compatibility methods
  public getZone1Group(): THREE.Group {
    return this.group
  }

  public getZone1Targets(): InteractiveTarget[] {
    return this.interactiveTargets
  }

  public getZone1Obstacles(): ObstacleBox[] {
    return this.obstacleBoxes
  }

  public getZone2Group(): THREE.Group {
    return this.group
  }

  public getZone2Targets(): InteractiveTarget[] {
    return this.interactiveTargets
  }

  public getZone2Obstacles(): ObstacleBox[] {
    return this.obstacleBoxes
  }

  public triggerBookPageTurn(): void {
    this.isPageTurning = true
    this.pageTurnProgress = 0
  }

  public isAnimating(): boolean {
    return this.isPageTurning
  }

  public update(_time: number, delta = 0.016): void {
    if (this.isPageTurning && this.bookPagePivot) {
      this.pageTurnProgress = Math.min(1, this.pageTurnProgress + delta * 1.8)
      const p = this.pageTurnProgress
      const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p
      this.bookPagePivot.rotation.y = -eased * Math.PI
      if (p >= 1) this.isPageTurning = false
    }
  }

  private label(title: string, subtitle?: string): THREE.MeshStandardMaterial {
    const key = `${title}__${subtitle || ''}`
    if (this.labelMaterialCache.has(key)) {
      return this.labelMaterialCache.get(key)!
    }
    const mat = new THREE.MeshStandardMaterial({
      map: this.assetManager.createExhibitLabel(title, subtitle),
      roughness: 0.45,
      metalness: 0.04,
    })
    this.labelMaterialCache.set(key, mat)
    return mat
  }

  private buildAllExhibits(): void {
    // 1. Physical Exhibit: Central 3D Miniature Table
    this.buildCentralCampusMiniature()

    // 2. Physical Exhibit: West Wall Undip History Lectern & Grand Wall Display
    this.buildFoundingHistoryLectern()

    // 3. Physical Exhibit: South-West Wall 5 Founders Gallery
    this.buildFoundersFiveGallery()

    // 4. Physical Exhibit: South Wall 13 Directorate & Rectorate Gallery (Clean Spaced Layout)
    this.buildDirectorateThirteenGallery()

    // 5. Physical Exhibit: North Wall Early Campus Photo Gallery
    this.buildCampusEarlyPhotosGallery()

    // 6. 5 Interactive Historical Bookshelves (Rak 01 s/d Rak 05)
    this.buildHistoricalBookshelves()
  }

  // =========================================================================
  // 1. CENTRAL EXHIBIT: 3D Miniature Table of Campus Transformation
  // =========================================================================
  private buildCentralCampusMiniature(): void {
    const miniGroup = new THREE.Group()
    miniGroup.position.set(0, 0, 0)

    const walnutMat = new THREE.MeshStandardMaterial({ color: 0x241a13, roughness: 0.52, metalness: 0.04 })
    const brassMat = new THREE.MeshStandardMaterial({ color: 0x8c6f48, roughness: 0.35, metalness: 0.65 })
    const limestoneMat = new THREE.MeshStandardMaterial({ color: 0xded6c9, roughness: 0.85 })
    const terracottaMat = new THREE.MeshStandardMaterial({ color: 0x803822, roughness: 0.72 })
    const roofDarkMat = new THREE.MeshStandardMaterial({ color: 0x48281a, roughness: 0.65 })
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x244448, roughness: 0.18, metalness: 0.1 })
    const treeGreen = new THREE.MeshStandardMaterial({ color: 0x2e3d24, roughness: 0.85 })
    const treeDark = new THREE.MeshStandardMaterial({ color: 0x212f1a, roughness: 0.85 })
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x2a1c12, roughness: 0.75 })

    // Display Table (3.4m x 2.2m x 0.85m)
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.1, 2.2), walnutMat)
    tableTop.position.y = 0.80
    tableTop.castShadow = true
    tableTop.receiveShadow = true
    miniGroup.add(tableTop)

    // Brass edge molding around table top
    const tableRim = new THREE.Mesh(new THREE.BoxGeometry(3.44, 0.04, 2.24), brassMat)
    tableRim.position.y = 0.84
    miniGroup.add(tableRim)

    // Stepped plinth base
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 2.4), walnutMat)
    plinth.position.y = 0.06
    plinth.receiveShadow = true
    miniGroup.add(plinth)

    // 4 square turned table legs
    const legGeo = new THREE.BoxGeometry(0.16, 0.74, 0.16)
    const legPositions = [
      [-1.5, 0.43, -0.9],
      [1.5, 0.43, -0.9],
      [-1.5, 0.43, 0.9],
      [1.5, 0.43, 0.9],
    ]
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, walnutMat)
      leg.position.set(lx, ly, lz)
      leg.castShadow = true
      miniGroup.add(leg)
      const sabot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.18), brassMat)
      sabot.position.set(lx, 0.15, lz)
      miniGroup.add(sabot)
    })

    // Glass vitrine case hood
    const vitrineGlassMat = new THREE.MeshStandardMaterial({
      color: 0xf5f8fa,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    })
    const vitrineHood = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.65, 2.0), vitrineGlassMat)
    vitrineHood.position.y = 0.85 + 0.325
    miniGroup.add(vitrineHood)

    // Vitrine bronze frame struts
    const strutV = new THREE.BoxGeometry(0.025, 0.65, 0.025)
    const cornerOffsets = [
      [-1.6, -1.0], [1.6, -1.0], [-1.6, 1.0], [1.6, 1.0],
    ]
    cornerOffsets.forEach(([cx, cz]) => {
      const strut = new THREE.Mesh(strutV, brassMat)
      strut.position.set(cx, 0.85 + 0.325, cz)
      miniGroup.add(strut)
    })

    // Vitrine top rim frame
    const rimX1 = new THREE.Mesh(new THREE.BoxGeometry(3.22, 0.025, 0.025), brassMat)
    rimX1.position.set(0, 0.85 + 0.65, -1.0)
    miniGroup.add(rimX1)
    const rimX2 = new THREE.Mesh(new THREE.BoxGeometry(3.22, 0.025, 0.025), brassMat)
    rimX2.position.set(0, 0.85 + 0.65, 1.0)
    miniGroup.add(rimX2)
    const rimZ1 = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 2.02), brassMat)
    rimZ1.position.set(-1.6, 0.85 + 0.65, 0)
    miniGroup.add(rimZ1)
    const rimZ2 = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 2.02), brassMat)
    rimZ2.position.set(1.6, 0.85 + 0.65, 0)
    miniGroup.add(rimZ2)

    // Diorama Topography Board (Inside Vitrine)
    const dioramaBase = new THREE.Mesh(new THREE.BoxGeometry(3.08, 0.04, 1.88), limestoneMat)
    dioramaBase.position.y = 0.87
    dioramaBase.receiveShadow = true
    miniGroup.add(dioramaBase)

    // Central Landmark: Widya Puraya Administration Building (Iconic Tiered Pyramid Roofs)
    const wpCenter = new THREE.Group()
    wpCenter.position.set(0, 0.89, 0)

    const wpBase = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.08, 0.65), limestoneMat)
    wpBase.position.y = 0.04
    wpBase.castShadow = true
    wpCenter.add(wpBase)

    const wpTier1 = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.07, 0.54), limestoneMat)
    wpTier1.position.y = 0.115
    wpTier1.castShadow = true
    wpCenter.add(wpTier1)

    // Main Roof 1 (Tiered hip roof)
    const wpRoof1 = new THREE.Mesh(new THREE.ConeGeometry(0.56, 0.12, 4), terracottaMat)
    wpRoof1.position.y = 0.21
    wpRoof1.rotation.y = Math.PI / 4
    wpRoof1.castShadow = true
    wpCenter.add(wpRoof1)

    // Tier 2 & Upper Roof
    const wpTier2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.34), limestoneMat)
    wpTier2.position.y = 0.28
    wpTier2.castShadow = true
    wpCenter.add(wpTier2)

    const wpRoof2 = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.11, 4), roofDarkMat)
    wpRoof2.position.y = 0.36
    wpRoof2.rotation.y = Math.PI / 4
    wpRoof2.castShadow = true
    wpCenter.add(wpRoof2)

    // Central Clock Tower
    const wpTower = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.12), limestoneMat)
    wpTower.position.set(0, 0.44, 0)
    wpTower.castShadow = true
    wpCenter.add(wpTower)

    const wpSpire = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.14, 4), brassMat)
    wpSpire.position.set(0, 0.61, 0)
    wpSpire.rotation.y = Math.PI / 4
    wpCenter.add(wpSpire)

    miniGroup.add(wpCenter)

    // Educational Reflection Lake / Waduk Pendidikan
    const lake = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.44, 0.02, 20), waterMat)
    lake.position.set(-0.95, 0.892, 0)
    lake.scale.set(1.4, 1, 0.8)
    miniGroup.add(lake)

    const lakeBridge = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.58), limestoneMat)
    lakeBridge.position.set(-0.95, 0.905, 0)
    miniGroup.add(lakeBridge)

    // Surrounding Faculty Pavilions
    const buildPavilion = (x: number, z: number, w: number, d: number) => {
      const p = new THREE.Group()
      p.position.set(x, 0.89, z)
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.07, d), limestoneMat)
      b.position.y = 0.035
      b.castShadow = true
      p.add(b)
      const r = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.65, 0.07, 4), terracottaMat)
      r.position.y = 0.105
      r.rotation.y = Math.PI / 4
      r.castShadow = true
      p.add(r)
      miniGroup.add(p)
    }

    buildPavilion(0.95, -0.25, 0.48, 0.26)
    buildPavilion(0.95, 0.25, 0.44, 0.22)
    buildPavilion(-0.95, -0.25, 0.48, 0.26)
    buildPavilion(-0.95, 0.25, 0.44, 0.22)
    buildPavilion(-0.45, -0.65, 0.42, 0.20)
    buildPavilion(0.45, -0.65, 0.42, 0.20)
    buildPavilion(-0.55, 0.65, 0.44, 0.20)
    buildPavilion(0.55, 0.65, 0.44, 0.20)

    // Tree clusters around miniature
    const treePositions = [
      [-0.45, -0.25], [-0.45, 0.25], [0.45, -0.25], [0.45, 0.25],
      [-1.3, -0.6], [1.3, -0.6], [-1.3, 0.6], [1.3, 0.6],
      [-0.1, -0.65], [0.1, -0.65], [-0.1, 0.65], [0.1, 0.65],
    ]
    treePositions.forEach(([tx, tz], i) => {
      const tree = new THREE.Group()
      tree.position.set(tx, 0.89, tz)
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.06, 6), trunkMat)
      trunk.position.y = 0.03
      tree.add(trunk)
      const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.048, 7, 7), i % 2 === 0 ? treeGreen : treeDark)
      canopy.position.y = 0.08
      canopy.scale.set(1, 1.25, 1)
      tree.add(canopy)
      miniGroup.add(tree)
    })

    // Brass Plaque on Front Vitrine
    const plaqueMat = new THREE.MeshStandardMaterial({
      map: this.assetManager.createBrassPlaque(
        'MINIATUR 3D KAMPUS UNIVERSITAS DIPONEGORO',
        'Kampus Terpadu Tembalang (180 Ha) & Teluk Awur Jepara (52 Ha)',
      ),
      roughness: 0.38,
      metalness: 0.55,
    })
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.16, 0.02), plaqueMat)
    plaque.position.set(0, 0.82, 1.12)
    miniGroup.add(plaque)

    this.group.add(miniGroup)

    this.interactiveTargets.push({
      id: 'miniature',
      zoneNumber: 2,
      name: 'Miniatur 3D Transformasi Kawasan Kampus Undip',
      areaName: 'Pusat Ruangan · Meja Vitrine Maket Arsitektur 3D',
      subItemIndex: 0,
      mesh: miniGroup,
      highlightMeshes: [tableTop, vitrineHood, plaque],
      position: new THREE.Vector3(0, 1.0, 0),
    })

    // Collision Box for central table
    this.obstacleBoxes.push({ minX: -1.9, maxX: 1.9, minZ: -1.3, maxZ: 1.3 })
  }

  // =========================================================================
  // 2. PHYSICAL EXHIBIT: Undip History Reading Lectern & Grand Wall Display
  // =========================================================================
  private buildFoundingHistoryLectern(): void {
    const walnut = new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.46, metalness: 0.04 })
    const dark = new THREE.MeshStandardMaterial({ color: 0x14100c, roughness: 0.55, metalness: 0.12 })
    const bronze = new THREE.MeshStandardMaterial({ color: 0x3a2a1c, roughness: 0.42, metalness: 0.5 })

    // Grand illuminated wall panel on West Wall (X = -9.9)
    const wallPanel = new THREE.Group()
    wallPanel.position.set(-9.92, 2.45, 0)
    wallPanel.rotation.y = Math.PI / 2

    const panelFrame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.6, 0.06), walnut)
    wallPanel.add(panelFrame)

    const panelCanvas = new THREE.Mesh(
      new THREE.PlaneGeometry(4.06, 1.46),
      new THREE.MeshStandardMaterial({
        map: this.assetManager.getArea1WallPanelTexture(),
        roughness: 0.5,
      }),
    )
    panelCanvas.position.z = 0.032
    wallPanel.add(panelCanvas)

    // Brass picture light fixtures above panel
    const lampBar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.6, 8), dark)
    lampBar1.rotation.z = Math.PI / 2
    lampBar1.position.set(-1.0, 0.9, 0.15)
    wallPanel.add(lampBar1)

    const lampBar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.6, 8), dark)
    lampBar2.rotation.z = Math.PI / 2
    lampBar2.position.set(1.0, 0.9, 0.15)
    wallPanel.add(lampBar2)

    this.group.add(wallPanel)

    // Elegant Classical Reading Lectern in front of wall panel (X = -7.6, Z = 0)
    const lectern = new THREE.Group()
    lectern.position.set(-7.6, 0, 0)
    lectern.rotation.y = Math.PI / 2

    const base1 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.07, 0.65), walnut)
    base1.position.y = 0.035
    base1.castShadow = true
    lectern.add(base1)

    const base2 = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.05, 0.54), walnut)
    base2.position.y = 0.095
    lectern.add(base2)

    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.68, 0.30), walnut)
    pedestal.position.y = 0.46
    pedestal.castShadow = true
    lectern.add(pedestal)

    const pedestalCap = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.055, 0.38), walnut)
    pedestalCap.position.y = 0.83
    lectern.add(pedestalCap)

    const plaque = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.14, 0.015),
      new THREE.MeshStandardMaterial({
        map: this.assetManager.createBrassPlaque('BUKU SEJARAH RESMI', 'Kronik Undip 1956 — Kini'),
        roughness: 0.38,
        metalness: 0.5,
      }),
    )
    plaque.position.set(0, 0.50, 0.16)
    lectern.add(plaque)

    // Angled reading desk
    const desk = new THREE.Group()
    desk.position.set(0, 0.98, 0)
    desk.rotation.x = -0.38

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.045, 0.62), walnut)
    deskTop.castShadow = true
    deskTop.receiveShadow = true
    desk.add(deskTop)

    const lip = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.03, 0.025), bronze)
    lip.position.set(0, 0.035, 0.30)
    desk.add(lip)

    // Lamp for reading lectern
    const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.20, 8), dark)
    lampArm.position.set(0.36, 0.12, -0.22)
    desk.add(lampArm)

    const lampShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.045, 0.1, 12),
      new THREE.MeshStandardMaterial({
        color: 0x1c1610,
        emissive: 0xfff2d8,
        emissiveIntensity: 0.45,
        roughness: 0.35,
      }),
    )
    lampShade.rotation.z = Math.PI / 2
    lampShade.position.set(0.36, 0.22, -0.22)
    desk.add(lampShade)

    // Interactive Open History Book on lectern
    const book = new THREE.Group()
    book.position.set(0, 0.035, 0.01)

    const cover = new THREE.Mesh(
      new THREE.BoxGeometry(0.78, 0.025, 0.50),
      new THREE.MeshStandardMaterial({ color: 0x2e1a10, roughness: 0.68 }),
    )
    cover.castShadow = true
    book.add(cover)

    const paper = new THREE.MeshStandardMaterial({ color: 0xeee6d6, roughness: 0.78 })
    const leftBlock = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.028, 0.46), paper)
    leftBlock.position.set(-0.185, 0.018, 0)
    book.add(leftBlock)

    const rightBlock = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.028, 0.46), paper)
    rightBlock.position.set(0.185, 0.018, 0)
    book.add(rightBlock)

    const pages = new THREE.Mesh(
      new THREE.PlaneGeometry(0.74, 0.46),
      new THREE.MeshStandardMaterial({ map: this.assetManager.getOpenBookPagesTexture(), roughness: 0.5 }),
    )
    pages.rotation.x = -Math.PI / 2
    pages.position.y = 0.035
    book.add(pages)

    // Turning page pivot
    const pivot = new THREE.Group()
    pivot.position.set(0, 0.036, 0)
    const turnLeaf = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.46), paper)
    turnLeaf.position.set(0.18, 0, 0)
    turnLeaf.rotation.x = -Math.PI / 2
    pivot.add(turnLeaf)
    book.add(pivot)
    this.bookPagePivot = pivot

    desk.add(book)
    lectern.add(desk)
    this.group.add(lectern)

    this.interactiveTargets.push({
      id: 'history',
      zoneNumber: 1,
      name: 'Buku Sejarah Resmi Universitas Diponegoro',
      areaName: 'Sayap Barat · Mimbar Baca & Naskah Sejarah Resmi',
      subItemIndex: 0,
      mesh: lectern,
      highlightMeshes: [deskTop, cover, plaque, panelFrame],
      position: new THREE.Vector3(-7.6, 1.2, 0),
    })

    // Obstacle for lectern
    this.obstacleBoxes.push({ minX: -8.3, maxX: -6.9, minZ: -0.7, maxZ: 0.7 })
  }

  // =========================================================================
  // 3. PHYSICAL EXHIBIT: 5 Main Founders of Undip (South-West Wall)
  // =========================================================================
  private buildFoundersFiveGallery(): void {
    const group = new THREE.Group()
    group.position.set(-6.8, 0, 7.85)
    group.rotation.y = Math.PI

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1c140e, roughness: 0.45, metalness: 0.1 })
    const matMat = new THREE.MeshStandardMaterial({ color: 0xf7f2e8, roughness: 0.85 })

    const founders = [
      { key: 'founder_soedarto', name: '1. Mr. Sudarto', role: 'Ketua Yayasan 1956', idx: 0 },
      { key: 'founder_danuwidjojo', name: '2. Ir. Dan Soelaiman', role: 'Wakil Ketua Yayasan', idx: 1 },
      { key: 'founder_goenawan', name: '3. Mr. Soesanto Kartoatmodjo', role: 'Panitera Yayasan', idx: 2 },
      { key: 'founder_tan_tjiang_bie', name: '4. Achmad Tjokrokoesoemo', role: 'Bendahara Yayasan', idx: 3 },
      { key: 'founder_imam_bardjo', name: '5. Mr. Imam Bardjo', role: 'Presiden Univ. I', idx: 4 },
    ]

    const fw = 0.92
    const fh = 1.05
    const spacing = 1.35

    const sharedFrameGeo = new THREE.BoxGeometry(fw, fh, 0.045)
    const sharedMatGeo = new THREE.PlaneGeometry(fw - 0.07, fh - 0.07)
    const sharedPortraitGeo = new THREE.PlaneGeometry(fw - 0.16, fh - 0.22)
    const sharedPlaqueGeo = new THREE.BoxGeometry(fw * 0.95, 0.16, 0.015)

    founders.forEach((f, i) => {
      const x = (i - 2) * spacing
      const y = 2.15

      const frameGroup = new THREE.Group()
      frameGroup.position.set(x, y, 0)

      const frame = new THREE.Mesh(sharedFrameGeo, frameMat)
      frame.castShadow = true
      frameGroup.add(frame)

      const mat = new THREE.Mesh(sharedMatGeo, matMat)
      mat.position.z = 0.024
      frameGroup.add(mat)

      const portrait = new THREE.Mesh(
        sharedPortraitGeo,
        new THREE.MeshStandardMaterial({
          map: this.assetManager.getImageTexture(f.key),
          roughness: 0.42,
        }),
      )
      portrait.position.set(0, 0.04, 0.03)
      frameGroup.add(portrait)

      const tag = new THREE.Mesh(sharedPlaqueGeo, this.label(f.name, f.role))
      tag.position.set(0, -fh / 2 + 0.04, 0.032)
      frameGroup.add(tag)

      group.add(frameGroup)

      this.interactiveTargets.push({
        id: 'founders_5',
        zoneNumber: 1,
        name: f.name,
        areaName: 'Galeri 5 Pendiri Utama — Dinding Selatan Barat',
        subItemIndex: f.idx,
        mesh: frameGroup,
        highlightMeshes: [frame, portrait],
        position: new THREE.Vector3(-6.8 + x, y, 7.6),
      })
    })

    // Header Plaque
    const headerPlaque = new THREE.Mesh(
      new THREE.BoxGeometry(5.8, 0.28, 0.025),
      this.label('LIMA TOKOH PENDIRI UTAMA UNIVERSITAS SEMARANG (1956)', 'Akta Notaris R.M. Soeprapto No. 59 Th. 1956'),
    )
    headerPlaque.position.set(0, 3.10, 0.015)
    group.add(headerPlaque)

    this.group.add(group)
  }

  // =========================================================================
  // 4. PHYSICAL EXHIBIT: 13 Directorate & Rectorate Leaders (South Wall)
  // Clean, spacious 2-row layout with zero overlap and brass nameplates
  // =========================================================================
  private buildDirectorateThirteenGallery(): void {
    const group = new THREE.Group()
    group.position.set(1.8, 0, 7.85)
    group.rotation.y = Math.PI

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x18110c, roughness: 0.48, metalness: 0.08 })
    const matMat = new THREE.MeshStandardMaterial({ color: 0xf7f2e8, roughness: 0.85 })

    const leaders = [
      // ROW 1 (TOP) — Pimpinan & Rektor Periode 1957 – 1994 (7 Tokoh)
      { key: 'rector_imam_bardjo', name: '1. Prof. Mr. Imam Bardjo', role: '1957–1961 · Presiden Univ. I', row: 1, col: 0, idx: 0 },
      { key: 'rector_soedarto', name: '2. Prof. Mr. Soedarto, S.H.', role: '1961–62 & 1977–86 · Rektor Ke-2', row: 1, col: 1, idx: 1 },
      { key: 'rector_jakub_rais', name: '3. Prof. Dr. Ir. Jakub Rais', role: '1965–1966 · Caretaker Rektor', row: 1, col: 2, idx: 2 },
      { key: 'rector_moeljono_sostro', name: '4. Drs. Moeljono Sostro', role: '1966–1973 · Rektor Ke-4', row: 1, col: 3, idx: 3 },
      { key: 'rector_soenarjo', name: '5. Prof. Dr. Soenarjo, S.H.', role: '1973–1977 · Rektor Ke-5', row: 1, col: 4, idx: 4 },
      { key: 'rector_muladi', name: '6. Prof. Dr. H. Muladi, S.H.', role: '1986–1994 · Rektor Ke-6', row: 1, col: 5, idx: 5 },
      { key: 'rector_eko_budihardjo', name: '7. Prof. Ir. Eko Budihardjo', role: '1994–1998 · Rektor Ke-7', row: 1, col: 6, idx: 6 },

      // ROW 0 (BOTTOM) — Pimpinan & Rektor Periode 1998 – Kini + Presidium (6 Tokoh)
      { key: 'rector_temijo', name: '8. Prof. Dr. Temijo, S.H.', role: '1998–2006 · Rektor Ke-8', row: 0, col: 0.5, idx: 7 },
      { key: 'rector_susilo_wibowo', name: '9. Prof. Dr. Susilo Wibowo', role: '2006–2010 · Rektor Ke-9', row: 0, col: 1.5, idx: 8 },
      { key: 'rector_sudharto_hadi', name: '10. Prof. Ir. Sudharto P. Hadi', role: '2010–2015 · Rektor Ke-10', row: 0, col: 2.5, idx: 9 },
      { key: 'rector_yos_johan', name: '11. Prof. Dr. Yos Johan Utama', role: '2015–2024 · Rektor Ke-11', row: 0, col: 3.5, idx: 10 },
      { key: 'rector_suharnomo', name: '12. Prof. Dr. Suharnomo, S.E.', role: '2024–2029 · Rektor Ke-12 (Kini)', row: 0, col: 4.5, idx: 11 },
      { key: 'founder_soerodjo', name: '13. Dewan Presidium Yayasan', role: '1956 · Pimpinan Kolegial Awal', row: 0, col: 5.5, idx: 12 },
    ]

    const fw = 0.88
    const fh = 0.84
    const colSpacing = 1.30

    const sharedFrameGeo = new THREE.BoxGeometry(fw, fh, 0.045)
    const sharedMatGeo = new THREE.PlaneGeometry(fw - 0.07, fh - 0.07)
    const sharedPortraitGeo = new THREE.PlaneGeometry(fw - 0.14, fh - 0.14)
    const sharedPlateGeo = new THREE.BoxGeometry(fw * 0.96, 0.16, 0.015)

    leaders.forEach((r) => {
      const isTop = r.row === 1
      const x = (r.col - 3) * colSpacing
      const y = isTop ? 2.55 : 1.30 // 41cm vertical gap, completely eliminating overlap!

      const frameGroup = new THREE.Group()
      frameGroup.position.set(x, y, 0)

      const frame = new THREE.Mesh(sharedFrameGeo, frameMat)
      frame.castShadow = true
      frameGroup.add(frame)

      const mat = new THREE.Mesh(sharedMatGeo, matMat)
      mat.position.z = 0.024
      frameGroup.add(mat)

      const portrait = new THREE.Mesh(
        sharedPortraitGeo,
        new THREE.MeshStandardMaterial({
          map: this.assetManager.getImageTexture(r.key),
          roughness: 0.42,
        }),
      )
      portrait.position.set(0, 0.035, 0.03)
      frameGroup.add(portrait)

      const plate = new THREE.Mesh(sharedPlateGeo, this.label(r.name, r.role))
      plate.position.set(0, -fh / 2 - 0.08, 0.015)
      frameGroup.add(plate)

      group.add(frameGroup)

      this.interactiveTargets.push({
        id: 'directors_13',
        zoneNumber: 1,
        name: r.name,
        areaName: 'Galeri Tokoh Direktorat & Rektorat — Dinding Selatan',
        subItemIndex: r.idx,
        mesh: frameGroup,
        highlightMeshes: [frame, portrait],
        position: new THREE.Vector3(1.8 + x, y, 7.6),
      })
    })

    // Header Title Plaque for Directorate Gallery
    const title = new THREE.Mesh(
      new THREE.BoxGeometry(8.6, 0.28, 0.025),
      this.label('GALERI TOKOH DIREKTORAT & REKTORAT DARI PERIODE KE PERIODE', 'Suksesi Kepemimpinan Universitas Diponegoro (1957 — Kini)'),
    )
    title.position.set(0, 3.42, 0.015)
    group.add(title)

    this.group.add(group)
  }

  // =========================================================================
  // 5. PHYSICAL EXHIBIT: Early Campus Photo Documentation (North Wall)
  // =========================================================================
  private buildCampusEarlyPhotosGallery(): void {
    const group = new THREE.Group()
    group.position.set(0, 0, -7.85)

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1c1510, roughness: 0.5, metalness: 0.06 })
    const matMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e4, roughness: 0.85 })

    const photos = [
      { key: 'photo_campus_pleburan', title: '1. Kampus Pleburan — 1957', short: 'PLEBURAN · 1957', col: -1, row: 1, idx: 0 },
      { key: 'photo_campus_gris', title: '2. Aula GRIS Jl. Pemuda — 1957', short: 'AULA GRIS · 1957', col: 0, row: 1, idx: 1 },
      { key: 'photo_historic_lecture', title: '3. Kuliah Perdana di GRIS — 1957', short: 'KULIAH PERDANA', col: 1, row: 1, idx: 2 },
      { key: 'photo_dies_soekarno', title: '4. Dies Natalis III & Bung Karno', short: 'DIES NATALIS · 1960', col: -1, row: 0, idx: 3 },
      { key: 'photo_historic_lab', title: '5. Lab & Ukur Tanah FT — 1962', short: 'LABORATORIUM · 1962', col: 0, row: 0, idx: 4 },
      { key: 'history_ptn', title: '6. Naskah Penegerian PP 7/1961', short: 'PENEGERIAN · 1961', col: 1, row: 0, idx: 5 },
    ]

    const fw = 1.45
    const fh = 0.88
    const spacing = 2.40

    const sharedPhotoFrameGeo = new THREE.BoxGeometry(fw, fh, 0.045)
    const sharedPhotoMatGeo = new THREE.PlaneGeometry(fw - 0.07, fh - 0.07)
    const sharedPhotoImgGeo = new THREE.PlaneGeometry(fw - 0.16, fh - 0.14)
    const sharedPhotoTagGeo = new THREE.BoxGeometry(fw * 0.86, 0.13, 0.015)

    photos.forEach((p) => {
      const px = p.col * spacing
      const py = p.row === 1 ? 2.52 : 1.48
      const frameGroup = new THREE.Group()
      frameGroup.position.set(px, py, 0)

      const frame = new THREE.Mesh(sharedPhotoFrameGeo, frameMat)
      frame.castShadow = true
      frameGroup.add(frame)

      const mat = new THREE.Mesh(sharedPhotoMatGeo, matMat)
      mat.position.z = 0.024
      frameGroup.add(mat)

      const photo = new THREE.Mesh(
        sharedPhotoImgGeo,
        new THREE.MeshStandardMaterial({
          map: this.assetManager.getImageTexture(p.key),
          roughness: 0.42,
        }),
      )
      photo.position.z = 0.03
      frameGroup.add(photo)

      const tag = new THREE.Mesh(sharedPhotoTagGeo, this.label(p.short))
      tag.position.set(0, -fh / 2 - 0.085, 0.012)
      frameGroup.add(tag)

      group.add(frameGroup)

      this.interactiveTargets.push({
        id: 'photos',
        zoneNumber: 1,
        name: p.title,
        areaName: 'Galeri Foto Kampus Awal — Dinding Utara',
        subItemIndex: p.idx,
        mesh: frameGroup,
        highlightMeshes: [frame, photo],
        position: new THREE.Vector3(px, py, -7.6),
      })
    })

    const title = new THREE.Mesh(
      new THREE.BoxGeometry(6.4, 0.28, 0.025),
      this.label('GALERI FOTO DOKUMENTASI KAMPUS AWAL (1957–1962)', 'Arsip Visual Kehidupan Akademik Perintis Universitas Diponegoro'),
    )
    title.position.set(0, 3.42, 0.012)
    group.add(title)

    this.group.add(group)
  }

  // =========================================================================
  // 6. INTERACTIVE HISTORICAL BOOKSHELF SYSTEM (Rak 01 s/d Rak 05)
  // =========================================================================
  private buildHistoricalBookshelves(): void {
    const walnutMat = new THREE.MeshStandardMaterial({ color: 0x22150e, roughness: 0.48, metalness: 0.04 })
    const shelfWood = new THREE.MeshStandardMaterial({ color: 0x2a1a12, roughness: 0.52, metalness: 0.03 })
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xbfa35a, roughness: 0.35, metalness: 0.65 })
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.85 })

    const shelfConfigs = [
      // East Wall — 3 Classical Bookcases
      {
        id: 'shelf_z1',
        cat: BOOKSHELF_CATEGORIES[0],
        x: 9.75,
        z: -4.5,
        rotY: -Math.PI / 2,
        title: 'RAK 01 · THE ORIGIN OF UNDIP',
        sub: 'Arsip Akta 1956 & Amanat Bung Karno 1960',
      },
      {
        id: 'shelf_z2',
        cat: BOOKSHELF_CATEGORIES[1],
        x: 9.75,
        z: 0.0,
        rotY: -Math.PI / 2,
        title: 'RAK 02 · THE GROWTH OF KNOWLEDGE',
        sub: 'Evolusi 11 Fakultas & PIP Kelautan Teluk Awur',
      },
      {
        id: 'shelf_z3',
        cat: BOOKSHELF_CATEGORIES[2],
        x: 9.75,
        z: 4.5,
        rotY: -Math.PI / 2,
        title: 'RAK 03 · THE HERITAGE OF UNDIP',
        sub: 'Pangeran Diponegoro, Panji & Budaya Almamater',
      },
      // North Wall Flanks — 2 Bookcases
      {
        id: 'shelf_z4',
        cat: BOOKSHELF_CATEGORIES[3],
        x: -7.8,
        z: -7.75,
        rotY: 0,
        title: 'RAK 04 · UNDIP TODAY',
        sub: 'Kemandirian PTN-BH, RSND & QS World Ranking',
      },
      {
        id: 'shelf_z5',
        cat: BOOKSHELF_CATEGORIES[4],
        x: 7.8,
        z: -7.75,
        rotY: 0,
        title: 'RAK 05 · UNDIP FUTURE',
        sub: 'Smart Digital Campus, AI & Indonesia Emas 2045',
      },
    ]

    const bw = 2.4
    const bh = 2.8
    const bd = 0.52

    shelfConfigs.forEach((cfg) => {
      const bcase = new THREE.Group()
      bcase.position.set(cfg.x, 0, cfg.z)
      bcase.rotation.y = cfg.rotY

      // Side uprights
      const uprightGeo = new THREE.BoxGeometry(0.08, bh, bd)
      const leftUpright = new THREE.Mesh(uprightGeo, walnutMat)
      leftUpright.position.set(-bw / 2 + 0.04, bh / 2, 0)
      leftUpright.castShadow = true
      bcase.add(leftUpright)

      const rightUpright = new THREE.Mesh(uprightGeo, walnutMat)
      rightUpright.position.set(bw / 2 - 0.04, bh / 2, 0)
      rightUpright.castShadow = true
      bcase.add(rightUpright)

      // Back panel
      const backPanel = new THREE.Mesh(new THREE.BoxGeometry(bw - 0.16, bh - 0.2, 0.03), walnutMat)
      backPanel.position.set(0, bh / 2, -bd / 2 + 0.02)
      bcase.add(backPanel)

      // Plinth base and Cornice crown
      const baseGeo = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.08, 0.14, bd + 0.06), walnutMat)
      baseGeo.position.y = 0.07
      baseGeo.castShadow = true
      bcase.add(baseGeo)

      const crownGeo = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.12, 0.16, bd + 0.08), walnutMat)
      crownGeo.position.y = bh - 0.08
      crownGeo.castShadow = true
      bcase.add(crownGeo)

      // Brass header plaque
      const brassPlaqueMat = new THREE.MeshStandardMaterial({
        map: this.assetManager.createBrassPlaque(cfg.title, cfg.sub),
        roughness: 0.38,
        metalness: 0.55,
      })
      const plaque = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.88, 0.18, 0.02), brassPlaqueMat)
      plaque.position.set(0, bh - 0.08, bd / 2 + 0.01)
      bcase.add(plaque)

      // 4 Tiers of shelves
      const shelfLevels = [0.38, 0.96, 1.54, 2.12]
      shelfLevels.forEach((sy) => {
        const shelfMesh = new THREE.Mesh(new THREE.BoxGeometry(bw - 0.16, 0.045, bd - 0.04), shelfWood)
        shelfMesh.position.set(0, sy, 0)
        shelfMesh.castShadow = true
        shelfMesh.receiveShadow = true
        bcase.add(shelfMesh)
      })

      // Decorative background book stacks on bottom and top shelves
      this.populateDecorativeBooks(bcase, bw - 0.22, shelfLevels[0] + 0.025, bd - 0.08, paperMat)
      this.populateDecorativeBooks(bcase, bw - 0.22, shelfLevels[3] + 0.025, bd - 0.08, paperMat)

      // Find interactive books belonging to this shelf
      const shelfBooks = MUSEUM_BOOKS.filter((b) => b.shelfId === cfg.id)

      // Distribute interactive books across eye-level shelves (shelfLevels[1] and shelfLevels[2])
      shelfBooks.forEach((bookData, bIdx) => {
        const targetShelfY = bIdx % 2 === 0 ? shelfLevels[1] + 0.025 : shelfLevels[2] + 0.025
        const bookX = (Math.floor(bIdx / 2) - 0.5) * 0.75

        const bookGroup = this.createInteractive3DBook(bookData, brassMat, paperMat)
        bookGroup.position.set(bookX, targetShelfY, 0.08)
        bcase.add(bookGroup)

        // Register interactive target for this book
        const bookWorldPos = new THREE.Vector3()
        bookGroup.getWorldPosition(bookWorldPos)

        this.interactiveTargets.push({
          id: `book_${bookData.id}`,
          zoneNumber: bookData.zoneNumber,
          name: `📖 ${bookData.title}`,
          areaName: cfg.cat.label,
          subItemIndex: bIdx,
          mesh: bookGroup,
          highlightMeshes: [bookGroup.children[0] as THREE.Mesh],
          position: new THREE.Vector3(cfg.x, targetShelfY + 0.2, cfg.z),
          bookData,
        })
      })

      // Also register whole bookcase plaque as interactive target
      this.interactiveTargets.push({
        id: `bookshelf_${cfg.cat.zoneNumber}`,
        zoneNumber: cfg.cat.zoneNumber,
        name: `📚 ${cfg.title}`,
        areaName: cfg.cat.label,
        mesh: bcase,
        highlightMeshes: [plaque],
        position: new THREE.Vector3(cfg.x, 1.8, cfg.z),
      })

      this.group.add(bcase)

      // Register collision box for this bookcase
      const halfW = bw / 2 + 0.1
      const halfD = bd / 2 + 0.1
      if (Math.abs(cfg.rotY) > 0.1) {
        // Rotated 90 degrees (East wall)
        this.obstacleBoxes.push({
          minX: cfg.x - halfD,
          maxX: cfg.x + halfD,
          minZ: cfg.z - halfW,
          maxZ: cfg.z + halfW,
        })
      } else {
        // Unrotated (North wall)
        this.obstacleBoxes.push({
          minX: cfg.x - halfW,
          maxX: cfg.x + halfW,
          minZ: cfg.z - halfD,
          maxZ: cfg.z + halfD,
        })
      }
    })
  }

  /**
   * Helper to construct realistic 3D books on shelves
   */
  private createInteractive3DBook(
    bookData: MuseumBook,
    brassMat: THREE.Material,
    paperMat: THREE.Material,
  ): THREE.Group {
    const book = new THREE.Group()

    const bookW = 0.08
    const bookH = 0.38
    const bookD = 0.26

    const coverMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(bookData.coverColor),
      roughness: 0.55,
      metalness: 0.08,
    })

    // Spine & cover body
    const cover = new THREE.Mesh(new THREE.BoxGeometry(bookW, bookH, bookD), coverMat)
    cover.position.y = bookH / 2
    cover.castShadow = true
    book.add(cover)

    // Inner paper pages block
    const paper = new THREE.Mesh(new THREE.BoxGeometry(bookW - 0.018, bookH - 0.024, bookD - 0.02), paperMat)
    paper.position.set(0, bookH / 2, -0.01)
    book.add(paper)

    // Gilded brass spine ribs
    const ribGeo = new THREE.BoxGeometry(bookW + 0.006, 0.012, 0.02)
    ;[0.08, 0.18, 0.28].forEach((ry) => {
      const rib = new THREE.Mesh(ribGeo, brassMat)
      rib.position.set(0, ry, bookD / 2)
      book.add(rib)
    })

    // Brass Spine Title Plate
    const titlePlate = new THREE.Mesh(
      new THREE.BoxGeometry(bookW * 0.9, 0.09, 0.005),
      this.label(bookData.spineLabel),
    )
    titlePlate.position.set(0, bookH / 2 + 0.02, bookD / 2 + 0.004)
    book.add(titlePlate)

    return book
  }

  /**
   * Populate realistic background vintage books on shelves
   */
  private populateDecorativeBooks(
    parent: THREE.Group,
    shelfWidth: number,
    shelfY: number,
    shelfDepth: number,
    paperMat: THREE.Material,
  ): void {
    const vintageColors = [0x2c1d14, 0x3d2719, 0x4a2e1d, 0x221811, 0x1f232b, 0x36241b]
    let currentX = -shelfWidth / 2 + 0.04

    while (currentX < shelfWidth / 2 - 0.05) {
      const bW = 0.045 + Math.random() * 0.03
      const bH = 0.26 + Math.random() * 0.12
      const bD = shelfDepth * (0.75 + Math.random() * 0.15)
      const color = vintageColors[Math.floor(Math.random() * vintageColors.length)]

      const bookMat = new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0.04 })
      const bookMesh = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, bD), bookMat)
      bookMesh.position.set(currentX + bW / 2, shelfY + bH / 2, -0.02)
      bookMesh.castShadow = true
      parent.add(bookMesh)

      // Top paper trim
      const paperTrim = new THREE.Mesh(new THREE.PlaneGeometry(bW - 0.008, bD - 0.01), paperMat)
      paperTrim.rotation.x = -Math.PI / 2
      paperTrim.position.set(currentX + bW / 2, shelfY + bH + 0.001, -0.02)
      parent.add(paperTrim)

      currentX += bW + 0.006
    }
  }
}
