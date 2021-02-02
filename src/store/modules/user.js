import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: {},
    status: '',
    code: '',
    token: getToken(),
    id: 0,
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    menus: [], // 菜单权限
    // 按钮级权限管控 - ①新增 button 全局变量
    buttons: [], // 按钮权限
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    // 按钮级权限管控 - ②新增 mutations 操作 button
    SET_BUTTONS: (state, buttons) => {
      state.buttons = buttons
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password, userInfo.openId, userInfo.accessToken).then(response => {
          const data = response.data;
          commit('SET_TOKEN', data.token);// 将token保存到cookie里 -> 作为前端用户已登录的标识
          setToken(response.data.token);
          resolve()
        }).catch(error => {
          // 登录失败，回传提示信息
          reject(error)
        })
      })
    },

    // 获取用户信息，相关权限数据
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 请求获取权限 -> 通过token查询
        getUserInfo(state.token).then(response => {
          // 由于mockjs 不支持自定义状态码只能这样hack
          if (!response.data) {
            reject('Verification failed, please login again.')
          }
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            // 当用户无任何权限时
            // commit('SET_ROLES', ['普通用户']);
            reject('getInfo: roles must be a non-null array!')
          }

          if (data.menus && data.menus.length > 0) { // 验证返回的menus是否是一个非空数组
            commit('SET_MENUS', data.menus)
          }

          // 按钮级权限管控 - ④将取到的 button 权限放到全局变量中
          if (data.buttons && data.buttons.length > 0) { // 验证返回的buttons是否是一个非空数组
            // 通过commit保存到全局变量
            commit('SET_BUTTONS', data.buttons)
          }
          commit('SET_USER', data)
          commit('SET_ID', data.id)
          commit('SET_NAME', data.userName)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.nickName)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          // 注销QQ
          // QC.Login.signOut();
          removeToken();
          resolve();
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        // 注销QQ
        // QC.Login.signOut();
        removeToken();
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_MENUS', data.menus)
          commit('SET_BUTTONS', data.buttons)

          commit('SET_ID', data.id)
          commit('SET_NAME', data.userName)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data.menus) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
