<script setup>
import {ref, reactive, onUnmounted, onMounted, computed, toRaw} from "vue";
import {Lock, UserFilled} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {getCode, userAuthentication, Login,menuPermissions} from '@/apis/index.js'
import {useRouter} from "vue-router";
const router=useRouter()
// 表单类型切换
const formType = ref(0);
const toggleFormType = () => {
  formType.value = formType.value ? 0 : 1;
  resetForm();
};
import {useMenuStore} from "@/store/menu.js";
const menuStore = useMenuStore();
// 表单数据
const loginForm = reactive({
  userName: "",
  passWord: "",
  validCode: ""
});
// 验证码倒计时
const countdown = reactive({
  validText: "获取验证码",
  time: 60,
  timer: null
});

const routeList= computed(()=>menuStore.routerList)

const formRef = ref();
// 清除定时器
onUnmounted(() => {
  if (countdown.timer) {
    clearInterval(countdown.timer);
  }
});

// 获取验证码
const getValidationCode = () => {
  const chinaMobileRegex = /^1[3-9]\d{9}$/;
  
  if (!loginForm.userName || !chinaMobileRegex.test(loginForm.userName)) {
    return ElMessage({
      message: "请输入正确的手机号",
      type: "warning"
    });
  }
  
  if (countdown.timer) return;
  
  countdown.timer = setInterval(() => {
    if (countdown.time > 0) {
      countdown.time--;
      countdown.validText = `剩余${countdown.time}s`;
    } else {
      clearInterval(countdown.timer);
      countdown.timer = null;
      countdown.validText = "获取验证码";
      countdown.time = 60;
    }
  }, 1000);
  
  getCode({tel: loginForm.userName}).then((data) => {
    if (data.code === 1000) {
      ElMessage.success("验证码已发送")
    }
  }).catch(err => {
    console.log(err);
    ElMessage.error("验证码发送失败");
    clearInterval(countdown.timer);
    countdown.timer = null;
    countdown.validText = "获取验证码";
    countdown.time = 60;
  });
};


// 重置表单
const resetForm = () => {
  loginForm.userName = "";
  loginForm.passWord = "";
  loginForm.validCode = "";
};

// 验证规则
const validateUser = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入手机号"));
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error("手机号格式错误"));
  } else {
    callback();
  }
};

const validatePass = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入密码"));
  } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(value)) {
    callback(new Error("密码需6-20位字母+数字组合"));
  } else {
    callback();
  }
};

const rules = reactive({
  userName: [{validator: validateUser, trigger: "blur"}],
  passWord: [{validator: validatePass, trigger: "blur"}],
  validCode: [{required: true, message: "请输入验证码", trigger: "blur"}]
});
// 表单提交
const submitForm = async (FormEl) => {
 
  if (!FormEl) return
  console.log(FormEl)
  await FormEl.validate((valid) => {
    if (valid) {
      if (formType.value) {
        userAuthentication(loginForm).then(({data}) => {
          if (data.code === 10000) {
            ElMessage.success('注册成功')
            formType.value = 0;
          }
        })
      } else {
        Login(loginForm).then(({data}) => {
          if (data.code === 10000) {
            ElMessage.success('登录成功')
            localStorage.setItem('pz_token', data.data.token)
            localStorage.setItem('pz_userInfo', JSON.stringify(data.data.userInfo))
            menuPermissions().then(({data})=>{
            menuStore.dynamicMenu(data.data)
              toRaw(routeList.value).forEach(item=>{
                console.log(item.component)
                router.addRoute('main',item)
             
            })
            
            })
            router.push('/')
          }
        })
      }
    } else {
      ElMessage.warning("请检查表单输入");
    }
  });
};
</script>

<template>
  <div class="login-wrapper">
    <el-row justify="center" align="middle">
      <el-card class="login-container">
        <template #header>
          <div class="card-header">
            <img src="@/images/login-head.png" alt="登录头部图片">
          </div>
        </template>
        
        <div class="jump-link">
          <el-link type="primary" @click="toggleFormType">
            {{ formType ? "返回登录" : "注册账号" }}
          </el-link>
        </div>
        
        <el-form
            ref="formRef"
            :model="loginForm"
            :rules="rules"
            class="demo-ruleForm"
            style="max-width: 600px"
        
        >
          <el-form-item prop="userName">
            <el-input
                v-model="loginForm.userName"
                placeholder="手机号"
                :prefix-icon="UserFilled"
            />
          </el-form-item>
          
          <el-form-item prop="passWord">
            <el-input
                v-model="loginForm.passWord"
                placeholder="密码"
                type="password"
                show-passWord
                :prefix-icon="Lock"
            />
          </el-form-item>
          
          <el-form-item v-if="formType" prop="validCode">
            <el-input
                v-model="loginForm.validCode"
                placeholder="验证码"
                :prefix-icon="Lock"
            >
              <template #append>
                <el-button
                    :disabled="!!countdown.timer"
                    @click="getValidationCode"
                >
                  {{ countdown.validText }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button
                type="primary"
                style="width: 100%"
                @click="submitForm(formRef)"
            >
              {{ formType ? "注册" : "登录" }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>

<style scoped lang="less">
.login-wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-card__header) {
  padding: 0;
}

.login-container {
  height: 100%;
  
  .card-header {
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