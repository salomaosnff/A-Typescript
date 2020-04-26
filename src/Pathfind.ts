import { Grid } from './Grid'
import { PNode } from './PNode'
import { Matrix } from './Matrix'

interface IPoint {
  x: number
  y: number
}

type Heuristic = (a: IPoint, b: IPoint) => number

export class PathFinder {
  public startNode!: PNode
  public endNode!: PNode
  public currentNode!: PNode
  public heuristic: Heuristic = PathFinder.Heuristic.Manhattan
  public diagonalEnabled = false

  static Heuristic: Record<string, Heuristic> = {
    Manhattan: (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y),
    Euclidean: (a, b) =>
      Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
  }

  delay(time = 10) {
    return new Promise(resolve => setTimeout(resolve, time))
  }

  constructor(public grid: Grid) {}

  async search(start: IPoint, end: IPoint) {
    let currentNode: PNode | undefined
    const gridNeighborsDirections = this.diagonalEnabled
      ? Matrix.NEIGHBORS_ALL
      : Matrix.NEIGHBORS_ADJACENT

    this.startNode = this.grid.get(start.x, start.y)
    this.endNode = this.grid.get(end.x, end.y)

    const opened: PNode[] = [this.startNode]

    this.startNode.h =
      this.heuristic(this.startNode, this.endNode) *
      this.startNode.getCost(this.endNode)
    /* eslint-disable */
    while ((currentNode = opened.shift())) {
      if (currentNode.closed) continue

      this.currentNode = currentNode
      const neighbors = this.grid.neighborsOf(
        currentNode.x,
        currentNode.y,
        gridNeighborsDirections
      )

      for (const neigh of neighbors) {
        if (!neigh || neigh.closed || !neigh.walkable) continue

        const gscore = currentNode.g * neigh.getCost(currentNode)
        const beenVisited = neigh.visited

        if (!beenVisited || gscore < neigh.g) {
          neigh.visited = true
          neigh.parent = currentNode
          neigh.h =
            neigh.h ||
            this.heuristic(neigh, this.endNode) * neigh.getCost(neigh)
          neigh.g = gscore

          if (!beenVisited) {
            opened.push(neigh)
          }
        }
      }

      currentNode.closed = true

      if (currentNode === this.endNode) {
        console.log('Finished', currentNode)
        return this.endNode
      }
      opened.sort((a, b) => a.f - b.f)
      await this.delay(50)
    }

    alert('Erro!')
  }
}
