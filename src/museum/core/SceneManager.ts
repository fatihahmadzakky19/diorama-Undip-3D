import * as THREE from 'three'
import { RoomBuilder } from './RoomBuilder'
import { LightingManager } from './LightingManager'
import { ObjectManager, type InteractiveTarget } from './ObjectManager'
import { CameraController } from './CameraController'
import { InteractionManager } from './InteractionManager'
import { SoundManager } from './SoundManager'
import { PHYSICAL_EXHIBITS, BOOKSHELF_CATEGORIES } from '../data/historyData'

export class SceneManager {
  private container: HTMLElement
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer

  private roomBuilder: RoomBuilder
  private lightingManager: LightingManager
  private objectManager: ObjectManager
  private cameraController: CameraController
  private interactionManager: InteractionManager
  private soundManager: SoundManager

  // Active zone is single heritage room
  private activeZoneId = 'archive-room'

  // Clock & animation loop
  private clock = new THREE.Clock()
  private animationFrameId: number | null = null
  private isRunning = false
  private tickTimer = 0
  private isTock = false

  // Adaptive on-demand rendering & modal pause state
  private isModalOpen = false
  private settleFrames = 20
  private onResizeBound: () => void
  private onVisibilityChangeBound: () => void

  constructor(
    container: HTMLElement,
    onHoverChange: (target: InteractiveTarget | null) => void,
    onInteract: (target: InteractiveTarget) => void,
  ) {
    this.container = container
    this.soundManager = SoundManager.getInstance()

    // 1. Scene — soft warm vintage heritage atmosphere
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x1e1610)
    this.scene.fog = new THREE.Fog(0x1e1610, 18, 38)

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 45)

    // 3. Renderer — balanced exposure; optimized shadows
    const isTouch =
      'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 840
    this.renderer = new THREE.WebGLRenderer({
      antialias: !isTouch,
      powerPreference: 'high-performance',
      stencil: false,
    })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2))
    this.renderer.shadowMap.enabled = !isTouch
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.32
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    container.appendChild(this.renderer.domElement)

    // 4. Initialize Single Room Managers
    this.lightingManager = new LightingManager(isTouch)
    this.scene.add(this.lightingManager.getGroup())

    this.roomBuilder = new RoomBuilder()
    this.scene.add(this.roomBuilder.getGroup())

    this.objectManager = new ObjectManager()
    this.scene.add(this.objectManager.getGroup())

    // 5. Camera Controller with collision obstacles & room bounds
    this.cameraController = new CameraController(
      this.camera,
      this.renderer.domElement,
      this.roomBuilder.roomWidth,
      this.objectManager.getObstacles(),
    )
    this.cameraController.setRoomBounds(
      this.roomBuilder.roomWidth / 2 - 0.4,
      this.roomBuilder.roomDepth / 2 - 0.4,
    )
    // Spawn at South Entrance looking North towards central miniature
    this.cameraController.setSpawn(0, this.cameraController.eyeHeight, 5.2, 0)

    // 6. Interaction Manager
    this.interactionManager = new InteractionManager(
      this.camera,
      this.renderer.domElement,
      this.objectManager.getInteractiveTargets(),
      onHoverChange,
      (target) => {
        this.soundManager.playPaperTurn()
        onInteract(target)
      },
    )

    // 7. Event Listeners & Adaptive Render Bindings
    this.cameraController.getControls().addEventListener('change', () => this.requestRender(4))

    this.onResizeBound = this.onWindowResize.bind(this)
    this.onVisibilityChangeBound = () => {
      if (document.hidden) {
        this.pause()
      } else {
        this.start()
        this.requestRender(10)
      }
    }
    window.addEventListener('resize', this.onResizeBound)
    document.addEventListener('visibilitychange', this.onVisibilityChangeBound)

    // Start rendering loop
    this.start()

    if (import.meta.env.DEV) {
      ;(window as unknown as { __museum?: SceneManager }).__museum = this
    }
  }

  public getInteractiveTargets(): InteractiveTarget[] {
    return this.objectManager.getInteractiveTargets()
  }

  public getActiveZoneId(): string {
    return this.activeZoneId
  }

  public focusOnExhibit(exhibitId: string): void {
    const exhibit = PHYSICAL_EXHIBITS.find((e) => e.id === exhibitId)
    if (exhibit) {
      this.camera.position.set(...exhibit.cameraFocusPos)
      this.camera.lookAt(...exhibit.cameraLookPos)
      this.requestRender(15)
    }
  }

  public focusOnBookshelf(shelfId: string): void {
    const shelf = BOOKSHELF_CATEGORIES.find((s) => s.shelfId === shelfId)
    if (shelf) {
      this.camera.position.set(...shelf.cameraFocusPos)
      this.camera.lookAt(...shelf.cameraLookPos)
      this.requestRender(15)
    }
  }

  public resetCameraToActiveZone(): void {
    this.cameraController.setSpawn(0, this.cameraController.eyeHeight, 5.2, 0)
    this.requestRender(12)
  }

  // Backwards compatibility stub
  public switchZone(_zoneId: string): void {
    this.resetCameraToActiveZone()
  }

  public setModalOpen(isOpen: boolean): void {
    this.isModalOpen = isOpen
    if (isOpen) {
      this.pause()
    } else {
      this.start()
      this.requestRender(15)
    }
  }

  public getIsModalOpen(): boolean {
    return this.isModalOpen
  }

  public requestRender(frameCount = 5): void {
    this.settleFrames = Math.max(this.settleFrames, frameCount)
  }

  public triggerBookPageTurn(): void {
    this.objectManager.triggerBookPageTurn()
    this.soundManager.playPaperTurn()
    this.requestRender(45)
  }

  public setJoystickInput(x: number, y: number): void {
    this.cameraController.setJoystickInput(x, y)
    this.requestRender(4)
  }

  public addTouchLook(dx: number, dy: number): void {
    this.cameraController.addTouchLook(dx, dy)
    this.requestRender(4)
  }

  public setLookSensitivity(val: number): void {
    this.cameraController.setLookSensitivity(val)
  }

  public getCameraController(): CameraController {
    return this.cameraController
  }

  public getInteractionManager(): InteractionManager {
    return this.interactionManager
  }

  public getObjectManager(): ObjectManager {
    return this.objectManager
  }

  public getRoomBuilder(): RoomBuilder {
    return this.roomBuilder
  }

  public getLightingManager(): LightingManager {
    return this.lightingManager
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer
  }

  public getScene(): THREE.Scene {
    return this.scene
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera
  }

  public start(): void {
    if (this.isRunning) return
    this.isRunning = true
    this.clock.start()
    this.animate()
  }

  public pause(): void {
    this.isRunning = false
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  private animate = (): void => {
    if (!this.isRunning) return

    this.animationFrameId = requestAnimationFrame(this.animate)

    const delta = Math.min(this.clock.getDelta(), 0.1)
    const time = this.clock.getElapsedTime()

    // 1. Update Camera movement & physics
    this.cameraController.update(delta)

    // 2. Update ObjectManager animations
    this.objectManager.update(time, delta)

    // 3. Update interaction raycast (throttled at ~20Hz inside manager)
    this.interactionManager.update(time)

    // 4. Vintage clock tick sound
    this.tickTimer += delta
    if (this.tickTimer >= 1.0) {
      this.tickTimer = 0
      this.soundManager.playClockTick(this.isTock)
      this.isTock = !this.isTock
    }

    // 5. On-Demand Rendering check
    const isMoving = this.cameraController.isMoving()
    const isAnim = this.objectManager.isAnimating()

    if (isMoving || isAnim || this.settleFrames > 0) {
      this.renderer.render(this.scene, this.camera)
      if (this.settleFrames > 0) {
        this.settleFrames--
      }
    }
  }

  private onWindowResize(): void {
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    if (width === 0 || height === 0) return

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    this.requestRender(10)
  }

  public dispose(): void {
    this.pause()

    window.removeEventListener('resize', this.onResizeBound)
    document.removeEventListener('visibilitychange', this.onVisibilityChangeBound)

    this.cameraController.dispose()
    this.interactionManager.dispose()
    this.lightingManager.dispose()

    this.renderer.dispose()
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement)
    }

    if (import.meta.env.DEV) {
      delete (window as unknown as { __museum?: unknown }).__museum
    }
  }
}
