import * as THREE from 'three'

/**
 * LightingManager — Soft, warm-white museum illumination.
 * A restrained ambient base plus focused spotlights for each collection.
 * Shadow casting is limited to the two most important fixtures and removed
 * entirely on touch devices to keep smartphones smooth.
 */
export class LightingManager {
  private group: THREE.Group
  private zone1Group: THREE.Group
  private zone2Group: THREE.Group
  private lights: THREE.Light[] = []
  private isMobile: boolean

  constructor(isMobile = false) {
    this.isMobile = isMobile
    this.zone1Group = new THREE.Group()
    this.zone1Group.name = 'Zone1LightingGroup'
    this.setupZone1Lighting()

    this.zone2Group = new THREE.Group()
    this.zone2Group.name = 'Zone2LightingGroup'
    this.setupZone2Lighting()

    // Backwards compatibility: default group is zone1Group
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

  private setupZone1Lighting(): void {
    // 1. Soft ambient base
    const ambient = new THREE.AmbientLight(0xfff6ea, 0.82)
    this.zone1Group.add(ambient)
    this.lights.push(ambient)

    // 2. Gentle bounce
    const hemi = new THREE.HemisphereLight(0xfff8ef, 0x2b1c12, 0.58)
    hemi.position.set(0, 5, 0)
    this.zone1Group.add(hemi)
    this.lights.push(hemi)

    // 3. Central chandelier
    const chandelier = new THREE.PointLight(0xfff3e1, 2.3, 20, 1.7)
    chandelier.position.set(0, 4.35, 0)
    chandelier.castShadow = !this.isMobile
    chandelier.shadow.mapSize.set(1024, 1024)
    chandelier.shadow.bias = -0.0015
    chandelier.shadow.camera.near = 0.5
    chandelier.shadow.camera.far = 20
    this.zone1Group.add(chandelier)
    this.lights.push(chandelier)

    // Low fill
    const fill = new THREE.PointLight(0xffeed6, 0.75, 14, 1.8)
    fill.position.set(0, 2.7, 0)
    this.zone1Group.add(fill)
    this.lights.push(fill)

    // 4. Wall sconces
    const sconces = [
      new THREE.Vector3(-6.6, 2.8, -3),
      new THREE.Vector3(-6.6, 2.8, 3),
      new THREE.Vector3(6.6, 2.8, -3),
      new THREE.Vector3(6.6, 2.8, 3),
      new THREE.Vector3(-3.5, 2.8, -6.6),
      new THREE.Vector3(3.5, 2.8, -6.6),
      new THREE.Vector3(-3.5, 2.8, 6.6),
      new THREE.Vector3(3.5, 2.8, 6.6),
    ]
    sconces.forEach((pos) => {
      const lamp = new THREE.PointLight(0xffe9c6, 0.55, 5.5, 2)
      lamp.position.copy(pos)
      this.zone1Group.add(lamp)
      this.lights.push(lamp)
    })

    // 5. Collection spotlights
    const spot = (
      pos: [number, number, number],
      target: [number, number, number],
      intensity: number,
      angle: number,
      shadow = false,
    ) => {
      const light = new THREE.SpotLight(0xfff5e6, intensity, 14, angle, 0.62, 1.5)
      light.position.set(...pos)
      const aim = new THREE.Object3D()
      aim.position.set(...target)
      this.zone1Group.add(aim)
      light.target = aim
      light.castShadow = shadow && !this.isMobile
      if (light.castShadow) {
        light.shadow.mapSize.set(512, 512)
        light.shadow.bias = -0.002
      }
      this.zone1Group.add(light)
      this.lights.push(light)
    }

    spot([-3.5, 4.5, -0.6], [-4.9, 1.05, -0.6], 3.0, Math.PI / 5.2, true)
    spot([-5.1, 4.5, 2.6], [-6.55, 1.45, 2.6], 2.2, Math.PI / 5)
    if (!this.isMobile) {
      spot([-4.4, 4.5, -0.6], [-7.08, 2.35, -0.6], 1.9, Math.PI / 5)
    }
    spot([-2.2, 4.5, -4.6], [-2.2, 2.1, -7.08], 2.5, Math.PI / 4.2)
    spot([2.2, 4.5, -4.6], [2.2, 2.1, -7.08], 2.5, Math.PI / 4.2)
    spot([-2.3, 4.5, 4.6], [-2.3, 2.1, 7.08], 2.5, Math.PI / 4.2, true)
    spot([2.3, 4.5, 4.6], [2.3, 2.1, 7.08], 2.5, Math.PI / 4.2)
    spot([3.4, 4.5, 0], [4.9, 1.0, 0], 2.6, Math.PI / 5)
    if (!this.isMobile) {
      spot([4.9, 4.5, 0], [7.08, 2.35, 0], 2.1, Math.PI / 5)
    }
  }

  private setupZone2Lighting(): void {
    // 1. Soft warm ambient base
    const ambient = new THREE.AmbientLight(0xfff6ea, 0.85)
    this.zone2Group.add(ambient)
    this.lights.push(ambient)

    // 2. Gentle bounce
    const hemi = new THREE.HemisphereLight(0xfff8ef, 0x2b1c12, 0.6)
    hemi.position.set(0, 5, 0)
    this.zone2Group.add(hemi)
    this.lights.push(hemi)

    // 3. Dual Chandeliers for 18m rectangular hall
    const chanL = new THREE.PointLight(0xfff3e1, 1.9, 18, 1.7)
    chanL.position.set(-4.5, 4.35, 0)
    chanL.castShadow = !this.isMobile
    if (chanL.castShadow) {
      chanL.shadow.mapSize.set(512, 512)
      chanL.shadow.bias = -0.0015
    }
    this.zone2Group.add(chanL)
    this.lights.push(chanL)

    const chanR = new THREE.PointLight(0xfff3e1, 1.9, 18, 1.7)
    chanR.position.set(4.5, 4.35, 0)
    this.zone2Group.add(chanR)
    this.lights.push(chanR)

    // Low fills
    const fillL = new THREE.PointLight(0xffeed6, 0.65, 14, 1.8)
    fillL.position.set(-4.5, 2.7, 0)
    this.zone2Group.add(fillL)
    this.lights.push(fillL)

    const fillR = new THREE.PointLight(0xffeed6, 0.65, 14, 1.8)
    fillR.position.set(4.5, 2.7, 0)
    this.zone2Group.add(fillR)
    this.lights.push(fillR)

    // 4. Wall sconces along perimeter
    const sconcesZ2 = [
      new THREE.Vector3(-8.8, 2.8, -3.2),
      new THREE.Vector3(-8.8, 2.8, 3.2),
      new THREE.Vector3(8.8, 2.8, -3.2),
      new THREE.Vector3(8.8, 2.8, 3.2),
      new THREE.Vector3(-4.5, 2.8, -6.8),
      new THREE.Vector3(4.5, 2.8, -6.8),
      new THREE.Vector3(-4.5, 2.8, 6.8),
      new THREE.Vector3(4.5, 2.8, 6.8),
    ]
    sconcesZ2.forEach((pos) => {
      const lamp = new THREE.PointLight(0xffe9c6, 0.55, 5.5, 2)
      lamp.position.copy(pos)
      this.zone2Group.add(lamp)
      this.lights.push(lamp)
    })

    // 5. Focused spotlights for Zone 2 exhibits
    const spotZ2 = (
      pos: [number, number, number],
      target: [number, number, number],
      intensity: number,
      angle: number,
      shadow = false,
    ) => {
      const light = new THREE.SpotLight(0xfff5e6, intensity, 16, angle, 0.6, 1.5)
      light.position.set(...pos)
      const aim = new THREE.Object3D()
      aim.position.set(...target)
      this.zone2Group.add(aim)
      light.target = aim
      light.castShadow = shadow && !this.isMobile
      if (light.castShadow) {
        light.shadow.mapSize.set(512, 512)
        light.shadow.bias = -0.002
      }
      this.zone2Group.add(light)
      this.lights.push(light)
    }

    // Central Miniature Table (Hero shadow-caster)
    spotZ2([0, 4.6, 0], [0, 0.95, 0], 3.4, Math.PI / 4.5, true)
    // Area A: Faculty Development West Wall
    spotZ2([-6.5, 4.5, -2.4], [-8.85, 2.2, -2.4], 2.4, Math.PI / 4.2)
    spotZ2([-6.5, 4.5, 2.4], [-8.85, 2.2, 2.4], 2.4, Math.PI / 4.2)
    // Area B: Campus Transformation North Wall
    spotZ2([-3.6, 4.5, -4.8], [-3.6, 2.2, -7.05], 2.5, Math.PI / 4.2)
    spotZ2([3.6, 4.5, -4.8], [3.6, 2.2, -7.05], 2.5, Math.PI / 4.2)
    // Area C: Education & Research Showcase East Wall
    spotZ2([6.5, 4.5, -2.4], [8.85, 2.2, -2.4], 2.4, Math.PI / 4.2)
    spotZ2([6.5, 4.5, 2.4], [8.85, 2.2, 2.4], 2.4, Math.PI / 4.2)
    // Area D: Academic Achievements & Community South Wall
    spotZ2([-3.6, 4.5, 4.8], [-3.6, 2.2, 7.05], 2.5, Math.PI / 4.2)
    spotZ2([3.6, 4.5, 4.8], [3.6, 2.2, 7.05], 2.5, Math.PI / 4.2)
  }

  public dispose(): void {
    this.lights.forEach((light) => {
      if (light.parent) light.parent.remove(light)
      light.dispose()
    })
    this.lights = []
  }
}
