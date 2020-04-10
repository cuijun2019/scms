<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <div class="form-basic-container">
        <el-divider content-position="left">基本信息</el-divider>
        <el-form :model="form" ref="ruleForm" label-width="140px" class="form-basic-wrapper" size="small">
          <div class="form-item">
            <el-form-item label="采购结果通知书主题" >
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="关联方案">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="form-item">
            <el-form-item label="厂家名称">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="中标代理商">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </div>
          <div class="form-item">
            <el-form-item label="采购经办人">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="当前状态">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </div>
          <div class="form-item">
            <el-form-item label="创建人">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
        <div class="form-main-container">
          <div class="form-main-header">
            <p>中标通知书内容</p>
            <div>
              <el-button type="primary" size="mini">电子签章</el-button>
              <el-select v-model="value" clearable placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <quill-editor ref="text" v-model="content" class="my-quill-editor" :options="editorOption" />
        </div>
      <!--<el-button type="primary" @click="submit">提交</el-button>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">重置</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="mini">保存</el-button>
        <el-button type="primary" @click="dialogVisible = false" size="mini">保存并发送代理商</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'modify-box',
  components: {
    quillEditor
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
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
      value: '',
      content: '',
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
      editorOption: {}
    }
  },
  created () {
  },
  filters: {},
  watch: {
    boxParams: {
      immediate: true, // 这句重要
      handler (val) {
        if (val) {
        }
      }

    }

  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    submit () {
      console.log(this.$refs.text.value)
    }
  }
}
</script>

<style lang="scss">

</style>
