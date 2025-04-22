<script setup>

import Aside from "@/components/aside.vue";
import Header from "@/components/navHeader.vue";
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <Aside/>
      </el-aside>
      <el-container>
        <el-header>
          <Header/>
        </el-header>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="less">
.common-layout{
  height: 100%;
  .el-container{
    height: 100%;
  }
}
</style>