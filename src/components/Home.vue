<template>
  <div>
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header style="height: 78px;">
        <img src="../assets/heima.png" alt @click="backhome" />
        <span>电商后台管理系统</span>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏开始 -->
        <el-aside :style="isCollapse?'width:64px':'width:200px'">
          <!-- 侧边栏折叠按钮 -->
          <div
            class="toggle-button"
            @click="toggleCollapse"
            :style="isCollapse?'width:64px':'width:200px'"
          >
            <!-- 折叠状态 -->
            <span :class="isCollapse?'el-icon-caret-left':'el-icon-caret-right'"></span>
            <span v-html="isCollapse?'':'  '"></span>
            <span :class="isCollapse?'el-icon-caret-right':'el-icon-caret-left'"></span>
          </div>
          <!-- router是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
          <!-- default-active当前激活菜单的 index -->
          <!-- unique-opened是否只保持一个子菜单的展开 -->
          <!-- collapse是否水平折叠收起菜单 -->
          <el-menu
            :default-active="activePath"
            unique-opened
            router
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            :collapse-transition="false"
          >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <template slot="title">
                <div class="firstLi">
                  <i :class="iconsObj[item.id]"></i>
                  <span style="display: inline-block;width:15px"></span>
                  <span>{{item.authName}}</span>
                </div>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + secondItem.path"
                v-for="secondItem in item.children"
                :key="secondItem.id"
                @click="recordNavActive('/' + secondItem.path)"
              >
                <i class="el-icon-menu"></i>&nbsp;
                <span>{{secondItem.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
          <!-- 侧边栏结束 -->
        </el-aside>
        <!-- 主体区域 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 侧边栏数据
      menuList: null,
      // 图标数据
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 导航栏折叠状态
      isCollapse: false,
      // 记录被点击的链接地址
      activePath: ''
    }
  },
  // 在真实DOM绘制之前,执行
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('ActivePath')
  },
  methods: {
    // 退出
    logout () {
      this.$confirm('您确定要退出吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 退出时,清除sessionStorage中的Authorization和sessionStorage
          window.sessionStorage.clear()
          this.$router.push('/login')
        })
        .catch(() => {})
    },
    // 点击头像时,让页面重定向刷新,清除sessionStorage中的ActivePath
    backhome () {
      window.sessionStorage.removeItem('ActivePath')
      location.reload()
    },
    // 获取全部侧边栏数据
    async getMenuList () {
      const { data: res } = await this.axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(this.menuList)
    },
    // 点击折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存被点击的链接激活状态
    recordNavActive (val) {
      window.sessionStorage.setItem('ActivePath', val)
      this.activePath = val
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  .el-header {
    position: relative;
    background-color: #373d41;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #eaedf1;
      box-shadow: 0 0 8px rgb(209, 221, 226);
      position: absolute;
      left: 63px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }
    span {
      position: absolute;
      top: 50%;
      left: 20%;
      transform: translate(-50%, -50%);
      font-family: "STKaiti";
      font-size: 36px;
      font-weight: 700;
      // 字体颜色的渐变
      background-image: -webkit-gradient(
        linear,
        left 0,
        right 0,
        from(rgb(235, 235, 235)),
        to(rgb(150, 150, 150))
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .el-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 14px;
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      background-color: #333744;
      span {
        color: #fff;
      }
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
    }
    .el-menu-item span {
      color: #333744;
    }
    .toggle-button {
      color: #ccc;
      background-color: #464955;
      height: 32px;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
    }
  }
  .el-main {
    flex: 1;
    background-color: #eaedf1;
  }
}
</style>
