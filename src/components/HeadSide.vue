<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>推广系统后台</span>
      </div>
      <el-button type="info" size="mini" @click="handleLogout"
        >Logout</el-button
      >
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          <i class="el-icon-s-fold"></i>
        </div>
        <el-menu
          active-text-color="#20a0ff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <template v-for="item in items">
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <!-- 主体部分 -->
      <el-main>
        <router-view>
          <!-- 放置路由占位符 -->
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      items: [
        {
          icon: 'el-icon-document',
          index: 'file',
          title: '文件上传'
        },
        {
          icon: 'el-icon-data-analysis',
          index: 'data',
          title: '数据查询'
        },
        {
          icon: 'el-icon-s-promotion',
          index: 'sendBatch',
          title: '短信发送'
        }
        // {
        //   icon: 'el-icon-s-promotion',
        //   index: 'sendManual',
        //   title: '手动发送'
        // }
      ]
    }
  },
  // created() {
  //   this.getMenuList()
  //   this.activePath = window.sessionStorage.getItem('activePath')
  // },
  methods: {
    // 实现登出功能 销毁token 跳转到登陆页
    handleLogout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 点击按钮切换折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
@import url('//unpkg.com/element-ui@2.14.1/lib/theme-chalk/index.css');

.home-container {
  height: 100%;
}
.el-header {
  // background-color: rgb(38, 47, 64);
  color: black;
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  img {
    width: 60px;
    height: 60px;
  }
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.toggle-button {
  // background-color: #4a5064;
  font-size: 14px;
  color: black;
  line-height: 28px;
  text-align: center;
  // letter-spacing: 0.2em;
  cursor: pointer;
}
.el-aside {
  // background-color: #354155;
  .el-menu {
    // border-right: none;
    width: 100%;
  }
}
.el-main {
  background-color: #f0f0f0;
}
</style>
