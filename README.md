# vue-element-axios

> A Vue.js project

vue工程

集成vue、element、axios等框架，搭建了登陆、权限、大屏等功能
需后台项目支撑接口数据，后台spring-boot项目地址：https://github.com/Freedom-Mr/spring-boot-shiro-2.0

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
# 1、打包前需修改 config/index.js 文件，参数：（ assetsPublicPath: '/' 改为 assetsPublicPath: './' ）
# 2、打包前需修改 build/utils.js 文件，参数： （ ExtractTextPlugin.extract({ }) 里面增加 publicPath: '../../', ）
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

启动成功后浏览器访问：http://ip:8088

## 登陆账号

超级管理员 adminsuper  as%2018
部门管理员 web  web%2018

## icon 视图

http://ip:8088/icon#/svg

#------------------------------------------------------

## 2019.08.29 更新内容

1、改善表格栏间隔色差
2、头部增加显示当前动态时间及其日期
3、增加三级菜单及其权限控制