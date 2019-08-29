<template>
  <div>{{eventId}}账号推荐{{date}}</div>
</template>
<script>
export default {
  data () {
    return {
      evetId: '',
      date: ''
    }
  },
  props: {
    eventId: {
      type: Number,
      default: 0
    },

  },
  computed: {},
  components: {},
  created () {
    this.date = new Date();
  },
  methods: {
  },
  mounted () {

  }
}
</script>

<style lang="stylus" scoped>
</style>
