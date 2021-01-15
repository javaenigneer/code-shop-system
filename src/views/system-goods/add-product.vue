<template>
  <div class="app-container">
    <el-steps :active="active" finish-status="success">
      <el-step title="商品基本信息"></el-step>
      <el-step title="商品介绍"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品参数"></el-step>
    </el-steps>
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm" v-if="active == 0">
      <el-form-item label="商品标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="categoryId">
        <el-cascader
          ref="cascaderCategory"
          v-model="form.categoryId"
          :options="categoryList"
          :props="{value:'id',label:'name',emitPath:false}"></el-cascader>
      </el-form-item>
      <el-form-item label="包装清单" prop="packingList">
        <el-input type="textarea" v-model="form.packingList"></el-input>
      </el-form-item>
      <el-form-item label="售后服务" prop="afterService">
        <el-input type="textarea" v-model="form.afterService"></el-input>
      </el-form-item>
    </el-form>
    <el-form class="demo-ruleForm" v-if="active == 1" :rules="productDetailRules" :model="productDetail"
             ref="productDetail" label-width="100px">
      <!--      <el-form-item label="商品图片">-->
      <!--        <el-upload-->
      <!--          action="http://localhost:8888/codeworld-upload/upload-image"-->
      <!--          list-type="picture-card"-->
      <!--          :on-preview="handlePictureCardPreview"-->
      <!--          :on-remove="handleRemove"-->
      <!--          :on-success="handleSuccess"-->
      <!--          name="file"-->
      <!--          multiple-->
      <!--          :limit="6">-->
      <!--          <i class="el-icon-plus"></i>-->
      <!--        </el-upload>-->
      <!--        <el-dialog :visible.sync="dialogVisible">-->
      <!--          <img width="100%" :src="dialogImageUrl" alt="">-->
      <!--        </el-dialog>-->
      <!--      </el-form-item>-->
      <el-form-item label="商品详情">
        <el-input type="textarea" v-model="productDetail.desc" prop="desc"></el-input>
      </el-form-item>
      <!--      <el-form-item v-if="active == 1">-->
      <!--        <el-button type="primary" @click="submitForm()">立即创建</el-button>-->
      <!--      </el-form-item>-->
    </el-form>

    <el-form label-width="100px" :rules="productAttributeRules"
             ref="productAttribute" :model="form"
             class="demo-ruleForm" v-if="active == 2">
      <el-form-item label="分类属性" prop="categoryId">
        <el-select v-model="input" placeholder="请选择" @change="getParamByCategoryId">
          <el-option
            v-for="item in categoryAttributeList"
            :key="item.categoryId"
            :label="item.categoryName"
            :value="item.categoryId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="param.name" v-for="(param,i) of paramsList" :key="param.id">
        <el-input type="text" v-model="genericParam.obj[i][paramIds[i]]"></el-input>
      </el-form-item>
    </el-form>

    <el-form :label-position="labelPosition" :model="form" :rules="productAttributeRules"
             ref="productAttribute" label-width="100px" class="demo-ruleForm" v-if="active == 3">
      <!--      <el-form-item label="分类属性" prop="categoryId">-->
      <!--        <el-select v-model="input" placeholder="请选择" @change="getSpecialParamByCategoryId">-->
      <!--          <el-option-->
      <!--            v-for="item in categoryAttributeList"-->
      <!--            :key="item.categoryId"-->
      <!--            :label="item.categoryName"-->
      <!--            :value="item.categoryId">-->
      <!--          </el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="商品规格">

        <el-card class="box-card" style="width: auto" v-if="specialParamList.length > 0">
          <div v-for="(specialParam,i) of specialParamList" :key="i">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">

              <el-form-item :label="specialParamList[i].name" v-if="specialParamList[i].name === '颜色'">
                <el-input v-model="formInline.color" :placeholder="specialParamList[i].name"></el-input>
              </el-form-item>
              <el-form-item :label="specialParamList[i].name" v-if="specialParamList[i].name !== '颜色'">
                <el-input v-model="formInline.spec" :placeholder="specialParamList[i].name"></el-input>
              </el-form-item>

              <el-form-item v-if="specialParamList[i].name === '颜色'">
                <el-button type="primary" @click="addColor">添加</el-button>
              </el-form-item>
              <el-form-item v-if="specialParamList[i].name !== '颜色'">
                <el-button type="primary" @click="addSpec">添加</el-button>
              </el-form-item>
            </el-form>
            <template v-if="specialParamList[i].name === '颜色'">
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="checkedColor">
                <el-checkbox v-for="color in colors" :label="color" :key="color">{{color}}</el-checkbox>
              </el-checkbox-group>
            </template>
            <template v-if="specialParamList[i].name !== '颜色'">
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="checkedSpec">
                <el-checkbox v-for="spec in specs" :label="spec" :key="spec">{{spec}}</el-checkbox>
              </el-checkbox-group>
            </template>
          </div>
          <el-button type="primary" @click="flashList">刷新列表</el-button>
        </el-card>
        <!-- 通用表格信息 -->
        <el-card class="box-card" style="width: auto" v-if="show == true">
          <template>
            <el-table
              :data="tableData"
            >
              <el-table-column
                prop="date"
                :prop="specialParamList[i].name == '颜色' ? 'color': 'spec'"
                width="100" v-for="(name,i) of specialParamList" :key="i"
                :label="specialParamList[i].name">
              </el-table-column>

              <el-table-column
                prop="price"
                label="价格"
                width="100">
                <template slot-scope="scope">
                  <el-input
                    style="width:100px"
                    v-model="scope.row.price"
                  ></el-input>
                  <!--                  <el-input placeholder="请输入内容" v-show="scope.row.show" v-model="scope.row.content"></el-input>-->
                  <!--                  <span v-show="!scope.row.show">{{scope.row.content}}</span>-->
                </template>
              </el-table-column>
              <el-table-column
                prop="stock"
                label="库存"
                width="100">
                <template slot-scope="scope">
                  <el-input
                    style="width:100px"
                    v-model="scope.row.stock"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="image"
                label="图片"
                width="200">
                <template slot-scope="scope">
                  <img v-for="(image,index) in scope.row.images" :src="image" width="40" height="40" class="head_pic"/>
                </template>
              </el-table-column>
              <!--              <el-table-column-->
              <!--                prop="address"-->
              <!--                label="库存预警值"-->
              <!--                width="100">-->
              <!--                <template slot-scope="scope">-->
              <!--                  <el-input-->
              <!--                    style="width:100px"-->
              <!--                  ></el-input>-->
              <!--                </template>-->
              <!--              </el-table-column>-->
              <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                  　
                  <el-upload
                    class="upload-demo"
                    action="http://localhost:8888/codeworld-upload/upload-image"
                    :on-success="(response,file)=>{handleSuccess(response,file,scope.row.images)}"
                    multiple
                    :limit="1">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
