/**
 * hh-router-guard 插件类型定义
 */

// 白名单路径格式
export type WhitePath = string;

// 登录检查函数类型
export type CheckLoginFunction = () => boolean;

// 登录处理函数类型
export type LoginHandlerFunction = (to: string) => void;

// 错误处理函数类型
export type ErrorHandlerFunction = (error: Error) => void;

// 插件配置选项接口
export interface RouterGuardOptions {
  whiteList?: WhitePath[];
  loginPath?: string;
  checkLogin?: CheckLoginFunction;
  loginHandler?: LoginHandlerFunction;
  errorHandler?: ErrorHandlerFunction;
}

// 插件实例接口
export interface RouterGuardInstance {
  config: Required<RouterGuardOptions>;
  check: (path: string) => boolean;
}

// Vue 3 插件接口定义
export interface Plugin {
  install: (app: import('vue').App, ...options: any[]) => any;
}

// 扩展Vue应用类型
declare module 'vue' {
  interface ComponentCustomProperties {
    $routerGuard: RouterGuardInstance;
  }
}
