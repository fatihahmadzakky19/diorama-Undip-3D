import * as THREE from 'three'
import { AssetManager } from './AssetManager'

/**
 * RoomBuilder — Minimalist · Elegant · Vintage · Historical
 * A single heritage gallery room: warm white plaster above a dark walnut
 * wainscot, restrained classical detailing and a slim iron chandelier.
 * Palette is strictly black / white / brown so the collections stay central.
 */
export class RoomBuilder {
  private group: THREE.Group
  private assetManager: AssetManager
  public readonly roomSize = 14.4
  public readonly roomHeight = 5.0

  constructor() {
    this.group = new THREE.Group()
    this.group.name = 'RoomGroup'
    this.assetManager = AssetManager.getInstance()
    this.buildRoom()
  }

  public getGroup(): THREE.Group {
    return this.group
  }

  private buildRoom(): void {
    const half = this.roomSize / 2
    const height = this.roomHeight

    // 1. FLOOR — warm walnut parquet, matte finish, softened by lighting
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(this.roomSize, this.roomSize),
      new THREE.MeshStandardMaterial({
        map: this.assetManager.getFloorTexture(),
        roughness: 0.72,
        metalness: 0.01,
      }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    this.group.add(floor)

    // 2. CEILING — simplified coffered pattern, never dominant
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(this.roomSize, this.roomSize),
      new THREE.MeshStandardMaterial({
        map: this.assetManager.getCeilingTexture(),
        roughness: 0.85,
        metalness: 0,
        color: 0xded6c9,
      }),
    )
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.y = height
    this.group.add(ceiling)

    // 3. WALLS — warm white plaster + dark walnut panelling
    const wallMat = new THREE.MeshStandardMaterial({
      map: this.assetManager.getWallTexture(),
      roughness: 0.68,
      metalness: 0.01,
    })

    const north = new THREE.Mesh(new THREE.PlaneGeometry(this.roomSize, height), wallMat)
    north.position.set(0, height / 2, -half)
    north.receiveShadow = true
    this.group.add(north)

    const south = new THREE.Mesh(new THREE.PlaneGeometry(this.roomSize, height), wallMat)
    south.rotation.y = Math.PI
    south.position.set(0, height / 2, half)
    south.receiveShadow = true
    this.group.add(south)

    const west = new THREE.Mesh(new THREE.PlaneGeometry(this.roomSize, height), wallMat)
    west.rotation.y = Math.PI / 2
    west.position.set(-half, height / 2, 0)
    west.receiveShadow = true
    this.group.add(west)

    const east = new THREE.Mesh(new THREE.PlaneGeometry(this.roomSize, height), wallMat)
    east.rotation.y = -Math.PI / 2
    east.position.set(half, height / 2, 0)
    east.receiveShadow = true
    this.group.add(east)

    // 4. ARCHITECTURAL TRIM — base, picture rail, crown and restrained dentils
    this.buildMoldings(half, height)
    this.buildPilasters(half)
    this.buildWallSconces(half)

    // 5. SIMPLE CLASSIC CHANDELIER
    this.buildChandelier(height)
  }

