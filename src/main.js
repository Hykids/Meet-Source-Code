import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@/commoncss/common.css";
createApp(App).use(store).use(router).use(ElementPlus).mount("#app");

router.beforeEach((to, from, next) => {

    // store.state.userId = sessionStorage.getItem('userId');//获取本地存储的token

    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        const token = store.state.token ? store.state.token : localStorage.getItem("token")
        const userId = store.state.userId ? store.state.userId : localStorage.getItem("userId")
        if (store.state.userId !== '') {  // 通过vuex state获取当前的token是否存
            next();
        }
        else {

            next({
                path: '/login',
                query: { redirect: to.fullPath }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
})
