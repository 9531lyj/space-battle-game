#!/bin/bash

# 太空战斗游戏一键部署脚本
# 作者: 9531lyj
# 版本: 2.0
# 支持平台: Vercel, Cloudflare Pages, Netlify, GitHub Pages

echo "🚀 太空战斗游戏一键部署脚本 v2.0"
echo "========================================"
echo "🎮 支持平台: Vercel | Cloudflare | Netlify | GitHub Pages"
echo "📧 作者: 9531lyj"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 检查必要工具
check_tools() {
    echo "🔍 检查部署工具..."
    
    # 检查Node.js和npm
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ 错误: 未检测到Node.js${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ 错误: 未检测到npm${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
    echo -e "${GREEN}✅ npm: $(npm --version)${NC}"
}

# 构建项目
build_project() {
    echo ""
    echo -e "${BLUE}📦 构建项目...${NC}"
    
    # 安装依赖
    echo "安装依赖..."
    if ! npm install; then
        echo -e "${RED}❌ 依赖安装失败${NC}"
        exit 1
    fi
    
    # 构建项目
    echo "构建项目..."
    if ! npm run build; then
        echo -e "${RED}❌ 项目构建失败${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 项目构建成功${NC}"
}

# Vercel部署
deploy_vercel() {
    echo ""
    echo -e "${PURPLE}🔥 部署到Vercel...${NC}"
    
    # 检查Vercel CLI
    if ! command -v vercel &> /dev/null; then
        echo "安装Vercel CLI..."
        npm install -g vercel
    fi
    
    echo "开始部署到Vercel..."
    vercel --prod
    
    echo -e "${GREEN}✅ Vercel部署完成！${NC}"
    echo -e "${YELLOW}🌐 访问地址: https://space-battle-game.vercel.app${NC}"
}

# Cloudflare Pages部署
deploy_cloudflare() {
    echo ""
    echo -e "${PURPLE}☁️  部署到Cloudflare Pages...${NC}"
    
    # 检查Wrangler CLI
    if ! command -v wrangler &> /dev/null; then
        echo "安装Wrangler CLI..."
        npm install -g wrangler
    fi
    
    echo "开始部署到Cloudflare Pages..."
    wrangler pages deploy dist --project-name=space-battle-game
    
    echo -e "${GREEN}✅ Cloudflare Pages部署完成！${NC}"
    echo -e "${YELLOW}🌐 访问地址: https://space-battle-game.pages.dev${NC}"
}

# Netlify部署
deploy_netlify() {
    echo ""
    echo -e "${PURPLE}🌊 部署到Netlify...${NC}"
    
    # 检查Netlify CLI
    if ! command -v netlify &> /dev/null; then
        echo "安装Netlify CLI..."
        npm install -g netlify-cli
    fi
    
    echo "开始部署到Netlify..."
    netlify deploy --prod --dir=dist
    
    echo -e "${GREEN}✅ Netlify部署完成！${NC}"
}

# GitHub Pages部署
deploy_github() {
    echo ""
    echo -e "${PURPLE}🐙 部署到GitHub Pages...${NC}"
    
    # 检查gh-pages
    if ! npm list -g gh-pages &> /dev/null; then
        echo "安装gh-pages..."
        npm install -g gh-pages
    fi
    
    echo "开始部署到GitHub Pages..."
    npm run deploy:gh-pages
    
    echo -e "${GREEN}✅ GitHub Pages部署完成！${NC}"
    echo -e "${YELLOW}🌐 访问地址: https://9531lyj.github.io/space-battle-game${NC}"
}

# 显示部署选项
show_menu() {
    echo ""
    echo -e "${BLUE}请选择部署平台:${NC}"
    echo "1) Vercel (推荐)"
    echo "2) Cloudflare Pages"
    echo "3) Netlify"
    echo "4) GitHub Pages"
    echo "5) 全部部署"
    echo "0) 退出"
    echo ""
    read -p "请输入选项 (0-5): " choice
}

# 主函数
main() {
    check_tools
    build_project
    
    while true; do
        show_menu
        
        case $choice in
            1)
                deploy_vercel
                break
                ;;
            2)
                deploy_cloudflare
                break
                ;;
            3)
                deploy_netlify
                break
                ;;
            4)
                deploy_github
                break
                ;;
            5)
                echo -e "${YELLOW}🚀 开始全平台部署...${NC}"
                deploy_vercel
                deploy_cloudflare
                deploy_netlify
                deploy_github
                echo -e "${GREEN}🎉 全平台部署完成！${NC}"
                break
                ;;
            0)
                echo -e "${YELLOW}👋 退出部署脚本${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ 无效选项，请重新选择${NC}"
                ;;
        esac
    done
    
    echo ""
    echo -e "${GREEN}🎉 部署完成！${NC}"
    echo -e "${BLUE}📖 部署文档: https://github.com/9531lyj/space-battle-game/blob/main/DEPLOYMENT.md${NC}"
}

# 运行主函数
main
