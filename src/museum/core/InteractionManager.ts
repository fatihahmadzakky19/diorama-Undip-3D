import * as THREE from 'three'
import type { InteractiveTarget } from './ObjectManager'

export class InteractionManager {
  private camera: THREE.PerspectiveCamera
  private domElement: HTMLElement
  private targets: InteractiveTarget[] = []
  private raycaster: THREE.Raycaster
  private centerScreen = new THREE.Vector2(0, 0)

  private currentTarget: InteractiveTarget | null = null
  private onHoverChange: (target: InteractiveTarget | null) => void
  private onInteract: (target: InteractiveTarget) => void

  private originalEmissives = new Map<THREE.Mesh, { color: THREE.Color; intensity: number }>()
  private maxDistance = 4.8 // Max interaction reach

  // Pre-allocated reusable vectors (zero GC pressure)
  private readonly _camDir = new THREE.Vector3()
  private readonly _toTarget = new THREE.Vector3()
  private lastCheckTime = 0
  private checkInterval = 0.05 // 50ms (20Hz) check interval is ideal for responsive hover without raycast hammering

  private onKeyDownBound: (e: KeyboardEvent) => void
  private onClickBound: (e: MouseEvent) => void

  constructor(
    camera: THREE.PerspectiveCamera,
    domElement: HTMLElement,
    targets: InteractiveTarget[],
    onHoverChange: (target: InteractiveTarget | null) => void,
    onInteract: (target: InteractiveTarget) => void,
  ) {
    this.camera = camera
    this.domElement = domElement
    this.targets = targets
    this.onHoverChange = onHoverChange
    this.onInteract = onInteract

    this.raycaster = new THREE.Raycaster()
    this.raycaster.far = this.maxDistance

    this.onKeyDownBound = this.onKeyDown.bind(this)
    this.onClickBound = this.onClick.bind(this)

    window.addEventListener('keydown', this.onKeyDownBound)
    this.domElement.addEventListener('click', this.onClickBound)
  }

  public setTargets(targets: InteractiveTarget[]): void {
    this.targets = targets
  }

  public hasActiveHighlight(): boolean {
    return this.currentTarget !== null
  }

  public update(time: number): void {
    const shouldCheck = time - this.lastCheckTime >= this.checkInterval
    if (shouldCheck) {
      this.lastCheckTime = time
      this.raycaster.setFromCamera(this.centerScreen, this.camera)

      let foundTarget: InteractiveTarget | null = null
      let closestDistance = Infinity

      for (const target of this.targets) {
        const dist = this.camera.position.distanceTo(target.position)
        if (dist > this.maxDistance) continue

        // Raycast against target's meshes
        const intersects = this.raycaster.intersectObjects(target.mesh.children, true)
        if (intersects.length > 0 && intersects[0].distance < closestDistance) {
          closestDistance = intersects[0].distance
          foundTarget = target
        } else {
          // Check if looking generally in the direction of the target when close (using reusable vectors)
          this.camera.getWorldDirection(this._camDir)
          this._toTarget.subVectors(target.position, this.camera.position).normalize()
          const dot = this._camDir.dot(this._toTarget)

          // If player is close (< 3.2m) and looking directly at it (angle < 24 deg)
          if (dist < 3.2 && dot > 0.91 && dist < closestDistance) {
            closestDistance = dist
            foundTarget = target
          }
        }
      }

      // Handle hover change
      if (foundTarget !== this.currentTarget) {
        if (this.currentTarget) {
          this.clearHighlight(this.currentTarget)
        }
        this.currentTarget = foundTarget
        this.onHoverChange(this.currentTarget)
      }
    }

    // Animate glowing highlight if currently hovering
    if (this.currentTarget) {
      const pulse = 0.25 + Math.sin(time * 5.5) * 0.15
      this.applyHighlightPulse(this.currentTarget, pulse)
    }
  }

  private applyHighlightPulse(target: InteractiveTarget, pulse: number): void {
    target.highlightMeshes.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        if (!this.originalEmissives.has(mesh)) {
          this.originalEmissives.set(mesh, {
            color: mesh.material.emissive.clone(),
            intensity: mesh.material.emissiveIntensity,
          })
        }
        mesh.material.emissive.setHex(0xc9a25f) // Warm antique gold glow
        mesh.material.emissiveIntensity = pulse
      }
    })
  }

  private clearHighlight(target: InteractiveTarget): void {
    target.highlightMeshes.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        const orig = this.originalEmissives.get(mesh)
        if (orig) {
          mesh.material.emissive.copy(orig.color)
          mesh.material.emissiveIntensity = orig.intensity
          this.originalEmissives.delete(mesh)
        } else {
          mesh.material.emissive.setHex(0x000000)
          mesh.material.emissiveIntensity = 0
        }
      }
    })
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.code === 'KeyE' && this.currentTarget) {
      this.triggerInteraction()
    }
  }

  private onClick(): void {
    if (this.currentTarget) {
      this.triggerInteraction()
    }
  }

  private triggerInteraction(): void {
    if (this.currentTarget) {
      this.onInteract(this.currentTarget)
    }
  }

  public interactCurrentTarget(): void {
    this.triggerInteraction()
  }

  public getCurrentTarget(): InteractiveTarget | null {
    return this.currentTarget
  }

  public dispose(): void {
    if (this.currentTarget) {
      this.clearHighlight(this.currentTarget)
    }
    window.removeEventListener('keydown', this.onKeyDownBound)
    this.domElement.removeEventListener('click', this.onClickBound)
    this.originalEmissives.clear()
    this.targets = []
  }
}
