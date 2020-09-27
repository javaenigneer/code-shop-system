<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-input v-model="listQuery.userName" placeholder="请输入用户名" style="width:150px" clearable></el-input>
        <el-input v-model="listQuery.userEmail" placeholder="请输入用户邮箱" style="width:150px" clearable></el-input>
        <el-input v-model="listQuery.userPhone" placeholder="请输入用户手机" style="width:150px" clearable></el-input>
         <el-select
              v-model="listQuery.userStatus"
              class="filter-item"
              placeholder="请选择状态"
              style="width: 280px;"
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
          v-has="'user:add'"
          type="primary"
          @click="handleCreate"
          icon="el-icon-plus"
        >{{ $t('table.add') }}</el-button>
      </cus-filter-wraper>
      <div class="table-container">
        <el-table
          v-loading="listLoading"
          :data="list"
          size="mini"
          element-loading-text="Loading"
          border
          highlight-current-row
          align="center"
          fit
        >
          <el-table-column
      type="selection"
      width="55">
    </el-table-column>
          <el-table-column fixed label="ID" prop="jobId" align="center"></el-table-column>
          <el-table-column label="任务名称" prop="beanName" align="center"></el-table-column>
          <el-table-column label="参数名称" prop="methodName" align="center"></el-table-column>
          <el-table-column label="参数" prop="params" align="center"></el-table-column>
          <el-table-column label="cron表达式" prop="cronExpression" align="center"></el-table-column>
          <el-table-column label="备注" prop="remark" align="center"></el-table-column>
          <!-- <el-table-column label="性别" prop="sex" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sex==0 ? '男':'女' }}</span>
            </template>
          </el-table-column>-->
          <el-table-column label="加入时间" prop="createTime" align="center"></el-table-column>
          <el-table-column label="修改时间" prop="updateTime" align="center"></el-table-column>
          <!-- <el-table-column label="头像" prop="avatar" align="center">
            <template slot-scope="scope">
              <span>
                <img :src="scope.row.avatar" alt="" style="width: 50px;height: 50px">
              </span>
            </template>
          </el-table-column>-->
          <el-table-column label="状态" prop="userStatus" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status == 1 ? 'success' : 'danger'"
                hit
              >{{ scope.row.status == 1 ? '启用' : '停用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            v-if="this.global_checkBtnPermission(['user:edit','user:delete','user:enable'])"
            :label="$t('table.actions')"
          >
            <template slot-scope="scope">
              <el-button
              v-has="'user:enable'"
                v-if="scope.row.status!=1"
                size="mini"
                type="success"
                @click="handleModifyStatus(scope.row,1)"
              >{{ $t('table.enable') }}</el-button>
              <el-button
                v-if="scope.row.status!=0"
                size="mini"
                @click="handleModifyStatus(scope.row,0)"
              >{{ $t('table.disable') }}</el-button>
              <el-button
                v-has="'user:edit'"
                size="mini"
                type="primary"
                @click="handleUpdate(scope.row)"
                icon="el-icon-edit"
                plain
              >{{ $t('table.edit') }}</el-button>
              <cus-del-btn v-has="'user:delete'" @ok="handleDelete(scope.row)" />
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
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="任务名称:" prop="beanName">
            <!--            <el-input v-model="form.username" :disabled="dialogStatus!='create'"></el-input>-->
            <el-input v-model="form.beanName" ></el-input>
          </el-form-item>
          <el-form-item label="参数名称:" prop="methodName">
            <el-input v-model="form.methodName" ></el-input>
          </el-form-item>
          <el-form-item label="参数:" prop="params">
            <el-input v-model="form.params" ></el-input>
          </el-form-item>
          <el-form-item label="cron表达式:" prop="cronExpression">
            <el-input v-model="form.cronExpression" ></el-input>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="form.remark" ></el-input>
          </el-form-item>
          <el-form-item label="任务状态:" prop="status">
            <el-select
              v-model="form.status"
              class="filter-item"
              placeholder="请选择"
              style="width: 280px;"
            >
              <el-option
                v-for="item in flagList"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="性别:" prop="sex">
            <el-select v-model="form.sex" class="filter-item" placeholder='请选择' style="width: 280px;">
              <el-option v-for="item in sexList" :key="item.key" :label="item.display_name"
                         :value="item.key"></el-option>
            </el-select>
          </el-form-item>-->
          <!-- <el-form-item label="手机号码:" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="头像:" prop="avatar">
            <span>
              <img :src="form.avatar" alt="" style="width: 50px;height: 50px">
            </span>
          </el-form-item>-->
<!--          <el-form-item label="用户状态:" prop="userStatus">-->
<!--            <el-select-->
<!--              v-model="form.userStatus"-->
<!--              class="filter-item"-->
<!--              placeholder="请选择"-->
<!--              style="width: 280px;"-->
<!--            >-->
<!--              <el-option-->
<!--                v-for="item in flagList"-->
<!--                :key="item.key"-->
<!--                :label="item.display_name"-->
<!--                :value="item.key"-->
<!--              ></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="dialogStatus==='create'?createJob():updateJob()"
          >{{ $t('table.confirm') }}</el-button>
        </span>
      </el-dialog>
    </cus-wraper>
  </div>
</template>

<script>
import {
  getSysJob,
  addJob,
  deleteJob,
  updateSysUser,
  updateJobStatus,
  getAllListNoParam
} from "@/api/job/job";

export default {
  data() {
    return {
      active: false,
      dialogVisible: false,
      list: [],
      sexList: [
        { key: "0", display_name: "男" },
        { key: "1", display_name: "女" },
      ],
      flagList: [
        { key: 1, display_name: "启用" },
        { key: 0, display_name: "停用" },
      ],
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        beanName: undefined,
        userPhone: undefined,
        userStatus: undefined,
        createTime: undefined,
        updateTime: undefined
      },
      pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      input: "",
      form: {
        userId: undefined, //主键ID
        userName: undefined, //用户名
        userEmail: undefined, //用户邮箱
        userPhone: undefined, //用户手机
        // sex: undefined, //性别 0:男 1:女
        // phone: undefined, //手机号码
        // email: undefined, //邮箱
        // avatar: undefined, //头像
        status: undefined, //状态
        // gmtCreate: undefined, //创建时间
        // gmtModified: undefined //更新时间
        roleType: undefined // 角色名称
      },
      dialogStatus: "",
      titleMap: {
        update: "编辑",
        create: "创建",
      },
      rules: {
        beanName: [{ required: true, message: "请输入任务Bean名称", trigger: "blur" }],
        methodName: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
        params: [{ required: true, message: "请输入参数", trigger: "blur" }],
        cronExpression: [{ required: true, message: "请输入Cron表达式", trigger: "blur" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
        // pwd: [
        //   { pattern: /^(\w){6,16}$/, message: "请设置6-16位字母、数字组合" },
        // ],
        // nickName: [
        //   { required: true, message: "请输入你昵称", trigger: "blur" },
        // ],
        // flag: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
      roleList:[]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getSysJob(this.listQuery).then((response) => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    // 获取全部角色
    getRoleList(){
      getAllListNoParam().then((response) => {
        this.roleList = response.data
      });
    },
    handleCreate() {
      this.active = false
      this.getRoleList();
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogVisible = true;
    },
    createJob(){
        this.$refs.dataForm.validate(valid => {
        if (valid) {
          addJob(this.form).then(response => {
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
      this.active = true
      this.getRoleList();
      this.form = Object.assign({}, row);
      this.dialogStatus = "update";
      this.$delete(this.form, "createTime");
      this.$delete(this.form, "updateTime");
      this.dialogStatus = "update";
      this.dialogVisible = true;
    },
    updateJob() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          updateSysUser(this.form)
            .then((response) => {
              if (response.code == 20000) {
                this.getList();
                this.submitOk(response.msg);
                this.dialogVisible = false;
              } else {
                this.submitFail(response.msg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    handleModifyStatus: function (row, status) {
      updateJobStatus(row.jobId, status).then((response) => {
        if (response.code == 20000) {
         this.submitOk(response.msg);
          row.status = status;
        } else {
          this.submitFail(response.msg);
        }
      });
    },
    handleDelete(row) {
      let jobId = row.jobId;
      deleteJob(jobId).then((response) => {
        if (response.code == 20000) {
          this.getList();
          this.submitOk(response.msg);
        } else {
          this.submitFail(response.msg);
        }
      });
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
        flag: undefined, //状态
        // gmtCreate: undefined, //创建时间
        // gmtModified: undefined //更新时间
      };
    },
    // 监听dialog关闭时的处理事件
    handleDialogClose() {
      if (this.$refs["dataForm"]) {
        this.$refs["dataForm"].clearValidate(); // 清除整个表单的校验
      }
    },
  },
};
</script>
