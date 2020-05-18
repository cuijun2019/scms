<template>
  <div class="container">
    <div class="wrapper-margin-bottom-15">
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
              size="medium"
              :row-class-name="tableRowClassName"
              :data="busiJbpmFlowDtos">
              <el-table-column
                fixed
                label="序号"
                type="index"
                width="50"
                align="center">
              </el-table-column>
              <el-table-column
                prop="flowNodeName"
                label="审核流程"
                align="center">
              </el-table-column>
              <el-table-column
                prop="parentActor"
                label="处理人"
                align="center">
              </el-table-column>
              <el-table-column
                prop="flowStartTime"
                label="处理时间"
                align="center"
                :formatter="formatterTime">
              </el-table-column>
              <el-table-column
                prop="opinion"
                label="审核意见"
                align="center">
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="wrapper-margin-bottom-15">
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
              <!-- icon-wait icon-edit icon-finish-->
              <el-steps :active="step" process-status="process" finish-status="finish" align-center>
                <el-step :title="schedule.supplierTime" icon="icon-wait">
                  <template slot="description" >
                    <div class="check-step-content">
                      <span class="step1-text">项目拟稿</span>
                    </div>
                  </template>
                </el-step>
                <el-step :title="schedule.purchaserTime" icon="icon-wait">
                  <template slot="description" >
                    <div class="check-step-content">
                      <span class="step2-text">采购人初审</span>
                    </div>
                  </template>
                </el-step>
                <el-step :title="schedule.jingbanrenTime" icon="icon-wait">
                  <template slot="description">
                    <div class="check-step-content">
                      <span class="step3-text">招标中心经办人审核</span>
                    </div>
                  </template>
                </el-step>
                <el-step :title="schedule.confirmPurchaserTime" icon="icon-wait">
                  <template slot="description" >
                    <div class="check-step-content">
                      <span class="step4-text">采购人签收采购结果通知书及确认合同</span>
                    </div>
                  </template>
                </el-step>
                <el-step :title="schedule.confirmBidTime" icon="icon-wait">
                  <template slot="description" >
                    <div class="check-step-content">
                      <span class="step5-text">代理商签收成交通知书及合同</span>
                    </div>
                  </template>
                </el-step>
                <el-step :title="schedule.finishTime" icon="icon-wait">
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
    <div class="wrapper-margin-bottom-15">
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
                <el-form :model="form" :rules="rules" ref="form" label-width="140px"  size="medium" class="project-basic-form">
                  <div class="form-container">
                    <div class="form-wrapper-project-flex1">
                      <el-form-item label="关联询价记录：" prop="inquiryInfo.inquiryId">
                        <el-select  v-model="form.inquiryInfo" value-key="inquiryId"  clearable required filterable  placeholder="请选择或填写内容检索" :disabled="isDisable">
                          <el-option
                            v-for="item in inquiryInfoDtos"
                            :key="item.inquiryId"
                            :label="item.inquiryCode"
                            :value="item">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="项目编号：" prop="projectCode">
                        <el-input v-model="form.projectCode" :disabled="true" placeholder="自动生成"></el-input>
                      </el-form-item>
                      <el-form-item label="设备付款方式：" prop="paymentMethod">
                        <el-select v-if="!isDisable" v-model="form.paymentMethod" placeholder="请选择"  clearable required >
                          <el-option
                            v-for="item in payTypeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input  v-else-if="isDisable" type="textarea" v-model="form.paymentMethod" :disabled="true" resize="none"></el-input>
                      </el-form-item>
                      <el-form-item label="保修期/月：" prop="guaranteeDate">
                        <el-input v-model.number="form.guaranteeDate" :disabled="isDisable"  clearable required ></el-input>
                      </el-form-item>
                      <el-form-item label="维保费率/月：" prop="guaranteeFee">
                        <el-input v-model="form.guaranteeFee" :disabled="isDisable"  clearable required @input="handleGuaranteeFeeInput">
                          <template slot="append">%</template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="数量/套：" prop="quantity">
                        <el-input v-model="form.quantity" :disabled="isDisable"  clearable required ></el-input>
                      </el-form-item>
                    </div>
                    <div class="form-line"></div>
                    <div class="form-wrapper-project-flex2">
                      <el-form-item label="采购人：" prop="inquiryInfo.purchaser">
                        <el-input v-model="form.inquiryInfo.purchaser" clearable required :disabled="true" placeholder="根据询价记录获取采购人"></el-input>
                      </el-form-item>
                      <el-form-item label="项目主题：" prop="projectSubject">
                        <el-input v-model="form.projectSubject" :disabled="true"  placeholder="自动生成"></el-input>
                      </el-form-item>
                      <el-form-item label="交货时间" prop="deliveryDateStatus">
                        <el-radio-group v-if="!isDisable"  v-model="form.deliveryDateStatus" class="project-radio-inline" clearable required >
                          <el-radio :label="1" clearable>
                            <el-input v-if="form.deliveryDateStatus == 1"  v-model.number="form.deliveryDate">
                              <template slot="prepend" style="font-size: 14px">A：信用证后</template>
                              <template slot="append">天</template>
                            </el-input>
                            <el-input  v-else-if="form.deliveryDateStatus == 2" :disabled="true">
                              <template slot="prepend">A：信用证后</template>
                              <template slot="append">天</template>
                            </el-input>
                          </el-radio>
                          <el-radio :label="2" clearable>
                            <el-input v-if="form.deliveryDateStatus == 1"  :disabled="true">
                              <template slot="prepend">B：办理免税证明后</template>
                              <template slot="append">天</template>
                            </el-input>
                            <el-input v-else-if="form.deliveryDateStatus == 2" v-model.number="form.deliveryDate">
                              <template slot="prepend">B：办理免税证明后</template>
                              <template slot="append">天</template>
                            </el-input>
                          </el-radio>
                        </el-radio-group>
                        <div v-else-if="isDisable">
                          <p class="text" v-if="form.deliveryDateStatus == 1">A：信用证后<span class="underline-text">{{form.deliveryDate}}</span>天</p>
                          <p class="text" v-else-if="form.deliveryDateStatus == 2" >B：办理免税证明后<span class="underline-text">{{form.deliveryDate}}</span>天</p>
                        </div>
                      </el-form-item>
                      <el-form-item label="价格条款" prop="priceTerm">
                        <el-select v-if="!isDisable"  v-model="form.priceTerm" placeholder="请选择"  clearable required >
                          <el-option
                            v-for="item in pricesTypeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-input  v-else-if="isDisable" type="textarea" v-model="form.priceTerm" :disabled="true" resize="none" clearable></el-input>
                      </el-form-item>
                      <el-form-item label="创建人：" prop="creator">
                       <p>{{form.creator}}</p>
                      </el-form-item>
                    </div>
                  </div>
                </el-form>
                <div class="form-footer-con" v-if="!amountDisabled">
                  <div class="form-footer-content">
                    <p style="font-size: 16px">汇率：<span>1{{form.currency}}=</span></p>
                    <el-input v-model="form.aAmount" size="medium" @input="handleAmountRMB"></el-input>
                    <span class="unit" style="font-size: 16px">人民币</span>
                  </div>
                </div>
              </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
     <div class="wrapper-margin-bottom-15">
       <div class="table-container">
         <div class="table-tool">
           <div class="table-tool-title">
             <i class="list-icon"></i>
             <span class="list-title">货物信息</span>
           </div>
           <div class="table-tool-btn">
             <el-button class="tool-basic-btn" v-if="!isDisable" size="mini" @click="handleAdd">添加</el-button>
             <el-button size="mini" class="tool-delete-btn" v-if="!isDisable" @click="handleDelete">删除</el-button>
             <el-button class="tool-export-btn" size="mini" v-if="isDisable" @click="handleExport">导出</el-button>
           </div>
         </div>
         <div class="table-wrapper">
           <el-table
             :loading="cargoLoading"
             border
             size="medium"
             :row-class-name="tableRowClassName"
             height="250"
             :data="cargoTableData"
             @selection-change="handleCargoInfoSelectionChange">
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
               prop="cargoName"
               align="center"
               label="货物名称"
               width="250">
             </el-table-column>
             <el-table-column
               prop="partCode"
               label="配件编号"
               width="250"
               align="center">
             </el-table-column>
             <el-table-column
               prop="partName"
               label="设备或配件名称"
               width="210"
               align="center">
             </el-table-column>
             <el-table-column
               prop="standards"
               label="型号/规格"
               width="180"
               align="center">
             </el-table-column>
             <el-table-column
               prop="manufactor"
               label="产地/厂家"
               width="150"
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
               align="center">
             </el-table-column>
             <el-table-column
               prop="quantity"
               label="数量"
               width="150"
               align="center">
               <template slot-scope="scope">
                 <el-input v-model.number="scope.row.quantity" :disabled="isDisable"  clearable size="medium" @input="(value) =>{handleInput(value,scope.row)}"></el-input>
               </template>
             </el-table-column>
             <el-table-column
               prop="price"
               label="单价"
               width="180"
               align="center">
               <template slot-scope="scope">
                 <el-input v-model="scope.row.price" :disabled="isDisable"  clearable size="medium" @blur="(event) => {handleBlur(event, scope.row, scope.$index)}" @input="(value) =>{handleInput(value,scope.row)}"></el-input>
               </template>
             </el-table-column>
             <el-table-column
               prop="total"
               label="总价"
               width="180"
               align="center">
             </el-table-column>
             <el-table-column
               prop="remark"
               label="备注"
               align="center">
             </el-table-column>
           </el-table>
         </div>
         <div class="table-tool-tips">
           <p style="font-size: 16px">货物总金额：<span>{{form.cargoTotal}}{{form.currency}}</span></p>
           <!--招标中心经办人-->
           <!--<p>货物总金额：xxx人民币</p>-->
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
        <div class="table-wrapper wrapper-margin-bottom-15">
          <el-table
            ref="agentTable"
            class="agent-table"
            :loading="agentLoading"
            border
            size="medium"
            :row-class-name="tableRowClassName"
            style="width: 100%"
            :data="agentTableData"
            @select="handleSelect"
            @selection-change="handleAgentSelectionChange">
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
              width="160">
            </el-table-column>
            <el-table-column
              prop="agentName"
              align="center">
              <template slot="header" slot-scope="scope">
                <p class="mark">代理商名称</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="agentPoint"
              label="代理费用扣点（百分比）"
              align="center"
              width="210">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="推荐理由"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" :disabled="isDisable"  clearable size="medium"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-tool-tips">
          <p style="font-size: 16px">项目总金额：<span>{{form.amount}}{{form.currency}}</span><span style="color: #999999;font-size: 14px">（提示：项目总金额=（货物总金额+货物总金额*保修费）*（1+代理费）)</span></p>
          <p style="font-size: 16px" v-if="!amountDisabled">项目总金额：<span>{{form.amountRMB}}人民币</span></p>
          <p class="text-color-red" style="font-size: 14px">例子:货物总金额：10美元 项目总金额：13.2美元（提示：13.2=（10+10*10%）*（1+20%））</p>
        </div>
        <div class="form-tool">
          <el-button class="form-submit-btn btn-width-120"  v-if="!isDisable" @click="handleSaveForm('form',1)">保存</el-button>
          <el-button class="form-submit-btn btn-width-120"  v-if="!isDisable" @click="handleSaveForm('form',2)" >保存并提交</el-button>
          <el-button class="form-submit-btn btn-width-120"  v-if="!purchaserAuditDisabled" @click="handleSaveForm('form',3)">同意</el-button>
          <el-button class="form-close-btn btn-width-120"   v-if="!purchaserAuditDisabled" @click="handleSaveForm('form',4)">退回</el-button>
          <el-button class="form-submit-btn btn-width-120"  v-if="!auditDisabled" :disabled="jingbanrenBtn"  @click="handleSaveForm('form',3)">同意并预览</el-button>
          <el-button class="form-close-btn btn-width-120"   v-if="!auditDisabled" @click="handleSaveForm('form',4)">退回</el-button>
          <!--<el-button class="form-submit-btn btn-width-120"  v-if="!generateDisabled" @click="handleSaveForm('form',5)">一键生成</el-button>-->
          <el-button class="form-submit-btn btn-width-120"  v-if="confirmBtn" @click="isConfirmVisible = true">预览确认合同</el-button>
          <el-button class="form-close-btn btn-width-120"  @click="handleClose">关闭</el-button>
        </div>
      </div>
    </div>
    <!--添加货物-->
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
          <span>货物名称：</span>
          <!--<el-input placeholder="请填写货物名称" v-model="searchData.cargoName" size="medium" clearable :disabled="cargoNameDisable">-->
            <!--<el-button slot="append" icon="el-icon-search" @click="fetchPartInfoList"></el-button>-->
          <!--</el-input>-->
          <el-select v-model="searchData.cargoName" filterable placeholder="请填写/选择货物名称" size="medium" clearable :disabled="cargoNameDisable" @change="fetchPartInfoList">
            <el-option
              v-for="item in cargoNameData"
              :key="item.cargoId"
              :label="item.cargoName"
              :value="item.cargoName">
            </el-option>
          </el-select>
          <!--<el-button class="form-submit-btn btn-width-120" icon="el-icon-search" @click="fetchPartInfoList"></el-button>-->
        </div>
        <div>
          <el-button class="dialog-basic-btn" @click="handleChangeCargoInfo">保存</el-button>
          <el-button class="dialog-close-btn" @click="isVisible = false">关闭</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table
          ref="partInfoTable"
          :loading="partInfoLoading"
          border
          size="medium"
          :row-class-name="tableRowClassName"
          style="width: 100%"
          :data="partInfoDtos"
          @selection-change="handlePartInfoSelectionChange">
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
            prop="cargoName"
            align="center"
            label="货物名称"
            width="210">
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
            prop="total"
            label="总价"
            width="120"
            align="center">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!--预览-->
    <el-dialog
      title=""
      :visible.sync="isPreviewVisible"
      width="60%"
      class="form-dialog"
      :modal="false"
      :show-close="false"
    >
      <div slot="title" class="dialog-header">
        <div class="search-wrapper">
          <el-button class="tool-basic-btn" size="mini" @click="previewType = 1">采购结果通知书</el-button>
          <el-button class="tool-basic-btn" size="mini" @click="previewType = 2">中标通知书</el-button>
          <el-button v-if="form.amountRMB > 200000" class="tool-basic-btn" size="mini" @click="previewType = 3" >合同</el-button>
        </div>
      </div>
      <div class="preview-wrapper">
        <div class="preview-con">
          <iframe v-if="previewType === 1" :src='"https://view.officeapps.live.com/op/view.aspx?src="+resultNotice' width='100%' height='100%' sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation allow-modals" frameborder=0 scrolling=auto>
          </iframe>
          <iframe v-else-if="previewType === 2" :src='"https://view.officeapps.live.com/op/view.aspx?src="+bidNotice' width='100%' height='100%' sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation allow-modals" frameborder=0 scrolling=auto>
          </iframe>
          <iframe v-else-if="previewType === 3" :src='"https://view.officeapps.live.com/op/view.aspx?src="+contract' width='100%' height='100%' sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation allow-modals" frameborder=0 scrolling=auto>
          </iframe>
        </div>
        <div class="preview-btn">
          <el-button class="form-submit-btn btn-width-120"  @click="handleSaveForm('form',5)">一键生成</el-button>
          <el-button class="form-close-btn btn-width-120"  @click="isPreviewVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!--确认采购通知书及合同-->
    <el-dialog
      title=""
      :visible.sync="isConfirmVisible"
      width="60%"
      class="form-dialog"
      :modal="false"
      :show-close="false"
    >
      <div slot="title" class="dialog-header">
        <div class="search-wrapper">
          <el-button class="tool-basic-btn" size="mini" >采购人签收采购结果通知书及确认合同</el-button>
        </div>
      </div>
      <div class="preview-wrapper">
        <div class="preview-con">
          <iframe :src='"https://view.officeapps.live.com/op/view.aspx?src="+contractUrl' width='100%' height='100%' sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation allow-modals" frameborder=0 scrolling=auto>
          </iframe>
        </div>
        <div class="preview-btn">
          <el-button class="form-submit-btn btn-width-120"  @click="handleSaveForm('form',3)">同意</el-button>
          <el-button class="form-close-btn btn-width-120"   @click="handleSaveForm('form',4)">退回</el-button>
          <el-button class="form-close-btn btn-width-120"  @click="isConfirmVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    </div>
