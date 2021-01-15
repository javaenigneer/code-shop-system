<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
          <el-cascader
            ref="cascaderCategory"
            v-model="listQuery.categoryId"
            :options="categoryList"
            :props="{value:'id',label:'name',emitPath:false}"></el-cascader>
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
          <el-table-column fixed label="分类Id" prop="categoryId" align="center"></el-table-column>
          <el-table-column label="商品分类" prop="categoryName" align="center"></el-table-column>
          <el-table-column label="添加时间" prop="createTime" align="center"></el-table-column>
          <el-table-column label="修改时间" prop="updateTime" align="center"></el-table-column>
          <el-table-column
            align="center"
            v-if="this.global_checkBtnPermission(['user:edit','user:delete','user:enable'])"
            :label="$t('table.set')"
          >
            <template slot-scope="scope">
              <el-button
                v-has="'user:edit'"
                size="mini"
                type="primary"
                @click="handleSetAttribute(scope.row)"
                icon="el-icon-edit"
                plain
              >{{ $t('table.setAttribute') }}
              </el-button>
            </template>
          </el-table-column>
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
          <el-form-item label="商品分类" prop="categoryId">
            <el-cascader
              ref="cascaderCategory"
              v-model="form.categoryId"
              @change="handleChange"
              :options="categoryList"
              :props="{value:'id',label:'name',emitPath:false}"></el-cascader>
            <el-button @click="addItem" :disabled="addDisable">添加属性</el-button>
          </el-form-item>
          <el-form-item label="属性"  v-for="(item,i) of items" :key="i">
            <el-input type="text" v-model="items[i]"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="dialogStatus==='create'?createCategoryAttribute():updateCategoryAttribute()"
          >{{ $t('table.confirm') }}</el-button>
        </span>
      </el-dialog>
    </cus-wraper>
  </div>
</template>

<script>
  import {
    getPageCategoryAttribute,
    addCategoryAttribute,
    getCategoryStatus
  } from '@/api/goods/category-attribute'
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
        addDisable: true,
        attributeName:'属性',
        active: false,
        dialogVisible: false,
        list: [],
        categoryList: [],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          categoryId: undefined,
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
          categoryId: undefined, //分类Id
          attributes: [], //属性
        },
        dialogStatus: '',
        titleMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          categoryId: [{ required: true, message: '请选择分类', trigger: 'blur' }],
          remarks: [{ required: true, message: '请输入备注', trigger: 'change' }]
        },
        roleList: [],
        defaultPropsMenu: {
          children: 'children',
          label: 'title'
        },
        defaultCheckedKeysMenu: [],
        deptIdCheckId: [],
        addProductVisible: false,
        items: []
      }
    },
    created() {
      this.getList()
      this.getCategory()
    },
    methods: {
      getList() {
        this.listLoading = true
        getPageCategoryAttribute(this.listQuery).then((response) => {
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
      createCategoryAttribute() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            for (var i = 0; i < this.items.length; i++) {
              this.form.attributes.push(this.items[i]);
            }
            addCategoryAttribute(this.form).then(response => {
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
        this.$delete(this.form, 'createTime')
        this.$delete(this.form, 'updateTime')
        this.dialogStatus = 'update'
        this.dialogVisible = true
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
      addItem(){
        this.items.push('')
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
        this.$router.push({path:'/systemGoods/attribute',query:{categoryId: row.categoryId}})
      },
      handleChange(categoryId){
        getCategoryStatus(categoryId).then(response => {
          if (response.code === 20000) {
            this.addDisable = false
            this.submitOk(response.msg)
          } else {
            this.submitFail(response.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
