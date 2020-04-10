<template>
  <div>
    <!--:before-close="handleClose"-->
    <el-dialog
      :title="boxParams.type === 'edit' ? '编辑配件信息': '新建配件信息'"
      :visible.sync="isVisible"
      width="60%"
      :before-close="handleClose"
      class="form-dialog"
    >

      <div class="form-basic-container">
        <!--<el-divider content-position="left">基本信息</el-divider>-->
        <el-form :model="form" ref="form" label-width="140px" class="form-basic-wrapper" size="mini" :rules="rules">
          <div class="form-item">
            <el-form-item label="配件编号：" prop="resultTemplateSubject">
              <el-input v-model="form.resultTemplateSubject" placeholder="请填写" clearable required></el-input>
            </el-form-item>
            <el-form-item label="设备或配件名称：" prop="resultTemplateSubject">
              <el-input v-model="form.resultTemplateSubject" placeholder="请填写" clearable required></el-input>
            </el-form-item>
          </div>
          <div class="form-item">
            <el-form-item label="型号/规格：" prop="resultTemplateSubject">
              <el-input v-model="form.resultTemplateSubject" placeholder="请填写" clearable required></el-input>
            </el-form-item>
            <el-form-item label="产地/厂家：" prop="createDate">
              <el-input v-model="form.createDate" placeholder="请填写" clearable required></el-input>
            </el-form-item>
          </div>
          <div class="form-item">
            <el-form-item label="单位：" prop="creator">
              <el-input v-model="form.creator" placeholder="请填写" clearable required></el-input>
            </el-form-item>
            <el-form-item label="数量：" prop="createDate">
              <el-input v-model="form.createDate" placeholder="请填写" clearable required></el-input>
            </el-form-item>
          </div>
          <div class="form-item">
            <el-form-item label="单价：" prop="creator">
              <el-input v-model="form.creator" placeholder="请填写" clearable required></el-input>
            </el-form-item>
            <el-form-item label="总价：" prop="createDate">
              <el-input v-model="form.createDate" placeholder="请填写" clearable required></el-input>
            </el-form-item>
          </div>
          <el-form-item label="主要技术参数：" prop="resultTemplateSubject">
            <el-input type="textarea" v-model="form.resultTemplateSubject" placeholder="请填写" clearable required></el-input>
          </el-form-item>
            <el-form-item label="备注：" prop="createDate">
              <el-input v-model="form.createDate" placeholder="请填写" ></el-input>
            </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')" size="mini">保存</el-button>
        <el-button @click="resetForm ('form')" size="mini">重置</el-button>
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
  name: 'accessories-modify-box',
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
        desc: '',
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
      editorOption: {},
      loading: false,
      tableData: [],
      pageInfo: {
        pageSize: this.GLOBAL.pageSize,
        total: 0,
        currentPage: 1
      }
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
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
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
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'even-row'
      } else {
        return 'odd-row'
      }
    },
    formatter (row, column) {
      return row.status === 1 ? '激活' : '冻结'
    },
    formatterTime (row, column) {
      if (column.property === 'maintenanceDate') {
        return util.formatTime(row.maintenanceDate)
      } else if (column.property === 'createDate') {
        return util.formatTime(row.createDate)
      }
    },
    handleEdit (index, row) {
      this.boxParams = { type: 'edit', data: row }
      this.dialogVisible = true
    },
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        FetchResultTemplate('delete', row.resultTemplateId).then((res) => {
          this.$message({
            message: '删除成功！',
            type: 'success',
            duration: 3 * 1000
          })
          this.fetchList()
        }).catch((err) => {
          this.loading = false
          // 显示提示
          this.$message({
            message: err.message,
            type: 'error',
            duration: 5 * 1000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /**
       * 改变分页size
       */
    handleSizeChange (val) {
      this.pageInfo = {
        ...this.pageInfo,
        pageSize: val
      }
      this.fetchList()
    },
    /**
       * 改变公页当前页
       */
    handleCurrentChange (val) {
      this.pageInfo = {
        ...this.pageInfo,
        currentPage: val
      }
      this.fetchList()
    },
    handleAdd () {
      this.boxParams = { type: 'add', data: {} }
      this.dialogVisible = true
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
