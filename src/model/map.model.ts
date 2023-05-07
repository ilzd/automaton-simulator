import { BoardPointType } from "../const/map.const"
import { Vec2 } from "./math.model"

export interface BoardMap {
  points: Node[]
}

export interface Node {
  id: number
  prev: number[]
  next: number[]
  coords: Vec2,
  type: BoardPointType
}

export interface MapBounds {
  left: number
  right: number
  top: number
  bottom: number
  center: Vec2
}