import { MAP_STEP_SIZE } from "../const/map.const";
import { cartToIso } from "./math.util";

export function getMapPointPosition (x: number, y: number) {
  const cartX = x * MAP_STEP_SIZE
  const cartY = y * MAP_STEP_SIZE
  return cartToIso(cartX, cartY)
}