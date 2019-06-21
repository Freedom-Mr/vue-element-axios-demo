<!---->
<template>
  <div class="d-keyword">
    <div class="row">
      <div class="label">
        <span>*</span>
        <span>选择类型</span>
      </div>
      <div class="main">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option
            v-for="item in uploadList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
    data() {
      return {
        form: {
          type: 1,
        },
        accessory:'',
        uploadList:[{
          value: '10',
          label: '账号好友量分布'
        }, {
          value: '11',
          label: '账号交互好友分布'
        }, {
          value: '12',
          label: '好友影响力分布'
        }, {
          value: '13',
          label: '账号加入群分布'
        }, {
          value: '14',
          label: '账号交互群分布'
        }, {
          value: '15',
          label: '账号成员量分布'
        }],
      }
    },
    props: {
      value: {
        type: Object,
        default: () => ({
          name: '',
          keywords: '',
        })
      },
    },
    methods: {
      uploadFile(data){
        console.log(data);
      },
      closeDialog(str) {
        if (str === '保存') {
          if (!this.form.type) {
            this.$message({showClose: true, message: '请选择类型', type: 'warning'});
            return;
          }
        }
        this.$emit('closeDialog', {str: str, data: this.form});
      }
    },
    mounted() {
      this.form.type = '';
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
  .d-keyword
    padding: 23px 10px 30px 40px
  .row
    display flex
    margin: 10px 0
    .label
      width 100px
      line-height: 40px
      span:nth-child(1)
        color red
      span:nth-child(2)
        color #000
        font-weight bold
        font-size 14px
    .main
      flex 1
      .hint
        margin-top: 15px;
        color: #FA6722;
        font-size: 14px;
        line-height: 18px;
  .end
    margin-top 30px
    text-align center
    button
      padding-left: 50px;
      padding-right: 50px;

  .upload-list
    overflow auto
    max-height: 300px;
    margin-top: 10px;
  .upload-list-son
    width: 200px;
    overflow: auto;
    height: 50px;
    padding: 0 18px 0 0;
    display: inline-flex;
    align-items: center;
    .svg-icon
      font-size 35px
      color #3a835d
      flex-shrink 0
    div
      display inline-block
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
      flex 1
      margin 0 8px
    i
      flex-shrink: 0;
      color: #c1bebe;
      cursor: pointer;
      font-size: 13px;
      &:hover
        color #c1322a
        font-size 14px
        .upload-list-son
          border 1px solid #c1322a;
</style>
