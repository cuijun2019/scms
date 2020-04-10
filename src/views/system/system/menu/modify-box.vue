<template>
  <div>
    <!--:before-close="handleClose"-->
    <el-dialog
      :title="boxParams.type === 'edit' ? '编辑菜单': '添加菜单'"
      :visible.sync="isVisible"
      width="40%"
      :before-close="handleClose"
      class="form-dialog"
    >

      <div class="form-basic-container">
        <!--<el-divider content-position="left">基本信息</el-divider>-->
        <el-form :model="form" ref="form"  label-position="left" label-width="80px" class="form-basic-wrapper" size="small" :rules="rules">
          <el-form-item label="父级菜单" prop="resultTemplateSubject">
            <el-select v-model="form.resultTemplateSubject" placeholder="请选择,不填默认为一级菜单" clearable>
              <el-option
                v-for="item in statusData"
                :key="item.id"
                :label="item.title"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
            <el-form-item label="菜单名称" prop="resultTemplateSubject">
              <el-select v-model="form.resultTemplateSubject" placeholder="请选择" clearable required>
                <el-option
                  v-for="item in statusData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          <el-form-item label="菜单别名" prop="resultTemplateSubject">
            <el-input v-model="form.resultTemplateSubject" autocomplete="off" clearable ></el-input>
          </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="form.createDate" readonly></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="form.resultTemplateSubject" placeholder="请选择" clearable required>
                <el-option
                  v-for="item in statusData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm ('form')" size="mini">重置</el-button>
        <el-button type="primary" @click="submitForm('form')" size="mini">保存</el-button>
        <el-button type="info" @click="closeBox" size="mini">关闭</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'
import {
  FetchResultTemplate,
  uploadResultTemplate
} from '@/api/sys.template.purchase'// api
import util from '@/libs/util'

let menuData = [
  {
    id: 1,
    type: 'father',
    title: '系统管理',
    icon: 'asterisk',
    path: '/system',
    status: 1,
    description: '',
    creator: 'admin',
    createDate: '2020-03-18T08:04:10.000+0000'
  },
  {
    id: 11,
    type: 'child',
    title: '用户管理',
    icon: 'asterisk',
    path: '/system/user',
    status: 1,
    description: '',
    creator: 'admin',
    createDate: '2020-03-18T08:04:10.000+0000'
  }, {
    id: 12,
    type: 'child',
    title: '角色管理',
    icon: 'asterisk',
    path: '/system/role',
    status: 1,
    description: '',
    creator: 'admin',
    createDate: '2020-03-18T08:04:10.000+0000'
  }, {
    id: 13,
    type: 'child',
    title: '菜单管理',
    icon: 'asterisk',
    path: '/system/menu',
    status: 1,
    description: '',
    creator: 'admin',
    createDate: '2020-03-18T08:04:10.000+0000'
  }, {
    id: 3,
    type: 'father',
    title: '模板管理',
    icon: 'asterisk',
    path: '/template',
    status: 1,
    description: '',
    creator: 'admin',
    createDate: '2020-03-18T08:04:10.000+0000'
  }, {
    id: 31,
    type: 'child',
    title: '采购结果通知书模板',
    icon: 'asterisk',
    path: '/template/purchase',
    status: 1,
    description: '',
    creator: 'admin',
    createDate: '2020-03-18T08:04:10.000+0000'
  }, {
    id: 32,
    type: 'child',
    title: '中标通知书模板',
    icon: 'asterisk',
    path: '/template/bids',
    status: 1,
    description: '',
    creator: 'admin',
    createDate: '2020-03-18T08:04:10.000+0000'
  }, {
    id: 33,
    type: 'child',
    title: '合同模板',
    icon: 'asterisk',
    path: '/template/contract',
    status: 1,
    description: '',
    creator: 'admin',
    createDate: '2020-03-18T08:04:10.000+0000'
  }
]
let fatherMenu = []
let childMenu = []
menuData.forEach(item => {
  if (item.type === 'father') {
    fatherMenu.push(item)
  } else if (item.type === 'child') {
    childMenu.push(item)
  }
})

