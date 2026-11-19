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
  private zone1Group: THREE.Group
  private zone2Group: THREE.Group
  private assetManager: AssetManager

  public readonly roomSize = 14.4
  public readonly roomHeight = 5.0
  public readonly zone2Width = 18.0
  public readonly zone2Depth = 14.4

  constructor() {
    this.assetManager = AssetManager.getInstance()
    this.zone1Group = this.buildRoomGroup(this.roomSize, this.roomSize, this.roomHeight, 1)
    this.zone1Group.name = 'Zone1RoomGroup'

    this.zone2Group = this.buildRoomGroup(this.zone2Width, this.zone2Depth, this.roomHeight, 2)
    this.zone2Group.name = 'Zone2RoomGroup'

    // Maintain backwards compatibility
    this.group = this.zone1Group
  }

  public getGroup(): THREE.Group {
    return this.group
  }

  public getZone1Group(): THREE.Group {
    return this.zone1Group
  }

  public getZone2Group(): THREE.Group {
    return this.zone2Group
  }

  private buildRoomGroup(
    width: number,
    depth: number,
    height: number,
    chandelierMode: 1 | 2,
  ): THREE.Group {
    const room = new THREE.Group()
    const halfX = width / 2
    const halfZ = depth / 2

    // 1. FLOOR — warm walnut parquet
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(width, depth),
      new THREE.MeshStandardMaterial({
        map: this.assetManager.getFloorTexture(),
        roughness: 0.72,
        metalness: 0.01,
      }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    room.add(floor)

    // 2. CEILING — simplified coffered pattern
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(width, depth),
      new THREE.MeshStandardMaterial({
        map: this.assetManager.getCeilingTexture(),
        roughness: 0.85,
        metalness: 0,
        color: 0xded6c9,
      }),
    )
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.y = height
    room.add(ceiling)

    // 3. WALLS — warm white plaster + dark walnut panelling
    const wallMat = new THREE.MeshStandardMaterial({
      map: this.assetManager.getWallTexture(),
      roughness: 0.68,
      metalness: 0.01,
    })

    const north = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMat)
    north.position.set(0, height / 2, -halfZ)
    north.receiveShadow = true
    room.add(north)

    const south = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMat)
    south.rotation.y = Math.PI
    south.position.set(0, height / 2, halfZ)
    south.receiveShadow = true
    room.add(south)

    const west = new THREE.Mesh(new THREE.PlaneGeometry(depth, height), wallMat)
    west.rotation.y = Math.PI / 2
    west.position.set(-halfX, height / 2, 0)
    west.receiveShadow = true
    room.add(west)

    const east = new THREE.Mesh(new THREE.PlaneGeometry(depth, height), wallMat)
    east.rotation.y = -Math.PI / 2
    east.position.set(halfX, height / 2, 0)
    east.receiveShadow = true
    room.add(east)

    // 4. ARCHITECTURAL TRIM — base, picture rail, crown and dentils
    this.buildMoldings(room, width, depth, halfX, halfZ, height)
    this.buildPilasters(room, halfX, halfZ)
    this.buildWallSconces(room, halfX, halfZ)

    // 5. CLASSIC CHANDELIERS
    if (chandelierMode === 1) {
      this.buildChandelier(room, 0, height, 0)
    } else {
      this.buildChandelier(room, -4.5, height, 0)
      this.buildChandelier(room, 4.5, height, 0)
    }

    return room
  }

  private buildMoldings(
    parent: THREE.Group,
    width: number,
    depth: number,
    halfX: number,
    halfZ: number,
    height: number,
  ): void {
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
    const northBase = new THREE.Mesh(new THREE.BoxGeometry(width, baseH, 0.07), walnut)
    northBase.position.set(0, baseH / 2, -halfZ + 0.035)
    parent.add(northBase)
    const southBase = new THREE.Mesh(new THREE.BoxGeometry(width, baseH, 0.07), walnut)
    southBase.position.set(0, baseH / 2, halfZ - 0.035)
    parent.add(southBase)
    const westBase = new THREE.Mesh(new THREE.BoxGeometry(0.07, baseH, depth), walnut)
    westBase.position.set(-halfX + 0.035, baseH / 2, 0)
    parent.add(westBase)
    const eastBase = new THREE.Mesh(new THREE.BoxGeometry(0.07, baseH, depth), walnut)
    eastBase.position.set(halfX - 0.035, baseH / 2, 0)
    parent.add(eastBase)

    // Slim picture rail
    const railY = 3.78
    const railNorth = new THREE.Mesh(new THREE.BoxGeometry(width, 0.045, 0.035), walnut)
    railNorth.position.set(0, railY, -halfZ + 0.02)
    parent.add(railNorth)
    const railSouth = new THREE.Mesh(new THREE.BoxGeometry(width, 0.045, 0.035), walnut)
    railSouth.position.set(0, railY, halfZ - 0.02)
    parent.add(railSouth)
    const railWest = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.045, depth), walnut)
    railWest.position.set(-halfX + 0.02, railY, 0)
    parent.add(railWest)
    const railEast = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.045, depth), walnut)
    railEast.position.set(halfX - 0.02, railY, 0)
    parent.add(railEast)

    // Crown molding + dark reveal
    const crownNorth = new THREE.Mesh(new THREE.BoxGeometry(width, 0.16, 0.1), walnut)
    crownNorth.position.set(0, height - 0.08, -halfZ + 0.05)
    parent.add(crownNorth)
    const crownSouth = new THREE.Mesh(new THREE.BoxGeometry(width, 0.16, 0.1), walnut)
    crownSouth.position.set(0, height - 0.08, halfZ - 0.05)
    parent.add(crownSouth)
    const westCrown = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, depth), walnut)
    westCrown.position.set(-halfX + 0.05, height - 0.08, 0)
    parent.add(westCrown)
    const eastCrown = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, depth), walnut)
    eastCrown.position.set(halfX - 0.05, height - 0.08, 0)
    parent.add(eastCrown)

    const revNorth = new THREE.Mesh(new THREE.BoxGeometry(width, 0.02, 0.012), shadow)
    revNorth.position.set(0, height - 0.19, -halfZ + 0.012)
    parent.add(revNorth)
    const revSouth = new THREE.Mesh(new THREE.BoxGeometry(width, 0.02, 0.012), shadow)
    revSouth.position.set(0, height - 0.19, halfZ - 0.012)
    parent.add(revSouth)

    // Dentil band below the crown
    const dentilMat = new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.5 })
    const countX = Math.round((width - 1.2) / 0.55)
    const stepX = (width - 1.2) / countX
    const dentilGeoX = new THREE.BoxGeometry(0.12, 0.05, 0.028)
    for (let i = 0; i < countX; i++) {
      const p = -halfX + 0.6 + i * stepX
      const dn = new THREE.Mesh(dentilGeoX, dentilMat)
      dn.position.set(p, height - 0.27, -halfZ + 0.018)
      parent.add(dn)
      const ds = new THREE.Mesh(dentilGeoX, dentilMat)
      ds.position.set(p, height - 0.27, halfZ - 0.018)
      parent.add(ds)
    }

    const countZ = Math.round((depth - 1.2) / 0.55)
    const stepZ = (depth - 1.2) / countZ
    const dentilGeoZ = new THREE.BoxGeometry(0.028, 0.05, 0.12)
    for (let i = 0; i < countZ; i++) {
      const p = -halfZ + 0.6 + i * stepZ
      const dw = new THREE.Mesh(dentilGeoZ, dentilMat)
      dw.position.set(-halfX + 0.018, height - 0.27, p)
      parent.add(dw)
      const de = new THREE.Mesh(dentilGeoZ, dentilMat)
      de.position.set(halfX - 0.018, height - 0.27, p)
      parent.add(de)
    }
  }

  /** Shallow classical pilasters give walls an architectural rhythm without clutter. */
  private buildPilasters(parent: THREE.Group, halfX: number, halfZ: number): void {
    const mat = new THREE.MeshStandardMaterial({ color: 0x2d1d13, roughness: 0.5, metalness: 0.03 })
    const capMat = new THREE.MeshStandardMaterial({ color: 0x352318, roughness: 0.45, metalness: 0.04 })
    const h = 3.5
    const y = 0.26 + h / 2

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
      parent.add(g)
    }

    const xOffsets = [-halfX + 2.4, -halfX / 2, 0, halfX / 2, halfX - 2.4]
    xOffsets.forEach((ox) => {
      makePilaster(ox, -halfZ + 0.035, 0)
      makePilaster(ox, halfZ - 0.035, Math.PI)
    })

    const zOffsets = [-halfZ + 2.8, 0, halfZ - 2.8]
    zOffsets.forEach((oz) => {
      makePilaster(-halfX + 0.035, oz, Math.PI / 2)
      makePilaster(halfX - 0.035, oz, -Math.PI / 2)
    })
  }

  private buildWallSconces(parent: THREE.Group, halfX: number, halfZ: number): void {
    const metal = new THREE.MeshStandardMaterial({ color: 0x171310, roughness: 0.5, metalness: 0.35 })
    const shade = new THREE.MeshStandardMaterial({
      color: 0xf7f0e2,
      emissive: 0xfff3dd,
      emissiveIntensity: 0.35,
      roughness: 0.35,
    })

    const configs = [
      { x: -halfX + 0.09, y: 2.8, z: -3.2, r: Math.PI / 2 },
      { x: -halfX + 0.09, y: 2.8, z: 3.2, r: Math.PI / 2 },
      { x: halfX - 0.09, y: 2.8, z: -3.2, r: -Math.PI / 2 },
      { x: halfX - 0.09, y: 2.8, z: 3.2, r: -Math.PI / 2 },
      { x: -halfX * 0.5, y: 2.8, z: -halfZ + 0.09, r: 0 },
      { x: halfX * 0.5, y: 2.8, z: -halfZ + 0.09, r: 0 },
      { x: -halfX * 0.5, y: 2.8, z: halfZ - 0.09, r: Math.PI },
      { x: halfX * 0.5, y: 2.8, z: halfZ - 0.09, r: Math.PI },
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
      parent.add(s)
    })
  }

  private buildChandelier(parent: THREE.Group, x: number, height: number, z: number): void {
    const chandelier = new THREE.Group()
    chandelier.position.set(x, height, z)

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

    parent.add(chandelier)
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
  }
}
