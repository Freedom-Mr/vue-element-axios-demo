<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style>
/*重置滚动条样式*/
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track-piece {
  background-color: rgba(0, 0, 0, 0.2);
  -webkit-border-radius: 6px;
}

::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: rgba(125, 125, 125, 0.7);
  -webkit-border-radius: 6px;
}

::-webkit-scrollbar-thumb:horizontal {
  width: 5px;
  background-color: rgba(125, 125, 125, 0.7);
  -webkit-border-radius: 6px;
}
/*重置elementUI样式*/

.el-dialog__body {
  padding: 10px 20px;
}

/*.el-checkbox__inner{*/
/*border: 1px solid #bdbdbd;*/
/*}*/
/**/
/*.el-dialog__header {*/
/*padding: 15px 20px!important;*/
/*background: #4794F3!important;*/
/*border-radius: 10px 10px 0 0!important;*/
/*}*/
/*.el-dialog__body{*/
/*background: #fff;*/
/*border-radius: 0 0 10px 10px;*/
/*}*/
/*.el-dialog__header span {*/
/*line-height: 24px!important;*/
/*font-size: 18px!important;*/
/*padding-left: 5px!important;*/
/*color: #fff!important;*/
/*}*/

/*.el-dialog__headerbtn .el-dialog__close{*/
/*color: #fff!important*/
/*}*/

/*.el-dialog__body {*/
/*padding: 0!important;*/
/*}*/

/*.el-input__inner{*/
/*color: #000!important;*/
/*}*/

/*.el-textarea__inner{*/
/*font-family: inherit!important;*/
/*} */
</style>
