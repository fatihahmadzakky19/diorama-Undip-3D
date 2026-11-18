import * as THREE from 'three'

/**
 * LightingManager — Soft, warm-white museum illumination.
 * A restrained ambient base plus focused spotlights for each collection.
 * Shadow casting is limited to the two most important fixtures and removed
 * entirely on touch devices to keep smartphones smooth.
 */
export class LightingManager {
  private group: THREE.Group
  private lights: THREE.Light[] = []
  private isMobile: boolean

  constructor(isMobile = false) {
    this.isMobile = isMobile
    this.group = new THREE.Group()
    this.group.name = 'LightingGroup'
    this.setupLighting()
  }

  public getGroup(): THREE.Group {
    return this.group
  }

  private setupLighting(): void {
    // 1. Soft ambient base — no harsh glare, no black corners
    const ambient = new THREE.AmbientLight(0xfff6ea, 0.82)
    this.group.add(ambient)
    this.lights.push(ambient)

    // 2. Gentle bounce: warm plaster above, dark walnut below
    const hemi = new THREE.HemisphereLight(0xfff8ef, 0x2b1c12, 0.58)
    hemi.position.set(0, 5, 0)
    this.group.add(hemi)
    this.lights.push(hemi)

    // 3. Central chandelier — the only wide-shadow source on desktop
    const chandelier = new THREE.PointLight(0xfff3e1, 2.3, 20, 1.7)
    chandelier.position.set(0, 4.35, 0)
    chandelier.castShadow = !this.isMobile
    chandelier.shadow.mapSize.set(1024, 1024)
    chandelier.shadow.bias = -0.0015
    chandelier.shadow.camera.near = 0.5
    chandelier.shadow.camera.far = 20
    this.group.add(chandelier)
    this.lights.push(chandelier)

    // Low fill so the floor reads as warm wood rather than a dark void
    const fill = new THREE.PointLight(0xffeed6, 0.75, 14, 1.8)
    fill.position.set(0, 2.7, 0)
    this.group.add(fill)
    this.lights.push(fill)

    // 4. Simple classic wall lamps
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
      this.group.add(lamp)
      this.lights.push(lamp)
    })

    // 5. Collection spotlights — each gallery has its own soft pool of light
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
      this.group.add(aim)
      light.target = aim
      light.castShadow = shadow && !this.isMobile
      if (light.castShadow) {
        light.shadow.mapSize.set(512, 512)
        light.shadow.bias = -0.002
      }
      this.group.add(light)
      this.lights.push(light)
    }

    // Founding history — lectern book (primary shadow caster on desktop)
    spot([-3.5, 4.5, -0.6], [-4.9, 1.05, -0.6], 3.0, Math.PI / 5.2, true)
    // Archive cabinet
    spot([-5.1, 4.5, 2.6], [-6.55, 1.45, 2.6], 2.2, Math.PI / 5)
    // Dedication panel on the west wall
    if (!this.isMobile) {
      spot([-4.4, 4.5, -0.6], [-7.08, 2.35, -0.6], 1.9, Math.PI / 5)
    }

    // Early campus photograph gallery — two even groups
    spot([-2.2, 4.5, -4.6], [-2.2, 2.1, -7.08], 2.5, Math.PI / 4.2)
    spot([2.2, 4.5, -4.6], [2.2, 2.1, -7.08], 2.5, Math.PI / 4.2)

    // 13 founders gallery — two even groups
    spot([-2.3, 4.5, 4.6], [-2.3, 2.1, 7.08], 2.5, Math.PI / 4.2, true)
    spot([2.3, 4.5, 4.6], [2.3, 2.1, 7.08], 2.5, Math.PI / 4.2)

    // Official documents — glass vitrine and framed wall documents
    spot([3.4, 4.5, 0], [4.9, 1.0, 0], 2.6, Math.PI / 5)
    if (!this.isMobile) {
      spot([4.9, 4.5, 0], [7.08, 2.35, 0], 2.1, Math.PI / 5)
    }
  }

  public dispose(): void {
    this.lights.forEach((light) => {
      if (light.parent) light.parent.remove(light)
      light.dispose()
    })
    this.lights = []
  }
}
