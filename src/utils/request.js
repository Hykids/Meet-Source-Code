import axios from 'axios'
import store from '@/store';

const request = axios.create({
    baseURL: '/api',  // 注意！！ 这里是全局统一加上了 '/api' 前缀，也就是说所有接口都会加上'/api'前缀在，页面里面写接口的时候就不要加 '/api'了，否则会出现2个'/api'，类似 '/api/api/user'这样的报错，切记！！！
    timeout: 5000
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';

    // this.userInfo = list;
    // localStorage.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNjUwOTYzMDMwfQ.Fu5WFT0lTVljTaIq7w9PeZOq7bbFJjCbXDbrbTlngSE')
    config.headers.token = localStorage.getItem("token");
    if (config.headers.token == null) {
        config.headers.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NTc1LCJleHAiOjE2NTMyNzQ5NjV9.MDF--W5Cirf0R2rk3NVAgjI3KYep1TjRkKZ7gWrTH3w"
    }
    //config.headers.token = store.getters("getToken");


    // config.headers['token'] = user.token;  // 设置请求头
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // // 如果是返回的文件
        // if (response.config.responseType === 'blob') {
        //     return res
        // }
        // // 兼容服务端返回的字符串数据
        // if (typeof res === 'string') {
        //     res = res ? JSON.parse(res) : res
        // }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)
request.interceptors.request.use(function (config) {

    // 对get请求的参数全部进行URL编码
    let url = config.url

    if (config.method === 'get' && config.params) {
        url += '?'
        let keys = Object.keys(config.params)
        for (let key of keys) {
            url += `${key}=${encodeURIComponent(config.params[key])}&`
        }
        url = url.substring(0, url.length - 1)
        config.params = {}
    }
    config.url = url

    return config;
}, function (error) {
    return Promise.reject(error);
});






export default request

