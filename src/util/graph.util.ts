import { Node } from "../model/map.model";

export function getPossiblePaths (points: Node[], from: number, steps: number, result: number[][], backwards: boolean, currPath?: number[]) {
  if (!steps) {
    result.push(currPath ? currPath : [])
    return
  }

  const currPoint = points.find(point => point.id === from)
  if (!currPoint) return

  const nextPoints = points.filter(point => backwards ? point.next.includes(from) : point.prev.includes(from))
  if (!nextPoints?.length) {
    result.push(currPath ? currPath : [])
    return
  }
  
  nextPoints.forEach(nextPoint => {
    const newPath = currPath ? [...currPath] : []
    newPath.push(nextPoint.id)
    getPossiblePaths(points, nextPoint.id, steps - 1, result, backwards, newPath)
  })
}