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
  private assetManager: AssetManager
  private interactiveTargets: InteractiveTarget[] = []
  private obstacleBoxes: ObstacleBox[] = []
  private bookPagePivot: THREE.Group | null = null
  private isPageTurning = false
  private pageTurnProgress = 0
  private labelMaterialCache = new Map<string, THREE.MeshStandardMaterial>()

  constructor() {
    this.group = new THREE.Group()
    this.group.name = 'ObjectGroup'
    this.assetManager = AssetManager.getInstance()
    this.buildAllObjects()
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

  public dispose(): void {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
        else obj.material.dispose()
      }
    })
    this.labelMaterialCache.forEach((mat) => mat.dispose())
    this.labelMaterialCache.clear()
    this.interactiveTargets = []
    this.obstacleBoxes = []
  }
}
