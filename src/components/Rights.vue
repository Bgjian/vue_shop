<template>
  <div class="rightsBox">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表 -->
    <el-table :data="rightsList" stripe  :default-sort = "{prop: 'level'}">
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
      <el-table-column label="路径" prop="path" align="center"></el-table-column>
      <el-table-column label="权限等级" prop="level" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level == 0">一级权限</el-tag>
          <el-tag v-if="scope.row.level == 1" type="success">二级权限</el-tag>
          <el-tag v-if="scope.row.level == 2" type="warning">三级权限</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表数据
    async getRightsList () {
      const { data: res } = await this.axios.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      // console.log(this.rightsList)
    }
  }
}
</script>

<style lang="less" scoped>
.rightsBox {
  .el-table {
    margin-top: 20px;
  }
}
</style>
