<template>
  <div class="app-container">
      <el-form ref="form"  :model="carouse" label-width="80px" :rules="rules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="carouse.title"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="startTime">
          <el-col :span="11">
            <el-date-picker
              type="datetime"
              placeholder="开始时间"
              v-model="carouse.startTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;">
            </el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker
              type="datetime"
              placeholder="结束时间"
              v-model="carouse.endTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="carouse.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload
            action="http://localhost:8888/codeworld-upload/upload-image"
            class="avatar-uploader"
            :show-file-list="false"
            :on-success="handleSuccess"
            name="file"
            multiple>
            <img v-if="imageUrl" :src="imageUrl" class="avatar" v-model="carouse.image">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
  </div>

</template>

<script>
  import {
    addCarouse
  } from '@/api/marketing/carouse'

  export default {
    name: 'add-carouse',
    data() {
      return {
        carouse: {
          title: '',
          status: '',
          startTime: '',
          endTime: '',
          image: undefined
        },
        imageUrl: undefined,
        rules: {
          title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
          status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
          image: [{ required: true, message: '请上传图片', trigger: 'blur' }],
          startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
          endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }]
        }
      }
    },
    methods: {
      // 立即创建
      onSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            addCarouse(this.carouse).then(response => {
              if (response.code === 20000) {
                this.submitOk(response.msg);
                this.$router.push({ path: '/systemMarketing/index-carouse' })
              } else {
                this.submitFail(response.msg)
              }
            })
          }
        })
      },
      handleSuccess(response, file, fileList) {
        if (response.code === 20000) {
          this.submitOk(response.msg);
          this.imageUrl = response.data;
          this.carouse.image = response.data;
        } else {
          this.submitFail(response.msg);
        }
      }
    }
  }
</script>

<style>

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
