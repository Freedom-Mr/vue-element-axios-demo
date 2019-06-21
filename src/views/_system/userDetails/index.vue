<template>
  <div class="app-container">
    <div style="padding-left: 10px;margin-bottom: 5px;padding-top: 5px;background-color: #e7e9ea;border-radius:5px">
      <el-row type="flex" style="height: 185px;">
        <el-col :span="3">
          <div style="border-radius: 4px;">
            <img :src='u_profile_photo' class="image">
          </div>
        </el-col>
        <el-col :span="20" style="padding-left: 20px;">
          <el-row type="flex">
            <el-col :span="8">
              <el-input :placeholder="u_account" class="input_style" disabled>
                <template slot="prepend">
                  <font class="font_style">账号</font>
                </template>
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-input :placeholder="u_realName" class="input_style" disabled>
                <template slot="prepend">
                  <font class="font_style">姓名</font>
                </template>
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-input :placeholder="u_unique_login" class="input_style" disabled>
                <template slot="prepend">
                  <font class="font_style">在线数量</font>
                </template>
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-input :placeholder="u_deadline" class="input_style" disabled>
                <template slot="prepend">
                  <font class="font_style">失效时间</font>
                </template>
              </el-input>
            </el-col>

          </el-row>
          <el-row type="flex">
            <el-col :span="8">
              <el-input :placeholder="u_telephone" class="input_style" disabled>
                <template slot="prepend">
                  <font class="font_style">电话</font>
                </template>
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-input :placeholder="u_part" class="input_style" disabled>
                <template slot="prepend">
                  <font class="font_style">角色</font>
                </template>
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-input :placeholder="u_inst_name" class="input_style" disabled>
                <template slot="prepend">
                  <font class="font_style">所属单位</font>
                </template>
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-input :placeholder="u_dep_name" class="input_style" disabled>
                <template slot="prepend">
                  <font class="font_style">所属部门</font>
                </template>
              </el-input>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="8">
              <el-input :placeholder="u_email" class="input_style" disabled>
                <template slot="prepend">
                  <font class="font_style">邮箱</font>
                </template>
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-input :placeholder="u_status" class="input_style" disabled>
                <template slot="prepend">
                  <font class="font_style">锁定</font>
                </template>
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-input :placeholder="u_note" class="input_style" disabled>
                <template slot="prepend">
                  <font class="font_style">备注</font>
                </template>
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-button type="warning" plain class="input_style" @click="openWindow()">修改基本资料</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div style="padding-top: 10px;background-color: #e7e9ea;border-radius:5px">
      <el-row>
        <el-col :span="16">
          <div id="linChart" :style="{ height: '300px'}"></div>
        </el-col>
        <el-col :span="8">
          <div id="pieChart" :style="{ height: '300px'}"></div>
        </el-col>
      </el-row>
    </div>
    <!--弹出窗口：编辑角色-->
    <el-dialog v-dialogDrag title="编辑信息" :visible.sync="dialogVisible" width="800px" :before-close="handleClose">
      <el-form ref="editForm" :model="editForm" label-position="left" label-width="50px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="照片" prop="profilePhoto" size="mini">
              <el-upload :auto-upload="false" ref="uploadImg" :class="{'disabled':uploadDisabled}" action="#" list-type="picture-card" :file-list="imagelist" :before-upload="beforeUpload" :on-change="handleUploadChange" :on-remove="handleUploadRemove" accept=".png,.jpg,.gif,.webp,.bmp">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="editForm.realName" style="width: 96%;"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="indepus">
              <el-input v-model="editForm.telephone" style="width: 96%;"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="rdesc">
              <el-input v-model="editForm.email" style="width: 96%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注" prop="rdesc">
          <el-input v-model="editForm.note" style="width: 98%;" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <span slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUser()">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userApi from '@/api/system/user'
import Code from '@/common/js/code'
import { } from '@/common/js/validate.js'

