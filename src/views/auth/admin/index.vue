<script setup>
import {authAdmin} from '@/apis'
import {onMounted, reactive} from "vue";
const paginationData=reactive({
  pageNum:1,
  pageSize:10,
})
onMounted(()=>{
  authAdmin(paginationData).then(({data})=>{
    console.log(data)
  })
})
</script>

<template>
1
</template>

<style scoped lang="less">

</style>