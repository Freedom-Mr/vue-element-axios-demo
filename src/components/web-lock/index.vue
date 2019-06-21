<template>
  <span>
    <el-tooltip effect="light" content="锁屏" placement="bottom">
      <!-- <i class="icon-bofangqi-suoping" @click="handleLock"></i> -->
      <span @click="handleLock">
        <svg-icon icon-class="锁" style="width:18px; height=18px" />
      </span>
    </el-tooltip>
    <el-dialog title="设置锁屏密码" :visible.sync="box" width="20%" :before-close="closeForm" append-to-body v-dialogDrag>
      <el-form :model="form" ref="form">
        <el-form-item label="锁屏密码" prop="passwd" label-width="80px" :rules="[{ required: true, message: '锁屏密码不能为空'}]">
          <el-input v-model="form.passwd" placeholder="请输入锁屏密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSetLock">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import { validateNull } from '@/common/js/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'web-lock',
  data () {
    return {
      box: false,
      form: {
        passwd: ''
      }
    }
  },
  created () { },
  mounted () { },
  computed: {
    ...mapGetters(['lockPasswd'])
  },
  props: [],
  methods: {
    // 关闭弹窗
    closeForm () {
      this.$refs['form'].resetFields()
      this.box = false
    },
    handleSetLock () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_LOCK_PASSWD', this.form.passwd)
          this.handleLock()
        }
      })
    },
    handleLock () {
      if (validateNull(this.lockPasswd)) {
        this.box = true
        return
      }
      this.$store.commit('SET_LOCK')
      setTimeout(() => {
        this.$router.push({ path: '/lock' })
      }, 100)
    }
  },
  components: {}
}
</script>
