<template>
  <div class="goodsEditBox">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert title="编辑商品信息" type="info" :closable="false" show-icon center></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 步骤条激活项索引
      activeIndex: '0'
    }
  },
  created () {
    this.getGoodsListById()
  },
  methods: {
    // 获取当前编辑的商品信息
    async getGoodsListById () {
      const { data: res } = await this.axios.get(`goods/${this.goodsId}`)
      console.log(res.data)
    }
  },
  computed: {
    // 获取地址栏商品参数goodsId
    goodsId () {
      return location.href
        .substr(1)
        .split('?')[1]
        .split('=')[1]
    }
  }
}
</script>

<style lang="less" scoped>
.goodsEditBox {
  .el-card {
    margin-top: 20px;
  }
  //   .previewImg {
  //     width: 100%;
  //   }
  //   .btnAdd {
  //     margin-top: 20px;
  //   }
}
</style>
