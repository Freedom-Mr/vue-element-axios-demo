import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon/SvgIcon'

/** 全局注册 svg */

Vue.component('svg-icon', SvgIcon)
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@/common/image/svg', false, /\.svg$/)
requireAll(req)
