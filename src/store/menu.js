import {defineStore} from "pinia";
import {ref, computed} from "vue";

export const useMenuStore = defineStore("menuStore", () => {

    const isCollapse = ref(false)
    const selectMenu = ref([])
    const routerList=ref([])
    const menuActive=ref('1-1')
    const ChangeIsCollapse = () => {
        isCollapse.value = !isCollapse.value

    }
    const addMenu = (payload) => {
        if (selectMenu.value.findIndex(item => item.path === payload.path) === -1) {
            selectMenu.value.push(payload)
        }
    }
    const removeMenu = (payload) => {
        const index = selectMenu.value.findIndex(item => item.path === payload.path)
        selectMenu.value.splice(index, 1)
    }
    const dynamicMenu=(playload)=>{


      const modules= import.meta.glob('@/views/**/**')

        function routerSet(router){

          //判断有没有子菜单，拼接路由
            router.forEach(item=>{
                if(!item.children){
                    const url=`/src/views${item.meta.path}/index.vue`

                    item.component=modules[url]

                }else{
                    routerSet(item.children)
                }
            })
        }
        routerSet(playload)
        routerList.value=playload
    }
    return {
        isCollapse,
        selectMenu,
        ChangeIsCollapse,
        addMenu,
        removeMenu,
        dynamicMenu,
        routerList
    }
},{
    persist:{
        key:'pz_v3pz'
    }
})