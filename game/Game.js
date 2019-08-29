export default class Game {
  constructor(canvas, tilesImage, map, options = {}) {
    this.canvas = canvas.getContext('2d')
    this.tilesImage = tilesImage
    this.map = map
    this.mapWidth = options.mapWidth || 16
    this.tilesSize = options.tilesSize || 64
    this.tilesDrawSize = options.tilesDrawSize || 64
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

      xPos++
    }
  }

  drawTiles() {
    let xPos = 0
    let yPos = 0

    console.log(this.tiles)

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
