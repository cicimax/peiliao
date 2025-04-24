<script setup>
import {authAdmin, update, userSetMenu} from '@/apis'
import {onMounted, reactive, ref} from "vue";
import {menuSelectList} from "@/apis";
import dayjs from "dayjs";
import {Clock} from "@element-plus/icons-vue";
import PanelHead from "@/components/panelHead.vue";
import {useRoute} from 'vue-router'
const route=useRoute();
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
})
const tableData = reactive({
  list: [],
  total: 0
})
const dialogFormVisible = ref(false)
const beforeClose = () => {
  dialogFormVisible.value = false
  
}
const formRef = ref()
const options = ref()
const form = reactive({
  name: '',
  permissions_id: ''
})
const permissionName = (id) => {
  const data = options.value?.find(item => item.id === id)
  return data ? data.name : '超级管理员'
}
const open = (rowData) => {
 dialogFormVisible.value = true
  Object.assign(form,{mobile:rowData.mobile,name:rowData.name,permissions:rowData.permissions})
}
onMounted(() => {
 getListData()
  menuSelectList().then(({data}) => {
    options.value = data.data
  })
})
const handleSizeChange = () => {

}
const handleCurrentChange = () => {

}
const rules=reactive({
  name: [{required: true, trigger: "blur", message: '请填写昵称'}],
  permissions: [{required: true, trigger: "blur", message: '请选择菜单权限'}]
})
const getListData=()=>{
  authAdmin(paginationData).then(({data}) => {
    const {list, total} = data.data
    list.forEach(item => {
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
    })
    tableData.list = list
    tableData.total = total
  })
}
const confirm = async (FormEl) => {
  if (!FormEl) return
  await FormEl.validate((valid, fidlds) => {
    if (valid) {
      const {name, permissions_id} = form
      
      update({name, permissions_id}).then(({data}) => {
        if (data.code === 10000) {
          beforeClose()
          getListData()
        }
        
      })
    } else {
    
    }
  })
}
</script>

<template>
  <panel-head :route="route"/>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id"/>
    <el-table-column prop="name" label="名称"/>
    <el-table-column prop="permissions_id" label="所属组别">
      <template #default="scope">
        {{ permissionName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号"/>
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag class="ml-2" :type="scope.row.active?'success': 'danger'">
          {{ scope.row.active ? '正常' : '失效' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="" label="创建时间">
      <template #default="scope">
        <div style="display: flex ;align-items: center">
          <el-icon>
            <Clock></Clock>
          </el-icon>
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </div>
      
      </template>
    </el-table-column>
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
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" prop="permissions_id">
          <el-select
              v-model="form.permissions_id"
              placeholder="请选择菜单权限"
              STYLE="width: 240px">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
            
            </el-option>
          </el-select>
        
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirm(formRef)">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">

</style>