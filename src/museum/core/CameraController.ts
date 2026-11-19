import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import type { ObstacleBox } from './ObjectManager'

export class CameraController {
  private camera: THREE.PerspectiveCamera
  private controls: PointerLockControls
  private domElement: HTMLElement

  // Movement state
  private moveForward = false
  private moveBackward = false
  private moveLeft = false
  private moveRight = false

  // Mobile virtual joystick & touch look state
  private joystickVector = new THREE.Vector2(0, 0)
  private lookSensitivity = 1.0
  private cameraEuler = new THREE.Euler(0, 0, 0, 'YXZ')

  // Physics & smoothing
  private velocity = new THREE.Vector3()
  private direction = new THREE.Vector3()
  private speed = 4.2 // comfortable gallery walking pace
  private damping = 12.0 // smooth acceleration and stop
  private playerRadius = 0.42
  public readonly eyeHeight = 1.68

  // Pre-allocated reusable scratch vectors (zero GC pressure)
  private readonly _forward = new THREE.Vector3()
  private readonly _right = new THREE.Vector3()
  private readonly _step = new THREE.Vector3()
  private readonly _lastPos = new THREE.Vector3()
  private readonly _lastQuat = new THREE.Quaternion()
  private _hasMoved = true

  // Room & obstacle boundaries
  private roomHalfX: number
  private roomHalfZ: number
  private obstacles: ObstacleBox[] = []

  // Subtle head bob
  private bobTimer = 0

  // Event handlers bound
  private onKeyDownBound: (e: KeyboardEvent) => void
  private onKeyUpBound: (e: KeyboardEvent) => void

  constructor(
    camera: THREE.PerspectiveCamera,
    domElement: HTMLElement,
    roomSize = 14.4,
    obstacles: ObstacleBox[] = [],
  ) {
    this.camera = camera
    this.domElement = domElement
    this.roomHalfX = roomSize / 2
    this.roomHalfZ = roomSize / 2
    this.obstacles = obstacles

    this.controls = new PointerLockControls(this.camera, this.domElement)

    // Set initial position & orientation: standing facing North
    this.reset()

    // Clamp vertical look angle: PointerLockControls allows minPolarAngle & maxPolarAngle
    this.controls.minPolarAngle = Math.PI * 0.1 // ~18 deg looking up
    this.controls.maxPolarAngle = Math.PI * 0.9 // ~162 deg looking down

    this.onKeyDownBound = this.onKeyDown.bind(this)
    this.onKeyUpBound = this.onKeyUp.bind(this)

    window.addEventListener('keydown', this.onKeyDownBound)
    window.addEventListener('keyup', this.onKeyUpBound)
  }

  public getControls(): PointerLockControls {
    return this.controls
  }

  public lock(): void {
    if (!this.controls.isLocked) {
      this.controls.lock()
    }
  }

  public unlock(): void {
    if (this.controls.isLocked) {
      this.controls.unlock()
    }
  }

  public isLocked(): boolean {
    return this.controls.isLocked
  }

  public setObstacles(obstacles: ObstacleBox[]): void {
    this.obstacles = obstacles
  }

  public setRoomBounds(halfX: number, halfZ: number): void {
    this.roomHalfX = halfX
    this.roomHalfZ = halfZ
  }

  public setSpawn(x: number, y: number, z: number, lookAngle = 0): void {
    this.camera.position.set(x, y, z)
    this.camera.rotation.set(0, lookAngle, 0)
    this.velocity.set(0, 0, 0)
    this.joystickVector.set(0, 0)
    this._hasMoved = true
  }

  public reset(): void {
    this.camera.position.set(0, this.eyeHeight, 3.4)
    this.camera.rotation.set(0, 0, 0)
    this.velocity.set(0, 0, 0)
    this.joystickVector.set(0, 0)
    this._hasMoved = true
  }

  public setJoystickInput(x: number, y: number): void {
    this.joystickVector.set(x, y)
    if (this.joystickVector.lengthSq() > 0.0001) {
      this._hasMoved = true
    }
  }

  public addTouchLook(deltaX: number, deltaY: number): void {
    this.cameraEuler.setFromQuaternion(this.camera.quaternion)
    const factor = 0.0028 * this.lookSensitivity
    this.cameraEuler.y -= deltaX * factor
    this.cameraEuler.x -= deltaY * factor
    // Clamp vertical pitch (-72 deg to +72 deg) so camera never flips
    const maxPitch = Math.PI * 0.4
    this.cameraEuler.x = Math.max(-maxPitch, Math.min(maxPitch, this.cameraEuler.x))
    this.camera.quaternion.setFromEuler(this.cameraEuler)
    this._hasMoved = true
  }

  public isMoving(): boolean {
    return (
      this.moveForward ||
      this.moveBackward ||
      this.moveLeft ||
      this.moveRight ||
      this.joystickVector.lengthSq() > 0.0001 ||
      this.velocity.lengthSq() > 0.0001 ||
      this._hasMoved
    )
  }

