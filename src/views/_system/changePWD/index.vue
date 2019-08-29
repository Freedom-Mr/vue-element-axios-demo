<template>
  <div class="app-container" v-loading="loading">

    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm" style="width:400px;margin: 0px auto;
    padding-top: 10%;">
      <el-form-item label="当前密码" prop="pwd">
        <el-input type="password" v-model.number="ruleForm2.pwd" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" @input="p_len" autocomplete="off" clearable>
        </el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码强度">
        <div class="lnu_container">
          <p v-bind:class="{ lovercase_valid: contains_lovercase }">小写字母</p>
          <p v-bind:class="{ number_valid: contains_number }">数字</p>
          <p v-bind:class="{ uppercase_valid: contains_uppercase }">大写字母</p>
        </div>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
      </el-form-item>
    </el-form>

  </div>
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
      loading: false,
      contains_lovercase: false,
      contains_number: false,
      contains_uppercase: false,
      ruleForm2: {
        pass: '',
        checkPass: '',
        pwd: '',
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
      this.loading = true;
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
            this.loading = false;
          }).catch(e => {
            this.$refs['ruleForm2'].resetFields()
            this.loading = false;
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    p_len () {
      this.contains_lovercase = /[a-z]/.test(this.ruleForm2.pass);
      this.contains_number = /\d/.test(this.ruleForm2.pass);
      this.contains_uppercase = /[A-Z]/.test(this.ruleForm2.pass);

      // Check if the password is valid
      if (this.contains_lovercase == true && this.contains_number == true) {
        this.valid_password = false;
        if (
          this.contains_uppercase == true &&
          this.valid_password_length == true
        )
          this.valid_password = true;
      } else {
        this.valid_password = false;
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped >
.app-container {
  .lnu_container {
    display: block;
    width: 300px;
    height: auto;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  .lnu_container p {
    width: 90px;
    height: auto;
    font-size: 12px;
    line-height: 1.2;
    text-align: center;
    border-radius: 2px;
    color: rgba(71, 87, 98, 0.8);
    background: -webkit-linear-gradient(left, #00ad7c 50%, #eee 50%);
    background: linear-gradient(to right, #00ad7c 50%, #eee 50%);
    background-size: 201% 100%;
    background-position: right;
    -webkit-transition: background 0.3s;
    transition: background 0.3s;
  }

  .lovercase_valid,
  .number_valid,
  .uppercase_valid {
    background-position: left !important;
    color: rgba(255, 255, 255, 0.9) !important;
  }
}
</style>
