@echo off
chcp 65001 >nul
title 太空战斗游戏启动器

echo.
echo 🚀 太空战斗游戏启动脚本
echo ==========================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到Node.js
    echo 请先安装Node.js ^(https://nodejs.org/^)
    pause
    exit /b 1
)

REM 检查npm是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到npm
    echo 请先安装npm
    pause
    exit /b 1
)

echo ✅ Node.js版本:
node --version
echo ✅ npm版本:
npm --version
echo.

REM 检查package.json是否存在
if not exist "package.json" (
    echo ❌ 错误: 未找到package.json文件
    echo 请确保在项目根目录运行此脚本
    pause
    exit /b 1
)

echo 📦 正在安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo Dependencies installed successfully
echo.
echo Starting development server...
echo The game will open automatically in your browser
echo If it does not open automatically, please visit the displayed address
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start development server
call npm run dev

echo.
echo Game server stopped
pause
echo 游戏服务器已停止
pause
