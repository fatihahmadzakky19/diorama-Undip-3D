import * as THREE from 'three'
import { AssetManager } from './AssetManager'

/**
 * RoomBuilder — Minimalist · Elegant · Vintage · Historical
 * Single unified heritage hall: "UNDIP HISTORICAL MUSEUM — THE ARCHIVE ROOM".
 * Warm white plaster above dark walnut wainscot, dentil molding, pilasters,
 * dual iron ring chandeliers, and subtle wall sconces.
 * Palette: strictly Hitam (#171513), Putih (#E8E2D8), Cokelat (#79583E).
 */
export class RoomBuilder {
  private group: THREE.Group
  private assetManager: AssetManager

  public readonly roomWidth = 20.0
  public readonly roomDepth = 16.0
  public readonly roomHeight = 5.2
  // Backwards compatibility property
  public readonly roomSize = 20.0

  constructor() {
    this.assetManager = AssetManager.getInstance()
    this.group = this.buildRoomGroup(this.roomWidth, this.roomDepth, this.roomHeight)
    this.group.name = 'SingleArchiveRoomGroup'
  }

  public getGroup(): THREE.Group {
    return this.group
  }

  // Backwards-compatibility helpers
  public getZone1Group(): THREE.Group {
    return this.group
  }

  public getZone2Group(): THREE.Group {
    return this.group
  }

  private buildRoomGroup(width: number, depth: number, height: number): THREE.Group {
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

    // 2. CEILING — coffered heritage pattern
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

    // 3. WALLS — warm ivory plaster + dark walnut wainscot panelling
    const wallMat = new THREE.MeshStandardMaterial({
      map: this.assetManager.getWallTexture(),
      roughness: 0.68,
      metalness: 0.01,
    })

    // North wall
    const north = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMat)
    north.position.set(0, height / 2, -halfZ)
    north.receiveShadow = true
    room.add(north)

