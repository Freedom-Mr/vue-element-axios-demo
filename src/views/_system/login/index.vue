<template>
  <div class="login-container">
    <div style="position: relative;left: 1%;top: 3%;">
      <!-- <img :src="imgLogo" style="display: inline-block;width: 59px;"> -->
    </div>
    <div class="login-div">
      <el-form class="login-form" autoComplete="off" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <div class="title-container">
          <!-- <h3 class="title">{{ $t("m.system_login") }} </h3>-->
          <img :src="imgUrl" style="width: 100%;padding-bottom: 38px;">
        </div>

        <el-form-item prop="username">
          <span class="svg-container svg-container_login">
            <svg-icon icon-class="人2" />
          </span>
          <el-input class="inp" name="username" type="text" v-model="loginForm.username" auto-complete="new-password" :placeholder="$t('m.account_tip')" clearable autocomplete="off" />
          <!-- 语言选择 -->
          <span class="show-pwd">
            <lang-select class="set-language"></lang-select>
          </span>
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="锁2" />
          </span>
          <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" auto-complete="new-password" :placeholder="$t('m.password_tip')" clearable autocomplete="off" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon v-show="kai" icon-class="睁眼" />
            <svg-icon v-show="bi" icon-class="闭眼" />
          </span>
        </el-form-item>

        <!-- 滑动验证 -->
        <div class="drag" ref="dragDiv">
          <div class="drag_bg"></div>
          <div class="drag_text">{{confirmWords}}</div>
          <div ref="moveDiv" @mousedown="mousedownFn($event)" :class="{'handler_ok_bg':confirmSuccess}" class="handler handler_bg" style="position: absolute;top: 0px;left: 0px;height: 100%;"></div>
        </div>
        <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">{{ $t('m.login') }}
        </el-button>
      </el-form>
    </div>
    <div style="position:absolute;right:2%;bottom:0px;">
      {{ $t("m.system_version") }}：
      <span ref='countup'></span>
    </div>
  </div>
</template>

<script>
import '@/common/css/login.scss' // 样式
import avatar from '@/common/image/png/tu2.png'
import { isvalidUsername } from '@/common/js/validate' // 校验组件
import LangSelect from '@/components/LangSelect' // 语言
import CountUp from 'countup.js' // 计数组件

