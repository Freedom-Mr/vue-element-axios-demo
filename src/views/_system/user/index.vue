<template>
  <div class="app-container">
    <!--查询  -->
    <el-row style="padding-bottom:6px">
      <el-tag size="medium">用户管理</el-tag>
      <span style="float:right">
        <el-select v-model="selectRole" size="mini" @change="searchUser">
          <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-cascader v-model="selectedInstDep" change-on-select :options="options" @change="searchUser" placeholder="选择单位部门" size="mini" clearable></el-cascader>
        <el-select v-model="selectLock" placeholder="选择锁定用户" size="mini" @change="searchUser" clearable>
          <el-option v-for="item in locks" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-date-picker v-model="selectDeadline" type="datetime" @change="searchUser" placeholder="选择用户失效时间" align="right" :picker-options="pickerOptions" size="mini">
        </el-date-picker>
        <el-input style="width:200px;" placeholder="姓名或账户检索" size="mini" v-model="userName" clearable></el-input>
        <el-tooltip class="item" content="搜索" placement="top">
          <el-button v-on:click="searchUser" icon="el-icon-search" size="mini">搜索</el-button>
        </el-tooltip>
        <el-tooltip class="item" content="新增" placement="left-end">
          <el-button type="primary" size="mini" @click="addUser" v-perm="'b:user:add'">新增</el-button>
        </el-tooltip>
      </span>
    </el-row>
    <!--列表-->
    <el-table :data="users" highlight-current-row style="width: 100%;" size="mini" v-loading="loading" show-overflow-tooltip border stripe>
      <el-table-column type="selection" width="30" />
      <el-table-column type="expand" width="30" size="mini">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="登录限制数：">
              <span v-if="props.row.uniqueLogin != null">{{ props.row.uniqueLogin }}</span>
              <span v-else>--</span>
            </el-form-item>
            <el-form-item label="电话：">
              <span v-if="props.row.telephone != null">{{ props.row.telephone }}</span>
              <span v-else>--</span>
            </el-form-item>
            <el-form-item label="电子邮件：">
              <span v-if="props.row.email != null">{{ props.row.email }}</span>
              <span v-else>--</span>
            </el-form-item>
            <el-form-item label="备注：">
              <span v-if="props.row.note != null">{{ props.row.note }}</span>
              <span v-else>--</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="username" label="账号" width="130" align="center" sortable/>
      <el-table-column prop="realName" label="姓名" width="160" align="center" />
      <el-table-column prop="inst.name" label="单位名称" :formatter="formatInst" min-width="120" align="center" />
      <el-table-column prop="dep.name" label="部门名称" :formatter="formatDep" min-width="120" align="center" />
      <el-table-column prop="roleName" label="角色" width="160" align="center" />
      <el-table-column prop="deadline" label="失效时间" min-width="135" align="center" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.deadline !== null  && timeFormat(scope.row.deadline)" style="color: #c1a553">{{scope.row.deadline}}</span>
          <span v-if="scope.row.deadline !== null && !timeFormat(scope.row.deadline)" style="color: red">{{scope.row.deadline}}</span>
          <span v-if="scope.row.deadline === null">--</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="锁定" min-width="70" align="center" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0" style="color: red">已锁定</span>
          <span v-else-if="scope.row.status === 1">--</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="135" align="center" sortable/>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <!-- 超级账号可编辑所有账号， 同级角色账号不可互相编辑 -->
          <el-tooltip content="用户编辑" placement="top">
            <el-button v-if=" scope.row.instId > 0 && ( login_user_inst_id === -1  ||
               ( login_user_dep_id === -1 && scope.row.depId === -1 && scope.row.part !== 1 && login_user_part === 1)||
               ( login_user_dep_id === -1 && scope.row.depId !== -1 && login_user_part === 1)||
               ( login_user_dep_id !== -1 && login_user_dep_id===scope.row.depId && scope.row.part !== 1 && login_user_part === 1) )" type="info" @click="editUpdateUser(scope.$index, scope.row)" v-perm="'b:user:update'" size="mini" icon="el-icon-edit" circle plain></el-button>
          </el-tooltip>
          <el-tooltip content="用户权限分配！" placement="top">
            <el-button v-if=" scope.row.instId > 0 && ( login_user_inst_id === -1  ||
               ( login_user_dep_id === -1 && scope.row.depId === -1 && scope.row.part !== 1 && login_user_part === 1)||
               ( login_user_dep_id === -1 && scope.row.depId !== -1 && login_user_part === 1)||
               ( login_user_dep_id !== -1 && login_user_dep_id===scope.row.depId && scope.row.part !== 1 && login_user_part === 1) )" type="primary" @click="handleUpdateCustomPerms(scope.$index, scope.row)" v-perm="'b:user:perm'" size="mini" icon="el-icon-view" circle plain></el-button>
          </el-tooltip>
          <el-tooltip content="用户删除！" placement="top-end">
            <el-button v-if=" scope.row.instId > 0 && ( login_user_inst_id === -1  ||
               ( login_user_dep_id === -1 && scope.row.depId === -1 && scope.row.part !== 1 && login_user_part === 1)||
               ( login_user_dep_id === -1 && scope.row.depId !== -1 && login_user_part === 1)||
               ( login_user_dep_id !== -1 && login_user_dep_id===scope.row.depId && scope.row.part !== 1 && login_user_part === 1) )" type="danger" @click="delUser(scope.$index, scope.row)" v-perm="'b:user:delete'" size="mini" icon="el-icon-delete" circle plain></el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.instId === -1" class="item" effect="dark" content="无权限操作！" placement="top-end">
            <el-tag type="warning">超级用户</el-tag>
          </el-tooltip>
          <el-tooltip v-else-if=" scope.row.instId > 0 && ( login_user_inst_id === -1  ||
               ( login_user_dep_id === -1 && scope.row.depId === -1 && scope.row.part !== 1 && login_user_part === 1)||
               ( login_user_dep_id === -1 && scope.row.depId !== -1 && login_user_part === 1)||
               ( login_user_dep_id !== -1 && login_user_dep_id===scope.row.depId && scope.row.part !== 1 && login_user_part === 1) )" type="danger" @click="delUser(scope.$index, scope.row)">
          </el-tooltip>
          <el-tooltip v-else class="item" effect="warning" content="无权限操作！" placement="right-start">
            <el-tag type="warning">无权限操作</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total ,sizes, prev, pager, next ,jumper" :total="total" :page-sizes="[1, 5, 10,13, 20, 50, 100 ,200]" :pager-count="5" :page-size="size" @current-change="handleCurrentChange" @size-change="sizeChange" style="float:right;" background>
      </el-pagination>
    </el-col>
    <!-- 用户信息弹窗 -->
    <el-dialog v-dialogDrag :title="textMap[dialogStatus]" v-loading="loading2" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="closeForm" width="800px">
      <div>
        <el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm" status-icon class="dialogFrom">
          <el-row>
            <el-col :span="8">
              <el-form-item label="照片" prop="profilePhoto" size="mini">
                <el-upload :auto-upload="false" ref="uploadImg" :class="{'disabled':uploadDisabled}" action="#" list-type="picture-card" :file-list="imagelist" :before-upload="beforeUpload" :on-change="handleUploadChange" :on-remove="handleUploadRemove" accept=".png,.jpg,.gif,.webp,.bmp">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="账号" prop="username" size="mini">
                    <el-input v-model="editForm.username" autocomplete="off" type="text" :disabled="disabledUserName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="密码" prop="password" size="mini">
                    <el-input v-model="editForm.password" autocomplete="off" type="text" onfocus="this.type='password'"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="邮件" prop="email" size="mini">
                    <el-input v-model="editForm.email"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="电话" prop="telephone" size="mini">
                    <el-input placeholder="电话号码" v-model="editForm.telephone"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="真实姓名" prop="realName" size="mini">
                    <el-input v-model="editForm.realName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="角色" prop="part" size="mini">
                    <el-select v-model="editForm.part" clearable placeholder="角色选择" size="mini" @change="changeInst">
                      <el-option v-for="item in parts" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row :span="15">
            <el-col :span="12">
              <el-form-item label="所属单位" prop="instId" size="mini">
                <el-select v-model="editForm.instId" clearable placeholder="选择单位" size="mini" @change="changeInst">
                  <el-option v-for="item in instIds" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属部门" prop="depId" size="mini">
                <el-select v-model="editForm.depId" clearable placeholder="选择部门" size="mini">
                  <el-option v-for="item in depIds" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="15">
            <el-col :span="10">
              <el-form-item label="失效时间" prop="deadline" size="mini">
                <el-date-picker v-model="editForm.deadline" type="datetime" placeholder="选择失效时间" :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="禁止登录" prop="status" size="mini">
                <el-switch v-model="editForm.status" active-value='0' inactive-value='1' active-color="red"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="同时在线  " prop="uniqueLogin" size="mini">
                <el-input-number v-model="editForm.uniqueLogin" :min=0 :max=50 label="限制在线"></el-input-number>
                <el-tooltip class="item" effect="light" content="同时在线：是指同一个账号同一时间在不同地方登录在线的个数限制，如果超出限制新登录者将会剔除最早登录的登录者！设置为0时不限制用户登录数量！" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <!--已加入权限-->
          <el-form-item label="IP白名单" prop="note" v-perm="'b:user:whiteList'">
            <el-tag :key="tag" v-for="tag in dynamicTags" :closable="true" :disable-transitions="false" @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加IP</el-button>
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
          <el-button v-else type="primary" @click="updateData">修改</el-button>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>

