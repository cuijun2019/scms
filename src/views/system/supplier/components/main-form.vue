<template>
  <div class="container">
    <div class="wrapper-margin-bottom-15">
      <ul class="top-con">
        <li>
          <span>认证状态：</span>
          <span class="review-btn">{{form.authStatus == 1 ? '已认证' :'未认证'}}</span>
        </li>
        <li>
          <span>认证方式：</span>
          <span>{{form.authMethod}}</span>
        </li>
        <li>
          <span>认证时间：</span>
          <span>{{form.authDate ? form.authDate.substring(0,10):''}}</span>
        </li>
        <li>
          <span>企业名称：</span>
          <span>{{form.companyNo}}</span>
        </li>
      </ul>
    </div>
    <div class="wrapper-margin-bottom-15">
      <el-collapse v-model="supplierFormActive">
        <el-collapse-item  name="1">
          <template slot="title">
            <div class="collapse-custom-header">
              <i class="line-icon"></i>
              <span class="header-title">机构基本信息</span>
            </div>
          </template>
          <div class="collapse-content">
              <div class="form-con">
                <el-form :model="form" :rules="rules" ref="form" label-width="145px"  size="medium" class="project-basic-form">
                  <div class="">
                    <el-form-item label="交易主体类型：" prop="supType">
                      <p style="font-size: 16px">{{form.supType == 1 ? '供应商':'代理商'}}</p>
                    </el-form-item>
                    <div class="form-container">
                    <div class="form-wrapper margin-right-45">
                      <el-form-item label="单位名称：" prop="companyNo">
                        <el-input v-model="form.companyNo" clearable required :disabled="isDisable"></el-input>
                      </el-form-item>
                      <el-form-item label="行业分类：" prop="tradeCategory">
                        <el-input v-model="form.tradeCategory" clearable required :disabled="isDisable"></el-input>
                      </el-form-item>
                      <el-form-item label="注册资金：" prop="fund">
                        <el-input v-model.number="form.fund" clearable required :disabled="isDisable"></el-input>
                      </el-form-item>
                      <el-form-item label="注册资金单位：" prop="fundUnit">
                        <el-select v-model="form.fundUnit" placeholder="请选择注册资金单位：" clearable required :disabled="isDisable">
                          <el-option label="元" value="元"></el-option>
                          <el-option label="万元" value="万元"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="法人代表姓名：" prop="incorporator">
                        <el-input v-model="form.incorporator" clearable required :disabled="isDisable"></el-input>
                      </el-form-item>
                      <el-form-item label="详细地址：" prop="detailAddress">
                        <el-input v-model="form.detailAddress" clearable required :disabled="isDisable"></el-input>
                      </el-form-item>
                    </div>
                    <div class="form-wrapper margin-left-45">
                      <el-form-item label="企业性质：" prop="busiNature">
                        <el-select v-model="form.busiNature" placeholder="请选择企业性质" clearable required :disabled="isDisable">
                          <el-option
                            v-for="(item, index) in GLOBAL.hopeType"
                            :key="index"
                            :label="item.name"
                            :value="item.name">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="主营产品或业务：" prop="business">
                        <el-input v-model="form.business" clearable required :disabled="isDisable"></el-input>
                      </el-form-item>
                      <el-form-item label="注册资金币种：" prop="fundCurrency">
                        <el-select v-model="form.fundCurrency" placeholder="请选择币种" clearable required :disabled="isDisable">
                          <el-option
                            v-for="(item, index) in currencyData"
                            :key="index"
                            :label="item.name"
                            :value="item.name">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="企业人数：" prop="busiNumber">
                        <el-input v-model.number="form.busiNumber" clearable required :disabled="isDisable"></el-input>
                      </el-form-item>
                      <el-form-item label="证件号码：" prop="identification">
                        <el-input v-model="form.identification" clearable required :disabled="isDisable"></el-input>
                      </el-form-item>
                      <el-form-item label="机构注册地：" prop="domicile">
                        <el-radio-group v-model="form.domicile" :disabled="isDisable">
                          <el-radio :label="1">境内</el-radio>
                          <el-radio :label="2">境外</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="form-container">
                    <div class="form-wrapper margin-right-45">
                      <el-form-item label="邮政编码：" prop="zip">
                        <el-input v-model="form.zip" clearable required :disabled="isDisable"></el-input>
                      </el-form-item>
                      <el-form-item label="企业类别：" prop="busiType">
                        <el-radio-group v-model="form.busiType" :disabled="isDisable">
                          <el-radio :label="1">监狱企业</el-radio>
                          <el-radio :label="2">残疾人企业</el-radio>
                          <el-radio :label="3">中小微企业</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </div>
                    <div class="form-wrapper margin-left-45">
                      <el-form-item label="公司所在地" prop="address">
                        <el-cascader
                          :disabled="isDisable"
                          style="width: 100%"
                          placeholder="请选择公司所在省市区"
                          v-model="form.address"
                          :options="pcaData"
                          :props ="defaultProps"
                          ></el-cascader>
                      </el-form-item>
                      <el-form-item label="公司网址：" prop="website">
                        <el-input v-model="form.website" clearable required :disabled="isDisable"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div>
                    <el-form-item label="公司简介：" prop="introduce">
                      <el-input type="textarea"  v-model="form.introduce" clearable :disabled="isDisable"></el-input>
                    </el-form-item>
                  </div>
                  </div>
                </el-form>
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
             <span class="list-title">联系人</span>
           </div>
         </div>
         <div class="table-wrapper">
           <el-table
             :loading="loading"
             border
             size="medium"
             :row-class-name="tableRowClassName"
             style="width: 100%"
             height="260"
             :data="contactInfoList"
             @selection-change="handleSelectionChange">
             <el-table-column
               fixed
               label="序号"
               type="index"
               align="center"
               width="50">
             </el-table-column>
             <el-table-column
               prop="fullname"
               align="center">
               <template slot="header" slot-scope="scope">
                 <p class="mark">联系人姓名</p>
               </template>
               <template slot-scope="scope">
                 <el-form :model="scope.row" :rules="contactInfoRules" ref="fullnameForm">
                   <el-form-item prop="fullname">
                     <el-input v-model="scope.row.fullname" clearable required size="medium" :disabled="!scope.row.isSet"></el-input>
                   </el-form-item>
                 </el-form>
               </template>
             </el-table-column>
             <el-table-column
               prop="identification"
               align="center">
               <template slot="header" slot-scope="scope">
                 <p class="mark">身份证号码</p>
               </template>
               <template slot-scope="scope">
                 <el-form :model="scope.row" :rules="contactInfoRules" ref="identificationForm">
                   <el-form-item prop="identification">
                     <el-input v-model="scope.row.identification" clearable required size="medium" :disabled="!scope.row.isSet"></el-input>
                   </el-form-item>
                 </el-form>
               </template>
             </el-table-column>
             <el-table-column
               prop="post"
               label="职务"
               align="center">
               <template slot-scope="scope">
                 <el-form :model="scope.row">
                   <el-form-item prop="post">
                     <el-input v-model="scope.row.post" clearable  size="medium" :disabled="!scope.row.isSet"></el-input>
                   </el-form-item>
                 </el-form>
               </template>
             </el-table-column>
             <el-table-column
               prop="telephone"
               align="center">
               <template slot="header" slot-scope="scope">
                 <p class="mark">联系电话</p>
               </template>
               <template slot-scope="scope">
                 <el-form :model="scope.row" :rules="contactInfoRules" ref="telephoneForm">
                   <el-form-item prop="telephone">
                     <el-input v-model="scope.row.telephone" clearable required size="medium" :disabled="!scope.row.isSet"></el-input>
                   </el-form-item>
                 </el-form>
               </template>
             </el-table-column>
             <el-table-column
               prop="email"
               align="center">
               <template slot="header" slot-scope="scope">
                 <p class="mark">电子邮箱</p>
               </template>
               <template slot-scope="scope">
                 <el-form :model="scope.row" :rules="contactInfoRules" ref="emailForm">
                   <el-form-item prop="email">
                     <el-input v-model="scope.row.email" clearable required size="medium" :disabled="!scope.row.isSet"></el-input>
                   </el-form-item>
                 </el-form>
               </template>
             </el-table-column>
             <el-table-column
               prop="fax"
               align="center">
               <template slot="header" slot-scope="scope">
                 <p class="mark">传真号</p>
               </template>
               <template slot-scope="scope">
                 <el-form :model="scope.row" :rules="contactInfoRules" ref="faxForm">
                   <el-form-item prop="fax">
                     <el-input v-model="scope.row.fax" clearable required size="medium" :disabled="!scope.row.isSet"></el-input>
                   </el-form-item>
                 </el-form>
               </template>
             </el-table-column>
             <el-table-column width="80" fixed="right"  align="center" v-if="!isDisable">
               <template slot="header" slot-scope="scope">
                 <el-button class="tool-basic-btn" size="medium"  @click="handleAdd">新增</el-button>
               </template>
               <template slot-scope="scope">
                 <!--<el-button size="mini" class="tool-edit-btn" @click="handleEdit(scope.$index, scope.row)">{{scope.row.isSet?'保存':"修改"}}</el-button>-->
                 <el-button size="medium" class="tool-delete-btn" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
               </template>
             </el-table-column>
           </el-table>
         </div>
       </div>
     </div>
    <div class="main-con wrapper-margin-bottom-15 color-white">
      <div class="custom-header">
        <i class="line-icon"></i>
        <span class="header-title">开户银行信息</span>
        </div>
         <div class="form-con margin-top-15">
          <el-form :model="bankInfoForm" :rules="bankInfoRules" ref="bankInfoForm" label-width="190px"  size="medium" class="project-basic-form form-480">
            <el-form-item label="开户银行：" prop="depositBank">
              <el-input v-model="bankInfoForm.depositBank" clearable required :disabled="isDisable"></el-input>
            </el-form-item>
            <el-form-item label="银行基本账号：" prop="bankAccount">
              <el-input v-model="bankInfoForm.bankAccount" clearable required :disabled="isDisable"></el-input>
            </el-form-item>
            <el-form-item label="银行开户许可证附件：" prop="attachment.attachId">
              <el-link v-if="isDisable" style="font-size: 12px;" type="primary" @click="handleDownloadPhoto(bankInfoForm.attachment)">{{bankInfoForm.attachment ? bankInfoForm.attachment.attachName :'' }}</el-link>
              <div v-else>
                <el-upload
                  class="upload-container-inline"
                  ref="upload1"
                  action=""
                  :on-change="(file, fileList) => {handleFileChange(file, fileList, 1)}"
                  :on-remove="(file, fileList) => {handleRemove(file, fileList, 1)}"
                  :file-list="bankInfoFormFileList"
                  :limit="1"
                  :auto-upload="false">
                  <el-button size="mini"  type="primary" plain  style="width: 80px;">上传</el-button>
                </el-upload>
              </div>
            </el-form-item>
          </el-form>
         </div>
    </div>
    <div class="main-con color-white">
      <div class="custom-header">
        <i class="line-icon"></i>
        <span class="header-title">三证信息</span>
      </div>
      <div class="form-con margin-top-15">
        <el-form :model="certificateInfoForm" :rules="certificateInfoRules" ref="certificateInfoForm" label-width="190px"  size="medium" class="project-basic-form">
          <el-form-item label="是否三证合一：" prop="isCertificate">
            <el-radio v-model="certificateInfoForm.isCertificate" :label="1" :disabled="isDisable">是</el-radio>
            <el-radio v-model="certificateInfoForm.isCertificate" :label="2" :disabled="isDisable">否</el-radio>
          </el-form-item>
          <el-form-item label="社会信用代码：" prop="creditCode">
            <el-input v-model="certificateInfoForm.creditCode" clearable required style="width: 300px" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="营业执照副本附件：" prop="license.attachId">
            <el-link v-if="isDisable" style="font-size: 12px;" type="primary" @click="handleDownloadPhoto(certificateInfoForm.license)">{{certificateInfoForm.license ? certificateInfoForm.license.attachName  :''}}</el-link>
            <div v-else>
              <el-upload
                class="upload-container-inline"
                ref="upload2"
                action=""
                :on-change="(file, fileList) => {handleFileChange(file, fileList, 2)}"
                :on-remove="(file, fileList) => {handleRemove(file, fileList, 2)}"
                :file-list="licenseFileList"
                :limit="1"
                :auto-upload="false">
                <el-button size="mini"  type="primary" plain  style="width: 80px;">上传</el-button>
                <div slot="tip" class="upload-tip">请上传营业执照副本原件或彩色扫描件</div>
              </el-upload>
            </div>

          </el-form-item>
          <el-form-item label="法人身份证附件：" prop="identityCardFront.attachId">
           <div class="upload-pic-container">
             <el-image
               v-if="isDisable"
               style="width: 176px; height: 106px"
               :src="IDCardFontUrl">
             </el-image>
             <div class="upload-pic-con" v-else>
               <el-upload
                 class="upload-pic-wrapper"
                 action=""
                 list-type="picture-card"
                 :file-list="identityCardFrontFileList"
                 :on-change="(file, fileList) => {handleFileChange(file, fileList, 3)}"
                 :on-remove="(file, fileList) => {handleRemove(file, fileList, 3)}"
                 :limit="1"
                 :auto-upload="false"
                 accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
                 <div class="image-slot image-sfz-z">上传正面</div>
               </el-upload>
             </div>
             <el-image
               class="upload-margin"
               v-if="isDisable"
               style="width: 176px; height: 106px"
               :src="IDCardBackUrl">
             </el-image>
             <div class="upload-pic-con upload-margin" v-else>
               <el-upload
                 class="upload-pic-wrapper"
                 action=""
                 list-type="picture-card"
                 :file-list="identityCardBackFileList"
                 :on-change="(file, fileList) => {handleFileChange(file, fileList, 4)}"
                 :on-remove="(file, fileList) => {handleRemove(file, fileList, 4)}"
                 :limit="1"
                 :auto-upload="false"
                 accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
                 <div class="image-slot image-sfz-f">上传反面</div>
               </el-upload>
             </div>
             <div class="upload-pic-tips"    v-if="!isDisable">
               <p>注：</p>
               <div>
                 <p>
                   1.文件大小500k以内；
                 </p>
                 <p>
                   2.分别上传法人身份正面和反面彩色照片或彩色扫描件;
                 </p>
                 <p>
                   3.请您务必上传身份证原件照片，否则审核不通过。
                 </p>
               </div>
             </div>
           </div>
          </el-form-item>
          <el-form-item label="注册审核状态：" prop="authStatus">
           <p class="status-text">{{form.authStatus == 1 ? '已认证' :'未认证'}}</p>
          </el-form-item>
          <el-form-item label="变更审核状态：" prop="isAuditing">
           <p class="status-text">{{GLOBAL.statusTxt[form.isAuditing]}}</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-tool">
        <el-button class="form-submit-btn btn-width-120" v-if="!isDisable"  @click="handleSaveForm('form',2)">保存并提交</el-button>
        <el-button class="form-submit-btn btn-width-120" v-if="!auditDisabled" @click="handleSaveForm('form',3)">同意</el-button>
        <el-button class="form-submit-btn btn-width-120" v-if="!auditDisabled"  @click="handleSaveForm('form',4)">退回</el-button>
        <el-button class="form-close-btn btn-width-120" @click="handleClose">关闭</el-button>
      </div>
    </div>
    </div>
