import { Matrix } from './Matrix'
import { PNode } from './PNode'

export class Grid extends Matrix<PNode> {
  constructor(
    grid: Matrix<number> | number[][] = [],
    canWalk = (x: number, y: number, grid: Matrix<number>) => grid.get(x, y) > 0
  ) {
    if (!(grid instanceof Matrix)) {
      grid = Matrix.from(grid)
    }

    super(grid.width, grid.height)

    this.fill((_, x, y) => {
      return new PNode(x, y, canWalk(x, y, grid as Matrix))
    })
  }
}
