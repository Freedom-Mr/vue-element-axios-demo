<template>
  <div>
    <div style="text-align: center;">
      <h1>
        <router-link tag="跳转大屏" to="dataAssets">点击跳转大屏</router-link>
      </h1>
    </div>
    <div class="circle1"></div>
    <div class="circle2"></div>
    <div class="circletext">
      欢迎<br>关注
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {

    }
  },
  methods: {

  },
  components: {},
  computed: {
    ...mapGetters([
      'account',
      'realName',
      'profile_photo',
      'roles',
      'perms'
    ])
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped >
.circle2 {
  background-color: rgba(0, 0, 0, 0);
  border: 6px solid rgba(31, 62, 230, 0.9);
  opacity: 0.9;
  border-left: 6px solid rgba(0, 0, 0, 0);
  border-right: 6px solid rgba(0, 0, 0, 0);
  border-radius: 50px;
  box-shadow: 0 0 15px #202020;
  width: 60px;
  height: 60px;
  margin: 0 auto;
  position: fixed;
  left: 15px;
  bottom: 59px;
  -moz-animation: spinoffPulse 20s infinite linear;
  -webkit-animation: spinoffPulse 20s infinite linear;
  -o-animation: spinoffPulse 20s infinite linear;
  -ms-animation: spinoffPulse 20s infinite linear;
}
.circle1 {
  background-color: rgba(0, 0, 0, 0);
  border: 5px solid rgba(247, 14, 42, 1);
  opacity: 0.9;
  border-right: 5px solid rgba(0, 0, 0, 0);
  border-left: 5px solid rgba(0, 0, 0, 0);
  border-radius: 50px;
  box-shadow: 0 0 35px #808080;
  width: 80px;
  height: 80px;
  margin: 0 auto;
  position: fixed;
  left: 7px;
  bottom: 50px;
  -moz-animation: spinPulse 20s infinite linear;
  -webkit-animation: spinPulse 20s infinite linear;
  -o-animation: spinPulse 20s infinite linear;
  -ms-animation: spinPulse 20s infinite linear;
}
.circletext {
  font-weight: bold;
  color: #808080;
  text-align: center;
  font-size: 12px;
  width: 60px;
  height: 30px;
  line-height: 15px;
  margin: 0 auto;
  position: fixed;
  left: 20px;
  bottom: 77px;
}

@keyframes spinPulse {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spinoffPulse {
  0% {
    -webkit-transform: rotate(160deg);
    opacity: 0;
    box-shadow: 0 0 1px #505050;
  }

  30% {
    -webkit-transform: rotate(120deg);
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate(-320deg);
    opacity: 0;
  }
}
</style>