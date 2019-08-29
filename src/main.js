// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'normalize.css' // normalize样式格式化
// import '@/common/custom-theme/index.css'// 主题
import '@/common/css/index.scss'// 布局样式
import echarts from 'echarts'// echarts图表
// import validate from '@/common/js/validate' // 校验组件
import router from '@/router' // 路由管理
import '@/router/router_before' // 路由守卫
import ElementUI from 'element-ui' /** 引入element-ui模板 */
import 'element-ui/lib/theme-chalk/index.css'
// import VueI18n from 'vue-i18n' // 国际化
import i18n from '@/components/lang' // 国际化
import axios from '@/common/js/requests' // 引入axios
import Code from '@/common/js/code' // 引入全局API状态码
import '@/components/SvgIcon/index.js' // svg组件
import store from '@/store/store.js' // 引入store状态管理
// 权限指令
import hasPerm from '@/components/directive/permission/hasPerm'
import perm from '@/components/directive/permission/perm'
import '@/components/directives/directives.js'  //弹窗指令
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$Code = Code
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios

// 注册全局的权限判断方法和指令
Vue.prototype.$hasPerm = hasPerm
Vue.directive('perm', perm)

//引入全局圆形菜单
import CircleMenu from 'vue-circle-menu'
Vue.component('CircleMenu', CircleMenu)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    i18n,
    components: { App },
    template: '<App/>'
})

/**
 * 转换成图片表情
 */
function toEmotion (text, isNoGif) {
    var list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '愉快', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极', '嘿哈', '捂脸', '奸笑', '机智', '皱眉', '耶', '红包', '鸡'];

    if (!text) {
        return text;
    }

    text = text.replace(/\[[\u4E00-\u9FA5]{1,3}\]/gi, function (word) {
        var newWord = word.replace(/\[|\]/gi, '');
        var index = list.indexOf(newWord);
        var backgroundPositionX = -index * 24
        var imgHTML = '';
        if (index < 0) {
            return word;
        }

        if (isNoGif) {
            if (index > 104) {
                return word;
            }
            imgHTML = `<i class="static-emotion" style="background:url(https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/default218877.gif) ${backgroundPositionX}px 0;"></i>`
        } else {
            var path = index > 104 ? '/img' : 'https://res.wx.qq.com/mpres/htmledition/images/icon';
            imgHTML = `<img class="static-emotion-gif" style="vertical-align: middle" src="${path}/emotion/${index}.gif">`
        }
        return imgHTML;
    });
    return text;
}

Vue.directive('emotion', {
    bind: function (el, binding) {
        el.innerHTML = toEmotion(binding.value)
    }
});