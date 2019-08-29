export default class Game {
  constructor(canvas, tilesImage, map, options = {}) {
    this.canvas = canvas.getContext('2d')
    this.tilesImage = tilesImage
    this.map = map
    this.mapWidth = options.mapWidth || 16
    this.tilesSize = options.tilesSize || 64
    this.tilesDrawSize = options.tilesDrawSize || 64
    this.scale = 1
    canvas.addEventListener('click', (event) => this.clickHandler(event))
  }

  async loadTiles() {
    this.tiles = []
    const tilesSource = await this._loadImage(this.tilesImage)
    let yPos = 0
    let xPos = 0

    for (
      let i = 0;
      i < this._calculateTilesInSource(tilesSource, this.tilesSize);
      i++
    ) {
      if (xPos * this.tilesSize >= tilesSource.width) {
        yPos++
        xPos = 0
      }

      const tile = await this._extractTile(
        tilesSource,
        xPos * this.tilesSize,
        yPos * this.tilesSize,
        this.tilesSize,
        this.tilesSize
      )

      this.tiles.push(tile)
      xPos++
    }
  }

  drawMap() {
    let xPos = 0
    let yPos = 0

    for (let i = 0; i < this.map.length; i++) {
      if (xPos >= this.mapWidth) {
        yPos++
        xPos = 0
      }

      this.canvas.drawImage(
        this.tiles[this.map[i]],
        xPos * this.tilesDrawSize,
        yPos * this.tilesDrawSize
      )

      this.canvas.strokeStyle = 'black'
      this.canvas.strokeRect(
        xPos * this.tilesDrawSize,
        yPos * this.tilesDrawSize,
        this.tilesDrawSize,
        this.tilesDrawSize
      )

      xPos++
    }
  }

  drawTiles() {
    let xPos = 0
    let yPos = 0

    for (let i = 0; i < this.tiles.length; i++) {
      if (xPos >= this.mapWidth) {
        yPos++
        xPos = 0
      }

      this.canvas.drawImage(
        this.tiles[i],
        xPos * this.tilesDrawSize,
        yPos * this.tilesDrawSize
      )

      xPos++
    }
  }

  bestCanvasDimensions() {
    const rows =
      this.map.length % this.mapWidth
        ? (this.map.length / this.mapWidth).toFixed(0) + 1
        : this.map.length / this.mapWidth

    return {
      width: this.mapWidth * this.tilesDrawSize,
      height: rows * this.tilesDrawSize
    }
  }

  zoom(scale) {
    this.clear()
    this.canvas.scale(scale, scale)
    this.drawMap()
  }

  clear() {
    this.canvas.clearRect(
      0,
      0,
      this.canvas.canvas.width,
      this.canvas.canvas.height
    )
  }

  resetZoom() {
    this.canvas.setTransform(1, 0, 0, 1, 0, 0)
    this.drawMap()
  }

  resetAll() {
    this.clear()
    this.canvas.setTransform(1, 0, 0, 1, 0, 0)
    this.drawMap()
  }

  isometric() {
    this.isIsometric = true
    this.canvas.setTransform(1, 0, 0, 1, 0, 0)
    this.clear()
    this.canvas.translate(4 * 32, 1)
    this.canvas.scale(1, 0.45)
    this.canvas.rotate(Math.PI / 4)
    this.drawMap()
  }

  clickHandler(event) {
    this.drawMap()
    const rectangle = event.target.getBoundingClientRect()
    const xPos = Math.floor(
      (event.clientX - rectangle.left) / this.tilesDrawSize
    )
    const yPos = Math.floor(
      (event.clientY - rectangle.top) / this.tilesDrawSize
    )

    this.canvas.strokeStyle = 'red'
    this.canvas.strokeRect(
      xPos * this.tilesDrawSize,
      yPos * this.tilesDrawSize,
      this.tilesDrawSize,
      this.tilesDrawSize
    )
  }

  _loadImage(path) {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = path
      img.onload = () => {
        return resolve(img)
      }
    })
  }

  _calculateTilesInSource({ width, height }, squareSize) {
    return (width / squareSize) * (height / squareSize)
  }

  async _extractTile(source, x, y, width, height) {
    const extractCanvas = document.createElement('canvas')
    const extractCtx = extractCanvas.getContext('2d')

    extractCtx.drawImage(source, x, y, width, height, 0, 0, width, height)

    const subImage = await this._loadImage(extractCanvas.toDataURL())

    extractCanvas.remove()

    return subImage
  }

  async init() {
    await this.loadTiles()
    // this.drawMap()
  }
}
