# 🚀 部署指南

本文档详细介绍如何将太空战斗游戏部署到各种平台。

## 📋 目录
- [Vercel 部署](#vercel-部署)
- [Netlify 部署](#netlify-部署)
- [Cloudflare Pages 部署](#cloudflare-pages-部署)
- [GitHub Pages 部署](#github-pages-部署)
- [自定义服务器部署](#自定义服务器部署)

## 🌐 Vercel 部署

### 一键部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/9531lyj/space-battle-game)

### 手动部署步骤
1. **注册 Vercel 账号**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   ```bash
   # 方法一：通过 Vercel CLI
   npm i -g vercel
   vercel --prod
   
   # 方法二：通过 Web 界面
   # 1. 点击 "New Project"
   # 2. 导入 GitHub 仓库
   # 3. 选择 space-battle-game
   ```

3. **配置设置**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **环境变量**（可选）
   ```
   NODE_ENV=production
   ```

### 自动部署
- 推送到 `main` 分支自动触发部署
- 预览分支：推送到其他分支创建预览

## 🌊 Netlify 部署

### 一键部署
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/9531lyj/space-battle-game)

### 手动部署步骤
1. **注册 Netlify 账号**
   - 访问 [netlify.com](https://netlify.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   ```bash
   # 方法一：通过 Netlify CLI
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   
   # 方法二：通过 Web 界面
   # 1. 点击 "New site from Git"
   # 2. 选择 GitHub
   # 3. 选择 space-battle-game 仓库
   ```

3. **构建设置**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

### 配置文件
项目已包含 `netlify.toml` 配置文件，包含：
- 构建设置
- 重定向规则
- 缓存优化
- 安全头部

## ☁️ Cloudflare Pages 部署

### 手动部署步骤
1. **注册 Cloudflare 账号**
   - 访问 [pages.cloudflare.com](https://pages.cloudflare.com)
   - 创建账号或登录

2. **创建项目**
   ```bash
   # 方法一：通过 Wrangler CLI
   npm install -g wrangler
   wrangler pages project create space-battle-game
   wrangler pages deploy dist
   
   # 方法二：通过 Web 界面
   # 1. 点击 "Create a project"
   # 2. 连接 GitHub
   # 3. 选择 space-battle-game 仓库
   ```

3. **构建设置**
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: `18`

### 配置文件
项目包含：
- `wrangler.toml` - Cloudflare Workers 配置
- `public/_redirects` - 重定向规则

## 📄 GitHub Pages 部署

### 自动部署（推荐）
1. **启用 GitHub Pages**
   - 进入仓库 Settings
   - 找到 Pages 设置
   - Source 选择 "GitHub Actions"

2. **自动部署**
   - 推送到 `main` 分支自动触发部署
   - 使用 `.github/workflows/deploy.yml` 工作流

### 手动部署
```bash
# 构建项目
npm run build

# 部署到 gh-pages 分支
npm install -g gh-pages
gh-pages -d dist
```

### 访问地址
- 部署后访问：`https://9531lyj.github.io/space-battle-game/`

## 🖥️ 自定义服务器部署

### Docker 部署
创建 `Dockerfile`：
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx 配置
创建 `nginx.conf`：
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 部署命令
```bash
# 构建 Docker 镜像
docker build -t space-battle-game .

# 运行容器
docker run -p 80:80 space-battle-game
```

## ⚙️ 环境变量配置

### 生产环境变量
```bash
NODE_ENV=production
VITE_APP_TITLE=太空战斗游戏
VITE_APP_VERSION=1.0.0
```

### 开发环境变量
```bash
NODE_ENV=development
VITE_DEV_PORT=5173
```

## 🔧 构建优化

### 生产构建
```bash
# 标准构建
npm run build

# 分析构建包大小
npm run build -- --analyze

# 预览构建结果
npm run preview
```

### 性能优化
- 代码分割：Three.js 单独打包
- 资源压缩：Terser 压缩 JavaScript
- 缓存策略：静态资源长期缓存
- CDN 加速：使用 CDN 分发静态资源

## 🚀 部署检查清单

### 部署前检查
- [ ] 代码已推送到 GitHub
- [ ] 构建命令正常运行
- [ ] 环境变量已配置
- [ ] 域名已设置（如需要）

### 部署后验证
- [ ] 网站可正常访问
- [ ] 游戏功能正常
- [ ] 资源加载正常
- [ ] 移动端兼容性
- [ ] 性能表现良好

## 🔗 部署链接

部署完成后，您的游戏将在以下地址可用：

- **Vercel**: `https://space-battle-game.vercel.app`
- **Netlify**: `https://space-battle-game.netlify.app`
- **Cloudflare Pages**: `https://space-battle-game.pages.dev`
- **GitHub Pages**: `https://9531lyj.github.io/space-battle-game/`

## 🚀 一键部署脚本

### 自动化部署工具

我们提供了智能部署脚本，支持多平台一键部署：

**Linux/macOS系统:**
```bash
# 给脚本执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

**Windows系统:**
```cmd
# 直接运行批处理文件
deploy.bat
```

### 脚本功能特性

- ✅ **环境检测**: 自动检测Node.js、npm版本
- ✅ **依赖管理**: 智能安装和更新项目依赖
- ✅ **构建优化**: 自动构建并优化项目
- ✅ **平台选择**: 支持Vercel、Cloudflare、Netlify、GitHub Pages
- ✅ **全平台部署**: 一键部署到所有支持的平台
- ✅ **错误处理**: 详细的错误提示和解决方案
- ✅ **彩色输出**: 友好的命令行界面

### 支持的部署平台

| 平台 | 特点 | 推荐场景 |
|------|------|----------|
| **Vercel** 🔥 | 零配置、全球CDN、自动HTTPS | 个人项目、快速原型 |
| **Cloudflare Pages** ☁️ | 无限带宽、边缘计算、DDoS防护 | 高流量、企业级 |
| **Netlify** 🌊 | 表单处理、边缘函数、A/B测试 | 静态网站、营销页面 |
| **GitHub Pages** 🐙 | 免费托管、版本控制、开源友好 | 开源项目、文档网站 |

### 使用示例

```bash
# 运行部署脚本
./deploy.sh

# 选择部署平台
请选择部署平台:
1) Vercel (推荐)
2) Cloudflare Pages
3) Netlify
4) GitHub Pages
5) 全部部署
0) 退出

