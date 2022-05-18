import { createRouter, createWebHistory } from "vue-router";

import mainPage from "../views/mainPage"
import Login from "../components/Login";

const routes = [
  {
    path: '/',
    //redirect 是重新定向
    redirect: '/login'
  },
  {
    path: '/detail',
    component: () => import("../views/dynamicDetail"),
    meta: {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },

  },

  {
    path: '/firstPage',
    component: () => import("../views/firstPage"),


  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  {
    path: "/register",
    name: "Register",
    component: () =>
      import("../views/Register"),
  },

  {
    path: "/chat",
    name: "chat",
    meta: {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: () => import("../views/chat/chat-content"),
  },


  {
    path: "/homepage",
    component: () => import("../views/homePage"),
    redirect: '/homepage/myarticle',
    meta: {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    children: [
      {
        path: "myarticle",
        name: "article",
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import("../views/mine/myArticle"),
      },
      {
        path: "edit",
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import("../views/mine/edit"),
      },
      {
        path: "follow",
        name: 'follow',
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import("../views/mine/follow"),
      },
      {
        path: "fanslist",
        name: 'fans',
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import("../views/mine/fans"),
      },
    ]
  },


  {
    path: "/main",
    name: "mainPage",
    component: mainPage,
    children: [
      {
        path: '/recomend',
        component: () => import("../views/recomendView"),

      },
      {
        path: "/searchActivity",

        component: () =>
          import("../views/searchActivity"),
      },
      {
        path: "/blindBox",
        name: "blindBox",
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component: () => import("../views/blindBox"),
      },
      {
        path: "/hotlist",
        name: "HotList",
        component: () => import("../views/hotList"),
      },


      {
        path: "/activity",
        component: () => import("../views/activity"),
      },

      {
        path: '/publish',
        component: () => import("../views/publishView"),
        meta: {                      //加一个自定义obj
          requireAuth: true      //这个参数 true 代表需要登录才能进入A
        }
      },
      {
        path: "/myBox",
        component: () => import("../views/myBox"),
        redirect: '/myBox/openBox',
        meta: {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        children: [
          {
            path: 'openBox',
            component: () => import("../views/mybox/openBox"),

          },
          {
            path: "leaveBox",

            component: () =>
              import("../views/mybox/leaveBox"),
          },]
      },

    ]
  },



];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