  public setLookSensitivity(val: number): void {
    this.lookSensitivity = Math.max(0.3, Math.min(3.0, val))
  }

  public getLookSensitivity(): number {
    return this.lookSensitivity
  }

  private onKeyDown(event: KeyboardEvent): void {
    // If typing in an input or modal, ignore
    const target = event.target as HTMLElement
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return

    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.moveForward = true
        break
      case 'ArrowLeft':
      case 'KeyA':
        this.moveLeft = true
        break
      case 'ArrowDown':
      case 'KeyS':
        this.moveBackward = true
        break
      case 'ArrowRight':
      case 'KeyD':
        this.moveRight = true
        break
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.moveForward = false
        break
      case 'ArrowLeft':
      case 'KeyA':
        this.moveLeft = false
        break
      case 'ArrowDown':
      case 'KeyS':
        this.moveBackward = false
        break
      case 'ArrowRight':
      case 'KeyD':
        this.moveRight = false
        break
    }
  }

  public update(delta: number): void {
    const hasJoystick = this.joystickVector.lengthSq() > 0.0001

    if (!this.controls.isLocked && !hasJoystick) {
      // Apply deceleration when not locked and not using joystick
      this.velocity.x -= this.velocity.x * this.damping * delta
      this.velocity.z -= this.velocity.z * this.damping * delta
      return
    }

    // Clamp delta to avoid huge physics jumps on frame drop
    const safeDelta = Math.min(delta, 0.1)

    // Calculate input direction (prioritizing joystick if active, else keyboard)
    if (hasJoystick) {
      this.direction.x = this.joystickVector.x
      this.direction.z = -this.joystickVector.y
    } else {
      this.direction.z = Number(this.moveForward) - Number(this.moveBackward)
      this.direction.x = Number(this.moveRight) - Number(this.moveLeft)
    }

    if (this.direction.lengthSq() > 1.0) {
      this.direction.normalize()
    }

    // Apply friction damping
    this.velocity.x -= this.velocity.x * this.damping * safeDelta
    this.velocity.z -= this.velocity.z * this.damping * safeDelta

    // Accelerate
    if (this.direction.z !== 0) {
      this.velocity.z -= this.direction.z * this.speed * 10 * safeDelta
    }
    if (this.direction.x !== 0) {
      this.velocity.x += this.direction.x * this.speed * 10 * safeDelta
    }

    // Attempt movement with collision detection
    const moveX = this.velocity.x * safeDelta
    const moveZ = -this.velocity.z * safeDelta

    // Get current camera forward & right vectors on XZ plane (reuse pre-allocated vectors)
    this.camera.getWorldDirection(this._forward)
    this._forward.y = 0
    this._forward.normalize()

    this._right.crossVectors(this._forward, this.camera.up).normalize()

    // Compute proposed step
    this._step.set(0, 0, 0)
      .addScaledVector(this._right, moveX)
      .addScaledVector(this._forward, moveZ)

    // 1. Try X movement alone (allows sliding along obstacles)
    const newX = this.camera.position.x + this._step.x
    if (!this.checkCollision(newX, this.camera.position.z)) {
      this.camera.position.x = newX
    } else {
      this.velocity.x = 0
    }

    // 2. Try Z movement alone
    const newZ = this.camera.position.z + this._step.z
    if (!this.checkCollision(this.camera.position.x, newZ)) {
      this.camera.position.z = newZ
    } else {
      this.velocity.z = 0
    }

    // 3. Keep within Room Boundaries
    const limitX = this.roomHalfX - this.playerRadius - 0.2
    const limitZ = this.roomHalfZ - this.playerRadius - 0.2
    this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, -limitX, limitX)
    this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, -limitZ, limitZ)

    // 4. Subtle head bobbing when walking
    const currentSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z)
    if (currentSpeed > 0.5) {
      this.bobTimer += safeDelta * 9.5
      this.camera.position.y = this.eyeHeight + Math.sin(this.bobTimer) * 0.024
    } else {
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, this.eyeHeight, safeDelta * 8)
    }

    // Check if camera moved this frame
    const posChanged = this.camera.position.distanceToSquared(this._lastPos) > 0.000001
    const rotChanged = 1 - Math.abs(this.camera.quaternion.dot(this._lastQuat)) > 0.000001
    this._hasMoved = posChanged || rotChanged
    if (this._hasMoved) {
      this._lastPos.copy(this.camera.position)
      this._lastQuat.copy(this.camera.quaternion)
    }
  }

  private checkCollision(x: number, z: number): boolean {
    const r = this.playerRadius

    // Check against all registered obstacle boxes
    for (const box of this.obstacles) {
      if (
        x + r > box.minX &&
        x - r < box.maxX &&
        z + r > box.minZ &&
        z - r < box.maxZ
      ) {
        return true
      }
    }
    return false
  }

  public dispose(): void {
    window.removeEventListener('keydown', this.onKeyDownBound)
    window.removeEventListener('keyup', this.onKeyUpBound)
    this.controls.dispose()
  }
}
