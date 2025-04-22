<script setup>
import {Close, Fold} from "@element-plus/icons-vue";
import {useMenuStore} from '@/store/menu.js'
import {computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import index from "@/views/vppz/staff/index.vue";
const route = useRoute();
const router = useRouter();
const store=useMenuStore()
const selectMenu= computed(()=>store.selectMenu)
const close=(item,index)=>{
  store.removeMenu(item)
  console.log(index)
  const selectedMenuData=selectMenu.value
  if (route.path === item.path) {
    const len = selectedMenuData.length;
    // 如果只剩一个或没有菜单，返回首页
    router.push('/');
  }
}
</script>

<template>
  <div class="header-container">
    <div class="header-left flex-box" >
      <el-icon class="icon" size="20"  @click="store.ChangeIsCollapse">
        <Fold/>
      </el-icon>
      <ul class="flex-box">
        <li v-for="item in selectMenu" :key="item.path" class="tab flex-box" :class="{selected:route.path===item.path}">
          <el-icon class="icon" size="12" >
            <component :is="item.icon"></component>
            </el-icon>
            <router-link :to="item.path" class="text flex-box">
            {{item.name}}
              </router-link>
            <el-icon class="icon close" size="12" @click="close(item,index)">
              <Close/>
            </el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown>
    <span class="el-dropdown-link flex-box">
     <el-avatar
         src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
     />
     <p class="user-name">Admin</p>
    </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="less">
.flex-box{
  display: flex;
  align-items: center;
  height: 100%;
}
.header-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: white;
  padding-right: 25px;
  .header-left{
    display: flex;
    align-items: center;
    height: 100%;
    .icon{
      width: 45px;
      height: 100%;

    }
    .icon:hover{
      background-color: #f5f5f5f5;
      cursor: pointer;
    }
    .tab{
      padding: 0 10px;
      height: 100%;
      .text{
        margin: 0 5px;
        font-size: 10px;
      }
      .close{
        visibility: hidden;
      }
      &.selected{
        a {
          color: #409eff;
        }
        i {
          color: #409eff;
        }
        background-color: #f5f5f5;
      }
    }
    .tab:hover{
      background-color: #f5f5f5;
      .close{
        visibility: inherit;
        cursor: pointer;
        color: #000;
      }
    }
  }
  .header-right{
    .user-name{
      margin-left: 25px;
    }
  }
}
a{
  height: 100%;
  color:#333;
  font-size: 15px;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>