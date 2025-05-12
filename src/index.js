/**
 * hh-router-guard - 基于Vue 3的Uniapp路由守卫插件
 * 提供页面访问权限控制、登录拦截和白名单功能
 */
import { inWhiteList } from './utils'

export default {
  // 插件版本号
  version: '1.0.0',

  install(app, options = {}) {
    // 合并默认配置
    const config = {
      whiteList: ['/pages/login/index'],
      loginPath: '/pages/login/index',
      checkLogin: () => uni.getStorageSync('token'),
      loginHandler: (to) => {
        uni.navigateTo({
          url: `${config.loginPath}?redirect=${encodeURIComponent(to)}`
        })
      },
      // 错误处理函数
      errorHandler: (error) => {
        console.error('[hh-router-guard] 错误:', error)
      },
      ...options
    }

    // 配置验证
    if (!Array.isArray(config.whiteList)) {
      config.errorHandler(new Error('whiteList 必须是数组'))
      config.whiteList = []
    }

    if (typeof config.checkLogin !== 'function') {
      config.errorHandler(new Error('checkLogin 必须是函数'))
      config.checkLogin = () => false
    }

    if (typeof config.loginHandler !== 'function') {
      config.errorHandler(new Error('loginHandler 必须是函数'))
      config.loginHandler = (to) => {
        uni.navigateTo({ url: config.loginPath })
      }
    }

    // 注册全局属性
    app.config.globalProperties.$routerGuard = {
      config,
      check: (path) => handleRouteIntercept(path, config)
    }

    // 注册路由拦截器
    const interceptors = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab']
    interceptors.forEach(method => {
      uni.addInterceptor(method, {
        invoke(args) {
          try {
            return handleRouteIntercept(args.url, config)
          } catch (error) {
            config.errorHandler(error)
            return true // 发生错误时默认放行
          }
        }
      })
    })

    console.log(`[hh-router-guard v${this.version}] 路由守卫已启用`)
  }
}

// 处理路由拦截逻辑
function handleRouteIntercept(url, config) {
  try {
    const path = url.split('?')[0]
    
    // 使用工具函数检查白名单
    if (inWhiteList(path, config.whiteList)) {
      return true
    }
    
    // 检查登录状态
    const isLoggedIn = config.checkLogin()
    
    if (!isLoggedIn) {
      // 未登录，执行登录处理逻辑
      config.loginHandler(url)
      return false
    }
    
    return true
  } catch (error) {
    config.errorHandler(error)
    return true // 发生错误时默认放行
  }
}  