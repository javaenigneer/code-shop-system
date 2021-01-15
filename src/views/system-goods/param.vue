<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-input v-model="listQuery.name" placeholder="请输入属性名" style="width:150px" clearable></el-input>
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
          v-has="'user:add'"
          type="primary"
          @click="handleCreate"
          icon="el-icon-plus"
        >{{ $t('table.add') }}
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
          <el-table-column fixed label="ID" prop="id" align="center"></el-table-column>
          <el-table-column label="属性名" prop="attributeName" align="center"></el-table-column>
          <el-table-column label="参数名" prop="name" align="center"></el-table-column>
          <el-table-column label="特殊参数" prop="specialParam" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.specialParam == 1 ? 'success' : 'danger'"
                hit
              >{{ scope.row.specialParam == 1 ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="添加时间" prop="createTime" align="center"></el-table-column>
          <el-table-column label="修改时间" prop="updateTime" align="center"></el-table-column>

          <el-table-column
            align="center"
            v-if="this.global_checkBtnPermission(['user:edit','user:delete','user:enable'])"
            :label="$t('table.actions')"
          >
            <template slot-scope="scope">
              <el-button
                v-has="'user:edit'"
                size="mini"
                type="primary"
                @click="handleUpdate(scope.row)"
                icon="el-icon-edit"
                plain
              >{{ $t('table.edit') }}
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
        :title="titleMap[dialogStatus]"
        :visible.sync="dialogVisible"
        width="40%"
        @close="handleDialogClose"
      >
        <el-form
          ref="dataForm"
          :model="form"
          :rules="rules"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="参数名" prop="name">
            <el-input type="text" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="特殊参数" prop="specialParam">
            <el-select
              v-model="form.specialParam"
              class="filter-item"
              placeholder="是否设置为特殊参数"
              style="width: 150px;"
            >
              <el-option
                v-for="item in flagList"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="dialogStatus==='create'?createParam():updateCategoryAttribute()"
          >{{ $t('table.confirm') }}</el-button>
        </span>
      </el-dialog>
    </cus-wraper>
  </div>
</template>

<script>
  import {
    getPageParam,
    addParam
  } from '@/api/goods/param'
  // 导入自定义的表单组件
  import addProduct from './add-product'
  import {
    treeCategory
  } from '@/api/goods/category'

  export default {
    provide() {
      return {
        getList: this.getList
      }
    },
    components: {
      addProduct
    },
    data() {
      return {
        flagList: [
          { key: 1, display_name: '是' },
          { key: 0, display_name: '否' }
        ],
        active: false,
        dialogVisible: false,
        list: [],
        categoryList: [],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          attributeId:this.$route.query.attributeId,
          name: undefined,
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
          attributeId: undefined, //属性Id
          name: undefined, //备注，
          specialParam: undefined // 是否是通用参数
        },
        dialogStatus: '',
        titleMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          // categoryId: [{ required: true, message: '请选择分类', trigger: 'blur' }],
          name: [{ required: true, message: '请输入属性名', trigger: 'change' }],
          specialParam: [{ required: true, message: '请选择状态', trigger: 'blur' }]
        },
        roleList: [],
        defaultPropsMenu: {
          children: 'children',
          label: 'title'
        },
        defaultCheckedKeysMenu: [],
        deptIdCheckId: [],
        addProductVisible: false
      }
    },
    created() {
      console.log(this.$route.query.attributeId)
      this.getList()
      this.getCategory()
    },
    methods: {
      getList() {
        this.listLoading = true
        getPageParam(this.listQuery).then((response) => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },
      getCategory() {
        treeCategory().then(response => {
          this.categoryList = this.getCategoryTree(response.data.categoryTree)
        })
      },
      getCategoryTree(categoryTree) {
        for (var i = 0; i < categoryTree.length; i++) {
          if (categoryTree[i].children.length < 1) {
            categoryTree[i].children = undefined
          } else {
            this.getCategoryTree(categoryTree[i].children)
          }
        }
        return categoryTree
      },
      handleCreate() {
        this.dialogVisible = true
        this.dialogStatus = 'create'
      },
      createParam() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            this.form.attributeId = this.$route.query.attributeId
            addParam(this.form).then(response => {
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
        this.form = Object.assign({}, row)
        getDeptIdByUserId(row.userId).then(response => {
          if (response.data && response.data.length > 0) {
            this.defaultCheckedKeysMenu = this._.map(response.data, 'deptId')
          }
        })
        this.$delete(this.form, 'createTime')
        this.$delete(this.form, 'updateTime')
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
      closeAddProduct() {
        this.addProductVisible = false
      },
      handleSetAttribute(row){
        this.$router.replace('/systemGoods/goods')
      }
    }
  }
</script>