import instApi from '@/api/system/institution'
import userApi from '@/api/system/user'
import { mapGetters } from 'vuex'
import axios from 'axios'
import Code from '@/common/js/code'
import { pickerOptions2, stringReverse } from '@/common/js/index'

let Base64 = require('js-base64').Base64

export default {

  name: 'user_manage',

  data () {
    var validateUserName = (rule, value, callback) => {
      if (this.disabledUserName) {
        callback()
      } else {
        const para = { userName: value }
        userApi.isUserName(para).then(res => {
          if (res.data.code === Code.SUCCESS) {
            res.data.data.isUser ? callback(new Error('账户名已存在')) : callback()
          } else {
            callback(new Error('账户名验证错误'))
          }
        }).catch(e => {
          // 打印一下错误
          callback(new Error('账户名验证错误'))
        })
      }
    }
    var validateDepId = (rule, value, callback) => {
      if (this.login_user_inst_id !== -1 && this.login_user_dep_id !== -1 && !value) {
        callback(new Error('部门不能为空'))
      } else {
        callback()
      }
    }
    return {
      // 条件
      roles: [{ name: '全部角色', id: -1 }, { name: '管理员', id: 1 }, { name: '审计员', id: 2 }, { name: '业务员', id: 3 }],
      selectRole: '',
      options: [],
      selectedInstDep: [],
      locks: [{ name: '已锁定用户', id: 0 }, { name: '未锁定用户', id: 1 }],
      selectLock: '',
      pickerOptions: pickerOptions2,
      selectDeadline: '',
      userName: '',
      uploadImg: null,
      imagelist: [], //头像
      uploadDisabled: false,
      uploadForm: new FormData(),

      // 用户集合
      users: [],

      // 分页
      total: 0,
      page: 1,
      size: 13,

      // 加载
      loading: false,
      loading2: false,
      // 监听弹窗单位
      monitor_inst: null,

      dialogStatus: '', // 弹窗类型
      dialogFormVisible: false,
      active: 0,
      // 编辑
      textMap: {
        update: '修改用户',
        create: '创建用户'
      },
      // 编辑界面
      editForm: {
        username: null,
        password: null,
        realName: null,
        telephone: null,
        profilePhoto: [],
        deadline: null,
        email: null,
        instId: null,
        instName: null,
        part: null,
        depId: null,
        depName: null,
        status: 1,
        uniqueLogin: 0,
        note: null
      },
      disabledUserName: false,
      instIds: [],
      depIds: [],
      parts: [],
      // 校验
      editFormRules: {
        username: [{ required: true, message: '账号不能为空', trigger: 'blur' }, {
          min: 3,
          max: 10,
          message: '长度在 3 到 10 个字符',
          trigger: 'blur'
        }, { validator: validateUserName, trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        realName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        instId: [{ required: true, message: '请选择单位', trigger: 'change', type: 'number' }],
        part: [{ required: true, message: '请选择角色', trigger: 'change', type: 'number' }],
        depId: [{ validator: validateDepId, trigger: 'change' }]
      },

      dialogRolevisible: false,
      editRoleForm: {
        roleId: null
      },

      login_user_inst_id: '',
      login_user_dep_id: '',
      login_user_part: '',
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      editUserId: null,
      isDeleteImg: false
    }
  },
  computed: {
    ...mapGetters([
      'inst_id',
      'dep_id',
      'part'
    ])
  },
  watch: {
    'editForm.instId': function (newVal, oldVal) {
      if (this.monitor_inst !== newVal) {
        this.editForm.depId = null
      }
    },
    'editForm.depId': function (newVal, oldVal) {
      if (this.part === 1 && this.login_user_inst_id !== -1 && this.login_user_dep_id === -1 && !newVal) {
        this.parts = [{ name: '审计员', id: 2 }, { name: '业务员', id: 3 }]
        this.editForm.part = null
      } else if (this.part === 1 && this.login_user_inst_id !== -1 && this.login_user_dep_id === -1 && newVal) {
        this.parts = [{ name: '管理员', id: 1 }, { name: '审计员', id: 2 }, { name: '业务员', id: 3 }]
      }
    }
  },
  mounted () {
    this.searchInstDeps()
    this.searchUser()
  },

  methods: {
    // 每页条数
    sizeChange (val) {
      this.size = val
      this.searchUser()
    },
    // 分页
    handleCurrentChange (val) {
      this.page = val
      this.searchUser()
    },
    // 关闭弹窗
    closeForm () {
      this.dynamicTags = []
      this.dialogFormVisible = false
      this.dialogRolevisible = false
      this.$refs['editForm'].resetFields()
      this.instIds = []
      this.depIds = []
      this.imagelist = []
      this.uploadForm = new FormData()
      if (this.$refs['editRoleForm']) {
        this.$refs['editRoleForm'].resetFields();
      }
    },
    // 初始化
    searchInstDeps () {
      this.login_user_inst_id = this.inst_id
      this.login_user_dep_id = this.dep_id
      this.login_user_part = this.part
      this.selectRole = this.roles.filter(x => x.id === -1)[0].id
      instApi.searchInstDepsByUser().then(res => {
        if (res.data.code === Code.SUCCESS) {
          this.options = res.data.data
        }
      })
    },
    // 查询用户列表
    searchUser () {
      const data = {
        page: this.page,
        size: this.size,
        selectRole: this.selectRole,
        selectedInstDep: this.selectedInstDep,
        selectLock: this.selectLock,
        selectDeadline: this.selectDeadline,
        userName: this.userName
      }
      this.loading = true
      userApi.getUsers(data).then(res => {
        if (res.data.code === Code.SUCCESS) {
          this.total = res.data.data.total
          this.users = res.data.data.sysUsers
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    formatDep (row, column) {
      return row.dep === null ? '--' : row.dep.name
    },
    formatInst (row, column) {
      return row.inst === null ? '--' : row.inst.name
    },
    // 时间比较
    timeFormat (date) {
      return new Date(date.substring(0, 19).replace(/-/g, '/')).getTime() > new Date().getTime()
    },
    addUser () {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.disabledUserName = false
      this.editForm = {
        username: null,
        password: null,
        realName: null,
        telephone: null,
        profilePhoto: null,
        deadline: null,
        email: null,
        instId: null,
        instName: null,
        part: null,
        depId: null,
        depName: null,
        status: 1,
        uniqueLogin: 0,
        note: null
      }
      this.instIds = []
      this.depIds = []
      this.options.forEach((item, index) => {
        var json = {}
        json.id = item.value
        json.name = item.label
        this.instIds.push(json)
      })
      this.roless();
      this.initDialog();
    },
    // 角色显示
    roless () {
      this.parts = [{ name: '管理员', id: 1 }, { name: '审计员', id: 2 }, { name: '业务员', id: 3 }]
      if (this.login_user_inst_id === -1 && this.login_user_dep_id === -1) { // 超管
      } else if (this.part === 1 && this.login_user_dep_id === -1) { // 单位管理员
        if (!this.editForm.depId) {
          this.parts = [{ name: '审计员', id: 2 }, { name: '业务员', id: 3 }]
        }
      } else if (this.part === 1 && this.login_user_dep_id !== -1) { // 部门管理员
        this.parts = [{ name: '审计员', id: 2 }, { name: '业务员', id: 3 }]
      } else {
        this.parts = []
      }
    },
    // 弹窗单位选择改变部门
    changeInst () {
      this.depIds = []
      this.options.forEach((item, index) => {
        if (item.value === this.editForm.instId) {
          item.children.forEach((item2, index2) => {
            var json = {}
            json.id = item2.value
            json.name = item2.label
            this.depIds.push(json)
          })
        }
      })
    },
    handleAvatarSuccess (res, file) {
      this.editFormpro.filePhoto = URL.createObjectURL(file.raw)
    },
    // 新增
    createData: function () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.loading2 = true
            const para = this.editForm
            para.password = Base64.encode(stringReverse(this.editForm.password))
            para.whiteList = this.dynamicTags
            userApi.addUser(para).then(res => {
              if (res.data.code === Code.SUCCESS) {
                this.$message({
                  message: '添加用户成功！',
                  type: 'success'
                })
                //-----
                if (this.uploadImg) {
                  let temp = new FormData();
                  temp.append('id', res.data.data);
                  temp.append('file', this.uploadImg);
                  let config = {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                  }
                  this.$axios.post('/sys_user/uploadImage', temp, config).then(res => {
                    this.searchUser()
                    this.loading2 = false
                    this.closeForm()
                  }).catch(e => {
                    this.loading2 = false
                  })
                } else {
                  this.searchUser()
                  this.loading2 = false
                  this.closeForm()
                }
                //-----
              } else {
                this.loading2 = false
              }
            })
          }).catch(e => {
            // 打印一下错误
            console.log(e)
            this.loading2 = false
          })
        }
      })

    },
    updateGradeRole: function () {
      this.$refs.editRoleForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交修改吗？', '提示', {}).then(() => {
            const para = Object.assign({}, this.editRoleForm)// 合并
            userApi.updateUserRole(para).then(res => {
              if (res.data.code === Code.SUCCESS) {
                this.$message({
                  message: '修改用户角色成功！',
                  type: 'success'
                })
                if (this.$refs['editRoleForm']) {
                  this.$refs['editRoleForm'].resetFields();
                }
                this.dialogRolevisible = false
                this.searchUser()
              }
            })
          }).catch(e => {
            // 打印一下错误
            console.log(e)
          })
        }
      })
    },
    // 显示编辑界面
    editUpdateUser (index, row) {
      this.initDialog();
      this.editUserId = row.id;
      if (this.editUserId) {
        this.$axios.post('/sys_user/searchImage', null, { params: { userId: row.id } }).then(res => {
          if (res.data && res.data.photo) {
            let m = { name: '默认', url: `data:image/${res.data.format};base64,${res.data.photo}` };
            this.imagelist.push(m)
            this.uploadDisabled = true;
          }
        });
      }
      //----
      const param = {
        userId: row.id
      }
      this.dynamicTags = []
      userApi.getIpLise(param).then(res => {
        if (res.data.data) {
          for (let i of res.data.data) {
            this.dynamicTags.push(i.ip);
          }
        }
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.disabledUserName = true
      this.editForm = Object.assign({ 'password': null }, row)
      this.monitor_inst = this.editForm.instId
      this.editForm.status = this.editForm.status.toString()
      this.instIds = []
      this.options.forEach((item, index) => {
        var json = {}
        json.id = item.value
        json.name = item.label
        this.instIds.push(json)
      })
      this.changeInst()
      if (row.depId === -1) {
        this.editForm.depId = null
      }
      const para = { id: row.id }
      userApi.getUserPwd(para).then(res => {
        if (res.data.code === Code.SUCCESS) {
          this.editForm.password = stringReverse(Base64.decode(res.data.data.p))
        }
      })
      this.roless()
    },
    // 修改用户信息
    updateData () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            const para = this.editForm
            para.password = Base64.encode(stringReverse(this.editForm.password))
            para.whiteList = this.dynamicTags
            userApi.updateUser(para).then(res => {
              if (res.data.code === Code.SUCCESS) {
                this.$message({
                  message: '修改用户成功！',
                  type: 'success'
                })
                if (this.isDeleteImg && this.editUserId) {
                  const uuid = { userId: this.editUserId }
                  userApi.delImage(uuid).then(ress => {
                    this.loading2 = false
                    this.searchUser()
                    this.closeForm();
                  })
                } else if (this.uploadImg && this.editUserId) {
                  let temp = new FormData();
                  temp.append('id', this.editUserId);
                  temp.append('file', this.uploadImg);
                  let config = {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  }
                  this.$axios.post('/sys_user/uploadImage', temp, config).then(res => {
                    this.loading2 = false
                    this.searchUser()
                    this.closeForm();
                  }).catch(e => {
                    this.loading2 = false
                  })
                } else {
                  this.loading2 = false
                  this.searchUser()
                  this.closeForm()
                }

              }
            })
          }).catch(e => {
            // 打印一下错误
            console.log(e)
          })
        }
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
    // 删除
    delUser (index, row) {
      this.$confirm('确认删除该用户吗?', '警告', {
        type: 'warning'
      }).then(() => {
        const para = { id: row.id }
        userApi.deleteUser(para).then(res => {
          if (res.data.code === Code.SUCCESS) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
          this.searchUser()
        })
      }).catch(() => {
      })
    },
    //
    initDialog () {
      if (this.$refs.uploadImg) {
        this.$refs.uploadImg.clearFiles();
      }
      this.imagelist = [];
      this.uploadImg = null;
      this.uploadDisabled = false;
      this.isDeleteImg = false;
      this.editUserId = null;
    },
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput () {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm () {
      let inputValue = this.inputValue;

      if (inputValue) {
        if (this.isIP(inputValue)) {
          if (this.dynamicTags.length > 0) {
            let j = 0
            for (let i of this.dynamicTags) {
              if (i === inputValue) {
                j++
              }
            }
            if (j === 0) {
              this.dynamicTags.push(inputValue);
            } else {
              this.$confirm('IP有重复', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              })
            }
          } else {
            this.dynamicTags.push(inputValue);
          }
        } else {
          this.$confirm('IP格式有误', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        }
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    isIP (value) {
      if (value.indexOf('*') != -1) {
        var regexp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\*$/;
        var valid = regexp.test(value);
        if (!valid) {//首先必须是 xxx.xxx.xxx.xxx 类型的数字，如果不是，返回false
          return false;
        }
      } else {
        var xxxxx = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
        var validx = xxxxx.test(value);
        if (!validx) {//首先必须是 xxx.xxx.xxx.xxx 类型的数字，如果不是，返回false
          return false;
        }
      }
      return value.split('.').every(function (num) {
        //切割开来，每个都做对比，可以为0，可以小于等于255，但是不可以0开头的俩位数
        //只要有一个不符合就返回false
        if (num.length > 1 && num.charAt(0) === '0') {
          //大于1位的，开头都不可以是‘0’
          return false;
        } else if (parseInt(num, 10) > 255) {
          //大于255的不能通过
          return false;
        }
        return true;
      });
    },
    handleUpdateCustomPerms (idx, row) {
      this.$router.push({ name: 'custom_manage_custom_perm', params: { rid: row.id, type: 3 } })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 150px;
  margin-left: 10px;
  vertical-align: bottom;
}

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

  .disabled /deep/ .el-upload--picture-card {
    display: none;
  }
}
</style>
