<template>
  <div class="container">
    <div class="wrapper-margin-bottom-15">
      <el-collapse v-model="goodsFormActive">
        <el-collapse-item  name="1">
          <template slot="title">
            <div class="collapse-custom-header">
              <i class="line-icon"></i>
              <span class="header-title">货物信息</span>
            </div>
          </template>
          <div class="collapse-content">
              <div class="form-con">
                <el-form :model="form" :rules="rules" ref="form" label-width="130px"  size="mini" class="project-basic-form">
                  <div class="form-container">
                    <div class="form-wrapper margin-right-65">
                      <el-form-item label="货物序号：" prop="cargoSerial">
                        <el-input v-model="form.cargoSerial"  disabled placeholder="自动生成"></el-input>
                      </el-form-item>
                      <el-form-item label="货物名称：" prop="cargoName">
                        <el-input v-model="form.cargoName" clearable required></el-input>
                      </el-form-item>
                      <el-form-item label="品牌：" prop="brand">
                        <el-input v-model="form.brand" clearable required></el-input>
                      </el-form-item>
                    </div>
                    <div class="form-wrapper margin-left-65">
                      <el-form-item label="货物品目：" prop="itemName">
                        <el-select v-model="form.itemName" ref="goodsTree" filterable :filter-method='dataFilter' @clear="handleClear" placeholder="请选择" clearable required>
                          <el-option
                            :value="brandData"
                            style="height: auto;padding: 0">
                            <el-tree
                              :filter-node-method="filterNode"
                              class="only-child-tree"
                              :check-strictly="true"
                              :data="treeData"
                              show-checkbox
                              node-key="brandItemId"
                              ref="tree"
                              highlight-current
                              :props="defaultProps"
                              :render-content="renderContent"
                              @check-change="handleCheckChange">
                            </el-tree>
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="货物编号：" prop="cargoCode">
                        <el-input v-model="form.cargoCode" disabled placeholder="自动生成"></el-input>
                      </el-form-item>
                      <el-form-item label="型号：" prop="model">
                        <el-input v-model="form.model" clearable required></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div>
                    <el-form-item label="主要参数" prop="mainParams">
                      <el-input  type="textarea" v-model="form.mainParams" clearable required></el-input>
                    </el-form-item>
                  </div>
                  <div class="form-container">
                    <div class="form-wrapper margin-right-65">
                      <el-form-item label="产地：" prop="manufactor">
                        <el-input v-model="form.manufactor" clearable required></el-input>
                      </el-form-item>
                      <el-form-item label="币种：" prop="currency">
                        <el-select v-model="form.currency" placeholder="请选择币种" clearable required>
                          <el-option
                            v-for="(item, index) in currencyData"
                            :key="index"
                            :label="item.name"
                            :value="item.name">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="form-wrapper margin-left-65">
                      <el-form-item label="进口/国产类别：" prop="type">
                        <el-select v-model="form.type" placeholder="请选择进口/国产类别" clearable required>
                          <el-option label="进口" value="进口"></el-option>
                          <el-option label="国产" value="国产"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="维保率/月：" prop="guaranteeRate">
                        <el-input v-model="form.guaranteeRate" clearable required></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div>
                    <el-form-item label="证明文件：" prop="delivery">
                      <!--<el-input v-model="form.name" ></el-input>-->
                      <el-upload
                        class="upload-container-inline"
                        ref="upload"
                        action=""
                        :on-change="handleFileChange"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :limit="1"
                        :auto-upload="false">
                        <el-button size="mini"  type="primary" plain  style="width: 80px;">上传</el-button>
                      </el-upload>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="备注：" prop="remark">
                      <el-input type="textarea"   v-model="form.remark" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div class="form-container">
                    <div class="form-wrapper margin-right-65">
                      <el-form-item label="创建人：" prop="creator">
                        <p>{{form.creator}}</p>
                      </el-form-item>
                      <el-form-item label="最后维护人：" prop="maintenanceMan">
                        <p>{{form.maintenanceMan}}</p>
                      </el-form-item>
                    </div>
                    <div class="form-wrapper margin-left-65">
                      <el-form-item label="创建时间：" prop="createDate">
                        <p>{{form.createDate}}</p>
                      </el-form-item>
                      <el-form-item label="最后维护时间：" prop="maintenanceDate">
                        <p>{{form.maintenanceDate}}</p>
                      </el-form-item>
                    </div>
                  </div>
                </el-form>
              </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
     <div>
       <div class="table-container">
         <div class="table-tool">
           <div class="table-tool-title">
             <i class="list-icon"></i>
             <span class="list-title">配置信息</span>
           </div>
           <div class="table-tool-btn">
             <el-button class="tool-basic-btn" size="mini" @click="handleAdd">新增</el-button>
             <el-button size="mini" class="tool-edit-btn" @click="handleEdit">查看/编辑</el-button>
             <el-button size="mini" class="tool-delete-btn" @click="handleDelete">删除</el-button>
             <el-button class="tool-download-btn" size="mini" @click="handleDownloadTemplate">下载导入模板</el-button>
             <div class="upload-div">
               <input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" class="upload-input"  ref="importFile" @change="handleUpload">
               <el-button class="tool-import-btn upload-btn" size="mini">导入</el-button>
             </div>
           </div>
         </div>
         <div class="table-wrapper">
           <el-table
             :loading="partLoading"
             border
             size="mini"
             :row-class-name="tableRowClassName"
             height="260"
             :data="listParams.type ===1 ? partTableData.slice((pageInfo.currentPage-1)*pageInfo.pageSize,pageInfo.currentPage*pageInfo.pageSize): partTableData"
             @selection-change="handleSelectionChange">
             <el-table-column
               fixed
               label="序号"
               type="index"
               align="center"
               width="50"
               :index="indexMethod">
             </el-table-column>
             <el-table-column
               fixed
               type="selection"
               align="center"
               width="55">
             </el-table-column>
             <el-table-column
               prop="partCode"
               label="配件编号"
               width="210"
               align="center">
             </el-table-column>
             <el-table-column
               prop="partName"
               label="设备或配件名称"
               width="120"
               align="center">
             </el-table-column>
             <el-table-column
               prop="standards"
               label="型号/规格"
               width="120"
               align="center">
             </el-table-column>
             <el-table-column
               prop="manufactor"
               label="产地/厂家"
               width="120"
               align="center">
             </el-table-column>
             <el-table-column
               label="主要技术参数"
               width="180"
               align="center">
               <template slot-scope="scope">
                 <el-popover trigger="hover" placement="top">
                   <p> {{ scope.row.techParams }}</p>
                   <div slot="reference" class="name-wrapper">
                     <el-tag size="medium">查看详情</el-tag>
                   </div>
                 </el-popover>
               </template>
             </el-table-column>
             <el-table-column
               prop="unit"
               label="单位"
               width="120"
               align="center">
             </el-table-column>
             <el-table-column
               prop="quantity"
               label="数量"
               width="120"
               align="center">
             </el-table-column>
             <el-table-column
               prop="price"
               label="单价"
               width="120"
               align="center">
             </el-table-column>
             <el-table-column
               prop="remark"
               label="备注"
               width="120"
               align="center">
             </el-table-column>
             <el-table-column
               prop="status"
               label="总价"
               width="120"
               align="center">
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
               :total="listParams.type === 1 ? partTableData.length : pageInfo.total ">
             </el-pagination>
           </div>
         </div>
         <div class="form-tool">
           <el-button class="form-submit-btn btn-width-90" v-if="listParams.type === 1">提交审核</el-button>
           <el-button class="form-submit-btn btn-width-90" v-if="listParams.type === 1" @click="handleSaveGoods('form')">保存</el-button>
           <el-button class="form-close-btn btn-width-90" @click="handleClose">关闭</el-button>
         </div>
       </div>
     </div>
    <el-dialog
      title=""
      :visible.sync="isVisible"
      width="65%"
      class="form-dialog"
      :modal="false"
      :show-close="false"
    >
      <div slot="title" class="dialog-header">
        <div class="dialog-custom-header">
          <i class="line-icon"></i>
          <span class="header-title">配件信息</span>
        </div>
        <div>
          <el-button class="dialog-basic-btn" @click="handleSavePartForm('partForm')">保存</el-button>
          <el-button class="dialog-reset-btn" @click="resetForm('partForm')">重置</el-button>
          <el-button class="dialog-close-btn" @click="isVisible = false">关闭</el-button>
        </div>
      </div>
      <div class="form-con">
        <el-form :model="formPart" :rules="rulesPart" ref="partForm" label-width="135px"  size="mini" class="basic-form">
          <div class="form-container">
            <div class="form-wrapper margin-right-65">
              <el-form-item label="配件编号：" prop="partCode">
                <el-input v-model="formPart.partCode" disabled></el-input>
              </el-form-item>
              <el-form-item label="型号/规格：" prop="standards">
                <el-input v-model="formPart.standards"  clearable required></el-input>
              </el-form-item>
            </div>
            <div class="form-wrapper margin-left-65">
              <el-form-item label="设备或配件名称：" prop="partName">
                <el-input v-model="formPart.partName" clearable required></el-input>
              </el-form-item>
              <el-form-item label="产地/厂家：" prop="manufactor">
                <el-input v-model="formPart.manufactor"  clearable required></el-input>
              </el-form-item>
            </div>
          </div>
          <div>
            <el-form-item label="主要技术参数" prop="techParams">
              <el-input  type="textarea" v-model="formPart.techParams"  clearable required></el-input>
            </el-form-item>
          </div>
          <div class="form-container">
            <div class="form-wrapper margin-right-65">
              <el-form-item label="单位：" prop="unit">
                <el-input v-model="formPart.unit"  clearable required></el-input>
              </el-form-item>
              <el-form-item label="单价：" prop="price">
                <el-input v-model="formPart.price"  clearable required></el-input>
              </el-form-item>
              <el-form-item label="备注：" prop="remark">
                <el-input v-model="formPart.remark"  clearable ></el-input>
              </el-form-item>
            </div>
            <div class="form-wrapper margin-left-65">
              <el-form-item label="数量：" prop="quantity">
                <el-input v-model.number="formPart.quantity"  clearable required></el-input>
              </el-form-item>
              <el-form-item label="总价：" prop="name">
                <el-input v-model="formPart.name"  clearable></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </el-dialog>
    </div>
