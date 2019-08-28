class Rectangle {
  constructor(board, x, y, width, height, color = 'red') {
    this.board = board
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color

    this.draw()
  }

  draw(color = '') {
    if (color) this.color = color
    this.clear()
    this.board.beginPath()
    this.board.rect(this.x, this.y, this.width, this.height)
    this.board.fillStyle = this.color
    this.board.fill()
    this.board.closePath()

    if (this.markX) {
      this.board.beginPath()
      this.board.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.width > this.height ? (this.height - 2) / 3 : (this.width - 2) / 3,
        0,
        2 * Math.PI
      )
      this.board.fillStyle = 'white'
      this.board.fill()
      this.board.closePath()
    }
  }

  isPointInside(x, y) {
    /* console.log(`Posizione del mouse: X ${x}, Y ${y}`)
    console.log(`Estremi X: ${this.x} ${this.x + this.width}`)
    console.log(`Estremi Y: ${this.y} ${this.y + this.height}`) */
    if (x > this.x && x < this.width + this.x) {
      if (y > this.y && y < this.height + this.y) {
      }
      return true
    }
    return false
  }

  moveTo(newX, newY, color = '') {
    this.clear()
    this.x = newX
    this.y = newY

    this.draw(color)
  }

  clear() {
    this.board.clearRect(this.x, this.y, this.width, this.height)
  }

  coordinates() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
  }

  mark(shouldMark = true) {
    this.markX = shouldMark
  }

  onClick(canvas, cb, event = 'click') {
    canvas.addEventListener(event, (e) => {
      if (this.isPointInside(e.x, e.y)) return cb(e)
    })
  }

  moveLeft(step = 10, color = '') {
    this.moveTo(this.x - step, this.y, (color = ''))
  }

  moveRight(step = 10, color = '') {
    this.moveTo(this.x + step, this.y, (color = ''))
  }

  moveUp(step = 10, color = '') {
    this.moveTo(this.x, this.y - step, (color = ''))
  }

  moveDown(step = 10, color = '') {
    this.moveTo(this.x, this.y + step, (color = ''))
  }
}

function initBoard(canvas) {
  return canvas.getContext('2d')
}

const moveRectangle = {
  right: (rect) => rect.moveRight(),
  down: (rect) => rect.moveDown(),
  left: (rect) => rect.moveLeft(),
  up: (rect) => rect.moveUp()
}

const canMove = (position, rectangle) => {
  const positions = {
    up: (x, y) => {
      return y - 10 >= 0
    },
    down: (x, y) => {
      return y + rectangle.height + 10 <= canvas.height
    },
    left: (x, y) => {
      return x - 10 >= 0
    },
    right: (x, y) => {
      return x + rectangle.width + 10 <= canvas.width
    }
  }

  return positions[position](
    rectangle.coordinates().x,
    rectangle.coordinates().y
  )
}

const checkValidPosition = (preferred, rectangle) => {
  if (canMove(preferred, rectangle)) {
    return preferred
  }
  const current = Object.keys(moveRectangle).indexOf(preferred)
  const next =
    current === 3
      ? Object.keys(moveRectangle)[0]
      : Object.keys(moveRectangle)[current + 1]
  return checkValidPosition(next, rectangle)
}

const canvas = document.getElementById('my-canvas')
const board = initBoard(canvas)

const SIZE = 40

const rectangles = [
  new Rectangle(board, 0, 0, SIZE, SIZE),
  new Rectangle(board, 0, 0, SIZE, SIZE, 'green'),
  new Rectangle(board, 0, 0, SIZE, SIZE, 'yellow'),
  new Rectangle(board, 0, 0, SIZE, SIZE, 'blue'),
  new Rectangle(board, 0, 0, SIZE, SIZE, 'orange'),
  new Rectangle(board, 0, 0, SIZE, SIZE, 'purple'),
  new Rectangle(board, 0, 0, SIZE, SIZE, 'black')
]

let index = 0
rectangles[0].mark()
rectangles[0].draw()

window.addEventListener('keydown', function(e) {
  if (e.keyCode && e.keyCode == 37) {
    if (canMove('left', rectangles[index]))
      moveRectangle.left(rectangles[index])
  }
  if (e.keyCode && e.keyCode == 39) {
    if (canMove('right', rectangles[index]))
      moveRectangle.right(rectangles[index])
  }
  if (e.keyCode && e.keyCode == 38) {
    if (canMove('up', rectangles[index])) moveRectangle.up(rectangles[index])
  }
  if (e.keyCode && e.keyCode == 40) {
    if (canMove('down', rectangles[index]))
      moveRectangle.down(rectangles[index])
  }
})

window.addEventListener('keyup', function(e) {
  if (e.keyCode === 32) {
    index++
    if (index >= rectangles.length) index = 0
    rectangles[index].mark()
  }
})

setInterval(() => {
  rectangles.map((rect, rectIndex) => {
    if (rectIndex === index) return
    rect.draw()
    rect.mark(false)
  })
  rectangles[index].draw()
}, 100)
