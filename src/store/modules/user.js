import loginApi from '@/api/system/login/login'
import { getToken, setToken, removeToken } from '@/common/js/token'
import avatorImg from '@/common/image/jpg/avator.jpg'
import Code from '@/common/js/code.js'
import { setStore, getStore, removeStore } from '@/common/js/store'

const user = {
  state: {
    token: getToken(),
    user_id: '',
    account: '',
    realName: '',
    profile_photo: '',
    email: '',
    telephone: '',
    status: '',
    inst_id: '',
    dep_id: '',
    visitor: false,
    part: '',
    roles: [],
    perms: [],
    note: '',
    setting: {
      articlePlatform: []
    },
    isLock: getStore({
      name: 'isLock'
    }) || false,
    lockPasswd: getStore({
      name: 'lockPasswd'
    })
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_ID: (state, userId) => {
      state.user_id = userId
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_REALNAME: (state, realName) => {
      state.realName = realName
    },
    SET_PROFILE_PHOTO: (state, profilePhoto) => {
      state.profile_photo = profilePhoto
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_TELEPHONE: (state, telephone) => {
      state.telephone = telephone
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_INST_ID: (state, instId) => {
      state.inst_id = instId
    },
    SET_DEP_ID: (state, depId) => {
      state.dep_id = depId
    },
    SET_VISITOR: (state, visitor) => {
      state.visitor = visitor
    },
    SET_PART: (state, part) => {
      state.part = part
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMS: (state, perms) => {
      state.perms = perms
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
    SET_LOCK: (state, action) => {
      state.isLock = true
      setStore({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      })
    },
    SET_NOTE: (state, note) => {
      state.note = note
    },
    CLEAR_LOCK: (state, action) => {
      state.isLock = false
      state.lockPasswd = ''
      removeStore({
        name: 'lockPasswd'
      })
      removeStore({
        name: 'isLock'
      })
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginApi.loginByUsername(username, userInfo.password).then(response => {
          const res = response.data
          const data = res.data
          if (res.code === Code.SUCCESS) {
            commit('SET_TOKEN', data.toekn)
            if (!data.perms || data.perms.length === 0 ||
              !data.roles || data.roles.length === 0) {
              commit('SET_VISITOR', true)
            } else {
              commit('SET_VISITOR', false)
            }
            commit('SET_USER_ID', data.user_id)
            commit('SET_ACCOUNT', data.account)
            commit('SET_STATUS', data.status)
            setToken(data.token)
          }

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        loginApi.getUserInfo(state.token).then(response => {
          const res = response.data
          const data = res.data
          if (!res) reject(new Error('res is null'))
          if (!data) reject(new Error('res.data is null'))
          if (res.code === Code.SUCCESS) {
            commit('SET_TOKEN', data.toekn)
            if (!data.perms || data.perms.length === 0 ||
              !data.roles || data.roles.length === 0) {
              commit('SET_VISITOR', true)
            } else {
              commit('SET_VISITOR', false)
            }
            commit('SET_USER_ID', data.user_id)
            commit('SET_ACCOUNT', data.account)
            commit('SET_REALNAME', data.real_name)
            if (data.profile_photo === null || data.profile_photo === '') {
              commit('SET_PROFILE_PHOTO', avatorImg)
            } else {
              commit('SET_PROFILE_PHOTO', 'data:image/' + data.profile_photo.format + ';base64,' + data.profile_photo.photo)
            }
            // commit('SET_PROFILE_PHOTO', data.profile_photo === null || data.profile_photo === '' ? avatorImg : data.profile_photo.photo)
            commit('SET_EMAIL', data.email)
            commit('SET_TELEPHONE', data.telephone)
            commit('SET_STATUS', data.status)
            commit('SET_INST_ID', data.inst_id)
            commit('SET_DEP_ID', data.dep_id)
            commit('SET_PART', data.part)
            commit('SET_ROLES', data.roles)
            commit('SET_PERMS', data.perms)
            commit('SET_NOTE', data.note)
          }

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 动态修改权限
    ChangeRoles ({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        loginApi.getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_PERMS', data.perms)
          resolve()
        })
      })
    },

    // 前后端 登出
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        loginApi.logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMS', [])
          commit('CLEAR_LOCK')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMS', [])
        commit('CLEAR_LOCK')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
