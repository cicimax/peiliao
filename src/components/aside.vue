<script setup>
import treeMenu from './treeMenu.vue'
import {useRouter} from "vue-router";
import {computed, reactive, watch} from "vue";

const router = useRouter();
const menuData=reactive(router.options.routes[0].children);
import {useMenuStore} from '@/store/menu.js'
const store=useMenuStore()
const iscollapse=computed(()=>store.isCollapse)
</script>

<template>

  <el-menu
      :style="{width:'230 px'}"
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="aside-container"
      default-active="2"
      text-color="#fff"
      :collapse="iscollapse"
      @open=""
      @close=""
  >
    <p class="logo-lg" >{{!iscollapse?'DIDI陪诊':'DIDI'}}</p>
      <tree-menu :menu-data="menuData" :index="`1`"/>
  </el-menu>
</template>

<style scoped lang="less">
.aside-container {
  height: 100%;
  .logo-lg {
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}
</style>