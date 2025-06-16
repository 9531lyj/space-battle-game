#!/bin/bash

# 太空战斗游戏启动脚本
# 作者: 9531lyj
# 版本: 2.0
# 描述: 自动检测环境、安装依赖并启动3D太空战斗游戏

echo "🚀 太空战斗游戏启动脚本 v2.0"
echo "================================"
echo "🎮 3D太空战斗游戏 - 基于Three.js开发"
echo "📧 作者: 9531lyj"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查操作系统
echo "🔍 检测系统环境..."
OS=$(uname -s)
echo "✅ 操作系统: $OS"

# 检查Node.js是否安装
echo ""
echo "🔍 检查Node.js环境..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 错误: 未检测到Node.js${NC}"
    echo -e "${YELLOW}请先安装Node.js:${NC}"
    echo "  - 官网下载: https://nodejs.org/"
    echo "  - 或使用包管理器:"
    echo "    Ubuntu/Debian: sudo apt install nodejs npm"
    echo "    CentOS/RHEL: sudo yum install nodejs npm"
    echo "    macOS: brew install node"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ 错误: 未检测到npm${NC}"
    echo -e "${YELLOW}请先安装npm包管理器${NC}"
    exit 1
fi

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ Node.js版本: $NODE_VERSION${NC}"
echo -e "${GREEN}✅ npm版本: $NPM_VERSION${NC}"

# 检查Node.js版本是否满足要求
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_MAJOR_VERSION" -lt 16 ]; then
    echo -e "${YELLOW}⚠️  警告: Node.js版本较低 ($NODE_VERSION)${NC}"
    echo "建议使用Node.js 16或更高版本以获得最佳性能"
fi

# 检查package.json是否存在
echo ""
echo "🔍 检查项目文件..."
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误: 未找到package.json文件${NC}"
    echo "请确保在项目根目录运行此脚本"
    echo "当前目录: $(pwd)"
    exit 1
fi

echo -e "${GREEN}✅ 找到package.json文件${NC}"

# 检查是否存在node_modules
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 首次运行，需要安装依赖...${NC}"
    FIRST_RUN=true
else
    echo -e "${GREEN}✅ 依赖目录已存在${NC}"
    FIRST_RUN=false
fi

# 安装或更新依赖
echo ""
if [ "$FIRST_RUN" = true ]; then
    echo -e "${BLUE}📦 正在安装项目依赖...${NC}"
    echo "这可能需要几分钟时间，请耐心等待..."
else
    echo -e "${BLUE}📦 检查并更新依赖...${NC}"
fi

if npm install; then
    echo -e "${GREEN}✅ 依赖安装/更新成功${NC}"
else
    echo -e "${RED}❌ 依赖安装失败${NC}"
    echo "请检查网络连接或尝试以下解决方案:"
    echo "1. 清除npm缓存: npm cache clean --force"
    echo "2. 删除node_modules文件夹后重试"
    echo "3. 使用国内镜像: npm config set registry https://registry.npmmirror.com/"
    exit 1
fi

# 显示游戏信息
echo ""
echo -e "${BLUE}🎮 游戏信息${NC}"
echo "================================"
echo "🚀 游戏名称: 太空战斗游戏"
echo "🎯 游戏类型: 3D太空射击"
echo "⚡ 技术栈: Three.js + TypeScript + Vite"
echo "🎨 特色功能: 瞄准镜系统、技能系统、3D特效"
echo ""

# 显示控制说明
echo -e "${YELLOW}🎮 游戏控制说明${NC}"
echo "================================"
echo "WASD     - 移动飞机"
echo "Q/E      - 上升/下降"
echo "空格键   - 发射炮弹"
echo "右键     - 瞄准模式"
echo "滚轮     - 缩放瞄准镜"
echo "1234     - 使用技能"
echo "鼠标     - 控制视角"
echo ""

# 启动开发服务器
echo -e "${GREEN}🚀 启动开发服务器...${NC}"
echo "游戏将在浏览器中自动打开"
echo "如果没有自动打开，请手动访问显示的地址"
echo ""
echo -e "${YELLOW}提示: 按 Ctrl+C 可以停止服务器${NC}"
echo ""

# 启动开发服务器
npm run dev
