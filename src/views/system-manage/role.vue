<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-input v-model="listQuery.roleName" placeholder="请输入角色名称" style="width:200px" clearable></el-input>
        <el-button type="primary" @click="getList" icon="el-icon-search" v-waves>{{ $t('table.search') }}</el-button>
        <el-button v-has="'role:add'" type="primary" @click="handleCreate" icon="el-icon-plus" v-waves>{{ $t('table.add') }}</el-button>
      </cus-filter-wraper>

      <div class="table-container">
        <el-table v-loading="listLoading" :data="list" size="mini" element-loading-text="Loading" fit border highlight-current-row>
          <el-table-column label="ID" prop="roleId" align="center"></el-table-column>
          <el-table-column label="角色编码" prop="roleCode" align="center"></el-table-column>
          <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
          <el-table-column label="备注" prop="roleRemarks" align="center"></el-table-column>
          <!-- <el-table-column label="是否已关联系统用户" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isRelatedSysUser == 1 ? 'success' : 'danger'" hit>
                {{ scope.row.isRelatedSysUser == 1 ? '&emsp;是&emsp;' : '&emsp;否&emsp;' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否已关联系统资源" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isRelatedSysMenu == 1 ? 'success' : 'danger'" hit>
                {{ scope.row.isRelatedSysMenu == 1 ? '&emsp;是&emsp;' : '&emsp;否&emsp;' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label='是否已关联微信账号' align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isRelatedWxAccount == 1 ? 'success' : 'danger'" hit>
                {{ scope.row.isRelatedWxAccount == 1 ? '&emsp;是&emsp;' : '&emsp;否&emsp;' }}
              </el-tag>
            </template>
          </el-table-column> -->
          <el-table-column v-if="this.global_checkBtnPermission(['role:edit','roleSetting','role:delete'])" :label="$t('table.actions')" align="center">
            <template slot-scope="scope">
              <el-button v-has="'role:edit'" size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit" plain v-waves> {{ $t('table.edit') }}</el-button>
              <!-- <router-link :to="'/systemManage/roleSetting/'+scope.row.roleId"> -->
                <el-button v-has="'roleSetting'" type="primary" size="mini" style="width: 100px;margin-left: 10px;margin-right: 10px;" icon="el-icon-setting" plain @click="showPremission(scope.row.roleId)">
                  权限设置
                </el-button>
              <!-- </router-link> -->
              <cus-del-btn v-has="'role:delete'" @ok="handleDelete(scope.row)"></cus-del-btn>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <cus-pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
      </div>

      <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogVisible" width="40%" @close="handleDialogClose">
        <el-form ref="dataForm" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="角色编码:" prop="roleCode">
<!--            <el-input v-model="form.code" :disabled="dialogStatus != 'create'"></el-input>-->
            <el-input v-model="form.roleCode"></el-input>
          </el-form-item>
          <el-form-item label="角色名称:" prop="roleName">
            <el-input v-model="form.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述:" prop="roleRemarks">
            <el-input v-model="form.roleRemarks" type="textarea" :rows="7"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" v-waves> {{ $t('table.cancel') }}</el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createRole():updateRole()" v-waves>{{ $t('table.confirm') }}</el-button>
        </span>
      </el-dialog>

      <el-dialog title="分配权限" :visible.sync="dialogFormVisible">

  <el-tree
          :check-strictly="true"
          :data="menuTree"
          show-checkbox
          node-key="id"
          ref="menuTree"
          highlight-current
          :default-checked-keys="defaultCheckedKeysMenu"
          :props="defaultPropsMenu">
        </el-tree>
        
  <div slot="footer" class="dialog-footer" >
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRolePermission()">确 定</el-button>
  </div>
        
</el-dialog>
 
    </cus-wraper>
  </div>
</template>

<script>
    import {getRolePage, addRoleMenu, deleteRole,getRoleMenuByRoleId,updateSysRole,addRole} from '@/api/system/role'
    import {treeMenu} from '@/api/system/menu'

    export default {
        data() {
            return {
              roleId: undefined,
                tableKey: 0,
                list: null,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    name: undefined
                },
                showReviewer: false,
                form: {
                    roleId: undefined, //主键ID
                    roleCode: undefined, //角色编码
                    roleName: undefined, //角色名称
                    roleRemarks: undefined, //角色描述
                    // isRelatedSysUser: undefined, //是否已关联系统用户
                    // isRelatedSysMenu: undefined, //是否已关联系统资源
                    // isRelatedWxAccount: undefined //是否已关联微信账号
                },
                dialogVisible: false,
                dialogStatus: '',
                dialogFormVisible: false,
               // 格式化后端传过来的数据为vue树所需参数
                defaultPropsMenu: {
                    children: 'children',
                    label: 'title'
                },
                defaultCheckedKeysMenu: [],
                menuList: [],
                menuTree: [],
                titleMap: {
                    update: '编辑',
                    create: '创建'
                },
                rules: {
                    roleCode: [
                        {required: true, message: '请输入角色编码', trigger: 'blur'},
                        {min: 1, max: 25, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    roleName: [
                        {required: true, message: '请输入角色名', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    roleRemarks: [
                        {max: 200, message: '长度最多200个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getList(),
            this.getMenuTabData();
        },
        methods: {
            getList() {
                this.listLoading = true;
                getRolePage(this.listQuery).then(response => {
                    this.list = response.data.data;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            handleCreate() {
                this.resetForm();
                this.dialogStatus = 'create';
                this.dialogVisible = true;
            },
            handleUpdate(row) {
                this.form = Object.assign({}, row);
                this.form.isRelatedSysMenu = undefined;
                this.form.isRelatedSysUser = undefined;
                this.form.isRelatedWxAccount = undefined;
                this.dialogStatus = "update";
                this.dialogVisible = true;
                this.$delete(this.form,"createTime")
                this.$delete(this.form,"updateTime")
            },
            updateRole(){
              this.$refs['dataForm'].validate(valid => {
                    if (valid) {
                        updateSysRole(this.form).then(response => {
                            if (response.code == 20000) {
                                this.getList();
                                this.submitOk(response.msg);
                                this.dialogVisible = false;
                            } else {
                                this.submitFail(response.msg);
                            }
                        }).catch(err => { console.log(err);  });
                    }
                });
            },
            handleDelete(row) {
                deleteRole(row.roleId).then(response => {
                    if (response.code === 20000) {
                        this.getList();
                        this.submitOk(response.msg);
                    } else {
                        this.submitFail(response.msg);
                    }
                });
            },
            createRole() {
                this.$refs['dataForm'].validate(valid => {
                    if (valid) {
                        addRole(this.form).then(response => {
                            if (response.code == 20000) {
                                this.getList();
                                this.submitOk(response.msg);
                                this.dialogVisible = false;
                            } else {
                                this.submitFail(response.msg);
                            }
                        }).catch(err => { console.log(err);  });
                    }
                });
            },
            resetForm() {
                this.form = {
                    roleCode: undefined, //角色编码
                    roleName: undefined, //角色名称
                    roleRemarks: undefined //角色描述
                }
            },
            // 监听dialog关闭时的处理事件
            handleDialogClose() {
                if (this.$refs['dataForm']) {
                    this.$refs['dataForm'].clearValidate(); // 清除整个表单的校验
                }
            },
            // 角色与菜单关联
            getMenuTabData() {
                treeMenu().then(response => {
                    this.menuList = response.data.menuList
                    this.menuTree = response.data.menuTree
                });
            },
            showPremission(roleId){
              this.dialogFormVisible = true
              this.roleId = roleId
              getRoleMenuByRoleId(roleId).then(response => {
                    if (response.data && response.data.length > 0) {
                        this.defaultCheckedKeysMenu = this._.map(response.data, 'menuId')
                    }
                })
            },
            setRolePermission(){
              var selectedIds = this.$refs.menuTree.getCheckedKeys();
              addRoleMenu({'roleId': this.roleId, 'menuIds': selectedIds.join(',')}).then( response => {
                    if (response.code === 20000) {
                        this.getList();
                        this.submitOk(response.msg);
                        this.dialogFormVisible = false;
                    } else {
                        this.submitFail(response.msg);
                    }
                })
            }
        }
    }
</script>
