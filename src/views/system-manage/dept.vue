<template>
  <div class="app-container">
    <el-container>
      <!--    <span style="font-size: 25px;font-weight: bold;">角色 ： {{ roleData.name }}</span>-->
      <!-- check-strictly：在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false -->
      <el-tree
        :check-strictly="true"
        :data="deptTree"
        node-key="id"
        ref="deptTree"
        highlight-current
        :expand-on-click-node="false"
        :default-checked-keys="defaultCheckedKeysMenu"
        :props="defaultPropsMenu"
        @node-click="clickNode">
           <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
             &nbsp;
             &nbsp;
        <span>
          <i class="el-icon-circle-plus" @click="() => handleCreate(data)"></i>
          &nbsp;
          &nbsp;
          <i class="el-icon-success" @click="() => handleUpdate(data)"></i>
          &nbsp;
          &nbsp;
          <i class="el-icon-remove" @click="() => handleDelete(data)"></i>
          <!--          <el-button-->
          <!--            icon="el-icon-circle-plus-outline"-->
          <!--            size="mini"-->
          <!--            @click="() => handleCreate(data)">-->
          <!--          </el-button>-->
          <!--          <el-button-->
          <!--            type="danger"-->
          <!--            size="mini"-->
          <!--            @click="() => remove(node, data)">-->
          <!--            Delete-->
          <!--          </el-button>-->
        </span>
      </span>
      </el-tree>
      <el-container v-if="show">
        <el-main>
          <el-table
            v-loading="listLoading"
            :data="userDeptList"
            size="mini"
            fit
            element-loading-text="Loading"
            border
            highlight-current-row
            align="center"
          >
            <el-table-column fixed label="用户名" prop="userName" align="center"></el-table-column>
            <el-table-column label="用户邮箱" prop="userEmail" align="center"></el-table-column>
            <el-table-column label="用户手机" prop="userPhone" align="center"></el-table-column>
            <el-table-column label="用户部门" prop="deptName" align="center"></el-table-column>
            <el-table-column label="用户区域" prop="areaName" align="center"></el-table-column>
            <el-table-column label="加入时间" prop="createTime" align="center"></el-table-column>
            <el-table-column label="修改时间" prop="updateTime" align="center"></el-table-column>
            <el-table-column label="状态" prop="userStatus" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.userStatus == 1 ? 'success' : 'danger'"
                  hit
                >{{ scope.row.userStatus == 1 ? '启用' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="form"
        label-position="right"
        label-width="120px"
        style="width: 400px; margin-left:50px;">
        <el-form-item
          v-show="parseInt(form.level) != 1"
          :label="tempDesc.parentName"
          prop="parentName"
        >
          <el-input v-model="form.parentName" :placeholder="'不填则代表顶级部门' + tempDesc.parentName"/>
        </el-form-item>
        <el-form-item :label="tempDesc.title" prop="title">
          <el-input v-model="form.title" :placeholder="'请输入' + tempDesc.title"/>
        </el-form-item>
        <el-form-item :label="tempDesc.sortNo" prop="sortNo">
          <el-input v-model="form.sortNo" type="number" :placeholder="'请输入' + tempDesc.sortNo"/>
        </el-form-item>
        <el-form-item :label="tempDesc.remarks" prop="remarks">
          <el-input
            v-model="form.remarks"
            type="textarea"
            :rows="7"
            :placeholder="'请输入' + tempDesc.remarks"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?addDept():updateDept()"
        >{{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { treeDept, addDept, updateDept } from '@/api/system/dept'
  import { getUserByDeptId } from '@/api/system/user'
  import { validateCh } from '@/utils/validate'

  // 常量title
  const tempDesc = {
    id: '',
    parentId: '',
    url: 'url',
    resources: '编码',
    title: '名称',
    level: '级别',
    sortNo: '排序',
    icon: '图标',
    type: '类型',
    remarks: '备注',
    parentName: '上级部门'
  }
  const menuTypeOptions = [
    { key: 'menu', display_name: '菜单' },
    { key: 'button', display_name: '按钮' }
  ]
  export default {
    name: 'roleSetting',
    data() {
      const _validateCh = (rule, value, callback) => {
        if (!!value && validateCh(value)) {
          callback(new Error('不能包含中文'))
        }
        callback()
      }
      return {
        roleId: undefined,
        roleData: {
          id: undefined, //主键ID
          code: undefined, //角色编码
          name: undefined, //角色名称
          remarks: undefined //角色描述
          // createTime: undefined, //创建时间
          // updateTime: undefined, //更新时间
        },
        activeName: 'allotMenu',// 选项卡
        dialogFormVisible: false,
        dialogStatus: '',
        show: false,
        tempDesc: tempDesc,
        defaultPropsUser: {
          children: 'children',
          label: 'username'
        },
        defaultCheckedKeysUser: [],
        userList: [],
        userTree: [],
        userDeptList: [],

        // 格式化后端传过来的数据为vue树所需参数
        defaultPropsMenu: {
          children: 'children',
          label: 'title'
        },
        defaultCheckedKeysMenu: [],
        deptList: [],
        deptTree: [],

        defaultPropsWxAccount: {
          children: 'children',
          label: 'name'
        },
        form: {
          id: undefined,
          parentId: undefined,
          url: undefined,
          resources: undefined,
          title: undefined,
          level: undefined,
          sortNo: undefined,
          icon: undefined,
          type: undefined,
          remarks: undefined,
          parentName: undefined
        },
        rules: {
          resources: [
            {
              required: true,
              message: '请输入' + tempDesc.resources,
              trigger: 'blur'
            },
            {
              min: 1,
              max: 100,
              message: '长度在 1 到 100 个字符',
              trigger: 'blur'
            },
            { validator: _validateCh, trigger: 'blur' }
          ],
          title: [
            {
              required: true,
              message: '请输入' + tempDesc.title,
              trigger: 'blur'
            },
            {
              min: 1,
              max: 25,
              message: '长度在 1 到 50 个字符',
              trigger: 'blur'
            }
          ],
          type: [
            {
              required: true,
              message: '请选择' + tempDesc.type,
              trigger: 'blur'
            }
          ],
          sortNo: [
            {
              required: true,
              message: '请输入' + tempDesc.sortNo,
              trigger: 'blur'
            }
          ],
          remarks: [{ max: 200, message: '长度最多200个字符', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.roleId = this.$route.params.id
      this.getDeptData()
    },
    methods: {
      // 角色与菜单关联
      getDeptData() {
        treeDept().then(response => {
          this.deptList = response.data.deptList
          this.deptTree = response.data.deptTree
        })
      },
      handleTabClick(tab, event) {
        //        if(this.activeName === 'allotUser'){
        //          this.getUserTabData();
        //        }
        //        if(this.activeName === 'allotMenu'){
        //          this.getMenuTabData();
        //        }
        //        if(this.activeName === 'allotWxAccount'){
        //          this.getWxAccountTabData();
        //        }
      },
      saveUserRole() {
        var selectedIds = this.$refs.userTree.getCheckedKeys()
        this.roleId = parseInt(this.roleId)// 转换成数字类型
        saveUserRole({ 'roleId': this.roleId, 'userIds': selectedIds.join(',') }).then(response => {
          if (response.code == 200) {
            this.submitOk(response.message)
          } else {
            this.submitFail(response.message)
          }
        })
      },
      saveRoleMenu() {
        var selectedIds = this.$refs.deptTree.getCheckedKeys()
        this.roleId = parseInt(this.roleId)// 转换成数字类型
        saveRoleMenu({ 'roleId': this.roleId, 'menuIds': selectedIds.join(',') }).then(response => {
          if (response.code === 200) {
            this.submitOk(response.message)
          } else {
            this.submitFail(response.message)
          }
        })
      },
      clickNode(data, node, obj) {
        this.show = true
        getUserByDeptId(data.id).then(response => {
          this.userDeptList = response.data
        })
      },
      resetForm() {
        this.form = {
          id: undefined,
          parentId: undefined,
          url: undefined,
          resources: undefined,
          title: undefined,
          level: undefined,
          sortNo: undefined,
          icon: undefined,
          type: undefined,
          remarks: undefined,
          parentName: undefined
        }
      },
      // 添加部门界面
      handleCreate(data) {
        this.resetForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true

        if (!data) {
          // 一级菜单
          this.form.level = '1' // 默认一级菜单
          this.form.parentId = '0'
        }
        if (data) {
          // 子菜单
          this.form.level = parseInt(data.level) + 1
          this.form.parentId = data.id
          this.form.parentName = data.title
        }
      },
      addDept() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addDept(this.form).then((response) => {
              if (response.code == 20000) {
                this.getDeptData()
                this.submitOk(response.msg)
                this.dialogFormVisible = false
              } else {
                this.submitFail(response.message)
              }
            })
          }
        })
      },

      // 修改部门界面
      handleUpdate(data) {
        this.form = []
        this.form.id = data.id
        this.form.parentId = data.parentId
        this.form.title = data.title
        this.form.remarks = data.remarks
        this.form.sortNo = data.sortNo

        this.dialogStatus = 'update'
        this.dialogFormVisible = true

        var parentNode = this.findTreeNode(data.parentId)
        if (parentNode) {
          this.form.parentName = parentNode.title
        }

        this.form = Object.assign({}, this.form)
      },
      findTreeNode(id) {
        var node = this._.find(this.deptList, { id: parseInt(id) })
        return node
      },
      updateDept() {
        //  this.form.parentName = undefined;
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateDept(this.form).then((response) => {
              if (response.code == 20000) {
                this.getDeptData()
                this.submitOk(response.msg)
                this.dialogFormVisible = false
              } else {
                this.submitFail(response.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 20px;
  }
</style>
