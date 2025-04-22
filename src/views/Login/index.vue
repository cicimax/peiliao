<script setup>
import {ref,reactive} from "vue";
import {Lock, UserFilled} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
const formType=ref(0)
const handerChange=()=>{
    formType.value?formType.value=0:formType.value=1
}

const loginForm=reactive({
  username:'',
  password:'',
  valiCode:''
})
let flag=false
const countChange = () => {
  const chinaPhoneRegex = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/;
  if(!loginForm.username||!chinaPhoneRegex.test(loginForm.username)){
    return ElMessage({
      message:'请检测手机号',
      type:"warning"
    })
  }
  if(flag) return
  setInterval(()=>{
    if(countdown.time>=0){
      countdown.time--;
      countdown.validText=`剩余${countdown.time}`;
     
    }
    else {
      countdown.validText='获取验证码'
      countdown.time=60
      flag=false
    }
  },1000)
  flag=true
}
 const countdown= reactive({
  validText:'获取验证码',
  time:60
})

const rules=reactive({

})
</script>

<template>
<el-row justify="center">
  <el-card class="login-container" justify="center" :align="`middle`">
    <template #header>
      <div class="card-header">
        <img src="@/images/login-head.png" alt="">
      </div>
    </template>
    <div class="jump-link">
      <el-link type="primary" @click="handerChange">{{formType?'返回登录':'注册账号'}}</el-link>
    </div>
    <el-form :mode="loginForm" style="{max-width: 600px} " class="demo-ruleForm"
    :rules=""
    >
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="手机号" :prefix-icon="UserFilled"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" placeholder="密码" :prefix-icon="Lock"></el-input>
      </el-form-item>
      <el-form-item v-if="formType" prop="valiCode">
        <el-input v-model="loginForm.valiCode" placeholder="验证码" :prefix-icon="Lock">
          <template #append>
            <span @click="countChange">{{countdown.validText}}</span>
          </template>
        </el-input>
      
      </el-form-item>
    </el-form>
  </el-card>

</el-row>
</template>

<style scoped lang="less">
:deep(.el-card__header) {
  padding: 0
}
.login-container {
  height: 100%;
  .card-header{
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>