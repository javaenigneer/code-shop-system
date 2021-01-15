<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-refresh"
        @click="getList()"
      >刷新</el-button>
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        :icon="expandAll ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
        @click="handleExpand()"
      >{{ expandAllTitle }}</el-button>
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate()"
      >{{ $t('table.add') }}</el-button>
    </div>

    <tree-table
      v-loading="listLoading"
      :data="menuTree"
      :default-expand-all="expandAll"
      :columns="columns"
      border
      default-children="children"
    >
      <template slot="type" slot-scope="{scope}">
        <span>{{ formatMenuType(scope.row) }}</span>
      </template>
      <template slot-scope="{scope}" slot="image">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.image"></el-image>
      </template>
      <template slot="operation" slot-scope="{scope}">
        <el-button
          v-show="scope.row.type == 'menu'"
          v-has="'menu:add'"
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="handleCreate(scope.row)"
          plain
        >添加下级</el-button>
        <el-button
          v-show="scope.row.type == 'button'"
          v-has="'menu:add'"
          type="primary"
          size="mini"
          icon="el-icon-view"
          @click="handleCreate(scope.row)"
          plain
        >属性列表</el-button>
        <el-button
          v-has="'menu:edit'"
          type="primary"
          size="mini"
          icon="el-icon-edit"
          @click="handleUpdate(scope.row)"
          plain
        >{{ $t('table.edit') }}</el-button>
        <cus-del-btn v-has="'menu:delete'" @ok="handleDelete(scope.row)"></cus-del-btn>
      </template>
    </tree-table>

    <el-dialog
      :title="titleMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      @close="handleDialogClose"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="tempDesc.image" prop="image">
          <el-upload
            action="http://localhost:8888/codeworld-upload/upload-image"
            class="avatar-uploader"
            :show-file-list="false"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            name="file"
            multiple>
            <img v-if="imageUrl" :src="imageUrl" class="avatar" v-model="form.image">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item
          v-show="parseInt(form.level) != 1"
          :label="tempDesc.parentName"
          prop="parentName"
        >
          <el-input v-model="form.parentName" :placeholder="'请输入' + tempDesc.parentName" disabled />
        </el-form-item>
        <el-form-item :label="tempDesc.name" prop="name">
          <el-input v-model="form.name" :placeholder="'请输入' + tempDesc.name" />
        </el-form-item>
        <el-form-item :label="tempDesc.type" prop="type">
          <el-select
            v-model="form.type"
            class="filter-item"
            :placeholder="'请选择' + tempDesc.type"
            style="width: 280px;"
            clearable
          >
            <el-option
              v-for="item in menuTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="tempDesc.sortNo" prop="sortNo">
          <el-input v-model="form.sortNo" type="number" :placeholder="'请输入' + tempDesc.sortNo" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createCategory():updateCategory()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  createCategory,
  deleteCategory,
  updateCategory,
  treeCategory,
  uploadImage
} from "@/api/goods/category";

import treeTable from "@/components/TreeTable";
import { validateCh } from "@/utils/validate";

// 常量title
const tempDesc = {
  id: "",
  parentId: "",
  name: "分类名称",
  sortNo: "排序",
  type: "类型",
  image: "分类图片",
  parentName: "上级分类",
  createTime: "创建时间",
  updateTime: "更新时间"
};
const menuTypeOptions = [
  { key: "menu", display_name: "菜单" },
  { key: "button", display_name: "按钮" },
];

