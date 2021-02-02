<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-input v-model="listQuery.nickName" placeholder="请输入昵称" style="width:150px" clearable></el-input>
        <el-select
          v-model="listQuery.status"
          class="filter-item"
          placeholder="请选择状态"
          style="width: 150px;"
        >
          <el-option
            v-for="item in flagList"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="listQuery.createTime"
          type="datetime"
          placeholder="创建时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-date-picker
          v-model="listQuery.updateTime"
          type="datetime"
          placeholder="更新时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-button type="primary" @click="getList" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="toAddMerchant" icon="el-icon-circle-plus-outline" v-has="'merchant:add'">添加商户</el-button>
      </cus-filter-wraper>
      <div class="table-container">
        <el-table
          v-loading="listLoading"
          :data="list"
          size="mini"
          fit
          element-loading-text="Loading"
          border
          highlight-current-row
          align="center"

        >
          <el-table-column fixed label="商户ID" prop="id" align="center"></el-table-column>
          <el-table-column label="商户昵称" prop="nickName" align="center"></el-table-column>
          <el-table-column label="商户号" prop="number" align="center"></el-table-column>
          <el-table-column label="商户手机" prop="phone" align="center"></el-table-column>
          <el-table-column label="加入时间" prop="createTime" align="center"></el-table-column>
          <el-table-column label="入驻时间" prop="setCreateTime" align="center"></el-table-column>
          <el-table-column label="状态" prop="status" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1"
                      type="success"
                      hit
              >审核通过
              </el-tag>
              <el-tag v-if="scope.row.status === 2"
                      hit
              >未审核
              </el-tag>
              <el-tag v-if="scope.row.status === 0"
                      type="danger"
                      hit
              >审核未通过
              </el-tag>
              <el-tag v-if="scope.row.status === 3"
                      type="info"
                      hit
              >未入驻
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            v-if="this.global_checkBtnPermission(['merchant:examine'])"
            :label="$t('table.actions')"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status === 2"
                size="mini"
                type="success"
                @click="goExamineMerchant(scope.row)"
              >{{ $t('table.examine') }}
              </el-button>
              <el-button
                v-if="scope.row.status === 3"
                size="mini"
                type="danger"
                @click="goExamineMerchant(scope.row)"
              > 删除
              </el-button>
              <cus-del-btn v-has="'user:delete'" @ok="handleDelete(scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <cus-pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
      </div>
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="50%"
        center>
        <el-form ref="form" :model="merchantDetail" label-width="80px">
          <el-form-item label="商户号">
            <el-input v-model="merchantDetail.number" disabled></el-input>
          </el-form-item>
          <el-form-item label="商户名称">
            <el-input v-model="merchantDetail.merchantName" disabled></el-input>
          </el-form-item>
          <el-form-item label="身份证正面">

            <div class="block">
              <el-image :src="merchantDetail.idCardFront" fit="cover" style="width: 100px;height: 100px"></el-image>
            </div>
          </el-form-item>
          <el-form-item label="身份证背面">
            <div class="block">
              <el-image :src="merchantDetail.idCardBack" fit="cover" style="width: 100px;height: 100px">
              </el-image>
            </div>
          </el-form-item>
          <el-form-item label="营业执照">
            <div class="block">
              <el-image :src="merchantDetail.license" fit="cover" style="width: 100px;height: 100px">
              </el-image>
            </div>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="merchantDetail.currentStatus" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="this.centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="examineMerchant()">确 定</el-button>
  </span>
      </el-dialog>
    </cus-wraper>
  </div>
</template>

<script>
  import {
    getPageMerchant,
    examineMerchant,
    deleteSysUser,
    updateSysUser,
    updateUserStatus,
    getAllListNoParam,
    getDeptIdByUserId
  } from '@/api/merchant/merchant'
  import { treeDept } from '@/api/system/dept'

  export default {
    data() {
      return {
        options: [{
          value: '1',
          label: '通过'
        }, {
          value: '0',
          label: '未通过'
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
          { key: 1, display_name: '通过' },
          { key: 2, display_name: '未审核' },
          { key: 0, display_name: '未通过' }
        ],
        listLoading: true,
        deptTreeList: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          nickName: undefined,
          status: undefined,
          createTime: undefined,
          updateTime: undefined
        },
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        },
        input: '',
        form: {
          userId: undefined, //主键ID
          userName: undefined, //用户名
          userEmail: undefined, //用户邮箱
          userPhone: undefined, //用户手机
          // sex: undefined, //性别 0:男 1:女
          // phone: undefined, //手机号码
          // email: undefined, //邮箱
          // avatar: undefined, //头像
          userStatus: undefined, //状态
          // gmtCreate: undefined, //创建时间
          // gmtModified: undefined //更新时间
          roleType: undefined, // 角色名称
          deptIds: undefined
        },
        dialogStatus: '',
        titleMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          userEmail: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' }],
          userPhone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
          // pwd: [
          //   { pattern: /^(\w){6,16}$/, message: "请设置6-16位字母、数字组合" },
          // ],
          // nickName: [
          //   { required: true, message: "请输入你昵称", trigger: "blur" },
          // ],
          // flag: [{ required: true, message: "请选择状态", trigger: "blur" }],
        },
        roleList: [],
        defaultPropsMenu: {
          children: 'children',
          label: 'title'
        },
        defaultCheckedKeysMenu: [],
        deptIdCheckId: [],
        merchantDetail: {
          number: '',
          merchantName: '',
          idCardFront: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          idCardBack: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          license: '',
          type: '',
          status: '',
          currentStatus: ''
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getPageMerchant(this.listQuery).then((response) => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },
      goExamineMerchant(row) {
        this.centerDialogVisible = true
        Object.assign(this.merchantDetail, row)
      },
      examineMerchant() {
        var param = {}
        param.number = this.merchantDetail.number
        param.status = this.merchantDetail.currentStatus
        examineMerchant(param).then(response => {
          if (response.code === 20000) {
            this.getList()
            this.submitOk(response.msg)
            this.centerDialogVisible = false
          } else {
            this.submitFail(response.msg)
          }
        })
      },
      // 监听dialog关闭时的处理事件
      handleDialogClose() {
        if (this.$refs['dataForm']) {
          this.$refs['dataForm'].clearValidate() // 清除整个表单的校验
        }
      },
      toAddMerchant(){
        this.$router.push({path:'/systemMerchant/add-merchant'})
      }
    }
  }
</script>
