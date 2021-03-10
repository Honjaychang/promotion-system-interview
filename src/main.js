import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入axios
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// axios.defaults.baseURL = '/api'
axios.defaults.baseURL = 'https://wenling.hzcloudservice.com/api' // 为保证上线项目安全
// 通过 axios请求拦截器添加 token,保证拥有获取数据的权限。
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization =
    'Bearer ' + window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
