import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie' // cookie组件
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale, // 本地英文
    ...elementEnLocale // element-ui英文
  },
  zh: {
    ...zhLocale, // 本地中文
    ...elementZhLocale // element-ui中文
  }
}
const i18n = new VueI18n({
  locale: Cookies.get('language') || 'zh', // set locale
  messages // set locale messages
})

export default i18n
