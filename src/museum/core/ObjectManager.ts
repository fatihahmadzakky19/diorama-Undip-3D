import * as THREE from 'three'
import { AssetManager } from './AssetManager'

export interface InteractiveTarget {
  id: string
  zoneNumber: number
  name: string
  areaName: string
  subItemIndex?: number
  mesh: THREE.Object3D
  highlightMeshes: THREE.Mesh[]
  position: THREE.Vector3
}

export interface ObstacleBox {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

/**
 * ObjectManager builds the four historical collections inside the room.
 * Furniture is kept close to the walls so the central exploration path stays
 * open, and every exhibit keeps clear sight-lines to its neighbours.
 */
export class ObjectManager {
  private group: THREE.Group
  private zone1Group: THREE.Group
  private zone1Targets: InteractiveTarget[] = []
  private zone1Obstacles: ObstacleBox[] = []

  private zone2Group: THREE.Group
  private zone2Targets: InteractiveTarget[] = []
  private zone2Obstacles: ObstacleBox[] = []

  private assetManager: AssetManager
  private interactiveTargets: InteractiveTarget[] = []
  private obstacleBoxes: ObstacleBox[] = []
  private bookPagePivot: THREE.Group | null = null
  private isPageTurning = false
  private pageTurnProgress = 0
  private labelMaterialCache = new Map<string, THREE.MeshStandardMaterial>()

