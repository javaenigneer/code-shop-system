<template>
  <el-form ref="form" :model="form" label-width="120px" :rules="rules">
    <el-form-item label="商户昵称" prop="nickName">
      <el-input v-model="form.nickName" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="商户手机号" prop="phone">
      <el-input v-model="form.phone" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="商户密码" prop="password">
      <el-input v-model="form.password" style="width: 300px"></el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="code">
      <el-input v-model="form.code" style="width: 300px"></el-input>
      <el-button type="primary" @click="sendSms">发送验证码</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addMerchant">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { sendSms, addMerchant } from '@/api/merchant/merchant'

  export default {
    name: 'add-merchant',
    data() {
      return {
        form: {
          nickName: '',
          phone: '',
          password: '',
          code: ''
        },
        rules: {
          nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
          phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
        }
      }
    },
    methods: {
      sendSms() {
        if (this.form.phone === '' || this.form.phone === undefined) {
          this.$message({
            type: 'info',
            message: '请输入手机号'
          })
          return
        }
        sendSms(this.form.phone).then((response => {
          if (response.code === 20000) {
            this.$message({
              type: 'success',
              message: response.msg
            });
          }else {
            this.$message({
              type: 'error',
              message: response.msg
            });
          }
        }))
      },
      addMerchant(){
        this.$refs.form.validate(valid => {
          if (valid){
            addMerchant(this.form).then((response => {
              if (response.code === 20000){
                this.$message({
                  type: 'success',
                  message: response.msg
                });
                this.$router.push({path:'/systemMerchant/merchant'})
              }else {
                this.$message({
                  type: 'error',
                  message: response.msg
                });
              }
            }))
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
