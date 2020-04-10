<!--suppress ALL -->
<template>
  <d2-container class="page">
    <div class="container">
      <div class="form-content">
        <div class="custom-header">
          <i class="line-icon"></i>
          <span class="header-title">修改密码</span>
        </div>
        <div class="form-wrapper">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm" size="small">
            <el-form-item label="原密码：" prop="name" class="supplier-item">
              <el-input v-model="ruleForm.name"  class="supplier-input"  placeholder="原来的密码"></el-input>
              <span>位数不少于6位！</span>
            </el-form-item>
            <el-form-item label="新密码：" prop="name" class="supplier-item">
              <el-input v-model="ruleForm.name" type="password" class="supplier-input" placeholder="新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="name" class="supplier-item">
              <el-input v-model="ruleForm.name" type="password" class="supplier-input" placeholder="确认密码"></el-input>
            </el-form-item>
            <el-form-item class="form-btn">
              <el-button type="primary" @click="submitForm('ruleForm')" size="small">保存并提交</el-button>
              <el-button @click="resetForm('ruleForm')" size="small" class="reset-btn">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </d2-container>
</template>

<script>
  import modifyBox from './modify-box'
  import {
    FetchResultTemplate
  } from '@/api/sys.template.purchase'//api
  import util from '@/libs/util'
  export default {
    name: 'supplier-reset-pwd',
    components: {
      modifyBox
    },
    data () {
      return {
        filename: __filename,
        activeNames: ['1'],
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        },
        fileList: [
          {
            name: '厂家授权函.jpg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          },
          {
            name: '厂家授权函.jpg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          }, {
            name: '厂家授权函.jpg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          }]
      }
    },
    created () {
      this.fetchList()
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
  }
</script>

<style lang="scss" scoped>
  .supplier-item{
    .el-form-item__content{
      /*display: flex !important;*/
      span{
        color: #999999;
        padding-left: 8px;
        font-size: 12px;
      }
    }
  }
  .container{
    background: #fff;
    height: 100%;
  }
  .form-wrapper{
    padding: 15px;
    margin-top: 150px;
    margin-left: 180px;
    .el-upload__tip{
      display: inline-block;
      padding-left: 15px;
      color: #999999;
    }
  }
  .supplier-input{
    width: 412px;
  }
  .supplier-textarea{
    width: 740px;
  }
  .form-btn{
    padding-top: 15px;
  }
</style>
