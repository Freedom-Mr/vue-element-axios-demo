<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      transitionName: 'vux-pop-in'
    }
  },
  watch: {//使用watch 监听$router的变化
    $route (to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.meta.index > from.meta.index) {
        //设置动画名称
        this.transitionName = 'vux-pop-in';
      } else {
        this.transitionName = 'vux-pop-out';
      }
    }
  }
}
</script>
<style>
/*-------------重置elementUI样式-------------*/
.el-dialog__body {
  padding: 10px 20px;
}

/*-------------重置滚动条样式-------------*/
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track-piece {
  background-color: rgba(0, 0, 0, 0.2);
  -webkit-border-radius: 6px;
}

::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: rgba(125, 125, 125, 0.7);
  -webkit-border-radius: 6px;
}

::-webkit-scrollbar-thumb:horizontal {
  width: 5px;
  background-color: rgba(125, 125, 125, 0.7);
  -webkit-border-radius: 6px;
}

/*-------------重置弹窗头部样式-------------*/
.el-dialog__header {
  padding: 10px 20px !important;
  background: #a6c2e4 !important;
}
.el-dialog__headerbtn .el-dialog__close {
  top: 12px;
  font-size: 20px;
  color: black;
}

/*-------------重置loading动画-------------*/
.el-loading-spinner .circular {
  width: 42px;
  height: 42px;
  animation: loading-rotate 2s linear infinite;
  display: none;
}
.el-loading-spinner {
  background: url(./common/image/gif/loading/loading7.gif) no-repeat;
  background-size: 100px 10px;
  width: 50%;
  height: 49%;
  position: relative;
  top: 50%;
  left: 45%;
}

/*-------------路由变化页面切换动画效果-------------*/
.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.router-view {
  width: 100%;
  position: absolute;
  -webkit-transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  -moz-transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  -ms-transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  -o-transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  height: 100%;
}
</style>
