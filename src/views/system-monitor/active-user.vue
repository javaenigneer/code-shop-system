<template>
  <div class="app-container">
    <cus-wraper>
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
          <el-table-column fixed label="用户名" prop="userName" align="center"></el-table-column>
          <el-table-column label="用户邮箱" prop="userEmail" align="center"></el-table-column>
          <el-table-column label="登录Ip" prop="loginIp" align="center"></el-table-column>
          <el-table-column label="登录地址" prop="loginLocation" align="center"></el-table-column>
          <el-table-column label="登录时间" prop="loginTime" align="center"></el-table-column>
          <el-table-column label="状态" prop="userStatus" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.userStatus == 1 ? 'success' : 'danger'"
                hit
              >{{ scope.row.userStatus == 1 ? '在线' : '下线' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            v-if="this.global_checkBtnPermission(['active:offline'])"
            :label="$t('table.actions')"
          >
            <template slot-scope="scope">
              <el-button
                v-has="'active:offline'"
                size="mini"
                type="primary"
                @click="handOffline(scope.row)"
                plain
              >{{ $t('table.offline') }}
              </el-button>
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
    getAllActiveUser,
    offlineUser
  } from '@/api/monitor/active-user'

  export default {
    data() {
      return {
        list: [],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getAllActiveUser(this.listQuery).then((response) => {
          this.list = response.data.data
          this.total = response.data.total
          this.listLoading = false
        })
      },
      // 剔除下线
      handOffline(row){
        this.$alert('确定要将' + row.userName + '剔除下线吗？', '警告', {
          confirmButtonText: '确定',
          callback: action => {
            offlineUser(row.userId).then(response => {
              this.getList()
              this.submitOk(response.msg)
            })
          }
        });
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
