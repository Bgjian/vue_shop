<template>
  <div class="categoriesBox">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addBtn">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类列表  -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效区域，设置对应的模板列： slot="isok"(与columns中设置的template保持一致) -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级分类</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级分类</el-tag>
          <el-tag size="mini" type="warning" v-else>三级分类</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editThisCate(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteThisCate(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>
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
    <!-- 添加分类模态框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="700px"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类模态框 -->
     <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="700px"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类  ID">
          <el-input v-model="editCateForm.cat_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类数据
      cateList: [],
      // tree-table的配置信息
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        // type:'template'(将该列设置为模板列)，template:'isok'(设置该列模板的名称为isok)
        {
          label: '是否有效',
          prop: '',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          prop: '',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          prop: '',
          type: 'template',
          template: 'opt'
        }
      ],
      // 查询分类数据的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      pageSizes: [1, 5, 10],
      // 商品分类总数
      total: 0,
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的列表(级联选择器的数据元)
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 选中的分类的Id数组
      selectedKeys: [],
      // 控制编辑分类模态框的显示与隐藏
      editCateDialogVisible: false,
      // 编辑分类数据
      editCateForm: {
        cat_id: '',
        cat_name: ''
      },
      // 编辑时,校验规则
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.axios.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
      // console.log(res.data)
    },
    // 每页显示数量pagesize发生改变时,触发,重新发送请求
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    // 当前页pagenum发生改变时,触发,重新发送请求
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    // 点击添加分类按钮时
    addBtn () {
      // 调用getParentCateList获取分类列表
      this.getParentCateList()
      // 显示添加分类对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类数据列表
    async getParentCateList () {
      const { data: res } = await this.axios.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表数据失败')
      }
      this.parentCateList = res.data
      // console.log(this.parentCateList)
    },
    // 级联选择器分类被选中,触发
    parentCateChanged () {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        // 如果用户指定选择了父级分类
        // 则将数组中的最后一项设置为新添加分类的父级分类
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // cat_level分类等级也要跟着发生变化
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 如果用户未指定父级分类,那么新添加分类直接作为一级分类添加
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 当关闭添加分类对话框时，重置表单
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击确定，完成添加分类
    addCate () {
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        // 发送请求完成添加分类
        const { data: res } = await this.axios.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 删除商品分类
    async deleteThisCate (row) {
      const confirmResult = await this.$confirm('确定删除此分类吗?', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.axios.delete('categories/' + row.cat_id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('删除分类成功')
      this.getCateList()
    },
    // 编辑商品分类
    async editThisCate (row) {
      const { data: res } = await this.axios.get('categories/' + row.cat_id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败')
      }
      this.editCateForm.cat_id = res.data.cat_id
      this.editCateForm.cat_name = res.data.cat_name
      this.editCateDialogVisible = true
    },
    // 编辑模态框关闭时
    editCateDialogClosed () {
      this.editCateDialogVisible = false
      this.$refs.editCateFormRef.resetFields()
      this.editCateForm.cat_id = ''
      this.editCateForm.cat_name = ''
    },
    // 编辑确定提交
    async editCate () {
      const { data: res } = await this.axios.put('categories/' + this.editCateForm.cat_id, {
        cat_name: this.editCateForm.cat_name
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改商品分类失败')
      }
      this.$message.success('修改商品分类成功')
      this.editCateDialogVisible = false
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.categoriesBox {
  .el-card {
    margin-top: 20px;
  }
  .zk-table {
    margin: 20px 0;
  }
  .el-cascader {
    width: 100%;
  }
}
</style>
