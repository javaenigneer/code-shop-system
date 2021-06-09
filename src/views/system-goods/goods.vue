<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-input v-model="listQuery.title" placeholder="请输入标题" style="width:150px" clearable></el-input>
        <el-select
          v-model="listQuery.saleAble"
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
        <el-button
          v-has="'product:add'"
          type="primary"
          @click="handleCreate"
          icon="el-icon-plus"
        >{{ $t('table.add') }}
        </el-button>
        <el-button
          v-has="'user:add'"
          type="primary"
          @click="importGoods"
          icon="el-icon-plus"
        >{{ $t('table.importGoods') }}
        </el-button>
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
          <el-table-column fixed label="商品Id" prop="id" align="center"></el-table-column>
          <el-table-column label="商品标题" prop="title" align="center"></el-table-column>
          <el-table-column label="商品分类" prop="categoryName" align="center"></el-table-column>
          <el-table-column label="添加时间" prop="createTime" align="center"></el-table-column>
          <el-table-column label="修改时间" prop="updateTime" align="center"></el-table-column>
          <el-table-column label="状态" prop="saleAble" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.saleAble == 1"
                      type="success"
                      hit
              >上架
              </el-tag>
              <el-tag v-if="scope.row.saleAble == 0"
                      type="warning"
                      hit
              >下架
              </el-tag>
              <el-tag v-if="scope.row.saleAble == -1"
                      type="danger"
                      hit
              >删除
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" prop="approveStatus" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.approveStatus == 1"
                      type="success"
                      hit
              >审核通过
              </el-tag>
              <el-tag v-if="scope.row.approveStatus == 0"
                      type="danger"
                      hit
              >审核未通过
              </el-tag>
              <el-tag v-if="scope.row.approveStatus == -1"
                      type="warning"
                      hit
              >未审核
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            v-if="this.global_checkBtnPermission(['product:add','product:onSale','product:offSale','user:delete','user:enable'])"
            :label="$t('table.actions')"
          >
            <template slot-scope="scope">
              <el-button
                v-has="'product:onSale'"
                v-if="scope.row.saleAble!=1 && scope.row.saleAble != -1 && scope.row.approveStatus == 1"
                size="mini"
                type="success"
                @click="handleModifyStatus(scope.row,1)"
              >{{ $t('table.onSale') }}
              </el-button>
              <el-button
                v-if="scope.row.saleAble!=0  && scope.row.saleAble != -1"
                v-has="'product:offSale'"
                size="mini"
                @click="handleModifyStatus(scope.row,0)"
              >{{ $t('table.offSale') }}
              </el-button>
              <el-button
                v-if="scope.row.approveStatus == -1 && scope.row.saleAble != -1"
                v-has="'product:offSale'"
                size="mini"
                @click="examineProduct(scope.row)"
              >{{ $t('table.examine') }}
              </el-button>
              <el-button
                v-has="'user:edit'"
                size="mini"
                type="primary"
                @click="handleUpdate(scope.row)"
                icon="el-icon-edit"
                plain
              >{{ $t('table.edit') }}
              </el-button>
              <cus-del-btn v-has="'user:delete'" @ok="handleDelete(scope.row)" v-if="scope.row.saleAble != -1"/>
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
      <el-dialog :visible.sync="addProductVisible" append-to-body>
        <add-product v-if="addProductVisible" ref="addProduct" @goods="closeAddProduct"></add-product>
      </el-dialog>
    </cus-wraper>
  </div>
</template>

<script>
  import {
    getPageProduct,
    updateProductStatus,
    importGoods
  } from '@/api/goods/product'
  import { treeDept } from '@/api/system/dept';
  // 导入自定义的表单组件
  import addProduct from './add-product';
  export default {
    provide(){
      return{
        getList:this.getList
      }
    },
    components:{
      addProduct
    },
    data() {
      return {
        active: false,
        dialogVisible: false,
        list: [],
        sexList: [
          { key: '0', display_name: '男' },
          { key: '1', display_name: '女' }
        ],
        flagList: [
          { key: 1, display_name: '上架' },
          { key: 0, display_name: '下架' }
        ],
        listLoading: true,
        deptTreeList: [],
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          title: undefined,
          saleAble: undefined,
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
          userStatus: undefined, //状态
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
        addProductVisible:false,
      }
    },
    created() {
      this.getList()
      this.deptTree()
    },
    methods: {
      getList() {
        this.listLoading = true
        getPageProduct(this.listQuery).then((response) => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },

      handleCreate() {
       this.addProductVisible = true
      },
      handleModifyStatus: function(row, status) {
        updateProductStatus(row.id, status).then((response) => {
          if (response.code == 20000) {
            this.submitOk(response.msg)
            row.saleAble = status
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
      closeAddProduct(){
        this.addProductVisible = false
      },
      importGoods(){
        importGoods().then(response => {
          if (response.code === 20000){
            this.submitOk(response.msg)
          }else {
            this.submitFail(response.msg)
          }
        })
      },
      // 审核商品
      examineProduct(row){
        this.$router.push({ path: '/systemGoods/examine-goods', query: { id: row.id } })
      }
    }
  }
</script>
