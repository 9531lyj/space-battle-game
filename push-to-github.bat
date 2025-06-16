@echo off
chcp 65001 >nul
title Push Space Battle Game to GitHub

echo.
echo 🚀 Push Space Battle Game to GitHub
echo ===================================
echo Author: 9531lyj
echo Email: 2233613389@qq.com
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Git not detected
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo ✅ Git version:
git --version
echo.

REM Initialize git repository if not exists
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

REM Configure git user if not set
echo 🔧 Configuring Git user...
git config user.name "9531lyj"
git config user.email "2233613389@qq.com"
echo ✅ Git user configured

REM Add remote origin if not exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔗 Adding remote origin...
    git remote add origin https://github.com/9531lyj/space-battle-game.git
    echo ✅ Remote origin added
) else (
    echo ✅ Remote origin already exists
)

REM Add all files
echo 📦 Adding files to Git...
git add .
echo ✅ Files added to staging area

REM Commit changes
echo 💾 Committing changes...
git commit -m "🚀 Complete Space Battle Game v2.0

✨ Features:
- 3D space battle experience with Three.js
- Advanced crosshair aiming system
- Four-skill system (rapid fire, laser, missile, shield)
- Three enemy AI patterns (straight, zigzag, circle)
- Particle effects and dynamic lighting
- Multi-layer starfield background

🛠️ Technical Improvements:
- Full TypeScript type safety
- Optimized collision detection
- Memory management and cleanup
- Screen shake effects
- Responsive design

🚀 Deployment Ready:
- One-click deployment scripts for multiple platforms
- GitHub Actions CI/CD pipeline
- Support for Vercel, Cloudflare, Netlify, GitHub Pages
- Comprehensive documentation

🐛 Bug Fixes:
- Fixed startup script encoding issues
- Resolved TypeScript compilation errors
- Optimized performance and memory usage
- Added missing dependencies

📝 Documentation:
- Complete Chinese comments in code
- Detailed deployment guide
- Architecture and development docs
- Usage instructions

Author: 9531lyj
Email: 2233613389@qq.com
Version: 2.0"

if %errorlevel% neq 0 (
    echo ❌ Commit failed
    pause
    exit /b 1
)

echo ✅ Changes committed successfully
echo.

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo ⚠️ Push failed, trying to push to master branch...
    git push -u origin master
    if %errorlevel% neq 0 (
        echo ❌ Push failed
        echo Please check your GitHub credentials and repository access
        pause
        exit /b 1
    )
)

echo ✅ Successfully pushed to GitHub!
echo.
echo 🎉 Space Battle Game v2.0 is now live!
echo 🌐 Repository: https://github.com/9531lyj/space-battle-game
echo 🎮 Play online: https://9531lyj.github.io/space-battle-game/
echo.
echo 📋 Next steps:
echo 1. GitHub Actions will automatically deploy to GitHub Pages
echo 2. You can also deploy to other platforms using deploy.bat
echo 3. Check the deployment status in GitHub Actions tab
echo.

pause
