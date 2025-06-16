# 🚀 GitHub Pages 部署设置指南

## 📋 问题分析

根据您提供的错误截图，GitHub Actions 部署失败的原因可能是：

1. **GitHub Pages 未启用** - 需要在仓库设置中启用 GitHub Pages
2. **权限配置问题** - 工作流权限设置不正确
3. **分支配置错误** - GitHub Pages 源分支设置错误
4. **环境配置缺失** - 缺少必要的环境配置

## 🔧 解决方案

### 步骤1: 启用 GitHub Pages

1. **进入仓库设置**
   - 访问: https://github.com/9531lyj/space-battle-game
   - 点击 "Settings" 选项卡

2. **配置 Pages 设置**
   - 在左侧菜单找到 "Pages"
   - 在 "Source" 部分选择 "GitHub Actions"
   - 保存设置

### 步骤2: 检查工作流权限

1. **设置仓库权限**
   - 在 Settings → Actions → General
   - 找到 "Workflow permissions"
   - 选择 "Read and write permissions"
   - 勾选 "Allow GitHub Actions to create and approve pull requests"
   - 点击 "Save"

### 步骤3: 验证分支保护

1. **检查分支设置**
   - 在 Settings → Branches
   - 确保 main 分支没有阻止 Actions 的保护规则

### 步骤4: 手动触发部署

1. **手动运行工作流**
   - 访问: https://github.com/9531lyj/space-battle-game/actions
   - 点击 "🚀 部署太空战斗游戏" 工作流
   - 点击 "Run workflow" 按钮
   - 选择 main 分支
   - 点击 "Run workflow"

## 📝 修复的配置文件

### 1. GitHub Actions 工作流 (`.github/workflows/deploy.yml`)

```yaml
# 主要修复内容:
# ✅ 合并构建和部署作业，简化流程
# ✅ 添加详细的中文注释说明每个步骤
# ✅ 优化权限配置
# ✅ 增加构建产物验证
# ✅ 添加环境变量设置
# ✅ 改进错误处理和日志输出
```

**关键修复点:**
- **权限设置**: 正确配置 `contents: read`, `pages: write`, `id-token: write`
- **环境配置**: 添加 `NODE_ENV: production` 环境变量
- **构建验证**: 增加构建产物检查和大小显示
- **错误处理**: 添加详细的日志输出便于调试

### 2. Package.json 脚本优化

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "deploy:gh-pages": "npm run build && gh-pages -d dist",
    "deploy:cloudflare": "wrangler pages deploy dist --project-name=space-battle-game",
    "deploy:all": "npm run build && npm run deploy:vercel && npm run deploy:netlify && npm run deploy:cloudflare"
  }
}
```

### 3. Vite 配置优化 (`vite.config.ts`)

```typescript
export default defineConfig({
  // GitHub Pages 子路径配置
  base: process.env.NODE_ENV === 'production' ? '/space-battle-game/' : '/',
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three']  // Three.js 单独打包
        }
      }
    }
  }
})
```

## 🔍 故障排除

### 常见错误及解决方案

1. **"Pages site failed" 错误**
   ```
   解决方案: 检查 GitHub Pages 是否已启用，源设置为 "GitHub Actions"
   ```

2. **"Permission denied" 错误**
   ```
   解决方案: 在仓库设置中启用工作流写入权限
   ```

3. **"Build failed" 错误**
   ```
   解决方案: 检查 TypeScript 编译错误，运行 npm run type-check
   ```

4. **"Artifact upload failed" 错误**
   ```
   解决方案: 确保 dist 目录存在且包含构建产物
   ```

### 调试步骤

1. **检查工作流日志**
   ```
   访问: https://github.com/9531lyj/space-battle-game/actions
   点击失败的工作流查看详细日志
   ```

2. **本地测试构建**
   ```bash
   npm ci
   npm run type-check
   npm run build
   ls -la dist/
   ```

3. **验证配置文件**
   ```bash
   # 检查 package.json 语法
   cat package.json | jq .
   
   # 检查 vite.config.ts 语法
   npx tsc --noEmit vite.config.ts
   ```

## 🎯 预期结果

修复后的部署流程应该：

1. ✅ **自动触发**: 推送到 main 分支时自动运行
2. ✅ **成功构建**: TypeScript 编译和 Vite 构建无错误
3. ✅ **正确部署**: 构建产物上传到 GitHub Pages
4. ✅ **可访问**: 游戏在 https://9531lyj.github.io/space-battle-game/ 可正常访问

## 📞 获取帮助

如果问题仍然存在：

1. **查看工作流日志**: 在 GitHub Actions 页面查看详细错误信息
2. **检查仓库设置**: 确认 Pages 和 Actions 权限配置正确
3. **本地测试**: 在本地运行构建命令确认代码无误
4. **联系支持**: 如需帮助可通过 GitHub Issues 联系

---

**📝 文档信息**
- **作者**: 9531lyj
- **邮箱**: 2233613389@qq.com
- **更新时间**: 2024-12-16
- **版本**: 2.0

**🔗 相关链接**
- [GitHub 仓库](https://github.com/9531lyj/space-battle-game)
- [部署指南](./DEPLOYMENT.md)
- [项目说明](./README.md)
