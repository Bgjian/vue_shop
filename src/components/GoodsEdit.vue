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
      <!-- tab栏区域与表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabChange">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="editForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="editForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="editForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- 选择商品分类的级联选择框 -->
              <el-cascader
                v-model="currentGoods_cat"
                :options="cateList"
                :props="cateProps"
                disabled
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="(item,index) in manyTableData"
              :label="item.attr_name"
              :key="index"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="value"
                  v-for="(value,index) in item.attr_vals"
                  :key="index"
                  border
                  disabled
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="(item,index) in onlyTableData"
              :label="item.attr_name"
              :key="index"
            >
              <el-input v-model="item.attr_vals" disabled></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headerObj"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="editForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnEdit" @click="addGoods">编辑商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="700px">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      // 步骤条激活项索引
      activeIndex: '0',
      // 当前编辑商品的信息
      editForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品的详情介绍
        goods_introduce: '',
        // 保存处理后的动态参数和静态属性
        attrs: [],
        // 编辑商品的所属分类
        goods_cat: ''
      },
      // 编辑表单验证规则
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      // 级联选择器配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器默认值
      currentGoods_cat: [],
      // 分类数据列表
      cateList: [],
      // 用来保存动态参数数据
      manyTableData: [],
      // 用来保存静态属性数据
      onlyTableData: [],
      // 指定图片上传的地址接口
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的请求头对象(为该组件内置的axios请求添加token字段)
      headerObj: {
        Authorization: window.sessionStorage.getItem('Authorization')
      },
      // 上传图片数组
      pics: [],
      // 保存新上传的预览图片的url地址
      previewPath: '',
      // 保存当前商品已有图片.用作预览
      fileList: [],
      // 控制预览图片对话框的显示和隐藏
      previewVisible: false
    }
  },
  created () {
    this.getGoodsListById()
    this.getCateList()
  },
  methods: {
    // 获取分类数据
    async getCateList () {
      const { data: res } = await this.axios.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.cateList = res.data
    },
    // 获取当前编辑的商品信息
    async getGoodsListById () {
      const { data: res } = await this.axios.get(`goods/${this.goodsId}`)
      this.editForm.goods_name = res.data.goods_name
      this.editForm.goods_price = res.data.goods_price
      this.editForm.goods_number = res.data.goods_number
      this.editForm.goods_weight = res.data.goods_weight
      this.editForm.goods_introduce = res.data.goods_introduce
      this.editForm.goods_cat = res.data.goods_cat
      // 保存当前商品已有图片到fileList数组中.用作预览
      res.data.pics.forEach(item => {
        this.fileList.push({ url: item.pics_big_url, name: item.pics_big })
      })
      // 动态参数
      this.manyTableData = res.data.attrs.filter(item => {
        return item.attr_sel === 'many'
      })
      this.manyTableData.forEach(item2 => {
        item2.attr_vals =
          item2.attr_vals.length === 0 ? [] : item2.attr_vals.split(' ')
      })
      // 静态属性
      this.onlyTableData = res.data.attrs.filter(item => {
        return item.attr_sel === 'only'
      })
      // 处理商品分类(级联选择器的默认选中值)
      var arr = []
      res.data.goods_cat.split(',').forEach(item => {
        arr.push(item - 0)
      })
      this.currentGoods_cat = JSON.parse(JSON.stringify(arr))
    },
    // tab栏切换前回调函数(判断必填项是否填写)
    beforeTabChange (activeName, oldActiveName) {
      if (oldActiveName === '0') {
        // 在第一个标签页的时候
        if (this.editForm.goods_name.trim() === '0') {
          this.$message.error('请输入商品名称')
          return false
        } else if (this.editForm.goods_price === 0) {
          this.$message.error('请输入商品价格')
          return false
        } else if (this.editForm.goods_weight === 0) {
          this.$message.error('请输入商品重量')
          return false
        } else if (this.editForm.goods_number === 0) {
          this.$message.error('请输入商品数量')
          return false
        }
      }
    },
    // 点击文件列表中已上传的文件时的钩子函数(预览)
    handlePreview (file) {
      this.previewVisible = true
      // 判断当前点击预览的是已有图片还是新上传图片
      if (file.response) {
        this.previewPath = file.response.data.url
      } else {
        this.previewPath = file.url
      }
    },
    // 文件列表移除文件时的钩子函数(删除)
    async handleRemove (file, fileList) {
      // 只能删除新上传的文件
      if (file.response) {
        // 获取用户点击删除的那个图片的临时路径
        const filePath = file.response.data.tmp_path
        // 使用findIndex来查找符合条件的索引
        const index = this.pics.findIndex(item => item.pic === filePath)
        // 移除索引对应的图片
        this.pics.splice(index, 1)
      }
    },
    // 文件上传成功时的钩子函数(上传成功)
    handleSuccess (response) {
      if (response.meta.status !== 200) {
        return this.$message.error('上传失败')
      }
      this.$message.success('上传成功')
      // 将服务器返回的临时路径保存到pics数组中
      this.pics.push({ pic: response.data.tmp_path })
      console.log(this.pics)
    },
    // 编辑完成后,点击按钮提交
    async addGoods () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项!')
        // 执行添加的业务逻辑
        // lodash   cloneDeep(obj)
        const form = _.cloneDeep(this.editForm)
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.editForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.editForm.attrs.push(newInfo)
        })
        form.attrs = this.editForm.attrs
        // 如果pics数组中第一项有值,代表上传了图片,在form对象中添加该数组,当前编辑商品的原图片会被服务器删除
        // 如果pics数组中第一项没有值,代表未上传图片,form中不添加该数组,当前编辑商品的原图片依然可以保留
        if (this.pics[0]) {
          form.pics = this.pics
        }
        // 发起请求编辑商品
        const { data: res } = await this.axios.put(`goods/${this.goodsId}`, form)
        if (res.meta.status !== 200) {
          return this.$message.error('编辑商品失败！')
        }
        this.$message.success('编辑商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 获取地址栏商品参数goodsId
    goodsId () {
      return location.href.substr(1).split('=')[1]
    }
  }
}
</script>

<style lang="less" scoped>
.goodsEditBox {
  .el-card {
    margin-top: 20px;
  }
  .previewImg {
    width: 100%;
  }
  .btnEdit {
    margin-top: 20px;
  }
}
</style>
