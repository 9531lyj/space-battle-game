# GitHub 同步步骤

## 1. 创建GitHub仓库
1. 访问 https://github.com
2. 点击 "+" -> "New repository"
3. 仓库名称：`space-battle-game`
4. 描述：`🚀 3D太空战斗游戏 - 基于Three.js开发，具有瞄准镜系统和技能系统`
5. 设置为 Public
6. 不要勾选 "Add a README file"
7. 点击 "Create repository"

## 2. 推送代码到GitHub
在项目目录中执行以下命令：

```bash
# 添加远程仓库
git remote add origin https://github.com/9531lyj/space-battle-game.git

# 重命名主分支为 main
git branch -M main

# 推送代码
git push -u origin main
```

## 3. 验证推送成功
推送完成后，访问您的GitHub仓库页面，应该能看到所有文件和README。

## 4. 设置GitHub Pages（可选）
如果想要在线演示游戏：
1. 在仓库页面点击 "Settings"
2. 滚动到 "Pages" 部分
3. Source 选择 "Deploy from a branch"
4. Branch 选择 "main"
5. 点击 "Save"

注意：由于使用了Vite，需要先构建项目：
```bash
npm run build
```
然后将 dist 文件夹的内容推送到 gh-pages 分支。