</template>

<script>
import {
  Upload
} from '@/api/sys.global'
import {
  FetchBrand,
  FetchPartInfo,
  FetchCargoInfo,
  PartInfoUpload
} from '@/api/sys.goods'
import util from '@/libs/util'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'main-form',
  components: {
  },
  props: {
    listParams: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      name: '',
      filename: '',
      loading: false,
      goodsFormActive: ['1'],
      payTypeData: [
        {
          label: 'A：开有条件的100%L/C，80%见单即付，20%待验收合格后凭最终用户与卖方双方签字并加盖“华南理工大学实验室与设备管理处仪器设备验收专用章”印章的验收报告付款。',
          value: 1
        },
        {
          label: 'B：验收合格后凭最终用户与卖方双方签字并加盖“华南理工大学实验室与设备管理处仪器设备验收专用章”印章的验收报告和发票一次性付清。',
          value: 2
        }
      ],
      currencyData: util.currency(),
      pricesTypeData: [
        {
          label: 'A. CIP Guangzhou Airport （广州机场交货价。空运）',
          value: 1
        },
        {
          label: 'B. CIF Guangzhou Huangpu Port （广州黄埔港交货价。）',
          value: 2
        },
        {
          label: 'C. DAP SCUT/SCUT in university town （华南理工大学/大学城校区交货价。不限运输方式）',
          value: 3
        }
      ],
      form: {
        cargoId: '',
        cargoSerial: '',
        cargoCode: '',
        itemCode: '',
        itemName: '',
        cargoName: '',
        brand: '',
        model: '',
        mainParams: '',
        manufactor: '',
        type: '',
        currency: '',
        guaranteeRate: '',
        remark: '',
        attachment: {
          attachId: ''
        },
        creator: '',
        createDate: '',
        maintenanceMan: '',
        maintenanceDate: ''
      },
      rules: {
        itemName: [
          { required: true, message: '请选择货物品目', trigger: 'change' }
        ],
        cargoName: [
          { required: true, message: '请填写货物名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择进口/国产类别', trigger: 'change' }
        ],
        currency: [
          { required: true, message: '请选择币种', trigger: 'change' }
        ],
        brand: [
          { required: true, message: '请填写品牌', trigger: 'blur' }
        ],
        model: [
          { required: true, message: '请填写型号', trigger: 'blur' }
        ],
        mainParams: [
          { required: true, message: '请填写主要参数', trigger: 'blur' }
        ],
        manufactor: [
          { required: true, message: '请填写产地', trigger: 'blur' }
        ],
        guaranteeRate: [
          { required: true, message: '请填写维保率/月', trigger: 'blur' }
        ]
      },
      formPart: {
        partCode: '',
        partName: '',
        standards: '',
        techParams: '',
        manufactor: '',
        unit: '',
        quantity: '',
        price: '',
        remark: '',
        cargoInfo: {
          cargoId: ''
        }
      },
      rulesPart: {
        partName: [
          { required: true, message: '请填写配件名称', trigger: 'blur' }
        ],
        standards: [
          { required: true, message: '请填写型号/规格', trigger: 'blur' }
        ],
        manufactor: [
          { required: true, message: '请填写产地', trigger: 'blur' }
        ],
        techParams: [
          { required: true, message: '请填写主要技术参数', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请填写单位', trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '请填写数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字值' }
        ],
        price: [
          { required: true, message: '请填写单价', trigger: 'blur' }
        ]
      },
      fileList: [],
      attachId: '',
      tableData: [],
      partLoading: false,
      partTableData: [],
      isVisible: false,
      boxParams: {},
      searchName: '',
      brandData: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectOrg: {
        orgsId: []
      },
      multipleSelection: [],
      pageInfo: {
        pageSize: this.GLOBAL.pageSize,
        total: 0,
        currentPage: 1
      },
      partFile: {}
    }
  },
  created () {
    console.log('==========4444444', this.$route.params.cargoId)
    if (this.$route.params.cargoId) {
      this.fetchDetailData(this.$route.params.cargoId)
      this.fetchPartListData(this.$route.params.cargoId)
    }
    this.fetchBrandList()
  },
  filters: {},
  watch: {
    listParams: {
      immediate: true, // 这句重要
      handler (val) {
        if (val) {
          // switch (val.type) {
          //   case 1:
          //     this.$set(this.columns, 0, { title: '待办类型', key: 'date' })
          //     this.$set(this.columns, 1, { title: '待办主题', key: 'name' })
          //     break
          //   case 2:
          //     this.$set(this.columns, 0, { title: '已办类型', key: 'date' })
          //     this.$set(this.columns, 1, { title: '已办主题', key: 'name' })
          //     break
          // }
        }
      }

    }

  },
  computed: {
    ...mapState('d2admin/page', [
      'opened',
      'current' // 用户获取当前页面的地址，用于关闭
    ])
  },
  methods: {
    ...mapActions('d2admin/page', [
      'close'
    ]),
    indexMethod (index) {
      return index + (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize + 1
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    fetchDetailData (id) {
      FetchCargoInfo('get', id, true).then((res) => {
        console.log('=====', res)
        this.form = res
        this.form.createDate = util.formatTime(res.createDate)
        this.form.maintenanceDate = util.formatTime(res.maintenanceDate)
        this.fileList = [{
          name: res.attachment.attachName
        }]
        this.form.attachment.attachId = res.attachment.attachId
      }).catch((err) => {
        // 显示提示
        this.$message({
          message: err.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    fetchPartListData () {
      FetchPartInfo('get', {
        currentPage: this.pageInfo.currentPage || 1,
        pageSize: this.pageInfo.pageSize,
        isDelete: 2,
        cargoId: this.$route.params.cargoId
      }).then((res) => {
        this.partTableData = res.partInfoDtos
        this.pageInfo = {
          ...this.pageInfo,
          total: res.statistics.totalSize,
          currentPage: res.statistics.currentPage
        }
        this.loading = false
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
    /**
     * 改变分页size
     */
    handleSizeChange (val) {
      this.pageInfo = {
        ...this.pageInfo,
        pageSize: val
      }
      if (this.listParams.type === 2) {
        this.fetchPartListData()
      }
    },
    /**
     * 改变公页当前页
     */
    handleCurrentChange (val) {
      this.pageInfo = {
        ...this.pageInfo,
        currentPage: val
      }
      if (this.listParams.type === 2) {
        this.fetchPartListData()
      }
    },
    fetchBrandList (params) {
      FetchBrand(params).then(res => {
        let treeData = util.composeTree(res)
        this.treeData = treeData
      }).catch((err) => {
        // 显示提示
        this.$message({
          message: err.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    renderContent (h, { node, data, store }) {
      return (
        <span>
          <i class={data.icon}></i>
          <span class="tree-text">{data.itemName}</span>
        </span>
      )
    },
    dataFilter (val) {
      this.$refs.tree.filter(val)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.itemName.indexOf(value) !== -1
    },
    handleClear (val) {
      this.selectOrg.orgsId = []
      this.form.itemCode = ''
      this.form.itemName = ''
      this.$refs.tree.setCheckedKeys([])
    },
    handleCheckChange (data, checked, indeterminate) {
      // 获取当前选择的id在数组中的索引
      const indexs = this.selectOrg.orgsId.indexOf(data.brandItemId)
      // 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
      if (indexs < 0 && this.selectOrg.orgsId.length === 1 && checked) {
        this.$message({
          message: '只能选择一个货物品目！',
          type: 'error',
          showClose: true
        })
        // 设置已选择的节点为false 很重要
        this.$refs.tree.setChecked(data, false)
      } else if (this.selectOrg.orgsId.length === 0 && checked) {
        // 发现数组为空 并且是已选择
        // 防止数组有值，首先清空，再push
        this.selectOrg.orgsId = []
        this.selectOrg.orgsId.push(data.brandItemId)
        this.form.itemCode = data.itemCode
        this.form.itemName = data.itemName
        this.$refs.goodsTree.blur()
      } else if (indexs >= 0 && this.selectOrg.orgsId.length === 1 && !checked) {
        // 再次直接进行赋值为空操作
        this.selectOrg.orgsId = []
        this.form.itemCode = ''
        this.form.itemName = ''
      }
    },
    handleFileChange (file) {
      this.file = file.raw
      let formData = new FormData()
      formData.append('file', this.file)
      Upload(formData).then((res) => {
        this.form.attachment.attachId = res.attachId
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
    tableRowClassName ({ row, rowIndex }) {
      row.row_index = rowIndex + (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize + 1
      if (rowIndex % 2 === 0) {
        return 'even-row'
      } else {
        return 'odd-row'
      }
    },
    handleEdit (index, row) {
      if (this.multipleSelection.length === 1) {
        this.boxParams = { type: 'edit', data: this.multipleSelection[0] }
        this.formPart = this.multipleSelection[0]
        this.formPart.price = parseFloat(this.multipleSelection[0].price)
        this.isVisible = true
      } else {
        this.$message({
          type: 'info',
          message: '请选择一条需要查看/编辑的数据！'
        })
      }
    },
    handleDelete (index, row) {
      if (this.multipleSelection.length === 1) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.listParams.type === 1) { // 新增货物
            (this.partTableData).splice((this.multipleSelection[0]).row_index, 1)
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 3 * 1000
            })
          } else if (this.listParams.type === 2) { // 编辑货物
            FetchPartInfo('delete', (this.multipleSelection[0]).partId).then((res) => {
              this.$message({
                message: '删除成功！',
                type: 'success',
                duration: 3 * 1000
              })
              this.fetchPartListData()
            }).catch((err) => {
              // 显示提示
              this.$message({
                message: err.message,
                type: 'error',
                duration: 5 * 1000
              })
            })
          }
        }).catch((err) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          type: 'info',
          message: '请选择一条需要删除的数据！'
        })
      }
    },
    handleAdd () {
      this.isVisible = true
      this.boxParams = {
        type: 'add',
        data: {}
      }
    },
    handleSavePartForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            // partCode: this.formPart.partCode,
            partName: this.formPart.partName,
            standards: this.formPart.standards,
            techParams: this.formPart.techParams,
            manufactor: this.formPart.manufactor,
            unit: this.formPart.unit,
            quantity: this.formPart.quantity,
            price: this.formPart.price,
            remark: this.formPart.remark
          }
          console.log('====33', params)
          if (this.boxParams.type === 'add') {
            if (this.listParams.type === 1) { // 新增货物
              this.partTableData.unshift(params)
              this.resetForm('partForm')
              this.isVisible = false
            } else if (this.listParams.type === 2) { // 编辑货物
              console.log(999, this.$route.params.cargoId)
              params.cargoId = this.form.cargoId
              FetchPartInfo('post', params).then((res) => {
                console.log(888, res)
                this.fetchPartListData()
                this.resetForm('partForm')
                this.isVisible = false
              }).catch((err) => {
                // 显示提示
                this.$message({
                  message: err.message,
                  type: 'error',
                  duration: 5 * 1000
                })
              })
            }
          } else if (this.boxParams.type === 'edit') {
            if (this.listParams.type === 1) {
              this.$set(this.partTableData,
                this.multipleSelection[0].row_index,
                {
                  ...this.multipleSelection[0],
                  ...params
                }
              )
              this.resetForm('partForm')
              this.isVisible = false
            } else if (this.listParams.type === 2) {
              params.id = this.boxParams.data.partId
              console.log('============333', params)
              FetchPartInfo('put', params).then((res) => {
                console.log('=======', res)
                // this.$message({
                //   message: '修改配件信息成功',
                //   type: 'success',
                //   duration: 3 * 1000
                // })
                this.fetchPartListData()
                this.resetForm('partForm')
                this.isVisible = false
              }).catch((err) => {
                // 显示提示
                this.$message({
                  message: err.message,
                  type: 'error',
                  duration: 5 * 1000
                })
              })
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 提交表单
     * @param formName
     */
    handleSaveGoods (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let partData = []
          this.partTableData.forEach(item => {
            partData.push({
              partName: item.partName,
              standards: item.standards,
              techParams: item.techParams,
              manufactor: item.manufactor,
              unit: item.unit,
              quantity: item.quantity,
              price: item.price,
              remark: item.remark
            })
          })
          let params = {
            itemCode: this.form.itemCode,
            itemName: this.form.itemName,
            cargoName: this.form.cargoName,
            brand: this.form.brand,
            model: this.form.model,
            mainParams: this.form.mainParams,
            manufactor: this.form.manufactor,
            type: this.form.type,
            currency: this.form.currency,
            guaranteeRate: this.form.guaranteeRate,
            remark: this.form.remark,
            attachment: {
              attachId: this.form.attachment.attachId
            },
            partInfos: partData
          }
          console.log('====33', params)
          if (this.listParams.type === 1) {
            FetchCargoInfo('post', params).then((res) => {
              console.log(888, res)
              this.$message({
                message: '新建货物信息成功！',
                type: 'success',
                duration: 3 * 1000
              })
              this.resetForm('form')
              this.$store.dispatch('d2admin/menu/headerActivePathSet', '/goods')
              this.$router.push({ path: '/goods/list' })
              let tagName = this.current
              this.close({ tagName })
            }).catch((err) => {
              // 显示提示
              this.$message({
                message: err.message,
                type: 'error',
                duration: 5 * 1000
              })
            })
          } else if (this.listParams.type === 2) {
            params.id = this.boxParams.data.cargoId
            FetchCargoInfo('put', params).then((res) => {
              this.$message({
                message: '修改货物信息成功！',
                type: 'success',
                duration: 3 * 1000
              })
              this.resetForm('form')
              // this.$emit('hideDialog')
              // this.$emit('fetchList')
            }).catch((err) => {
              // 显示提示
              this.$message({
                message: err.message,
                type: 'error',
                duration: 5 * 1000
              })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleClose () {
      let tagName = this.current
      this.close({ tagName })
    },
    hideDialog () {
      this.dialogVisible = false
    },
    /**
     * 下载导入模板
     */
    handleDownloadTemplate () {
      util.download('/partInfo/downloadTemplate')
    },
    /**
     * 导入配件数据
     */
    handleUpload (file) {
      this.partFile = this.$refs.importFile.files[0]
      let formData = new FormData()
      formData.append('file', this.partFile)
      PartInfoUpload(formData).then((res) => {
        console.log('===========222', res)
      }).catch((err) => {
        // 显示提示
        this.$message({
          message: err.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
    }

  }
}
</script>

<style lang="scss">

  .form-footer-con{
    border-top: 1px solid #EBEEF5;
    padding-top: 10px;
    .form-footer-content{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 0 130px 0 45px;
      width: 44%;
      p{
        display: inline-block;
        white-space: nowrap;
        color: #333333;
        width: 170px;
        display: flex;
        justify-content: flex-end;
        padding: 0 6px 0 0;
      }
      span{
        color: #000000;
      }
      .unit{
        display: inline-block;
        white-space: nowrap;
        padding-left: 6px;
      }
    }
  }
  .table-tool-tips{
    margin: 0 15px 25px;
    p{
      color: #333333;
      line-height: 23px;
    }
    .text-color-red{
      color: #FF0000;
    }
  }
  .form-tool{
    margin: 10px 15px 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn-width-90{
    width:90px;
    height:30px;
    padding: 0 !important;
    font-size: 12px !important;
  }
  .search-wrapper{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    span{
      white-space: nowrap;
    }
    .el-input{
      width: 260px;
    }
  }
  .text{
    color: #333333;
    font-size: 14px;
  }
  .underline-text{
    padding: 0px 12px;
    border-bottom: 1px solid #333;
  }
</style>
