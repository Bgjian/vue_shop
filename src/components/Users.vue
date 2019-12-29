<template>
  <div class="userBox">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图:搜索与添加区域 -->
    <el-card shadow="hover">
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- clearable属性,提供可清空按钮,clear事件在点击清空按钮时触发 -->
          <el-input
            placeholder="请输入搜索的内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="17">
          <el-button type="primary" @click="addFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加用户的模态框 -->
    <el-dialog title="添加用户" :visible.sync="addFormVisible" width="700px" @close="resetAddForm">
      <el-form :model="addForm" :rules="addFormRoles" ref="addFormRef" status-icon>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addForm.username" autocomplete="off" autofocus></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="info" @click="resetAddForm">重 置</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户的模态框 -->
    <el-dialog title="修改用户" :visible.sync="editFormVisible" width="700px">
      <el-form :model="editForm" :rules="addFormRoles" status-icon>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editForm.email" autocomplete="off" autofocus></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserById">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 用户列表区域 -->
    <el-table :data="usersList" stripe>
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column label="姓名" prop="username" align="center"></el-table-column>
      <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
      <el-table-column label="电话" prop="mobile" align="center"></el-table-column>
      <el-table-column label="角色" prop="role_name" align="center"></el-table-column>
      <!-- 用户状态 -->
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="getUserById(scope.row.id)"
          ></el-button>
          <!-- 删除 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeUser(scope.row.id)"
          ></el-button>
          <!-- 分配角色 -->
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
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
  </div>
</template>

<script>
export default {
  data () {
    // 自定义验证规则
    var checkName = (rule, value, cb) => {
      let leng = value.trim().length
      setTimeout(() => {
        if (!value.trim()) {
          return cb(new Error('请输入用户名'))
        } else if (!(leng >= 3 && leng <= 10)) {
          return cb(new Error('长度在3到10个字符'))
        } else {
          cb()
        }
      }, 300)
    }
    var checkPassword = (rule, value, cb) => {
      let leng = value.trim().length
      setTimeout(() => {
        if (!value.trim()) {
          return cb(new Error('请输入登录密码'))
        } else if (!(leng >= 6 && leng <= 15)) {
          return cb(new Error('长度在6到15个字符'))
        } else {
          cb()
        }
      }, 300)
    }
    var checkMobile = (rule, value, cb) => {
      let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      setTimeout(() => {
        if (reg.test(value)) {
          cb()
        } else {
          cb(new Error('手机号码格式不正确'))
        }
      }, 300)
    }
    var checkEmail = (rule, value, cb) => {
      let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      setTimeout(() => {
        if (reg.test(value)) {
          cb()
        } else {
          cb(new Error('邮箱格式不正确'))
        }
      }, 300)
    }
    return {
      pageSizes: [1, 2, 4, 8],
      // 查询参数
      queryInfo: {
        query: '', // 查询参数是用户名中的一个或者多个连续字符
        pagenum: 1,
        pagesize: 8 // 此处的值,必须是page-sizes数组中的任意一个值
      },
      // 得到的用户数据以及总数
      usersList: [],
      total: 0,
      addFormVisible: false, // 添加用户模态框的状态
      addForm: {
        // 添加用户数据
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '80px',
      // 验证规则(添加与编辑共用验证规则)
      addFormRoles: {
        username: [{ validator: checkName, trigger: 'blur' }],
        password: [{ validator: checkPassword, trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }]
      },
      editFormVisible: false, // 编辑用户模态框的状态
      editForm: {
        // 编辑用户数据
        id: '', // 编辑后,提交用户信息使用
        username: '',
        email: '',
        mobile: ''
      }
    }
  },
  created () {
    this.getUsersList()
  },
  methods: {
    // 获取用户列表数据
    async getUsersList () {
      // 请求用户列表数据
      const { data: res } = await this.axios.get('/users', {
        params: this.queryInfo
      })
      // 响应状态码判断
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.usersList = res.data.users
      this.total = res.data.total
      // console.log(this.usersList, this.total)
    },
    // 每页显示数量pagesize发生改变时,触发,重新发送请求
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getUsersList()
    },
    // 当前页pagenum发生改变时,触发,重新发送请求
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getUsersList()
    },
    // 用户状态的切换
    async changeUserState (row) {
      const { data: res } = await this.axios.put(
        `/users/${row.id}/state/${row.mg_state}`
      )
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state // 状态修改失败,保持开关的状态不变
        return this.$message.error('修改状态失败')
      }
      this.$message.success('修改状态成功')
    },
    // 添加用户模态框重置表单
    resetAddForm () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.axios.post('users', this.addForm)
        // 添加失败，弹出提示信息，return
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败！')
        }
        // 该模态框有多种关闭方式,添加成功,不关闭模态框,但需要重置表单,可以连续添加
        this.$message.success('添加用户成功！')
        this.$refs.addFormRef.resetFields()
        this.getUsersList()
      })
    },
    // 点击删除用户
    async removeUser (id) {
      // console.log(id)
      // 询问是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户,是否继续?',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(() => {})
      // 如果用户点击确认，则confirmResult 为'confirm'
      // 如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除!')
      }
      const { data: res } = await this.axios.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getUsersList()
    },
    // 点击编辑,获取用户数据
    async getUserById (id) {
      // 根据id查询到该用户数据
      const { data: res } = await this.axios.get('/users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户失败!')
      }
      this.editFormVisible = true
      this.editForm.id = res.data.id
      this.editForm.username = res.data.username
      this.editForm.email = res.data.email
      this.editForm.mobile = res.data.mobile
      // console.log(res.data)
    },
    // 编辑后的提交
    async editUserById (id) {
      const { data: res } = await this.axios.put('/users/' + this.editForm.id, {
        email: this.editForm.email,
        mobile: this.editForm.mobile
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户信息失败!')
      }
      this.$message.success('修改用户信息成功!')
      this.editFormVisible = false
      this.getUsersList()
    }
  }
}
</script>

<style lang="less" scoped>
.userBox {
  .el-card {
    width: 100%;
    height: auto;
    margin-top: 20px;
    border-left: 0;
    border-right: 0;
    .el-button {
      float: right;
    }
  }
  .el-pagination {
    height: 40px;
    padding-top: 20px;
    background-color: #fff;
  }
}
</style>
