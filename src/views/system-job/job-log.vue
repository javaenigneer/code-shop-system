<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-input v-model="listQuery.jobBeanName" placeholder="任务Bean名称" style="width:200px" clearable></el-input>
        <el-input v-model="listQuery.jobMethodName" placeholder="任务方法" style="width:200px" clearable></el-input>
        <el-select
          v-model="listQuery.status"
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
          v-model="listQuery.startTime"
          type="datetime"
          placeholder="开始时间"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-date-picker
          v-model="listQuery.endTime"
          type="datetime"
          placeholder="结束时间"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-button type="primary" @click="getList" icon="el-icon-search" v-waves>查询</el-button>
<!--        <el-button type="primary" @click="handleCreate" icon="el-icon-plus" v-waves>添加</el-button>-->
      </cus-filter-wraper>
      <div class="table-container">

        <el-table v-loading="listLoading" :data="list" size="mini" element-loading-text="Loading" fit border highlight-current-row>
           <el-table-column
      type="selection"

      width="55">
    </el-table-column>
          <el-table-column label="ID" prop="jobLogId" align="center"></el-table-column>
          <el-table-column label="任务ID" prop="jobId" align="center"></el-table-column>
          <el-table-column label="任务Bean名称" prop="jobBeanName" align="center"></el-table-column>
          <el-table-column label="任务方法名称" prop="jobMethodName" align="center"></el-table-column>
          <el-table-column label="任务参数" prop="jobParams" align="center"></el-table-column>
          <el-table-column label="日志操作方法参数" prop="logParams" align="center">
            <el-table-column label="任务状态" prop="jobStatus" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.jobStatus == 1 ? 'success' : 'danger'"
                  hit
                >{{ scope.row.jobStatus == 1 ? '成功' : '失败' }}</el-tag>
              </template>
            </el-table-column>
<!--             <template slot-scope="scope">-->
<!--        <el-popover trigger="hover" placement="top">-->
<!--         {{ scope.row.logParams }}-->
<!--          <div slot="reference" class="name-wrapper">-->
<!--            <el-tag size="medium">{{ scope.row.name }}</el-tag>-->
<!--          </div>-->
<!--        </el-popover>-->
<!--      </template>-->
          </el-table-column>
          <el-table-column label="错误信息" prop="jobLogError" align="center">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                {{ scope.row.jobLogError }}
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.jobLogError }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="任务耗时" prop="jobLogTime" align="center"></el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.jobLogCreateTime|dateTimeFilter}}</span>
            </template>
          </el-table-column>
         <el-table-column align="center" label="操作">
           <template slot-scope="scope">
             <!-- <el-button size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit" plain v-waves>编辑</el-button> -->
             <cus-del-btn @ok="handleDelete(scope.row)"></cus-del-btn>
           </template>
         </el-table-column>
        </el-table>
        <!-- 分页 -->
        <cus-pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
      </div>

      <!-- <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogVisible" width="40%" @close="handleDialogClose">
        <el-form ref="dataForm" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="主键ID:" prop="id">
            <el-input v-model="form.id"></el-input>
          </el-form-item>
          <el-form-item label="接口名称:" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="接口地址:" prop="url">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item label="访问人IP:" prop="ip">
            <el-input v-model="form.ip"></el-input>
          </el-form-item>
          <el-form-item label="访问人ID:" prop="userId">
            <el-input v-model="form.userId"></el-input>
          </el-form-item>
          <el-form-item label="请求状态:" prop="status">
            <el-input v-model="form.status"></el-input>
          </el-form-item>
          <el-form-item label="接口执行时间:" prop="executeTime">
            <el-input v-model="form.executeTime"></el-input>
          </el-form-item>
          <el-form-item label="访问时间:" prop="gmtCreate">
            <el-input v-model="form.gmtCreate"></el-input>
          </el-form-item>
         <el-form-item label="更新时间:" prop="gmtModified">
           <el-input v-model="form.gmtModified"></el-input>
         </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" v-waves>取 消</el-button>
          <el-button type="primary" @click="submitForm" v-waves>确 定</el-button>
        </span>
      </el-dialog>  -->
    </cus-wraper>
  </div>
</template>

<script>
  import { getJobLogPage, saveOrUpdateLog, deleteLog } from '@/api/job/job-log'

  export default {
    name: 'Log',
    data() {
      return {
        dialogVisible: false,
        list: [],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          jobBeanName: undefined,
          jobMethodName: undefined,
          startTime: undefined,
          endTime: undefined
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
        flagList: [
          { key: 1, display_name: "成功" },
          { key: 0, display_name: "失败" },
        ],
        input: '',
        form: {
          id: undefined, //主键ID
          name: undefined, //接口名称
          url: undefined, //接口地址
          ip: undefined, //访问人IP
          userId: undefined, //访问人ID
          status: undefined, //1 成功 0失败
          executeTime: undefined, //接口执行时间
          gmtCreate: undefined, //创建时间
          gmtModified: undefined //更新时间
        },
        dialogStatus: '',
        titleMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getJobLogPage(this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleCreate() {
        this.resetForm()
        this.dialogStatus = 'create'
        this.dialogVisible = true
      },
      handleUpdate(row) {
        this.form = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogVisible = true
      },
      handleDelete(row) {
        let id = row.id
        deleteLog(id).then(response => {
          if (response.code === 200) {
            this.getList()
            this.submitOk(response.message)
          } else {
            this.submitFail(response.message)
          }
        })
      },
      submitForm() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            saveOrUpdateLog(this.form).then(response => {
              if (response.code === 200) {
                this.getList()
                this.submitOk(response.message)
                this.dialogVisible = false
              } else {
                this.submitFail(response.message)
              }
            }).catch(err => {
              console.log(err)
            })
          }
        })
      },
      resetForm() {
        this.form = {
          id: undefined, //主键ID
          name: undefined, //接口名称
          url: undefined, //接口地址
          ip: undefined, //访问人IP
          userId: undefined, //访问人ID
          status: undefined, //1 成功 0失败
          executeTime: undefined, //接口执行时间
          gmtCreate: undefined, //创建时间
          gmtModified: undefined //更新时间
        }
      },
      // 监听dialog关闭时的处理事件
      handleDialogClose() {
        if (this.$refs['dataForm']) {
          this.$refs['dataForm'].clearValidate() // 清除整个表单的校验
        }
      }
    }
  }
</script>
