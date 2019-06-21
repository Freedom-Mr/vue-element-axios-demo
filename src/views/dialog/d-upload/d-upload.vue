<!---->
<template>
  <div class="d-keyword">
    <div class="row">
      <div class="label">
        <span>*</span>
        <span>数据类型</span>
      </div>
      <div class="main">
        <el-select v-model="type" placeholder="请选择">
          <el-option label="账号好友" :value="1"></el-option>
          <el-option label="账号资料" :value="2"></el-option>
          <el-option label="账号加入群" :value="3"></el-option>
          <el-option label="群成员" :value="4"></el-option>
          <el-option label="群资料" :value="5"></el-option>
          <el-option label="账号私聊" :value="6"></el-option>
          <el-option label="账号群聊" :value="7"></el-option>
          <el-option label="群号群聊" :value="8"></el-option>
        </el-select>
      </div>
      <div class="label" style="margin-left: 33px;">
        <span>*</span>
        <span>通道类型</span>
      </div>
      <div class="main">
        <el-select v-model="msgType" placeholder="请选择">
          <el-option label="QQ" :value="0"></el-option>
          <el-option label="微信" :value="1"></el-option>
        </el-select>
      </div>
    </div>
    <div class="row">
      
    </div>
    <div class="row">
      <div class="label">
        <span>*</span>
        <span>上传文件</span>
      </div>
      <div class="main">
        <div style="float: left;">
          <el-upload class="upload-demo"
                    ref="uploadExcel"
                    :file-list="fileList"
                    :on-change="handleChange"
                    action='#' :limit="5000"
                    accept=".xls,.xlsx" :auto-upload="false"
                    multiple>
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <div class="upload-list">
            <div class="upload-list-son" v-for="(item,index) in new Array(0)" :key="index">
              <svg-icon icon-class="excel"></svg-icon>
              <div>{{item.name}}</div>
              <i class="el-icon-circle-close"></i>
            </div>
          </div>
        </div>
        <el-button size="small" class="a_but" style="display: inline-block;float: right;" @click="exportExample" type="primary">样例下载</el-button>
      </div>
    </div>
    <div class="end">
      <!--<input type="hidden" v-model="form.id">-->
      <el-button type="primary" @click="submitUpload('导入')">保 存</el-button>
      <el-button type="info" plain @click="submitUpload('取消')">取 消</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

import Code from '@/common/js/code'
  export default {
    data() {
      return {
        type: 1,
        accessory:'',
        uploadForm: new FormData(),
        fileList: [],
        msgType:0
      }
    },
    props: {
      eid: {
        type: Number,
        default: 0
      },
    },
    methods: {
      submitUpload(str) {
        if(str==='导入'){
          this.uploadForm.append('eventId', this.eid);
          this.uploadForm.append('dataType', this.type);
          this.uploadForm.append('msgType', this.msgType);
          console.log(this.uploadForm)
          setTimeout(()=>{
            this.$axios.post('/event/upload',this.uploadForm).then(res=>{
              if (res.data.code === Code.SUCCESS) {
                this.$emit('closeDialog', {code: 'SUCCESS',str: str});
                this.$message({
                  message: '导入成功',
                  type: 'success'
                })
                this.type=1
              }
            })
          },100)
        }else{
          this.$emit('closeDialog', {code: '取消',str: str});
        }
      },
      handleChange(file, fileList){
        console.log('243432423')
        console.log(file,fileList)
        this.uploadForm.append('file[]', file.raw)// 通过append向form对象添加数据
      },
      exportExample () {
        this.$axios.get(`/analysis/exportExample?dataType=${this.type}&msgType=${this.msgType}`, { responseType: "blob" }).then(res => {
          let blob = res.data
          let a = document.createElement("a")
          let url = window.URL.createObjectURL(blob);
          let fileName =''
          this.$axios.get(`/analysis/exportExampleName?dataType=${this.type}&msgType=${this.msgType}`).then(rs => {
            console.log(rs.data.data)
            fileName = rs.data.data;
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a)
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url)
          })
        }).catch((error) => {
          console.log(error)       //请求失败返回的数据
        })
      }
    },
    mounted() {
    },
    components: {},
    computed: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .d-keyword
    padding: 0px 10px 30px 40px
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