请输入选项 (0-5): 1

# 脚本将自动完成以下步骤:
🔍 检查系统环境...
✅ Node.js: v18.17.0
✅ npm: 9.6.7

📦 构建项目...
✅ 项目构建成功

🔥 部署到Vercel...
✅ Vercel部署完成！
🌐 访问地址: https://space-battle-game.vercel.app
```

## 📞 获取帮助

如果在部署过程中遇到问题：

1. **查看官方文档**
   - [Vercel文档](https://vercel.com/docs)
   - [Cloudflare Pages文档](https://developers.cloudflare.com/pages/)
   - [Netlify文档](https://docs.netlify.com/)
   - [GitHub Pages文档](https://docs.github.com/pages)

2. **常见问题排查**
   - 检查Node.js版本 (推荐18+)
   - 验证网络连接
   - 清除npm缓存: `npm cache clean --force`
   - 重新安装依赖: `rm -rf node_modules && npm install`

3. **获取技术支持**
   - 查看构建日志
   - 检查平台状态页面
   - 提交 [GitHub Issue](https://github.com/9531lyj/space-battle-game/issues)
   - 联系作者: [@9531lyj](https://github.com/9531lyj)

## 🎯 部署最佳实践

### 性能优化建议

1. **启用压缩**: 确保Gzip/Brotli压缩已启用
2. **CDN配置**: 使用全球CDN加速静态资源
3. **缓存策略**: 设置合理的缓存头
4. **图片优化**: 使用WebP格式和适当尺寸
5. **代码分割**: 按需加载减少初始包大小

### 安全配置

1. **HTTPS强制**: 所有平台默认启用HTTPS
2. **安全头部**: 配置CSP、HSTS等安全头
3. **域名验证**: 使用自定义域名时验证所有权
4. **访问控制**: 根据需要设置访问限制

---

**🚀 祝您部署成功！** 享受在线太空战斗的乐趣！

**📝 文档信息**
- **作者**: 9531lyj
- **最后更新**: 2024-12-16
- **文档版本**: 2.0
- **项目版本**: 2.0
