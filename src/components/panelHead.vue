<script setup>
const prop=defineProps({
  route:{
    type: Object,
  }
})
</script>

<template>
<div class="panel-heading">
  <div class="panel-lead">
    <div class="title">
     {{prop.route.meta.name}}
    </div>
    <p class="description">
      {{prop.route.meta.describe}}
    </p>
  </div>
</div>
</template>

<style scoped lang="less">
.panel-heading {
  padding: 15px;
  background: #e8edf0;
  border-color: #e8edf0;
  position: relative;
  .panel-lead {
    font-size: 14px;
    .title {
      font-weight: bold;
      font-style: normal;
    }
    .description {
      margin-top: 5px;
    }
  }
}
</style>