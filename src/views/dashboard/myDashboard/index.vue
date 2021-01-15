<template>
  <div class="dashboard-editor-container" style="padding: 20px;background: #f2f2f2;">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>项目介绍</h3>
        <el-row :gutter="12">
          <el-col :span="8">
            <el-card shadow="always">
              <el-tag>总的用户数</el-tag>
              {{userCount}}人
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <el-tag type="success">在线人数数量</el-tag>
              {{activeUserCount}}人
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="never">
              从不显示
            </el-card>
          </el-col>
        </el-row>
      </div>
      <!--      <h3>技术</h3>-->
      <!--      <ol>-->
      <!--        <li> 开发语言：Java</li>-->
      <!--        <li> 数据库：Mysql</li>-->
      <!--        <li> 前端框架：Vue + Axios</li>-->
      <!--        <li> 后端框架：Spring Boot</li>-->
      <!--        <li> 权限：Spring Security</li>-->
      <!--      </ol>-->
      <!--      <div class="text-right">-->
      <!--        <el-button type="primary" @click.native="jumpUrl('code-xiaoxiaosu')">项目地址</el-button>-->
      <!--        <el-button type="success" @click.native="jumpUrl('code-demo')">案例地址</el-button>-->
      <!--&lt;!&ndash;        <el-button type="warning" @click.native="jumpUrl('demo')">demo演示环境</el-button>&ndash;&gt;-->
      <!--      </div>-->
    </el-card>

  </div>
</template>

<script>
  import Vue from 'vue'
  import LightTimeline from 'vue-light-timeline'

  Vue.use(LightTimeline)

  import { getServerInfo } from '@/api/dashboard'
  import TransactionTable from '../admin/components/TransactionTable'
  import { mapGetters } from 'vuex'
  import PanThumb from '@/components/PanThumb'
  import { getAllUserCount,getActiveUserCount } from '@/api/dashboard'

  export default {
    name: 'DashboardEditor',
    components: { PanThumb, TransactionTable },
    data() {
      return {
        activeNum: Math.round(Math.random() * 10000),
        faceNum: Math.round(Math.random() * 10000),
        userCount: 100,
        activeUserCount:100
      }
    },
    created() {
      this.getAllUserCount();
      this.getActiveUserCount();
    },
    methods: {
      jumpUrl(type) {
        switch (type) {
          case 'home':
            window.open('https://gitee.com/zhengqingya/java-workspace')
            break
          case 'code-xiaoxiaosu':
            window.open('https://gitee.com/zhengqingya/xiao-xiao-su')
            break
          case 'code-demo':
            window.open('https://gitee.com/zhengqingya/java-workspace')
            break
          case 'demo':
            window.open('https://gitee.com/zhengqingya/java-workspace')
            break
        }
      },

      // 获取总的用户数
      getAllUserCount() {
        getAllUserCount().then(response => {
          this.userCount = response.data
        })
      },

      // 获取在线人数
      getActiveUserCount(){
        getActiveUserCount().then(response => {
          this.activeUserCount = response.data
        })
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'roles',
        'introduction'
      ])
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    background-color: #e3e3e3;
    /*min-height: 100vh;*/
    padding: 50px 60px 0px;
  }
</style>
