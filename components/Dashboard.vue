<template>
  <div :class="dashboardClass">
    <div class="dashboard__main dashboard-main">
      <slot />
    </div>
    <div
      class="dashboard__controls dashboard-controls border-l-2 border-gray-400 bg-gray-100"
    >
      <div class="dashboard-controls__inner p-4">
        <slot name="controls" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    controlsPosition: {
      type: String,
      default: 'right',
      required: false
    }
  },

  computed: {
    dashboardClass() {
      return `dashboard dashboard--controls-${this.controlsPosition}`
    }
  }
}
</script>

<style lang="scss">
.dashboard {
  display: grid;

  &--controls-left {
    grid-template-areas: 'controls main';
    grid-template-columns: minmax(150px, 25%) 1fr;
    grid-template-rows: calc(100vh - 60px);
  }

  &--controls-right {
    grid-template-areas: 'main controls';
    grid-template-columns: 1fr minmax(150px, 25%);
    grid-template-rows: calc(100vh - 60px);
  }

  &__controls {
    grid-area: controls;
  }

  &__main {
    grid-area: main;
  }
}
</style>
