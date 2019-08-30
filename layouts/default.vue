<template>
  <div class="engine-test">
    <div
      class="engine-test__header header shadow-md py-2 flex items-center justify-center bg-gray-200 absolute w-full top-0"
    >
      <h1 class="my-1 text-2xl">Canvas Test - 2D engine</h1>
    </div>
    <div class="engine-test__gameplay gameplay">
      <nuxt />
    </div>
  </div>
</template>

<style lang="scss">
html,
body {
  margin: 0;
  min-height: 100vh;
  padding: 0;

  * {
    box-sizing: border-box;
  }
}

.gameplay {
  padding-top: 60px;
}
</style>
