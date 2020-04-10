<template>
  <div>
    <!--:before-close="handleClose"-->
    <el-dialog
      :title="boxParams.type === 'edit' ? '编辑货物信息': '新建货物信息'"
      :visible.sync="isVisible"
      width="60%"
      :before-close="handleClose"
      class="form-dialog"
    >

      <el-collapse accordion  v-model="activeNames">
        <el-collapse-item name="1" title="基本信息">
          <div class="form-basic-container">
            <!--<el-divider content-position="left">基本信息</el-divider>-->
            <el-form :model="form" ref="form"  label-width="150px" class="form-basic-wrapper" size="mini" :rules="rules">
              <div class="form-item">
                <el-form-item label="货物序号：" prop="creator">
                  <el-input v-model="form.creator" placeholder="请填写"></el-input>
                </el-form-item>
                <el-form-item label="货物品目：" prop="createDate">
                  <el-input v-model="form.createDate" placeholder="请填写"></el-input>
                </el-form-item>
              </div>
              <div class="form-item">
                <el-form-item label="货物名称：" prop="creator">
                  <el-input v-model="form.creator" placeholder="请填写"></el-input>
                </el-form-item>
                <el-form-item label="货物编号：" prop="createDate">
                  <el-input v-model="form.createDate" placeholder="请填写"></el-input>
                </el-form-item>
              </div>
              <div class="form-item">
                <el-form-item label="品牌：" prop="creator">
                  <el-input v-model="form.creator" placeholder="请填写"></el-input>
                </el-form-item>
                <el-form-item label="型号：" prop="createDate">
                  <el-input v-model="form.createDate" placeholder="请填写"></el-input>
                </el-form-item>
              </div>
              <div class="form-item">
                <el-form-item label="产地：" prop="resultTemplateSubject">
                  <el-input v-model="form.resultTemplateSubject"  placeholder="请填写" clearable required></el-input>
                </el-form-item>
                <el-form-item label="进口/国产类别：" prop="status">
                  <el-select v-model="form.status" placeholder="请选择" clearable required>
                    <el-option
                      v-for="item in statusData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-item">
                <el-form-item label="币种：" prop="status">
                  <el-select v-model="form.status" placeholder="请选择" clearable required>
                    <el-option
                      v-for="item in statusData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="维保率/月：" prop="resultTemplateSubject">
                  <el-input v-model="form.resultTemplateSubject"  placeholder="请填写" clearable required></el-input>
                </el-form-item>
              </div>
              <div class="form-item">
                <el-form-item label="证明文件：" prop="creator">
                  <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    multiple
                    :limit="3"
                    :on-exceed="handleExceed"
                    :file-list="fileList">
                    <el-button size="mini" type="success">点击上传</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item label="备注：" prop="createDate">
                  <el-input v-model="form.createDate" placeholder="请填写"></el-input>
                </el-form-item>
              </div>
              <el-form-item label="主要参数：" prop="desc">
                <el-input type="textarea" v-model="form.desc" placeholder="请填写"></el-input>
              </el-form-item>
              <div class="form-item">
                <el-form-item label="创建人：">
                  <p>{{form.creator}}</p>
                </el-form-item>
                <el-form-item label="创建时间：">
                  <p>{{form.createDate}}</p>
                </el-form-item>
              </div>
              <div class="form-item">
                <el-form-item label="最后维护人：">
                  <p>{{form.maintenanceMan}}</p>
                </el-form-item>
                <el-form-item label="最后维护时间：">
                  <p>{{form.maintenanceDate}}</p>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-collapse-item >
        <el-collapse-item name="2">
          <template slot="title">
            <div class="form-content-header">
              <span>配件信息</span>
            </div>
          </template>
          <div class="form-main-container">
            <div class="form-main-tool">
              <el-button class="tool-basic-btn" size="mini"  @click="handleAdd">新建</el-button>
              <el-button class="tool-export-btn" size="mini" >导出</el-button>
              <el-button class="tool-download-btn" size="mini" >下载配件导入模板</el-button>
              <el-button class="tool-import-btn" size="mini" >配件导入</el-button>
            </div>
            <el-table
              :loading="loading"
              border
              size="mini"
              :row-class-name="tableRowClassName"
              height="90%"
              :data="tableData">
              <el-table-column
                fixed
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                fixed
                label="序号"
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                prop="resultTemplateSubject"
                label="配件编号"
                width="210">
              </el-table-column>
              <el-table-column
                prop="status"
                label="设备或配件名称"
                width="120">
              </el-table-column>
              <el-table-column
                prop="status"
                label="型号/规格">
              </el-table-column>
              <el-table-column
                prop="attachId"
                label="产地/厂家"
                width="210">
              </el-table-column>
              <el-table-column
                prop="creator"
                label="主要技术参数"
                width="120">
              </el-table-column>
              <el-table-column
                prop="createDate"
                label="单位"
                width="150">
              </el-table-column>
              <el-table-column
                prop="resultTemplateSubject"
                label="数量"
                width="210">
              </el-table-column>
              <el-table-column
                prop="status"
                label="单价"
                width="120">
              </el-table-column>
              <el-table-column
                prop="status"
                label="总价">
              </el-table-column>
              <el-table-column
                prop="attachId"
                label="备注"
                width="210">
              </el-table-column>
              <el-table-column label="操作"  width="150" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    class="table-basic-btn"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-paging">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageInfo.currentPage"
                :page-sizes="GLOBAL.pageSizes"
                :page-size="pageInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageInfo.total">
              </el-pagination>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <!--<el-button type="primary" @click="submit">提交</el-button>-->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')" size="mini">提交审核</el-button>
        <el-button type="primary" @click="submitForm('form')" size="mini">保存</el-button>
        <el-button @click="resetForm ('form')" size="mini">重置</el-button>
        <el-button type="info" @click="closeBox" size="mini">关闭</el-button>
      </div>

    </el-dialog>
    <accessories-modify :dialogVisible="accessoriesDialogVisible" :boxParams="accessoriesBoxParams" @hideDialog="hideDialog" @fetchList="fetchList"/>
  </div>
</template>

<script>
import accessoriesModify from './accessories-modify-box'
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
    accessoriesModify
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
      },
      accessoriesDialogVisible: false,
      accessoriesBoxParams: {}
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
      this.accessoriesBoxParams = { type: 'add', data: {} }
      this.accessoriesDialogVisible = true
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
    },
    fetchList () {

    },
    hideDialog () {
      this.accessoriesDialogVisible = false
    }

  }
}
</script>

<style lang="scss">
  .form-main-tool{
    padding-bottom: 8px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
