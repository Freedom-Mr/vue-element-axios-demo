# 介绍
svg 矢量图标动态加载组件

# 官网
自定义组件

# 依赖说明
需要svg-sprite-loader组建的支持 以及修改 webpack.base.conf配置中的url-loader配置

# 参数说明
iconClass：图标名称 动态对应 common/image/svg
className：图标类名 动态对应 common/image/svg

# 方法使用说明
iconName()图标名称 动态加载对应的图标名称
svgClass()图标类名 动态加载对应的class

# 例子
<svg-icon icon-class="钻石" ></svg-icon>