<template>
  <div class="blink">
    <h1>热点大屏</h1>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  },
  components: {},
  computed: {
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped >
@-webkit-keyframes fade {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

.blink {
  animation: fade 3000ms infinite;
  -webkit-animation: fade 3000ms infinite;
}
</style>