  constructor() {
    this.assetManager = AssetManager.getInstance()

    // Build Zone 1 objects
    this.zone1Group = new THREE.Group()
    this.zone1Group.name = 'Zone1ObjectGroup'
    this.group = this.zone1Group
    this.interactiveTargets = this.zone1Targets
    this.obstacleBoxes = this.zone1Obstacles
    this.buildAllObjects()

    // Build Zone 2 objects
    this.zone2Group = new THREE.Group()
    this.zone2Group.name = 'Zone2ObjectGroup'
    this.buildZone2Objects()

    // Backwards compatibility: default group is zone1Group
    this.group = this.zone1Group
    this.interactiveTargets = this.zone1Targets
    this.obstacleBoxes = this.zone1Obstacles
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

  public getZone1Group(): THREE.Group {
    return this.zone1Group
  }

  public getZone1Targets(): InteractiveTarget[] {
    return this.zone1Targets
  }

  public getZone1Obstacles(): ObstacleBox[] {
    return this.zone1Obstacles
  }

  public getZone2Group(): THREE.Group {
    return this.zone2Group
  }

  public getZone2Targets(): InteractiveTarget[] {
    return this.zone2Targets
  }

  public getZone2Obstacles(): ObstacleBox[] {
    return this.zone2Obstacles
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

  private buildAllObjects(): void {
    this.buildFoundingHistoryAndArchive()
    this.buildCampusPhotos()
    this.buildFoundersGallery()
    this.buildOfficialDocuments()
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

  // =================================================================
  // FOUNDING HISTORY & ARCHIVE — West wing
  // Elegant walnut lectern, open history book and proportional archive cabinet
  // =================================================================
  private buildFoundingHistoryAndArchive(): void {
    const walnut = new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.46, metalness: 0.04 })
    const dark = new THREE.MeshStandardMaterial({ color: 0x14100c, roughness: 0.55, metalness: 0.12 })
    const bronze = new THREE.MeshStandardMaterial({ color: 0x3a2a1c, roughness: 0.42, metalness: 0.5 })

    // Wall dedication panel — restrained museum panel, not a large blank field
    const wallPanel = new THREE.Group()
    wallPanel.position.set(-7.12, 2.35, -0.6)
    wallPanel.rotation.y = Math.PI / 2
    const panelFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.25, 0.05), walnut)
    wallPanel.add(panelFrame)
    const panelCanvas = new THREE.Mesh(
      new THREE.PlaneGeometry(2.28, 1.13),
      new THREE.MeshStandardMaterial({ map: this.assetManager.getArea1WallPanelTexture(), roughness: 0.5 }),
    )
    panelCanvas.position.z = 0.028
    wallPanel.add(panelCanvas)
    const lampBar = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.75, 8), dark)
    lampBar.rotation.z = Math.PI / 2
    lampBar.position.set(0, 0.71, 0.13)
    wallPanel.add(lampBar)
    this.group.add(wallPanel)

    // Lectern — slim pedestal, tapered reading desk, no excessive carving
    const lectern = new THREE.Group()
    lectern.position.set(-4.9, 0, -0.6)
    lectern.rotation.y = Math.PI / 2

    const base1 = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.07, 0.6), walnut)
    base1.position.y = 0.035
    base1.castShadow = true
    lectern.add(base1)
    const base2 = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.05, 0.5), walnut)
    base2.position.y = 0.095
    lectern.add(base2)
    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.65, 0.28), walnut)
    pedestal.position.y = 0.44
    pedestal.castShadow = true
    lectern.add(pedestal)
    const pedestalCap = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.055, 0.36), walnut)
    pedestalCap.position.y = 0.79
    lectern.add(pedestalCap)

    const plaque = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.13, 0.015),
      new THREE.MeshStandardMaterial({
        map: this.assetManager.createBrassPlaque('BUKU SEJARAH RESMI', 'Kronik 1956 — Kini'),
        roughness: 0.4,
        metalness: 0.4,
      }),
    )
    plaque.position.set(0, 0.47, 0.15)
    lectern.add(plaque)

    const desk = new THREE.Group()
    desk.position.set(0, 0.94, 0)
    desk.rotation.x = -0.38
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.045, 0.58), walnut)
    deskTop.castShadow = true
    deskTop.receiveShadow = true
    desk.add(deskTop)
    const lip = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.03, 0.025), bronze)
    lip.position.set(0, 0.035, 0.28)
    desk.add(lip)

    // Discreet reading lamp for the book
    const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.19, 8), dark)
    lampArm.position.set(0.33, 0.12, -0.21)
    desk.add(lampArm)
    const lampShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.045, 0.1, 12),
      new THREE.MeshStandardMaterial({
        color: 0x1c1610,
        emissive: 0xfff2d8,
        emissiveIntensity: 0.4,
        roughness: 0.35,
      }),
    )
    lampShade.rotation.z = Math.PI / 2
    lampShade.position.set(0.33, 0.21, -0.21)
    desk.add(lampShade)

    // Interactive open book
    const book = new THREE.Group()
    book.position.set(0, 0.035, 0.005)
    const cover = new THREE.Mesh(
      new THREE.BoxGeometry(0.74, 0.025, 0.48),
      new THREE.MeshStandardMaterial({ color: 0x2e1a10, roughness: 0.68 }),
    )
    cover.castShadow = true
    book.add(cover)
    const paper = new THREE.MeshStandardMaterial({ color: 0xeee6d6, roughness: 0.78 })
    const leftBlock = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.028, 0.44), paper)
    leftBlock.position.set(-0.175, 0.018, 0)
    book.add(leftBlock)
    const rightBlock = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.028, 0.44), paper)
    rightBlock.position.set(0.175, 0.018, 0)
    book.add(rightBlock)
    const pages = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 0.44),
      new THREE.MeshStandardMaterial({ map: this.assetManager.getOpenBookPagesTexture(), roughness: 0.5 }),
    )
    pages.rotation.x = -Math.PI / 2
    pages.position.y = 0.035
    book.add(pages)

    const pagePivot = new THREE.Group()
    pagePivot.position.set(0, 0.037, 0)
    const turningPage = new THREE.Mesh(
      new THREE.PlaneGeometry(0.34, 0.42),
      new THREE.MeshStandardMaterial({ color: 0xf5eedc, roughness: 0.6, side: THREE.DoubleSide }),
    )
    turningPage.rotation.x = -Math.PI / 2
    turningPage.position.set(0.17, 0, 0)
    pagePivot.add(turningPage)
    book.add(pagePivot)
    this.bookPagePivot = pagePivot

    desk.add(book)
    lectern.add(desk)
    this.group.add(lectern)

    this.interactiveTargets.push({
      id: 'history',
      zoneNumber: 1,
      name: 'Buku Sejarah Resmi Universitas Diponegoro',
      areaName: 'Sejarah Pendirian & Arsip — Sayap Barat',
      mesh: book,
      highlightMeshes: [pages, cover, plaque],
      position: new THREE.Vector3(-4.9, 1.06, -0.6),
    })
    this.obstacleBoxes.push({ minX: -5.35, maxX: -4.45, minZ: -1.1, maxZ: -0.1 })

    // Archival cabinet — sized to the wall, clear of the walking route
    const cabinet = new THREE.Group()
    cabinet.position.set(-6.55, 0, 2.6)
    cabinet.rotation.y = Math.PI / 2
    const cabinetBody = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.9, 0.42), walnut)
    cabinetBody.position.y = 0.95
    cabinetBody.castShadow = true
    cabinet.add(cabinetBody)
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.06, 0.48), walnut)
    cornice.position.y = 1.93
    cabinet.add(cornice)
    const drawerMat = new THREE.MeshStandardMaterial({ color: 0x342014, roughness: 0.5 })
    const pullMat = new THREE.MeshStandardMaterial({ color: 0x2a1d14, roughness: 0.45, metalness: 0.6 })
    const cardMat = new THREE.MeshStandardMaterial({ color: 0xf4ecdd, roughness: 0.8 })
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        const dx = -0.42 + c * 0.42
        const dy = 0.26 + r * 0.43
        const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.37, 0.018), drawerMat)
        drawer.position.set(dx, dy, 0.216)
        cabinet.add(drawer)
        const pull = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.07, 8), pullMat)
        pull.rotation.z = Math.PI / 2
        pull.position.set(dx, dy, 0.23)
        cabinet.add(pull)
        const card = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.04), cardMat)
        card.position.set(dx, dy + 0.065, 0.227)
        cabinet.add(card)
      }
    }
    const ledgerMat = new THREE.MeshStandardMaterial({ color: 0x24170f, roughness: 0.65 })
    for (let f = 0; f < 4; f++) {
      const folder = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.28, 0.32), ledgerMat)
      folder.position.set(-0.33 + f * 0.11, 1.83, 0.02)
      folder.rotation.z = 0.04 * (f - 1.5)
      cabinet.add(folder)
    }
    const cabPlaque = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.16, 0.015), this.label('ARSIP PENDIRIAN 1956', 'Akta Notaris No. 59'))
    cabPlaque.position.set(0, 1.64, 0.22)
    cabinet.add(cabPlaque)
    this.group.add(cabinet)

    this.interactiveTargets.push({
      id: 'archive',
      zoneNumber: 1,
      name: 'Lemari Arsip Akta Notaris No. 59 Tahun 1956',
      areaName: 'Sejarah Pendirian & Arsip — Sayap Barat',
      mesh: cabinet,
      highlightMeshes: [cabinetBody, cabPlaque],
      position: new THREE.Vector3(-6.55, 1.35, 2.6),
    })
    this.obstacleBoxes.push({ minX: -6.85, maxX: -6.25, minZ: 1.85, maxZ: 3.35 })
  }

  // =================================================================
  // EARLY CAMPUS PHOTO GALLERY — North wall
  // Six consistent minimalist frames; photographs are the focus
  // =================================================================
  private buildCampusPhotos(): void {
    const group = new THREE.Group()
    group.position.set(0, 0, -7.1)

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x19130e, roughness: 0.5, metalness: 0.08 })
    const matMat = new THREE.MeshStandardMaterial({ color: 0xf8f4ec, roughness: 0.85 })

    const photos = [
      { key: 'photo_campus_pleburan', title: 'Gedung Utama Kampus Pleburan — 1957', short: 'PLEBURAN · 1957', col: -1, row: 1, idx: 0 },
      { key: 'photo_campus_gris', title: 'Aula GRIS Jl. Pemuda — 1957', short: 'AULA GRIS · 1957', col: 0, row: 1, idx: 1 },
      { key: 'photo_historic_lecture', title: 'Kuliah Perdana Angkatan Pertama — 1957', short: 'KULIAH PERTAMA · 1957', col: 1, row: 1, idx: 2 },
      { key: 'photo_dies_soekarno', title: 'Dies Natalis III bersama Ir. Soekarno — 1960', short: 'DIES NATALIS III · 1960', col: -1, row: 0, idx: 3 },
      { key: 'photo_historic_lab', title: 'Laboratorium & Ukur Tanah Teknik — 1962', short: 'LABORATORIUM · 1962', col: 0, row: 0, idx: 4 },
      { key: 'history_ptn', title: 'Naskah Penegerian PP No. 7 Tahun 1961', short: 'PENEGERIAN · 1961', col: 1, row: 0, idx: 5 },
    ]

    const fw = 1.45
    const fh = 0.88
    const spacing = 2.9

    // Shared geometries across all 6 campus photos
    const sharedPhotoFrameGeo = new THREE.BoxGeometry(fw, fh, 0.045)
    const sharedPhotoMatGeo = new THREE.PlaneGeometry(fw - 0.07, fh - 0.07)
    const sharedPhotoImgGeo = new THREE.PlaneGeometry(fw - 0.16, fh - 0.14)
    const sharedPhotoTagGeo = new THREE.BoxGeometry(fw * 0.86, 0.13, 0.015)

    photos.forEach((p) => {
      const px = p.col * spacing
      const py = p.row === 1 ? 2.52 : 1.58
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
        new THREE.MeshStandardMaterial({ map: this.assetManager.getImageTexture(p.key), roughness: 0.42 }),
      )
      photo.position.z = 0.03
      frameGroup.add(photo)
      const tag = new THREE.Mesh(sharedPhotoTagGeo, this.label(p.short))
      tag.position.set(0, -fh / 2 - 0.085, 0.012)
      frameGroup.add(tag)

      group.add(frameGroup)
      this.interactiveTargets.push({
        id: 'photos',
        zoneNumber: 2,
        name: p.title,
        areaName: 'Galeri Foto Kampus Awal — Dinding Utara',
        subItemIndex: p.idx,
        mesh: frameGroup,
        highlightMeshes: [frame, photo],
        position: new THREE.Vector3(px, py, -6.85),
      })
    })

    const title = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.28, 0.025), this.label('GALERI FOTO KAMPUS AWAL', 'Dokumentasi Sejarah 1957 — 1962'))
    title.position.set(0, 3.42, 0.012)
    group.add(title)
    this.group.add(group)
  }

  // =================================================================
  // RECTOR & LEADERSHIP SUCCESSION GALLERY — South wall
  // 12 Undip Rectors arranged in a pristine, spaced-out 6x2 grid
  // Row 1 (Top): Historical succession (1957 – 1994)
  // Row 0 (Bottom): Modern & Development succession (1994 – Kini)
  // =================================================================
  private buildFoundersGallery(): void {
    const group = new THREE.Group()
    group.position.set(0, 0, 7.1)
    group.rotation.y = Math.PI

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x18110c, roughness: 0.48, metalness: 0.08 })
    const matMat = new THREE.MeshStandardMaterial({ color: 0xf7f2e8, roughness: 0.85 })

    const rectors = [
      // BARIS 1 (ATAS) — Pimpinan & Rektor Periode 1957 – 1994
      { key: 'rector_imam_bardjo', name: '1. Prof. Mr. Imam Bardjo', role: '1957–1961 · Presiden Univ. I', row: 1, col: 0, idx: 0 },
      { key: 'rector_soedarto', name: '2. Prof. Mr. Soedarto, S.H.', role: '1961–62 & 1977–86 · Rektor Ke-2', row: 1, col: 1, idx: 1 },
      { key: 'rector_jakub_rais', name: '3. Prof. Dr. Ir. Jakub Rais', role: '1965–1966 · Caretaker Rektor', row: 1, col: 2, idx: 2 },
      { key: 'rector_moeljono_sostro', name: '4. Drs. Moeljono Sostrohadikoesoemo', role: '1966–1973 · Rektor Ke-4', row: 1, col: 3, idx: 3 },
      { key: 'rector_soenarjo', name: '5. Prof. Dr. Soenarjo, S.H.', role: '1973–1977 · Rektor Ke-5', row: 1, col: 4, idx: 4 },
      { key: 'rector_muladi', name: '6. Prof. Dr. H. Muladi, S.H.', role: '1986–1994 · Rektor Ke-6', row: 1, col: 5, idx: 5 },

      // BARIS 0 (BAWAH) — Pimpinan & Rektor Periode 1994 – Kini
      { key: 'rector_eko_budihardjo', name: '7. Prof. Ir. Eko Budihardjo, M.Sc.', role: '1994–1998 · Rektor Ke-7', row: 0, col: 0, idx: 6 },
      { key: 'rector_temijo', name: '8. Prof. Dr. Temijo, S.H.', role: '1998–2006 · Rektor Ke-8', row: 0, col: 1, idx: 7 },
      { key: 'rector_susilo_wibowo', name: '9. Prof. Dr. dr. H. Susilo Wibowo', role: '2006–2010 · Rektor Ke-9', row: 0, col: 2, idx: 8 },
      { key: 'rector_sudharto_hadi', name: '10. Prof. Ir. Sudharto P. Hadi', role: '2010–2015 · Rektor Ke-10', row: 0, col: 3, idx: 9 },
      { key: 'rector_yos_johan', name: '11. Prof. Dr. Yos Johan Utama', role: '2015–2024 · Rektor Ke-11', row: 0, col: 4, idx: 10 },
      { key: 'rector_suharnomo', name: '12. Prof. Dr. Suharnomo, S.E.', role: '2024–2029 · Rektor Ke-12 (Kini)', row: 0, col: 5, idx: 11 },
    ]

    const fw = 0.90
    const fh = 0.85
    const colSpacing = 1.70

    // Shared geometries across all 12 rectors
    const sharedRectorFrameGeo = new THREE.BoxGeometry(fw, fh, 0.045)
    const sharedRectorMatGeo = new THREE.PlaneGeometry(fw - 0.07, fh - 0.07)
    const sharedRectorPortraitGeo = new THREE.PlaneGeometry(fw - 0.14, fh - 0.14)
    const sharedRectorPlateGeo = new THREE.BoxGeometry(fw * 0.96, 0.16, 0.015)

    rectors.forEach((r) => {
      const isTop = r.row === 1
      const x = (r.col - 2.5) * colSpacing // Symmetrical alignment across 6 columns
      const y = isTop ? 2.55 : 1.30 // 22cm vertical gap, completely eliminating overlap
      const frameGroup = new THREE.Group()
      frameGroup.position.set(x, y, 0)

      const frame = new THREE.Mesh(sharedRectorFrameGeo, frameMat)
      frame.castShadow = true
      frameGroup.add(frame)
      const mat = new THREE.Mesh(sharedRectorMatGeo, matMat)
      mat.position.z = 0.024
      frameGroup.add(mat)
      const portrait = new THREE.Mesh(
        sharedRectorPortraitGeo,
        new THREE.MeshStandardMaterial({ map: this.assetManager.getImageTexture(r.key), roughness: 0.45 }),
      )
      portrait.position.z = 0.03
      frameGroup.add(portrait)
      const nameplate = new THREE.Mesh(sharedRectorPlateGeo, this.label(r.name, r.role))
      nameplate.position.set(0, -fh / 2 - 0.10, 0.012)
      frameGroup.add(nameplate)

      group.add(frameGroup)
      this.interactiveTargets.push({
        id: 'founders',
        zoneNumber: 3,
        name: `Rektor: ${r.name}`,
        areaName: 'Galeri Rektor & Pimpinan — Dinding Selatan',
        subItemIndex: r.idx,
        mesh: frameGroup,
        highlightMeshes: [frame, portrait],
        // Group is rotated 180°, so world X is inverted
        position: new THREE.Vector3(-x, y, 6.85),
      })
    })

    const title = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 0.32, 0.025),
      this.label(
        'GALERI REKTOR & PIMPINAN UNIVERSITAS DIPONEGORO',
        'Suksesi Tokoh Kepemimpinan Rektorat dari Masa ke Masa (1957 — Kini)',
      ),
    )
    title.position.set(0, 3.35, 0.012)
    group.add(title)
    this.group.add(group)
  }

  // =================================================================
  // OFFICIAL DOCUMENTS — East wing
  // Glass-topped walnut vitrine plus three minimally framed wall documents
  // =================================================================
  private buildOfficialDocuments(): void {
    const walnut = new THREE.MeshStandardMaterial({ color: 0x28190f, roughness: 0.46, metalness: 0.04 })
    const bronze = new THREE.MeshStandardMaterial({ color: 0x3a2a1c, roughness: 0.42, metalness: 0.5 })
    const velvet = new THREE.MeshStandardMaterial({ color: 0x21160e, roughness: 0.95 })

    const table = new THREE.Group()
    table.position.set(4.9, 0, 0)
    table.rotation.y = -Math.PI / 2

    const top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.07, 0.85), walnut)
    top.position.y = 0.86
    top.castShadow = true
    top.receiveShadow = true
    table.add(top)
    const apron = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.06, 0.7), walnut)
    apron.position.y = 0.78
    table.add(apron)
    const legGeo = new THREE.CylinderGeometry(0.04, 0.032, 0.82, 12)
    ;[
      [-0.68, 0.41, -0.34],
      [0.68, 0.41, -0.34],
      [-0.68, 0.41, 0.34],
      [0.68, 0.41, 0.34],
    ].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, walnut)
      leg.position.set(x, y, z)
      leg.castShadow = true
      table.add(leg)
    })

    const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.022, 0.7), velvet)
    cushion.position.y = 0.905
    table.add(cushion)

    // Archival sheets with ivory backing so they read as exhibits, not stickers
    const mountMat = new THREE.MeshStandardMaterial({ color: 0xe8dcc4, roughness: 0.85 })
    const makeDocument = (key: string, x: number) => {
      const mount = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.4), mountMat)
      mount.rotation.x = -Math.PI / 2
      mount.position.set(x, 0.918, 0)
      table.add(mount)
      const sheet = new THREE.Mesh(
        new THREE.PlaneGeometry(0.5, 0.35),
        new THREE.MeshStandardMaterial({ map: this.assetManager.getImageTexture(key), roughness: 0.55 }),
      )
      sheet.rotation.x = -Math.PI / 2
      sheet.position.set(x, 0.921, 0)
      table.add(sheet)
      return sheet
    }
    const docLeft = makeDocument('doc_presidential_decree', -0.34)
    const docRight = makeDocument('archive_deed', 0.34)

    const seal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 0.01, 16),
      new THREE.MeshStandardMaterial({ color: 0x74221f, roughness: 0.45 }),
    )
    seal.position.set(0, 0.925, 0.18)
    table.add(seal)
    const quill = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.002, 0.22, 8), bronze)
    quill.rotation.z = 0.5
    quill.position.set(0.05, 1.0, 0.18)
    table.add(quill)

    // Slim glass hood with bronze corner posts
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(1.46, 0.26, 0.72),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.06,
        metalness: 0.05,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      }),
    )
    glass.position.y = 1.05
    table.add(glass)
    ;[
      [-0.73, -0.36],
      [0.73, -0.36],
      [-0.73, 0.36],
      [0.73, 0.36],
    ].forEach(([x, z]) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.26, 8), bronze)
      post.position.set(x, 1.05, z)
      table.add(post)
    })

    const tablePlaque = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.13, 0.015), this.label('DOKUMEN RESMI PENEGERIAN', 'SK Presiden No. 226/1960'))
    tablePlaque.position.set(0, 0.89, 0.4)
    table.add(tablePlaque)
    this.group.add(table)

    this.interactiveTargets.push({
      id: 'documents',
      zoneNumber: 4,
      name: 'Etalase Dokumen Resmi Penegerian Universitas Diponegoro',
      areaName: 'Dokumen & Keputusan Resmi — Sayap Timur',
      subItemIndex: 0,
      mesh: table,
      highlightMeshes: [docLeft, docRight, glass, tablePlaque],
      position: new THREE.Vector3(4.9, 1.0, 0),
    })
    this.obstacleBoxes.push({ minX: 4.35, maxX: 5.45, minZ: -0.95, maxZ: 0.95 })

    // Framed wall documents
    const wallDocs = new THREE.Group()
    wallDocs.position.set(7.1, 2.35, 0)
    wallDocs.rotation.y = -Math.PI / 2
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1b1510, roughness: 0.5, metalness: 0.08 })
    const matMat = new THREE.MeshStandardMaterial({ color: 0xf8f4ec, roughness: 0.85 })
    const docs = [
      { key: 'doc_presidential_decree', title: 'SK Presiden RI No. 226/1960', year: '1960', x: -1.2, idx: 0 },
      { key: 'doc_govt_regulation', title: 'Peraturan Pemerintah No. 7/1961', year: '1961', x: 0, idx: 1 },
      { key: 'doc_crest_charter', title: 'Piagam Panji Diponegoro', year: '1960', x: 1.2, idx: 2 },
    ]
    const wdw = 0.92
    const wdh = 0.68

    // Shared geometries across the 3 wall documents
    const sharedDocFrameGeo = new THREE.BoxGeometry(wdw, wdh, 0.04)
    const sharedDocMatGeo = new THREE.PlaneGeometry(wdw - 0.07, wdh - 0.07)
    const sharedDocSheetGeo = new THREE.PlaneGeometry(wdw - 0.2, wdh - 0.18)
    const sharedDocTagGeo = new THREE.BoxGeometry(wdw * 0.9, 0.12, 0.015)

    docs.forEach((d) => {
      const docGroup = new THREE.Group()
      docGroup.position.set(d.x, 0, 0)
      const frame = new THREE.Mesh(sharedDocFrameGeo, frameMat)
      docGroup.add(frame)
      const mat = new THREE.Mesh(sharedDocMatGeo, matMat)
      mat.position.z = 0.022
      docGroup.add(mat)
      const sheet = new THREE.Mesh(
        sharedDocSheetGeo,
        new THREE.MeshStandardMaterial({ map: this.assetManager.getImageTexture(d.key), roughness: 0.55 }),
      )
      sheet.position.z = 0.028
      docGroup.add(sheet)
      const tag = new THREE.Mesh(sharedDocTagGeo, this.label(d.title, d.year))
      tag.position.set(0, -wdh / 2 - 0.08, 0.01)
      docGroup.add(tag)
      wallDocs.add(docGroup)

      this.interactiveTargets.push({
        id: 'documents',
        zoneNumber: 4,
        name: d.title,
        areaName: 'Dokumen & Keputusan Resmi — Sayap Timur',
        subItemIndex: d.idx,
        mesh: docGroup,
        highlightMeshes: [frame, sheet],
        position: new THREE.Vector3(7.0, 2.35, d.x),
      })
    })

    const wallTitle = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.28, 0.025),
      this.label('DOKUMEN RESMI PENEGERIAN UNDIP', 'Naskah Yuridis Pengakuan Negara'),
    )
    wallTitle.position.set(0, 0.78, 0.012)
    wallDocs.add(wallTitle)
    this.group.add(wallDocs)
  }

  // =========================================================================
  // ZONA 2 OBJECT BUILDERS — THE GROWTH OF KNOWLEDGE
  // =========================================================================

  private buildZone2Objects(): void {
    this.buildZone2CentralMiniature()
    this.buildZone2FacultyDevelopment()
    this.buildZone2CampusTransformation()
    this.buildZone2EducationResearch()
    this.buildZone2AcademicAchievements()
    this.buildZone2AtmosphereProps()
  }

  // 1. CENTRAL EXHIBITION: 3D Miniature Table of Campus Transformation
  private buildZone2CentralMiniature(): void {
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
      // Bronze sabot at foot of leg
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
      opacity: 0.24,
    })
    const vitrineHood = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.65, 2.0), vitrineGlassMat)
    vitrineHood.position.y = 0.85 + 0.325
    miniGroup.add(vitrineHood)

    // Vitrine bronze frame struts
    const frameEdgeMat = brassMat
    const strutV = new THREE.BoxGeometry(0.025, 0.65, 0.025)
    const cornerOffsets = [
      [-1.6, -1.0], [1.6, -1.0], [-1.6, 1.0], [1.6, 1.0]
    ]
    cornerOffsets.forEach(([cx, cz]) => {
      const strut = new THREE.Mesh(strutV, frameEdgeMat)
      strut.position.set(cx, 0.85 + 0.325, cz)
      miniGroup.add(strut)
    })
    const strutTopX = new THREE.BoxGeometry(3.2, 0.025, 0.025)
    const strutTopZ = new THREE.BoxGeometry(0.025, 0.025, 2.0)
    const topBarN = new THREE.Mesh(strutTopX, frameEdgeMat); topBarN.position.set(0, 0.85 + 0.65, -1.0); miniGroup.add(topBarN)
    const topBarS = new THREE.Mesh(strutTopX, frameEdgeMat); topBarS.position.set(0, 0.85 + 0.65, 1.0); miniGroup.add(topBarS)
    const topBarW = new THREE.Mesh(strutTopZ, frameEdgeMat); topBarW.position.set(-1.6, 0.85 + 0.65, 0); miniGroup.add(topBarW)
    const topBarE = new THREE.Mesh(strutTopZ, frameEdgeMat); topBarE.position.set(1.6, 0.85 + 0.65, 0); miniGroup.add(topBarE)

    // Diorama Ground (Inside vitrine, top of table)
    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(3.14, 0.03, 1.94),
      new THREE.MeshStandardMaterial({
        map: this.assetManager.getCampusMiniatureGroundTexture(),
        roughness: 0.85,
      }),
    )
    ground.position.y = 0.865
    ground.receiveShadow = true
    miniGroup.add(ground)

    // --- 3D MINIATURE ARCHITECTURE: GEDUNG WIDYA PURAYA ---
    const widyaPurayaGroup = new THREE.Group()
    widyaPurayaGroup.position.set(0, 0.88, 0)

    // Base podium & grand staircase
    const basePodium = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.09, 0.52), limestoneMat)
    basePodium.position.y = 0.045
    basePodium.castShadow = true
    widyaPurayaGroup.add(basePodium)

    // Colonnade entrance facade
    const facadeWall = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 0.42), limestoneMat)
    facadeWall.position.y = 0.14
    facadeWall.castShadow = true
    widyaPurayaGroup.add(facadeWall)

    for (let c = -3; c <= 3; c++) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.12, 8), limestoneMat)
      col.position.set(c * 0.09, 0.14, 0.22)
      widyaPurayaGroup.add(col)
    }

    // Iconic 3-Tier Stepped Pyramid Roof (Punden Berundak)
    const tier1 = new THREE.Mesh(new THREE.ConeGeometry(0.56, 0.16, 4), terracottaMat)
    tier1.position.y = 0.28
    tier1.rotation.y = Math.PI / 4
    tier1.castShadow = true
    widyaPurayaGroup.add(tier1)

    const tier2 = new THREE.Mesh(new THREE.ConeGeometry(0.40, 0.13, 4), terracottaMat)
    tier2.position.y = 0.38
    tier2.rotation.y = Math.PI / 4
    tier2.castShadow = true
    widyaPurayaGroup.add(tier2)

    const tier3 = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.10, 4), terracottaMat)
    tier3.position.y = 0.46
    tier3.rotation.y = Math.PI / 4
    tier3.castShadow = true
    widyaPurayaGroup.add(tier3)

    // Central Clock Tower & Spire
    const tower = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.20, 0.09), walnutMat)
    tower.position.y = 0.54
    widyaPurayaGroup.add(tower)

    // 4 clock faces
    const dialMat = new THREE.MeshStandardMaterial({ color: 0xf5eedd, roughness: 0.3 })
    const dialPositions = [
      [0, 0.58, 0.046], [0, 0.58, -0.046], [0.046, 0.58, 0], [-0.046, 0.58, 0]
    ]
    dialPositions.forEach(([dx, dy, dz]) => {
      const dial = new THREE.Mesh(new THREE.CircleGeometry(0.024, 12), dialMat)
      dial.position.set(dx, dy, dz)
      if (Math.abs(dz) > 0.01) dial.rotation.y = dz > 0 ? 0 : Math.PI
      else dial.rotation.y = dx > 0 ? Math.PI / 2 : -Math.PI / 2
      widyaPurayaGroup.add(dial)
    })

    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 8), brassMat)
    spire.position.y = 0.68
    widyaPurayaGroup.add(spire)

    miniGroup.add(widyaPurayaGroup)

    // --- SURROUNDING FACULTY PAVILIONS ---
    const buildPavilion = (x: number, z: number, w: number, d: number, _name: string) => {
      const pav = new THREE.Group()
      pav.position.set(x, 0.88, z)
      const bldg = new THREE.Mesh(new THREE.BoxGeometry(w, 0.09, d), limestoneMat)
      bldg.position.y = 0.045
      bldg.castShadow = true
      pav.add(bldg)
      const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.04, 0.04, d + 0.04), roofDarkMat)
      roof.position.y = 0.11
      pav.add(roof)
      miniGroup.add(pav)
    }

    // East Wing: Faculty of Engineering (FT)
    buildPavilion(0.95, -0.25, 0.48, 0.26, 'FT')
    buildPavilion(0.95, 0.25, 0.44, 0.22, 'FSM')

    // West Wing: Faculty of Law (FH) & FEB
    buildPavilion(-0.95, -0.25, 0.48, 0.26, 'FH')
    buildPavilion(-0.95, 0.25, 0.44, 0.22, 'FEB')

    // North Wing: Faculty of Medicine (FK) & FPP
    buildPavilion(-0.45, -0.65, 0.42, 0.20, 'FK')
    buildPavilion(0.45, -0.65, 0.42, 0.20, 'FPP')

    // South Wing: FPIK & FISIP
    buildPavilion(-0.55, 0.65, 0.44, 0.20, 'FPIK')
    buildPavilion(0.55, 0.65, 0.44, 0.20, 'FISIP')

    // --- WADUK PENDIDIKAN MINIATURE ---
    const waduk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.015, 24), waterMat)
    waduk.position.set(-0.85, 0.885, -0.55)
    waduk.scale.set(1.4, 1, 0.8)
    miniGroup.add(waduk)

    // Arched miniature stone bridge
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.035, 0.38), limestoneMat)
    bridge.position.set(-0.85, 0.90, -0.55)
    miniGroup.add(bridge)

    // --- MINIATURE PINE & DECIDUOUS TREES ---
    const treeLocations = [
      [-0.4, -0.3], [0.4, -0.3], [-0.4, 0.3], [0.4, 0.3],
      [-1.3, -0.6], [-1.3, 0.6], [1.3, -0.6], [1.3, 0.6],
      [-0.1, -0.75], [0.1, -0.75], [-0.1, 0.75], [0.1, 0.75],
      [-0.7, -0.15], [-1.2, 0.0], [0.7, -0.15], [1.2, 0.0]
    ]
    treeLocations.forEach(([tx, tz], i) => {
      const tree = new THREE.Group()
      tree.position.set(tx, 0.88, tz)
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.05, 6), trunkMat)
      trunk.position.y = 0.025
      tree.add(trunk)
      const mat = i % 2 === 0 ? treeGreen : treeDark
      const foliage = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.10, 6), mat)
      foliage.position.y = 0.09
      tree.add(foliage)
      miniGroup.add(tree)
    })

    // Brass Plaque in front of table
    const titlePlaque = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.16, 0.02),
      this.label(
        'MINIATUR 3D: TRANSFORMASI KAWASAN KAMPUS UNDIP',
        'Pusat Ruangan · Masterplan Tembalang 180 Ha, Pleburan & Teluk Awur',
      ),
    )
    titlePlaque.position.set(0, 0.82, 1.11)
    miniGroup.add(titlePlaque)

    this.zone2Group.add(miniGroup)

    // Register Target & Obstacle
    this.zone2Targets.push({
      id: 'z2_miniature',
      zoneNumber: 2,
      name: 'Miniatur 3D: Transformasi Kampus Undip',
      areaName: 'Pusat Ruangan · Meja Vitrine Miniatur Arsitektur Kampus',
      subItemIndex: 0,
      mesh: miniGroup,
      highlightMeshes: [tableTop, vitrineHood, basePodium],
      position: new THREE.Vector3(0, 1.0, 0),
    })

    this.zone2Obstacles.push({
      minX: -1.9,
      maxX: 1.9,
      minZ: -1.3,
      maxZ: 1.3,
    })
  }

  // 2. AREA A: FACULTY DEVELOPMENT (West Wall)
  private buildZone2FacultyDevelopment(): void {
    const group = new THREE.Group()
    group.position.set(-8.85, 0, 0)
    group.rotation.y = Math.PI / 2

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x19120c, roughness: 0.48, metalness: 0.06 })
    const matMat = new THREE.MeshStandardMaterial({ color: 0xf7f2e8, roughness: 0.85 })

    const faculties = [
      // ROW 1 (TOP) — Fakultas Rintisan 1957–1965
      { key: 'z2_img_fac_hukum', name: '1. Fakultas Hukum', year: '1957 · Rintisan Pertama', row: 1, col: 0, idx: 0 },
      { key: 'z2_img_fac_feb', name: '2. Fakultas Ekonomika & Bisnis', year: '1957 · Rintisan Pertama', row: 1, col: 1, idx: 1 },
      { key: 'z2_img_fac_teknik', name: '3. Fakultas Teknik', year: '1957 · Rintisan Pertama', row: 1, col: 2, idx: 2 },
      { key: 'z2_img_fac_kedokteran', name: '4. Fakultas Kedokteran', year: '1961 · Kerja Sama Kariadi', row: 1, col: 3, idx: 3 },
      { key: 'z2_img_fac_fpp', name: '5. Fakultas Peternakan & Pertanian', year: '1964 · Pangan Berkelanjutan', row: 1, col: 4, idx: 4 },
      { key: 'z2_img_fac_fib', name: '6. Fakultas Ilmu Budaya', year: '1965 · Sastra & Humaniora', row: 1, col: 5, idx: 5 },

      // ROW 0 (BOTTOM) — Pemekaran Fakultas 1968–Kini
      { key: 'z2_img_fac_fisip', name: '7. FISIP Undip', year: '1968 · Kebijakan Publik', row: 0, col: 0, idx: 6 },
      { key: 'z2_img_fac_fpik', name: '8. Fakultas Perikanan & Kelautan', year: '1968/1994 · PIP Maritim', row: 0, col: 1, idx: 7 },
      { key: 'z2_img_fac_fsm', name: '9. Fakultas Sains & Matematika', year: '1988/1993 · Riset MIPA', row: 0, col: 2, idx: 8 },
      { key: 'z2_img_fac_fkm', name: '10. Fakultas Kesehatan Masyarakat', year: '1993/2001 · Promosi Sehat', row: 0, col: 3, idx: 9 },
      { key: 'z2_img_fac_psikologi', name: '11. Fakultas Psikologi', year: '2007 · Potensi Insani', row: 0, col: 4, idx: 10 },
      { key: 'z2_img_fac_vokasi', name: '12. Sekolah Pascasarjana & Vokasi', year: '1999 & 2016 · Terapan', row: 0, col: 5, idx: 11 },
    ]

    const fw = 0.88
    const fh = 0.80
    const colSpacing = 1.85

    const sharedFrameGeo = new THREE.BoxGeometry(fw, fh, 0.045)
    const sharedMatGeo = new THREE.PlaneGeometry(fw - 0.07, fh - 0.07)
    const sharedPlateGeo = new THREE.PlaneGeometry(fw - 0.14, fh - 0.14)
    const sharedTagGeo = new THREE.BoxGeometry(fw * 0.96, 0.15, 0.015)

    faculties.forEach((f) => {
      const isTop = f.row === 1
      const z = (f.col - 2.5) * colSpacing // 97 cm horizontal gap between pictures!
      const y = isTop ? 2.45 : 1.25 // 26 cm vertical gap, zero overlap!

      const frameGroup = new THREE.Group()
      frameGroup.position.set(z, y, 0)

      const frame = new THREE.Mesh(sharedFrameGeo, frameMat)
      frame.castShadow = true
      frameGroup.add(frame)

      const mat = new THREE.Mesh(sharedMatGeo, matMat)
      mat.position.z = 0.024
      frameGroup.add(mat)

      const portrait = new THREE.Mesh(
        sharedPlateGeo,
        new THREE.MeshStandardMaterial({
          map: this.assetManager.getImageTexture(f.key),
          roughness: 0.45,
        }),
      )
      portrait.position.z = 0.03
      frameGroup.add(portrait)

      const tag = new THREE.Mesh(sharedTagGeo, this.label(f.name, f.year))
      tag.position.set(0, -fh / 2 - 0.09, 0.012)
      frameGroup.add(tag)

      group.add(frameGroup)

      // Target world coordinate: rotated 90 deg around Y, so X is -8.6, Z is z
      this.zone2Targets.push({
        id: 'z2_faculties',
        zoneNumber: 2,
        name: f.name,
        areaName: 'Sayap Barat · Panel & Galeri Perkembangan Fakultas',
        subItemIndex: f.idx,
        mesh: frameGroup,
        highlightMeshes: [frame, portrait],
        position: new THREE.Vector3(-8.6, y, z),
      })
    })

    const title = new THREE.Mesh(
      new THREE.BoxGeometry(7.6, 0.32, 0.025),
      this.label(
        'PERKEMBANGAN & EVOLUSI FAKULTAS UNIVERSITAS DIPONEGORO',
        'Transformasi 4 Fakultas Perintis (1957) Menjadi 11 Fakultas & 2 Sekolah',
      ),
    )
    title.position.set(0, 3.35, 0.012)
    group.add(title)

    this.zone2Group.add(group)

    this.zone2Obstacles.push({
      minX: -9.0,
      maxX: -8.3,
      minZ: -5.6,
      maxZ: 5.6,
    })
  }

  // 3. AREA B: CAMPUS TRANSFORMATION (North Wall)
  private buildZone2CampusTransformation(): void {
    const group = new THREE.Group()
    group.position.set(0, 0, -7.05)
    group.rotation.y = 0

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1b130d, roughness: 0.48, metalness: 0.06 })
    const matMat = new THREE.MeshStandardMaterial({ color: 0xf7f2e8, roughness: 0.85 })

    const campusPhotos = [
      { key: 'z2_img_trans_gris', title: '1. Aula GRIS Jl. Pemuda', year: '1957 · Kuliah Perdana', idx: 0 },
      { key: 'z2_img_trans_pleburan', title: '2. Kampus Pleburan Klasik', year: '1960-an · Semarang Bawah', idx: 1 },
      { key: 'z2_img_trans_blueprint', title: '3. Masterplan Tembalang 180 Ha', year: '1977 · Visi Rektor Soedarto', idx: 2 },
      { key: 'z2_img_trans_widya_build', title: '4. Konstruksi Widya Puraya', year: '1986–1989 · Ikon Limas', idx: 3 },
      { key: 'z2_img_trans_rsnd', title: '5. Rumah Sakit RSND Undip', year: '2014 · Pendidikan Medis', idx: 4 },
      { key: 'z2_img_trans_eco', title: '6. Lanskap Kampus Hijau & Waduk', year: 'Era Modern · Green Campus', idx: 5 },
    ]

    const fw = 1.15
    const fh = 0.85
    const colSpacing = 2.40 // 125 cm horizontal gap!
    const y = 1.85

    const sharedFrameGeo = new THREE.BoxGeometry(fw, fh, 0.045)
    const sharedMatGeo = new THREE.PlaneGeometry(fw - 0.08, fh - 0.08)
    const sharedPhotoGeo = new THREE.PlaneGeometry(fw - 0.16, fh - 0.16)
    const sharedTagGeo = new THREE.BoxGeometry(fw * 0.96, 0.16, 0.015)

    campusPhotos.forEach((c, i) => {
      const x = (i - 2.5) * colSpacing
      const frameGroup = new THREE.Group()
      frameGroup.position.set(x, y, 0)

      const frame = new THREE.Mesh(sharedFrameGeo, frameMat)
      frame.castShadow = true
      frameGroup.add(frame)

      const mat = new THREE.Mesh(sharedMatGeo, matMat)
      mat.position.z = 0.024
      frameGroup.add(mat)

      const photo = new THREE.Mesh(
        sharedPhotoGeo,
        new THREE.MeshStandardMaterial({
          map: this.assetManager.getImageTexture(c.key),
          roughness: 0.45,
        }),
      )
      photo.position.z = 0.03
      frameGroup.add(photo)

      const tag = new THREE.Mesh(sharedTagGeo, this.label(c.title, c.year))
      tag.position.set(0, -fh / 2 - 0.10, 0.012)
      frameGroup.add(tag)

      group.add(frameGroup)

      this.zone2Targets.push({
        id: 'z2_campus_transformation',
        zoneNumber: 2,
        name: c.title,
        areaName: 'Dinding Utara · Galeri Transformasi Kampus dari Masa ke Masa',
        subItemIndex: c.idx,
        mesh: frameGroup,
        highlightMeshes: [frame, photo],
        position: new THREE.Vector3(x, y, -6.85),
      })
    })

    const title = new THREE.Mesh(
      new THREE.BoxGeometry(8.0, 0.32, 0.025),
      this.label(
        'TRANSFORMASI INFRASTRUKTUR & LANSKAP KAMPUS UNDIP',
        'Dari GRIS & Pleburan (1957) Hingga Megaproyek Kampus Terpadu Tembalang',
      ),
    )
    title.position.set(0, 3.35, 0.012)
    group.add(title)

    this.zone2Group.add(group)

    this.zone2Obstacles.push({
      minX: -7.0,
      maxX: 7.0,
      minZ: -7.2,
      maxZ: -6.5,
    })
  }

  // 4. AREA C: EDUCATION & RESEARCH DEVELOPMENT (East Wall)
  private buildZone2EducationResearch(): void {
    const group = new THREE.Group()
    group.position.set(8.85, 0, 0)
    group.rotation.y = -Math.PI / 2

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x18120c, roughness: 0.48, metalness: 0.06 })
    const matMat = new THREE.MeshStandardMaterial({ color: 0xf7f2e8, roughness: 0.85 })
    const walnutMat = new THREE.MeshStandardMaterial({ color: 0x241a13, roughness: 0.52 })
    const brassMat = new THREE.MeshStandardMaterial({ color: 0x8c6f48, roughness: 0.35, metalness: 0.65 })

    const researchItems = [
      { key: 'z2_img_res_pip', title: '1. Piagam PIP Kelautan 1974', sub: 'Pola Ilmiah Pokok Bahari', idx: 0 },
      { key: 'z2_img_res_station', title: '2. Stasiun Laut Teluk Awur', sub: '52 Ha Kampus Bahari Jepara', idx: 1 },
      { key: 'z2_img_res_intlab', title: '3. Laboratorium Sentral Terpadu', sub: 'Standar Mutu ISO 17025', idx: 2 },
      { key: 'z2_img_res_journals', title: '4. Galeri Jurnal Scopus Q1/Q2', sub: 'Publikasi Bereputasi Global', idx: 3 },
      { key: 'z2_img_res_energy', title: '5. Desalinisasi & Energi Bersih', sub: 'Inovasi Tepat Guna Maritim', idx: 4 },
    ]

    const fw = 1.05
    const fh = 0.85
    const colSpacing = 2.20
    const y = 1.85

    const sharedFrameGeo = new THREE.BoxGeometry(fw, fh, 0.045)
    const sharedMatGeo = new THREE.PlaneGeometry(fw - 0.08, fh - 0.08)
    const sharedPhotoGeo = new THREE.PlaneGeometry(fw - 0.16, fh - 0.16)
    const sharedTagGeo = new THREE.BoxGeometry(fw * 0.96, 0.16, 0.015)

    researchItems.forEach((r, i) => {
      const z = (i - 2.0) * colSpacing
      const frameGroup = new THREE.Group()
      frameGroup.position.set(z, y, 0)

      const frame = new THREE.Mesh(sharedFrameGeo, frameMat)
      frame.castShadow = true
      frameGroup.add(frame)

      const mat = new THREE.Mesh(sharedMatGeo, matMat)
      mat.position.z = 0.024
      frameGroup.add(mat)

      const photo = new THREE.Mesh(
        sharedPhotoGeo,
        new THREE.MeshStandardMaterial({
          map: this.assetManager.getImageTexture(r.key),
          roughness: 0.45,
        }),
      )
      photo.position.z = 0.03
      frameGroup.add(photo)

      const tag = new THREE.Mesh(sharedTagGeo, this.label(r.title, r.sub))
      tag.position.set(0, -fh / 2 - 0.10, 0.012)
      frameGroup.add(tag)

      group.add(frameGroup)

      this.zone2Targets.push({
        id: 'z2_research',
        zoneNumber: 2,
        name: r.title,
        areaName: 'Sayap Timur · Ruang Arsip Akademik & Riset Keilmuan',
        subItemIndex: r.idx,
        mesh: frameGroup,
        highlightMeshes: [frame, photo],
        position: new THREE.Vector3(8.6, y, z),
      })
    })

    // 2 Antique Scientific Showcase Consoles
    const buildVitrineConsole = (zPos: number, isCompass: boolean) => {
      const vGroup = new THREE.Group()
      vGroup.position.set(zPos, 0, 0.70)

      // Console Table
      const table = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.85, 0.65), walnutMat)
      table.position.y = 0.425
      table.castShadow = true
      vGroup.add(table)

      // Glass hood
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.55, 0.55),
        new THREE.MeshStandardMaterial({ color: 0xf0f5f8, roughness: 0.1, transparent: true, opacity: 0.25 }),
      )
      glass.position.y = 0.85 + 0.275
      vGroup.add(glass)

      // Antique Scientific Instrument
      if (isCompass) {
        // Brass Maritime Theodolite
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.04, 16), brassMat)
        base.position.y = 0.87
        vGroup.add(base)
        const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.32, 12), brassMat)
        scope.rotation.z = Math.PI / 4
        scope.position.set(0, 1.05, 0)
        vGroup.add(scope)
      } else {
        // Marine Coral Sample under glass bell jar
        const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.03, 16), walnutMat)
        stand.position.y = 0.865
        vGroup.add(stand)
        const coral = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 1), new THREE.MeshStandardMaterial({ color: 0xe8d2be, roughness: 0.8 }))
        coral.position.y = 0.98
        vGroup.add(coral)
      }

      group.add(vGroup)
    }

    buildVitrineConsole(-3.3, true)
    buildVitrineConsole(3.3, false)

    const title = new THREE.Mesh(
      new THREE.BoxGeometry(7.6, 0.32, 0.025),
      this.label(
        'PUSAT RISET KEILMUAN & POLA ILMIAH POKOK PESISIR',
        'Coastal Region Eco-Development, Stasiun Teluk Awur & Laboratorium Terpadu',
      ),
    )
    title.position.set(0, 3.35, 0.012)
    group.add(title)

    this.zone2Group.add(group)

    this.zone2Obstacles.push({
      minX: 7.8,
      maxX: 9.0,
      minZ: -4.8,
      maxZ: 4.8,
    })
  }

  // 5. AREA D: ACADEMIC ACHIEVEMENTS & COMMUNITY CONTRIBUTION (South Wall)
  private buildZone2AcademicAchievements(): void {
    const group = new THREE.Group()
    group.position.set(0, 0, 7.05)
    group.rotation.y = Math.PI

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x19120c, roughness: 0.48, metalness: 0.06 })
    const matMat = new THREE.MeshStandardMaterial({ color: 0xf7f2e8, roughness: 0.85 })
    const walnutMat = new THREE.MeshStandardMaterial({ color: 0x241a13, roughness: 0.52 })
    const bronzeMat = new THREE.MeshStandardMaterial({ color: 0x8a6a42, roughness: 0.38, metalness: 0.65 })

    const achievements = [
      { key: 'z2_img_ach_kkn', title: '1. Pelopor KKN Tematik', sub: '1971 · Ribuan Desa Binaan', idx: 0 },
      { key: 'z2_img_ach_qs', title: '2. Juara Employability QS', sub: 'Peringkat 1 & 2 di Indonesia', idx: 1 },
      { key: 'z2_img_ach_robot', title: '3. Mobil Listrik & Robotik', sub: 'Shell Eco-Marathon & Kontes Robot', idx: 2 },
      { key: 'z2_img_ach_bionic', title: '4. Tangan Bionik CBIOM3S', sub: 'Inovasi Murah Bagi Disabilitas', idx: 3 },
      { key: 'z2_img_ach_disaster', title: '5. Tim Medis Darurat', sub: 'Bakti Kemanusiaan Bencana', idx: 4 },
    ]

    const fw = 1.15
    const fh = 0.85
    const colSpacing = 2.40
    const y = 1.85

    const sharedFrameGeo = new THREE.BoxGeometry(fw, fh, 0.045)
    const sharedMatGeo = new THREE.PlaneGeometry(fw - 0.08, fh - 0.08)
    const sharedPhotoGeo = new THREE.PlaneGeometry(fw - 0.16, fh - 0.16)
    const sharedTagGeo = new THREE.BoxGeometry(fw * 0.96, 0.16, 0.015)

    achievements.forEach((a, i) => {
      const x = (i - 2.0) * colSpacing
      const frameGroup = new THREE.Group()
      frameGroup.position.set(x, y, 0)

      const frame = new THREE.Mesh(sharedFrameGeo, frameMat)
      frame.castShadow = true
      frameGroup.add(frame)

      const mat = new THREE.Mesh(sharedMatGeo, matMat)
      mat.position.z = 0.024
      frameGroup.add(mat)

      const photo = new THREE.Mesh(
        sharedPhotoGeo,
        new THREE.MeshStandardMaterial({
          map: this.assetManager.getImageTexture(a.key),
          roughness: 0.45,
        }),
      )
      photo.position.z = 0.03
      frameGroup.add(photo)

      const tag = new THREE.Mesh(sharedTagGeo, this.label(a.title, a.sub))
      tag.position.set(0, -fh / 2 - 0.10, 0.012)
      frameGroup.add(tag)

      group.add(frameGroup)

      this.zone2Targets.push({
        id: 'z2_achievements',
        zoneNumber: 2,
        name: a.title,
        areaName: 'Dinding Selatan · Galeri Prestasi & Pengabdian Masyarakat',
        subItemIndex: a.idx,
        mesh: frameGroup,
        highlightMeshes: [frame, photo],
        position: new THREE.Vector3(-x, y, 6.85),
      })
    })

    // Pedestal of Honor with Bronze Award Trophies in Center
    const honorTable = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.85, 0.65), walnutMat)
    honorTable.position.set(0, 0.425, 0.85)
    honorTable.castShadow = true
    group.add(honorTable)

    // Two classical bronze trophies
    for (let t = -1; t <= 1; t += 2) {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.04, 0.22, 12), bronzeMat)
      cup.position.set(t * 0.55, 0.85 + 0.11, 0.85)
      group.add(cup)
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.12), walnutMat)
      base.position.set(t * 0.55, 0.85 + 0.03, 0.85)
      group.add(base)
    }

    const title = new THREE.Mesh(
      new THREE.BoxGeometry(8.0, 0.32, 0.025),
      this.label(
        'PRESTASI AKADEMIK & PELOPOR KKN PENGABDIAN MASYARAKAT',
        'Sumbangsih Nyata Bagi Bangsa: Dari KKN Perintis Desa Hingga Rekor Employability Dunia',
      ),
    )
    title.position.set(0, 3.35, 0.012)
    group.add(title)

    this.zone2Group.add(group)

    this.zone2Obstacles.push({
      minX: -1.5,
      maxX: 1.5,
      minZ: 5.8,
      maxZ: 7.2,
    })
  }

  // 6. ZONE 2 ATMOSPHERE PROPS: Corner Bookcases
  private buildZone2AtmosphereProps(): void {
    const walnut = new THREE.MeshStandardMaterial({ color: 0x241812, roughness: 0.5 })
    const bookColors = [0x503322, 0x1f2b24, 0x472228, 0x5a4a35, 0x1b1d28]

    const makeBookcase = (x: number, z: number, ry: number) => {
      const g = new THREE.Group()
      g.position.set(x, 0, z)
      g.rotation.y = ry

      const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.2, 0.44), walnut)
      body.position.y = 1.6
      body.castShadow = true
      g.add(body)

      // Shelves
      for (let s = 0; s < 5; s++) {
        const sy = 0.5 + s * 0.55
        const row = new THREE.Group()
        row.position.set(0, sy, 0.05)
        for (let b = 0; b < 9; b++) {
          const mat = new THREE.MeshStandardMaterial({ color: bookColors[b % bookColors.length], roughness: 0.7 })
          const bk = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.28), mat)
          bk.position.x = -0.42 + b * 0.105
          row.add(bk)
        }
        g.add(row)
      }
      this.zone2Group.add(g)
    }

    makeBookcase(-8.2, -6.4, 0.3)
    makeBookcase(8.2, -6.4, -0.3)

    this.zone2Obstacles.push({
      minX: -8.8,
      maxX: -7.6,
      minZ: -7.0,
      maxZ: -5.8,
    })
    this.zone2Obstacles.push({
      minX: 7.6,
      maxX: 8.8,
      minZ: -7.0,
      maxZ: -5.8,
    })
  }

  public dispose(): void {
    const disposeGroup = (g: THREE.Group) => {
      g.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
      })
    }
    disposeGroup(this.zone1Group)
    disposeGroup(this.zone2Group)
    this.labelMaterialCache.forEach((mat) => mat.dispose())
    this.labelMaterialCache.clear()
    this.interactiveTargets = []
    this.obstacleBoxes = []
    this.zone1Targets = []
    this.zone1Obstacles = []
    this.zone2Targets = []
    this.zone2Obstacles = []
  }
}