    // South wall
    const south = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMat)
    south.rotation.y = Math.PI
    south.position.set(0, height / 2, halfZ)
    south.receiveShadow = true
    room.add(south)

    // West wall
    const west = new THREE.Mesh(new THREE.PlaneGeometry(depth, height), wallMat)
    west.rotation.y = Math.PI / 2
    west.position.set(-halfX, height / 2, 0)
    west.receiveShadow = true
    room.add(west)

    // East wall
    const east = new THREE.Mesh(new THREE.PlaneGeometry(depth, height), wallMat)
    east.rotation.y = -Math.PI / 2
    east.position.set(halfX, height / 2, 0)
    east.receiveShadow = true
    room.add(east)

    // 4. ARCHITECTURAL TRIM — baseboards, chair rail, crown molding, dentils
    this.buildMoldings(room, width, depth, halfX, halfZ, height)
    this.buildPilasters(room, halfX, halfZ, height)
    this.buildWallSconces(room, halfX, halfZ)

    // 5. CLASSIC DUAL CHANDELIERS along center axis
    this.buildChandelier(room, 0, height, -3.8)
    this.buildChandelier(room, 0, height, 3.8)

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

    // Baseboards (0.24m height)
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

    // Chair rail / Wainscot cap at 1.15m height
    const railY = 1.15
    const railH = 0.065
    const railD = 0.06

    const northRail = new THREE.Mesh(new THREE.BoxGeometry(width, railH, railD), walnut)
    northRail.position.set(0, railY, -halfZ + railD / 2)
    parent.add(northRail)

    const southRail = new THREE.Mesh(new THREE.BoxGeometry(width, railH, railD), walnut)
    southRail.position.set(0, railY, halfZ - railD / 2)
    parent.add(southRail)

    const westRail = new THREE.Mesh(new THREE.BoxGeometry(railD, railH, depth), walnut)
    westRail.position.set(-halfX + railD / 2, railY, 0)
    parent.add(westRail)

    const eastRail = new THREE.Mesh(new THREE.BoxGeometry(railD, railH, depth), walnut)
    eastRail.position.set(halfX - railD / 2, railY, 0)
    parent.add(eastRail)

    // Crown molding at ceiling perimeter
    const crownH = 0.14
    const crownD = 0.1
    const crownY = height - crownH / 2

    const northCrown = new THREE.Mesh(new THREE.BoxGeometry(width, crownH, crownD), shadow)
    northCrown.position.set(0, crownY, -halfZ + crownD / 2)
    parent.add(northCrown)

    const southCrown = new THREE.Mesh(new THREE.BoxGeometry(width, crownH, crownD), shadow)
    southCrown.position.set(0, crownY, halfZ - crownD / 2)
    parent.add(southCrown)

    const westCrown = new THREE.Mesh(new THREE.BoxGeometry(crownD, crownH, depth), shadow)
    westCrown.position.set(-halfX + crownD / 2, crownY, 0)
    parent.add(westCrown)

    const eastCrown = new THREE.Mesh(new THREE.BoxGeometry(crownD, crownH, depth), shadow)
    eastCrown.position.set(halfX - crownD / 2, crownY, 0)
    parent.add(eastCrown)
  }

  private buildPilasters(
    parent: THREE.Group,
    halfX: number,
    halfZ: number,
    height: number,
  ): void {
    const pilasterMat = new THREE.MeshStandardMaterial({
      color: 0x2b1c14,
      roughness: 0.52,
      metalness: 0.05,
    })
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc8a652,
      roughness: 0.35,
      metalness: 0.5,
    })

    const pw = 0.28
    const pd = 0.09
    const ph = height - 0.24

    const createPilaster = (x: number, z: number, rotY = 0) => {
      const pGroup = new THREE.Group()
      pGroup.position.set(x, 0.12 + ph / 2, z)
      pGroup.rotation.y = rotY

      const shaft = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pd), pilasterMat)
      shaft.castShadow = true
      pGroup.add(shaft)

      // Capital trim
      const cap = new THREE.Mesh(new THREE.BoxGeometry(pw + 0.06, 0.08, pd + 0.04), goldMat)
      cap.position.y = ph / 2 - 0.04
      pGroup.add(cap)

      parent.add(pGroup)
    }

    // Four corners
    createPilaster(-halfX + 0.15, -halfZ + 0.15)
    createPilaster(halfX - 0.15, -halfZ + 0.15)
    createPilaster(-halfX + 0.15, halfZ - 0.15)
    createPilaster(halfX - 0.15, halfZ - 0.15)

    // Intermediate columns along long walls
    createPilaster(-5.0, -halfZ + 0.05)
    createPilaster(5.0, -halfZ + 0.05)
    createPilaster(-5.0, halfZ - 0.05)
    createPilaster(5.0, halfZ - 0.05)
  }

  private buildWallSconces(parent: THREE.Group, halfX: number, _halfZ: number): void {
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xb58e3b,
      roughness: 0.35,
      metalness: 0.65,
    })
    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0xfff6dd,
      roughness: 0.9,
      emissive: 0xffd27d,
      emissiveIntensity: 0.45,
    })

    const createSconce = (x: number, y: number, z: number, rotY: number) => {
      const group = new THREE.Group()
      group.position.set(x, y, z)
      group.rotation.y = rotY

      // Backplate
      const back = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16), brassMat)
      back.rotation.x = Math.PI / 2
      group.add(back)

      // Arm
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8), brassMat)
      arm.rotation.z = Math.PI / 4
      arm.position.set(0.05, 0.05, 0.06)
      group.add(arm)

      // Lamp shade
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.14, 16, 1, true), shadeMat)
      shade.rotation.x = Math.PI
      shade.position.set(0.1, 0.1, 0.12)
      group.add(shade)

      parent.add(group)
    }

    const y = 2.4
    // West wall sconces
    createSconce(-halfX + 0.05, y, -3.5, Math.PI / 2)
    createSconce(-halfX + 0.05, y, 3.5, Math.PI / 2)

    // East wall sconces
    createSconce(halfX - 0.05, y, -2.1, -Math.PI / 2)
    createSconce(halfX - 0.05, y, 2.1, -Math.PI / 2)
  }

  private buildChandelier(parent: THREE.Group, x: number, y: number, z: number): void {
    const group = new THREE.Group()
    group.position.set(x, y, z)

    const iron = new THREE.MeshStandardMaterial({
      color: 0x161311,
      roughness: 0.6,
      metalness: 0.35,
    })
    const brass = new THREE.MeshStandardMaterial({
      color: 0xbfa35a,
      roughness: 0.35,
      metalness: 0.65,
    })
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xfff0c4,
      emissive: 0xffcc66,
      emissiveIntensity: 1.2,
      roughness: 0.4,
    })

    // Ceiling rose
    const rose = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.08, 24), brass)
    group.add(rose)

    // Downrod
    const rodH = 1.3
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, rodH, 12), iron)
    rod.position.y = -rodH / 2
    group.add(rod)

    // Central hub
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 16), brass)
    hub.position.y = -rodH
    group.add(hub)

    // Circular iron band (radius 1.15m)
    const ringRadius = 1.15
    const ring = new THREE.Mesh(new THREE.TorusGeometry(ringRadius, 0.024, 12, 36), iron)
    ring.rotation.x = Math.PI / 2
    ring.position.y = -rodH
    group.add(ring)

    // Supporting spokes
    const spokeCount = 6
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, ringRadius, 8), iron)
      spoke.rotation.z = Math.PI / 2
      spoke.rotation.y = angle
      spoke.position.set((Math.cos(angle) * ringRadius) / 2, -rodH, (Math.sin(angle) * ringRadius) / 2)
      group.add(spoke)

      // Candle light fixtures on the ring
      const candleX = Math.cos(angle) * ringRadius
      const candleZ = Math.sin(angle) * ringRadius

      const bobeche = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 0.03, 12), brass)
      bobeche.position.set(candleX, -rodH + 0.02, candleZ)
      group.add(bobeche)

      const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.11, 10), new THREE.MeshStandardMaterial({ color: 0xf4eedc, roughness: 0.8 }))
      candle.position.set(candleX, -rodH + 0.08, candleZ)
      group.add(candle)

      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), flameMat)
      flame.position.set(candleX, -rodH + 0.15, candleZ)
      group.add(flame)
    }

    parent.add(group)
  }
}
