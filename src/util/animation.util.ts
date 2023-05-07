import { CharAnimDir, CharAnimType } from "../const/animation.const";

export function makeAnimName (type: CharAnimType, dir: CharAnimDir) {
  return `${type}_${dir}`
}

export function getAnimDir (x: number, y: number) {
  if(x > 0) return CharAnimDir.L
  if(x < 0) return CharAnimDir.O
  if(y > 0) return CharAnimDir.S
  if(y < 0) return CharAnimDir.N
}