export default {
  name: 'userDetails',
  data () {
    return {
      u_userId: null,
      u_profile_photo: null,
      u_account: null,
      u_realName: null,
      u_email: null,
      u_telephone: null,
      u_status: null,
      u_inst_name: null,
      u_dep_name: null,
      u_part: null,
      u_roles: null,
      u_deadline: null,
      u_unique_login: '无限制',
      u_note: null,
      dialogVisible: false,
      editForm: {
        userId: null,
        realName: null,
        telephone: null,
        email: null,
        note: null,
        profilePhoto: []
      },
      uploadImg: null,
      imagelist: [], //头像
      uploadDisabled: false,
    }
  },
  computed: {
    ...mapGetters([
      'user_id',
      'profile_photo',
      'account',
      'realName',
      'email',
      'telephone',
      'status',
      'inst_id',
      'dep_id',
      'part',
      'roles'
    ])
  },
  created () {
    this.init()
  },
  mounted () {
    this.loginLine()
    this.pieChart()
  },
  methods: {
    init () {
      this.u_profile_photo = this.profile_photo ? this.profile_photo : '--'
      this.u_account = this.account ? this.account : '--'
      this.u_realName = this.realName ? this.realName : '--'
      this.u_email = this.email ? this.email : '--'
      this.u_telephone = this.telephone ? this.telephone : '--'
      switch (this.part) {
        case 1: this.u_part = '管理员'; break
        case 2: this.u_part = '审计员'; break
        case 3: this.u_part = '业务员'; break
        default: break
      }
      userApi.getUserInfo().then(res => {
        if (res.data.code === Code.SUCCESS) {
          this.u_status = res.data.data.status === 0 ? '已锁定' : '未锁定'
          this.u_deadline = res.data.data.deadline ? res.data.data.deadline : '--'
          this.u_unique_login = res.data.data.unique_login && res.data.data.unique_login > 0 ? res.data.data.unique_login : this.u_unique_login
          this.u_inst_name = res.data.data.inst_name ? res.data.data.inst_name : '--'
          this.u_dep_name = res.data.data.dep_name ? res.data.data.dep_name : '--'
          this.u_note = res.data.data.note ? res.data.data.note : '--'
        }
      }).catch(e => {
      })
    },
    loginLine () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('linChart'))
      // 绘制图表
      myChart.setOption({
        title: { text: '用户登录曲线图', x: 'center' },
        tooltip: {},
        xAxis: {
          axisLabel: {
            show: true,
            interval: 0
          },
          data: []
        },
        dataZoom: {},
        grid: {
          x: 50,
          y: 40
        },
        yAxis: { name: '登录次数' },
        series: [{
          name: '登录次数',
          type: 'line',
          boundaryGap: false,
          axisLine: { onZero: true },
          data: []
        }]
      })
      // 异步加载数据
      myChart.showLoading()
      const data = {
        id: this.user_id
      }
      userApi.loginIpList(data).then(res => {
        myChart.hideLoading()
        if (res.data.code === Code.SUCCESS) {
          myChart.setOption({
            xAxis: {
              data: res.data.data.line.xAxis_data
            },
            series: [{
              name: '登录次数',
              data: res.data.data.line.series_data
            }]
          })
        }
      }).catch(e => {
        myChart.hideLoading()
      })
    },
    pieChart () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('pieChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '登录IP分布图',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: []
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel']
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        series: [
          {
            name: '占比',
            type: 'pie',
            radius: '60%',
            roseType: 'area',
            data: []
          }
        ]
      })
      // 异步加载数据
      myChart.showLoading()
      const data = {
        id: this.user_id
      }
      userApi.loginIpGroup(data).then(res => {
        myChart.hideLoading()
        if (res.data.code === Code.SUCCESS) {
          myChart.setOption({
            legend: {
              data: res.data.data.pie.legend_data
            },
            series: [{
              name: '占比',
              data: res.data.data.pie.series_data
            }]
          })
        }
      }).catch(e => {
        myChart.hideLoading()
      })
    },
    handleClose (done) {
      done();
    },
    openWindow () {
      this.imagelist = []
      this.editForm.realName = this.u_realName
      this.editForm.telephone = this.u_telephone
      this.editForm.email = this.u_email
      this.editForm.note = this.u_note
      this.editForm.userId = this.user_id
      let m = { name: '默认', url: this.u_profile_photo };
      this.imagelist.push(m)
      this.uploadDisabled = true;
      this.dialogVisible = true
    },
    updateUser () {
      this.u_profile_photo = null
      userApi.updateMe(this.editForm).then(res => {
        if (res.data.code === Code.SUCCESS) {
          this.u_note = this.editForm.note ? this.editForm.note : '--'
          this.u_realName = this.editForm.realName ? this.editForm.realName : '--'
          this.u_email = this.editForm.email ? this.editForm.email : '--'
          this.u_telephone = this.editForm.telephone ? this.editForm.telephone : '--'
          if (this.uploadImg) {
            let temp = new FormData();
            temp.append('id', this.editForm.userId);
            temp.append('file', this.uploadImg);
            //console.log('上传--', this.editForm.userId, temp)
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            this.$axios.post('/sys_user/uploadImage', temp, config).then(res => {
              //console.log(res)
            }).catch(e => {
              console.log(e)
            })
          }
        }
        this.$axios.post('/sys_user/searchImage', null, { params: { userId: this.editForm.userId } }).then(res => {
          if (res.data && res.data.photo) {
            this.u_profile_photo = `data:image/${res.data.format};base64,${res.data.photo}`
          }
        });
        this.dialogVisible = false
        this.$router.go(0)
      }).catch(e => {
        console.log(e);
      })
    },
    // 头像状态改变钩子
    handleUploadChange (file, fileList) {
      this.isDeleteImg = false;
      let isL = file.size / 1024 / 1024 / 2
      if (isL > 1) {
        this.$refs.uploadImg.clearFiles();
        this.$message.error('请上传小于2M大小的图片')
      } else {
        this.uploadImg = file.raw;
        if (fileList.length > 0) {
          this.uploadDisabled = true
        }
      }
    },
    // 头像删除钩子
    handleUploadRemove (file, fileList) {
      this.isDeleteImg = true;
      this.uploadImg = null;
      if (fileList.length < 1) {
        this.uploadDisabled = false
      }
    },
    // 头像上传前钩子
    beforeUpload (file, fileList) {
      this.uploadForm.append('file', file)// 通过append向form对象添加数据
      return true
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped >
.app-container {
  .image {
    width: 100%;
    height: 180px;
    border-radius: 5%;
    /* box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1); */
  }
  .font_style {
    color: black;
  }
  .el-input {
    width: 120%;
  }
  .input_style {
    width: auto;
    margin: 8px;
  }
  .disabled /deep/ .el-upload--picture-card {
    display: none;
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