export default {
  components: { treeTable },
  data() {
    const _validateCh = (rule, value, callback) => {
      if (!!value && validateCh(value)) {
        callback(new Error("不能包含中文"));
      }
      callback();
    };
    return {
      expandAll: false,
      // expandAll: true, // 是否全部展开
      expandAllTitle: "展开全部",
      tempDesc: tempDesc,
      listLoading: true,
      imageUrl:'',
      dialogVisible: false,
      disabled: false,
      columns: [
        {
          label: tempDesc.name,
          key: "name",
          width: 220,
          expand: true,
          align: "left",
          headerAlign: "center",
        },
        {
          label: tempDesc.sortNo,
          key: "sortNo",
        },
        {
          label: tempDesc.type,
          key: "type",
        },
        {
          label: tempDesc.image,
          key: "image",
        },
        {
          label: tempDesc.createTime,
          key: "createTime",
        },
        {
          label: tempDesc.updateTime,
          key: "updateTime",
        },
        {
          label: "操作",
          key: "operation",
          width: 300,
        },
      ],
      menuList: [],
      menuTree: [], // 树形菜单
      dialogFormVisible: false,
      dialogStatus: "",
      titleMap: {
        update: "编辑",
        create: "增加",
      },
      form: {
        id: undefined,
        parentId: undefined,
        image: undefined,
        name: undefined,
        level: undefined,
        sortNo: undefined,
        type: undefined,
        parentName: undefined,
      },
      menuTypeOptions,
      rules: {
        name: [
          {
            required: true,
            message: "请输入" + tempDesc.name,
            trigger: "blur",
          },
          {
            min: 1,
            max: 25,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择" + tempDesc.type,
            trigger: "blur",
          },
        ],
        sortNo: [
          {
            required: true,
            message: "请输入" + tempDesc.sortNo,
            trigger: "blur",
          },
        ],
        // image: [
        //   {
        //     required: true,
        //     message: "请上传" + tempDesc.image,
        //     trigger: "blur",
        //   },
        // ]
      },
    };
  },
  created() {
    if (
      this.global_checkBtnPermission([
        "sys:menu:add",
        "sys:menu:addsub",
        "sys:menu:edit",
        "sys:menu:delete",
      ])
    ) {
      this.columns.push({ label: "操作", key: "operation", width: 320 });
    }
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      treeCategory().then((response) => {
        this.menuList = response.data.categoryList;
        this.menuTree = response.data.categoryTree;
        this.listLoading = false;
      });
    },
    handleCreate(row) {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.imageUrl = undefined
      if (!row) {
        // 一级菜单
        this.form.level = "1"; // 默认一级菜单
        this.form.parentId = "0";
      }
      if (row) {
        // 子菜单
        this.form.level = parseInt(row.level) + 1;
        this.form.parentId = row.id;
        this.form.parentName = row.name;
      }
    },
    handleUpdate(row) {
      this.form = [];
      // this.form = Object.assign({}, row) // copy obj  此方法在这里暂时不能使用，会出错 -> 有多余参数
      this.form.id = row.id;
      this.form.parentId = row.parentId;
      this.form.name = row.name;
      this.form.type = row.type;
      this.form.sortNo = row.sortNo;
      this.imageUrl = row.image;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;

      var parentNode = this.findTreeNode(row.parentId);
      if (parentNode) {
        this.form.parentName = parentNode.name;
      }
      this.form.image = this.imageUrl
      this.form = Object.assign({}, this.form);
    },
    updateCategory() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          updateCategory(this.form).then((response) => {
            if (response.code == 20000) {
              this.getList();
              this.submitOk(response.msg);
              this.dialogFormVisible = false;
            } else {
              this.submitFail(response.msg);
            }
          });
        }
      });
    },
    createCategory() {
      this.form.parentName = undefined;
      this.form.image = this.imageUrl
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          createCategory(this.form).then((response) => {
            if (response.code == 20000) {
              this.getList();
              this.submitOk(response.msg);
              this.dialogFormVisible = false;
            } else {
              this.submitFail(response.message);
            }
          });
        }
      });
    },
    handleDelete(row) {
      deleteCategory(row.id).then((response) => {
        if (response.code == 20000) {
          this.getList();
          this.submitOk(response.msg);
        } else {
          this.submitFail(response.msg);
        }
      });
    },
    formatMenuType(row, column) {
      switch (row.type) {
        case "menu":
          return "菜单";
          break;
        case "button":
          return "按钮";
          break;
      }
    },
    findTreeNode(id) {
      var node = this._.find(this.menuList, { id: parseInt(id) });
      return node;
    },
    handleExpand() {
      this.expandAll = !this.expandAll;
      this.expandAllTitle = this.expandAll ? "折叠全部" : "展开全部";
    },
    resetForm() {
      this.form = {
        id: undefined,
        parentId: undefined,
        image: undefined,
        name: undefined,
        level: undefined,
        sortNo: undefined,
        type: undefined,
        parentName: undefined,
      };
    },
    // 监听dialog关闭时的处理事件
    handleDialogClose() {
      if (this.$refs["dataForm"]) {
        this.$refs["dataForm"].clearValidate(); // 清除整个表单的校验
      }
    },
    handleRemove(file) {
      console.log(file);
    },
    handleSuccess(response,file,fileList){
      if (response.code === 20000){
        this.submitOk(response.msg);
        this.imageUrl = response.data;
        this.form.image = response.data;
      }else {
        this.submitFail(response.msg);
      }
    }
  },
};
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
