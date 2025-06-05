/**
 * hh-router-guard - 基于Vue 3的Uniapp路由守卫插件
 * 提供页面访问权限控制、登录拦截和白名单功能
 */
import type { App } from 'vue';
import { inWhiteList } from './utils';
import { 
  RouterGuardOptions,
  RouterGuardInstance,
	Plugin,
} from './types';

// 定义默认配置
const defaultOptions: Required<RouterGuardOptions> = {
  whiteList: ['/pages/login/index'],
  loginPath: '/pages/login/index',
  checkLogin: () => !!uni.getStorageSync('token'),
  loginHandler: (to) => {
    uni.navigateTo({
      url: `${defaultOptions.loginPath}?redirect=${encodeURIComponent(to)}`
    });
  },
  errorHandler: (error) => {
    console.error('[hh-router-guard] 错误:', error);
  }
};

// 插件主类
class RouterGuard implements Plugin {
  // 插件版本号
  public static version: string = '1.1.0';
  
  // 安装插件
  public install(app: App, options: RouterGuardOptions = {}): void {
    // 合并默认配置
    const config: Required<RouterGuardOptions> = {
      ...defaultOptions,
      ...options
    };

    // 配置验证
    this.validateConfig(config);

    // 注册全局属性
    app.config.globalProperties.$routerGuard = {
      config,
      check: (path: string) => this.handleRouteIntercept(path, config)
    } as RouterGuardInstance;

    // 注册路由拦截器
    this.registerInterceptors(config);

    console.log(`[hh-router-guard v${RouterGuard.version}] 路由守卫已启用`);
  }

  // 验证配置选项
  private validateConfig(config: Required<RouterGuardOptions>): void {
    if (!Array.isArray(config.whiteList)) {
      config.errorHandler(new Error('whiteList 必须是数组'));
      config.whiteList = [];
    }

    if (typeof config.checkLogin !== 'function') {
      config.errorHandler(new Error('checkLogin 必须是函数'));
      config.checkLogin = defaultOptions.checkLogin;
    }

    if (typeof config.loginHandler !== 'function') {
      config.errorHandler(new Error('loginHandler 必须是函数'));
      config.loginHandler = defaultOptions.loginHandler;
    }

    if (typeof config.errorHandler !== 'function') {
      config.errorHandler = defaultOptions.errorHandler;
    }
  }

  // 注册路由拦截器
  private registerInterceptors(config: Required<RouterGuardOptions>): void {
    const interceptors: Array<keyof typeof uni> = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];
    
    interceptors.forEach(method => {
      uni.addInterceptor(method, {
        invoke: (args: { url: string }) => {
          try {
            return this.handleRouteIntercept(args.url, config);
          } catch (error) {
            config.errorHandler(error instanceof Error ? error : new Error(String(error)));
            return true; // 发生错误时默认放行
          }
        }
      });
    });
  }

  // 处理路由拦截逻辑
  private handleRouteIntercept(url: string, config: Required<RouterGuardOptions>): boolean {
    try {
      const path = url.split('?')[0];
      
      // 使用工具函数检查白名单
      if (inWhiteList(path, config.whiteList)) {
        return true;
      }
      
      // 检查登录状态
      const isLoggedIn = config.checkLogin();
      
      if (!isLoggedIn) {
        // 未登录，执行登录处理逻辑
        config.loginHandler(url);
        return false;
      }
      
      return true;
    } catch (error) {
      config.errorHandler(error instanceof Error ? error : new Error(String(error)));
      return true; // 发生错误时默认放行
    }
  }
}

// 导出插件实例
export default new RouterGuard();
