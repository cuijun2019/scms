<template>
  <div class="container">
    <div class="wrapper-margin-bottom-15 ">
      <el-collapse v-model="basicActive">
        <el-collapse-item  name="1">
          <template slot="title">
            <div class="collapse-custom-header">
              <i class="line-icon"></i>
              <span class="header-title">基本信息</span>
            </div>
          </template>
          <div class="collapse-content">
            <div class="custom-form-con">
              <div class="form-con">
                <el-form :model="form" ref="form" size="medium" class="project-basic-form" label-width="120px">
                  <div class="form-container">
                    <div class="form-wrapper margin-right-45">
                      <el-form-item label="项目主题：">
                        <p>{{form.projectSubject}}</p>
                      </el-form-item>
                      <el-form-item label="成交代理商：">
                        <p>{{form.supplier}}</p>
                      </el-form-item>
                      <el-form-item label="创建人：">
                        <p>{{form.creator}}</p>
                      </el-form-item>
                      <el-form-item label="创建时间：">
                        <p>{{form.createDate}}</p>
                      </el-form-item>
                    </div>
                    <div class="form-wrapper margin-left-45">
                      <el-form-item label="项目编号：">
                        <p>{{form.projectCode}}</p>
                      </el-form-item>
                      <el-form-item label="采购人：">
                        <p>{{form.purchaser}}</p>
                      </el-form-item>
                      <el-form-item label="签收时间：">
                        <p>{{form.signDate}}</p>
                      </el-form-item>
                    </div>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="main-container">
      <div class="custom-header">
        <i class="line-icon"></i>
        <span class="header-title">合同内容</span>
      </div>
      <div class="main-content">
        <div class="main-preview">
          <iframe :src='"https://view.officeapps.live.com/op/view.aspx?src="+attachPath' width='100%' height='100%' sandbox="allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation allow-modals" frameborder=0 scrolling=auto></iframe>
        </div>
      </div>
      <div class="main-tool">
        <el-button class="form-close-btn btn-width-120" @click="handleClose">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>

import {
  FetchContractNotice
} from '@/api/sys.contract'
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
      basicActive: ['1'],
      form: {
        projectCode: '',
        projectSubject: '',
        supplier: '',
        amount: '',
        purchaser: '',
        creator: '',
        createDate: '',
        signDate: ''
      },
      attachPath: ''
    }
  },
  created () {
    if (this.$route.params.contractId) {
      this.fetchDetailData(this.$route.params.contractId)
    }
  },
  filters: {},
  watch: {
    listParams: {
      immediate: true, // 这句重要
      handler (val) {
        if (val) {
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
    fetchDetailData (id) {
      FetchContractNotice('get', id, true).then((res) => {
        if (res.message === 'success') {
          let respondData = res.data
          this.form = respondData
          this.form.createDate = respondData.createDate ? util.formatTime(respondData.createDate) : ''
          this.form.signDate = respondData.signDate ? util.formatTime(respondData.signDate) : ''
          this.attachPath = respondData.attachment ? util.fileUrl(respondData.attachment.path) : ''
        }
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
    },
    handleClose () {
      let tagName = this.current
      this.close({ tagName })
    }
  }
}
</script>

<style lang="scss">

</style>
