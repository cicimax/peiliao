import {defineStore} from "pinia";
import {ref, computed} from "vue";
export const useMenuStore = defineStore("menuStore", ()=>{
        const isCollapse=ref(false)
        const selectMenu=ref([])
        const ChangeIsCollapse=()=>{
            isCollapse.value=!isCollapse.value
            console.log(isCollapse.value)
        }
        const addMenu=(payload)=>{
            if(selectMenu.value.findIndex(item=>item.path===payload.path)===-1){
                selectMenu.value.push(payload)
            }
        }
const removeMenu=(payload)=>{
            const index=selectMenu.value.findIndex(item=>item.path===payload.path)
                selectMenu.value.splice(index,1)
}

    return{
            isCollapse,
            selectMenu,
        ChangeIsCollapse,
        addMenu,
        removeMenu
    }
})