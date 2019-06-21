<template >
 <div class="assets">
    <div class="topFrame" >
      <div style="float: left;margin: 9px 2%;color: #fff;font-size: 28px;letter-spacing: 8px;width: 18%;text-align: center;">数据资产</div>
      <div style="float: left;height: 58px;overflow: hidden;" class="top_data_font">
        <div style="width: 18%;"><span>信息总量</span><span>23亿</span></div>
        <div><span>本周</span><span>8623</span><span>环比<img src="../../common/image/png/上升.png">85%</span></div>
        <div><span>本月</span><span>6574</span><span>环比<img src="../../common/image/png/下降.png">39%</span></div>
        <div><span>本年</span><span>4354</span><span>环比<img src="../../common/image/png/上升.png">47%</span></div>
      </div>
      <div class="top_time_font">{{nowDate| formatDate}}</div>
    </div>
    <div style="margin: 0px 0px 0px 16px;height: 850;">
      <div class="left_main">
        <div class="heightClass" v-for="item in dataType">
          <div class="left_count">
              <div style="float: left;height: 60px;margin: 0px 9px;">
                <div class="circle1"></div>
                <div class="circle2"></div>
                <span class="spanImg"></span>
                <div class="type_font">{{item.name}}</div>
              </div>
              <div class="left_data_font">
                <p>
                  信息总量 <span> 12323 </span>
                  24H 同比<img src="../../common/image/png/上升.png"><span>2% </span>
                  今日新增 <span> 1,2343 </span>
                </p>
              </div>
          </div>
          <div style="display: inline-block; width: 15%;height: 80px;" :id="item.id">

          </div>
        </div>
      </div>
      <div class="right_main">
        <!-- 境外敌对媒体 -->
        <div class="hostile">
          <div class="title">
            <span class="title_font">境外敌对媒体</span>
          </div>
          <div  style="width: 100%;overflow: hidden;white-space: nowrap;height: 90px;" ref="picWrapper">
            <vueSeamlessScroll :data="listData" :class-option="optionLeft">
              <div style="width: 970px;">
                <div class="siteMedia" v-for="item in listData">
                  <span>凤凰网</span>
                  <p>今日量 <span>{{item.date}}</span></p>
                </div>
              </div>
            </vueSeamlessScroll>
          </div >
        </div>
        <!-- 境内主流媒体 -->
        <div class="mainStream">
          <div class="title">
            <span class="title_font">境内主流媒体</span>
          </div>
          <div  style="width: 100%;overflow: hidden;white-space: nowrap;height: 90px;" ref="picWrapper">
            <vueSeamlessScroll :data="listData" :class-option="optionLeft">
              <div style="width: 970px;">
                <div class="siteMedia" v-for="item in listData">
                  <span>凤凰网</span>
                  <p>今日量 <span>{{item.date}}</span></p>
                </div>
              </div>
            </vueSeamlessScroll>
          </div >
        </div>
        <!-- 账号资源 -->
        <div class="resources">
          <div class="account_left">
            <div class="title"><span class="title_font">账号资源</span></div>
            <div class="sorting">
              <div v-for="item in distribution" style="width: 150px;float: left;">
                <div class="siteMedia">
                  <span>{{item.no1}}</span><br/>
                  <span>{{item.no2}}</span>
                </div>
                <div class="amountSum">
                  <span>{{item.no3}}</span><br/>
                  <span>{{item.no4}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="account_right">
            <div class="title"><span class="title_font">数据类型分布</span></div>
            <div style="height: 220px;" ref="pieChart"></div>
          </div>
        </div>
        <!-- 数据趋势 -->
        <div class="dataTrends">
          <div class="title"><span class="title_font">数据趋势</span></div>
          <div style="height: 270px;margin-top: -20px;" ref="lintChart"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
import dbk from '@/common/image/png/顶部框.png'
import echarts from 'echarts'
import vueSeamlessScroll from 'vue-seamless-scroll'

export default {

  data () {
    return {
      nowDate:new Date(),
      dataType :[
        {name:"微博",id:'dashboard1',src:"../../common/image/png/微博.png"},
        {name:"新闻",id:'dashboard2',src:"../../common/image/png/新闻.png"},
        {name:"APP",id:'dashboard3',src:"../../common/image/png/APP.png"},
        {name:"论坛",id:'dashboard4',src:"../../common/image/png/论坛.png"},
        {name:"博客",id:'dashboard5',src:"../../common/image/png/博客.png"},
        {name:"视频",id:'dashboard6',src:"../../common/image/png/视频.png"},
        {name:"公众号",id:'dashboard7',src:"../../common/image/png/公众号.png"},
        {name:"QQ",id:'dashboard8',src:"../../common/image/png/QQ.png"},
        {name:"微信",id:'dashboard9',src:"../../common/image/png/微信.png"},
      ],
      distribution:[
        {no1:'23002300',no2:"新浪微博",no3:'2302',no4:"重点人员"},
        {no1:'32434325',no2:"QQ账号",no3:'6573',no4:"在控人员"},
        {no1:'00874342',no2:"微信账号",no3:'7800',no4:"本地人员"},
        {no1:'43454544',no2:"Twitter",no3:'3255',no4:"在控站点"},
        {no1:'12343454',no2:"Facebook",no3:'1111',no4:"境外站点"},
      ],
      optionCustomer: {
        step: 1,
        limitMoveNum: 5,
        openTouch: false,
        waitTime: 10,
        direction: 2,
        singleWidth:100
      },
      userImage: [],
      listData: [{
        'src': '无缝滚动第一行无缝滚动第一行',
        'date': '2017'
      }, {
        'title': '无缝滚动第二行无缝滚动第二行',
        'date': '242'
      }, {
          'title': '无缝滚动第三行无缝滚动第三行',
          'date': '1334'
      }, {
          'title': '无缝滚动第四行无缝滚动第四行',
          'date': '3445'
      }, {
          'title': '无缝滚动第五行无缝滚动第五行',
          'date': '4533'
      }, {
          'title': '无缝滚动第六行无缝滚动第六行',
          'date': '54353'
      }, {
          'title': '无缝滚动第七行无缝滚动第七行',
          'date': '2343'
      }, {
          'title': '无缝滚动第八行无缝滚动第八行',
          'date': '34334'
      }, {
          'title': '无缝滚动第九行无缝滚动第九行',
          'date': '2564'
      }]
    }
  },
  methods: {
    pieChart () {
      let option = {
        color: ["#DC143C","#FF4500","#FFFF00","#32CD32","#7FFFD4","#1E90FF","#EE82EE","#FFF0F5","#00BFFF"],
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable : true,
        series : [{
          name:'面积模式',
          type:'pie',
          radius : [20, 70],
          center : ['53%', '50%'],
          roseType : 'area',
          label: {
              normal: {
                  formatter: ' {b|{b}\n} {per|{d}%}  ',
                  borderRadius: 4,
                  rich: {
                      b: {
                          fontSize: 12,
                          lineHeight: 10
                      },
                      per: {
                          padding: [2, 1],
                      }
                  }
              }
          },
          data:[
            {value:10, name:'微博'},
            {value:5, name:'新闻'},
            {value:15, name:'APP'},
            {value:25, name:'论坛'},
            {value:20, name:'博客'},
            {value:35, name:'视频'},
            {value:30, name:'公众号'},
            {value:40, name:'QQ'},
            {value:50, name:'微信'}
          ]}
        ]}
        let charts = echarts.init(this.$refs.pieChart);
        charts.clear();
        charts.setOption(option);
        window.addEventListener('resize', () => {
          charts.resize();
        })
    },
    lintChart(){
      let option = {
        color: ["#DC143C","#FF6347","#FFFF00","#32CD32","#7FFFD4","#1E90FF","#EE82EE","#FFF0F5","#00BFFF"],
        tooltip : {
          trigger: 'axis'
        },
        legend: {
          x: 'right', // 'center' | 'left' | {number},
          y: 'top',
          textStyle:{
               fontSize:12,
               color:'#fff'
           },
          data:['微博','新闻','APP','论坛','博客','视频','公众号','QQ','微信']
        },
        calculable : true,
        xAxis : [{
            type : 'category',
            boundaryGap : false,
            data : ['周一','周二','周三','周四','周五','周六','周日'],
            axisLine:{
              lineStyle:{
                  color:'#36a3c3'
              }
            },
        }],
        yAxis : [{
            type : 'value',
            color:'#36a3c3',
            axisLine: {
              lineStyle: {
                type: 'solid',
                color:'#36a3c3',
                width:'1'
              }
            },
            splitLine:{show: true}
        }],
        grid: {
                left: '1%',   //图表距边框的距离
                right: '1%',
                bottom: '4%',
                top: '11%',
                containLabel: true
            },
        series : [{
                name:'微博',
                type:'line',
                smooth:true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:[10, 12, 21, 54, 260, 830, 710]
            },
            {
                name:'新闻',
                type:'line',
                smooth:true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:[30, 182, 434, 791, 390, 30, 10]
            },
            {
                name:'APP',
                type:'line',
                smooth:true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:[1320, 234, 120, 90, 20, 1132, 601,]
            },
            {
                name:'论坛',
                type:'line',
                smooth:true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:[432, 343, 601, 12, 120, 90, 20]
            },
            {
                name:'博客',
                type:'line',
                smooth:true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:[342, 167, 601, 234, 120, 90, 120]
            },
            {
                name:'视频',
                type:'line',
                smooth:true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:[789, 1132, 601, 234, 120, 90, 420]
            },
            {
                name:'公众号',
                type:'line',
                smooth:true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:[345, 567, 601, 234, 120, 690, 320]
            },
            {
                name:'QQ',
                type:'line',
                smooth:true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:[345, 456, 601, 234, 80, 190, 220]
            }
        ]}
        let charts = echarts.init(this.$refs.lintChart);
        charts.clear();
        charts.setOption(option);
        window.addEventListener('resize', () => {
          charts.resize();
        })
    },
    dashboard(){
      for (let index = 1; index < 10; index++) {
        let myChart = echarts.init(document.getElementById('dashboard'+index))
        let option = {
          tooltip: {
            trigger: "item"
          },
          graphic:[{
              type:'text',
              left:'center',
              top:'40%',
              style:{
                  text:'45',
                  fill:'red',
                  fontSize:12
              }
          }],
          series: [
            {
              name: "",
              type: "gauge",
              radius: "50%",
              center:['50%','50%'],
              startAngle: 0,
              endAngle: 359.9,
              splitNumber: 100,
              hoverAnimation: true,
              axisTick: {
                  show: false
              },
              splitLine: {
                  length: 1,
                  lineStyle: {
                      width: 1,
                      color: "#e9b23a"
                  }
              },
              axisLabel: {
                  show: false
              },
              pointer: {
                  show: false
              },
              axisLine: {
                  lineStyle: {
                      opacity: 0,
                  },
                  
              },
              detail: {
                  show: false
              },
              data: [{
                  value: 0,
                  name: ""
              }]
            },
            {
              name: "",
              type: "gauge",
              radius: "100%",
              center:['50%','50%'],
              startAngle: 0,
              endAngle: 359.9,
              splitNumber: 20,
              hoverAnimation: true,
              axisTick: {
                  show: false
              },
              splitLine: {
                  length: 5,
                  lineStyle: {
                      width: 1,
                      color: "#00bfff"
                  }
              },
              axisLabel: {
                  show: false
              },
              pointer: {
                  show: false
              },
              axisLine: {
                  lineStyle: {
                      opacity: 0,
                  },
                  
              },
              detail: {
                  show: false
              },
              data: [{
                  value: 0,
                  name: ""
              }]
            },
            {
              name: "",
              type: "pie",
              radius: ["90%","100%"],
              center:['50%','50%'],
              silent: true,
              z: 0,
              zlevel: 0,
              label: {
                  normal: {
                      show: false,
                      position: "center"
                  }
              },
              data: [{
                      value: 100.5,
                      name: "",
                      label: {
                          normal: {
                              show: false
                          }
                      },
                      itemStyle: {
                          normal: {
                              color: "#07211b"
                          }
                      }
                  },
                  {
                      value: 10.6,
                      name: "",
                      label: {
                          normal: {
                              show: false
                          }
                      },
                      itemStyle: {
                          normal: {
                              color: "#08A0E2"
                          }
                      }
                  }
              ]
            },
            {
              name: "",
              type: "gauge",
              radius: "60%",
              center:['50%','50%'],
              startAngle: 0,
              endAngle: 359.9,
              splitNumber: 100,
              hoverAnimation: true,
              axisTick: {
                  show: false
              },
              splitLine: {
                  length: 1,
                  lineStyle: {
                      width: 1,
                      color: "#00bfff"
                  }
              },
              axisLabel: {
                  show: false
              },
              pointer: {
                  show: false
              },
              axisLine: {
                  lineStyle: {
                      opacity: 0,
                  },
                  
              },
              detail: {
                  show: false
              },
              data: [{
                  value: 0,
                  name: ""
              }]
          },]
        }
        setInterval(function (){
            var value = parseInt(Math.random() * 2500) + 2300,
            value_ = (21000 - value) * 22660 / 23600;
            option.graphic[0].style.text = value + "";
            option.series[2].data[0].value = value_;
            option.series[2].data[1].value = 20000 - value_;
            myChart.setOption(option, true);
        },2000)
        myChart.setOption(option);
      }
    }
  },
  components: {vueSeamlessScroll},
  computed: {
    optionLeft () {
      return {
        direction: 2, //向左滑动
        limitMoveNum: 2
      }
    }
  },
  filters: {
    formatDate:function (value) {
      var padDate = function (value) {
        return value <10 ? '0' + value:value;
      };
      var date = new Date(value);
      var year = date.getFullYear();
      var month = padDate(date.getMonth()+1);
      var day = padDate(date.getDate());
      var hours = padDate(date.getHours());
      var minutes = padDate(date.getMinutes());
      var seconds = padDate(date.getSeconds());
      return year + '-' + month + '-' + day + ' ' + ' ' + hours + ':' + minutes + ':' + seconds;
    }
  },
  mounted () {
    this.pieChart()
    this.lintChart()
    this.dashboard()
    var _this = this; //声明一个变量指向vue实例this,保证作用域一致
    this.timer = setInterval(function() {
      _this.nowDate = new Date();//修改数据date
    }, 1000);
  },
  beforeDestroy () {
    if(this.timer) {
      clearInterval(this.timer);//在vue实例销毁钱，清除我们的定时器
    }
  }  ,
  created:function () {
     },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped >
.assets{
  width: 100%;
  height: 100%;
  position: fixed;
  background: url("../../common/image/png/bj.png") center no-repeat;
  background-size: cover;
   overflow: auto;
}
.topFrame{
  width: 100%;
  height: 72px;
  background: url("../../common/image/png/dbk.png")  center/100% 72px no-repeat border-box;

  .top_time_font{
    float: right;
    margin: 14px 0%;
    width: 23%;
    text-align: center;
    font-size: 24px;
    color: #fff;
  }
  .top_data_font {
    width: 55%;
  }
  .top_data_font div {
    float: left;
    width: 27%;
    padding: 27px 0px 0px 7px;
  }
  .top_data_font div span{
    color: #88aeb7
  }
  .top_data_font div span:nth-child(2){
    color: #e4df35;
    font-size: 28px;
    margin: 0px 7px;
  }
 }
.left_main{
  // border: 1px solid red;
  width: 37%;
  height: 810px;
  float: left;
  .heightClass:nth-child(1) .left_count div:nth-child(1){ 
    span{
      background: url("../../common/image/png/微博.png") center no-repeat;
    }
    div{
      color: #DC143C;
    }
  }
  .heightClass:nth-child(2) .left_count div:nth-child(1) {
    span{
      background: url("../../common/image/png/新闻.png") center no-repeat;
    }
    div{
      color: #FF6347;
    }
  }
  .heightClass:nth-child(3) .left_count div:nth-child(1) {
    span{
      background: url("../../common/image/png/APP.png") center no-repeat;
    }
    div{
      color: #FFFF00;
    }
  }
  .heightClass:nth-child(4) .left_count div:nth-child(1) {
    span{
      background: url("../../common/image/png/论坛.png") center no-repeat;
    }
    div{
      color: #32CD32;
    }
  }
  //color: ["#DC143C","#FF6347","#FFFF00","#32CD32","#7FFFD4","#1E90FF","#EE82EE","#FFF0F5","#00BFFF"],
  .heightClass:nth-child(5) .left_count div:nth-child(1) {
    span{
      background: url("../../common/image/png/博客.png") center no-repeat;
    }
    div{
      color: #7FFFD4;
    }
  }
  .heightClass:nth-child(6) .left_count div:nth-child(1) {
    span{
      background: url("../../common/image/png/视频.png") center no-repeat;
    }
    div{
      color: #1E90FF;
    }
  }
  .heightClass:nth-child(7) .left_count div:nth-child(1) {
    span{
      background: url("../../common/image/png/公众号.png") center no-repeat;
    }
    div{
      color: #EE82EE;
    }
  }
  .heightClass:nth-child(8) .left_count div:nth-child(1) {
    span{
      background: url("../../common/image/png/QQ.png") center no-repeat;
    }
    div{
      color: #FFF0F5;
    }
  }
  .heightClass:nth-child(9) .left_count div:nth-child(1) {
    span{
      background: url("../../common/image/png/微信.png") center no-repeat;
    }
    div{
      color: #00BFFF;
    }
  }
  .spanImg{
    display: block;
    margin: 4px 9px;
    position: relative;
    left: 6px;
    bottom: 102px;
    height: 39px;
    width: 29px;
  }
 .left_count{
   display: inline-block;
   padding: 12px 0px;
   width: 81%;
   height: 86px;
   background: url("../../common/image/png/left-bj.png")  center/100% 88px no-repeat border-box;

   .circleType{
    display: inline-block;
    width: 44px;
    height: 44px;
    background: url("../../common/image/png/类型-bj.png")  center/44px 44px no-repeat border-box;
   }

   .type_font{
    color: #43a6cc;
    font-size: 10px;
    width: 44px;
    text-align: center;
    position: relative;
    left: 6px;
    bottom: 95px;
   }
 }
 .left_data_font{
    float: left;
    width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
 }
 .left_data_font p{
   color: #fff;
    font-size: 14px;
    margin: 24px 0px 0px 0px;
 }
 .left_data_font p span{
    color: #e4df35;
    font-size: 14px;
        margin-right: 5px;
 }

}
.right_main{
  width: 62%;
  height: auto;
  float: left;
  margin-left: 10px;
}
.hostile{
  height: auto;
  width: 100%;
  display: inline-block;
  margin-bottom: 13px;
  .title{
    height: 22px;
    background: url("../../common/image/png/jw.png")  no-repeat border-box;
        margin-bottom: 10px;
  }
  .title_font{
    color: #36a3c3;
    margin-left: 81px;
  }

  .siteMedia{
    background: url("../../common/image/png/站点bj.png")  no-repeat border-box;
    height: 90px;
    width: 151px;
    float: left;
    margin-right: 10px;
    text-align: center;

    span:nth-child(1){
      color: #c57d53;
      padding: 20px;
      display: block;
    }
    p:nth-child(2){
      height: 20px;
      margin: 0px;
      color: #50c4f0;
      font-size: 14px;
    }
    p:nth-child(2) span:nth-child(1){
      color: #50c4f0;
      padding: 0;
      display: inline-block;
    }
  }
   .pic-list{
     font-size:0;
     padding: 0px;
     .pic-item{
       background: url("../../common/image/png/站点bj.png")  no-repeat border-box;
       display: inline-block;
       margin-right:6px;
       width:151px;
       height:90px;
       &:last-child{
         margin:0
       }
     }
   }
}
.mainStream{
  height: auto;
  width: 100%;
  display: inline-block;
  margin-bottom: 13px;
  .title{
    height: 22px;
    background: url("../../common/image/png/title.png")  no-repeat border-box;
        margin-bottom: 10px;
  }
  .title_font{
    color: #36a3c3;
    margin-left: 81px;
  }

  .siteMedia{
    background: url("../../common/image/png/站点bj.png")  no-repeat border-box;
    height: 90px;
    width: 151px;
    float: left;
    margin-right: 10px;
    text-align: center;
    span:nth-child(1){
      color: #c57d53;
      padding: 20px;
      display: block;
    }
    p:nth-child(2){
      height: 20px;
      margin: 0px;
      color: #50c4f0;
      font-size: 14px;
    }
    p:nth-child(2) span:nth-child(1){
      color: #50c4f0;
      padding: 0;
      display: inline-block;
    }
  }
}
.resources{
  height: auto;
  width: 100%;
  display: inline-block;
  margin-bottom: 5px;
  .account_left{
    width: 70%;
    height: auto;
    float: left;
  }
  .account_right{
    width: 30%;
    height: auto;
    float: left;
  }
  .title{
    background: url("../../common/image/png/border.png")  no-repeat border-box;
    height: 45px;
  }
  .title_font{
    display: block;
    padding: 12px 26px;
    color: #83c5d4;
  }
  .siteMedia{
    margin-top: 10px;
    background: url("../../common/image/png/账号资源框.png")  no-repeat border-box;
    height: 82px;
    width: 138px;
    text-align: center;
    color: #fff;
    padding: 16px 0px;
    line-height: 23px;
    span:nth-child(1){
      color: #ffe000;
      font-weight: bold;
      font-size: 20px;
    }
    span:nth-child(3){
      font-size: 14px;
    }
  }
  .amountSum{
    background: url("../../common/image/png/组20.png")  no-repeat border-box;
    height: 120px;
    color: #fff;
    text-align: center;
    width: 123px;
    padding: 35px 0px;
    line-height: 22px;
    span:nth-child(1){
      color: #00cfa1;
      font-weight: bold;
      font-size: 20px;
    }
    span:nth-child(3){
      font-size: 13px;
    }
  }
  .sorting{
    height: 211px;
    overflow: hidden;
    div:nth-child(2) .amountSum{
      background: url("../../common/image/png/组21.png")  no-repeat border-box;
    }
    div:nth-child(3) .amountSum{
      background: url("../../common/image/png/组22.png")  no-repeat border-box;
    }
    div:nth-child(4) .amountSum{
      background: url("../../common/image/png/组23.png")  no-repeat border-box;
    }
    div:nth-child(5) .amountSum{
      background: url("../../common/image/png/组24.png")  no-repeat border-box;
    }
  }
}
.dataTrends{
  height: auto;
  width: 100%;
  display: inline-block;
  .title{
    background: url("../../common/image/png/title.png")  no-repeat border-box;
    height: 22px;
  }
  .title_font{
    color: #36a3c3;
    margin-left: 81px;
  }
}
.svg-icon{
    margin: 0px 20px;
}
.circle2 {
  background-color: rgba(0, 0, 0, 0);
  border: 4px solid #00a3ff;
  opacity: 0.9;
  border-left: 6px solid rgba(0, 0, 0, 0);
  border-right: 6px solid rgba(0, 0, 0, 0);
  border-radius: 50px;
  box-shadow: 0 0 15px #202020;
  width: 44px;
  height: 44px;
  margin: 0 auto;
  position: relative;
  left: -2px;
  bottom: 55px;
  -moz-animation: spinoffPulse 20s infinite linear;
  -webkit-animation: spinoffPulse 20s infinite linear;
  -o-animation: spinoffPulse 20s infinite linear;
  -ms-animation: spinoffPulse 20s infinite linear;
}
.circle1 {
    background-color: rgba(0, 0, 0, 0);
    border: 4px solid #00a3ff;
    opacity: 0.9;
    border-right: 5px solid rgba(0, 0, 0, 0);
    border-left: 5px solid rgba(0, 0, 0, 0);
    border-radius: 50px;
    -webkit-box-shadow: 0 0 35px #808080;
    box-shadow: 0 0 35px #808080;
    width: 59px;
    height: 59px;
    margin: 0 auto;
    position: relative;
    left: -2px;
    bottom: 4px;
    -moz-animation: spinPulse 20s infinite linear;
    -webkit-animation: spinPulse 20s infinite linear;
    -o-animation: spinPulse 20s infinite linear;
    -ms-animation: spinPulse 20s infinite linear;
}
@keyframes spinPulse {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spinoffPulse {
  0% {
    -webkit-transform: rotate(160deg);
    opacity: 0;
    box-shadow: 0 0 1px #505050;
  }

  30% {
    -webkit-transform: rotate(120deg);
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate(-320deg);
    opacity: 0;
  }
}
</style>