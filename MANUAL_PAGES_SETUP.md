# 🔧 手动设置 GitHub Pages 指南

## 📋 问题说明

您遇到的错误 `Get Pages site failed` 表明 GitHub Pages 没有正确配置。这是一个常见问题，需要手动设置。

## ✅ 详细解决步骤

### 步骤1: 启用 GitHub Pages

1. **访问仓库设置页面**
   ```
   https://github.com/9531lyj/space-battle-game/settings
   ```

2. **找到 Pages 设置**
   - 在左侧菜单中滚动找到 "Pages" 选项
   - 点击 "Pages" 进入设置页面

3. **配置 Pages 源**
   - 在 "Source" 部分，点击下拉菜单
   - 选择 **"GitHub Actions"** (不是 "Deploy from a branch")
   - 页面会显示 "GitHub Actions" 已选中
   - 点击 "Save" 按钮保存设置

### 步骤2: 设置 Actions 权限

1. **访问 Actions 设置**
   ```
   https://github.com/9531lyj/space-battle-game/settings/actions
   ```

2. **配置工作流权限**
   - 找到 "Workflow permissions" 部分
   - 选择 **"Read and write permissions"**
   - 勾选 **"Allow GitHub Actions to create and approve pull requests"**
   - 点击 "Save" 保存设置

### 步骤3: 检查仓库可见性

1. **确认仓库是公开的**
   - 在仓库主页检查是否显示 "Public"
   - 如果是私有仓库，需要 GitHub Pro 才能使用 Pages

2. **如果是私有仓库**
   - 访问: Settings → General
   - 滚动到 "Danger Zone"
   - 点击 "Change repository visibility"
   - 选择 "Make public"

### 步骤4: 手动触发部署

1. **使用简化工作流**
   - 访问: https://github.com/9531lyj/space-battle-game/actions
   - 找到 "🚀 简化部署到 GitHub Pages" 工作流
   - 点击 "Run workflow"
   - 选择 main 分支
   - 点击绿色的 "Run workflow" 按钮

2. **或者使用传统部署方式**
   ```bash
   # 在本地运行
   npm run build
   npm run deploy:gh-pages
   ```

## 🔄 备用解决方案

### 方案1: 使用 gh-pages 分支部署

如果 GitHub Actions 仍有问题，可以使用传统的 gh-pages 分支部署：

1. **修改 Pages 源设置**
   - 在 Settings → Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "gh-pages"
   - Folder 选择 "/ (root)"

2. **运行简化工作流**
   - 这会创建 gh-pages 分支并部署

### 方案2: 本地部署

```bash
# 1. 构建项目
npm run build

# 2. 安装 gh-pages
npm install -g gh-pages

# 3. 部署到 gh-pages 分支
gh-pages -d dist
```

### 方案3: 手动上传

1. **构建项目**
   ```bash
   npm run build
   ```

2. **创建 gh-pages 分支**
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   cp -r dist/* .
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

## 🔍 故障排除

### 常见问题及解决方案

1. **"Pages site not found" 错误**
   ```
   解决方案: 确保在 Settings → Pages 中启用了 Pages
   ```

2. **"Permission denied" 错误**
   ```
   解决方案: 检查 Actions 权限设置，确保选择了 "Read and write permissions"
   ```

3. **"Repository not found" 错误**
   ```
   解决方案: 确保仓库是公开的，或者有 GitHub Pro 订阅
   ```

4. **构建成功但页面空白**
   ```
   解决方案: 检查 vite.config.ts 中的 base 路径配置
   ```

### 验证步骤

1. **检查 Pages 状态**
   - 访问: Settings → Pages
   - 应该显示绿色的 "Your site is published at..."

2. **检查部署历史**
   - 访问: Actions 页面
   - 查看工作流运行状态

3. **测试游戏访问**
   - 访问: https://9531lyj.github.io/space-battle-game/
   - 应该能正常加载游戏

## 📞 获取帮助

如果以上步骤都无法解决问题：

1. **检查 GitHub 状态**
   - 访问: https://www.githubstatus.com/
   - 确认 Pages 服务正常

2. **查看详细错误**
   - 在 Actions 页面查看完整的错误日志
   - 截图错误信息以便进一步诊断

3. **联系支持**
   - GitHub Community: https://github.community/
   - 或通过项目 Issues 联系

---

**📝 重要提醒**

- GitHub Pages 有时需要几分钟才能生效
- 确保仓库是公开的（除非有 GitHub Pro）
- 第一次设置可能需要手动触发工作流

**🎯 预期结果**

设置完成后，您应该能在以下地址访问游戏：
https://9531lyj.github.io/space-battle-game/

**👨‍💻 作者**: 9531lyj  
**📧 邮箱**: 2233613389@qq.com
