<template>
  <div class="container">
    <canvas
      id="main"
      ref="canvas"
      :width="canvasDimentions"
      :height="canvasDimentions"
    />
  </div>
</template>

<script>
import Game from '@/game/Game'
import map from '@/game/map'

export default {
  data() {
    return {
      mapWidth: 16,
      tilesSize: 32
    }
  },

  computed: {
    canvasDimentions() {
      return this.mapWidth * this.tilesSize
    }
  },

  async mounted() {
    const game = new Game(this.$refs.canvas, '/tileset-1.png', map, {
      mapWidth: this.mapWidth,
      tilesSize: 32,
      tilesDrawSize: this.tilesSize
    })

    await game.init()

    game.drawTiles()
  }
}
</script>
