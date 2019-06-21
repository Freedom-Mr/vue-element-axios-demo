<template>
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
    <el-row type="flex">
      <el-col :span="0.5">
        <el-button icon="el-icon-d-arrow-left" type="text" size="small" @click="leftMove">
        </el-button>
      </el-col>
      <div class="scroll-wrapper" ref="scrollWrapper" id="scrollWrapper">
        <!-- :style="{left: left + 'px'}" -->
        <slot></slot>
      </div>
      <el-col :span="0.5">
        <el-button icon="el-icon-d-arrow-right" type="text" size="small" @click="rightMove"></el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const padding = 15 // tag's padding

export default {
  name: 'scrollPane',
  data () {
    return {
      left: 0

    }
  },
  mounted () {
    //this.leftOrRight()
  },
  methods: {
    leftMove () {
      document.getElementById('scrollWrapper').scrollLeft = -100
    },
    rightMove () {
      document.getElementById('scrollWrapper').scrollLeft = 200
    },
    handleScroll (e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperWidth = $wrapper.offsetWidth

      if (eventDelta > 0) {
        this.left = Math.min(0, this.left + eventDelta)
      } else {
        if ($containerWidth - padding < $wrapperWidth) {
          if (this.left < -($wrapperWidth - $containerWidth + padding)) {
            this.left = this.left
          } else {
            this.left = Math.max(this.left + eventDelta, $containerWidth - $wrapperWidth - padding)
          }
        } else {
          this.left = 0
        }
      }
    },
    moveToTarget ($target) {
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $targetLeft = $target.offsetLeft
      const $targetWidth = $target.offsetWidth

      if ($targetLeft < -this.left) {
        // tag in the left
        this.left = -$targetLeft + padding
      } else if ($targetLeft + padding > -this.left && $targetLeft + $targetWidth < -this.left + $containerWidth - padding) {
        // tag in the current view
        // eslint-disable-line
      } else {
        // tag in the right
        this.left = -($targetLeft - ($containerWidth - $targetWidth) + padding)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
}
.scroll-wrapper {
  width: 97%;
  overflow: hidden;
}
.el-icon-d-arrow-left {
  display: inline-block;
  float: left;
  margin-top: 9px;
}
.el-icon-d-arrow-right {
  display: inline-block;
  float: right;
  margin-top: -22px;
}
</style>
