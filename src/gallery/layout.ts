import { PORTRAITS } from './data/portraits'

/**
 * Corridor dimensions in meters.
 * The corridor starts at a fixed entrance and grows backwards to fit
 * every portrait — derived from the data, so adding entries to
 * `PORTRAITS` automatically lengthens the gallery (and vice versa).
 */

/** Fixed width/height of the corridor. */
const HALF_WIDTH = 3
const HEIGHT = 4.5
/** Entrance wall (doors) stays put behind the visitor. */
const Z_FRONT = 12
/** Free wall behind the last portrait — room for the end plaque. */
const BACK_MARGIN = 3

export const EYE_HEIGHT = 1.6
export const START_Z = 8
export const WALK_SPEED = 3.2

/** Portrait placement. */
export const FRAME_Y = 2.3
export const WALL_X = 2.92
export const SPACING = 4.2
export const FIRST_Z = 6

/** Portraits per wall (the left wall takes the extra one when odd). */
export const PER_SIDE = Math.max(1, Math.ceil(PORTRAITS.length / 2))
/** Z of the last portrait slot on the longest wall. */
export const LAST_Z = FIRST_Z - (PER_SIDE - 1) * SPACING

export const CORRIDOR = {
  halfWidth: HALF_WIDTH,
  height: HEIGHT,
  zFront: Z_FRONT,
  zBack: LAST_Z - BACK_MARGIN,
} as const

export const CORRIDOR_LENGTH = CORRIDOR.zFront - CORRIDOR.zBack
export const MOVE_MIN_Z = CORRIDOR.zBack + 1.5
export const MOVE_MAX_Z = CORRIDOR.zFront - 1.5

/** Decorative pilasters: between portrait slots, plus one before the end wall. */
export const PILASTER_ZS: number[] = (() => {
  const zs: number[] = []
  for (let i = 0; i < PER_SIDE - 1; i++) zs.push(FIRST_Z - i * SPACING - SPACING / 2)
  zs.push(LAST_Z - SPACING / 2)
  return zs
})()

/** Look constraints. */
export const PITCH_LIMIT = 0.62
export const LOOK_SENSITIVITY = 0.0022
export const DRAG_SENSITIVITY = 0.005
export const DRAG_THRESHOLD = 6
