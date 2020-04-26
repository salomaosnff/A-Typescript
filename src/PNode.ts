export class PNode {
  constructor(
    public x = 0,
    public y = 0,
    public walkable = true,
    public g = 0,
    public h = 0,
    public weight = 1,
    public parent?: PNode,
    public closed = false,
    public visited = false
  ) {}

  get f() {
    return this.g + this.h
  }

  getCost(node: PNode) {
    // Diagonal
    if (Math.abs(this.x - node.x) === Math.abs(this.y - node.y)) {
      return Math.SQRT2 * this.weight
    }

    return this.weight
  }
}
