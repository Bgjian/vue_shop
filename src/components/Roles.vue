<template>
  <div class="rolesBox">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <!-- 添加角色 -->
      <div class="addBtnBox">
        <el-button type="primary" @click="add">添加角色</el-button>
      </div>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1===0?'bdtop':'']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              class="vcenter"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二、三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限  -->
                <el-row
                  :class="[i2===0?'':'bdtop' ]"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  class="vcenter"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      @close="removeRightById(scope.row,item3.id)"
                      closable
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" align="center"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" align="center"></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRoleById(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoleById(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="distribution(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑角色的模态框 -->
      <el-dialog title="编辑角色" :visible.sync="editFormVisible" width="700px">
        <el-form :model="editForm" :rules="addFormRoles" status-icon>
          <el-form-item label="角色ID" :label-width="formLabelWidth" prop="roleId">
            <el-input v-model="editForm.roleId" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
            <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth">
            <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole(editForm.roleId)">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加角色的模态框 -->
      <el-dialog title="添加角色" :visible.sync="addFormVisible" width="700px" @close="resetAddForm">
        <el-form :model="addForm" :rules="addFormRoles" ref="addFormRef" status-icon>
          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
            <el-input v-model="addForm.roleName" autocomplete="off" autofocus></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth">
            <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 权限分配模态框 -->
      <el-dialog title="分配权限" :visible.sync="setRightVisible" width="700px" @close="setRightClose">
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
        >
          <!-- show-checkbox:显示复选框  node-key:设置选中节点对应的值  default-expand-all:是否默认展开所有节点 :default-checked-keys 设置默认选中项的数组-->
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRight">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    var checkRoleName = (rule, value, callback) => {
      setTimeout(() => {
        if (!value.trim()) {
          return callback(new Error('请输入角色名'))
        } else {
          callback()
        }
      }, 300)
    }
    return {
      // 角色列表
      rolesList: [],
      editFormVisible: false,
      formLabelWidth: '80px',
      editForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      // 编辑或编辑角色校验
      addFormRoles: {
        roleName: [{ validator: checkRoleName, trigger: 'blur' }]
      },
      addFormVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      setRightVisible: false,
      // 权限树
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        // 通过label设置树形节点文本展示authName
        label: 'authName',
        // 设置通过children属性展示子节点信息
        children: 'children'
      },
      // 设置树形控件中默认选中的内容(就是角色已经含有的三级权限)
      defKeys: [],
      // 保存正在操作的角色id
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表数据
    async getRolesList () {
      const { data: res } = await this.axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rolesList = res.data
      // console.log(this.rolesList)
    },
    // 删除角色的权限
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm(
        '确定删除该权限吗?',
        '温馨提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.axios.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色权限失败')
      }
      this.$message.success('删除角色权限成功')
      // 无需再重新加载所有权限
      // 只需要对现有的角色权限进行更新即可
      role.children = res.data
    },
    // 删除角色
    async deleteRoleById (id) {
      const confirmResult = await this.$confirm(
        '确定删除该角色吗?',
        '温馨提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.axios.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRolesList() // 重新加载角色列表
    },
    // 点击编辑,获取角色信息,弹出模态框,渲染数据
    async editRoleById (id) {
      this.editFormVisible = true
      const { data: res } = await this.axios.get('roles/' + id)
      if (res.meta.status !== 200) {
        return
      }
      this.editForm.roleId = res.data.roleId
      this.editForm.roleName = res.data.roleName
      this.editForm.roleDesc = res.data.roleDesc
    },
    // 编辑确定提交
    async editRole (id) {
      const { data: res } = await this.axios.put('roles/' + id, {
        roleName: this.editForm.roleName,
        roleDesc: this.editForm.roleDesc
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改角色失败!')
      }
      this.editFormVisible = false
      this.$message.success('修改角色成功!')
      this.getRolesList()
    },
    // 添加角色
    add () {
      this.addFormVisible = true
    },
    resetAddForm () {
      this.$refs.addFormRef.resetFields()
    },
    async addRole () {
      const { data: res } = await this.axios.post('/roles', this.addForm)
      if (res.meta.status !== 201) {
        return this.$message.error('添加角色失败!')
      }
      this.$message.success('添加角色成功!')
      this.addFormVisible = false
      this.getRolesList()
    },
    // 点击权限分配,显示对应的模态框
    async distribution (role) {
      this.roleId = role.id
      // 获取权限树
      const { data: res } = await this.axios.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限树失败')
      }
      this.rightsList = res.data
      // 在模态框显示之前调用调用getDefKeys进行递归，将三级权限添加到数组defKeys中
      this.getDefKeys(role, this.defKeys)
      // console.log(this.defKeys)
      this.setRightVisible = true
    },
    // 该函数会获取到当前角色的所有三级权限id并添加到defKeys中
    getDefKeys (node, arr) {
      // 如果当前节点不包含children属性，则表示node为三级权限
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归调用
      node.children.forEach(item => this.getDefKeys(item, arr))
    },
    // 权限分配后,点击确定提交
    async setRight () {
      // 获取所有选中及半选的内容(可以不使用展开运算符以及饿了吗UI内置方法)
      const keys = [
        this.$refs.treeRef.getCheckedKeys(),
        this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 将数组转换为 , 拼接的字符串
      const isStr = keys.join(',')
      console.log(isStr)
      // 发送请求完成更新
      const { data: res } = await this.axios.post(
        `roles/${this.roleId}/rights`,
        { rids: isStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功!')
      this.setRightVisible = false
      this.getRolesList()
    },
    // 取消分配权限时,清空defKeys数组
    setRightClose () {
      this.defKeys = []
    }
  }
}
</script>

<style lang="less" scoped>
.rolesBox {
  .el-card {
    margin-top: 20px;
  }
  .addBtnBox {
    position: relative;
    width: 100%;
    height: 60px;
    background-color: #fff;
  }
  // 展开列的样式
  .vcenter {
    padding: 5px 0;
    display: flex;
    align-items: center;
  }
  .el-tag {
    margin: 5px;
  }
  .bdtop {
    border-top: 1px solid #ccc;
  }
  .bdbottom {
    border-bottom: 1px solid #ccc;
  }
}
</style>
