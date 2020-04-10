<template>
  <div class="container">
    <div class="wrapper-margin-bottom-10">
      <el-collapse v-model="flowActive">
        <el-collapse-item  name="1">
          <template slot="title">
            <div class="collapse-custom-header">
              <i class="line-icon"></i>
              <span class="header-title">流程跟踪</span>
            </div>
          </template>
          <div class="collapse-content">
            <el-table
              style="width: 100%"
              :loading="loading"
              border
              size="mini"
              :row-class-name="tableRowClassName"
              :data="flowData">
              <el-table-column
                fixed
                label="序号"
                type="index"
                width="50"
                align="center">
              </el-table-column>
              <el-table-column
                prop="name"
                label="审核流程"
                align="center">
              </el-table-column>
              <el-table-column
                prop="name2"
                label="处理人"
                align="center">
              </el-table-column>
              <el-table-column
                prop="status"
                label="处理时间"
                align="center">
              </el-table-column>
              <el-table-column
                prop="status"
                label="审核意见"
                align="center">
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="wrapper-margin-bottom-10">
      <el-collapse v-model="projectActive">
        <el-collapse-item  name="1">
          <template slot="title">
            <div class="collapse-custom-header">
              <i class="line-icon"></i>
              <span class="header-title">项目进度</span>
            </div>
          </template>
          <div class="collapse-content">
            <div class="check-wrapper">
              <el-steps :active="step" finish-status="success" align-center>
                <el-step title="2020.03.08" icon="icon-edit">
                  <template slot="description" >
                    <div class="check-step-content">
                      <span class="step1-text">项目拟稿</span>
                    </div>
                  </template>
                </el-step>
                <el-step title="" icon="icon-finish">
                  <template slot="description" >
                    <div class="check-step-content">
                      <span class="step2-text">采购人初审</span>
                    </div>
                  </template>
                </el-step>
                <el-step title="" icon="icon-wait">
                  <template slot="description">
                    <div class="check-step-content">
                      <span class="step3-text">招标中心经办人审核</span>
                    </div>
                  </template>
                </el-step>
                <el-step title="" icon="icon-wait">
                  <template slot="description" >
                    <div class="check-step-content">
                      <span class="step4-text">采购签收采购结果通知书及确认合同</span>
                    </div>
                  </template>
                </el-step>
                <el-step title="" icon="icon-wait">
                  <template slot="description" >
                    <div class="check-step-content">
                      <span class="step5-text">代理商签收中标通知书及合同</span>
                    </div>
                  </template>
                </el-step>
                <el-step title="" icon="icon-wait">
                  <template slot="description" >
                    <div class="check-step-content">
                      <span class="step6-text">项目完成</span>
                    </div>
                  </template>
                </el-step>
              </el-steps>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="wrapper-margin-bottom-10">
      <el-collapse v-model="projectFormActive">
        <el-collapse-item  name="1">
          <template slot="title">
            <div class="collapse-custom-header">
              <i class="line-icon"></i>
              <span class="header-title">项目信息</span>
            </div>
          </template>
          <div class="collapse-content">
              <div class="form-con">
                <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px"  size="mini" class="project-basic-form">
                  <div class="form-container">
                    <div class="form-wrapper">
                      <el-form-item label="厂家：" prop="name">
                        <el-input v-model="form.name" :disabled="listParams.type === 2 ? true : false"></el-input>
                      </el-form-item>
                      <el-form-item label="关联询价记录：" prop="region">
                        <el-input placeholder="请填写内容检索" v-model="form.name" :disabled="listParams.type === 2 ? true : false">
                          <el-button v-if="listParams.type === 1" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="项目编号：" prop="delivery">
                        <el-input v-model="form.name" :disabled="listParams.type === 2 ? true : false"></el-input>
                      </el-form-item>
                      <el-form-item label="设备付款方式：" prop="resource">
                        <el-select v-if="listParams.type === 1" v-model="form.name" clearable placeholder="请选择">
                          <el-option
                            v-for="item in payTypeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input  v-else-if="listParams.type === 2" type="textarea" v-model="form.name" disabled="true" resize="none"></el-input>
                      </el-form-item>
                      <el-form-item label="保修期/月：" prop="name">
                        <el-input v-model="form.name" :disabled="listParams.type === 2 ? true : false"></el-input>
                      </el-form-item>
                    </div>
                    <div class="form-line"></div>
                    <div class="form-wrapper">
                      <el-form-item label="采购人：" prop="name">
                        <el-input v-model="form.name" :disabled="listParams.type === 2 ? true : false"></el-input>
                      </el-form-item>
                      <el-form-item label="项目主题：" prop="name">
                        <el-input v-model="form.name" :disabled="listParams.type === 2 ? true : false"></el-input>
                      </el-form-item>
                      <el-form-item label="交货时间" prop="resource">
                        <el-radio-group v-if="listParams.type === 1"  v-model="form.name" class="project-radio-inline">
                          <el-radio>
                            <el-input>
                              <template slot="prepend">A：信用证后</template>
                              <template slot="append">天</template>
                            </el-input>
                          </el-radio>
                          <el-radio>
                            <el-input>
                              <template slot="prepend">B：办理免税证明后</template>
                              <template slot="append">天</template>
                            </el-input>
                          </el-radio>
                        </el-radio-group>
                        <p class="text" v-else-if="listParams.type === 2">B：办理免税证明后<span class="underline-text">30</span>天</p>
                      </el-form-item>
                      <el-form-item label="价格条款" prop="region">
                        <el-select v-if="listParams.type === 1"  v-model="form.name" clearable placeholder="请选择">
                          <el-option
                            v-for="item in pricesTypeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input  v-else-if="listParams.type === 2" type="textarea" v-model="form.name" disabled="true" resize="none"></el-input>
                      </el-form-item>
                      <el-form-item label="维保费率/月：" prop="name">
                        <el-input v-model="form.name" :disabled="listParams.type === 2 ? true : false"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </el-form>
                <div class="form-footer-con" v-if="listParams.type === 2">
                  <div class="form-footer-content">
                    <p>汇率：<span>1美元=</span></p>
                    <el-input v-model="form.name" size="mini"></el-input>
                    <span class="unit">人民币</span>
                  </div>
                </div>
              </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
     <div class="wrapper-margin-bottom-10">
       <div class="table-container">
         <div class="table-tool">
           <div class="table-tool-title">
             <i class="list-icon"></i>
             <span class="list-title">货物信息</span>
           </div>
           <div class="table-tool-btn">
             <el-button class="tool-basic-btn" v-if="listParams.type === 1" size="mini" @click="handleAdd">添加</el-button>
             <el-button size="mini" class="tool-edit-btn" @click="handleEdit">查看/编辑</el-button>
             <el-button size="mini" class="tool-delete-btn" @click="handleDelete">删除</el-button>
             <el-button class="tool-export-btn" size="mini" >导出</el-button>
           </div>
         </div>
         <div class="table-wrapper">
           <el-table
             :loading="loading"
             border
             size="mini"
             :row-class-name="tableRowClassName"
             height="90%"
             :data="tableData">
             <el-table-column
               fixed
               label="序号"
               type="index"
               align="center"
               width="50">
             </el-table-column>
             <el-table-column
               fixed
               type="selection"
               align="center"
               width="55">
             </el-table-column>
             <el-table-column
               prop="resultTemplateSubject"
               label="货物名称"
               width="210"
               align="center">
             </el-table-column>
             <el-table-column
               prop="status"
               label="设备及配件名称"
               width="120"
               align="center">
             </el-table-column>
             <el-table-column
               label="主要技术参数"
               width="180"
               align="center">
               <template slot-scope="scope">
                 <el-popover trigger="hover" placement="top">
                   <p>姓名: {{ scope.row.name }}</p>
                   <p>住址: {{ scope.row.address }}</p>
                   <div slot="reference" class="name-wrapper">
                     <el-tag size="medium">查看详情</el-tag>
                   </div>
                 </el-popover>
               </template>
             </el-table-column>
             <el-table-column
               prop="status"
               label="单位"
               width="120"
               align="center">
             </el-table-column>
             <el-table-column
               prop="status"
               label="数量"
               width="120"
               align="center">
             </el-table-column>
             <el-table-column
               prop="status"
               label="单价"
               width="120"
               align="center">
             </el-table-column>
             <el-table-column
               prop="status"
               label="单价单位"
               width="120"
               align="center">
             </el-table-column>
             <el-table-column
               prop="status"
               label="备注"
               width="120"
               align="center">
             </el-table-column>
             <!--<el-table-column label="操作"  width="150" fixed="right"  align="center">-->
               <!--<template slot-scope="scope">-->
                 <!--<el-button-->
                   <!--size="mini"-->
                   <!--class="table-basic-btn"-->
                   <!--@click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                 <!--<el-button-->
                   <!--size="mini"-->
                   <!--type="danger"-->
                   <!--@click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
               <!--</template>-->
             <!--</el-table-column>-->
           </el-table>
         </div>
         <div class="table-tool-tips">
           <p>货物总金额：xxx美元</p>
           <p>项目总金额：xxxx美元（提示：项目总金额=（货物总金额+货物总金额*保修费）*（1+代理费</p>
           <p>货物总金额：xxx人民币</p>
           <p v-if="listParams.type === 2" class="text-color-red">例子:货物总金额：10美元 项目总金额：13.2美元（提示：13.2=（10+10*10%）*（1+20%））</p>
         </div>
       </div>
     </div>
    <div>
      <div class="table-container">
        <div class="table-tool">
          <div class="table-tool-title">
            <i class="list-icon"></i>
            <span class="list-title">代理商信息</span>
          </div>
        </div>
        <div class="table-wrapper">
          <el-table
            :loading="loading"
            border
            size="mini"
            :row-class-name="tableRowClassName"
            style="width: 100%"
            :data="tableData2">
            <el-table-column
              fixed
              label="序号"
              type="index"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column  align="center">
              <template slot="header" slot-scope="scope">
                <p class="mark">是否为推荐代理商</p>
              </template>
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.resultTemplateSubject">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              align="center">
              <template slot="header" slot-scope="scope">
                <p class="mark">代理商名称</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="代理费用扣点（百分比）"
              align="center">
            </el-table-column>
            <el-table-column
              prop="status"
              label="推荐理由"
              align="center">
            </el-table-column>
          </el-table>
        </div>
        <div class="form-tool">
          <el-button class="form-submit-btn btn-width-90" v-if="listParams.type === 1">保存</el-button>
          <el-button class="form-submit-btn btn-width-90" v-if="listParams.type === 1">保存并提交</el-button>
          <el-button class="form-submit-btn btn-width-90" v-if="listParams.type === 2">同意并预览</el-button>
          <el-button class="form-submit-btn btn-width-90" v-if="listParams.type === 2">一键生成</el-button>
          <el-button class="form-close-btn btn-width-90">退回</el-button>
          <el-button class="form-close-btn btn-width-90">关闭</el-button>
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
        <div class="search-wrapper">
          <span>代理商名称：</span>
          <el-input placeholder="请输入内容" v-model="searchName" size="mini" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div>
          <el-button class="dialog-basic-btn" @click="isVisible = false">保存</el-button>
          <el-button class="dialog-close-btn" @click="isVisible = false">关闭</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table
          :loading="loading"
          border
          size="mini"
          :row-class-name="tableRowClassName"
          style="width: 100%"
          :data="tableData2">
          <el-table-column
            fixed
            label="序号"
            type="index"
            width="50"
            align="center">
          </el-table-column>
          <el-table-column
            type="selection"
            width="55"
            fixed
            align="center">
          </el-table-column>
          <el-table-column
            prop="resultTemplateSubject"
            label="货物名称"
            width="210"
            align="center">
          </el-table-column>
          <el-table-column
            prop="resultTemplateSubject"
            label="设备及配件名称"
            width="210"
            align="center">
          </el-table-column>
          <el-table-column
            label="主要技术参数"
            width="180"
            align="center">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>姓名: {{ scope.row.name }}</p>
                <p>住址: {{ scope.row.address }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">查看详情</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="单位"
            align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="数量"
            align="center">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    </div>
</template>

<script>
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
      flowActive: ['1'],
      loading: false,
      flowData: [
        {
          name: '供应商拟稿',
          name2: '厂家'
        }
      ],
      step: 0,
      projectActive: ['1'],
      projectFormActive: ['1'],
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
      tableData: [],
      tableData2: [{
        resultTemplateSubject: 1,
        status: 2
      }, {
        resultTemplateSubject: 2,
        status: 2
      }, {
        resultTemplateSubject: 1,
        status: 2
      }],
      isVisible: false,
      searchName: ''
    }
  },
  created () {
  },
  filters: {},
  watch: {
    listParams: {
      immediate: true, // 这句重要
      handler (val) {
        if (val) {
          switch (val.type) {
            case 1:
              this.$set(this.columns, 0, { title: '待办类型', key: 'date' })
              this.$set(this.columns, 1, { title: '待办主题', key: 'name' })
              break
            case 2:
              this.$set(this.columns, 0, { title: '已办类型', key: 'date' })
              this.$set(this.columns, 1, { title: '已办主题', key: 'name' })
              break
          }
        }
      }

    }

  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'even-row'
      } else {
        return 'odd-row'
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
        // FetchResultTemplate('delete', row.resultTemplateId).then((res) => {
        //   this.$message({
        //     message: '删除成功！',
        //     type: 'success',
        //     duration: 3 * 1000
        //   })
        //   this.fetchList()
        // }).catch((err) => {
        //   this.loading = false
        //   // 显示提示
        //   this.$message({
        //     message: err.message,
        //     type: 'error',
        //     duration: 5 * 1000
        //   })
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleAdd () {
      this.isVisible = true
    },
    hideDialog () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
  .container{
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .project-basic-form{
    margin: 0 45px;
    .form-container{
      display: flex;
      justify-content: space-around;
      align-items: center;
      .form-wrapper{
        flex: 1;
      }
    }
    .form-line{
      width: 1px;
      height: 175px;
      background-color: #EDEDED;
      margin: 0 65px;
    }
    .el-select{
      width: 100%;
    }
    .project-radio-inline{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .el-radio{
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .el-input{
        width: 160px;
      }
      .el-input-group__append, .el-input-group__prepend{
        padding: 0  6px !important;
      }
    }
  }
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
