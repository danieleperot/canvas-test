<template>
  <div class="main-page">
    <dashboard>
      <div
        class="canvas-wrapper relative h-full"
        :class="{ 'is-loading': loadingMap }"
      >
        <canvas
          id="main"
          ref="canvas"
          class="game-map mx-auto"
          :width="canvasWidth"
          :height="canvasHeight"
        />
        <div v-if="loadingMap" class="loader">Sto caricando la mappa...</div>
      </div>
      <template #controls>
        <controls-section title="Controlli principali">
          <div class="btn-wrapper w-full flex items-center justify-center mb-2">
            <button
              class="mx-4 px-4 py-2 rounded-lg border-2 bg-blue-300"
              @click="updateMap()"
            >
              Aggiorna mappa
            </button>
          </div>
          <div class="btn-wrapper w-full flex items-center justify-center">
            <button
              class="mx-4 px-4 py-2 rounded-lg border-2"
              :class="{
                'bg-green-300': !isIsometric,
                'bg-grey-300': isIsometric
              }"
              @click="changeToIso()"
            >
              Passa a isometrica
            </button>
          </div>
        </controls-section>
        <controls-section title="Movimenti della mappa">
          <div class="btn-wrapper w-full flex items-center justify-center">
            <button
              class="mx-4 px-4 py-2 rounded-lg border-2 bg-yellow-300"
              @click="zoom(1 / scale)"
            >
              Zoom -
            </button>
            <button
              class="mx-4 px-4 py-2 rounded-lg border-2 bg-yellow-300"
              @click="zoom(scale)"
            >
              Zoom +
            </button>
          </div>
        </controls-section>
      </template>
    </dashboard>
  </div>
</template>

<script>
import Game from '@/game/Game'
import map from '@/game/map'

export default {
  data() {
    return {
      mapWidth: 8,
      tilesSize: 32,
      canvasHeight: 8 * 32,
      game: null,
      loadingMap: true,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1.1
    }
  },

  computed: {
    canvasWidth() {
      return /* this.mapWidth */ 8 * this.tilesSize
    },
    canvasRotateStyle() {
      return `
      transform: rotateX(${this.rotateX}deg) rotateY(${
        this.rotateY
      }deg) rotateZ(${this.rotateZ}deg) ${
        /* this.isIsometric ? `translateY(-25%) translateX(-25%)` : '' */ ''
      };
      `
    },
    isIsometric() {
      return this.rotateZ === 45
    }
  },

  watch: {
    scale() {
      if (!this.loadingMap) this.game.zoom(this.scale)
    }
  },

  async mounted() {
    this.game = new Game(this.$refs.canvas, '/tileset-1.png', map, {
      mapWidth: this.mapWidth,
      tilesSize: 32,
      tilesDrawSize: this.tilesSize
    })

    await this.game.init()
    this.loadingMap = false

    // this.canvasHeight = this.game.bestCanvasDimensions().height

    this.game.drawMap()
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
      this.game.resetAll()
    },

    zoom(zoom) {
      this.game.zoom(zoom)
    }
  }
}
</script>

<style lang="scss">
.loader {
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
</style>
