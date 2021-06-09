<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <template>
        <el-table
          :data="productBasic"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="商品ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="title"
            label="商品标题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="subtitle"
            label="商品二级标题">
          </el-table-column>
          <el-table-column
            prop="categoryName"
            label="分类名">
          </el-table-column>
          <el-table-column
            prop="brandName"
            label="商品品牌名">
          </el-table-column>
          <el-table-column
            prop="merchantName"
            label="商户名">
          </el-table-column>
          <el-table-column
            prop="storeName"
            label="门店名">
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品详情</span>
      </div>
      <template>
        <el-card class="box-card" style="width: 300px;float: left">
          <div slot="header" class="clearfix">
            <span>包装清单</span>
          </div>
          <div class="text item">
            {{productDetail.packingList}}
          </div>
        </el-card>
        <el-card class="box-card" style="width: 300px;float:left;margin-left: 20px">
          <div slot="header" class="clearfix">
            <span>售后服务</span>
          </div>
          <div class="text item">
            {{productDetail.afterService}}
          </div>
        </el-card>
      </template>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品描述</span>
      </div>
      <template>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-html="textarea">
        </el-input>
      </template>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品信息</span>
      </div>
      <template>
        <el-table
          :data="productSku"
          style="width: 100%">
          <el-table-column
            prop="images"
            label="商品图片"
            width="180">
            <template slot-scope="scope">
              <img :src="scope.row.images" width="40" height="40" class="head_pic"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格">
          </el-table-column>
          <el-table-column
            prop="ownSpec"
            label="属性">
          </el-table-column>
          <el-table-column
            prop="stock"
            label="数量">
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
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>处理信息</span>
      </div>
      <template>
        <el-form>
          <el-form-item label="备注信息" prop="desc">
            <el-input type="textarea" v-model="approveRemark"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 500px" v-if="approveStatus == -1">
            <el-button type="primary" @click="receiveProcess()">确认</el-button>
            <el-button @click="refuseProcess()">拒绝</el-button>
          </el-form-item>
          <el-form-item style="margin-left: 500px" v-if="approveStatus != -1">
            <el-tag type="success" size="medium">已受理</el-tag>
          </el-form-item>
        </el-form>
      </template>
    </el-card>
  </div>
</template>

<script>
  import {
    getProductInfoById
  } from '@/api/goods/product'

  export default {
    data() {
      let _this = this
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
        productBasic: [],
        productDetail: "",
        productSku: [],
        orderStatus: '',
        textarea: '',
        approveStatus: "",
        approveRemark: ""
      }
    },
    created() {
      this.getProductInfoById()
    },
    methods: {
      getProductInfoById() {
        this.listLoading = true
        getProductInfoById(this.$route.query.id).then((response) => {
          if (response.code === 20000) {
            let productInfo = response.data
            let productBasicInfo = {}
            productBasicInfo.id = productInfo.id
            productBasicInfo.title = productInfo.title
            productBasicInfo.subtitle = productInfo.subtitle
            productBasicInfo.categoryName = productInfo.categoryName
            productBasicInfo.brandName = productInfo.brandName
            productBasicInfo.merchantName = productInfo.merchantName
            productBasicInfo.storeName = productInfo.storeName
            this.productBasic.push(productBasicInfo)
            this.productDetail = productInfo.productDetail
            this.textarea = productInfo.productDetail.desc
            this.productSku = productInfo.productSkus
            this.approveStatus = productInfo.approveStatus
            this.approveRemark = productInfo.approveRemark
          } else {
            this.submitFail(response.msg)
          }
        })
      },
      checkOrderStatus(orderStatus) {
        switch (orderStatus) {
          case 1:
            return '未支付'
          case 2:
            return '已支付，未发货'
          case 3:
            return '已发货'
          case 4:
            return '已完成'
          case 5:
            return '已关闭'
        }
      }
    }
  }
</script>