</template>

<script>
import { FetchInquiryInfo } from '@/api/sys.prices'// api
import { FetchPartInfo } from '@/api/sys.goods'
import { FetchProjectInfo, FetchPartInfoExp, GenerateResultNotice, GenerateContractNotice, GenerateBidNotice, FetchProGetAgentList, FetchGetCargoInfoName } from '@/api/sys.projects'
import { FetchUserByRoleId } from '@/api/sys.system'
import { fetchFlowData, getDataAuditStatus, fetchAuditData, fetchStartModifyAuditData, modifyAndAddAuditData } from '@/libs/flowAudit'
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
    let checkFloatNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('维保率不能为空！'))
      }
      setTimeout(() => {
        if (!util.floatNumExp(value)) {
          callback(new Error('维保率格式不正确，非零开头的整数或小数!'))
        } else {
          callback()
        }
      }, 1000)
    }
    let checkAmountNum = (rule, value, callback) => {
      setTimeout(() => {
        if (!util.floatNumExp(value)) {
          callback(new Error('汇率格式不正确，非零开头的整数或小数!'))
        } else {
          callback()
        }
      }, 300)
    }
    return {
      name: '',
      filename: '',
      flowActive: ['1'],
      loading: false,
      busiJbpmFlowDtos: [
        {
          flowNodeName: '供应商拟稿',
          parentActor: '',
          flowStartTime: '',
          opinion: '请审核'
        }
      ],
      step: 0,
      stepStatus: 'wait', // wait / process / finish / error / success
      schedule: {
        supplierTime: '',
        purchaserTime: '',
        jingbanrenTime: '',
        confirmPurchaserTime: '',
        confirmBidTime: '',
        finishTime: ''
      },
      projectActive: ['1'],
      projectFormActive: ['1'],
      inquiryInfoDtos: [],
      payTypeData: [
        {
          label: 'A：开有条件的100%L/C，80%见单即付，20%待验收合格后凭最终用户与卖方双方签字并加盖“华南理工大学实验室与设备管理处仪器设备验收专用章”印章的验收报告付款。',
          value: 'A：开有条件的100%L/C，80%见单即付，20%待验收合格后凭最终用户与卖方双方签字并加盖“华南理工大学实验室与设备管理处仪器设备验收专用章”印章的验收报告付款。'
        },
        {
          label: 'B：验收合格后凭最终用户与卖方双方签字并加盖“华南理工大学实验室与设备管理处仪器设备验收专用章”印章的验收报告和发票一次性付清。',
          value: 'B：验收合格后凭最终用户与卖方双方签字并加盖“华南理工大学实验室与设备管理处仪器设备验收专用章”印章的验收报告和发票一次性付清。'
        }
      ],
      pricesTypeData: [
        {
          label: 'A. CIP Guangzhou Airport （广州机场交货价。空运）',
          value: 'A. CIP Guangzhou Airport （广州机场交货价。空运）'
        },
        {
          label: 'B. CIF Guangzhou Huangpu Port （广州黄埔港交货价。）',
          value: 'B. CIF Guangzhou Huangpu Port （广州黄埔港交货价。）'
        },
        {
          label: 'C. DAP SCUT/SCUT in university town （华南理工大学/大学城校区交货价。不限运输方式）',
          value: 'C. DAP SCUT/SCUT in university town （华南理工大学/大学城校区交货价。不限运输方式）'
        }
      ],
      deliveryDateTemp: '',
      form: {
        inquiryInfo: {},
        deliveryDateStatus: 2,
        deliveryDate: '',
        paymentMethod: 'A：开有条件的100%L/C，80%见单即付，20%待验收合格后凭最终用户与卖方双方签字并加盖“华南理工大学实验室与设备管理处仪器设备验收专用章”印章的验收报告付款。',
        priceTerm: 'B. CIF Guangzhou Huangpu Port （广州黄埔港交货价。）',
        guaranteeDate: '',
        guaranteeFee: '',
        amount: 0,
        status: '',
        creator: '',
        projectCode: '',
        projectSubject: '',
        cargoTotal: 0,
        currency: '',
        quantity: 1,
        aAmount: 1,
        amountRMB: 0
      },
      rules: {
        'inquiryInfo.inquiryId': [
          { required: true, message: '请选择关联询价记录', trigger: 'change' }
        ],
        quantity: [
          { required: true, message: '请填写数量', trigger: 'blur' }
        ],
        deliveryDateStatus: [
          { required: true, message: '请选择交货时间', trigger: 'change' }
        ],
        deliveryDate: [
          { required: true, message: '请填写交货时间', trigger: 'blur' },
          { type: 'number', message: '交货时间为数字', trigger: 'blur' }
        ],
        paymentMethod: [
          { required: true, message: '请选择设备支付方式', trigger: 'change' }
        ],
        priceTerm: [
          { required: true, message: '请选择支付条款', trigger: 'change' }
        ],
        guaranteeDate: [
          { required: true, message: '请填写保修期/月', trigger: 'blur' },
          { type: 'number', message: '保修期为数字', trigger: 'blur' }
        ],
        guaranteeFee: [
          { required: true, message: '请填写维保率/月', trigger: 'blur' },
          { validator: checkFloatNum, trigger: 'blur' }
        ],
        aAmount: [
          { validator: checkAmountNum, trigger: 'blur' }
        ]
      },
      partInfoDtos: [],
      partInfoMultipleSelection: [],
      cargoOriginTableData: [],
      cargoLoading: false,
      cargoTableData: [],
      cargoInfoMultipleSelection: [],
      agentTableData: [],
      agentMultipleSelection: [],
      agentLoading: false,
      cargoInfoLoading: false,
      partInfoLoading: false,
      pageInfo: {
        pageSize: this.GLOBAL.pageSize,
        total: 0,
        currentPage: 1
      },
      cargoNameDisable: false,
      cargoNameData: [],
      searchData: {
        cargoName: ''
      },
      tableData: [],
      isVisible: false,
      isPreviewVisible: false,
      previewType: 1,
      searchName: '',
      isDisable: false,
      auditDisabled: true,
      purchaserAuditDisabled: true,
      generateDisabled: true,
      amountDisabled: true,
      jingbanrenBtn: false,
      agentInfoExp: '',
      jingBanRen: '',
      resultNotice: '',
      bidNotice: '',
      contract: '',
      confirmBtn: false,
      isConfirmVisible: false,
      contractUrl: ''
    }
  },
  created () {
    if (this.$route.params.projectId) {
      this.fetchDetailData(this.$route.params.projectId)
      this.fetchPartInfoExpData(this.$route.params.projectId)
    }
  },
  filters: {},
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ]),
    ...mapState('d2admin/page', [
      'opened',
      'current' // 用户获取当前页面的地址，用于关闭
    ])
  },
  watch: {
    listParams: {
      immediate: true, // 这句重要
      handler (val) {
        if (val) {
          if (val.type === 3) {
            this.isDisable = true
          }
        }
      }
    },
    info: {
      immediate: true, // 这句重要
      handler (val) {
        if (Object.keys(val).length) {
          this.fetchUserByRoleId()
          this.fetchInquiryInfo()
          this.fetchCargoInfoName()
          this.fetchAgentInfoData()
          if (this.listParams.type === 1) {
            this.agentTableData.push({
              agentId: this.info.partnerInfo.partnerId,
              status: 1,
              agentName: this.info.name,
              agentPoint: '0%',
              remark: ''
            })
          }
        }
      }
    },
    cargoTableData: {
      immediate: true, // 这句重要
      handler (val) {
        if (val.length) {
          // this.searchData.cargoName = this.form.cargoName
          this.searchData.cargoName = this.cargoTableData[0].cargoName
          this.cargoNameDisable = true
        } else {
          this.searchData.cargoName = ''
          this.cargoNameDisable = false
        }
      }
    }

  },
  methods: {
    ...mapActions('d2admin/page', [
      'close'
    ]),
    fetchInquiryInfo () {
      FetchInquiryInfo('get', {
        currentPage: this.pageInfo.currentPage || 1,
        pageSize: 10000,
        isDelete: 2,
        actor: this.info.username
      }).then((res) => {
        if (res.message === 'success') {
          let respondData = res.data
          this.inquiryInfoDtos = respondData.inquiryInfoDtos
        }
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    fetchCargoInfoName () {
      FetchGetCargoInfoName(this.info.username).then((res) => {
        if (res.message === 'success') {
          let respondData = res.data
          this.cargoNameData = respondData
        }
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    fetchDetailData (id) {
      FetchProjectInfo('get', id, true).then(async (res) => {
        if (res.message === 'success') {
          let respondData = res.data
          this.form = respondData
          this.form.quantity = respondData.quantity ? respondData.quantity : 1
          this.form.guaranteeDate = Number(respondData.guaranteeDate)
          this.form.guaranteeFee = respondData.guaranteeFee ? respondData.guaranteeFee.split('%')[0] : ''
          this.form.deliveryDateStatus = respondData.deliveryDateStatus
          this.agentInfoExp = respondData.agentInfoExp

          // 获取当前项目流程跟踪信息
          let flowParams = {
            businessType: 'projectAudit',
            businessId: respondData.projectId
          }
          let flowData = await fetchFlowData(flowParams)
          this.busiJbpmFlowDtos = flowData.busiJbpmFlowDtos

          // schedule: {
          //   supplierTime: '',
          //     purchaserTime: '',
          //     jingbanrenTime: '',
          //     confirmPurchaserTime: '',
          //     confirmBidTime: '',
          //     finishTime: ''
          // },
          let supplierNodeArray = []
          let purchaserNodeArray = []
          let jingbanrenNodeArray = []
          flowData.busiJbpmFlowDtos.forEach((item) => {
            switch (item.flowNodeName) {
              case '供应商拟稿':
                supplierNodeArray.push(item)
                break
              case '采购人初审':
                purchaserNodeArray.push(item)
                break
              case '招标中心经办人终审':
                jingbanrenNodeArray.push(item)
                break
            }
          })

          // 项目进度
          let currentFlowNode = flowData.busiJbpmFlowDtos[flowData.busiJbpmFlowDtos.length - 1]
          let currentFlowNodeName = currentFlowNode.flowNodeName
          let currentFlowStartTime = currentFlowNode.flowStartTime ? util.formatTime(currentFlowNode.flowStartTime).split(' ')[0] : ''
          let supplierFlowStartTime = supplierNodeArray.length ? supplierNodeArray[supplierNodeArray.length - 1].flowStartTime ? util.formatTime(supplierNodeArray[supplierNodeArray.length - 1].flowStartTime).split(' ')[0] : '' : ''
          let purchaserFlowStartTime = purchaserNodeArray.length ? purchaserNodeArray[purchaserNodeArray.length - 1].flowStartTime ? util.formatTime(purchaserNodeArray[purchaserNodeArray.length - 1].flowStartTime).split(' ')[0] : '' : ''
          let jingbanrenFlowStartTime = jingbanrenNodeArray.length ? jingbanrenNodeArray[jingbanrenNodeArray.length - 1].flowStartTime ? util.formatTime(jingbanrenNodeArray[jingbanrenNodeArray.length - 1].flowStartTime).split(' ')[0] : '' : ''
          switch (currentFlowNodeName) {
            case '供应商拟稿':
              this.schedule.supplierTime = currentFlowStartTime
              this.step = 1
              break
            case '采购人初审':
              this.step = 2
              this.schedule.supplierTime = supplierFlowStartTime
              this.schedule.purchaserTime = currentFlowStartTime
              break
            case '招标中心经办人终审':
              // if (Number(currentFlowNode.action) === 3) {
              //   this.step = 6
              //   this.schedule.supplierTime = supplierFlowStartTime
              //   this.schedule.purchaserTime = purchaserFlowStartTime
              //   this.schedule.jingbanrenTime = currentFlowStartTime
              //   this.schedule.confirmPurchaserTime = currentFlowStartTime
              //   this.schedule.confirmBidTime = currentFlowStartTime
              //   this.schedule.finishTime = currentFlowStartTime
              // } else if (Number(currentFlowNode.action) === 4) {
              //
              // }
              this.step = 3
              this.schedule.supplierTime = supplierFlowStartTime
              this.schedule.purchaserTime = purchaserFlowStartTime
              this.schedule.jingbanrenTime = currentFlowStartTime
              break
            case '采购人签收采购结果通知书':
              this.step = 3
              this.schedule.supplierTime = supplierFlowStartTime
              this.schedule.purchaserTime = purchaserFlowStartTime
              this.schedule.jingbanrenTime = currentFlowStartTime
              break
            case '代理商签收成交通知书':
              if (respondData.status === 5) { // 项目金额小于20W，不生成合同，直接结束
                this.step = 6
                this.schedule.supplierTime = supplierFlowStartTime
                this.schedule.purchaserTime = purchaserFlowStartTime
                this.schedule.jingbanrenTime = jingbanrenFlowStartTime
                this.schedule.confirmPurchaserTime = currentFlowStartTime
                this.schedule.confirmBidTime = currentFlowStartTime
                this.schedule.finishTime = currentFlowStartTime
              } else {
                this.step = 3
                this.schedule.supplierTime = supplierFlowStartTime
                this.schedule.purchaserTime = purchaserFlowStartTime
                this.schedule.jingbanrenTime = jingbanrenFlowStartTime
              }
              break
            case '采购人签收采购结果通知书及确认合同':
              if (respondData.status === 3) {
                this.step = 6
                this.schedule.supplierTime = supplierFlowStartTime
                this.schedule.purchaserTime = purchaserFlowStartTime
                this.schedule.jingbanrenTime = jingbanrenFlowStartTime
                this.schedule.confirmPurchaserTime = currentFlowStartTime
                this.schedule.confirmBidTime = currentFlowStartTime
                this.schedule.finishTime = currentFlowStartTime
              } else if (respondData.status === 4) {
                this.step = 4
                this.schedule.supplierTime = supplierFlowStartTime
                this.schedule.purchaserTime = purchaserFlowStartTime
                this.schedule.jingbanrenTime = jingbanrenFlowStartTime
              }
              break
          }

          let dataParams = {
            businessType: 'projectAudit',
            businessId: respondData.projectId,
            parentActor: this.info.username
          }
          let resData = await getDataAuditStatus(dataParams)
          if (resData) {
            this.auditData = resData
            if (this.info.roles[0].id === 1) { // 供应商
              this.isDisable = false
              this.auditDisabled = true
              this.purchaserAuditDisabled = true
              this.generateDisabled = true
              this.amountDisabled = true
            } else if (this.info.roles[0].id === 3) { // 采购人
              if (respondData.status === 3) {
                let contractPath = respondData.attachment_c.path
                this.contractUrl = util.fileUrl(contractPath)
                this.confirmBtn = true
              } else {
                this.isDisable = true
                this.auditDisabled = true
                this.purchaserAuditDisabled = false
                this.generateDisabled = true
                this.amountDisabled = true
              }
            } else if (this.info.roles[0].id === 5) { //  招标中心经办人
              this.isDisable = true
              this.auditDisabled = false
              this.purchaserAuditDisabled = true
              this.generateDisabled = true
              this.amountDisabled = false
            }
          } else {
            if (this.info.roles[0].id === 5 && respondData.status === 5) {
              this.isDisable = true
              this.auditDisabled = true
              this.purchaserAuditDisabled = true
              this.generateDisabled = false
              this.amountDisabled = true
            } else {
              this.isDisable = true
              this.auditDisabled = true
              this.purchaserAuditDisabled = true
              this.generateDisabled = true
              this.amountDisabled = true
            }
          }
          if (this.info.roles[0].id !== 1) {
            this.agentTableData = [this.agentInfoExp]
            this.$nextTick(() => { // 默认选中厂家
              this.$refs.agentTable.toggleRowSelection(this.agentTableData[0])
            })
          }
          // this.agentMultipleSelection = [res.agentInfoExp]
        }
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    formatterTime (row, column) {
      return row.flowStartTime ? util.formatTime(row.flowStartTime) : ''
    },
    // 获取供应商的代理商
    fetchAgentInfoData () {
      // this.agentLoading = true
      if (this.info.roles[0].id === 1) {
        let searchParams = {}
        // if (this.listParams.type === 2 || this.listParams.type === 3) {
        //   searchParams.projectId = this.$route.params.projectId
        // }
        FetchProGetAgentList(Object.assign({
          currentPage: 1,
          pageSize: 10000,
          isDelete: 2,
          status: 1,
          reviewStatus: 5,
          actor: this.info.username
        }, searchParams)).then((res) => {
          if (res.message === 'success') {
            let respondData = res.data
            this.agentTableData = respondData.agentInfoDtos
            this.agentTableData.unshift({
              agentId: this.info.partnerInfo.partnerId,
              status: 1,
              agentName: this.info.username,
              agentPoint: '0%',
              remark: ''
            })
            if (this.listParams.type === 1) { // 新建
              this.$nextTick(() => { // 默认选中厂家
                this.$refs.agentTable.toggleRowSelection(this.agentTableData[0])
              })
            } else {
              this.$nextTick(() => { // 默认选中厂家
                setTimeout(() => {
                  this.agentTableData.forEach(row => {
                    if (row.agentName === this.agentInfoExp.agentName && row.agentPoint === this.agentInfoExp.agentPoint) {
                      console.log('=======55555====', row)
                      row.remark = this.agentInfoExp.remark
                      this.$refs.agentTable.toggleRowSelection(row)
                    }
                  })
                }, 300)
              })
            }
          }
        }).catch((err) => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
      }
    },

    fetchPartInfoExpData (id) {
      this.cargoLoading = true
      FetchPartInfoExp('get', {
        currentPage: 1,
        pageSize: 10,
        isDelete: 2,
        projectId: id
      }).then((res) => {
        this.cargoLoading = false
        if (res.message === 'success') {
          let respondData = res.data
          this.cargoOriginTableData = respondData.partInfoExpDtos
          this.cargoTableData = JSON.parse(JSON.stringify(respondData.partInfoExpDtos))
        }
      }).catch((err) => {
        this.cargoLoading = false
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    /**
     * 获取招标中心经办人角色下的用户
     * */
    fetchUserByRoleId () {
      FetchUserByRoleId([5]).then((res) => {
        if (res.message === 'success') {
          let respondData = res.data
          this.jingBanRen = respondData[5]
        }
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    indexMethod (index) {
      return index + (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize + 1
    },
    tableRowClassName ({ row, rowIndex }) {
      row.row_index = rowIndex + (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize + 1
      if (rowIndex % 2 === 0) {
        return 'even-row'
      } else {
        return 'odd-row'
      }
    },
    handlePartInfoSelectionChange (row) {
      this.partInfoMultipleSelection = row
    },
    handleCargoInfoSelectionChange (row) {
      this.cargoInfoMultipleSelection = row
    },
    handleGuaranteeFeeInput (val) {
      let guaranteeFee = this.form.guaranteeFee ? this.form.guaranteeFee.split('%')[0] : 0
      let agentPoint = this.agentMultipleSelection[0].agentPoint ? this.agentMultipleSelection[0].agentPoint.split('%')[0] : 0
      // 计算项目总金额
      this.form.amount = (this.form.cargoTotal + this.form.cargoTotal * guaranteeFee * 0.01) * (1 + agentPoint * 0.01)
    },
    handleAmountRMB () {
      setTimeout(() => {
        console.log('33333')
        if (this.form.aAmount) {
          this.$set(this.form, 'amountRMB', this.form.aAmount * this.form.amount)
          if (this.form.amountRMB > 1000000) { // 大于100w 退回
            this.jingbanrenBtn = true
            this.$message({
              message: '项目金额超过100万元，请退回！！',
              type: 'error'
            })
          } else {
            this.jingbanrenBtn = false
          }
        } else {
          this.$message({
            message: '请填写汇率！',
            type: 'error'
          })
        }
      }, 800)
    },
    handleChangeCargoInfo () {
      if (this.partInfoMultipleSelection.length) {
        this.isVisible = false
        this.partInfoMultipleSelection.forEach(item => {
          item.isNew = true
          this.cargoOriginTableData.push(item)
          this.cargoTableData.push(JSON.parse(JSON.stringify(item)))
        })
        let tableTotal = 0
        this.cargoTableData.forEach(item => {
          tableTotal += Number(item.total)
        })
        // 计算货物总金额
        this.form.cargoTotal = tableTotal
        this.form.currency = this.cargoTableData[0].currency
        // 计算项目总金额
        let guaranteeFee = this.form.guaranteeFee ? this.form.guaranteeFee.split('%')[0] : 0
        let agentPoint = this.agentMultipleSelection[0].agentPoint ? this.agentMultipleSelection[0].agentPoint.split('%')[0] : 0
        this.form.amount = (this.form.cargoTotal + this.form.cargoTotal * guaranteeFee * 0.01) * (1 + agentPoint * 0.01)
      } else {
        this.$message({
          message: '请选择货物！',
          type: 'error'
        })
      }
    },
    handleSelect (selection, row) {
      if (selection.length > 1) {
        this.$refs.agentTable.toggleRowSelection(selection.shift(), false) // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
      }
      if (!selection.length) {
        this.$message({
          message: '必须选择一个代理商为推荐代理商！',
          type: 'error'
        })
        this.$refs.agentTable.toggleRowSelection(this.agentTableData[0], true)
      }
    },
    handleAgentSelectionChange (val) {
      this.agentMultipleSelection = val
      if (this.agentMultipleSelection.length) {
        // 计算项目总金额
        let guaranteeFee = this.form.guaranteeFee ? this.form.guaranteeFee.split('%')[0] : 0
        let agentPoint = this.agentMultipleSelection[0].agentPoint ? this.agentMultipleSelection[0].agentPoint.split('%')[0] : 0
        this.form.amount = (this.form.cargoTotal + this.form.cargoTotal * guaranteeFee * 0.01) * (1 + agentPoint * 0.01)
      }
    },
    /**
     * 获取货物配件列表
     */
    fetchPartInfoList () {
      this.partInfoLoading = true
      let searchParams = {}
      if (this.searchData.cargoName) {
        searchParams.cName = this.searchData.cargoName
        FetchPartInfo('get', Object.assign({
          // currentPage: this.pageInfo.currentPage || 1,
          // pageSize: this.pageInfo.pageSize,
          currentPage: 1,
          pageSize: 100000,
          isDelete: 2,
          actor: this.info.username,
          status: 5
        }, searchParams)).then((res) => {
          if (res.message === 'success') {
            let respondData = res.data
            let partInfoData = respondData.partInfoDtos
              .filter(item => !this.cargoOriginTableData.some(ele => ele.partId === item.partId))
            this.partInfoDtos = partInfoData
            this.pageInfo = {
              ...this.pageInfo,
              total: partInfoData.length,
              currentPage: respondData.statistics.currentPage
            }
          }
          this.partInfoLoading = false
        }).catch((err) => {
          this.partInfoLoading = false
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
      } else {
        this.$message({
          message: '请选择一个货物',
          type: 'error'
        })
      }
    },
    /**
     * 改变分页size
     */
    handleSizeChange (val) {
      this.pageInfo = {
        ...this.pageInfo,
        pageSize: val
      }
      this.fetchPartInfoList()
    },
    /**
     * 改变公页当前页
     */
    handleCurrentChange (val) {
      this.pageInfo = {
        ...this.pageInfo,
        currentPage: val
      }
      this.fetchPartInfoList()
    },
    // 价格验证
    handleBlur (event, row, index) {
      let currentData = this.cargoOriginTableData[index]
      if (!util.isMoneyExp(row.price)) {
        this.$message({
          type: 'error',
          message: '价格格式不对'
        })
        row.price = currentData.price
      } else {
        // 判断不能大于当前货物的单价
        if (Number(row.price) > Number(currentData.price)) {
          this.$message({
            type: 'error',
            message: '单价金额不得大于该货物的最高限价'
          })
          row.price = currentData.price
        }
      }
    },
    // 计算总价格
    handleInput (value, row) {
      row.total = (row.quantity * row.price)
      let tableTotal = 0
      this.cargoTableData.forEach(item => {
        tableTotal += Number(item.total)
      })
      this.form.cargoTotal = tableTotal
      this.form.currency = row.currency
    },
    handleDelete (index, row) {
      if (this.cargoInfoMultipleSelection.length === 1) {
        if (this.listParams.type === 1) {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.cargoTableData.splice(this.cargoInfoMultipleSelection[0].row_index - 1, 1)
            this.cargoOriginTableData.splice(this.cargoInfoMultipleSelection[0].row_index - 1, 1)
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else if (this.listParams.type === 2) {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            FetchPartInfoExp('delete', this.cargoInfoMultipleSelection[0].partId).then((res) => {
              this.cargoTableData.splice(this.cargoInfoMultipleSelection[0].row_index - 1, 1)
              this.cargoOriginTableData.splice(this.cargoInfoMultipleSelection[0].row_index - 1, 1)
              this.$message({
                message: '删除成功！',
                type: 'success'
              })
            }).catch((err) => {
              this.$message({
                message: err.message,
                type: 'error'
              })
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      } else {
        this.$message({
          type: 'info',
          message: '请选择一条需要删除的数据！'
        })
      }
    },
    handleAdd () {
      this.isVisible = true
      if (this.searchData.cargoName) {
        this.fetchPartInfoList()
      }
    },
    hideDialog () {
      this.dialogVisible = false
    },
    /**
     * 保存与提交审核
     * type 1：草稿 2：审核中 3：已完成 4：退回 5:一键生成
     * */
    handleSaveForm (formName, type) {
      if (this.auditData && this.info.roles[0].id === 5) {
        if (!this.form.aAmount) {
          this.$message({
            type: 'error',
            message: '请填写汇率！'
          })
          return false
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.form.deliveryDate) {
            this.$message({
              type: 'error',
              message: '请填写交货时间！'
            })
            return false
          }
          if (!this.cargoTableData.length) {
            this.$message({
              type: 'error',
              message: '请选择一个货物！'
            })
            return false
          }
          if (!this.agentMultipleSelection.length) {
            this.$message({
              type: 'error',
              message: '请选择一个推荐代理商！'
            })
            return false
          }
          let cargoTableData = []
          this.cargoTableData.forEach(item => {
            cargoTableData.push({
              partCode: item.partCode,
              partSerial: item.partSerial,
              partName: item.partName,
              standards: item.standards,
              manufactor: item.manufactor,
              techParams: item.techParams,
              unit: item.unit,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
              remark: item.remark
            })
          })
          let agentInfoExp = {
            oldAgentId: this.agentMultipleSelection[0].agentId,
            agentName: this.agentMultipleSelection[0].agentName,
            agentPoint: this.agentMultipleSelection[0].agentPoint,
            remark: this.agentMultipleSelection[0].remark
          }
          let params = {
            purchaser: this.form.inquiryInfo.purchaser,
            deliveryDate: this.form.deliveryDate,
            deliveryDateStatus: this.form.deliveryDateStatus,
            paymentMethod: this.form.paymentMethod,
            priceTerm: this.form.priceTerm,
            guaranteeDate: this.form.guaranteeDate,
            guaranteeFee: this.form.guaranteeFee + '%',
            amount: this.form.amount,
            quantity: this.form.quantity,
            status: type,
            creator: this.form.creator,
            projectCode: this.form.projectCode,
            projectSubject: this.form.projectSubject,
            cargoTotal: this.form.cargoTotal,
            currency: this.form.currency,
            cargoId: this.cargoTableData[0].cargoId,
            cargoName: this.cargoTableData[0].cargoName,
            inquiryInfo: {
              inquiryId: this.form.inquiryInfo.inquiryId
            },
            partInfoExps: cargoTableData,
            agentInfoExp: agentInfoExp
          }
          if (this.listParams.type === 1) {
            return new Promise((resolve, reject) => {
              FetchProjectInfo('post', params).then(async (res) => {
                if (res.message === 'success') {
                  let respondData = res.data
                  let flowData = {
                    businessType: 'projectAudit',
                    flowNodeName: '供应商拟稿',
                    businessSubject: respondData.projectSubject,
                    businessId: respondData.projectId,
                    parentActor: this.info.username,
                    action: type,
                    opinion: type === 1 ? '供应商拟稿' : '请审核',
                    nextActor: type === 1 ? this.info.username : respondData.purchaser
                  }
                  let auditData
                  if (type === 1) {
                    auditData = await fetchAuditData(flowData, type)
                  } else if (type === 2) { // 提交审核（添加两条审核数据，拟稿/提交审核）
                    await fetchAuditData(flowData, type)
                    auditData = await fetchStartModifyAuditData(flowData, type)
                  }
                  if (auditData) {
                    this.$message({
                      message: type === 2 ? '保存并提交项目成功！' : '保存项目成功！',
                      type: 'success'
                    })
                    this.resetForm('form')
                    this.handleClose()
                    resolve()
                  }
                }
              }).catch((err) => {
                this.$message({
                  message: err.message,
                  type: 'error'
                })
                reject(err)
              })
            })
          } else if (this.listParams.type === 2 || this.listParams.type === 3) {
            params.id = this.$route.params.projectId
            if (type === 3 || type === 4) {
              if (this.info.roles[0].id === 5) { // 招标中心经办人
                if (type === 3) {
                  if (this.form.amountRMB > 1000000) { // 大于100w 退回
                    this.jingbanrenBtn = true
                    this.$message({
                      message: '项目金额超过100万元，请退回！！',
                      type: 'error'
                    })
                    return false
                  } else {
                    this.jingbanrenBtn = false
                    this.$prompt('请输入审批意见:', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消'
                    }).then(({ value }) => {
                      if (this.form.amountRMB > 200000) { // 是否大于20w，小于20w,不生成合同
                        this.modifyData(params, type, value, true)
                      } else {
                        this.modifyData(params, type, value, false)
                      }
                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '取消审核'
                      })
                    })
                  }
                } else if (type === 4) {
                  this.$prompt('请输入审批意见:', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                  }).then(({ value }) => {
                    this.modifyData(params, type, value)
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '取消审核'
                    })
                  })
                }
              } else {
                this.$prompt('请输入审批意见:', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }).then(({ value }) => {
                  params.id = this.$route.params.projectId
                  this.modifyData(params, type, value)
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '取消审核'
                  })
                })
              }
            } else if (type === 5) {
              if (this.form.amountRMB > 200000) { // 是否大于20w，小于20w,不生成合同
                this.modifyData(params, type, '一键生成', true)
              } else {
                this.modifyData(params, type, '一键生成', false)
              }
            } else {
              this.modifyData(params, type)
            }
          }
        }
      })
    },
    /**
     * type 1草稿 2审核中 3同意 4退回 (5完成)
     * */
    modifyData (params, type, opinion, amountStatus) {
      if (this.info.roles[0].id === 5 && type === 3) {
        params.status = 5
      } else if (this.info.roles[0].id === 5 && type === 5 && amountStatus) {
        params.status = 3
      }
      FetchProjectInfo('put', params).then(async (res) => {
        if (res.message === 'success') {
          let respondData = res.data
          let nextActor = ''
          let flowNodeName = ''
          switch (this.info.roles[0].id) {
            case 1:
              if (type === 2) {
                nextActor = respondData.purchaser
              }
              flowNodeName = '供应商拟稿'
              break
            case 3:
              if (Number(this.auditData.action) === 3) {
                if (type === 3) {
                  nextActor = params.agentInfoExp.agentName
                } else if (type === 4) {
                  nextActor = respondData.creator // 不同意退回到拟稿
                }
                flowNodeName = '采购人签收采购结果通知书及确认合同'
              } else {
                if (type === 3) {
                  nextActor = this.jingBanRen
                } else if (type === 4) {
                  nextActor = respondData.creator
                }
                flowNodeName = '采购人初审'
              }
              break
            case 5:
              if (type === 4) {
                nextActor = respondData.purchaser
              } else if (type === 3) {
                if (amountStatus) { // 大于20w 生成合同,需要给采购人确认合同内容
                  nextActor = respondData.purchaser
                } else {
                  nextActor = ''
                }
              }
              flowNodeName = '招标中心经办人终审'
              break
          }
          let flowData = {
            businessType: 'projectAudit',
            flowNodeName: flowNodeName,
            businessSubject: respondData.projectSubject,
            businessId: respondData.projectId,
            parentActor: this.info.username,
            action: type,
            opinion: type === 1 ? '拟稿' : opinion || '请审核',
            nextActor: nextActor
          }
          if (type === 1) {
            this.$message({
              message: '保存项目信息成功！',
              type: 'success'
            })
            this.resetForm('form')
            this.handleClose()
          } else if (type === 2) {
            let auditData
            if (this.auditData && Number(this.auditData.action) === 4) { // 退回审核的情况 修改新增
              auditData = await modifyAndAddAuditData(flowData, type)
            } else { // 修改
              auditData = await fetchStartModifyAuditData(flowData, type)
            }
            if (auditData) {
              this.$message({
                message: '提交项目信息成功！',
                type: 'success'
              })
              this.resetForm('form')
              this.handleClose()
            }
          } else if (type === 3 || type === 4) {
            let auditData = await modifyAndAddAuditData(flowData, type)
            if (auditData) {
              this.$message({
                message: type === 3 ? '同意该项目信息！' : '退回该项目信息!',
                type: 'success'
              })
              if (params.status === 5) {
                this.generateFile(amountStatus)
                // this.resetForm('form')
                // this.handleClose()
              } else {
                this.resetForm('form')
                this.handleClose()
              }
            }
          } else if (type === 5) { // 一键生成
            // 采购结果通知书推送
            let flowPurchaserData = {
              businessType: 'projectAudit',
              flowNodeName: '采购人签收采购结果通知书',
              businessSubject: respondData.projectSubject,
              businessId: respondData.projectId,
              parentActor: this.info.username,
              action: 3,
              opinion: '签收采购结果通知书',
              nextActor: ''
            }
            // 成交结果通知书推送
            let flowBidsData = {
              businessType: 'projectAudit',
              flowNodeName: '代理商签收成交通知书',
              businessSubject: respondData.projectSubject,
              businessId: respondData.projectId,
              parentActor: this.info.username,
              action: 3,
              opinion: '签收成交通知书',
              nextActor: ''
            }
            if (amountStatus) { // 大于20w 推送合同
              // 合同通知书推送
              // let flowContractData = {
              //   businessType: 'projectAudit',
              //   flowNodeName: '采购人确认合同',
              //   businessSubject: respondData.projectSubject,
              //   businessId: respondData.projectId,
              //   parentActor: this.info.username,
              //   action: type,
              //   opinion: '请确认合同内容',
              //   nextActor: respondData.purchaser
              // }
              await fetchAuditData(flowPurchaserData, type)
              let auditData = await fetchAuditData(flowBidsData, type)
              // let auditData = await modifyAndAddAuditData(flowContractData, type)
              if (auditData) {
                this.$message({
                  message: '一键生成成功！',
                  type: 'success'
                })
                this.resetForm('form')
                this.handleClose()
              }
            } else {
              await fetchAuditData(flowPurchaserData, type)
              let auditData = await fetchAuditData(flowBidsData, type)
              if (auditData) {
                this.$message({
                  message: '一键生成成功！',
                  type: 'success'
                })
                this.resetForm('form')
                this.isPreviewVisible = false
                this.handleClose()
              }
            }
          }
        }
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    /**
     *一键生成 成交通知书 采购通知书 合同
     * */
    generateFile (amountStatus) {
      let projectId = this.$route.params.projectId
      const fetchResultNotice = new Promise((resolve, reject) => {
        GenerateResultNotice(projectId).then((res) => {
          if (res.message === 'success') {
            let respondData = res.data
            let resultNoticePath = respondData.attachment.path
            this.resultNotice = util.fileUrl(resultNoticePath)
            resolve()
          }
        }).catch((err) => {
          this.$message({
            message: err.message,
            type: 'error'
          })
          reject(err)
        })
      })
      const fetchBidNotice = new Promise((resolve, reject) => {
        GenerateBidNotice(projectId).then((res) => {
          if (res.message === 'success') {
            let respondData = res.data
            let bidNoticePath = respondData.attachment.path
            this.bidNotice = util.fileUrl(bidNoticePath)
            resolve()
          }
        }).catch((err) => {
          this.$message({
            message: err.message,
            type: 'error'
          })
          reject(err)
        })
      })

      Promise.all([fetchResultNotice, fetchBidNotice]).then(() => {
        if (amountStatus) { // 大于20w 生成合同
          GenerateContractNotice(projectId).then((res) => {
            if (res.message === 'success') {
              let respondData = res.data
              let contractPath = respondData.attachment.path
              this.contract = util.fileUrl(contractPath)
              this.isPreviewVisible = true
            }
          }).catch((err) => {
            this.$message({
              message: err.message,
              type: 'error'
            })
          })
        } else {
          this.isPreviewVisible = true
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleClose () {
      this.$store.dispatch('d2admin/menu/headerActivePathSet', '/projects')
      this.$router.push({ path: '/projects/list' })
      let tagName = this.current
      this.close({ tagName })
    },
    /**
     * 导出列表
     * 不传默认导出所有数据
     * 导出数据
     */
    handleExport () {
      let partIds = []
      this.cargoInfoMultipleSelection.forEach(item => {
        partIds.push(item.partId)
      })
      util.download('/projectInfo/partInfoExp/export', partIds.length ? partIds : '', 'POST')
    }
  }
}
</script>

<style lang="scss">

</style>
