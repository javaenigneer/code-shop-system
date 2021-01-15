<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-input v-model="listQuery.orderId" placeholder="请输入订单号" style="width:150px" clearable></el-input>
        <el-select
          v-model="listQuery.orderStatus"
          class="filter-item"
          placeholder="订单状态"
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
          <el-table-column fixed label="订单编号" prop="orderId" align="center"></el-table-column>
          <el-table-column label="提交时间" prop="createTime" align="center"></el-table-column>
          <el-table-column label="会员名称" prop="buyerName" align="center"></el-table-column>
          <el-table-column label="订单金额" prop="totalPay" align="center"></el-table-column>
          <el-table-column label="状态" prop="orderStatus" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.orderStatus == 1"
                      type="success"
                      hit
              >未支付
              </el-tag>
              <el-tag v-if="scope.row.orderStatus == 2"
                      hit
              >未发货
              </el-tag>
              <el-tag v-if="scope.row.orderStatus == 3"
                      type="danger"
                      hit
              >已发货
              </el-tag>
              <el-tag v-if="scope.row.orderStatus == 4"
                      type="info"
                      hit
              >已完成
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            v-if="this.global_checkBtnPermission(['order:view','order:delivery'])"
            :label="$t('table.actions')"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.orderStatus != 1"
                size="mini"
                type="success"
                @click="viewOrder(scope.row)"
              >{{ $t('table.viewOrder') }}
              </el-button>
              <el-button
                v-if="scope.row.orderStatus == 2"
                v-has="'order:delivery'"
                size="mini"
                type="success"
                @click="viewOrder(scope.row)"
              >{{ $t('table.orderDelivery') }}
              </el-button>
              <cus-del-btn v-has="'order:delete'" @ok="handleDelete(scope.row)"/>
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
    </cus-wraper>
  </div>
</template>

<script>
  import {
    getSystemPageOrder,
  } from '@/api/order/order'
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
          { key: 1, display_name: '未付款' },
          { key: 2, display_name: '未发货' },
          { key: 3, display_name: '已发货' },
          { key: 4, display_name: '已完成' },
          { key: 5, display_name: '已关闭' },
        ],
        listLoading: true,
        deptTreeList: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          orderId: undefined,
          orderStatus: undefined,
          createTime: undefined,
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
      this.deptTree()
    },
    methods: {
      getList() {
        this.listLoading = true
        getSystemPageOrder(this.listQuery).then((response) => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },
      // 获取全部角色
      getRoleList() {
        getAllListNoParam().then((response) => {
          this.roleList = response.data
        })
      },
      handleCreate() {
        this.defaultCheckedKeysMenu = []
        this.active = false
        this.getRoleList()
        this.resetForm()
        this.dialogStatus = 'create'
        this.dialogVisible = true
        this.deptTree()
      },
      createUser() {
        var selectedIds = this.$refs.menuTree.getCheckedKeys()
        if (selectedIds.length >= 2 || selectedIds.length <= 0) {
          this.submitWarning('请选择一个部门')
          return
        }
        this.form.deptIds = selectedIds[0]
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            addUser(this.form).then(response => {
              if (response.code == 20000) {
                this.getList()
                this.submitOk(response.msg)
                this.dialogVisible = false
              } else {
                this.submitFail(response.msg)
              }
            }).catch(err => {
              console.log(err)
            })
          }
        })
      },
      handleUpdate(row) {
        this.defaultCheckedKeysMenu = []
        this.active = true
        this.getRoleList()
        this.deptTree()
        this.form = Object.assign({}, row)
        getDeptIdByUserId(row.userId).then(response => {
          if (response.data && response.data.length > 0) {
            this.defaultCheckedKeysMenu = this._.map(response.data, 'deptId')
          }
        })
        this.$delete(this.form, 'createTime')
        this.$delete(this.form, 'updateTime')
        this.$delete(this.form, 'userRole')
        this.$delete(this.form, 'userDept')
        this.dialogStatus = 'update'
        this.dialogVisible = true
      },
      updateUser() {
        var selectedIds = this.$refs.menuTree.getCheckedKeys()
        if (selectedIds.length >= 2 || selectedIds.length <= 0) {
          this.submitWarning('请选择一个部门')
          return
        }
        this.form.deptIds = selectedIds[0]
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            updateSysUser(this.form)
              .then((response) => {
                if (response.code == 20000) {
                  this.getList()
                  this.submitOk(response.msg)
                  this.dialogVisible = false
                } else {
                  this.submitFail(response.msg)
                }
              })
              .catch((err) => {
                console.log(err)
              })
          }
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
      handleDelete(row) {
        let userId = row.userId
        deleteSysUser(userId).then((response) => {
          if (response.code == 20000) {
            this.getList()
            this.submitOk(response.msg)
          } else {
            this.submitFail(response.msg)
          }
        })
      },

      deptTree() {
        treeDept().then(response => {
          this.deptTreeList = response.data.deptTree
        })
      },

      getDeptIdByUserId(userId) {
        getDeptIdByUserId(userId).then(response => {
          if (response.code === 20000) {
            this.deptIdCheckId = response.data
          } else {
            this.deptIdCheckId = null
          }
        })
      },
      // submitForm() {
      //   this.$refs.dataForm.validate(valid => {
      //     if (valid) {
      //       saveSysUser(this.form).then(response => {
      //         if (response.code == 200) {
      //           this.getList()
      //           this.submitOk(response.message)
      //           this.dialogVisible = false
      //         } else {
      //           this.submitFail(response.message)
      //         }
      //       }).catch(err => {
      //         console.log(err)
      //       })
      //     }
      //   })
      // },
      resetForm() {
        this.form = {
          id: undefined, //主键ID
          username: undefined, //账号
          pwd: undefined, //登录密码
          nickName: undefined, //昵称
          sex: undefined, //性别 0:男 1:女
          phone: undefined, //手机号码
          email: undefined, //邮箱
          avatar: undefined, //头像
          flag: undefined //状态
          // gmtCreate: undefined, //创建时间
          // gmtModified: undefined //更新时间
        }
      },
      // 监听dialog关闭时的处理事件
      handleDialogClose() {
        if (this.$refs['dataForm']) {
          this.$refs['dataForm'].clearValidate() // 清除整个表单的校验
        }
      },
      viewOrder(row){
        this.$router.push({path:'/systemOrder/order-detail',query:{orderId:row.orderId}})
      }
    }
  }
</script>
