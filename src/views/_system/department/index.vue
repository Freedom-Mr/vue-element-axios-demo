
<template>
  <div class="app-container">
    <el-row style="padding-bottom:6px">
      <el-tag size="medium">部门管理</el-tag>
      <span style="float:right">
        <el-select v-model="selectInst" clearable placeholder="选择单位" size="mini" @change="getDepartments">
          <el-option v-for="item in instIds" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-input style="width:200px;" placeholder="部门名称" size="mini" v-model="name" clearable></el-input>
        <el-tooltip class="item" content="搜索" placement="top">
          <el-button v-on:click="searchDepartments" icon="el-icon-search" size="mini">搜索</el-button>
        </el-tooltip>
        <el-tooltip class="item" content="新增" placement="left-end">
          <el-button type="primary" size="mini" @click="addDepartment">新增</el-button>
        </el-tooltip>
      </span>
    </el-row>

    <!--列表-->
    <el-table :data="departments" highlight-current-row style="width: 100%;" size="mini" border stripe>
      <el-table-column type="selection" width="30">
      </el-table-column>
      <el-table-column type="expand" width="30" size="mini">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="领导">
              <span>{{ props.row.leader }}</span>
            </el-form-item>
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
      <el-table-column prop="name" label="部门名称" width="240" align="center" sortable>
      </el-table-column>
      <el-table-column prop="contacter" label="联系人" width="160" align="center">
      </el-table-column>
      <el-table-column prop="telephone" label="电话" width="120" align="center">
      </el-table-column>
      <el-table-column prop="instName" label="单位" min-width="160" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="100" align="center" sortable>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDepartment(scope.$index, scope.row)" circle plain></el-button>
          <el-button type="info" size="mini" @click="handleUpdateCustomPerms(scope.$index, scope.row)" v-perm="'b:department:perm'" circle plain>权限</el-button>
          <el-button type="danger" size="mini" @click="delDepartment(scope.$index, scope.row)" circle plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" size="mini">批量删除</el-button> -->
      <el-pagination layout="total ,sizes, prev, pager, next ,jumper" :total="total" :page-sizes="[1, 5, 10,13, 20, 50, 100 ,200]" :page-size="size" @current-change="handleCurrentChange" @size-change="sizeChange" style="float:right;" background>
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog v-dialogDrag :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="closeForm" width="800px">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" status-icon>
        <el-row>
          <el-col :span="8">
            <el-form-item label="部门名称" prop="name" size="mini">
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
          <el-col :span="8">
            <el-form-item label="电子邮件" prop="email" size="mini">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="instId" size="mini">
              <el-select v-model="editForm.instId" clearable placeholder="选择单位" size="mini">
                <el-option v-for="item in instIds" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地址" prop="address" size="mini">
              <el-input v-model="editForm.address"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="note">
              <el-input type="textarea" v-model="editForm.note"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:center">
        <!-- <el-button @click.native="dialogFormVisible=false;" >取消</el-button> -->
        <!-- 有表单验证未清除现象 -->
        <el-button @click="closeForm">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateDepartment">修改</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import institutionApi from '@/api/system/institution'
import departmentApi from '@/api/system/department'
import { mapGetters } from 'vuex'
import Code from '@/common/js/code'
// import util from '@/common/index.js'
export default {
  name: 'department_manage',
  data () {
    return {
      pageName: '部门管理',
      departments: [], // 部门数据集合

      // 分页
      total: 0,
      page: 1,
      name: '',
      size: 13,
      sortField: 'createTime',

      textMap: {
        update: '修改部门',
        create: '创建部门'
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
        instId: null,
        instName: null,
        address: null,
        note: null
      },
      // 单位集合容器
      instIds: [],
      selectInst: '',

      addFormVisible: false, // 新增界面是否显示
      // 校验
      editFormRules: {
        name: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }],
        leader: [{ required: true, message: '领导名不能为空', trigger: 'blur' }],
        contacter: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        telephone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
        instId: [{ required: true, message: '请选择单位', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'inst_id'
    ])
  },
  mounted () {
    this.getDepartments()
    this.getInstitutions()
  },
  methods: {
    // 每页条数
    sizeChange (val) {
      this.size = val
      this.getDepartments()
    },
    // 分页
    handleCurrentChange (val) {
      this.page = val
      this.getDepartments()
    },

    // 搜索
    searchDepartments () {
      this.getDepartments()
    },

    // 获取部门列表
    getDepartments () {
      const para = {
        instId: this.selectInst || this.inst_id,
        page: this.page,
        name: this.name,
        size: this.size,
        sortField: this.sortField
      }
      departmentApi.getDepartmentList(para).then(res => {
        this.total = res.data.data.total
        this.departments = res.data.data.sysDepartments
      })
    },
    // 获取单位列表
    getInstitutions () {
      const para = {
        id: this.selectInst || this.inst_id
      }
      institutionApi.getInstListById(para).then(res => {
        if (res.data.code === Code.SUCCESS) {
          this.instIds = res.data.data.sysInstitutions
        }
      })
    },
    // 删除
    delDepartment (index, row) {
      this.$confirm('确认删除该部门吗?', '警告', {
        type: 'warning'
      })
        .then(() => {
          const para = { id: row.id }
          departmentApi.delDepartment(para).then(res => {
            if (res.data.code === Code.SUCCESS) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
            this.getDepartments()
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
    addDepartment () {
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
        instId: null,
        instName: null,
        address: null,
        note: null
      }
    },

    // 显示编辑界面
    editDepartment (index, row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 编辑
    updateDepartment () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              const para = Object.assign({}, this.editForm)// 合并
              departmentApi.updateDepartment(para).then(res => {
                if (res.data.code === Code.SUCCESS) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.$refs['editForm'].resetFields()
                  this.dialogFormVisible = false
                  this.getDepartments()
                }
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
            departmentApi.addDepartment(para).then(res => {
              if (res.data.code === Code.SUCCESS) {
                this.$message({
                  message: '添加部门成功！',
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.dialogFormVisible = false
                this.getDepartments()
              }
            })
          })
            .catch(e => {
              // 打印一下错误
              console.log(e)
            })
        }
      })
    },
    handleUpdateCustomPerms (idx, row) {
      this.$router.push({ name: 'custom_manage_custom_perm', params: { rid: row.id, type: 2 } })
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
