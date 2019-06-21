<!---->
<template>
  <div class="d-keyword">
    <div class="row">
      <div class="label">
        <span>*</span>
        <span>任务名称</span>
      </div>
      <div class="main">
        <el-input v-model="form.name" placeholder="请输入" clearable></el-input>
      </div>
    </div>
    <div class="row">
      <div class="label">
        <span>*</span>
        <span>任务简介</span>
      </div>
      <div class="main">
        <div>
          <el-input type="textarea" :rows="8" placeholder="示例：南宁某小区学位问题上访，人物组织关系分析任务！" v-model="form.keywords">
          </el-input>
        </div>
      </div>
    </div>
    <div class="end">
      <!--<input type="hidden" v-model="form.id">-->
      <el-button type="primary" @click="closeDialog('保存')">保 存</el-button>
      <el-button type="info" plain @click="closeDialog('取消')">取 消</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  data () {
    return {
      form: {
        name: '',
        keywords: '',
      },
    }
  },
  props: {
    type: {
      type: Number,
      default: 0 //0新增 1编辑
    },
    value: {
      type: Object,
      default: () => ({
        name: '',
        keywords: '',
      })
    },
  },
  methods: {
    closeDialog (str) {
      if (str === '保存') {
        if (!this.form.name) {
          this.$message({ showClose: true, message: '请输入名称', type: 'warning' });
          return;
        }
        if (!this.form.keywords) {
          this.$message({ showClose: true, message: '请输入关键词', type: 'warning' });
          return;
        }
      }
      this.$emit('closeDialog', { str: str, data: this.form });
    }
  },
  mounted () {
    this.form.name = '';
    this.form.keywords = '';
    if (this.type === 1) {
      for (let name in this.value) {
        this.form[name] = this.value[name];
      }
    }
  },
  components: {},
  computed: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.d-keyword {
  padding: 23px 50px 30px 40px;
}

.row {
  display: flex;
  margin: 10px 0;

  .label {
    width: 100px;
    line-height: 40px;

    span:nth-child(1) {
      color: red;
    }

    span:nth-child(2) {
      color: #000;
      font-weight: bold;
      font-size: 14px;
    }
  }

  .main {
    flex: 1;

    .hint {
      margin-top: 15px;
      color: #FA6722;
      font-size: 14px;
      line-height: 18px;
    }
  }
}

.end {
  margin-top: 30px;
  text-align: center;

  button {
    padding-left: 50px;
    padding-right: 50px;
  }
}
</style>
