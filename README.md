# 🚀 太空战斗游戏 (Space Battle Game)

一个基于 Three.js 开发的 3D 太空战斗游戏，具有精美的视觉效果、丰富的技能系统和先进的瞄准镜功能。

## ✨ 游戏特性

### 🎮 核心功能
- **3D 太空环境** - 多层星空背景和星云效果
- **精美飞机模型** - 高质量 3D 模型和动态光效
- **智能敌机 AI** - 多种移动模式和战斗策略
- **实时碰撞检测** - 精确的物理碰撞系统
- **粒子效果系统** - 爆炸、引擎火焰等视觉效果

### 🎯 瞄准镜系统
- **精确瞄准** - 右键进入瞄准模式
- **可变缩放** - 滚轮调节瞄准镜倍数 (1x-3x)
- **目标锁定** - 自动识别和标记敌机
- **距离显示** - 实时显示目标距离
- **视觉反馈** - 动态准星和目标指示器

### ⚡ 技能系统
- **快速射击** (按键1) - 临时提升射击速度
- **激光束** (按键2) - 发射高伤害激光
- **导弹** (按键3) - 发射追踪导弹
- **护盾** (按键4) - 恢复生命值
- **能量管理** - 技能消耗能量，自动恢复

### 🎨 视觉效果
- **动态光照** - 多光源照明系统
- **实时阴影** - 高质量阴影映射
- **引擎火焰** - 动态火焰效果
- **爆炸粒子** - 真实的爆炸效果
- **UI 动画** - 流畅的界面动画

## 🎮 游戏控制

### 基础控制
- **WASD / 方向键** - 移动飞机
- **Q/E** - 上升/下降
- **空格键** - 发射炮弹
- **鼠标** - 控制视角

### 瞄准系统
- **右键** - 进入/退出瞄准模式
- **滚轮** - 调节瞄准镜缩放倍数
- **鼠标移动** - 精确瞄准

### 技能快捷键
- **1** - 快速射击技能 (消耗30能量)
- **2** - 激光束技能 (消耗50能量)
- **3** - 导弹技能 (消耗40能量)
- **4** - 护盾技能 (消耗60能量)

## 🛠️ 技术栈

- **Three.js** - 3D 图形渲染引擎
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 现代化构建工具
- **CSS3** - 样式和动画
- **HTML5** - 现代 Web 标准

## 🚀 快速开始

### ⚡ 一键启动（推荐）

#### Windows用户
```bash
# 双击运行启动脚本
start-game.bat
```

#### Linux/Mac用户
```bash
# 给脚本执行权限并运行
chmod +x start-game.sh
./start-game.sh
```

### 📋 手动启动

#### 安装依赖
```bash
npm install
```

#### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 📁 项目结构

```
space-battle-game/
├── docs/                     # 📚 项目文档
│   ├── ARCHITECTURE.md       # 架构设计文档
│   ├── DEPENDENCIES.md       # 依赖分析文档
│   ├── WORKFLOW.md           # 流程结构文档
│   └── DEVELOPMENT.md        # 开发指南文档
├── src/
│   ├── game/
│   │   ├── GameWorld.ts      # 游戏世界管理
│   │   ├── Player.ts         # 玩家飞机类
│   │   ├── Enemy.ts          # 敌机类
│   │   ├── Projectile.ts     # 炮弹系统
│   │   ├── Controls.ts       # 控制系统
│   │   └── Crosshair.ts      # 瞄准镜系统
│   ├── main.ts               # 主游戏逻辑
│   └── style.css             # 样式文件
├── index.html                # 主页面
├── package.json              # 项目配置
└── README.md                 # 项目说明
```

## 🎯 游戏机制

### 生命值系统
- 玩家初始生命值：100
- 敌机碰撞伤害：50
- 敌机炮弹伤害：10
- 护盾技能可恢复生命值

### 能量系统
- 初始能量：100
- 自动恢复：每秒10点
- 技能消耗不同能量值

### 得分系统
- 击毁直线敌机：100分
- 击毁之字形敌机：150分
- 击毁圆形移动敌机：200分

### 敌机 AI
- **直线模式** - 直接向玩家冲锋
- **之字形模式** - 左右摆动前进
- **圆形模式** - 圆形轨迹移动

## 🚀 在线部署

### 🔥 一键部署脚本 (推荐)

我们提供了智能部署脚本，支持多平台一键部署：

#### Windows用户
```cmd
# 直接运行批处理文件
deploy.bat
```

#### Linux/Mac用户
```bash
# 给脚本执行权限并运行
chmod +x deploy.sh
./deploy.sh
```

#### 脚本功能特性
- ✅ **自动环境检测** - 检查Node.js、npm版本
- ✅ **智能依赖管理** - 自动安装和更新依赖
- ✅ **多平台支持** - Vercel、Cloudflare、Netlify、GitHub Pages
- ✅ **全平台部署** - 一键部署到所有平台
- ✅ **友好界面** - 彩色输出和详细提示

### 🌐 在线一键部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/9531lyj/space-battle-game)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/9531lyj/space-battle-game)

### 📋 部署平台对比

| 平台 | 特点 | 推荐场景 | 部署难度 |
|------|------|----------|----------|
| **Vercel** 🔥 | 零配置、全球CDN、自动HTTPS | 个人项目、快速原型 | ⭐ |
| **Cloudflare Pages** ☁️ | 无限带宽、边缘计算、DDoS防护 | 高流量、企业级 | ⭐⭐ |
| **Netlify** 🌊 | 表单处理、边缘函数、A/B测试 | 静态网站、营销页面 | ⭐⭐ |
| **GitHub Pages** 🐙 | 免费托管、版本控制、开源友好 | 开源项目、文档网站 | ⭐⭐⭐ |
| **Docker** 🐳 | 容器化、自定义环境、可移植 | 自建服务器、企业内网 | ⭐⭐⭐⭐ |

详细部署指南请查看：**[📚 部署指南](DEPLOYMENT.md)**

## 📚 项目文档

### 核心文档
- **[🏗️ 架构设计](docs/ARCHITECTURE.md)** - 系统架构、模块设计、性能优化策略
- **[📦 依赖分析](docs/DEPENDENCIES.md)** - 依赖关系图、版本管理、风险评估
- **[🔄 流程结构](docs/WORKFLOW.md)** - 游戏循环、状态管理、事件处理流程
- **[🛠️ 开发指南](docs/DEVELOPMENT.md)** - 环境设置、代码规范、调试技巧
- **[🚀 部署指南](DEPLOYMENT.md)** - 各平台部署详细说明

### 快速导航
```
📖 想了解系统设计？     → docs/ARCHITECTURE.md
🔍 想分析项目依赖？     → docs/DEPENDENCIES.md
⚡ 想了解游戏流程？     → docs/WORKFLOW.md
🛠️ 想参与开发？        → docs/DEVELOPMENT.md
```

## 🔧 开发说明

### 添加新技能
1. 在 `Player.ts` 中的 `initSkills()` 方法添加技能定义
2. 在 `useSkill()` 方法中添加技能逻辑
3. 更新 UI 显示

### 添加新敌机类型
1. 在 `Enemy.ts` 中添加新的移动模式
2. 在 `updateMovement()` 方法中实现移动逻辑
3. 调整生成概率和得分

### 优化性能
- 使用对象池管理炮弹和粒子
- 实现视锥剔除
- 优化材质和纹理

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🎮 游戏截图

*游戏运行在 http://localhost:5173*

---

**享受太空战斗的乐趣！** 🚀✨
