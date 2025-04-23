import {request} from '@/utils/request.js'

export const getCode = (data) => {
    return request({url: '/get/code', method: 'post', data})
}
export const userAuthentication=(data)=>{
    return request({url: '/user/authentication', method: 'post', data})
}

export const Login=(data)=>{
    return request({url: '/login', method: 'post', data})
}
export const authAdmin=(params)=>{
    return request({url: '/auth/admin', method: 'get', params})
}
export const userGetMenu=()=>{
    return request({url: '/user/getmenu'})
}
export const userSetMenu=(data)=>{
    return request({url: '/user/setmenu', method: 'post', data})
}
export const menuList=(params)=>{
    return request({url: '/menu/list', method: 'get',params })
}