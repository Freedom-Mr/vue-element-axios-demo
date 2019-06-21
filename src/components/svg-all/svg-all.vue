<!---->
<template>
  <div class="svg-all">
    <h1 style="text-align:center">项目svg图标总览
      <el-color-picker v-model="icon_div_select_background" show-alpha size="small" @active-change="selectColor()" :predefine="predefineColors">
      </el-color-picker>
    </h1>
    <div class="icon-div" v-bind:style="{backgroundColor:icon_div_select_background}" v-for="t,i in allIcon" :key="i">
      <svg-icon :icon-class="t.svg"></svg-icon>
      <div class="hint">{{t.name}}</div>
      <div class="name">-----</div>
      <div class="name">{{t.svg}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'svg-all',
  data () {
    return {
      allIcon: [],
      icon_div_select_background: 'rgba(255,255,255,.5)'
    }
  },
  methods: {
  },
  computed: {},
  mounted () {
    const requireAll = requireContext => requireContext.keys().map(requireContext)
    const req = require.context('@/common/image/svg', false, /\.svg$/)
    let all = requireAll(req);
    all.forEach(d => {
      let a = d.default.id;
      let b = a.split('-');
      this.allIcon.push({
        svg: b[1],
        name: a
      })
    })
  },
}
</script>
<style scoped lang="stylus">
.svg-all {
  padding: 20px;

  .hint {
    margin-top: 15px;
    color: #8a8a8a;
  }

  .name {
    font-size: 16px;
    margin-top: 5px;
  }

  .icon-div {
    width: 150px;
    height: 150px;
    border: 1px solid #c1c1c1;
    text-align: center;
    padding: 15px 0;
    display: inline-block;
    margin: 5px;
  }

  .svg-icon {
    font-size: 25px;
    margin-top: 15px;
    color: #ff5600;
  }
}
</style>
