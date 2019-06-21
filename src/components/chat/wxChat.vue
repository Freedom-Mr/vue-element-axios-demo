<style scoped>
    .wxchat-container{ width: 100%; height: 100%;z-index: 100; position: fixed; left:0; top: 0; overflow: hidden;}
    .shadow{ position: absolute; top:0; left: 0; z-index: 100; width: 100%; height: 100%; background: #000; opacity: .2; }
    .window {box-shadow: 1px 1px 20px -5px #000; /*max-width: 450px;*/ min-width: 300px; background: #F5F5F5; margin: 0 auto; overflow: hidden; padding: 0; height: 100%;position: relative;z-index: 101;}
    button{border:0; background:none; border-radius: 0;text-align: center;}
    button{outline:none;}
    .w100{width: 100%;}
    .mt5{margin-top: 5px;}
    .mt10{margin-top: 10px;}
    .mt20{margin-top: 20px;}
    .mb10{margin-bottom: 10px;}
    .mb20{margin-bottom: 20px;}
    .fs0{font-size: 0}
    .title{background: #000; text-align: center; color:#fff; width: 100%; height: 50px; line-height: 50px; font-size: 14px;}
    .loading,.no-more{text-align: center; color: #b0b0b0; line-height: 100px;}
    .no-more{line-height: 60px;}
    .pull-right{float: right;}
    .link-line{text-decoration: underline;}
    .message{
        /*height: 100%;*/
        padding: 10px 15px;
        /*overflow-y: scroll;*/
        /* background-color: #F5F5F5; */
    }
    .message li {
        margin-bottom: 15px;
        left:0;
        position: relative;
        display: block;
    }
    .message .time {
        margin: 10px 0;
        text-align: center;
    }
    .message .text {
        cursor: pointer;
        display: inline-block;
        position: relative;
        padding: 0 10px;
        max-width: calc(100% - 75px);
        min-height: 35px;
        line-height: 2.1;
        font-size: 15px;
        padding: 1px 10px;
        text-align: left;
        word-break: break-all;
        background-color: #91d6ea;
        color: #000;
        border-radius: 4px;
        box-shadow: 0px 1px 7px -5px #000;
    }
    .message .avatar {
        float: left;
        margin: 0 10px 0 0;
        border-radius: 3px;
        background: #fff;
        width: 32px;
        height: 38px;
    }
    .message .time>span {
        display: inline-block;
        padding: 0 5px;
        font-size: 12px;
        color: #fff;
        border-radius: 2px;
        background-color: #DADADA;
    }
    .message .system>span{
        padding: 4px 9px;
        text-align: left;
    }
    .message .text:before {
        content: " ";
        position: absolute;
        top: 9px;
        right: 100%;
        border: 6px solid transparent;
        border-right-color: #91d6ea;
    }
    .message .self {
        text-align: right;
    }
    .message .self .avatar {
        float: right;
        margin: 0 0 0 1px;
    }
    .message .self .text {
        background-color: #9EEA6A;
    }
    .message .self .text:before {
        right: inherit;
        left: 100%;
        border-right-color: transparent;
        border-left-color: #9EEA6A;
    }
    .message .image{
        max-width: 200px;
    }
    img.static-emotion-gif, img.static-emotion {
        vertical-align: middle !important;
    }
    .an-move-left{
        left: 0;
        animation: moveLeft .7s ease;
        -webkit-animation:moveLeft .7s ease;
    }
    .an-move-right{
        left: 0;
        animation: moveRight .7s ease;
        -webkit-animation:moveRight .7s ease;
    }
    .bgnone{
        background: none;
    }
    @keyframes moveRight{
        0%{left:-20px; opacity: 0};
        100%{left:0; opacity: 1}
    }
    @-webkit-keyframes moveRight
    {
        0%{left:-20px; opacity: 0};
        100%{left:0px; opacity: 1}
    }
    @keyframes moveLeft{
        0%{left:20px; opacity: 0};
        100%{left:0px; opacity: 1}
    }
    @-webkit-keyframes moveLeft
    {
        0%{left:20px; opacity: 0};
        100%{left:0px; opacity: 1}
    }
    @media (max-width: 367px){
        .fzDInfo{width:82%;}
    }
</style>

<template>
  <div>
    <div>
      <div class="message">
          <ul style="-webkit-padding-start: 10px;">
            <li v-for="(message, index) in dataArray" :key="message.id" :class="message.direction==2?'an-move-right':'an-move-left'">
              <p :class="message.direction==2?'an-move-right':'an-move-left'" class="time"> <span>账号：{{message.uid}} </span><span> 时间：{{message.pubtime}}</span></p>
              <p class="time system" v-if="message.type==10000"> <span v-html="message.content"></span> </p>
              <div :class="'main' + (message.direction==2?' self':'')" v-else>
                  <svg-icon class="avatar" icon-class="social_qq" v-if="message.msgType===0"></svg-icon>
                  <svg-icon class="avatar" icon-class="social_wx" v-else></svg-icon>
                  <!-- 文本 -->
                  <div class="text" @click="openDialog(message)" v-emotion="message.content" v-if="message.type==1"></div>

                  <!-- 图片 -->
                  <div class="text" v-else-if="message.type==2">
                      <img :src="message.content" class="image" alt="聊天图片">
                  </div>

                  <!-- 其他 -->
                  <div class="text" v-else-if="message.type!=10000" v-text="'[暂未支持的消息类型:'+ message.type +']\n\r' + message.content">

                  </div>
              </div>
            </li>
          </ul>
      </div>
    </div>
    <!--弹窗-->
    <el-dialog v-dialogDrag
      title="信息详情"
      :visible.sync="isShowDInfoDetail"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="600px"
      height="600px"
      top="50px">
      <DInfoDetail v-if="isShowDInfoDetail" :infoDetail="infoDetail" :msgType="infoType"></DInfoDetail>
    </el-dialog>
  </div>
</template>

<script>
import DInfoDetail from '@/views/dialog/d-infoDetail/d-infoDetail';
  export default {
    name: "wxChat",
    props: {
      data: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        dataArray: [],
        isShowDInfoDetail: false,
        infoDetail:{},
        infoType:0
      }
    },
    watch: {
        data: function (newVal, oldVal) {
             this.dataArray = []
             this.dataArray = this.dataArray.concat(this.data);
        }
    },
    created() {
      this.initData();
    },
    mounted(){
        this.initData();
    },
    methods: {
      initData(){
          this.dataArray = []
          this.dataArray = this.dataArray.concat(this.data);
      },
      openDialog(data) {
        console.log(data)
        if (data.content) {
          this.infoType = data.msgType
          this.infoDetail = data;
          this.isShowDInfoDetail = true;
        }
      },
    },
    components:{DInfoDetail},
  }
</script>
