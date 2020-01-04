<template>
  <div class="goodsBox">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- clearable属性,提供可清空按钮,clear事件在点击清空按钮时触发 -->
          <el-input
            placeholder="请输入搜索的内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
            @change="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="17">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="goodsList" stripe border>
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" align="center" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" align="center" width="100px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" align="center" width="150px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center" width="130px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getGoodsById(scope.row.goods_id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoodsById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="pageSizes"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 控制添加商品对话框的显示与隐藏
      addFormVisible: false,
      // 商品列表数据
      goodsList: [],
      // 数据总数
      total: 0,
      // 每页可选显示数量
      pageSizes: [10, 15, 20]
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      const { data: res } = await this.axios.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
      // console.log(this.goodsList)
    },
    // 每页显示数量pagesize发生改变时,触发,重新发送请求
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 当前页pagenum发生改变时,触发,重新发送请求
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 点击编辑跳转到编辑商品页面(携带ID)
    async getGoodsById (id) {
      this.$router.push({ path: '/goods/edit', query: { goodsId: id } })
    },
    // 点击添加跳转到添加商品页面
    goAddPage () {
      this.$router.push('/goods/add')
    },
    // 删除商品
    async removeGoodsById (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续？',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.axios.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      this.getGoodsList()
    }
  }
}
</script>

<style lang="less" scoped>
.goodsBox {
  .el-card {
    margin-top: 20px;
  }
  .el-col {
    position: relative;
  }
  .el-table {
    margin: 20px 0;
    font-size: 12px;
  }
}
</style>
