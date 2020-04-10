<template>
  <div>
    <!--:before-close="handleClose"-->
    <!--:title="boxParams.type === 'edit' ? '编辑成交通知书模板': '新建成交通知书模板'"-->
    <el-dialog
      :visible.sync="isVisible"
      width="60%"
      :before-close="handleClose"
      class="form-dialog"
      :modal="false"
      :show-close="false"
    >
      <div slot="title" class="dialog-header">
        <div class="dialog-custom-header">
          <i class="line-icon"></i>
          <span class="header-title">{{boxParams.type === 'edit' ? '编辑成交通知书模板': '新建成交通知书模板'}}</span>
        </div>
        <div>
          <el-button class="dialog-basic-btn" @click="submitForm('form')" size="mini">保存</el-button>
          <el-button class="dialog-reset-btn" @click="resetForm ('form')" size="mini">重置</el-button>
          <el-button class="dialog-close-btn" @click="closeBox" size="mini">关闭</el-button>
        </div>
      </div>

      <el-collapse accordion  v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <div class="collapse-custom-header">
              <span class="header-title">基本信息</span>
            </div>
          </template>
          <div class="collapse-content">
            <el-form :model="form" ref="form" label-width="160px" class="basic-form" size="mini" :rules="rules">
              <div class="form-container">
                <div class="form-wrapper">
                  <el-form-item label="成交通知书模板主题：" prop="resultTemplateSubject">
                    <el-input v-model="form.bidTemplateSubject" autocomplete="off" clearable required></el-input>
                  </el-form-item>
                  <el-form-item label="创建人：">
                    <p>{{form.creator}}</p>
                  </el-form-item>
                  <el-form-item label="最后维护人：">
                    <p>{{form.maintenanceMan}}</p>
                  </el-form-item>
                </div>
                <div class="form-wrapper ">
                  <el-form-item label="状态：" prop="status">
                    <el-select v-model="form.status" placeholder="请选择" clearable required>
                      <el-option
                        v-for="item in statusData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="创建时间：">
                    <p>{{form.createDate}}</p>
                  </el-form-item>
                  <el-form-item label="最后维护时间：">
                    <p>{{form.maintenanceDate}}</p>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
        </el-collapse-item >
        <el-collapse-item name="2">
          <template slot="title">
            <div class="collapse-custom-header">
              <span class="header-title">模板正文</span>
            </div>
          </template>
          <div class="collapse-content">
            <div class="form-main-container">
            <el-upload
              class="upload-btn"
              ref="upload"
              action=""
              :on-change="handleFileChange"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false">
              <el-button size="mini" type="primary" >导入模板</el-button>
            </el-upload>
              <div class="form-main-preview">
                <!--<iframe src='https://view.officeapps.live.com/op/view.aspx?src=http://storage.xuetangx.com/public_assets/xuetangx/PDF/1.xls' width='100%' height='100%' sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation allow-modals" frameborder=0 scrolling=auto>-->
                <!--</iframe>-->
                <!--<iframe :src="'https://view.officeapps.live.com/op/view.aspx?src='+fileUrl" width='100%' height='100%' sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation allow-modals" frameborder=0 scrolling=auto>-->
                <!--</iframe>-->
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <!--<el-button type="primary" @click="submit">提交</el-button>-->
      <div slot="footer" class="dialog-footer">

      </div>

    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'
import {
  FetchBidsTemplate
} from '@/api/sys.template.bids'// api
import {
  Upload
} from '@/api/sys.global'
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
        bidTemplateSubject: '',
        status: '',
        creator: '',
        maintenanceMan: '',
        createDate: '',
        maintenanceDate: ''
      },
      // 校验
      rules: {
        bidTemplateSubject: [
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
            this.fetchDetailData(val.data.bidTemplateId)
          } else {
            this.form = {
              bidTemplateSubject: '',
              status: '',
              creator: this.info.name,
              maintenanceMan: this.info.name,
              createDate: '',
              maintenanceDate: ''
            }
          }
        }
      }

    }

  },
  methods: {
    fetchDetailData (id) {
      FetchBidsTemplate('get', id, true).then((res) => {
        this.form = {
          bidTemplateSubject: res.bidTemplateSubject,
          status: res.status,
          creator: res.creator,
          maintenanceMan: res.maintenanceMan,
          createDate: util.formatTime(res.createDate),
          maintenanceDate: util.formatTime(res.maintenanceDate)
        }
        this.attachId = res.attachment.attachId
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
      Upload(formData).then((res) => {
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
      if (!this.form.bidTemplateSubject) {
        this.$message({
          message: '请填写成交通知书主题!',
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
        bidTemplateSubject: this.form.bidTemplateSubject,
        status: this.form.status,
        attachment: {
          attachId: this.attachId
        }
      }
      if (this.boxParams.type === 'add') {
        FetchBidsTemplate('post', params).then((res) => {
          this.$message({
            message: '新建成交通知书成功！',
            type: 'success',
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
        params.id = this.boxParams.data.bidTemplateId
        FetchBidsTemplate('put', params).then((res) => {
          this.$message({
            message: '修改成交通知书成功！',
            type: 'success',
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
