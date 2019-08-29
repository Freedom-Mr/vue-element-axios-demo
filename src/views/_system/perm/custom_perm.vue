<template>
  <div class="app-container" v-loading="loading">
    <el-row>
      <!--角色信息-->
      <el-tag type="info">开启自定义权限：</el-tag>
      <el-switch v-model="chageDs" active-text="自定义权限" inactive-text="默认通用权限" style="margin-left: 20px;" @change="changeDs"></el-switch>
      <el-button type="success" plain size="mini" style="margin-left: 20px;" @click="submit">确定修改</el-button>
      <router-link :to="link_address" style="float:right">
        <el-button type="text" icon="el-icon-back">{{manage_list}}</el-button>
      </router-link>
    </el-row>

    <el-row v-if="chageDs">
      <el-col :span="6" v-for="(values, key) in menuPermissionTree" :key="key" style="padding: 0px 2px;">
        <el-card :body-style="{ padding: '5px'}" shadow="always" style="border-color:#cbccce">
          <div slot="header" style="padding:5px 10px;">
            <div class="title-box" style="font-size: 19px;text-align: center;">
              <span>{{values[0].name}}</span>
            </div>
          </div>
          <el-tree show-checkbox :data="values" node-key="val" :default-checked-keys="selectPerms" default-expand-all :ref="`tree${key}`" :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                <span class="mgl-10">{{ data.name }}</span>
                <el-tag v-if="data.type == 1 && data.hidden == 0" class="mgl-10" type="success" size="mini">导航菜单</el-tag>
                <el-tag v-else-if="data.type == 1 && data.hidden == 1" class="mgl-10" type="warning" size="mini">界面菜单</el-tag>
                <el-tag v-else-if="data.type == 2" class="mgl-10" type="info" size="mini">按钮</el-tag>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <div style="text-align: center;padding-top: 10%;" hidden="isVisib">
        <span>
          <h1 class="title2">已选择默认权限</h1>
        </span>
      </div>
    </el-row>
  </div>
</template>

<script>
// import tree from '../tree'
import roleApi from '@/api/system/role'
import Code from '@/common/js/code'

export default {
  name: 'CustomPerm',
  data () {
    return {
      // 当前授权的id
      rid: null,
      type: null, // 类型
      roleId: null,
      chageDs: false,
      loading: false,
      isVisib: false,
      menuPermissionTree: [],
      selectPerms: [],
      selects: [],
      manage_list: '返回管理列表',
      link_address: '/system/institution_manage'
    }
  },
  created () {
    this.initData()
  },

  methods: {
    submit () {
      //
      this.loading = true;
      let all = []
      for (let $r in this.$refs) {
        let temp = this.format(this.$refs[$r][0].getCheckedNodes(), this.$refs[$r][0].getHalfCheckedNodes());
        all = all.concat(temp)
      }
      let list = JSON.stringify(all);

      let params = {
        sysRolePermList: list,
        roleId: this.roleId
      }
      roleApi.updateCustomPerm(params).then(res => {
        this.loading = false;
        if (res && res.data.code === Code.SUCCESS) {
          this.$message.success('修改成功')
        }
      }).catch(e => {
        this.loading = false;
      })
    },
    format (arr, half) {
      if (arr && arr.length) {
        let map1 = arr.map(d => ({
          permVal: d.val,
          roleId: this.roleId,
          type: d.type
        }));
        let map2 = half.map(d => ({
          permVal: d.val,
          roleId: this.roleId,
          type: d.type
        }));
        return [...map1, ...map2];
      }
      return [];
    },
    changeDs (data) {
      let params = {
        id: this.rid,
        type: this.type,
        isOpen: data,
        roleId: this.roleId
      }
      roleApi.openCustomPerm(params).then(res => {
        if (res && res.data.code === Code.SUCCESS) {
          if (data) {
            this.searchCustom();
          }
          this.$message.success('修改成功')
        } else {
          this.chageDs = !data;
        }
      })
    },


    initData () {
      if (!this.$route.params.rid || !this.$route.params.type) {
        if (this.$route.params.type === 1) {
          this.$router.push({ name: 'institution_manage' })
        } else if (this.$route.params.type === 2) {
          this.$router.push({ name: 'department_manage' })
        } else if (this.$route.params.type === 3) {
          this.$router.push({ name: 'user_manage' })
        } else if (!this.$route.params.type) {
          this.$router.push({ name: '/page401' })
        } else {
          this.$router.push({ name: '/page401' })
        }
      }
      this.rid = this.$route.params.rid
      this.type = this.$route.params.type
      this.searchCustom()
      switch (this.type) {
        case 1: this.manage_list = '返回单位管理列表'; this.link_address = '/system/institution_manage'; break
        case 2: this.manage_list = '返回部门管理列表'; this.link_address = '/system/department_manage'; break
        case 3: this.manage_list = '返回用户管理列表'; this.link_address = '/system/user_manage'; break
        default: break
      }
    },
    // 查询是否自定义权限
    searchCustom () {
      //
      const para = { id: this.rid, type: this.type }
      roleApi.searchCustomPerm(para).then(res => {
        if (res.data.code === Code.SUCCESS) {
          this.chageDs = res.data.data.custom
          if (this.chageDs) {
            this.isVisib = true
            this.menuPermissionTree = res.data.data.visibPerms
            let st = res.data.data.selectPerms
            this.roleId = res.data.data.id;
            this.selectPerms = st.map(d => {
              if (d.parent_node) {
                return ''
              } else {
                return d.val;
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  .el-card__header {
    padding: 0px 0px;
  }

  .title2 {
    color: transparent;
    -webkit-text-stroke: 1px black;
    letter-spacing: 0.04em;
  }
}
</style>
