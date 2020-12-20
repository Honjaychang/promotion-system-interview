import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import HeadSide from '../components/HeadSide.vue'
import File from '../components/File.vue'
import Data from '../components/Data.vue'
import SendBatch from '../components/SendBatch.vue'
// import SendManual from '../components/SendManual.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: HeadSide,
    redirect: '/file',
    children: [
      { path: '/file', name: 'file', component: File },
      { path: '/data', component: Data },
      { path: '/sendBatch', component: SendBatch }
      // {
      //   path: '/sendManual',
      //   component: SendManual
      // }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从哪个路径跳转
  // next 是一个函数 表示放行
  // next()放行  next('/login')强制跳转

  if (to.path === '/login') return next()
  // 获取token     但是应该要判断token的真假性
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
