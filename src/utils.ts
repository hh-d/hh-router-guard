/**
 * 检查路径是否匹配规则
 * @param path - 待检查的路径
 * @param pattern - 匹配规则（支持通配符*）
 * @returns 是否匹配
 */
export function matchPath(path: string, pattern: string): boolean {
  try {
    if (pattern.endsWith('*')) {
      return path.startsWith(pattern.slice(0, -1))
    }
    
    return path === pattern
  } catch (error) {
    console.error('[hh-router-guard] 路径匹配错误:', error)
    return false
  }
}

/**
 * 检查路径是否在白名单中
 * @param path - 待检查的路径
 * @param whiteList - 白名单列表
 * @returns 是否在白名单中
 */
export function inWhiteList(path: string, whiteList: string[]): boolean {
  try {
    if (!Array.isArray(whiteList)) {
      return false
    }
    
    return whiteList.some(pattern => matchPath(path, pattern))
  } catch (error) {
    console.error('[hh-router-guard] 白名单检查错误:', error)
    return false
  }
}
