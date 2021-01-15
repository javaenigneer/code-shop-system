<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-input v-model="listQuery.url" placeholder="请输入请求地址" style="width:150px" clearable></el-input>
        <el-select
          v-model="listQuery.method"
          class="filter-item"
          placeholder="请求方式"
          clearable
          style="width: 280px;"
        >
          <el-option
            v-for="item in methodList"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="getList" icon="el-icon-search">查询</el-button>
      </cus-filter-wraper>
      <div class="table-container">
        <el-table
          v-loading="listLoading"
          :data="list"
          size="mini"
          element-loading-text="Loading"
          highlight-current-row
          border
          align="center"
          fit
        >
          <el-table-column
            width="55">
          </el-table-column>
          <el-table-column label="请求地址" prop="url" align="center"></el-table-column>
          <el-table-column label="请求方式" prop="method" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.method === 'POST'">
                POST
              </el-tag>
              <el-tag type="warning"v-else>GET
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="请求状态" prop="status" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 200" type="success">
                200
              </el-tag>
              <el-tag type="danger" v-if="scope.row.status === 500">500
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="请求耗时" prop="timeTaken" align="center">

            <template slot-scope="scope">
              <el-tag v-if="scope.row.timeTaken <= 500" type="success">
                {{scope.row.timeTaken}}ms
              </el-tag>
              <el-tag type="warning" v-if=" 500 < (scope.row.timeTaken - 0) && (scope.row.timeTaken) < 1000">
                {{scope.row.timeTaken}}ms
              </el-tag>
              <el-tag type="danger" v-if="scope.row.timeTaken >= 1000">
                {{scope.row.timeTaken}}ms
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="请求时间" prop="requestTime" align="center"></el-table-column>
        </el-table>
      </div>
    </cus-wraper>
  </div>
</template>

<script>
  import {
    getHttpTrace
  } from '@/api/monitor/http'

  export default {
    data() {
      return {
        list: [],
        methodList: [
          { key: 'post', display_name: 'POST' },
          { key: 'get', display_name: 'GET' }
        ],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 100,
          url: undefined,
          method: undefined
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getHttpTrace(this.listQuery).then((response) => {
          this.list = response.data
          this.listLoading = false
        })
      },
    }
  }
</script>
