<!---->
<template>
  <div class="tab-list">
    <div class="title">{{title}}</div>
    <div class="list">
      <div class="list-item" :class="{'active':activeId === index}"
           @click="clickItem(index,item)"
           v-for="(item,index) in resultList" :key="index">
        <svg-icon icon-class="文件"></svg-icon>
        <div>{{item.name}}
          <el-tooltip el-tooltip effect="light" :content="item.content" placement="right">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: '分析结果汇总'
      },
      resultList: {
        type: Array,
        default: ()=>([
          {
            name: '账号好友量分布',
            value: 10,
            content: '账号好友量分布：是指根据账号的好友量排序！默认倒序！'
          },
          {
            name: '账号交互好友分布',
            value: 11,
            content: '账号交互好友分布：是指根据账号拥有共同成员数量统计对群进行排序！默认倒序！'
          },
          {
            name: '好友影响力分布',
            value: 12,
            content: '好友影响力分布：是指根据共同好友量进行排序！默认倒序！'
          },
          {
            name: '账号加入群分布',
            value: 13,
            content: '账号加入群分布'
          },
          {
            name: '账号交互群分布',
            value: 14,
            content: '账号交互群分布'
          },
          {
            name: '账号成员量分布',
            value: 15,
            content: '账号成员量分布'
          },
        ])
      },
    },
    data() {
      return {
        activeId: 0
      }
    },
    methods: {
      clickItem(index,data){
        this.activeId = index;
        this.$emit('clickItem',{data: data})

      }
    },
    computed: {},
    mounted() {

    },
  }
</script>
<style scoped lang="stylus">
  .tab-list
    width 100%
    height 100%
    overflow-y: auto
    padding 0
    border 1px solid #dcdcdc
  .title
    font-size 16px
    padding 15px 0 15px 20px
    border-bottom 1px solid #dcdcdc
  .list-item
    display flex
    font-size 15px
    padding 15px 10px 15px 20px
    border-bottom 1px solid #dcdcdc
    color #575757
    cursor pointer
    .svg-icon
      width 20px
      flex-shrink 0
      margin-right 5px
    div
      flex 1
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
  .active,.list-item:hover
    background: #1e6faf;
    box-shadow:0 0 10px rgba(102,102,102,0.3);
    color #fff


</style>
