<script setup>

import {nextTick, onMounted, reactive, ref} from "vue";
import {userGetMenu, userSetMenu, menuList} from "@/apis/index.js";

const premissionData = ref([])

const dialogFormVisible = ref(false)
const beforeClose = () => {
  dialogFormVisible.value = false
  formRef.value.resetFields()
  treeRef.value.setCheckedKeys([4, 5])
}

//弹窗提交
const confirm = async (FormEl) => {
  if (!FormEl) return
  await FormEl.validate((valid, fidlds) => {
    if (valid) {
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
      console.log(permissions)
      userSetMenu({name: form.name, permissions, id: form.id}).then(({data}) => {
        beforeClose()
        getList()
      })
    } else {
    
    }
  })
}
const form = reactive({
  name: '',
  permissions: '',
  id: ''
})
const rules = reactive({
  name: [{required: true, trigger: "blur", message: '请输入权限名称'}],
})
const treeRef = ref()
const formRef = ref()

onMounted(() => {
  userGetMenu().then(({data}) => {
    premissionData.value = data.data
    console.log(premissionData.value)
  })
  getList()
})
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
})
const getList = () => {
  menuList(paginationData).then(({data}) => {
    tableData.list = data.data.list
    tableData.total = data.data.total
  })
}
const open = (rowData = {}) => {
  
  dialogFormVisible.value = true
  nextTick(() => {
    if (rowData) {
      Object.assign(form, {id: rowData.id, name: rowData.name})
      treeRef.value.setCheckedKeys(rowData.permission)
    }
  })
}
const tableData = reactive({
  list: [],
  total: 0
})
const handleSizeChange = (val) => {
  paginationData.pageNum=val
  getList()
}
const handleCurrentChange = (val) => {
    paginationData.pageNum=val
  getList()
}
import panelHead from '@/components/panelHead.vue'
import {Plus} from "@element-plus/icons-vue";
import {useRoute} from 'vue-router'
const route=useRoute()
</script>

<template>
  <panel-head :route="route"/>
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
  </div>
 
  
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id"/>
    <el-table-column prop="name" label="名称"/>
    <el-table-column prop="permissionName" label="菜单权限"/>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
  <el-pagination
  v-model="paginationData.pageNum"
  :page-size="paginationData.pageSize"
  :background="false"
  layout="total, prev, pager, next"
  :total="tableData.total"
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"
  size="small"
  />
  </div>
  <el-dialog
      v-model="dialogFormVisible"
      :before-close="beforeClose"
      title="添加权限"
      width="500"
  >
    <el-form
        ref="formRef"
        label-width="100px"
        label-position="left"
        :model="form"
        :rules="rules"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写权限名称"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
            ref="treeRef"
            :data="premissionData"
            style="max-width: 600px"
            node-key="id"
            show-checkbox
            :default-checked-keys="[4,5]"
            :default-expanded-keys="[2]"
        >
        </el-tree>
      </el-form-item>
    
    
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.btns{
  padding: 10px 0 10px 10px;
  background-color: #f5f5f5;
}
</style>