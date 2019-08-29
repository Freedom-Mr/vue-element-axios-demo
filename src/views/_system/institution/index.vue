
<template>
  <div class="app-container">
    <el-row style="padding-bottom:6px">
      <el-tag size="medium">单位管理</el-tag>
      <span style="float:right">
        <el-input style="width:200px;" placeholder="单位名称" size="mini" v-model="name"></el-input>
        <el-tooltip class="item" content="搜索" placement="top">
          <el-button v-on:click="getInstitutions" icon="el-icon-search" size="mini" clearable>搜索</el-button>
        </el-tooltip>
        <el-tooltip class="item" content="新增" placement="left-end">
          <el-button type="primary" size="mini" @click="addInstitution">新增</el-button>
        </el-tooltip>
      </span>
    </el-row>

    <!--列表-->
    <el-table v-loading="loading" :data="institutions" highlight-current-row style="width: 100%;" size="mini" :stripe="true" :row-style="tableRowStyle" :header-cell-style="tableHeaderColor" show-overflow-tooltip border>
      <el-table-column type="selection" width="30">
      </el-table-column>
      <el-table-column type="expand" width="30" size="mini">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="传真">
              <span>{{ props.row.fax }}</span>
            </el-form-item>
            <el-form-item label="邮编">
              <span>{{ props.row.zipCode }}</span>
            </el-form-item>
            <el-form-item label="电子邮件">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.note }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>
      <el-table-column prop="name" label="单位名称" width="220" align="center" sortable>
      </el-table-column>
      <el-table-column prop="leader" label="领导" width="160" align="center">
      </el-table-column>
      <el-table-column prop="contacter" label="联系人" width="160" align="center">
      </el-table-column>
      <el-table-column prop="telephone" label="电话" width="140" align="center">
      </el-table-column>
      <el-table-column prop="web" label="网站" min-width="160" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.web">{{ scope.row.web }}</span>
          <span v-else>- - -</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="120" align="center" sortable>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editInst(scope.$index, scope.row)" circle plain></el-button>
          <el-button type="info" size="mini" @click="handleUpdateCustomPerms(scope.$index, scope.row)" circle plain>权限</el-button>
          <el-button type="danger" size="mini" @click="delInstituton(scope.$index, scope.row)" circle plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" size="mini">批量删除</el-button> -->
      <el-pagination layout="total ,sizes, prev, pager, next ,jumper" :total="total" :page-sizes="[1, 5, 10,13, 20, 50, 100 ,200]" :page-size="size" :pager-count="5" @current-change="handleCurrentChange" @size-change="sizeChange" style="float:right;" background>
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog v-dialogDrag :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="closeForm" width="800px">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" status-icon>
        <el-row>
          <el-col :span="8">
            <el-form-item label="单位名称" prop="name" size="mini">
              <el-input v-model="editForm.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领导" prop="leader" size="mini">
              <el-input v-model="editForm.leader"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人" prop="contacter" size="mini">
              <el-input v-model="editForm.contacter"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="电话" prop="telephone" size="mini">
              <el-input placeholder="电话号码" v-model="editForm.telephone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="传真" prop="fax" size="mini">
              <el-input v-model="editForm.fax"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮编" prop="zipCode" size="mini">
              <el-input v-model="editForm.zipCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="电子邮件" prop="email" size="mini">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="网站" prop="web" size="mini">
              <el-input v-model="editForm.web"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址" prop="address" size="mini">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input type="textarea" v-model="editForm.note"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <!-- <el-button @click.native="dialogFormVisible=false;" >取消</el-button> -->
        <!-- 有表单验证未清除现象 -->
        <el-button @click="closeForm">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateInstitu">修改</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import institutionApi from '@/api/system/institution'
import Code from '@/common/js/code'
// import util from '@/common/index.js'
export default {
  name: 'institution_manage',
  data () {
    return {
      pageName: '单位管理',
      institutions: [], // 单位数据集合

      loading: true,

      // 分页
      total: 0,
      page: 1,
      name: '',
      size: 13,
      sortField: 'createTime',

      textMap: {
        update: '修改单位',
        create: '创建单位'
      },

      dialogStatus: '', // 弹窗类型
      dialogFormVisible: false,

      // 编辑界面数据
      editForm: {
        name: null,
        leader: null,
        contacter: null,
        telephone: null,
        fax: null,
        zipCode: null,
        email: null,
        web: null,
        address: null,
        note: null
      },

      addFormVisible: false, // 新增界面是否显示
      // 校验
      editFormRules: {
        name: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }],
        leader: [{ required: true, message: '负责人不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.getInstitutions()
  },
  methods: {
    // 修改table tr行的背景色
    tableRowStyle ({ row, rowIndex }) {
      return 'background-color:rgba(0,90,255,0.08)'
    },
    // 修改table header的背景色
    tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color:rgb(177, 215, 236);color: #000000;font-weight: 900;'
      }
    },
    // 每页条数
    sizeChange (val) {
      this.size = val
      this.getInstitutions()
    },
    // 分页
    handleCurrentChange (val) {
      this.page = val
      this.getInstitutions()
    },
    // 获取单位列表
    getInstitutions () {
      this.loading = true
      const para = {
        page: this.page,
        name: this.name,
        size: this.size,
        sortField: this.sortField
      }
      institutionApi.getInstitutionList(para).then(res => {
        if (res.data.code === Code.SUCCESS) {
          this.total = res.data.data.total
          this.institutions = res.data.data.sysInstitutions
        }
      })
      this.loading = false
    },
    // 删除
    delInstituton (index, row) {
      this.$confirm('删除本单位之后，该单位下的部门也将会删除！确认删除该记录吗?', '警告', {
        type: 'warning'
      })
        .then(() => {
          const para = { id: row.id }
          institutionApi.delInstituton(para).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getInstitutions()
          })
        })
        .catch(() => { })
    },
    // 关闭弹窗
    closeForm () {
      this.dialogFormVisible = false
      this.$refs['editForm'].resetFields()
    },
    // 显示新增界面
    addInstitution () {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.editForm = {
        name: null,
        leader: null,
        contacter: null,
        telephone: null,
        fax: null,
        zipCode: null,
        email: null,
        web: null,
        address: null,
        note: null
      }
    },

    // 显示编辑界面
    editInst (index, row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 编辑
    updateInstitu () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              const para = Object.assign({}, this.editForm)// 合并
              institutionApi.updateIntitution(para).then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.dialogFormVisible = false
                this.getInstitutions()
              })
            })
            .catch(e => {
              // 打印一下错误
              console.log(e)
            })
        }
      })
    },
    // 新增
    createData: function () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            const para = this.editForm
            institutionApi.addInstitution(para).then(res => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.dialogFormVisible = false
              this.getInstitutions()
            })
          })
            .catch(e => {
              // 打印一下错误
              console.log(e)
            })
        }
      })
    },
    //
    handleUpdateCustomPerms (idx, row) {
      this.$router.push({ name: 'custom_manage_custom_perm', params: { rid: row.id, type: 1 } })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped >
.app-container {
  .demo-table-expand {
    font-size: 5px;
  }
  .demo-table-expand label {
    font-size: 5px;
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    font-size: 5px;
    margin-right: 0;
    margin-bottom: 0;
    width: 31%;
  }
  .demo-table-expand .span {
    font-size: 5px;
  }
}
</style>