<!--                  <el-button-->
<!--                    @click.native.prevent="deleteRow(scope.$index, tableData)"-->
<!--                    type="text"-->
<!--                    size="small">-->
<!--                    移除-->
<!--                  </el-button>-->
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-card>
      </el-form-item>
    </el-form>

    <el-button style="margin-top: 12px;" @click="before" v-if="active >= 1">上一步</el-button>
    <el-button style="margin-top: 12px;" @click="next" v-if="active < 3">下一步</el-button>
    <el-button style="margin-top: 12px;" @click="submitForm" v-if="active == 3">提交</el-button>
  </div>
</template>
<script>
  import Tinymce from '@/components/Tinymce'
  import {
    addProduct,
    uploadImage
  } from '@/api/goods/product'
  import {
    treeCategory
  } from '@/api/goods/category'
  import {
    getParamByCategoryId,
    getSpecialParamByCategoryId
  } from '@/api/goods/param'
  import {
    getCategoryAttribute
  } from '@/api/goods/category-attribute'

  let id = 0
  // 颜色组
  const colorOptions = []
  // 规格组
  const specsOptions = []
  export default {
    components: { Tinymce },
    inject: ['getList'],
    data() {
      return {
        multipleSelection: [],
        tableData: [],
        formInline: {
          color: undefined,
          spec: undefined
        },
        checkAll: false,
        checkedColor: [],
        checkedSpec: [],
        colors: colorOptions,
        specs: specsOptions,
        isIndeterminate: true,

        // 规格表显示状态 默认false
        show: false,
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        content: '请从这里输入',
        rule: '',
        active: 0,
        input: '',
        labelPosition: 'left',
        form: {
          title: undefined, // 标题
          categoryId: undefined, // 分类Id
          packingList: undefined, // 包装清单
          afterService: undefined // 售后服务
        },
        specForm: {},
        productDetail: {
          desc: undefined
        },
        productAttribute: [],
        genericParam: {
          obj: {}
        },
        specialParam: {
          obj: {}
        },
        // 通用参数Ids
        paramIds: [],
        // 特有参数Ids
        specialParamIds: [],
        specialParamNames: [],

        categoryList: [],
        categoryAttributeList: [],
        paramsList: [],
        specialParamList: [],
        rules: {
          title: [
            { required: true, message: '请输入商品标题', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          categoryId: [
            { required: true, message: '请选择商品分类', trigger: 'change' }
          ],
          packingList: [
            {
              required: true, message: '请输入包装清单', trigger: 'change'
            }
          ],
          afterService: [
            {
              required: true, message: '请输入售后服务', trigger: 'change'
            }
          ]
        },
        productDetailRules: {
          images: [
            { required: true, message: '请上传商品图片', trigger: 'change' }
          ],
          desc: [{
            required: true, message: '请简单介绍商品', trigger: 'change'
          }]
        },
        productAttributeRules: {
          // images: [
          //   { required: true, message: '请上传商品图片', trigger: 'change' }
          // ],
          // desc: [{
          //   required: true, message: '请简单介绍商品', trigger: 'change'
          // }]
        }
      }
    },
    created() {
      this.getCategory()
      this.getCategoryAttribute()
    },
    methods: {
      next() {
        if (this.active == 0) {
          this.rule = 'form'
        }
        if (this.active == 1) {
          this.rule = 'productDetail'
        }
        if (this.active == 2) {
          this.rule = 'productAttribute'
        }
        this.$refs[this.rule].validate((valid) => {
          if (valid) {
            if (this.active++ > 3) this.active = 0
            return
          }
        })
      },
      before() {
        if (this.active-- == 0) {
          this.active = 0
        }
      },
      // 获取分类树
      getCategory() {
        treeCategory().then(response => {
          this.categoryList = this.getCategoryTree(response.data.categoryTree)
        })
      },
      // 获取分类属性
      getCategoryAttribute() {
        getCategoryAttribute().then(response => {
          this.categoryAttributeList = response.data
        })
      },
      getCategoryTree(categoryTree) {
        for (var i = 0; i < categoryTree.length; i++) {
          if (categoryTree[i].children.length < 1) {
            categoryTree[i].children = undefined
          } else {
            this.getCategoryTree(categoryTree[i].children)
          }
        }
        return categoryTree
      },
      submitForm() {
        var result = Object.assign({}, this.form, this.productDetail)
        var param = {}
        var paramObj = JSON.parse(JSON.stringify(this.genericParam.obj))
        for (var i = 0; i < paramObj.length; i++) {
          Object.assign(param, paramObj[i])
        }
        result.genericParam = JSON.stringify(param)
        var colorsArray = []
        var specArray = []
        for (let i = 0; i < this.checkedColor.length; i++) {
          colorsArray[i] = this.checkedColor[i]
        }
        for (let i = 0; i < this.checkedSpec.length; i++) {
          specArray[i] = this.checkedSpec[i]
        }
        var specialParam = {}

        var key = this.specialParamIds[0] + ''
        var colorParam = {
          [key]: colorsArray
        }
        Object.assign(specialParam, colorParam)
        key = this.specialParamIds[1] + ''
        var specParam = {
          [key]: specArray
        }
        Object.assign(specialParam, specParam)
        result.specialParam = JSON.stringify(specialParam)
        var sku = JSON.stringify(this.tableData)
        result.sku = sku
        console.log(result)
        addProduct(result).then(response => {
          if (response.code === 20000) {
            this.submitOk(response.msg)
            this.$emit('goods')
            this.getList()
          } else {
            this.submitFail(response.msg)
          }
        })
      },
      handleRemove(file) {
        console.log(file)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleDownload(file) {
        console.log(file)
      },
      handleSuccess(response, file, images) {
        console.log(images)
        if (response.code === 20000) {
          this.submitOk(response.msg)
          images.push(response.data)
        }else {
          this.submitFail(response.msg)
        }
      },
      // 根据分类Id获取该分类下的所有参数
      getParamByCategoryId(categoryId) {
        this.specialParamList = []
        getParamByCategoryId(categoryId).then(response => {
          if (response.code === 20000) {
            this.paramsList = response.data
            // 循环将id作为key
            for (let i = 0; i < this.paramsList.length; i++) {
              this.paramIds[i] = this.paramsList[i].id
              var key = this.paramsList[i].id + ''
              var param = {
                [key]: ''
              }
              this.productAttribute.push(param)
            }
            this.genericParam.obj = JSON.parse(JSON.stringify(this.productAttribute))
            // console.log(this.genericParam.obj)
            // for (let i = 0; i < this.genericParam.obj.length; i++) {
            //   var obj = this.genericParam.obj[i]
            //   console.log(obj[this.paramIds[i]])
            // }
          }
        })
        this.productAttribute = [];
        // 根据分类Id获取特有商品参数
        getSpecialParamByCategoryId(categoryId).then(response => {
          if (response.code === 20000) {
            this.specialParamList = response.data
            // 循环将id作为key
            for (let i = 0; i < this.specialParamList.length; i++) {
              this.specialParamIds[i] = this.specialParamList[i].id

              var key = this.specialParamList[i].id + ''
              var param = {
                [key]: ''
              }
              this.productAttribute.push(param)
            }
            this.specialParam.obj = JSON.parse(JSON.stringify(this.productAttribute))
          } else {
            this.$message({
              message: response.msg,
              type: 'warning'
            })
          }
        })
      },
      // 新增颜色参数
      addColor() {
        if (this.formInline.color === undefined) {
          this.$message({
            message: '警告哦，请输入颜色',
            type: 'warning'
          })
          return
        }
        if (this.checkColorExist()) {
          this.$message({
            message: '警告哦，改颜色已存在',
            type: 'warning'
          })
        } else {
          colorOptions.push(this.formInline.color)
          this.checkedColor.push(this.formInline.color)
        }
      },
      // 校验颜色是否存在
      checkColorExist() {
        for (var i = 0; i < colorOptions.length; i++) {
          if (this.formInline.color === colorOptions[i]) {
            return true
          }
        }
        return false
      },
      // 添加规格
      addSpec() {
        if (this.formInline.spec === undefined) {
          this.$message({
            message: '警告哦，请输入规格',
            type: 'warning'
          })
          return
        }
        if (this.checkSpecExist()) {
          this.$message({
            message: '警告哦，该规格已存在',
            type: 'warning'
          })
        } else {
          specsOptions.push(this.formInline.spec)
          this.checkedSpec.push(this.formInline.spec)
        }
      },
      // 校验规格是否存在
      checkSpecExist() {
        for (var i = 0; i < specsOptions.length; i++) {
          if (this.formInline.spec === specsOptions[i]) {
            return true
          }
        }
        return false
      },
      // 刷线列表
      flashList() {
        this.tableData = []
        this.show = true
        var count = 1
        var colorParamId = this.specialParamIds[0] + ''
        var specParamId = this.specialParamIds[1] + ''
        for (var i = 0; i < this.checkedColor.length; i++) {
          for (var j = 0; j < this.checkedSpec.length; j++) {
            var param = {
              [colorParamId]: this.checkedColor[i],
              [specParamId]: this.checkedSpec[j]
            }
            var array =
              {
                'price': '',
                'stock': '',
                'color': this.checkedColor[i],
                'spec': this.checkedSpec[j],
                'ownSpec': JSON.stringify(param),
                'images':[]
              }
            this.tableData.push(array)
            count++
          }
        }
      },

    }
  }
</script>
<style scoped>

</style>
<style lang="scss" scoped>
  .Tinymce_box {
    display: flex;
  }

  .editor-content {
    margin-left: 30px;
    flex-grow: 1;
    border: 2px dashed #f1f1f1;
    padding: 0 20px;
  }

  h3 {
    color: #808080;
  }

  .fileParent {
    position: relative;

    img {
      position: absolute;
      width: 60px;
      height: 39px;
      left: 0;
      top: 0;
    }
  }

  .file {
    position: absolute;
    left: 0;
    opacity: 0;
  }
</style>

