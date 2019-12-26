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
        <el-aside :width="isCollapse?'64px':'200px'">
          <!-- 侧边栏折叠按钮 -->
          <div class="toggle-button" @click="toggleCollapse">
            <!-- 折叠状态 -->
            <span :class="isCollapse?'el-icon-back':'el-icon-right'"></span>
            <span>{{isCollapse?'':'&nbsp;'}}</span>
            <span :class="isCollapse?'el-icon-right':'el-icon-back'"></span>
          </div>
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            :collapse-transition="false"
          >
            <el-submenu :index="item.order+''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单 -->
              <template slot="title">
                <div class="firstLi">
                  <i :class="iconsObj[item.id]"></i>&nbsp;&nbsp;
                  <span>{{item.authName}}</span>
                </div>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + secondItem.path"
                v-for="secondItem in item.children"
                :key="secondItem.id"
              >
                <i class="el-icon-menu"></i>&nbsp;&nbsp;
                <span>{{secondItem.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
          <!-- 侧边栏结束 -->
        </el-aside>
        <!-- 主体区域 -->
        <el-main>
          <h1>Main is OK!</h1>
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
      // 被激活的链接地址
      activePath: ''
    }
  },
  // 在真实DOM绘制之前,执行
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      this.$confirm('您确定要退出吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 退出时,清除sessionStorage中的Authorization
          window.sessionStorage.removeItem('Authorization')
          this.$router.push('/login')
        })
        .catch(() => {})
    },
    backhome () {
      // 点击头像时,让页面重定向刷新
      location.reload()
    },
    // 获取全部侧边栏数据
    async getMenuList () {
      const { data: res } = await this.axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 点击折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
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

    .el-menu-item span {
      color: #333744;
    }
    .toggle-button {
      color: #ccc;
      height: 32px;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
    }
  }
  .el-main {
    flex: 1;
    background-color: #eaedf1;
    h1 {
      margin: 0;
    }
  }
}
</style>
