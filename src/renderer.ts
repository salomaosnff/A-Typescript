import { PathFinder } from './Pathfind'
import { PNode } from './PNode'

//colorChannelA and colorChannelB are ints ranging from 0 to 255
function colorChannelMixer(colorChannelA, colorChannelB, amountToMix) {
  var channelA = colorChannelA * amountToMix
  var channelB = colorChannelB * (1 - amountToMix)
  return parseInt(channelA + channelB)
}
//rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
//example (red): rgbA = [255,0,0]
function colorMixer(rgbA, rgbB, amountToMix) {
  var r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix)
  var g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix)
  var b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix)
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}

export class Renderer {
  private ctx: CanvasRenderingContext2D

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  }

  render(finder: PathFinder) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const vp = Math.min(this.canvas.width, this.canvas.height)
    const dMax = Math.max(finder.grid.width, finder.grid.height)
    const size = vp / dMax
    const center = size / 2
    const maxF = PathFinder.Heuristic.Euclidean(
      finder.endNode,
      finder.startNode
    )

    this.ctx.font = '12px monospace'

    finder.grid.forEach((node, x, y) => {
      x *= size
      y *= size

      this.ctx.font = '12px monospace'

      if (node === finder.startNode) {
        this.ctx.fillStyle = '#00FFAA'
        this.ctx.fillRect(x, y, size, size)
      } else if (node === finder.endNode) {
        this.ctx.fillStyle = '#FF00AA'
        this.ctx.fillRect(x, y, size, size)
      } else if (!node.walkable) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.18)'
        this.ctx.fillRect(x, y, size, size)
      } else if (!node.f) {
        this.ctx.fillStyle = '#FFFFFF'
        this.ctx.fillRect(x, y, size, size)
      } else {
        const ratio = node.g / maxF
        const color = colorMixer([0xff, 0x00, 0xaa], [0x00, 0xaa, 0xff], ratio)
        this.ctx.fillStyle = color
        this.ctx.fillRect(x, y, size, size)
      }

      // this.ctx.strokeStyle = '#FFFFF'
      // this.ctx.strokeRect(x, y, size, size)
    })

    finder.grid.forEach((node, x, y) => {
      x *= size
      y *= size

      if (node.parent) {
        this.ctx.lineWidth = Math.min(2, size / 4)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'

        this.ctx.beginPath()
        this.ctx.moveTo(x + center, y + center)
        this.ctx.lineTo(
          node.parent.x * size + center,
          node.parent.y * size + center
        )
        this.ctx.closePath()
        this.ctx.stroke()

        this.ctx.arc(x + center, y + center, 4, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.lineWidth = 1
      }

      this.ctx.fillStyle = '#000000'

      // this.ctx.textAlign = 'left'
      // this.ctx.fillText(Math.floor(node.g).toString(), x + p, y + size - p)

      // this.ctx.textAlign = 'end'
      // this.ctx.fillText(
      //   Math.floor(node.h).toString(),
      //   x + size - p,
      //   y + size - p
      // )

      // this.ctx.textAlign = 'start'
      // this.ctx.fillText(Math.floor(node.f).toString(), x + p, y + 12 + p)
    })

    let node: PNode | undefined = finder.currentNode
    let count = 0
    while (node) {
      if (node.parent) {
        count++
        let { x, y } = node
        x *= size
        y *= size
        this.ctx.lineCap = 'round'
        this.ctx.lineWidth = size / 8
        this.ctx.fillStyle = '#FFF'
        this.ctx.strokeStyle = '#FFF'

        this.ctx.beginPath()
        this.ctx.moveTo(x + center, y + center)
        this.ctx.lineTo(
          node.parent.x * size + center,
          node.parent.y * size + center
        )
        this.ctx.closePath()
        this.ctx.stroke()

        this.ctx.arc(
          x + center,
          y + center,
          Math.min(size / 4, 6),
          0,
          Math.PI * 2
        )
        this.ctx.fill()

        this.ctx.lineWidth = 1
      }

      node = node.parent
    }

    this.ctx.fillStyle = 'white'
    this.ctx.font = '32px monospace'
    this.ctx.textAlign = 'end'
    this.ctx.fillText(String(count), this.canvas.width - 64, 64)
  }
}