</template>

<script>
import { Upload } from '@/api/sys.global'
import { FetchSupplierInfo, FetchUpdatePartnerInfo } from '@/api/sys.supplier'// api
import { getDataAuditStatus, fetchAuditData, fetchStartModifyAuditData, modifyAndAddAuditData } from '@/libs/flowAudit'
import { FetchUserByRoleId } from '@/api/sys.system'
import util from '@/libs/util'
import pcaData from '@/libs/pca-code.json'
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
    let checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('联系人姓名不能为空！'))
      } else {
        callback()
      }
    }
    let checkIdCard = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('身份证号码不能为空！'))
      }
      setTimeout(() => {
        if (!util.isIdCardExp(value)) {
          callback(new Error('身份证号码格式不正确!'))
        } else {
          callback()
        }
      }, 800)
    }
    const telePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('联系电话不能为空!'))
      }
      setTimeout(() => {
        if (!util.isMobileTelExp(value)) {
          callback(new Error('请填写正确的手机或电话号码!'))
        } else {
          callback()
        }
      }, 800)
    }
    const fax = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('传真号码不能为空!'))
      }
      setTimeout(() => {
        if (!util.isFaxExp(value)) {
          callback(new Error('请填写正确的传真号码!'))
        } else {
          callback()
        }
      }, 800)
    }
    return {
      name: '',
      filename: '',
      loading: false,
      supplierFormActive: ['1'],
      currencyData: util.currency(),
      isDisable: false,
      auditDisabled: true,
      jingBanRen: '',
      jingbankezhang: '',
      auditData: {},
      bankUrl: '',
      bankInfoFormFile: {},
      bankInfoFormFileList: [],
      licenseFile: {},
      licenseFileList: [],
      identityCardFrontFile: {},
      identityCardFrontFileList: [],
      identityCardBackFile: {},
      identityCardBackFileList: [],
      licenseUrl: '',
      IDCardFontUrl: '',
      IDCardBackUrl: '',
      form: {
        partnerId: '',
        supType: '',
        companyNo: '',
        busiNature: '',
        tradeCategory: '',
        business: '',
        fund: '',
        fundCurrency: '',
        fundUnit: '',
        busiNumber: '',
        incorporator: '',
        identification: '',
        detailAddress: '',
        domicile: '',
        address: '',
        zip: '',
        website: '',
        busiType: '',
        introduce: '',
        authStatus: '',
        authMethod: '',
        authDate: '',
        isDelete: '',
        isAuditing: ''
      },
      rules: {
        companyNo: [
          { required: true, message: '请填写单位名称', trigger: 'blur' }
        ],
        busiNature: [
          { required: true, message: '请选择企业性质', trigger: 'change' }
        ],
        fund: [
          { required: true, message: '请填写注册资金', trigger: 'blur' }
        ],
        fundCurrency: [
          { required: true, message: '请选择资金币种', trigger: 'change' }
        ],
        fundUnit: [
          { required: true, message: '请填写注册资金单位', trigger: 'blur' }
        ],
        busiNumber: [
          { required: true, message: '请填写企业人数', trigger: 'blur' }
        ],
        incorporator: [
          { required: true, message: '请填写法人代表姓名', trigger: 'blur' }
        ],
        identification: [
          { required: true, message: '请填写证件号码', trigger: 'blur' }
        ],
        detailAddress: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ],
        domicile: [
          { required: true, message: '请选择机构注册地', trigger: 'change' }
        ],
        website: [
          { required: true, message: '请填写公司网址', trigger: 'blur' }
        ]
      },
      contactInfoList: [{
        fullname: '姓名',
        identification: '44098111111111',
        post: '职务',
        telephone: '1234567890',
        email: '1111@qq.com',
        fax: '1111',
        isSet: false
      }],
      // table input框失焦校验
      contactInfoRules: {
        fullname: [
          { required: true, message: '请填写联系人姓名', trigger: 'blur' },
          { validator: checkName, trigger: ['blur', 'change'] }
        ],
        identification: [
          { required: true, message: '请填写身份证号码', trigger: 'blur' },
          { validator: checkIdCard, trigger: ['blur', 'change'] }
        ],
        telephone: [
          { required: true, message: '请填写联系电话', trigger: 'blur' },
          { validator: telePhone, trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, message: '请填写电子邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        fax: [
          { required: true, message: '请填写传真号', trigger: 'blur' },
          { validator: fax, trigger: ['blur', 'change'] }
        ]
      },
      bankInfoForm: {
        bankId: '',
        depositBank: '',
        bankAccount: '',
        attachment: {
          attachId: ''
        },
        file: {}
      },
      bankInfoRules: {
        depositBank: [
          { required: true, message: '请填写开户银行', trigger: 'blur' }
        ],
        bankAccount: [
          { required: true, message: '请填写银行基本账号', trigger: 'blur' }
        ],
        'attachment.attachId': [
          { required: true, message: '银行开户许可证附件', trigger: 'change' }
        ]
      },
      certificateInfoForm: {
        certificateId: '',
        isCertificate: '',
        creditCode: '',
        licenseFile: {},
        licenseFileList: [],
        license: {
          attachId: ''
        },
        identityCardFrontFile: {},
        identityCardFront: {
          attachId: ''
        },
        identityCardBackFile: {},
        identityCardBack: {
          attachId: ''
        }
      },
      certificateInfoRules: {
        isCertificate: [
          { required: true, message: '请选择是否三证合一', trigger: 'blur' }
        ],
        creditCode: [
          { required: true, message: '请填写社会信用代码', trigger: 'blur' }
        ],
        'license.attachId': [
          { required: true, message: '请上传营业执照副本附件', trigger: 'change' }
        ],
        'identityCardFront.attachId': [
          { required: true, message: '请上传法人身份证附件正面', trigger: 'change' }
        ],
        'identityCardBack.attachId': [
          { required: true, message: '请上传法人身份证附件反面', trigger: 'change' }
        ]
      },
      isVisible: false,
      boxParams: {},
      searchName: '',
      brandData: [],
      pcaData: pcaData,
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'name'
      },
      selectOrg: {
        orgsId: []
      },
      multipleSelection: [],
      pageInfo: {
        pageSize: this.GLOBAL.pageSize,
        total: 0,
        currentPage: 1
      }
    }
  },
  created () {
    if (this.$route.params.partnerId) {
      this.fetchDetailData(this.$route.params.partnerId)
    }
  },
  filters: {},
  watch: {
    listParams: {
      immediate: true, // 这句重要
      handler (val) {
        if (val) {
          if (val.type === 3) {
            this.isDisable = true
          } else if (val.type === 4) {
            this.isDisable = true
          } else if (val.type === 1) {
            this.isDisable = true
          }
        }
      }
    },
    info: {
      immediate: true, // 这句重要
      handler (val) {
        if (Object.keys(val).length) {
          if (this.listParams.type !== 4) {
            this.fetchDetailData(val.partnerInfo.partnerId)
          }
          this.fetchUserByRoleId()
          if (val.roles[0].id === 5 || val.roles[0].id === 6) {
            this.auditDisabled = false
          }
        }
      }
    }

  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ]),
    ...mapState('d2admin/page', [
      'opened',
      'current' // 用户获取当前页面的地址，用于关闭
    ])
  },
  methods: {
    ...mapActions('d2admin/page', [
      'close'
    ]),
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    fetchDetailData (id) {
      FetchSupplierInfo('get', id, true).then(async (res) => {
        if (res.message === 'success') {
          let respondData = res.data
          this.form = respondData
          this.form.address = respondData.address ? respondData.address.split(',') : ''
          respondData.contactInfoList.forEach(item => {
            item.isSet = !this.isDisable
          })
          this.contactInfoList = respondData.contactInfoList
          this.bankInfoForm = respondData.bankInfo
          this.certificateInfoForm = respondData.certificateInfo
          // this.IDCardFontUrl = (this.certificateInfoForm.identityCardFront.path).replace(/\/data\/nginx\/html/, 'http://47.105.181.143:83')
          if (respondData.bankInfo) {
            if (respondData.bankInfo.attachment) {
              this.bankUrl = util.fileUrl(this.bankInfoForm.attachment.path)
              this.bankInfoFormFileList = [{
                name: respondData.bankInfo.attachment.attachName,
                url: this.bankUrl
              }]
            }
          }
          if (respondData.certificateInfo) {
            if (respondData.certificateInfo.license) {
              this.licenseUrl = util.fileUrl(respondData.certificateInfo.license.path)
              this.licenseFileList = [{
                name: respondData.certificateInfo.license.attachName,
                url: this.licenseUrl
              }]
            }
            if (respondData.certificateInfo.identityCardFront) {
              this.IDCardFontUrl = util.fileUrl(respondData.certificateInfo.identityCardFront.path)
              this.identityCardFrontFileList = [{
                name: respondData.certificateInfo.identityCardFront.attachName,
                url: this.IDCardFontUrl
              }]
            }
            if (respondData.certificateInfo.identityCardBack) {
              this.IDCardBackUrl = util.fileUrl(respondData.certificateInfo.identityCardBack.path)
              this.identityCardBackFileList = [{
                name: respondData.certificateInfo.identityCardBack.attachName,
                url: this.IDCardBackUrl
              }]
            }
          }
          let dataParams = {
            businessType: 'registerAudit',
            businessId: respondData.partnerId,
            parentActor: this.info.username
          }
          let resData = await getDataAuditStatus(dataParams)
          if (resData) {
            this.auditData = resData
            if (this.listParams.type === 1) {
              this.isDisable = true
              this.auditDisabled = true
            } else {
              if (this.info.roles[0].id === 1 || this.info.roles[0].id === 2) { // 供应商 代理商
                this.isDisable = false
              } else if (this.info.roles[0].id === 5) { // 招标中心经办人
                this.isDisable = true
                this.auditDisabled = false
              } else if (this.info.roles[0].id === 6) { // 招标中心科长
                this.isDisable = true
                this.auditDisabled = false
              }
            }
          } else {
            if (this.listParams.type === 2 && (respondData.isAuditing === 1 || respondData.isAuditing === 5)) {
              this.isDisable = false
              this.auditDisabled = true
            } else {
              this.isDisable = true
              this.auditDisabled = true
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
     * 获取招标中心经办人角色下的用户
     * */
    fetchUserByRoleId () {
      FetchUserByRoleId([5, 6]).then((res) => {
        if (res.message === 'success') {
          let respondData = res.data
          this.jingBanRen = respondData[5]
          this.jingbankezhang = respondData[6]
        }
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
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
      this.fetchPartListData()
    },
    /**
     * 改变公页当前页
     */
    handleCurrentChange (val) {
      this.pageInfo = {
        ...this.pageInfo,
        currentPage: val
      }
      this.fetchPartListData()
    },
    handleFileChange (file, fileList, type) {
      console.log('====file', file)
      switch (type) {
        case 1:
          this.bankInfoFormFile = file.raw
          break
        case 2 :
          this.licenseFile = file.row
          break
        case 3 :
          this.identityCardFrontFile = file.row
          break
        case 4 :
          this.identityCardBackFile = file.row
          break
      }
      let formData = new FormData()
      formData.append('file', file.raw)
      Upload(formData).then((res) => {
        if (res.message === 'success') {
          let respondData = res.data
          let resObj = {
            attachId: respondData.attachId,
            fileType: respondData.fileType,
            uploader: respondData.uploader,
            attachName: respondData.attachName,
            attachSize: respondData.attachSize,
            uploadTime: respondData.uploadTime,
            path: respondData.path
          }
          switch (type) {
            case 1:
              this.bankInfoForm.attachment = resObj
              break
            case 2 :
              this.certificateInfoForm.license = resObj
              break
            case 3 :
              this.certificateInfoForm.identityCardFront = resObj
              break
            case 4 :
              this.certificateInfoForm.identityCardBack = resObj
              break
          }
        }
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    handleRemove (file, fileList, type) {
      switch (type) {
        case 1:
          this.bankInfoFormFile = ''
          break
        case 2 :
          this.licenseFile = ''
          break
        case 3 :
          this.identityCardFrontFile = ''
          break
        case 4 :
          this.identityCardBackFile = ''
          break
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      row.row_index = rowIndex
      if (rowIndex % 2 === 0) {
        return 'even-row'
      } else {
        return 'odd-row'
      }
    },
    handleEdit (index, row) {
      if (row.isSet) { // 保存
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        row.isSet = false
      } else { // 修改
        row.isSet = true
      }
    },
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.contactInfoList.splice(index, 1)
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
      }).catch((err) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleAdd () {
      let addObj = { fullname: '', identification: '', post: '', telephone: '', email: '', fax: '', isSet: true }
      this.contactInfoList.push(addObj)
    },
    /**
     * 提交表单
     *  type 1草稿 2审核中 3同意 4退回 (5完成)
     * @param
     */
    handleSaveForm (formName, type) {
      // 验证三个 form
      const form1 = new Promise((resolve, reject) => {
        this.$refs['form'].validate(valid => {
          if (valid) resolve()
        })
      })
      const form2 = new Promise((resolve, reject) => {
        this.$refs['bankInfoForm'].validate(valid => {
          if (valid) resolve()
        })
      })

      const form3 = new Promise((resolve, reject) => {
        this.$refs['certificateInfoForm'].validate(valid => {
          if (valid) resolve()
        })
      })

      const form4 = new Promise((resolve, reject) => {
        this.$refs['fullnameForm'].validate(valid => {
          if (valid) {
            resolve()
          } else {
            this.$message({
              message: '请填写联系人姓名！',
              type: 'error'
            })
          }
        })
      })
      const form5 = new Promise((resolve, reject) => {
        this.$refs['identificationForm'].validate(valid => {
          if (valid) {
            resolve()
          } else {
            this.$message({
              message: '联系人身份证号码格式不正确或空！',
              type: 'error'
            })
          }
        })
      })

      const form6 = new Promise((resolve, reject) => {
        this.$refs['telephoneForm'].validate(valid => {
          if (valid) {
            resolve()
          } else {
            this.$message({
              message: '联系人联系电话格式不正确或空！',
              type: 'error'
            })
          }
        })
      })
      const form7 = new Promise((resolve, reject) => {
        this.$refs['emailForm'].validate(valid => {
          if (valid) {
            resolve()
          } else {
            this.$message({
              message: '联系人电子邮箱格式不正确或空！',
              type: 'error'
            })
          }
        })
      })
      const form8 = new Promise((resolve, reject) => {
        this.$refs['faxForm'].validate(valid => {
          if (valid) {
            resolve()
          } else {
            this.$message({
              message: '联系人传真格式不正确或空！',
              type: 'error'
            })
          }
        })
      })

      Promise.all([form1, form2, form3, form4, form5, form6, form7, form8]).then(() => {
        if (!this.contactInfoList.length) {
          this.$message({
            message: '请填写联系人信息！',
            type: 'error'
          })
          return false
        }
        let bankInfo = {
          partnerId: this.form.partnerId,
          bankId: this.bankInfoForm.bankId,
          depositBank: this.bankInfoForm.depositBank,
          bankAccount: this.bankInfoForm.bankAccount,
          attachment: {
            attachId: this.bankInfoForm.attachment.attachId,
            fileType: this.bankInfoForm.attachment.fileType,
            uploader: this.bankInfoForm.attachment.uploader,
            attachName: this.bankInfoForm.attachment.attachName,
            attachSize: this.bankInfoForm.attachment.attachSize,
            uploadTime: this.bankInfoForm.attachment.uploadTime,
            path: this.bankInfoForm.attachment.path
          }
        }
        let certificateInfo = {
          partnerId: this.form.partnerId,
          certificateId: this.certificateInfoForm.certificateId,
          isCertificate: this.certificateInfoForm.isCertificate,
          creditCode: this.certificateInfoForm.creditCode,
          license: {
            attachId: this.certificateInfoForm.license.attachId,
            attachName: this.certificateInfoForm.license.attachName,
            attachSize: this.certificateInfoForm.license.attachSize,
            fileType: this.certificateInfoForm.license.fileType,
            path: this.certificateInfoForm.license.path,
            uploadTime: this.certificateInfoForm.license.uploadTime,
            uploader: this.certificateInfoForm.license.uploader
          },
          identityCardFront: {
            attachId: this.certificateInfoForm.identityCardFront.attachId,
            attachName: this.certificateInfoForm.identityCardFront.attachName,
            attachSize: this.certificateInfoForm.identityCardFront.attachSize,
            fileType: this.certificateInfoForm.identityCardFront.fileType,
            path: this.certificateInfoForm.identityCardFront.path,
            uploadTime: this.certificateInfoForm.identityCardFront.uploadTime,
            uploader: this.certificateInfoForm.identityCardFront.uploader
          },
          identityCardBack: {
            attachId: this.certificateInfoForm.identityCardBack.attachId,
            attachName: this.certificateInfoForm.identityCardBack.attachName,
            attachSize: this.certificateInfoForm.identityCardBack.attachSize,
            fileType: this.certificateInfoForm.identityCardBack.fileType,
            path: this.certificateInfoForm.identityCardBack.path,
            uploadTime: this.certificateInfoForm.identityCardBack.uploadTime,
            uploader: this.certificateInfoForm.identityCardBack.uploader
          }
        }
        let params = {
          partnerId: this.form.partnerId,
          supType: this.form.supType,
          companyNo: this.form.companyNo,
          busiNature: this.form.busiNature,
          tradeCategory: this.form.tradeCategory,
          business: this.form.business,
          fund: this.form.fund,
          fundCurrency: this.form.fundCurrency,
          fundUnit: this.form.fundUnit,
          busiNumber: this.form.busiNumber,
          incorporator: this.form.incorporator,
          identification: this.form.identification,
          detailAddress: this.form.detailAddress,
          domicile: this.form.domicile,
          address: (this.form.address).join(','),
          zip: this.form.zip,
          website: this.form.website,
          busiType: this.form.busiType,
          introduce: this.form.introduce,
          authStatus: this.form.authStatus,
          authMethod: this.form.authMethod,
          authDate: this.form.authDate,
          isDelete: this.form.isDelete,
          contactInfoList: this.contactInfoList,
          bankInfo: bankInfo,
          certificateInfo: certificateInfo,
          isAuditing: type
        }
        if (this.info.roles[0].id === 6 && type === 3) {
          params.isAuditing = 5
        }
        return new Promise((resolve, reject) => {
          FetchUpdatePartnerInfo(params).then(async (res) => {
            // if (res.message === 'success') {
            //   let respondData = res.data
            // console.log(888, res)
            // this.$message({
            //   message: '我的信息变更成功！',
            //   type: 'success'
            // })
            // this.handleClose()
            // }
            // if (res.message === 'success') {
            let respondData = res.data
            let flowData = {
              businessType: 'registerAudit',
              businessSubject: respondData.certificateInfo.creditCode,
              businessId: respondData.partnerId,
              flowNodeName: '注册信息变更',
              parentActor: this.info.username,
              action: type,
              opinion: '请审核',
              nextActor: this.jingBanRen
            }
            if (type === 2) { // 提交审核（添加两条审核数据，拟稿/提交审核）
              await fetchAuditData(flowData, type)
              let auditData = await fetchStartModifyAuditData(flowData, type)
              if (auditData) {
                this.$message({
                  message: '保存并提交我的信息成功！',
                  type: 'success'
                })
                this.handleClose()
                resolve()
              }
            } else if (type === 3 || type === 4) {
              this.$prompt('请输入审批意见:', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(async ({ opinion }) => {
                let nextActor = ''
                let flowNodeName = ''
                switch (this.info.roles[0].id) {
                  case 5:
                    if (type === 3) {
                      nextActor = this.jingbankezhang
                    } else if (type === 4) {
                      nextActor = respondData.certificateInfo.creditCode
                    }
                    flowNodeName = '招标中心经办人审核'
                    break
                  case 6:
                    if (type === 4) {
                      nextActor = this.jingBanRen
                    }
                    flowNodeName = '招标中心科长复核'
                    break
                }
                let flowData = {
                  businessType: 'registerAudit',
                  businessSubject: respondData.certificateInfo.creditCode,
                  businessId: respondData.partnerId,
                  flowNodeName: flowNodeName,
                  parentActor: this.info.username,
                  action: type,
                  opinion: opinion || '请审核',
                  nextActor: nextActor
                }
                let auditData = await modifyAndAddAuditData(flowData, type)
                if (auditData) {
                  this.$message({
                    message: type === 3 ? '同意该注册信息变更！！' : '退回该注册信息变更!',
                    type: 'success'
                  })
                  this.handleClose()
                }
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消审核'
                })
              })
            }

            // }
          }).catch((err) => {
            this.$message({ message: err.message, type: 'error' })
            reject(err)
          })
        })
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleClose () {
      if (this.listParams.type === 3) {
        this.$store.dispatch('d2admin/menu/headerActivePathSet', '/supplier')
        this.$router.push({ path: '/supplier/list' })
      }
      let tagName = this.current
      this.close({ tagName })
    },
    /**
     * 下载图片
     * */
    handleDownloadPhoto (fileData) {
      util.download('/download/' + fileData.attachId)
    }
  }
}
</script>

<style lang="scss" >
  .top-con{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 15px;
    height: 46px;
    background-color: #ffffff;
    font-size: 16px;
    li{
      margin-right: 45px;
    }
    .review-btn{
      display: inline-block;
      border: 1px solid #03BC92;
      padding: 0px 6px;
      border-radius: 4px;
      color: #03BC92;
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
  .form-tool{
    margin: 10px 15px 30px;
    display: flex;
    justify-content: center;
    align-items: center;
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
  .main-con{
    padding-bottom: 15px;
  }
  .upload-tip{
    padding-left: 15px;
   color: #FF0707;
    font-size: 12px;
  }
  .upload-pic-container{
    display: flex;
    justify-content: flex-start;
    align-items: center
  }
  .upload-pic-con{
    width: 176px;
    text-align: center;
    overflow: hidden;
  }
  .upload-pic-wrapper{
    width: 100%;
    height: 106px;
    overflow: hidden;
  }
  .upload-pic-btn{
    margin: 10px 0;
  }
  .upload-margin{
    margin-left: 15px;
  }
  .upload-pic-tips{
    display: flex;
    justify-content: flex-start;
    margin-top: -45px;
    margin-left: 15px;
    p{
      color: #FF0707;
      font-size: 12px;
      line-height: 18px;
    }
  }
  .status-text{
    color: #03BC92;
  }
  .el-upload--picture-card{
    width: 176px;
    height: 106px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
   .el-upload-list--picture-card .el-upload-list__item{
     width: 176px;
     height: 106px;
   }
</style>
