<template>
  <div class="app-container">
    <cus-wraper>
      <cus-filter-wraper>
        <el-select
          v-model="listQuery.status"
          class="filter-item"
          placeholder="状态"
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
          v-model="listQuery.startTime"
          type="datetime"
          placeholder="开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-date-picker
          v-model="listQuery.endTime"
          type="datetime"
          placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-button type="primary" @click="getList" icon="el-icon-search">查询</el-button>
        <el-button
          v-has="'carouse:add'"
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
          <el-table-column label="标题" prop="title" align="center"></el-table-column>
          <el-table-column label="图片"  align="center">
            <template slot-scope="scope">
              <el-image
                style="width: 50px; height: 50px"
                :src="scope.row.image"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" prop="startTime" align="center"></el-table-column>
          <el-table-column label="结束时间" prop="endTime" align="center"></el-table-column>
          <el-table-column label="状态" prop="status" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status == 1"
                      type="success"
                      hit
              >已启用
              </el-tag>
              <el-tag v-if="scope.row.status == 0"
                      hit
              >未启用
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" prop="reviewStatus" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.reviewStatus == 0"
                      type="info"
                      hit
              >未审核
              </el-tag>
              <el-tag v-if="scope.row.reviewStatus == 1"
                      type="success"
                      hit
              >审核通过
              </el-tag>
              <el-tag v-if="scope.row.reviewStatus == -1"
                      type="danger"
                      hit
              >未通过
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="位置" prop="position" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.position == 1"
                      type="success"
                      hit
              >App首页
              </el-tag>
              <el-tag v-if="scope.row.position == 2"
                      type="success"
                      hit
              >店铺
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            v-if="this.global_checkBtnPermission(['review:carouse'])"
            :label="$t('table.actions')"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.reviewStatus === 0"
                size="mini"
                type="success"
                @click="review(scope.row)"
              >{{ $t('table.examine') }}
              </el-button>
<!--              <cus-del-btn v-has="'order:delete'" @ok="handleDelete(scope.row)"/>-->
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

      <el-dialog title="收货地址" :visible.sync="reviewVisible" >
        <el-form ref="form" :model="carouseDetail" label-width="80px">
          <el-form-item label="ID">
            <el-input v-model="carouseDetail.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="carouseDetail.title" disabled></el-input>
          </el-form-item>
          <el-form-item label="图片">
            <el-image :src="carouseDetail.image" fit="cover" style="width: 100px;height: 100px"></el-image>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-input v-model="carouseDetail.startTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-input v-model="carouseDetail.endTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="位置">
            <el-input v-model="carouseDetail.position == 1 ? 'App端' : '店铺'" disabled></el-input>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="carouseDetail.reviewStatus" placeholder="请选择审核状态">
              <el-option label="通过" value="1"></el-option>
              <el-option label="不通过" value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="reviewCarouse">立即审核</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </cus-wraper>
  </div>
</template>

<script>
  import {
    getPageCarouse,
    updateCarouseStatus,
    reviewCarouse
  } from '@/api/marketing/carouse'

  export default {
    data() {
      return {
        value: '',
        dialogVisible: false,
        list: [],
        flagList: [
          { key: 0, display_name: '未启用' },
          { key: 1, display_name: '已启用' }
        ],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          status: undefined,
          startTime: undefined,
          endTime: undefined
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
        dialogStatus: '',
        titleMap: {
          update: '编辑',
          create: '创建'
        },
        reviewVisible: false,
        carouseDetail:{
          id: '',
          title: '',
          image: '',
          status: '',
          startTime: '',
          endTime: '',
          reviewStatus: '',
          position: '',
          merchantNumber: ''
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getPageCarouse(this.listQuery).then((response) => {
          if (response.code === 20000) {
            this.list = response.data.data
            this.total = response.data.total
            this.listLoading = false
          } else {
            this.listLoading = false
          }
        })
      },
      handleCreate(){
        this.$router.push({path:'/systemMarketing/add-carouse'})
      },
      handleModifyStatus: function(row, status) {
        let carouse  = {}
        carouse.id = row.id
        carouse.status = status
        updateCarouseStatus(carouse).then((response) => {
          if (response.code == 20000) {
            this.submitOk(response.msg)
            row.saleAble = status
          } else {
            this.submitFail(response.msg)
          }
        })
      },
      review(row){
        this.reviewVisible = true
        this.carouseDetail = row
        this.carouseDetail.reviewStatus = ''
      },
      reviewCarouse(){
        reviewCarouse(this.carouseDetail).then((response => {

        }))
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
