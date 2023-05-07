import { makeAnimName } from "../util/animation.util"
import { STEP_DURATION } from "./game.const"

export enum CharAnimDir {
  NO = 'NO',
  N = 'N',
  NE = 'NE',
  L = 'L',
  SE = 'SE',
  S = 'S',
  SO = 'SO',
  O = 'O'
}

export enum CharAnimType {
  WALK = 'WALK',
  IDLE = 'IDLE',
  SIT = 'SIT'
}


export const CHAR_ANIM_DIR_DATA = [
  { name: makeAnimName(CharAnimType.WALK, CharAnimDir.NO), start: 0, end: 7, duration: STEP_DURATION, yoyo: false, flip: false },
  { name: makeAnimName(CharAnimType.WALK, CharAnimDir.N), start: 8, end: 15, duration: STEP_DURATION, yoyo: false, flip: false },
  { name: makeAnimName(CharAnimType.WALK, CharAnimDir.NE), start: 16, end: 23, duration: STEP_DURATION, yoyo: false, flip: false },
  { name: makeAnimName(CharAnimType.WALK, CharAnimDir.L), start: 24, end: 31, duration: STEP_DURATION, yoyo: false, flip: false },
  { name: makeAnimName(CharAnimType.WALK, CharAnimDir.SE), start: 32, end: 39, duration: STEP_DURATION, yoyo: false, flip: false },
  { name: makeAnimName(CharAnimType.WALK, CharAnimDir.S), start: 24, end: 31, duration: STEP_DURATION, yoyo: false, flip: true },
  { name: makeAnimName(CharAnimType.WALK, CharAnimDir.SO), start: 16, end: 23, duration: STEP_DURATION, yoyo: false, flip: true },
  { name: makeAnimName(CharAnimType.WALK, CharAnimDir.O), start: 8, end: 15, duration: STEP_DURATION, yoyo: false, flip: true },
  { name: makeAnimName(CharAnimType.IDLE, CharAnimDir.NO), start: 40, end: 47, duration: 1000, yoyo: true, flip: false },
  { name: makeAnimName(CharAnimType.IDLE, CharAnimDir.N), start: 48, end: 55, duration: 1000, yoyo: true, flip: false },
  { name: makeAnimName(CharAnimType.IDLE, CharAnimDir.NE), start: 56, end: 63, duration: 1000, yoyo: true, flip: false },
  { name: makeAnimName(CharAnimType.IDLE, CharAnimDir.L), start: 64, end: 71, duration: 1000, yoyo: true, flip: false },
  { name: makeAnimName(CharAnimType.IDLE, CharAnimDir.SE), start: 72, end: 79, duration: 1000, yoyo: true, flip: false },
  { name: makeAnimName(CharAnimType.IDLE, CharAnimDir.S), start: 64, end: 71, duration: 1000, yoyo: true, flip: true },
  { name: makeAnimName(CharAnimType.IDLE, CharAnimDir.SO), start: 56, end: 63, duration: 1000, yoyo: true, flip: true },
  { name: makeAnimName(CharAnimType.IDLE, CharAnimDir.O), start: 48, end: 55, duration: 1000, yoyo: true, flip: true },
  { name: makeAnimName(CharAnimType.SIT, CharAnimDir.L), start: 81, end: 81, duration: 1000, yoyo: true, flip: false },
  { name: makeAnimName(CharAnimType.SIT, CharAnimDir.S), start: 80, end: 80, duration: 1000, yoyo: true, flip: false },
  { name: makeAnimName(CharAnimType.SIT, CharAnimDir.O), start: 80, end: 80, duration: 1000, yoyo: true, flip: true },
  { name: makeAnimName(CharAnimType.SIT, CharAnimDir.N), start: 81, end: 81, duration: 1000, yoyo: true, flip: true },
]