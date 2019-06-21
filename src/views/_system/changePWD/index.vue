<template>
  <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm" style="width:400px;margin: 0px auto;
    padding-top: 10%;">
    <el-form-item label="当前密码" prop="pwd">
      <el-input type="password" v-model.number="ruleForm2.pwd" autocomplete="off" clearable></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="pass">
      <el-input type="password" v-model="ruleForm2.pass" autocomplete="off" clearable></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off" clearable></el-input>
    </el-form-item>

    <el-form-item style="text-align: center">
      <el-button @click="resetForm('ruleForm2')">重置</el-button>
      <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import userApi from '@/api/system/user'
import { stringReverse } from '@/common/js/index'
import Code from '@/common/js/code'
import { mapGetters } from 'vuex'
let Base64 = require('js-base64').Base64
export default {
  data () {
    var checkPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入当前密码'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm2: {
        pass: '',
        checkPass: '',
        pwd: ''
      },
      rules2: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        pwd: [
          { validator: checkPwd, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user_id'
    ])
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const para = this.ruleForm2
          para.pwd = Base64.encode(stringReverse(para.pwd))
          para.checkPass = Base64.encode(stringReverse(para.checkPass))
          para.pass = Base64.encode(stringReverse(para.pass))
          para.userId = this.user_id
          userApi.uppd(para).then(res => {
            if (res.data.code === Code.SUCCESS) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.$store.dispatch('LogOut').then(() => {
                location.reload()
              })
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              })
              this.$refs['ruleForm2'].resetFields()
            }
          }).catch(e => {
            this.$refs['ruleForm2'].resetFields()
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped >
.app-container {
}
</style>