  private buildMoldings(half: number, height: number): void {
    const walnut = new THREE.MeshStandardMaterial({
      color: 0x231610,
      roughness: 0.46,
      metalness: 0.04,
    })
    const shadow = new THREE.MeshStandardMaterial({
      color: 0x120c08,
      roughness: 0.6,
      metalness: 0.02,
    })

    // Baseboards
    const baseH = 0.24
    const baseLong = new THREE.BoxGeometry(this.roomSize, baseH, 0.07)
    const northBase = new THREE.Mesh(baseLong, walnut)
    northBase.position.set(0, baseH / 2, -half + 0.035)
    this.group.add(northBase)
    const southBase = new THREE.Mesh(baseLong, walnut)
    southBase.position.set(0, baseH / 2, half - 0.035)
    this.group.add(southBase)
    const westBase = new THREE.Mesh(new THREE.BoxGeometry(0.07, baseH, this.roomSize), walnut)
    westBase.position.set(-half + 0.035, baseH / 2, 0)
    this.group.add(westBase)
    const eastBase = new THREE.Mesh(new THREE.BoxGeometry(0.07, baseH, this.roomSize), walnut)
    eastBase.position.set(half - 0.035, baseH / 2, 0)
    this.group.add(eastBase)

    // Slim picture rail — a classical line that separates plaster and display zone
    const railY = 3.78
    const railLong = new THREE.BoxGeometry(this.roomSize, 0.045, 0.035)
    const railNorth = new THREE.Mesh(railLong, walnut)
    railNorth.position.set(0, railY, -half + 0.02)
    this.group.add(railNorth)
    const railSouth = new THREE.Mesh(railLong, walnut)
    railSouth.position.set(0, railY, half - 0.02)
    this.group.add(railSouth)
    const railWest = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.045, this.roomSize), walnut)
    railWest.position.set(-half + 0.02, railY, 0)
    this.group.add(railWest)
    const railEast = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.045, this.roomSize), walnut)
    railEast.position.set(half - 0.02, railY, 0)
    this.group.add(railEast)

    // Crown molding + fine dark reveal
    const crownLong = new THREE.BoxGeometry(this.roomSize, 0.16, 0.1)
    const northCrown = new THREE.Mesh(crownLong, walnut)
    northCrown.position.set(0, height - 0.08, -half + 0.05)
    this.group.add(northCrown)
    const southCrown = new THREE.Mesh(crownLong, walnut)
    southCrown.position.set(0, height - 0.08, half - 0.05)
    this.group.add(southCrown)
    const westCrown = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, this.roomSize), walnut)
    westCrown.position.set(-half + 0.05, height - 0.08, 0)
    this.group.add(westCrown)
    const eastCrown = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, this.roomSize), walnut)
    eastCrown.position.set(half - 0.05, height - 0.08, 0)
    this.group.add(eastCrown)

    const revealLong = new THREE.BoxGeometry(this.roomSize, 0.02, 0.012)
    const revNorth = new THREE.Mesh(revealLong, shadow)
    revNorth.position.set(0, height - 0.19, -half + 0.012)
    this.group.add(revNorth)
    const revSouth = new THREE.Mesh(revealLong, shadow)
    revSouth.position.set(0, height - 0.19, half - 0.012)
    this.group.add(revSouth)

    // Minimal dentil band below the crown (fine, widely spaced)
    const dentilMat = new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.5 })
    const count = 24
    const step = (this.roomSize - 1.2) / count
    const dentilGeo = new THREE.BoxGeometry(0.12, 0.05, 0.028)
    for (let i = 0; i < count; i++) {
      const p = -half + 0.6 + i * step
      const dn = new THREE.Mesh(dentilGeo, dentilMat)
      dn.position.set(p, height - 0.27, -half + 0.018)
      this.group.add(dn)
      const ds = new THREE.Mesh(dentilGeo, dentilMat)
      ds.position.set(p, height - 0.27, half - 0.018)
      this.group.add(ds)
      const dw = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.05, 0.12), dentilMat)
      dw.position.set(-half + 0.018, height - 0.27, p)
      this.group.add(dw)
      const de = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.05, 0.12), dentilMat)
      de.position.set(half - 0.018, height - 0.27, p)
      this.group.add(de)
    }
  }

  /** Shallow classical pilasters give each wall an architectural rhythm without clutter. */
  private buildPilasters(half: number): void {
    const mat = new THREE.MeshStandardMaterial({ color: 0x2d1d13, roughness: 0.5, metalness: 0.03 })
    const capMat = new THREE.MeshStandardMaterial({ color: 0x352318, roughness: 0.45, metalness: 0.04 })
    const h = 3.5
    const y = 0.26 + h / 2
    const offsets = [-5.8, 5.8]

    const makePilaster = (x: number, z: number, rotY: number) => {
      const g = new THREE.Group()
      g.position.set(x, y, z)
      g.rotation.y = rotY
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.17, h, 0.055), mat)
      g.add(shaft)
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.09, 0.075), capMat)
      base.position.y = -h / 2
      g.add(base)
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.075), capMat)
      cap.position.y = h / 2
      g.add(cap)
      this.group.add(g)
    }

    offsets.forEach((o) => {
      makePilaster(o, -half + 0.035, 0)
      makePilaster(o, half - 0.035, Math.PI)
      makePilaster(-half + 0.035, o, Math.PI / 2)
      makePilaster(half - 0.035, o, -Math.PI / 2)
    })
  }

  private buildWallSconces(half: number): void {
    const metal = new THREE.MeshStandardMaterial({ color: 0x171310, roughness: 0.5, metalness: 0.35 })
    const shade = new THREE.MeshStandardMaterial({
      color: 0xf7f0e2,
      emissive: 0xfff3dd,
      emissiveIntensity: 0.35,
      roughness: 0.35,
    })
    const configs = [
      { x: -half + 0.09, y: 2.8, z: -3, r: Math.PI / 2 },
      { x: -half + 0.09, y: 2.8, z: 3, r: Math.PI / 2 },
      { x: half - 0.09, y: 2.8, z: -3, r: -Math.PI / 2 },
      { x: half - 0.09, y: 2.8, z: 3, r: -Math.PI / 2 },
      { x: -3.5, y: 2.8, z: -half + 0.09, r: 0 },
      { x: 3.5, y: 2.8, z: -half + 0.09, r: 0 },
      { x: -3.5, y: 2.8, z: half - 0.09, r: Math.PI },
      { x: 3.5, y: 2.8, z: half - 0.09, r: Math.PI },
    ]

    configs.forEach((cfg) => {
      const s = new THREE.Group()
      s.position.set(cfg.x, cfg.y, cfg.z)
      s.rotation.y = cfg.r
      const back = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.025, 16), metal)
      back.rotation.x = Math.PI / 2
      s.add(back)
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 8), metal)
      arm.rotation.z = Math.PI / 4
      arm.position.set(0.075, 0.06, 0)
      s.add(arm)
      const lamp = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.13, 12, 1, true), shade)
      lamp.rotation.x = Math.PI
      lamp.position.set(0.13, 0.13, 0)
      s.add(lamp)
      this.group.add(s)
    })
  }

  private buildChandelier(height: number): void {
    const chandelier = new THREE.Group()
    chandelier.position.set(0, height, 0)

    const iron = new THREE.MeshStandardMaterial({ color: 0x15120e, roughness: 0.55, metalness: 0.4 })
    const wax = new THREE.MeshStandardMaterial({ color: 0xf2ead8, roughness: 0.65 })
    const glow = new THREE.MeshStandardMaterial({
      color: 0xfffaf0,
      emissive: 0xfff2d8,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    })

    const canopy = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.34, 0.1, 16), iron)
    chandelier.add(canopy)
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.6, 8), iron)
    rod.position.y = -0.3
    chandelier.add(rod)
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), iron)
    hub.position.y = -0.6
    chandelier.add(hub)

    const radius = 0.82
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.022, 8, 28), iron)
    ring.rotation.x = Math.PI / 2
    ring.position.y = -0.62
    chandelier.add(ring)

    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6
      const c = Math.cos(a)
      const s = Math.sin(a)
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, radius, 8), iron)
      arm.rotation.z = Math.PI / 2
      arm.rotation.y = a
      arm.position.set((c * radius) / 2, -0.62, (s * radius) / 2)
      chandelier.add(arm)
      const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.03, 0.02, 12), iron)
      dish.position.set(c * radius, -0.61, s * radius)
      chandelier.add(dish)
      const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.13, 8), wax)
      candle.position.set(c * radius, -0.54, s * radius)
      chandelier.add(candle)
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), glow)
      flame.scale.set(1, 1.7, 1)
      flame.position.set(c * radius, -0.44, s * radius)
      chandelier.add(flame)
    }

    this.group.add(chandelier)
  }

  public dispose(): void {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
        else obj.material.dispose()
      }
    })
  }
}
