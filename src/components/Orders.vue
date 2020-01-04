<template>
  <div class="ordersBox">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- clearable属性,提供可清空按钮,clear事件在点击清空按钮时触发 -->
          <el-input
            placeholder="请输入搜索的内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrdersList"
            @change="getOrdersList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="ordersList" stripe border>
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" align="center" width="270px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" align="center"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay" align="center">
          <template slot-scope="scope">
            <el-tag
              type="danger"
              v-if="scope.row.pay_status == '0' || scope.row.order_pay == '0'"
            >未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" align="center"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" align="center">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240px">
          <template slot-scope="scope">
            <!-- 修改地址 -->
            <el-tooltip class="item" effect="dark" content="修改地址" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editSiteById(scope.row.order_id)"
                class="btn1"
              ></el-button>
            </el-tooltip>
            <!-- 物流进度 -->
            <el-tooltip class="item" effect="dark" content="物流进度" placement="top">
              <el-button
                type="success"
                class="el-icon-location"
                size="mini"
                @click="logisticsOrderById(scope.row.order_id)"
              ></el-button>
            </el-tooltip>
            <!-- 订单状态 -->
            <el-tooltip class="item" effect="dark" content="订单状态" placement="top">
              <el-button
                type="warning"
                icon="el-icon-refresh"
                size="mini"
                @click="editSstatusById(scope.row.order_id)"
                class="btn3"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能区域 -->
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
    <!-- 查看物流进度模态框 -->
    <el-dialog title="物流进度" :visible.sync="logisticsVisible" width="700px">
      <!-- 时间线组件  -->
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in logisticsInfo"
          :key="index"
          :timestamp="item.time"
        >{{item.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
    <!-- 修改订单地址模态框 -->
    <el-dialog title="修改地址" :visible.sync="siteVisible" width="700px" @close="siteClosed">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区县" prop="address1">
          <el-cascader :options="cityData" :props="addressProps" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="siteVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSite">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改订单状态模态框 -->
    <el-dialog title="订单状态" :visible.sync="statusVisible" width="700px" @click="edidClosed">
      <el-form :model="statusForm" ref="statusFormRef" label-width="100px">
        <el-form-item label="发货状态">
          <el-select v-model="statusForm.is_send">
            <el-option
              v-for="(item,index) in optionsSend"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单价格">
          <el-input v-model="statusForm.order_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="statusForm.order_pay">
            <el-option
              v-for="(item,index) in optionsPay"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="statusForm.pay_status">
            <el-option
              v-for="(item,index) in optionsStatus"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../citydata'
export default {
  data () {
    return {
      // 订单查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单列表数据
      ordersList: [],
      // 订单总数
      total: 0,
      // 每页可选显示数量
      pageSizes: [10, 15, 20],
      // 保存物流信息
      logisticsInfo: [],
      // 控制物流进度模态框的显示和隐藏
      logisticsVisible: false,
      // 控制修改订单地址模态框的显示和隐藏
      siteVisible: false,
      // 控制修改订单状态模态框
      statusVisible: false,
      // 修改收货地址的表单
      addressForm: {
        address1: [],
        address2: ''
      },
      // 收货地址表单的验证规则
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 省市区级联选择器的配置对象
      addressProps: {
        expandTrigger: 'hover'
      },
      // 保存导入的cityData数据
      cityData: cityData,
      // 订单状态表单
      statusForm: {
        is_send: '',
        order_price: '',
        order_pay: '',
        pay_status: ''
      },
      // 当前编辑的订单ID
      currentOrderId: '',
      // 支付方式
      optionsPay: [
        { value: '0', label: '未支付' },
        { value: '1', label: '支付宝' },
        { value: '2', label: '微信' },
        { value: '3', label: '银行卡' }
      ],
      // 支付状态
      optionsStatus: [
        { value: '0', label: '未付款' },
        { value: '1', label: '已付款' }
      ],
      // 发货状态
      optionsSend: [
        { value: '0', label: '未发货' },
        { value: '1', label: '已发货' }
      ]
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表数据
    async getOrdersList () {
      const { data: res } = await this.axios.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.ordersList = res.data.goods
      this.total = res.data.total
      // console.log(this.ordersList)
    },
    // 每页显示数量pagesize发生改变时,触发,重新发送请求
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getOrdersList()
    },
    // 当前页pagenum发生改变时,触发,重新发送请求
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getOrdersList()
    },
    // 点击编辑订单状态
    editSstatusById (id) {
      this.currentOrderId = id
      this.statusVisible = true
      this.ordersList.forEach(item => {
        if (item.order_id === id) {
          this.statusForm.is_send = item.is_send === '是' ? '已发货' : '未发货' // 是否发货
          this.statusForm.order_price = item.order_price // 订单价格
          this.statusForm.order_pay =
            item.order_pay === '0'
              ? '未支付'
              : item.order_pay === '1'
                ? '支付宝'
                : item.order_pay === '2'
                  ? '微信'
                  : '银行卡' // 支付方式
          this.statusForm.pay_status =
            item.pay_status === '0' ? '未付款' : '已付款' // 支付状态
        }
      })
      // console.log(this.statusForm)
    },
    // 编辑订单状态模态框关闭时,触发
    edidClosed () {
      this.$refs.statusFormRef.resetFields()
    },
    // 订单状态编辑完成后的提交
    async editStatus () {
      const { data: res } = await this.axios.put(
        `orders/${this.currentOrderId}`,
        this.statusForm
      )
      if (res.meta.status !== 201) {
        return this.$message.error('更新订单状态失败')
      }
      this.$message.success('更新订单状态成功')
      this.getOrdersList()
      this.statusVisible = false
      this.statusForm.is_send = ''
      this.statusForm.order_price = ''
      this.statusForm.order_pay = ''
      this.statusForm.pay_status = ''
    },
    // 点击修改订单地址
    editSiteById (id) {
      this.siteVisible = true
    },
    // 修改订单模态框关闭时,置空表单
    siteClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 订单地址的确定提交
    editSite () {
      this.siteVisible = false
    },
    // 点击查看物流进度
    async logisticsOrderById (id) {
      const { data: res } = await this.axios.get(`/kuaidi/804909574412544580`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.logisticsInfo = res.data
      this.logisticsVisible = true
      // console.log(this.logisticsInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.ordersBox {
  .el-card {
    margin-top: 20px;
  }
  .el-table {
    margin: 20px 0;
  }
  .btn1 {
    margin-right: 10px;
  }
  .btn3 {
    margin-left: 20px;
  }
  .el-select,
  .el-cascader {
    width: 100%;
  }
}
</style>
