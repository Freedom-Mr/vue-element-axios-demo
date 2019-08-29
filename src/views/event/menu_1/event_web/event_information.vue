<template>
  <div style="text-align: center;height: 100%;">
    <iframe :src="url1" width="100%" height="100%" style="border-width: 0px;"></iframe>
  </div>
</template>
<script>

export default {
  name: 'eventInformation',
  data () {
    return {
      url1: 'https://www.baidu.com/',
    }
  }
}
</script>