export default {
  components: { LangSelect },
  name: 'login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 2 || !isvalidUsername(value)) {
        callback(new Error('* 请输入正确的用户帐号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('* 密码不能少于1个字符'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: null,
        password: null
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      kai: false,
      bi: true,
      showDialog: false,
      items: [
        { img: avatar }
        // { img: picture }
      ],
      beginClientX: 0, /* 距离屏幕左端距离 */
      mouseMoveStata: false, /* 触发拖动状态  判断 */
      maxwidth: '', /* 拖动最大宽度，依据滑块宽度算出来的 */
      confirmWords: '拖动滑块验证', /* 滑块文字 */
      confirmSuccess: false, /* 验证成功判断 */
      imgUrl: require('../../../common/image/png/logo1.png')
    }
  },
  mounted () {
    this.initCountUp()
    this.maxwidth = this.$refs.dragDiv.clientWidth - this.$refs.moveDiv.clientWidth
    document.getElementsByTagName('html')[0].addEventListener('mousemove', this.mouseMoveFn)
    document.getElementsByTagName('html')[0].addEventListener('mouseup', this.moseUpFn)
  },
  methods: {
    initCountUp () {
      this.numAnim = new CountUp(this.$refs.countup, 0, 2018)
      this.numAnim.start()
    },
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
        this.kai = true
        this.bi = false
      } else {
        this.passwordType = 'password'
        this.kai = false
        this.bi = true
      }
    },
    handleLogin () {
      if (this.confirmSuccess === true) {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('LoginByUsername', this.loginForm).then(res => {
              this.loading = false
              if (res.data.code === this.$Code.SUCCESS) {
                this.$router.push({ path: '/' })
              }
            }).catch(() => {
              this.loading = false
            })
          }
        })
      } else {
        alert('请滑动验证')
      }
    },
    mousedownFn: function (e) {
      if (!this.confirmSuccess) {
        e.preventDefault && e.preventDefault() // 阻止文字选中等 浏览器默认事件
        this.mouseMoveStata = true
        this.beginClientX = e.clientX
      }
    }, // mousedoen 事件
    successFunction () {
      this.confirmSuccess = true
      this.confirmWords = '验证通过'
      if (window.addEventListener) {
        document
          .getElementsByTagName('html')[0]
          .removeEventListener('mousemove', this.mouseMoveFn)
        document
          .getElementsByTagName('html')[0]
          .removeEventListener('mouseup', this.moseUpFn)
      } else {
        document
          .getElementsByTagName('html')[0]
          .removeEventListener('mouseup', () => { })
      }
      document.getElementsByClassName('drag_text')[0].style.color = '#fff'
      document.getElementsByClassName('handler')[0].style.left =
        this.maxwidth + 'px'
      document.getElementsByClassName('drag_bg')[0].style.width =
        this.maxwidth + 'px'
    }, // 验证成功函数
    mouseMoveFn (e) {
      if (this.mouseMoveStata) {
        let width = e.clientX - this.beginClientX
        if (width > 0 && width <= this.maxwidth) {
          document.getElementsByClassName('handler')[0].style.left =
            width + 'px'
          document.getElementsByClassName('drag_bg')[0].style.width =
            width + 'px'
        } else if (width > this.maxwidth) {
          this.successFunction()
        }
      }
    }, // mousemove事件
    moseUpFn (e) {
      this.mouseMoveStata = false
      var width = e.clientX - this.beginClientX
      if (width < this.maxwidth) {
        document.getElementsByClassName('handler')[0].style.left = 0 + 'px'
        document.getElementsByClassName('drag_bg')[0].style.width = 0 + 'px'
      }
    }
  }
}
</script>
<style>
.login-container {
  width: 100%;
  height: 100%;
  background-image: url("../../../common/image/jpg/bg.jpg");
  background-size: cover;
}
/* .tips{
    margin-bottom: 22px;
    margin-top: 35px;
} */
.drag {
  position: relative;
  background-color: #427ebb;
  width: 100%;
  height: 34px;
  line-height: 34px;
  text-align: center;
  margin-bottom: 13px;
}
.handler {
  width: 40px;
  height: 32px;
  border: 1px solid #ccc;
  cursor: move;
}
.handler_bg {
  background: #fff
    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg==")
    no-repeat center;
}
.handler_ok_bg {
  background: #fff
    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDlBRDI3NjVGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDlBRDI3NjRGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNWEzMWNhMC1hYmViLTQxNWEtYTEwZS04Y2U5NzRlN2Q4YTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k+sHwwAAASZJREFUeNpi/P//PwMyKD8uZw+kUoDYEYgloMIvgHg/EM/ptHx0EFk9I8wAoEZ+IDUPiIMY8IN1QJwENOgj3ACo5gNAbMBAHLgAxA4gQ5igAnNJ0MwAVTsX7IKyY7L2UNuJAf+AmAmJ78AEDTBiwGYg5gbifCSxFCZoaBMCy4A4GOjnH0D6DpK4IxNSVIHAfSDOAeLraJrjgJp/AwPbHMhejiQnwYRmUzNQ4VQgDQqXK0ia/0I17wJiPmQNTNBEAgMlQIWiQA2vgWw7QppBekGxsAjIiEUSBNnsBDWEAY9mEFgMMgBk00E0iZtA7AHEctDQ58MRuA6wlLgGFMoMpIG1QFeGwAIxGZo8GUhIysmwQGSAZgwHaEZhICIzOaBkJkqyM0CAAQDGx279Jf50AAAAAABJRU5ErkJggg==")
    no-repeat center;
}
.drag_bg {
  background-color: #7ac23c;
  height: 34px;
  width: 0px;
}
.drag_text {
  position: absolute;
  top: 0px;
  width: 100%;
  text-align: center;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  -o-user-select: none;
  -ms-user-select: none;
  color: #fff;
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  -webkit-text-fill-color: #333;
}
</style>
