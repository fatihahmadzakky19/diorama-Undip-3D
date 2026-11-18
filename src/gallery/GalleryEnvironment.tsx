import { useMemo } from 'react'
import * as THREE from 'three'
import { CORRIDOR, PILASTER_ZS } from './layout'
import { createFloorTexture, createPortraitTexture, createTitleTexture } from './textures'
import { PORTRAITS } from './data/portraits'

/**
 * The museum corridor: floor, walls, ceiling, moldings, pilasters,
 * entrance doors, and the end-of-corridor plaque.
 * Contains only three.js elements — all HTML UI lives outside the Canvas.
 */
export function GalleryEnvironment() {
  const floorTexture = useMemo(() => {
    const texture = createFloorTexture()
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 12)
    return texture
  }, [])

  const titleTexture = useMemo(() => createTitleTexture(), [])
  const plaqueArtTexture = useMemo(() => createPortraitTexture(PORTRAITS[0]), [])

  const length = CORRIDOR.zFront - CORRIDOR.zBack
  const centerZ = (CORRIDOR.zFront + CORRIDOR.zBack) / 2
  const wallHalf = CORRIDOR.halfWidth

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, centerZ]} receiveShadow>
        <planeGeometry args={[wallHalf * 2, length]} />
        <meshStandardMaterial map={floorTexture} roughness={0.35} metalness={0.08} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-wallHalf, CORRIDOR.height / 2, centerZ]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, CORRIDOR.height]} />
        <meshStandardMaterial color="#d6c8b2" roughness={0.9} />
      </mesh>

      {/* Right wall */}
      <mesh position={[wallHalf, CORRIDOR.height / 2, centerZ]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, CORRIDOR.height]} />
        <meshStandardMaterial color="#d6c8b2" roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, CORRIDOR.height / 2, CORRIDOR.zBack]} receiveShadow>
        <planeGeometry args={[wallHalf * 2, CORRIDOR.height]} />
        <meshStandardMaterial color="#cbcba4" roughness={0.9} />
      </mesh>

      {/* Entrance wall (behind the visitor) */}
      <mesh position={[0, CORRIDOR.height / 2, CORRIDOR.zFront]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[wallHalf * 2, CORRIDOR.height]} />
        <meshStandardMaterial color="#d6c8b2" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CORRIDOR.height, centerZ]} receiveShadow>
        <planeGeometry args={[wallHalf * 2, length]} />
        <meshStandardMaterial color="#efe6d6" roughness={0.95} />
      </mesh>

      {/* Wainscoting, chair rail, crown molding and baseboards — both sides */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {/* Dark wood wainscot */}
          <mesh position={[side * (wallHalf - 0.04), 0.375, centerZ]} receiveShadow>
            <boxGeometry args={[0.08, 0.75, length]} />
            <meshStandardMaterial color="#4a3524" roughness={0.55} metalness={0.1} />
          </mesh>
          {/* Baseboard */}
          <mesh position={[side * (wallHalf - 0.05), 0.06, centerZ]}>
            <boxGeometry args={[0.1, 0.12, length]} />
            <meshStandardMaterial color="#33241a" roughness={0.6} />
          </mesh>
          {/* Chair rail */}
          <mesh position={[side * (wallHalf - 0.05), 0.8, centerZ]}>
            <boxGeometry args={[0.1, 0.07, length]} />
            <meshStandardMaterial color="#8a6b42" roughness={0.5} metalness={0.15} />
          </mesh>
          {/* Crown molding */}
          <mesh position={[side * (wallHalf - 0.06), CORRIDOR.height - 0.16, centerZ]}>
            <boxGeometry args={[0.12, 0.2, length]} />
            <meshStandardMaterial color="#e6dccb" roughness={0.8} />
          </mesh>

          {/* Pilasters between portraits */}
          {PILASTER_ZS.map((z, i) => (
            <group key={i} position={[side * (wallHalf - 0.05), 0, z]}>
              <mesh position={[0, 2.05, 0]} receiveShadow>
                <boxGeometry args={[0.1, 3.9, 0.4]} />
                <meshStandardMaterial color="#c3b198" roughness={0.85} />
              </mesh>
              <mesh position={[0, 4.06, 0]}>
                <boxGeometry args={[0.16, 0.14, 0.5]} />
                <meshStandardMaterial color="#e0d5c2" roughness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Recessed ceiling light strips (emissive, warm) */}
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} position={[x, CORRIDOR.height - 0.06, centerZ]}>
          <boxGeometry args={[0.7, 0.08, length - 4]} />
          <meshStandardMaterial
            color="#fff3dd"
            emissive="#ffd9a0"
            emissiveIntensity={1.1}
            roughness={0.6}
          />
        </mesh>
      ))}

      {/* Entrance double doors */}
      {[-0.62, 0.62].map((x) => (
        <mesh key={x} position={[x, 1.35, CORRIDOR.zFront - 0.05]} receiveShadow>
          <boxGeometry args={[1.16, 2.7, 0.1]} />
          <meshStandardMaterial color="#4a3524" roughness={0.5} metalness={0.1} />
        </mesh>
      ))}

      {/* End-of-corridor focal: gilded plaque */}
      <group position={[0, 2.3, CORRIDOR.zBack + 0.08]}>
        <mesh castShadow>
          <boxGeometry args={[3.4, 2.3, 0.12]} />
          <meshStandardMaterial color="#c9a25f" roughness={0.35} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[3.1, 2]} />
          <meshStandardMaterial map={titleTexture} roughness={0.7} />
        </mesh>
      </group>

      {/* Flanking artworks near the end */}
      {[-2.1, 2.1].map((x) => (
        <group key={x} position={[x, 2.1, CORRIDOR.zBack + 0.06]}>
          <mesh castShadow>
            <boxGeometry args={[1.1, 1.4, 0.1]} />
            <meshStandardMaterial color="#9c6b30" roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[0.9, 1.2]} />
            <meshStandardMaterial map={plaqueArtTexture} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
