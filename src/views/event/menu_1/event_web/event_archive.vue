<template>
  <div style="text-align: center;height: 100%;">
    <iframe :src="url1" width="100%" height="100%"></iframe>
  </div>
</template>
<script>
import png404 from '@/common/image/png/404.png'

export default {
  name: 'eventAll',
  data () {
    return {
      png404: png404,
      url1: 'http://127.0.0.1:9107/mod',
    }
  }
}
</script>