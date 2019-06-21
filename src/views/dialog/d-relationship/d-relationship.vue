<template>
  <div class="t-table">
    <div v-if="unionDetail">
      <div style="width: 39%;display: inline-block;">
        <div class="my-table">
          <div class="my-table-son">
            <div class="my-table-td">
              序号
            </div>
            <div class="my-table-td">
              {{record}}
            </div>
          </div>
          <div style="overflow: auto;height: 341px;">
            <div class="my-table-son" v-for="(item,index) in gridData" v-bind:class='{bg:index===isactive}' @click="getUnionDetail(item ,index)">
              <div class="my-table-td">
                {{index+1}}
              </div>
              <div class="my-table-td">
                <span v-if="item">{{ item }}</span>
                <span v-else>- - -</span>
              </div>
            </div>
          </div>
        </div>
        <div style="display: flex;justify-content: space-between;align-items: center;">
          <el-pagination
            layout="total , prev, pager, next ,jumper"
            :total="total"
            :page-size="size" @current-change="handleCurrentChange"
            background>
          </el-pagination>
        </div>
      </div>
      <div style="width: 60%;display: inline-block;border: 1px solid #ccc;height: 400px;" id="relationship">

      </div>
    </div>
    <div v-if="unionList">
      <div style="width: 100%;display: inline-block;">
        <div class="my-table">
          <div class="my-table-son">
            <div class="my-table-td">
              序号
            </div>
            <div class="my-table-td">
              {{record}}
            </div>
          </div>
          <div style="overflow: auto;height: 341px;">
            <div class="my-table-son" v-for="(item,index) in gridData" v-bind:class='{bg:index===isactive}' @click="getUnionDetail(item ,index)">
              <div class="my-table-td">
                {{index+1}}
              </div>
              <div class="my-table-td">
                <span v-if="item">{{ item }}</span>
                <span v-else>- - -</span>
              </div>
            </div>
          </div>
        </div>
        <div style="display: flex;justify-content: space-between;align-items: center;">
          <el-pagination
            layout="total , prev, pager, next ,jumper"
            :total="total"
            :page-size="size" @current-change="handleCurrentChange"
            background>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Code from '@/common/js/code'
  import {formatDate} from '@/common/js/validate';

  export default {
    data() {
      return {
        gridData: [],
        page: 1,
        size: 10,
        total: 0,
        isactive: 0 ,
        record:"共同群号",
        visitUrl : null,
        unionDetail :true,
        unionList :false,
        legendName:"",
        identical: ""
      }
    },
    props: {
      taskId: {
        type: Number,
        default: null
      },
      id: {
        type: String,
        default: null
      },
      dataType: {
        type: Number,
        default: null
      },
      showTable: {
        type: Boolean,
        default: null
      },
      numTotal: {
        type: Number,
        default: null
      }
    },
    mounted() {
      this.gridData = ''
      if(this.showTable){
        this.unionDetail = true
        this.unionList = false
        if(this.dataType ===11||this.dataType ===14){
          this.legendName = "账号"
          this.identical = "群号"
          this.record = "共同群号"
        }else{
          this.legendName = "群号"
          this.identical = "账号"
          this.record = "共同账号"
        }
      }else{
        if(this.dataType===12||this.dataType===13||this.dataType===21){
          if(this.dataType===12||this.dataType===21){
            this.legendName = "群号"
            this.identical = "账号"
            this.record = "共同账号"
          }else{
            this.legendName = "账号"
            this.identical = "群号"
            this.record = "共同群号"
          }
          this.unionDetail = true
          this.unionList = false
        }else{
          if(this.dataType===17||this.dataType===19||this.dataType===25){
            this.record = "内容"
          }else if(this.dataType===10||this.dataType===14||this.dataType===15||this.dataType===18||this.dataType===23){
            this.record = "账号"
          }else if(this.dataType===11||this.dataType===16||this.dataType===20||this.dataType===22||this.dataType===24){
            this.record = "群号"
          }else{
            this.record = "内容"
          }
          this.unionDetail = false
          this.unionList = true
        }
      }
      this.initData();

    },
    methods: {
      // 每页条数
      sizeChange(val) {
        this.size = val
        this.initData()
      },
      // 分页
      handleCurrentChange(val) {
        this.page = val
        this.initData()
      },
      initData() {

        this.getDetails();
      },
      getDetails() {
        if(this.showTable){
          this.visitUrl ="/analysis/";
        }else{
          this.visitUrl ="/";
        }
        this.showAccount = true
        this.showContent = false
        const vo = {
          accountId: this.id,
          resultId :this.dataType,
          taskId : this.taskId,
          pageMax :this.size,
          pageNum:this.page
        }
        this.$axios.post(this.visitUrl+"getUnionList",JSON.stringify(vo)).then(res => {
          if (res.data.code === Code.SUCCESS) {
            console.log('res.data.data',res)
            this.gridData = res.data.data
            this.total = parseInt(this.numTotal)
            let selectedAccount = res.data.data[0]
            this.getUnionDetail(selectedAccount,0)
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      getUnionDetail(selectedAccount ,index){

        this.isactive = index
        let chartData = []
        let chartLink = []
        if(selectedAccount){
          const vo = {
            analysisAccount: this.id,
            resultId :this.dataType,
            selectedAccount : selectedAccount,
            taskId : this.taskId
          }
          this.$axios.post(this.visitUrl+"getUnionDetail",JSON.stringify(vo)).then(res => {
            console.log(res)
            if (res.data.code === Code.SUCCESS) {
              let ids = res.data.data[0].ids
              if (res.data.data.length!=0) {
                for (var i = 0; i < ids.length; i++) {
                    chartData.push({name: ids[i],draggable: "true",category: 1,});
                }
                chartData.push({name: this.id,draggable: "true",category: 0,});
                chartData.push({name: selectedAccount,draggable: "true",category: 2,});
                chartLink.push({source: selectedAccount, target: this.id, value: "共同"+this.identical});
                for (var j = 0; j < ids.length; j++){
                  chartLink.push({source: selectedAccount, target: ids[j], value: "共同"+this.identical});
                }
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('relationship'))
                // 绘制图表
                myChart.setOption({
                  color: ['#23b35d', '#ff733f', '#409EFF'],
                    title: {
                          text: '',
                      },
                  tooltip: {},
                  animationDurationUpdate: 1500,
                  animationEasingUpdate: 'quinticInOut',
                  label: {
                    normal: {
                      show: true,
                      textStyle: {
                        fontSize: 20,
                        color: '#000'
                      }
                    }
                  },
                legend: {
                  x: "center",
                  data: ["样本"+this.legendName, "其他"+this.legendName, "共同"+this.identical],
                  textStyle: {
                    color: '#000'
                  }
                },
                series: [{
                  type: 'graph',
                  layout: 'force',
                  symbolSize: 20,
                  focusNodeAdjacency: true,
                  roam: true,
                  categories: [{
                      name: "样本"+this.legendName
                  }, {
                      name: "其他"+this.legendName
                  }, {
                      name: "共同"+this.identical
                  }],
                  label: {
                    normal: {
                      show: true,
                      textStyle: {
                        fontSize: 15,
                        color: '#000'
                      },
                    }
                  },
                  force: {
                    repulsion: 1000
                  },
                  edgeLabel: {
                    normal: {
                      show: false,
                      textStyle: {
                        fontSize: 7 //线上字大小
                      },
                      formatter: "{c}"
                    }
                  },
                  data: chartData,
                  links: chartLink,
                  lineStyle: {
                    normal: {
                        opacity: 0.7,
                        width: 2,
                        curveness: 0.1
                      }
                    }
                  }]
                })
              }
            }
          }).catch((e) => {
            console.log(e)
          })
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .t-table
    padding: 10px;
    margin-top: -34px;
  .el-table
    overflow: hidden;
    overflow-y: auto;
    height: 400px;

  >>> .el-table .cell {
    white-space nowrap
  }
  .my-table {
  height: 398px;
  padding: 5px 10px;
  font-size: 14px;
  color: #666666;

  .my-table-son {
    border-top: 1px solid #ebeaea;
    line-height: 48px;
    display: flex;
    padding: 0 5px;

    .my-table-td {
      flex: 1;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
          cursor: default;
    }
  }
}
  .bg{
    background-color:rgb(241, 244, 247)
  }
</style>