export default {
  name: 'modify-box',
  components: {
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    boxParams: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      name: '',
      filename: '',
      isVisible: false,
      fatherMenu: fatherMenu,
      childMenu: childMenu,
      statusData: [
        {
          label: '激活',
          value: 1
        },
        {
          label: '冻结',
          value: 2
        }
      ],
      form: {
        resultTemplateSubject: '',
        status: '',
        creator: '',
        maintenanceMan: '',
        createDate: dayjs().format('YYYY-M-D HH:mm:ss'),
        maintenanceDate: dayjs().format('YYYY-M-D HH:mm:ss')
      },
      // 校验
      rules: {
        resultTemplateSubject: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      fileList: [],
      file: '',
      fileUrl: '',
      attachId: '',
      editorOption: {}
    }
  },
  created () {
  },
  filters: {},
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  watch: {
    dialogVisible: {
      immediate: true, // 这句重要
      handler (val) {
        this.isVisible = val
      }

    },
    boxParams: {
      immediate: true, // 这句重要
      handler (val) {
        if (val) {
          if (val.type === 'edit') {
            this.fetchDetailData(val.data.resultTemplateId)
          } else {
            this.form.creator = this.info.name
            this.form.maintenanceMan = this.info.name
          }
        }
      }

    }

  },
  methods: {
    fetchDetailData (id) {
      FetchResultTemplate('get', id, true).then((res) => {
        this.form = {
          resultTemplateSubject: res.resultTemplateSubject,
          status: res.status,
          creator: res.creator,
          maintenanceMan: res.maintenanceMan,
          createDate: util.formatTime(res.createDate),
          maintenanceDate: util.formatTime(res.maintenanceDate)
        }
      }).catch((err) => {
        this.loading = false
        // 显示提示
        this.$message({
          message: err.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    handleClose (done) {
      this.$refs['form'].resetFields()
      this.fileList = []
      this.$emit('hideDialog')
    },
    handleFileChange (file) {
      this.file = file.raw
      let formData = new FormData()
      formData.append('file', this.file)
      uploadResultTemplate(formData).then((res) => {
        this.attachId = res.attachId
        // this.$message({
        //   message: '上传成功',
        //   type: ' success',
        //   duration: 3 * 1000
        // })
      }).catch((err) => {
        // 显示提示
        this.$message({
          message: err.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    handleRemove (file, fileList) {
      this.file = ''
    },
    submitForm (formName) {
      if (!this.form.resultTemplateSubject) {
        this.$message({
          message: '请填写采购结果通知书主题!',
          type: 'warning',
          duration: 3 * 1000
        })
        return
      }
      if (!this.form.status) {
        this.$message({
          message: '请选择状态!',
          type: 'warning',
          duration: 3 * 1000
        })
        return
      }
      if (!this.attachId) {
        this.$message({
          message: '请先上传模板文件!',
          type: 'warning',
          duration: 3 * 1000
        })
        return
      }
      let params = {
        resultTemplateSubject: this.form.resultTemplateSubject,
        status: this.form.status,
        attachId: this.attachId
      }
      if (this.boxParams.type === 'add') {
        FetchResultTemplate('post', params).then((res) => {
          this.$message({
            message: '新建采购结果通知书成功！',
            type: ' success',
            duration: 3 * 1000
          })
          this.resetForm('form')
          this.$emit('hideDialog')
          this.$emit('fetchList')
        }).catch((err) => {
          // 显示提示
          this.$message({
            message: err.message,
            type: 'error',
            duration: 5 * 1000
          })
        })
      } else if (this.boxParams.type === 'edit') {
        params.id = this.boxParams.data.resultTemplateId
        FetchResultTemplate('put', params).then((res) => {
          this.$message({
            message: '修改采购结果通知书成功！',
            type: ' success',
            duration: 3 * 1000
          })
          this.resetForm('form')
          this.$emit('hideDialog')
          this.$emit('fetchList')
        }).catch((err) => {
          // 显示提示
          this.$message({
            message: err.message,
            type: 'error',
            duration: 5 * 1000
          })
        })
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.fileList = []
    },
    closeBox () {
      this.resetForm('form')
      this.$emit('hideDialog')
    }

  }
}
</script>

<style lang="scss">

</style>
