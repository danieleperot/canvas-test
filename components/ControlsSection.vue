<template>
  <div class="mb-4">
    <div class="font-bold mb-2 pb-1 border-b" v-text="title" />
    <div class="controls-wrapper ">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
