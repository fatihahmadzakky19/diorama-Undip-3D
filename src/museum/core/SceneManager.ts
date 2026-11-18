import * as THREE from 'three'
import { RoomBuilder } from './RoomBuilder'
import { LightingManager } from './LightingManager'
import { ObjectManager, type InteractiveTarget } from './ObjectManager'
import { CameraController } from './CameraController'
import { InteractionManager } from './InteractionManager'
import { AssetManager } from './AssetManager'
import { SoundManager } from './SoundManager'

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

  // Clock & animation loop
  private clock = new THREE.Clock()
  private animationFrameId: number | null = null
  private isRunning = false
  private tickTimer = 0
  private isTock = false

  // Adaptive on-demand rendering & modal pause state
  private isModalOpen = false
  private settleFrames = 15 // Render first frames to ensure complete illumination
  private onResizeBound: () => void
  private onVisibilityChangeBound: () => void

  constructor(
    container: HTMLElement,
    onHoverChange: (target: InteractiveTarget | null) => void,
    onInteract: (target: InteractiveTarget) => void,
  ) {
    this.container = container
    this.soundManager = SoundManager.getInstance()

    // 1. Scene — soft warm heritage atmosphere
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x241a12)
    this.scene.fog = new THREE.Fog(0x241a12, 18, 34)

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 40)

    // 3. Renderer — balanced exposure; shadows disabled on touch devices
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
    this.renderer.toneMappingExposure = 1.3
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    container.appendChild(this.renderer.domElement)

    // 4. Initialize Modular Managers
    this.lightingManager = new LightingManager(isTouch)
    this.scene.add(this.lightingManager.getGroup())

    this.roomBuilder = new RoomBuilder()
    this.scene.add(this.roomBuilder.getGroup())

    this.objectManager = new ObjectManager()
    this.scene.add(this.objectManager.getGroup())

    // 5. Camera Controller with collision obstacles
    this.cameraController = new CameraController(
      this.camera,
      this.renderer.domElement,
      this.roomBuilder.roomSize,
      this.objectManager.getObstacles(),
    )

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
        this.requestRender(8)
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

  public start(): void {
    if (!this.isRunning) {
      this.isRunning = true
      this.clock.start()
      this.loop()
    }
  }

  public pause(): void {
    this.isRunning = false
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  public setModalOpen(open: boolean): void {
    this.isModalOpen = open
    if (!open) {
      this.requestRender(8)
    }
  }

  public requestRender(frames = 4): void {
    this.settleFrames = Math.max(this.settleFrames, frames)
  }

  private loop(): void {
    if (!this.isRunning) return

    this.animationFrameId = requestAnimationFrame(() => this.loop())

    // Pause WebGL rendering entirely when reading exhibits in modal dialogs
    if (this.isModalOpen) return

    const delta = this.clock.getDelta()
    const elapsedTime = this.clock.getElapsedTime()

    // Update camera motion & collisions
    this.cameraController.update(delta)

    // Update raycast interaction
    this.interactionManager.update(elapsedTime)

    // Update decorative objects & 3D book leaf animation
    this.objectManager.update(elapsedTime, delta)

    // Clock ticking sound every 1 second
    this.tickTimer += delta
    if (this.tickTimer >= 1.0) {
      this.tickTimer -= 1.0
      this.soundManager.playClockTick(this.isTock)
      this.isTock = !this.isTock
    }

    // Adaptive on-demand render triggers: motion, hover glow pulse, or page turns
    if (this.cameraController.isMoving()) {
      this.requestRender(4)
    }
    if (this.interactionManager.hasActiveHighlight()) {
      this.requestRender(2)
    }
    if (this.objectManager.isAnimating()) {
      this.requestRender(2)
    }

    // Only render WebGL frame when actively moving/animating or settling
    if (this.settleFrames > 0) {
      this.settleFrames--
      this.renderer.render(this.scene, this.camera)
    }
  }

  private onWindowResize(): void {
    if (!this.container) return
    const width = this.container.clientWidth
    const height = this.container.clientHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    this.requestRender(6)
  }

  public getCameraController(): CameraController {
    return this.cameraController
  }

  public getInteractionManager(): InteractionManager {
    return this.interactionManager
  }

  public setJoystickInput(x: number, y: number): void {
    this.cameraController.setJoystickInput(x, y)
    this.requestRender(4)
  }

  public addTouchLook(deltaX: number, deltaY: number): void {
    this.cameraController.addTouchLook(deltaX, deltaY)
    this.requestRender(4)
  }

  public setLookSensitivity(val: number): void {
    this.cameraController.setLookSensitivity(val)
  }

  public getLookSensitivity(): number {
    return this.cameraController.getLookSensitivity()
  }

  public interactCurrentTarget(): void {
    this.interactionManager.interactCurrentTarget()
  }

  public triggerBookPageTurn(): void {
    this.objectManager.triggerBookPageTurn()
    this.soundManager.playPaperTurn()
    this.requestRender(30)
  }

  public dispose(): void {
    this.pause()
    window.removeEventListener('resize', this.onResizeBound)
    document.removeEventListener('visibilitychange', this.onVisibilityChangeBound)

    this.cameraController.dispose()
    this.interactionManager.dispose()
    this.objectManager.dispose()
    this.roomBuilder.dispose()
    this.lightingManager.dispose()

    this.renderer.dispose()
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
    }

    AssetManager.getInstance().dispose()
    this.soundManager.stopAmbient()
  }
}
