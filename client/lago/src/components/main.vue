<template>
  <div class="main">
    <div>Lago Project</div>
    <div class="d1">{{ disc }}</div>
    <div class="d2">{{ second }}</div>
  </div>
</template>

<script>
export default {
  name: 'Main',
  props: {
    disc: String,
    second: Number
  }
}
</script>

<style scoped>
  .main {
    margin: 40px;
  }

  .d1 {
    font-size: 20px;
  }

  .d2 {
    color: red;
  }
</style>
