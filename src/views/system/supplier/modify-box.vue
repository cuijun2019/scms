<template>
  <div>
    <!--:before-close="handleClose"-->
    <el-dialog
      title="供应商信息"
      :visible.sync="isVisible"
      width="60%"
      :before-close="handleClose"
      class="form-dialog"
    >

      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="供应商信息" name="1">用户管理</el-tab-pane>
        <el-tab-pane label="产品信息" name="2">配置管理</el-tab-pane>
        <el-tab-pane label="代理商信息" name="3">角色管理</el-tab-pane>
      </el-tabs>

      <!--<el-collapse accordion  v-model="activeNames">-->
        <!--<el-collapse-item name="1" title="基本信息">-->
          <!--<div class="form-basic-container">-->
            <!--&lt;!&ndash;<el-divider content-position="left">基本信息</el-divider>&ndash;&gt;-->
            <!--<el-form :model="form" ref="form" label-width="180px" class="form-basic-wrapper" size="small" :rules="rules">-->
              <!--<div class="form-item">-->
                <!--<el-form-item label="采购结果通知书模板主题" prop="resultTemplateSubject">-->
                  <!--<el-input v-model="form.resultTemplateSubject" autocomplete="off" clearable required></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="状态" prop="status">-->
                  <!--<el-select v-model="form.status" placeholder="请选择" clearable required>-->
                    <!--<el-option-->
                      <!--v-for="item in statusData"-->
                      <!--:key="item.value"-->
                      <!--:label="item.label"-->
                      <!--:value="item.value">-->
                    <!--</el-option>-->
                  <!--</el-select>-->
                <!--</el-form-item>-->
              <!--</div>-->
              <!--<div class="form-item">-->
                <!--<el-form-item label="创建人">-->
                  <!--<el-input v-model="form.creator" readonly></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="创建时间">-->
                  <!--<el-input v-model="form.createDate" readonly></el-input>-->
                <!--</el-form-item>-->
              <!--</div>-->
              <!--<div class="form-item">-->
                <!--<el-form-item label="最后维护人">-->
                  <!--<el-input v-model="form.maintenanceMan" readonly></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="最后维护时间">-->
                  <!--<el-input v-model="form.maintenanceDate" readonly></el-input>-->
                <!--</el-form-item>-->
              <!--</div>-->
            <!--</el-form>-->
          <!--</div>-->
        <!--</el-collapse-item >-->
        <!--<el-collapse-item name="2">-->
          <!--<template slot="title">-->
            <!--<div class="form-content-header">-->
              <!--<span>模板正文</span>-->
            <!--</div>-->
          <!--</template>-->
          <!--<div class="form-main-container">-->
            <!--<el-upload-->
              <!--class="upload-btn"-->
              <!--ref="upload"-->
              <!--action=""-->
              <!--:on-change="handleFileChange"-->
              <!--:on-remove="handleRemove"-->
              <!--:file-list="fileList"-->
              <!--:auto-upload="false">-->
              <!--<el-button size="mini" type="primary" >导入模板</el-button>-->
            <!--</el-upload>-->
              <!--<div class="form-main-preview">-->
                <!--<iframe src='https://view.officeapps.live.com/op/view.aspx?src=http://storage.xuetangx.com/public_assets/xuetangx/PDF/1.xls' width='100%' height='100%' sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation allow-modals" frameborder=0 scrolling=auto>-->
                <!--</iframe>-->
                <!--&lt;!&ndash;<iframe :src="'https://view.officeapps.live.com/op/view.aspx?src='+fileUrl" width='100%' height='100%' sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation allow-modals" frameborder=0 scrolling=auto>&ndash;&gt;-->
                <!--&lt;!&ndash;</iframe>&ndash;&gt;-->
              <!--</div>-->
          <!--</div>-->
        <!--</el-collapse-item>-->
      <!--</el-collapse>-->

      <!--<el-button type="primary" @click="submit">提交</el-button>-->
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
      activeName: '1',
      activeNames: ['1'],
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
    handleClick (tab, event) {
      console.log(tab, event)
    },
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
