
<script setup>
import {useRouter} from "vue-router";
import {useMenuStore} from '@/store/menu.js'
const store=useMenuStore()
const router = useRouter();
const props = defineProps({
  menuData: {
    type: Array,
    default: null
  },
  index:{
    type:String,
    default:null
  }
})
const handleClick = (item, index) => {
    router?.push(item?.meta.path)
    store?.addMenu(item?.meta)

}


</script>

<template>

  <template v-for="(item,index) in props.menuData">
    <el-menu-item index="4" v-if="!item.children ||item.children.length === 0"
                  :index="`${props.index}-${item.meta.id}`"
                  :key="index"
                  @click="handleClick(item,`${props.index}-${item.meta.id}`)"
    >
      <el-icon>
        <component :is="item.meta.icon"/>
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>
    <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`"
                 @click="handleClick(item,`${props.index}-${item.meta.id}`)">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"/>
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <tree-menu :menuData="item.children" :index="`${props.index}-${item.meta.id}`"/>
    </el-sub-menu>
  </template>

</template>

<style scoped lang="less">

</style>