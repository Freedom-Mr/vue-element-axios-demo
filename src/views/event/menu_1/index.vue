<template>

  <div class="app-muns">

    <el-container class="containerMun">
      <!-- <el-header>
        <div class="event_top">
          <div class="event_mun_bt" @click="showHiddenMun">
            <el-link icon="el-icon-position" :underline="false" type="danger">分析</el-link>
          </div>
        </div>
      </el-header> -->
      <el-container>
        <el-aside class="asideMun" width="75px" v-show="seen">
          <div class="event_mun">
            <div class="mun_div" v-for="(item,index) in mun_infos">
              <el-main class="muns" v-perm="item.perm">
                <div @click="checkMun(index)">
                  <el-image class="mun_image" :src="item.url"></el-image>
                  <h4 v-bind:class="{ bgColors:index==current}">
                    {{item.title}}
                  </h4>
                </div>
              </el-main>
            </div>
          </div>

        </el-aside>
        <el-main style="padding: 0px;">
          <component v-for="(item,index) in mun_infos" :is="item.web" :key="current" v-perm="item.perm" v-show="index==current" />
        </el-main>
      </el-container>
    </el-container>

  </div>

</template>

<script>
import png1 from '@/common/image/png/mun/1.png'
import png2 from '@/common/image/png/mun/2.png'
import png3 from '@/common/image/png/mun/3.png'
import png4 from '@/common/image/png/mun/4.png'
import png5 from '@/common/image/png/mun/5.png'
import png6 from '@/common/image/png/mun/6.png'
import png7 from '@/common/image/png/mun/7.png'
import png8 from '@/common/image/png/mun/10.png'
import png9 from '@/common/image/png/mun/9.png'

export default {
  data () {
    return {
      current: 0,
      seen: true,
      mun_infos: [
        { url: png1, title: '专题概况', web: 'EventInformation', perm: "b:event:information" },
        { url: png2, title: '信息汇总', web: 'EventSearch', perm: "b:event:search" },
        { url: png3, title: '统计分析', web: 'EventStatistics', perm: "b:event:statistics" },
        { url: png4, title: '新群推荐', web: 'EventNew', perm: "b:event:new" },
        { url: png5, title: '群体推荐', web: 'EventGroup', perm: "b:event:group" },
        { url: png6, title: '账号推荐', web: 'EventAccount', perm: "b:event:account" },
        { url: png7, title: '线索预警', web: 'EventAction', perm: "b:event:action" },
        { url: png8, title: '扩线分析', web: 'EventDiscovery', perm: "b:event:discovery" },
        { url: png9, title: '档案资料', web: 'EventArchive', perm: "b:event:archive" }
      ],

    }
  },
  methods: {
    checkMun (index) {
      this.current = index;
    },
    showHiddenMun () {
      this.seen = this.seen == false ? true : false;
    }
  },
  components: {
    EventInformation: () => import("@/views/event/menu_1/event_web/event_information"),
    EventSearch: () => import("@/views/event/menu_1/event_web/event_search"),
    EventStatistics: () => import("@/views/event/menu_1/event_web/event_statistics"),
    EventNew: () => import("@/views/event/menu_1/event_web/event_new"),
    EventGroup: () => import("@/views/event/menu_1/event_web/event_group"),
    EventAccount: () => import("@/views/event/menu_1/event_web/event_account"),
    EventAction: () => import("@/views/event/menu_1/event_web/event_action"),
    EventDiscovery: () => import("@/views/event/menu_1/event_web/event_discovery"),
    EventArchive: () => import("@/views/event/menu_1/event_web/event_archive"),
  },
  computed: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped >
.app-muns {
  .event_mun_bt {
    // float: right;
  }
  .containerMun {
    height: 100%;
    .asideMun {
      box-sizing: border-box;
      height: 100%;
    }
  }
  .event_mun {
    padding-top: 3px;
    height: 100%;
    width: 75px;
    overflow-y: auto;

    border-radius: 3px;
    border: #afafaf 1px solid;
    border-width: 0px 1px 0px 0px;
    .mun_div {
      padding-right: 5px;
      .muns {
        text-align: center;
        padding: 0 0 15px 0;
        cursor: pointer;
        .mun_image {
          width: 45px;
          height: 45px;
        }
        h4 {
          margin: 0 0 0 0;
          padding-top: 5px;
        }
        .bgColors {
          background: #ff5700;
        }
      }
    }
  }
}
</style>