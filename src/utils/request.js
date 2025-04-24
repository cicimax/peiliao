import axios from "axios";
import {ElMessage} from 'element-plus'
export const request = axios.create(
    {
        baseURL:'https://v3pz.itndedu.com/v3pz',
        timeout:5000,
    }
);
request.interceptors.request.use((config)=>{
    let token = localStorage.getItem('pz_token');
    //不需要添加token
    const whiteurl=['/get/code','/user/authentication','/login']
    if(token&&!whiteurl.includes(config.url)){
        config.headers['X-token']=token;
    }
    return config
},(error)=>{
    console.log('发送失败')
    return Promise.reject(error);
})
request.interceptors.response.use((response)=>{
    if(response.data.code===-1){
        ElMessage.warning(response.data.message)
    }
    if(response.data.code===-2){
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        window.location.href=window.location.origin
    }
    return response;
},(error)=>{
    return Promise.reject(error);
})