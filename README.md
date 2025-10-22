# hh-router-guard

## 一、插件简介
`hh-router-guard` 是一款专为 **UniApp** 框架设计的路由守卫插件，基于 **Vue 3** 构建。它提供了强大的页面访问权限控制、登录拦截和白名单功能，帮助开发者轻松管理应用的路由权限，提升应用安全性和用户体验。

通过简单配置，您可以：
- 拦截所有页面跳转请求，实现统一权限校验
- 强制未登录用户跳转至登录页面
- 灵活定义无需登录即可访问的白名单页面
- 自定义登录状态检查逻辑和错误处理机制

## 二、版本信息
- 当前版本：`1.0.0`
- 更新日期：2025-05-12
- 兼容性：支持所有 UniApp 支持的平台（微信小程序、H5、App、支付宝小程序等）

## 三、安装与引入

### 方式一：从 DCloud 插件市场下载
1. 访问 [hh-router-guard 插件详情页](https://ext.dcloud.net.cn/plugin?id=XXXX)
2. 点击「使用 HBuilderX 导入插件」按钮，将插件导入到您的项目中
3. 插件会自动被放置在项目的 `uni_modules` 目录下

### 方式二：手动导入
1. 下载插件源码压缩包
2. 将解压后的文件复制到项目的 `uni_modules/hh-router-guard` 目录

### 引入插件
在项目的 `main.js` 中引入并注册插件：

```javascript
import { createSSRApp } from 'vue'
import App from './App.vue'
// 从 uni_modules 引入插件
import routerGuard from '@/uni_modules/hh-router-guard/src/index'

export function createApp() {
  const app = createSSRApp(App)
  
  // 安装路由守卫插件
  app.use(routerGuard, {
    // 配置选项
  })
  
  return { app }
}
```

## 四、快速上手

### 基础配置
以下是一个基础配置示例，展示如何设置白名单和登录检查逻辑：

```javascript
app.use(routerGuard, {
  // 白名单：无需登录即可访问的页面路径
  whiteList: [
    '/pages/login/index',      // 登录页
    '/pages/public/*',         // 所有公共页面
    '/pages/about',            // 关于页
  ],
  
  // 自定义登录检查函数（返回 true 表示已登录）
  checkLogin: () => {
    const token = uni.getStorageSync('token')
    return !!token
  },
  
  // 登录页面路径
  loginPath: '/pages/login/index',
  
  // 未登录时的处理逻辑
  loginHandler: (to) => {
    uni.navigateTo({
      url: `${loginPath}?redirect=${encodeURIComponent(to)}`
    })
  }
})
```

### 完整配置选项
| 选项           | 类型       | 必填 | 默认值                     | 描述                                                                 |
|----------------|------------|------|----------------------------|----------------------------------------------------------------------|
| `whiteList`    | `Array`    | 否   | `['/pages/login/index']`   | 白名单页面路径数组，支持通配符 `*`                                   |
| `checkLogin`   | `Function` | 否   | `() => uni.getStorageSync('token')` | 自定义登录检查函数，返回布尔值表示是否已登录                  |
| `loginPath`    | `String`   | 否   | `/pages/login/index`       | 登录页面的路径                                                       |
| `loginHandler` | `Function` | 否   | 跳转到登录页并携带 redirect 参数 | 未登录时的处理函数，接收目标路径作为参数                     |
| `errorHandler` | `Function` | 否   | 打印错误信息               | 错误处理函数，用于捕获插件运行时的异常                               |

## 五、高级用法

### 自定义错误处理
您可以通过 `errorHandler` 选项自定义错误处理逻辑：

```javascript
app.use(routerGuard, {
  // ...其他配置
  errorHandler: (error) => {
    uni.showToast({
      title: `路由错误: ${error.message}`,
      icon: 'none'
    })
  }
})
```

### 在组件中使用
插件会在 Vue 实例上挂载 `$routerGuard` 对象，您可以在组件中访问：

```javascript
// vue2写法
export default {
  methods: {
    checkPermission() {
      const isAllowed = this.$routerGuard.check('/pages/protected')
      console.log('当前用户是否有权限:', isAllowed)
    }
  }
}
// vue3 setup写法
<script setup>
// 导入组合式 API 钩子
import { useRouterGuard } from '@/uni_modules/hh-router-guard/src/useRouterGuard'

// 获取路由守卫实例
const routerGuard = useRouterGuard()

// 定义方法
const checkPermission = () => {
  const isAllowed = routerGuard.check('/pages/protected')
  console.log('当前用户是否有权限:', isAllowed)
}
</script>
```

## 六、示例项目
以下是一个完整的项目示例结构，展示如何集成和使用 `hh-router-guard`：

```
your-project/
├── pages/
│   ├── login/
│   │   └── index.vue         # 登录页面
│   ├── public/
│   │   ├── index.vue         # 公共页面
│   │   └── about.vue         # 关于页面
│   └── protected/
│       └── index.vue         # 需要登录才能访问的页面
├── uni_modules/
│   └── hh-router-guard/     # 插件目录
├── App.vue
└── main.js                   # 引入和配置插件的文件
```

## 七、更新日志
### v1.0.0 (2025-05-12)
- 初始版本发布，支持基本的路由拦截、白名单和登录检查功能
- 新增：支持自定义错误处理函数
- 优化：增强插件的容错能力，避免因配置错误导致应用崩溃
- 改进：添加版本信息输出，方便追踪插件版本

## 八、常见问题

### 1. 如何解决 "routerGuard is not defined" 错误？
- 确保插件路径正确，特别是从 `uni_modules` 引入时
- 检查插件是否正确导出（使用 `export default`）
- 尝试重启 HBuilderX 清除缓存

### 2. 白名单路径支持哪些匹配模式？
- 完全匹配：如 `/pages/login/index`
- 前缀匹配：如 `/pages/public/*` 会匹配所有以 `/pages/public/` 开头的路径

### 3. 如何在小程序和 H5 中使用不同的登录逻辑？
您可以在 `checkLogin` 函数中通过 `uni.getSystemInfoSync().platform` 判断运行环境，实现差异化逻辑：

```javascript
checkLogin: () => {
  if (uni.getSystemInfoSync().platform === 'h5') {
    // H5 平台的登录检查逻辑
    return localStorage.getItem('token') !== null
  } else {
    // 小程序平台的登录检查逻辑
    return uni.getStorageSync('token') !== ''
  }
}
```

## 九、贡献与反馈
如果您在使用过程中遇到问题或有任何建议，欢迎：
- 在 [插件市场评论区](https://ext.dcloud.net.cn/plugin?id=23410) 留言反馈
- 提交 Issues 到 [Github 仓库](https://github.com/hh-d/hh-router-guard/issues)
- 提交 Pull Requests 参与开发

## 十、许可证
本插件采用 [MIT 许可证](https://opensource.org/licenses/MIT) 发布，您可以自由使用、修改和分发。
