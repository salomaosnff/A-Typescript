import { Grid } from './Grid'
import { PathFinder } from './Pathfind'
import { Renderer } from './renderer'
import { Matrix } from './Matrix'

const $canvas = document.getElementById('view') as HTMLCanvasElement

$canvas.width = document.documentElement.clientWidth
$canvas.height = document.documentElement.clientHeight

const grid = new Grid(new Matrix(100, 100), () => Math.random() > 0.25)

const finder = new PathFinder(grid)

function randomPos() {
  let x: number, y: number

  do {
    x = Math.floor(Math.random() * grid.width)
    y = Math.floor(Math.random() * grid.height)
  } while (!grid.get(x, y).walkable)

  return { x, y }
}

finder.search(randomPos(), randomPos())

const renderer = new Renderer($canvas)

function loop() {
  renderer.render(finder)
  window.requestAnimationFrame(loop)
}

loop()
