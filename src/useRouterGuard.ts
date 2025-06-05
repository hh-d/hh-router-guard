/**
 * 组合式API钩子：在setup中获取路由守卫实例
 */
import { inject } from 'vue';
import { RouterGuardInstance } from './types';

export function useRouterGuard(): RouterGuardInstance {
  const routerGuard = inject('routerGuard') as RouterGuardInstance | undefined;
  
  if (!routerGuard) {
    throw new Error('请先安装 hh-router-guard 插件');
  }
  
  return routerGuard;
}
