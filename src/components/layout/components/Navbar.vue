<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <!-- <error-log class="errLog-container right-menu-item"></error-log> -->
      <!-- 锁屏 -->
      <web-lock style="cursor:pointer" class="right-menu-item nx-help"></web-lock>
      <!-- 全屏 -->
      <screenFull class="screenfull right-menu-item nx-help" style="cursor:pointer"></screenFull>
      <!-- 语言选择 -->
      <el-tooltip effect="light" content="语言切换" placement="bottom">
        <lang-select class="set-language right-menu-item"></lang-select>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <span v-if="realName">{{realName}}</span>
          <span v-else>{{account}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>

        <el-dropdown-menu slot="dropdown">
          <div style="width:180px;height:300px;text-align: center;">
            <el-dropdown-item disabled>
              <img :src="profile_photo" width="100px" height="100px" style="border-radius: 50%;box-shadow: 0 0 0 4px rgba(0,0,0,.1);" />
            </el-dropdown-item>
            <el-dropdown-item divided disabled>
              <h4 v-if="realName" style="margin-top: 0px;margin-bottom: 0px;font-size: 1.2em;color:#545151">{{realName}}</h4>
              <h4 v-else style="margin-top: 0px;margin-bottom: 0px;font-size: 1.2em;#545151">{{account}}</h4>
              <p v-if="roles.length==0" style="margin-top: 0px;margin-bottom: 0px;font-size:.9em;color: #afb9c3;">游客（未配置任何角色）</p>
              <p v-else v-for="r in roles" :key="r.val" style="margin-top: 0px;margin-bottom: 0px;font-size:.9em;color: #afb9c3;">{{r.name}}</p>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <el-tooltip effect="light" content="用户资料" placement="top">
                <router-link to="/system/details_manage" style="display: initial;padding-right: 5px;">
                  <svg-icon icon-class="资料" />
                </router-link>
              </el-tooltip>
              <el-tooltip effect="light" content="密码修改" style="display: initial;" placement="top">
                <router-link to="/system/pwd_manage">
                  <svg-icon icon-class="邮箱" />
                </router-link>
              </el-tooltip>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button @click="logout" type="info" size="mini" style="width: 100%;" round>退出</el-button>
            </el-dropdown-item>
          </div>
        </el-dropdown-menu>

      </el-dropdown>
    </div>
  </el-menu>

</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb' // 横向面包屑导航
import Hamburger from '@/components/Hamburger' // 左侧导航展开闭合
import ErrorLog from '@/components/ErrorLog'
// import userApi from '@/api/user'
import LangSelect from '@/components/LangSelect' // 语言
import screenFull from '@/components/ScreenFull/index' // 全屏
import webLock from '@/components/web-lock' // 锁屏

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    LangSelect,
    screenFull,
    webLock
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'account',
      'realName',
      'profile_photo',
      'roles'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('toggleSideBar')
    },
    logout () {
      this.$confirm('是否确认退出', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      }).catch(() => {

      })
    },
    handleUpdatePwd () {
      this.dialogVisible = true
      this.$nextTick(() => this.$refs['dataForm'].clearValidate())
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 35px;
  line-height: 35px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 42px;
    height: 35px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .nx-help {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
      }
    }
  }
}
</style>
