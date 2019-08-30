<template>
  <div class="game-wrapper">
    <h2>Carica tutte le tiles disponibili</h2>
    <div class="canvas-wrapper relative" :class="{ 'is-loading': loadingMap }">
      <canvas
        id="main"
        ref="canvas"
        class="game-map mx-auto"
        :width="0"
        :height="0"
      />
      <div v-if="loadingMap" class="loader" v-text="message" />
      <div class="flex flex-wrap">
        <img v-for="(img, index) in tiles" :key="index" :src="img.src" />
      </div>
    </div>
    <div class="controls py-4 border-top-2">
      <div class="controls__buttons">
        <button
          class="control-btn py-2 px-4 rounded bg-blue-300"
          @click="updateMap"
        >
          Aggiorna mappa
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Game from '@/game/Game'

const mapWidth = 16

export default {
  data() {
    return {
      mapWidth,
      tilesSize: 32,
      canvasHeight: mapWidth * 32,
      game: null,
      loadingMap: true,
      message: '',
      tiles: []
    }
  },

  computed: {
    canvasWidth() {
      return this.mapWidth * this.tilesSize
    }
  },

  async mounted() {
    this.game = new Game(this.$refs.canvas, '/tileset-1.png', [], {
      mapWidth: this.mapWidth,
      tilesSize: 32,
      tilesDrawSize: this.tilesSize
    })

    this.message = 'Sto caricando la mappa...'
    await this.game.init()
    this.message = 'Aggiungo il tileset #2...'
    await this.game.loadManualTiles('/tileset-2.png')
    this.message = 'Aggiungo il tileset #3...'
    await this.game.loadManualTiles('/tileset-3.png')
    this.message = 'Aggiungo il tileset #4...'
    await this.game.loadManualTiles('/tileset-4.png')
    this.message = 'Aggiungo il tileset #5...'
    await this.game.loadManualTiles('/tileset-5.png')
    this.loadingMap = false
    this.tiles = this.game.tiles

    this.canvasHeight = this.game.bestTilesDimensions().height || mapWidth * 32

    this.game.drawTiles()
  },

  methods: {
    changeToIso() {
      this.rotateX = 55
      this.rotateZ = 45
      this.game.isometric()
    },

    changeTo2D() {
      this.rotateX = 0
      this.rotateZ = 0
    },

    updateMap() {
      this.game.clear()
      this.game.drawTiles()
    },

    zoom(zoom) {
      this.game.zoom(zoom)
    }
  }
}
</script>

<style>
.canvas-wrapper {
  min-height: 80vh;
}

.canvas-wrapper .loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(234, 250, 255, 0.78);
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #49aaff;
  text-shadow: 0 0 3rem rgba(0, 0, 0, 0.75);
}

.game-wrapper {
  overflow: hidden;
}

.game-wrapper canvas {
  overflow: scroll;
  object-fit: none;
  padding: 0;
  margin: 0 auto;
  position: absolute;
  left: 0;
  right: 0;
}

.controls {
  padding-top: 0.5rem;
  border-top: 2px solid black;
  background: white;
  min-height: 20vh;
  height: 100%;
}
</style>
