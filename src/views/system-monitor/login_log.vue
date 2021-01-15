<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-input v-model="listQuery.loginLogName" placeholder="请输入登录名" style="width:200px" clearable></el-input>
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
          <el-table-column label="ID" prop="loginLogId" align="center"></el-table-column>
          <el-table-column label="登录名" prop="loginLogName" align="center"></el-table-column>
          <el-table-column label="登录IP" prop="loginLogIp" align="center"></el-table-column>
          <el-table-column label="登录浏览器" prop="loginLogBrowser" align="center"></el-table-column>
          <el-table-column label="登录地点" prop="loginLogLocation" align="center"></el-table-column>
          <el-table-column label="登录系统" prop="loginLogSystem" align="center"></el-table-column>
          <el-table-column label="登录时间" prop="loginLogTime" align="center"></el-table-column>

         <el-table-column align="center" label="操作">
           <template slot-scope="scope">
             <cus-del-btn @ok="handleDelete(scope.row)" v-has="'login-log:delete'"></cus-del-btn>
           </template>
         </el-table-column>
        </el-table>
        <!-- 分页 -->
        <cus-pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
      </div>
    </cus-wraper>
  </div>
</template>

<script>
  import { getLoginLogPage, saveOrUpdateLog, deleteLoginLog } from '@/api/monitor/login-log'

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
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getLoginLogPage(this.listQuery).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleDelete(row) {
        let id = row.loginLogId
        deleteLoginLog(id).then(response => {
          if (response.code === 20000) {
            this.getList()
            this.submitOk(response.msg)
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
      }
    }
  }
</script>
