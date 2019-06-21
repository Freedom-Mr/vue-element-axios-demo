<template>
  <div class="t-table">
    <el-table :data="gridData">
      <el-table-column type="index" align="center" label="序号" width="100"></el-table-column>
      <el-table-column v-if="showContent" type="expand" width="100" size="mini">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="内容：">
              <span v-if="props.row.content != null">{{ props.row.content }}</span>
              <span v-else>--</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="account" v-if="showAccount" align="center" :label="accountName"></el-table-column>
      <el-table-column prop="content" v-if="showContent" align="center" label="内容"></el-table-column>
    </el-table>
    <div style="display: flex;justify-content: space-between;align-items: center;">
      <el-button size="mini" v-if="showContent" type="success" @click="groupOrUser()">全部导出</el-button>
      <el-pagination
        layout="total , prev, pager, next ,jumper"
        :total="total"
        :page-size="size" @current-change="handleCurrentChange"
         background>
      </el-pagination>
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
        size: 20,
        total: 0,
        action: false,
        showAccount: false,
        showContent: false,
        accountName: "账号ID"
      }
    },
    props: {
      eid: {
        type: Number,
        default: 0
      },
      taskId: {
        type: Number,
        default: null
      },
      id: {
        type: Number,
        default: null
      },
      dataType: {
        type: Number,
        default: null
      },
      detailsTotal: {
        type: Number,
        default: null
      }
    },
    mounted() {
      this.gridData = ''
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
        if(this.dataType===13||this.dataType===21||this.dataType===23||this.dataType===34||this.dataType===36){
          this.accountName = "群号ID"
        }
        if (this.dataType) {
          if (this.dataType === 30 || this.dataType === 31) {
            if (this.dataType === 31) {
              this.action = true
            } else {
              this.action = false
            }
            this.getGroupChat();
          } else if (this.dataType === 35) {
            this.action = true
            this.getUserChat()
          } else if (this.dataType === 32 || this.dataType === 33 || this.dataType === 34 || this.dataType === 36) {
            this.getDetails();
          }else{
            this.getDetails();
          }
        } else {
          this.getDetails();
        }
      },
      getDetails() {
        this.showAccount = true
        this.showContent = false
        this.$axios.get(`/analysis/getDetails?id=${this.eid}&pageNum=${this.page}&size=${this.size}`).then(res => {
          if (res.data.code === Code.SUCCESS) {
            console.log(res)
            this.gridData = res.data.data.data
            this.total = res.data.data.total
            console.log('total', this.total)
          }
        }).catch(() => {

        })
      },
      getGroupChat() {
        this.showAccount = false
        this.showContent = true
        this.$axios.post(`/analysis/getGroupChat?taskId=${this.taskId}&gid=${this.id}&action=${this.action}&pageIndex=${this.page}&pageSize=${this.size}`).then(res => {
          if (res.data.code === Code.SUCCESS) {
            this.gridData = res.data.data
            console.log('gridData', this.gridData)
            this.total = parseInt(this.detailsTotal)
            console.log('total', this.total)
          }
        }).catch(() => {

        })
      },
      getUserChat() {
        this.showAccount = false
        this.showContent = true
        this.$axios.post(`/analysis/getUserChat?taskId=${this.taskId}&uid=${this.id}&action=${this.action}&pageIndex=${this.page}&pageSize=${this.size}`).then(res => {
          if (res.data.code === Code.SUCCESS) {
            this.gridData = res.data.data
            console.log('gridData', this.gridData)
            this.total = parseInt(this.detailsTotal)
          }
        }).catch(() => {

        })
      },
      groupOrUser() {
        if (this.dataType) {
          if (this.dataType === 30 || this.dataType === 31) {
            if (this.dataType === 31) {
              this.action = true
            } else {
              this.action = false
            }
            this.exportDetails(2)
          } else if (this.dataType === 35) {
            this.action = true
            this.exportDetails(1)
          }
        }
      },
      exportDetails(type) {
        this.$axios.get(`/analysis/exportGroupChat?taskId=${this.taskId}&id=${this.id}&action=${this.action}&type=${type}`, {responseType: "blob"}).then(res => {
          console.log(123, res)
          let blob = res.data
          let a = document.createElement("a")
          let url = window.URL.createObjectURL(blob);
          let fileName = `聊天记录 ${formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')}.xls`;
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a)
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url)
        }).catch((err) => {
          console.log(err)
        })
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
</style>
