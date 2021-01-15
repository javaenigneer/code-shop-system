<template>
  <div class="app-container">
    <el-steps :active="orderStatus" finish-status="success" simple style="margin-top: 20px">
      <el-step title="提交订单"></el-step>
      <el-step title="支付订单"></el-step>
      <el-step title="平台发货"></el-step>
      <el-step title="确认收货"></el-step>
      <el-step title="完成评价"></el-step>
    </el-steps>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <template>
        <el-table
          :data="orderBasic"
          style="width: 100%">
          <el-table-column
            prop="orderId"
            label="订单编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="buyerName"
            label="买家名称"
            width="180">
          </el-table-column>
            <el-table-column
              prop="orderStatus"
              label="状态">
            </el-table-column>
        </el-table>
      </template>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>收货信息</span>
      </div>
      <template>
        <el-table
          :data="receiver"
          style="width: 100%">
          <el-table-column
            prop="receiverName"
            label="收货人"
            width="180">
          </el-table-column>
          <el-table-column
            prop="receiverPhone"
            label="手机号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="receiverAddress"
            label="收货地址">
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品信息</span>
      </div>
      <template>
        <el-table
          :data="productDetail"
          style="width: 100%">
          <el-table-column
            prop="productImage"
            label="商品图片"
            width="180">
            <template slot-scope="scope">
              <img :src="scope.row.productImage" width="40" height="40" class="head_pic"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="productTitle"
            label="商品名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="productSkuModel.price"
            label="商品价格">
          </el-table-column>
          <el-table-column
            prop="productSkuModel.title"
            label="属性">
          </el-table-column>
          <el-table-column
            prop="productCount"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="address"
            label="小计">
            <template slot-scope="scope">
             {{scope.row.productCount * scope.row.productSkuModel.price}}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>操作信息</span>
      </div>
      <template>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="操作者"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="操作时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="订单状态">
          </el-table-column>
          <el-table-column
            prop="address"
            label="付款状态">
          </el-table-column>
          <el-table-column
            prop="address"
            label="发货状态">
          </el-table-column>
          <el-table-column
            prop="address"
            label="备注">
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
  import {
    getOrderInfoById
  } from '@/api/order/order'

  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        value: '',
        centerDialogVisible: false,
        active: false,
        dialogVisible: false,
        list: [],
        sexList: [
          { key: '0', display_name: '男' },
          { key: '1', display_name: '女' }
        ],
        flagList: [
          { key: 1, display_name: '未付款' },
          { key: 2, display_name: '未发货' },
          { key: 3, display_name: '已发货' },
          { key: 4, display_name: '已完成' },
          { key: 5, display_name: '已关闭' }
        ],
        listLoading: true,
        deptTreeList: [],
        total: 0,
        orderBasic: [],
        receiver:[],
        productDetail:[],
        orderStatus:''
      }
    },
    created() {
      this.getOrderInfoById()
    },
    methods: {
      getOrderInfoById() {
        // this.listLoading = true
        getOrderInfoById(this.$route.query.orderId).then((response) => {
          if (response.code === 20000) {
            let orderDetail = response.data
            this.orderStatus = orderDetail.orderStatus
            let orderBasicParam = {}
            orderBasicParam.orderId = orderDetail.orderId
            orderBasicParam.buyerName = orderDetail.buyerName
            orderBasicParam.orderStatus = this.checkOrderStatus(orderDetail.orderStatus)
            this.orderBasic.push(orderBasicParam)

            let receiverParam = {}
            receiverParam.receiverName = orderDetail.receiverName
            receiverParam.receiverPhone = orderDetail.receiverPhone
            receiverParam.receiverAddress = orderDetail.receiverAddress
            this.receiver.push(receiverParam)

            this.productDetail = orderDetail.productModels
          } else {
            this.submitFail(response.msg)
          }
        })
      },
      checkOrderStatus(orderStatus){
        switch (orderStatus) {
          case 1: return '未支付'
          case 2: return "已支付，未发货"
          case 3: return "已发货"
          case 4: return "已完成"
          case 5: return "已关闭"
        }
      }
    }
  }
</script>
