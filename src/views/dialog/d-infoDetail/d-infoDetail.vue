<!---->
<template>
  <div class="d-infoDetail">
    <div class="info-top">
      <div class="top-title" v-if="infoDetail.rid">
        <div>{{msgType ? '微信' : 'QQ'}}</div>
        <div>{{infoDetail.uid ? infoDetail.uid : '--'}}</div>
        <div>跟（</div>
        <div>{{infoDetail.rid ? infoDetail.rid : '--'}}</div>
        <div>）私聊说：</div>
      </div>
      <div class="top-title" v-else>
        <div>{{msgType ? '微信' : 'QQ'}}</div>
        <div>{{infoDetail.uid ? infoDetail.uid : '--'}}</div>
        <div>在群（</div>
        <div>{{infoDetail.gid ? infoDetail.gid : '--'}}</div>
        <div>）里说：</div>
      </div>
      <div class="top-content" v-html="infoDetail.content.toString()"></div>
      <div class="top-location">
        <div>ip:{{infoDetail.ip ? infoDetail.ip : '--'}}</div>
        <div>{{infoDetail.pubtime ? infoDetail.pubtime : '--'}}</div>
      </div>
    </div>
    <div class="info-bottom">
      <div class="bottom-item" v-if="getItem(infoDetail.person)">
        <div class="item-label">人物：</div>
        <div class="item-list">
          <div class="list-son person" v-for="item in getItem(infoDetail.person)">{{item}}</div>
        </div>
      </div>
      <div class="bottom-item" v-if="getItem(infoDetail.org)">
        <div class="item-label">组织：</div>
        <div class="item-list">
          <div class="list-son org" v-for="(item,index) in getItem(infoDetail.org)" :key="index">{{item}}</div>
        </div>
      </div>
      <div class="bottom-item" v-if="getItem(infoDetail.location)">
        <div class="item-label">地点：</div>
        <div class="item-list">
          <div class="list-son location" v-for="item in getItem(infoDetail.location)">{{item}}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: {
      msgType: {
        type: Number,
        default: 0
      },
      infoDetail: {
        type: Object,
        default: () => ({
          city: '',
          content: '',
          country: '',
          district: '',
          gid: '',
          ip: '',
          location: '',
          md5: '',
          org: '',
          person: '',
          prefecture: '',
          province: '',
          pubtime: '',
          time: '',
          uid: '',
        })
      },
    },
    computed: {},
    components: {},
    created(){
      console.log('接收', this.infoDetail);
    },
    methods: {
      getItem(data){
        if (data) {
          let parse = JSON.parse(data.toString());
          if (parse) {
            console.log(parse)
            return parse;
          }
        }
        return '';
      },
    },
    mounted() {

    }
  }
</script>

<style lang="stylus" scoped>
  .d-infoDetail
    height 450px
    display flex
    flex-direction column

    .info-top
      flex 1
      display: flex;
      flex-direction: column;

      .top-title
        display flex
        padding 0 10px
        font-size 16px
        color #0a76a4

        > div
          margin-right 10px

        > div:nth-child(even)

          color #0e8cc1
          font-weight bold

      .top-content
        flex 1
        letter-spacing: .3px;
        overflow-y auto
        font-size 14px
        text-indent 28px
        line-height 22px
        padding 0 10px
        margin-top 15px

      .top-location
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
        font-size: 15px;
        color: #048220;

    .info-bottom
      border-top 1px dashed #2b6cb0
      padding 10px 20px
      min-height 100px

      .bottom-item
        display flex
        padding 5px 0
        height 34px
        align-items center

        .item-label
          width 60px

        .item-list
          flex 1

          .list-son
            padding: 2px 7px;
            border: 1px solid;
            margin-right: 10px;
            display: inline-block;
            position: relative;
            border-radius: 4px;
            color: #fff;

            &:after
              content: '';
              position: absolute;
              width: 0;
              height: 0;
              border: 7px solid transparent;
              left: -14px;
              bottom: 4px;

            &.person
              background: #ed7a1a;
              &:after
                border-right-color: #ED7A1E;
            &.location
              background: #2c9e5d;
              &:after
                border-right-color: #2c9e5d;
            &.org
              background: #ed4f79;
              &:after
                border-right-color: #ed4f79;



</style>
