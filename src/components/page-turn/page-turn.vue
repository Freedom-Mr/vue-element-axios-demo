<template>
  
  <!--翻页-->
  <div v-show="!loadingView" class="page_wrapper">
    <ul v-show="totalPage>0" v-if="type=='center'">
      <li :class="{grayColor: page == 1}" class="pointer iconfont icon-zuo center side-page" @click="reducePage"></li>
      <li :class="{orangeb: page == i, noborder: i == '...'}"
          class="pointer page center"
          v-for="(i, index) in pages" @click="changePage($event, i)">{{i}}
      </li>
      <li :class="{grayColor: page == totalPage}" class="pointer iconfont icon-you center" @click="addPage"></li>
    </ul>
    <ul v-show="totalPage>0" v-else>
      <li class="pages">第 <span>{{page}}</span>&nbsp;/&nbsp;{{totalPage}}页</li>
      <li :class="{grayColor: page == 1}" class="pointer iconfont icon-zuo side-page" @click="reducePage"> < </li>
      <li :class="{orangeb: page == i, noborder: i == '...'}"
          class="pointer page"
          v-for="(i, index) in pages" @click="changePage($event, i)">{{i}}
      </li>
      <li :class="{grayColor: page == totalPage}" class="pointer iconfont icon-you side-page" @click="addPage"> > </li>
      <li class="pages">跳转到第 <input type="text" v-model="jumpPage" class="jump_page">页</li>
      <li class="button pointer" @click="goToJumpPage">确定</li>
    </ul>
  </div>

</template>

<script scoped>

  export default {
    props: ['totalPage', 'initPage','pageStyle','type'], //type 为center时为联动大屏样式
    data() {
      return {
        pages: [],
        page: 1,
        loadingView: false,
        jumpPage: ''
      }
    },
    created() {
      // 初始化页面时
      this._setPagesArr(this.totalPage);
      this._on();
    },
    methods: {
      _on() {
        /*this.bus.$on('changePages', (data) => {
          this.page = data
        })*/
      },
      goToJumpPage(){
        let reg = new RegExp("^[1-9][0-9]*$")
        if (!reg.test(+this.jumpPage) || +this.jumpPage > this.totalPage) {
          this.jumpPage = this.totalPage;
          this.page = this.totalPage;
        }else {
          this.page = parseInt(this.jumpPage);
        }
        this.$emit('changePage', this.page)
      },
      _setPagesArr(val) {
        this.pages = []
        // 总页数小于16时
        if (val < 14) {
          for (let i = 0; i < val; i++) {
            this.pages.push(i + 1)
          }
        } else {
          // 总页数大于16且当前页小于10时
          if (this.page < 10) {
            for (let i = 0; i < 13; i++) {
              this.pages.push(i + 1)
            }
            this.pages = this.pages.concat(['...', val])
//            this.pages = this.pages.concat(['...'])
          } else {
            // 总页数大于16且当前页大于10时
            let startArr = [1, 2, 3, 4, 5, '...']
            this.pages = this.pages.concat(startArr)
            let endPage = (this.page + 4) > val ? val : (this.page + 4)
            let startPage = (this.page - 3) > (val - 9) ? (val - 9) : (this.page - 3)
            for (let i = startPage; i < endPage; i++) {
              this.pages.push(i + 1)
            }
            if (this.page == val - 5) {
              this.pages = this.pages.concat([val])
//              this.pages = this.pages.concat()
            }
            if (this.page < val - 5) {
              this.pages = this.pages.concat(['...', val])
//              this.pages = this.pages.concat(['...'])
            }
          }
        }
      },
      changePage(event, i) {
        if (this.page == i) {return}
        this.page = i
        this._setPagesArr(this.totalPage)
        this.$emit('changePage', this.page)
      },
      reducePage() {
        this.page--
        this._setPagesArr(this.totalPage)
        this.$emit('changePage', this.page)
      },
      addPage() {
        this.page++
        this._setPagesArr(this.totalPage)
        this.$emit('changePage', this.page)
      }
    },
    computed: {
      /*...mapState([
        'loadingView'
      ])*/
    },
    watch: {
      totalPage(n, o) {
        this._setPagesArr(this.totalPage);
      },
      // 当前页数重置为1
      initPage() {
        this.page = 1
        this._setPagesArr(this.totalPage)
        this.$emit('changePage', this.page)
      }
    }
  }
</script>

<style lang="css" rel="stylesheet/css" scoped>
  /*上一页 下一页*/
  .page_wrapper {
    margin: 40px 0;
    text-align: center;
  }

  *::selection {
    background: transparent;
  }

  .page_wrapper ul li {
    display: inline-block;
    width: 40px;
    line-height: 40px;
    height: 40px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 3px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-right: 4px;
    color: #666;
    font-size: 14px;
    -webkit-transition: all .5s;
    transition: all .5s;
    background: #fff;
  }

  .page_wrapper ul li.pages {
    border: none;
    width: auto;
    padding: 0 5px;
    font-size: 14px;
    background: transparent;
    display: inline-flex;
    align-items: center;
  }

  .page_wrapper ul li.pages span {
    color: #4677c7;
    font-weight: bold;
  }

  .page_wrapper ul li.pages input {
    color: #4677c7;
    font-weight: bold;
    width: 40px;
    line-height: 40px;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 3px;
    margin: 0 3px;
    padding: 5px;
    text-align: center;
  }

  .page_wrapper ul li.button {
    width: 60px;
    height: 40px;
    line-height: 40px;
    background: #EFF9FF;
    text-align: center;
    border: 1px solid #8EBCFF;
    color: #008FEB;
    font-size: 14px;
  }

  .page_wrapper ul li.orangeb {
    background-color: #008FEB;
    border: 1px solid #008FEB;
    color: #fff;
  }

  .page_wrapper ul li.page:hover {
    background-color: #008FEB;
    border: 1px solid #008FEB;
    color: #fff;
    transform: scale(1.1);
  }

  .page_wrapper ul li.grayColor {
    background: #e5e5e5;
    pointer-events: none;
  }

  .page_wrapper ul li.noborder {
    border: none;
    color: #666;
    font-size: 18px;
    pointer-events: none;
    background: transparent;
  }

</style>
