<template>
  <div>
    <!--:before-close="handleClose"-->
    <!--:title="boxParams.type === 'edit' ? '编辑代理商信息': '新建代理商信息'"-->
    <el-dialog
      :visible.sync="isVisible"
      width="50%"
      :before-close="handleClose"
      class="form-dialog"
      :modal="false"
      :show-close="false"
    >
      <div slot="title" class="dialog-header">
        <div class="dialog-custom-header">
          <i class="line-icon"></i>
          <span class="header-title">{{boxParams.type === 'edit' ? '编辑代理商信息': '新建代理商信息'}}</span>
        </div>
        <div>
          <el-button class="dialog-basic-btn" v-show="hasReview"  @click="submitForm('form',1)" >提交审核</el-button>
          <el-button class="dialog-basic-btn" @click="submitForm('form',2)" >保存</el-button>
          <!--<el-button class="dialog-reset-btn" @click="resetForm ('form')">重置</el-button>-->
          <el-button class="dialog-close-btn" @click="closeBox">关闭</el-button>
        </div>
      </div>

      <div class="form-basic-container">
        <!--<el-divider content-position="left">基本信息</el-divider>-->
        <el-form :model="form" ref="form" label-width="170px" class="form-basic-wrapper" size="mini" :rules="rules">
            <el-form-item label="代理商名称：" prop="agentName">
              <el-select class="form-select" v-model="form.agentName" filterable placeholder="请选择代理商名称,或输入关键字查询。"  clearable required :disabled=isDisabled>
                <el-option
                  v-for="item in agentData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <span style="color: red;font-size: 12px">注：系统上选不到的代理商，请先完成注册流程。</span>
            </el-form-item>
          <el-form-item label="理费扣点（百分比）：" prop="agentPoint">
            <el-input v-model="form.agentPoint" clearable required :disabled=isDisabled></el-input>
          </el-form-item>
            <el-form-item label="状态：" prop="status">
              <el-select v-model="form.status" placeholder="请选择" class="form-select" clearable required>
                <el-option
                  v-for="item in statusData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="厂家授权函：">
              <!--<el-upload-->
                <!--class="upload-container-inline"-->
                <!--ref="upload"-->
                <!--action=""-->
                <!--:on-change="handleFileChange"-->
                <!--:on-remove="handleRemove"-->
                <!--:file-list="fileList"-->
                <!--:limit="1"-->
                <!--:auto-upload="false">-->
                <!--<el-button size="mini"  type="primary" plain  style="width: 80px;">上传</el-button>-->
              <!--</el-upload>-->
              <el-image style="width: 100px; height: 100px" :src="url" fit="fill"></el-image>
            </el-form-item>
            <el-form-item label="创建人：">
              <p>{{form.creator}}</p>
            </el-form-item>
            <el-form-item label="创建时间：">
              <p>{{form.createDate}}</p>
            </el-form-item>
        </el-form>
      </div>

      <!--<el-button type="primary" @click="submit">提交</el-button>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="resetForm ('form')" size="mini">重置</el-button>-->
        <!--<el-button type="primary" @click="submitForm('form')" size="mini">保存</el-button>-->
        <!--<el-button type="info" @click="closeBox" size="mini">关闭</el-button>-->
      <!--</div>-->

    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'
import {
  FetchAgentInfo
} from '@/api/sys.agent'// api
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
    let checkPercentage = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('代理费扣点不能为空！'))
      }
      setTimeout(() => {
        let patt = new RegExp(/^\d+%$/)
        if (!patt.test(value)) {
          callback(new Error('格式不正确，格式为百分比,例如:30%'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      name: '',
      filename: '',
      isVisible: false,
      activeNames: ['1'],
      agentData: [{
        name: '测试',
        id: 1
      }, {
        name: '测试2',
        id: 2
      }],
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
        agentName: '',
        agentPoint: '',
        creator: '',
        createDate: dayjs().format('YYYY-M-D HH:mm:ss')
      },
      // 校验
      rules: {
        agentName: [
          { required: true, message: '请填写代理商名称', trigger: 'blur' }
        ],
        agentPoint: [
          { validator: checkPercentage, trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      fileList: [],
      file: '',
      fileUrl: '',
      attachId: '',
      editorOption: {},
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      hasReview: true,
      isDisabled: false
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
            this.fetchDetailData(val.data.agentId)
            if (val.data.reviewStatus === 1) {
              this.hasReview = true
            } else {
              this.hasReview = false
            }
            this.isDisabled = true
          } else {
            this.form.creator = this.info.name
            this.form.maintenanceMan = this.info.name
            this.hasReview = true
            this.isDisabled = false
          }
        }
      }

    }

  },
  methods: {
    fetchDetailData (id) {
      FetchAgentInfo('get', id, true).then((res) => {
        this.form = {
          agentName: res.agentName,
          agentPoint: res.agentPoint,
          status: res.status,
          creator: res.creator,
          createDate: util.formatTime(res.createDate)
        }
        this.attachId = res.attachment.attachId
        this.fileList = [{
          name: res.attachment.attachName,
          url: res.attachment.path
        }]
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
    submitForm (formName, type) {
      if (!this.form.agentName) {
        this.$message({
          message: '请填写代理商名称!',
          type: 'warning',
          duration: 3 * 1000
        })
        return
      }
      if (!this.form.agentPoint) {
        this.$message({
          message: '请填写理费扣点!',
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
          message: '请先上传厂家授权函!',
          type: 'warning',
          duration: 3 * 1000
        })
        return
      }
      let params = {
        agentName: this.form.agentName,
        agentPoint: this.form.agentPoint,
        status: this.form.status,
        attachment: {
          attachId: this.attachId
        }
      }
      if (this.boxParams.type === 'add') {
        FetchAgentInfo('post', params).then((res) => {
          this.$message({
            message: '新建代理商信息成功！',
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
        params.id = this.boxParams.data.agentId
        FetchAgentInfo('put', params).then((res) => {
          this.$message({
            message: '修改代理商信息成功！',
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
      if (this.boxParams.type === 'edit') {
        this.fetchDetailData(this.boxParams.data.agentId)
      } else {
        this.$refs[formName].resetFields()
        this.fileList = []
      }
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
