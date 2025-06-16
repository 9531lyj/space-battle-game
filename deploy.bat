@echo off
chcp 65001 >nul
title 太空战斗游戏一键部署脚本

echo.
echo 🚀 太空战斗游戏一键部署脚本 v2.0
echo ========================================
echo 🎮 支持平台: Vercel ^| Cloudflare ^| Netlify ^| GitHub Pages
echo 📧 作者: 9531lyj
echo.

REM 检查Node.js和npm
echo 🔍 检查部署工具...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到Node.js
    echo 请先安装Node.js ^(https://nodejs.org/^)
    pause
    exit /b 1
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到npm
    pause
    exit /b 1
)

echo ✅ Node.js: 
node --version
echo ✅ npm: 
npm --version

REM 构建项目
echo.
echo 📦 构建项目...
echo 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 项目构建失败
    pause
    exit /b 1
)

echo ✅ 项目构建成功

:menu
echo.
echo 请选择部署平台:
echo 1^) Vercel ^(推荐^)
echo 2^) Cloudflare Pages
echo 3^) Netlify
echo 4^) GitHub Pages
echo 5^) 全部部署
echo 0^) 退出
echo.
set /p choice=请输入选项 (0-5): 

if "%choice%"=="1" goto deploy_vercel
if "%choice%"=="2" goto deploy_cloudflare
if "%choice%"=="3" goto deploy_netlify
if "%choice%"=="4" goto deploy_github
if "%choice%"=="5" goto deploy_all
if "%choice%"=="0" goto exit
echo ❌ 无效选项，请重新选择
goto menu

:deploy_vercel
echo.
echo 🔥 部署到Vercel...
REM 检查Vercel CLI
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 安装Vercel CLI...
    call npm install -g vercel
)
echo 开始部署到Vercel...
call vercel --prod
echo ✅ Vercel部署完成！
echo 🌐 访问地址: https://space-battle-game.vercel.app
goto end

:deploy_cloudflare
echo.
echo ☁️  部署到Cloudflare Pages...
REM 检查Wrangler CLI
wrangler --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 安装Wrangler CLI...
    call npm install -g wrangler
)
echo 开始部署到Cloudflare Pages...
call wrangler pages deploy dist --project-name=space-battle-game
echo ✅ Cloudflare Pages部署完成！
echo 🌐 访问地址: https://space-battle-game.pages.dev
goto end

:deploy_netlify
echo.
echo 🌊 部署到Netlify...
REM 检查Netlify CLI
netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 安装Netlify CLI...
    call npm install -g netlify-cli
)
echo 开始部署到Netlify...
call netlify deploy --prod --dir=dist
echo ✅ Netlify部署完成！
goto end

:deploy_github
echo.
echo 🐙 部署到GitHub Pages...
echo 开始部署到GitHub Pages...
call npm run deploy:gh-pages
echo ✅ GitHub Pages部署完成！
echo 🌐 访问地址: https://9531lyj.github.io/space-battle-game
goto end

:deploy_all
echo.
echo 🚀 开始全平台部署...
call :deploy_vercel_silent
call :deploy_cloudflare_silent
call :deploy_netlify_silent
call :deploy_github_silent
echo 🎉 全平台部署完成！
goto end

:deploy_vercel_silent
echo 部署到Vercel...
vercel --version >nul 2>&1
if %errorlevel% neq 0 call npm install -g vercel
call vercel --prod
goto :eof

:deploy_cloudflare_silent
echo 部署到Cloudflare Pages...
wrangler --version >nul 2>&1
if %errorlevel% neq 0 call npm install -g wrangler
call wrangler pages deploy dist --project-name=space-battle-game
goto :eof

:deploy_netlify_silent
echo 部署到Netlify...
netlify --version >nul 2>&1
if %errorlevel% neq 0 call npm install -g netlify-cli
call netlify deploy --prod --dir=dist
goto :eof

:deploy_github_silent
echo 部署到GitHub Pages...
call npm run deploy:gh-pages
goto :eof

:end
echo.
echo 🎉 部署完成！
echo 📖 部署文档: https://github.com/9531lyj/space-battle-game/blob/main/DEPLOYMENT.md
pause
goto :eof

:exit
echo 👋 退出部署脚本
pause
exit /b 0
