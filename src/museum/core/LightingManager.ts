import * as THREE from 'three'

/**
 * LightingManager — Soft, warm-white vintage museum illumination.
 * Dedicated lighting architecture for "The Archive Room":
 * - Ambient & hemispheric base for uniform, artifact-safe lighting
 * - Dual grand chandeliers illuminating the room along the center axis
 * - Focused spotlights highlighting the 5 Physical Exhibits and 5 Bookshelves
 * - Soft sconces casting warm accent lighting along the walls
 */
export class LightingManager {
  private group: THREE.Group
  private lights: THREE.Light[] = []
  private isMobile: boolean

  constructor(isMobile = false) {
    this.isMobile = isMobile
    this.group = new THREE.Group()
    this.group.name = 'SingleArchiveRoomLightingGroup'
    this.setupSingleRoomLighting()
  }

  public getGroup(): THREE.Group {
    return this.group
  }

  // Backwards compatibility helpers
  public getZone1Group(): THREE.Group {
    return this.group
  }

  public getZone2Group(): THREE.Group {
    return this.group
  }

  private setupSingleRoomLighting(): void {
    // 1. Soft Warm Ambient Base
    const ambient = new THREE.AmbientLight(0xfff5e6, 0.88)
    this.group.add(ambient)
    this.lights.push(ambient)

    // 2. Gentle Hemispheric Bounce (Ivory ceiling / dark walnut floor)
    const hemi = new THREE.HemisphereLight(0xfffaee, 0x241810, 0.62)
    hemi.position.set(0, 5.2, 0)
    this.group.add(hemi)
    this.lights.push(hemi)

    // 3. Dual Grand Chandeliers along center axis (Z = -3.8 and Z = +3.8)
    const createChandelierLight = (x: number, y: number, z: number) => {
      const chandelierLight = new THREE.PointLight(0xfff0dc, 2.4, 22, 1.6)
      chandelierLight.position.set(x, y, z)
      chandelierLight.castShadow = !this.isMobile
      if (chandelierLight.castShadow) {
        chandelierLight.shadow.mapSize.set(1024, 1024)
        chandelierLight.shadow.bias = -0.0015
        chandelierLight.shadow.camera.near = 0.5
        chandelierLight.shadow.camera.far = 22
      }
      this.group.add(chandelierLight)
      this.lights.push(chandelierLight)

      // Soft lower fill
      const fill = new THREE.PointLight(0xffeed6, 0.8, 14, 1.8)
      fill.position.set(x, y - 1.5, z)
      this.group.add(fill)
      this.lights.push(fill)
    }

    createChandelierLight(0, 4.4, -3.8)
    createChandelierLight(0, 4.4, 3.8)

    // 4. Wall Sconces Accent Points
    const sconcePositions = [
      new THREE.Vector3(-9.6, 2.4, -3.5),
      new THREE.Vector3(-9.6, 2.4, 3.5),
      new THREE.Vector3(9.6, 2.4, -2.1),
      new THREE.Vector3(9.6, 2.4, 2.1),
    ]
    sconcePositions.forEach((pos) => {
      const lamp = new THREE.PointLight(0xffe8c2, 0.55, 6.0, 2)
      lamp.position.copy(pos)
      this.group.add(lamp)
      this.lights.push(lamp)
    })

    // 5. Targeted Collection Spotlights
    const createSpot = (
      pos: [number, number, number],
      target: [number, number, number],
      intensity: number,
      angle: number,
      shadow = false,
    ) => {
      const spot = new THREE.SpotLight(0xfff6eb, intensity, 16, angle, 0.55, 1.4)
      spot.position.set(...pos)
      const aim = new THREE.Object3D()
      aim.position.set(...target)
      this.group.add(aim)
      spot.target = aim
      spot.castShadow = shadow && !this.isMobile
      if (spot.castShadow) {
        spot.shadow.mapSize.set(512, 512)
        spot.shadow.bias = -0.002
      }
      this.group.add(spot)
      this.lights.push(spot)
    }

    // A. Center: 3D Campus Miniature Vitrine
    createSpot([0, 4.9, 0], [0, 0.9, 0], 3.6, Math.PI / 4.2, true)
    createSpot([-1.2, 4.6, 0], [0, 0.9, 0], 2.0, Math.PI / 4.5)
    createSpot([1.2, 4.6, 0], [0, 0.9, 0], 2.0, Math.PI / 4.5)

    // B. West Wall: History Lectern & Grand Wall Display
    createSpot([-6.0, 4.6, 0], [-7.6, 1.2, 0], 3.2, Math.PI / 4.5, true)
    createSpot([-7.0, 4.6, 0], [-9.8, 2.4, 0], 2.2, Math.PI / 4.0)

    // C. South-West Wall: 5 Founders Gallery
    createSpot([-6.8, 4.6, 5.5], [-6.8, 2.0, 7.8], 2.8, Math.PI / 4.2)

    // D. South Wall: 13 Directorate & Rectorate Gallery (2 balanced spots for wide coverage)
    createSpot([-0.8, 4.6, 5.5], [-0.8, 2.0, 7.8], 2.8, Math.PI / 4.2)
    createSpot([3.6, 4.6, 5.5], [3.6, 2.0, 7.8], 2.8, Math.PI / 4.2)

    // E. North Wall: Early Campus Photo Gallery
    createSpot([-1.6, 4.6, -5.5], [-1.6, 2.0, -7.8], 2.8, Math.PI / 4.2)
    createSpot([1.6, 4.6, -5.5], [1.6, 2.0, -7.8], 2.8, Math.PI / 4.2)

    // F. East Wall: The 3 Historical Bookcases (Rak 01, Rak 02, Rak 03)
    createSpot([7.5, 4.6, -4.5], [9.7, 1.6, -4.5], 2.6, Math.PI / 4.5)
    createSpot([7.5, 4.6, 0], [9.7, 1.6, 0], 2.6, Math.PI / 4.5)
    createSpot([7.5, 4.6, 4.5], [9.7, 1.6, 4.5], 2.6, Math.PI / 4.5)

    // G. North Flanks: Rak 04 and Rak 05
    createSpot([-7.8, 4.6, -5.5], [-7.8, 1.6, -7.7], 2.6, Math.PI / 4.5)
    createSpot([7.8, 4.6, -5.5], [7.8, 1.6, -7.7], 2.6, Math.PI / 4.5)
  }

  public dispose(): void {
    this.lights.forEach((l) => {
      l.dispose()
    })
    this.lights = []
  }
}
