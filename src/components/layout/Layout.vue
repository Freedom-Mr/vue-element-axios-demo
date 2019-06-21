<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <el-button class="circleButton" type="primary" size="mini" icon="el-icon-menu" @click="isShowTag = !isShowTag" circle></el-button>
      <navbar></navbar>
      <tags-view v-show="isShowTag"></tags-view>
      <transition name="el-zoom-in-center">
        <app-main></app-main>
      </transition>
    </div>
  </div>
</template>

<script>
  import {Navbar, Sidebar, AppMain, TagsView} from './components'
  import ResizeMixin from './mixin/ResizeHandler'

  export default {
    name: 'layout',
    data() {
      return {
        isShowTag: true
      }
    }
    ,
    components: {
      Navbar, // 头部（登录用户）
      Sidebar, // 侧边栏
      AppMain,
      TagsView // 标签视图
    },
    mixins: [ResizeMixin],
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      device() {
        return this.$store.state.app.device
      },
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      }
    },
    methods: {
      handleClickOutside() {
        this.$store.dispatch('closeSideBar', {withoutAnimation: false})
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "@/common/css/index.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 99.8%;
  }
  .circleButton{
    position: absolute;
    right: 0;
    top: 7px;
    z-index: 99;
    padding: 4px;
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
