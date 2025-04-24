<script setup>
import {nextTick, onMounted, reactive, ref} from "vue";
import {Check, Clock, InfoFilled, Plus} from "@element-plus/icons-vue";
import {PhotoList, companion, companionList,deleteCompanion} from "@/apis/index.js";
import {ElMessage} from "element-plus";
import PanelHead from "@/components/panelHead.vue";

const dialogFormVisible = ref(false)
const dialogImageFormVisible = ref(false)
const beforeClose = () => {
  dialogFormVisible.value = false
  formRef.value.resetFields()
  console.log(formRef)
}
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
})
const tableData = reactive({
  list: [],
  total: 0
})
const getListData = () => {
  companionList(paginationData).then(({data}) => {
    const {list, total} = data.data
    tableData.list = list
    tableData.total = total
  })
}
const handleSizeChange = (val) => {
  paginationData.pageNum = val
  getListData()
}
const handleCurrentChange = (val) => {
  paginationData.pageNum = val
  getListData()
}
const beforeImageClose = () => {
  dialogImageFormVisible.value = false
}
const form = reactive({
  id: '',
  mobile: '',
  active: 1,
  age: 28,
  avatar: '',
  name: '',
  sex: ''
})
const rules = reactive({
  name: [{required: true, trigger: 'blur', message: '请填写昵称'}],
  avatar: [{required: true, message: '请选择头像'}],
  sex: [{required: true, trigger: 'change', message: '请选择性别'}],
  mobile: [{required: true, trigger: 'blur', message: '请填写手机号'}],
})
//弹窗提交
const confirm = async (FormEl) => {
  if (!FormEl) return
  await FormEl.validate((valid, fidlds) => {
    if (valid) {
      companion(form).then(({data}) => {
        if (data.code === 10000) {
          ElMessage.success('创建成功')
          beforeClose()
          getListData()
        } else {
          ElMessage.warning(data.message)
        }
      })
    } else {
    
    }
  })
}
const open = (rowData = {}) => {
  dialogFormVisible.value = true
  nextTick(() => {
    if (rowData) {
      Object.assign(form, rowData)
    }
  })
}
const formRef = ref()
const fileList = ref([])
onMounted(() => {
  PhotoList().then(({data}) => {
    fileList.value = data.data
  })
  getListData()
})
const selectIndex = ref(0)
const confirmImage = () => {
  form.avatar = fileList.value[selectIndex.value].url
  beforeImageClose()
}
const selectTableData=ref([])
const handleSelectionChange = (val) => {
  
  selectTableData.value=val
 
}
const confirmEvent = () => {
    if(!selectTableData.value.length){
    return ElMessage.warning('请选择至少一个');
  }else {
    deleteCompanion({id:selectTableData.value}).then(({data}) => {
      if(data.code === 10000){
        getListData()
        ElMessage.success('删除成功');
      }else {
      
      }
    })
  }
}
import {useRoute} from 'vue-router'
const route=useRoute();
</script>

<template>
  <panel-head :route="route"/>
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
    <el-popconfirm
        confirm-button-text="Yes"
        cancel-button-text="No"
        :icon="InfoFilled"
        icon-color="#626AEF"
        title="Sure?"
        @confirm="confirmEvent"
    >
      <template #reference>
        <el-button type="danger" size="small" icon="Delete">删除</el-button>
      </template>
     
    </el-popconfirm>
  </div>
  <el-table :data="tableData.list" style="width: 100% " @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    
    <el-table-column prop="id" label="id"/>
    <el-table-column prop="name" label="名称"/>
    <el-table-column label="头像">
      <template #default="scope">
        <el-image style="width: 50px;height: 50px" :src="scope.row.avatar"></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <template #default="scope">
        {{ scope.row.sex === '1' ? '男' : '女' }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号"/>
    
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.active?'success':'danger'">
          {{ scope.row.active ? '正常' : '失效' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="active" label="创建时间">
      <template #default="scope">
        <div style="display: flex ;align-items: center">
          <el-icon>
            <clock/>
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
  <el-dialog
      v-model="dialogFormVisible"
      :before-close="beforeClose"
      title="陪护师添加"
      width="500"
  >
    <el-form
        ref="formRef"
        label-width="100px"
        label-position="left"
        :model="form"
        :rules="rules">
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button v-if="!form.avatar" type="primary" @click="dialogImageFormVisible=true">点击上传</el-button>
        <el-image v-else :src="form.avatar" style="width: 100px ;height: 100px"></el-image>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1">
          </el-option>
          <el-option label="女" value="2">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="18" :max="50"/>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="1">失效</el-radio>
          <el-radio :value="2">生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      v-model="dialogImageFormVisible"
      :before-close="beforeImageClose"
      title="添加头像"
      width="680"
  >
    <div class="image-list">
      <div v-for="(item,index) in fileList " :key="item.name" class="img-box" @click="selectIndex=index">
        <div v-if="selectIndex===index" class="select">
          <el-icon color="#fff">
            <check/>
          </el-icon>
        </div>
        <el-image style="height: 148px; width: 148px" :src="item.url"></el-image>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogImageFormVisible.value=false">取消</el-button>
        <el-button type="primary" @click="confirmImage">确认</el-button>
      </div>
    </template>
  </el-dialog>
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
</template>

<style scoped lang="less">
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}

.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  
  .img-box {
    position: relative;
    
    .select {
      position: absolute;
      left: 0;
      top: 0;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>