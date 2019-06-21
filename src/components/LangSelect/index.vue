<template>
  <el-dropdown trigger="click" class='international' @command="handleSetLanguage">
    <div>
      <svg-icon class-name='international-icon' icon-class="语言切换" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="language==='zh'">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language () {
      return this.$store.getters.language // 获取cookie存储的语言设置
    }
  },
  methods: {
    handleSetLanguage (lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('setLanguage', lang) // 保存语言设置
      this.$message({
        message: lang === 'zh' ? '切换中文成功！' : '切换英文成功！',
        type: 'success',
        duration: 1000
      })
    }
  }
}
</script>

<style scoped>
.international-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px !important;
}
</style>
