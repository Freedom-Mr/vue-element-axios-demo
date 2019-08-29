<template>
  <div class="app-container">
    <el-row style="padding-bottom:6px">
      <el-tag size="medium">角色管理</el-tag>
      <span style="float:right">
        <el-select v-model="selectGrade" clearable placeholder="级别筛选" size="mini" @change="getRoles">
          <el-option v-for="item in gradeIds" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-input style="width:200px;" placeholder="角色名称" size="mini" v-model="name" clearable></el-input>
        <el-tooltip class="item" content="搜索" placement="top">
          <el-button v-on:click="getRoles" icon="el-icon-search" size="mini">搜索</el-button>
        </el-tooltip>
        <el-tooltip class="item" content="新增" placement="left-end">
          <el-button type="primary" size="mini" @click="addGrade">新增</el-button>
        </el-tooltip>
      </span>
    </el-row>

    <!--列表-->
    <el-table :data="roles" highlight-current-row style="width: 100%;" size="mini" :row-style="tableRowStyle" :header-cell-style="tableHeaderColor" show-overflow-tooltip border stripe>
      <el-table-column type="selection" width="30">
      </el-table-column>
      <el-table-column type="expand" width="30" size="mini">
        <template slot-scope="props">
          <el-form label-position="rdesc" inline class="demo-table-expand">
            <el-form-item label="描述">
              <span>{{ props.row.rdesc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>
      <el-table-column prop="name" label="角色名称" width="220" align="center" sortable>
      </el-table-column>
      <el-table-column prop="gradeName" label="级别" width="130" align="center">
      </el-table-column>
      <el-table-column prop="partName" label="角色值" width="130" align="center">
      </el-table-column>
      <el-table-column prop="instName" label="适用单位" min-width="160" align="center">
      </el-table-column>
      <el-table-column prop="depName" label="适用部门" min-width="160" align="center">
      </el-table-column>
      <el-table-column prop="userName" label="适用用户" min-width="130" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="120" align="center" sortable>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button v-if="scope.row.grade === -1 || scope.row.grade === -1" type="primary" size="mini" @click="editRole(scope.$index, scope.row)" icon="el-icon-edit" circle plain></el-button>
          <el-tag v-else-if="scope.row.grade === 1" size="mini">超级权限-无权修改</el-tag>
          <el-button v-else type="primary" size="mini" circle plain>
            <svg-icon icon-class="禁止编辑" />
          </el-button>
          <el-button v-if="scope.row.grade !== 1" type="warning" size="mini" @click="handleUpdateRolePerms(scope.$index, scope.row)" icon="el-icon-view" circle plain></el-button>
          <el-button v-if="scope.row.grade === -1 || scope.row.part === -1" type="danger" size="mini" @click="delRole(scope.$index, scope.row)" circle plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" size="mini">批量删除</el-button> -->
      <el-pagination layout="total ,sizes, prev, pager, next ,jumper" :total="total" :page-sizes="[1, 5, 10,13, 20, 50, 100 ,200]" :page-size="size" @current-change="handleCurrentChange" @size-change="sizeChange" style="float:right;" background>
      </el-pagination>
    </el-col>

    <!--弹出窗口：编辑角色-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%" :before-close="closeForm" v-dialogDrag>
      <el-form :rules="editFormRules" ref="editForm" :model="editForm" label-position="left" label-width="150px">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="rdesc">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入" v-model="editForm.rdesc">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Code from '@/common/js/code'
import roleApi from '@/api/system/role'
import instApi from '@/api/system/institution'

export default {
  name: 'role_manage',
  data () {
    return {
      pageName: '角色管理',
      roles: [], // 部门数据集合

      gradeIds: [{ name: '系统级别', id: 1 }, { name: '单位级别', id: 2 }, { name: '部门级别', id: 3 }, { name: '自定义级别', id: -1 }],
      selectGrade: '',
      name: '',

      // 分页
      total: 0,
      page: 1,
      size: 13,
      sortField: 'id',

      textMap: {
        update: '修改自定义角色',
        create: '创建自定义角色'
      },
      options: [],
      dialogStatus: '', // 弹窗类型
      dialogFormVisible: false,
      editForm: {
        idx: null, // 表格的下标
        id: null,
        name: null,
        rdesc: null,
        created: null,
        updated: null
      },
      // 校验
      editFormRules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }

    }
  },
  computed: {
    ...mapGetters([
      'inst_id'
    ])
  },
  mounted () {
    this.getRoles()
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
      this.getRoles()
    },
    // 分页
    handleCurrentChange (val) {
      this.page = val
      this.getRoles()
    },
    // 清空弹窗
    closeForm () {
      this.dialogFormVisible = false
      this.$refs['editForm'].resetFields()
      this.options = []
    },
    // 获取角色列表
    getRoles () {
      const para = {
        grade: this.selectGrade || '',
        page: this.page,
        name: this.name,
        size: this.size,
        sortField: this.sortField
      }
      roleApi.getRoleList(para).then(res => {
        this.total = res.data.data.total
        this.roles = res.data.data.sysRoles
      })
    },
    // 新增角色
    addGrade () {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.editForm = {
        idx: null, // 表格的下标
        id: null,
        name: null,
        rdesc: null,
        created: null,
        updated: null
      }
      // 获取单位部门用户列表
      instApi.searchInstDepUsersByUser().then(res => {
        if (res.data.code === Code.SUCCESS) {
          this.options = res.data.data
        }
      })
    },
    // 新增
    createData: function () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            const para = this.editForm
            roleApi.addRole(para).then(res => {
              if (res.data.code === Code.SUCCESS) {
                this.$message({
                  message: '添加角色成功！',
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.closeForm()
                this.getRoles()
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
    // 删除
    delRole (index, row) {
      this.$confirm('删除角色会导致批量用户丢失权限，确认删除该角色吗?', '警告', {
        type: 'warning'
      })
        .then(() => {
          const para = { id: row.id }
          roleApi.deleteRole(para).then(res => {
            if (res.data.code === Code.SUCCESS) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
            this.getRoles()
          })
        })
        .catch(() => { })
    },
    // 显示编辑界面
    editRole (index, row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 保存编辑界面
    updateData () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              const para = Object.assign({}, this.editForm)// 合并
              roleApi.updateRole(para).then(res => {
                if (res.data.code === Code.SUCCESS) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.dialogFormVisible = false
                  this.closeForm()
                  this.getRoles()
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
    // 更新用户的角色
    handleUpdateRolePerms (idx, row) {
      if (row.grade === -1) {
        let ridd = ''
        switch (row.type) {
          case 1: ridd = row.instId; break
          case 2: ridd = row.depId; break
          case 3: ridd = row.userId; break
          default: break
        }
        this.$router.push({ name: 'custom_manage_custom_perm', params: { rid: ridd, type: row.type } })
      } else if (row.grade !== -1) {
        this.$router.push({ name: 'role_manage_role_perm', params: { roleId: row.id } })
      }
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
