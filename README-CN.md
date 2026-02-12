# TimePics.ai

<div align="center">
  <h1>🕰️ TimePics.ai - 渲染任意时刻</h1>
  <p><strong>AI驱动的视觉时光机</strong></p>
  <p>生成穿越过去、平行宇宙和未来时间线的图像，将它们铸造为 Solana 链上的活体 NFT。</p>

  <p>
    <a href="https://github.com/x2v-co/timepics"><img src="https://img.shields.io/badge/GitHub-x2v--co%2Ftimepics-blue?logo=github" alt="GitHub"></a>
    <a href="#"><img src="https://img.shields.io/badge/Status-MVP%20Complete-success" alt="Status"></a>
    <a href="#"><img src="https://img.shields.io/badge/Solana-Devnet-9945FF?logo=solana" alt="Solana"></a>
  </p>
</div>

---

## 🎯 什么是 TimePics.ai？

TimePics.ai 是一款创新的 Web3 应用，结合了 **AI 图像生成**、**区块链 NFT** 和**游戏化机制**，打造独特的"视觉时光机"体验。生成时间主题图像，将它们铸造为不断演化的 NFT，并参与社区驱动的时间线战争。

**口号：** "渲染任意时刻，永久拥有。"

---

## ✨ 核心功能

### 🎨 三大时间引擎

跨越不同时间维度生成图像：

- **⏪ 回溯引擎 (Rewind Engine)**: 穿越到过去
  - 使用 AI 超分辨率修复老照片
  - 年代风格迁移（1920年代、1950年代、1980年代、2000年代）
  - 历史场景重建，还原时代细节

- **✨ 折射引擎 (Refract Engine)**: 探索平行宇宙
  - 替代历史场景（"如果"时间线）
  - 历史人物融合到不同年代
  - 照片级真实的平行现实可视化

- **🔭  预见引擎 (Foresee Engine)**: 可视化未来
  - 未来预测和趋势
  - 年龄预测（30/50/70 年后）
  - 科幻未来场景生成

### 🧬 活体 NFT 与熵系统

你的 NFT 不是静态的 JPEG - 它们会**随时间演化**：

- **📅 生存天数**: 追踪你的 NFT 存在了多久
- **🌀 熵值 (0-100%)**: 视觉老化系统
  - 新鲜 (0-19%): 原始质量，色彩鲜艳
  - 老化 (20-49%): 颜色褪色，轻微噪点
  - 衰败 (50-79%): 可见老化，复古滤镜
  - 古董 (80-100%): 严重失真，故障艺术
- **🔒 冻结**: 永久锁定 NFT 当前状态
- **⚡ 加速**: 快进查看未来老化效果

### 🎁 每日时间胶囊

基于谜题的每日游戏，提升用户参与度：

- 每 24 小时一个新的神秘图像
- 通过猜关键词解锁
- 锁定内容显示噪点动画
- LocalStorage 持久化
- 下一个胶囊倒计时

### ⚔️ 时间线战争

社区驱动的历史战争：

- **质押 NFT** 支持阵营（例如：蒸汽革命 vs 生物起源）
- **NFT 力量系统**: 基于新鲜度、引擎类型和年龄
- **赢取奖励**: 获胜阵营分享 SOL 奖池
- **NFT 徽章**: 获胜者获得"正史"徽章，失败者获得"悖论"故障艺术
- **实时战况统计**: 实时力量对比和胜率

### 🔗 Solana Blinks 集成

在社交媒体上分享可交互的区块链链接：

- 直接在 Twitter 上分享 NFT 并附带铸造按钮
- 分享时间线战争战斗并附带质押按钮
- 从社交平台一键完成区块链操作
- 无需离开 Twitter 即可与区块链交互

---

## 🚀 快速开始

### 前置要求

- **Node.js 18+** 和 npm
- **Solana 钱包**（Phantom、Solflare 等）- 用于 NFT 铸造
- **API 密钥**：
  - [Google Gemini API](https://ai.google.dev/) - 用于 AI 图像生成 ✅ **必需**
  - [NFT.Storage Key](https://nft.storage) - 用于 IPFS 存储（免费）⚡ **推荐**

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/x2v-co/timepics.git
   cd timepics
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**

   创建 `.env.local` 文件：
   ```bash
   cp .env.example .env.local
   ```

   编辑 `.env.local` 填入你的密钥：
   ```env
   # AI 图像生成（必需）
   GEMINI_API_KEY=your_gemini_api_key_here

   # Solana 配置
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   SOLANA_RPC_URL=https://api.devnet.solana.com

   # IPFS 存储（推荐用于 NFT 铸造）
   NFT_STORAGE_KEY=your_nft_storage_key_here

   # 后端钱包（可选，用于真实 NFT 铸造）
   BACKEND_WALLET_PRIVATE_KEY=[1,2,3,...]
   ```

   **获取 API 密钥：**
   - **Gemini**: 访问 https://ai.google.dev/ → "Get API Key" → 复制密钥
   - **NFT.Storage**: 访问 https://nft.storage → 注册 → "API Keys" → "New Key"
   - 查看 [QUICK_START_IPFS.md](./QUICK_START_IPFS.md) 了解详细的 IPFS 设置

4. **运行开发服务器**
   ```bash
   npm run dev
   ```

5. **在浏览器中打开**
   ```
   http://localhost:3000
   ```

### 验证安装

测试一切是否正常：

```bash
# 测试 AI 生成
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"engine":"rewind","prompt":"vintage photo 1950s"}'

# 测试 IPFS（如果已配置）
curl http://localhost:3000/api/ipfs/test
```

或访问测试页面：http://localhost:3000/ipfs-test

---

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **动画**: Framer Motion
- **图标**: Lucide React

### AI 与生成
- **AI 提供商**: Google Gemini (Imagen 3)
- **图像格式**: JPEG, Base64
- **质量**: Standard (1K) 和 HD (4K)

### 区块链
- **网络**: Solana (Devnet/Mainnet)
- **钱包**: @solana/wallet-adapter (Phantom, Solflare 等)
- **NFT 标准**: Metaplex Token Metadata
- **操作**: Solana Blinks/Actions API

### 存储
- **IPFS**: NFT.Storage（免费永久存储）
- **网关**: https://nftstorage.link
- **格式**: 基于 CID 的内容寻址

---

## 📁 项目结构

```
timepics-ai/
├── app/                           # Next.js App Router
│   ├── api/                      # 后端 API 路由
│   │   ├── generate/            # AI 图像生成
│   │   ├── generate-ipfs/       # 生成 + IPFS 上传
│   │   ├── mint/                # NFT 铸造
│   │   ├── nfts/                # NFT 查询和操作
│   │   │   ├── freeze/          # 冻结 NFT 熵值
│   │   │   └── accelerate/      # 加速 NFT 老化
│   │   ├── blinks/              # Solana Blinks/Actions
│   │   │   ├── nft/[id]/        # NFT Blinks
│   │   │   └── wars/            # 时间线战争 Blinks
│   │   ├── wars/                # 时间线战争逻辑
│   │   │   └── stake/           # NFT 质押
│   │   └── ipfs/test/           # IPFS 测试
│   ├── generate/                # 生成界面
│   ├── gallery/                 # NFT 画廊（活体 NFT）
│   ├── timeline-wars/           # 战争战斗页面
│   ├── ipfs-test/               # IPFS 测试页面
│   ├── page.tsx                 # 主页（时间胶囊）
│   ├── layout.tsx               # 根布局（WalletProvider）
│   └── globals.css              # 全局样式
├── components/                   # React 组件
│   ├── ui/                      # shadcn/ui 基础组件
│   ├── WalletButton.tsx         # 钱包连接
│   ├── WalletProvider.tsx       # 钱包上下文
│   ├── EngineCard.tsx           # 时间引擎卡片
│   ├── GenerationForm.tsx       # 图像生成表单
│   ├── ImageDisplay.tsx         # 生成的图像查看器
│   ├── TimeAnimation.tsx        # 加载动画
│   ├── TimeCapsule.tsx          # 每日谜题游戏
│   ├── EnhancedNFTCard.tsx      # 活体 NFT 卡片（含熵值）
│   ├── NFTDetailModal.tsx       # NFT 详情弹窗
│   ├── MintSuccessModal.tsx     # 铸造后弹窗
│   ├── EntropyInfoCard.tsx      # 活体 NFT 说明卡
│   ├── BlinkShareButton.tsx     # 社交分享
│   └── MintButton.tsx           # NFT 铸造按钮
├── lib/                         # 工具库
│   ├── gemini.ts               # Google Gemini AI 客户端
│   ├── prompts.ts              # 引擎提示词工程
│   ├── ipfs.ts                 # IPFS 上传工具
│   ├── solana.ts               # Solana 连接
│   ├── metaplex.ts             # 使用 Metaplex 铸造 NFT
│   ├── storage.ts              # LocalStorage 辅助工具
│   ├── nftState.ts             # 活体 NFT 状态管理
│   ├── wars.ts                 # 时间线战争逻辑
│   ├── blinks.ts               # Solana Blinks 工具
│   └── utils.ts                # 通用工具
├── public/                      # 静态资源
│   └── images/                 # 演示图片
├── CLAUDE.md                    # 项目说明
├── IMPLEMENTATION_COMPLETE.md   # MVP 完成报告
├── GAMIFICATION_FEATURES.md     # 游戏化功能详情
├── FEATURE_UPDATES.md           # 功能更新日志
├── IPFS_IMPLEMENTATION.md       # IPFS 集成指南
├── QUICK_START_IPFS.md          # IPFS 快速设置
├── PHASE2_PHASE4_IMPLEMENTATION.md  # Blinks 与战争详情
└── DESIGN_SYSTEM.md             # UI/UX 设计指南
```

---

## 🎮 使用方法

### 1. 生成图像

访问 **http://localhost:3000/generate**

1. 选择时间引擎（回溯、折射或预见）
2. 输入提示词（或使用 AI 建议）
3. 选择选项：
   - **年代**: 1900年代、1920年代、1950年代、1980年代、2000年代或自定义
   - **宽高比**: 1:1、16:9、9:16、4:3、3:4
   - **质量**: Standard（更快）或 HD（更高质量）
4. 点击"生成图像"
5. 等待 20-30 秒完成 AI 生成
6. 下载、分享或铸造为 NFT

**提示词技巧：**
- 具体描述："1950年代客厅里的家庭合影" vs "老照片"
- 添加情绪："怀旧"、"戏剧性"、"乐观"
- 指定风格："柯达彩色"、"黑白"

### 2. 铸造活体 NFT

生成图像后：

1. 连接你的 Solana 钱包（推荐 Phantom）
2. 点击"铸造为 NFT"
3. 确认交易（devnet 上为 0.1 SOL）
4. 查看成功弹窗，包含：
   - 铸造地址
   - IPFS 链接（图像 + 元数据）
   - Solana 浏览器链接
5. 前往画廊或时间线战争

### 3. 管理活体 NFT

访问 **http://localhost:3000/gallery**

你的 NFT 会随时间通过熵系统演化：

**熵值等级：**
- **新鲜 (0-19%)**: 🟢 原始质量，鲜艳
- **老化 (20-49%)**: 🟡 轻微褪色，颜色偏移
- **衰败 (50-79%)**: 🟠 可见老化，噪点纹理
- **古董 (80-100%)**: 🔴 严重失真，故障艺术

**控制操作：**
- **🔒 冻结**: 锁定 NFT 当前状态（不可逆！）
- **⚡ 加速**: 快进老化（+20% 熵值）
- **🔗 分享 Blink**: 在 Twitter 上分享，附带可交互铸造按钮

**力量计算：**
```
NFT 力量 = (100 - 熵值) × 引擎加成 - 年龄惩罚
- 新鲜 NFT: 更高力量 (80-100)
- 老化 NFT: 更低力量 (0-50)
- 冻结 NFT: 力量锁定
```

### 4. 每日时间胶囊

访问 **http://localhost:3000**（主页）

- 每 24 小时新的神秘图像
- 阅读神秘提示
- 猜关键词解锁
- 锁定内容显示噪点动画
- 下一个胶囊倒计时

**示例胶囊：**
- 1969 年登月：提示 "不是阿姆斯特朗，而是..."
- 2077 赛博朋克城市：提示 "漂浮在 2077..."
- 恐龙共存：提示 "如果它们从未灭绝..."

### 5. 时间线战争

访问 **http://localhost:3000/timeline-wars**

**参与历史战斗：**

1. **选择阵营**（例如：蒸汽革命 vs 生物起源）
2. **加入阵营** → 跳转到生成页面，预设阵营风格
3. **生成阵营主题 NFT**
4. **用钱包铸造 NFT**
5. **返回战争页面**，点击"质押 NFT"
6. **确认质押**（0.01 SOL 手续费）
7. **观看实时战况统计**

**战斗结束后：**
- **获胜者**: 按比例分享 SOL 奖池 + "正史"徽章
- **失败者**: 获得"悖论时间线"徽章及故障艺术效果

**分享你的阵营：**
- 点击阵营卡片上的"分享 Blink"
- 在 Twitter 上分享，附带质押按钮
- 其他人可以直接从 Twitter 质押

---

## ⚙️ 配置

### 启用真实 NFT 铸造

目前处于模拟模式。要启用真实区块链铸造：

1. **生成后端钱包**
   ```bash
   solana-keygen new --outfile ~/.config/solana/backend-wallet.json
   ```

2. **获取 devnet SOL**
   ```bash
   # 获取钱包地址
   solana-keygen pubkey ~/.config/solana/backend-wallet.json

   # 请求空投
   solana airdrop 2 <你的钱包地址> --url devnet
   ```

3. **添加到 `.env.local`**
   ```bash
   # 从钱包 JSON 获取私钥数组
   cat ~/.config/solana/backend-wallet.json

   # 添加到 .env.local
   BACKEND_WALLET_PRIVATE_KEY=[1,2,3,4,...数组...]
   ```

4. **取消注释铸造代码**，在 `app/api/mint/route.ts` 中

### IPFS 配置

查看详细指南：[QUICK_START_IPFS.md](./QUICK_START_IPFS.md)

**快速步骤：**
1. 从 https://nft.storage 获取免费 API 密钥
2. 添加到 `.env.local`：`NFT_STORAGE_KEY=eyJhbGc...`
3. 测试：`curl http://localhost:3000/api/ipfs/test`

### 时间线战争配置

用于生产部署：

```env
# 战争奖池金库地址
WARS_VAULT_ADDRESS=TimePicsWarsVault11111111111111111111111

# Blinks 基础 URL
NEXT_PUBLIC_BASE_URL=https://timepics.ai
```

---

## 🚢 部署

### 部署到 Vercel（推荐）

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **部署**
   ```bash
   vercel deploy --prod
   ```

3. **在 Vercel 控制台添加环境变量**：
   - `GEMINI_API_KEY`
   - `NFT_STORAGE_KEY`
   - `BACKEND_WALLET_PRIVATE_KEY`（可选）
   - `NEXT_PUBLIC_SOLANA_NETWORK=devnet` 或 `mainnet-beta`
   - `SOLANA_RPC_URL`
   - `NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app`

4. **配置自定义域名**（可选）

### 部署到其他平台

- **Netlify**: 使用 Next.js 插件
- **Railway**: 支持 Docker 部署
- **AWS/GCP**: 使用 Docker 或 Next.js 独立构建

---

## 📊 性能与指标

### 图像生成
- ⏱️ **平均时间**: 25-30 秒
- 📦 **图像大小**: 800KB - 1.5MB
- 🎨 **质量**: 高（JPEG, Base64）
- 🔄 **成功率**: ~100%（有效提示词）

### IPFS 存储
- 🆓 **成本**: 免费（NFT.Storage）
- ⏱️ **上传时间**: 5-15 秒
- 🌐 **网关加载**: 1-3 秒（传播后）
- ♾️ **保留**: 永久

### 区块链
- ⛓️ **网络**: Solana Devnet（测试用）
- 💰 **铸造成本**: ~0.1 SOL（devnet），~0.01 SOL（mainnet）
- ⚡ **交易速度**: 1-3 秒
- 🔐 **标准**: Metaplex Token Metadata

---

## 🎯 路线图

### ✅ 第一阶段：MVP（已完成）
- [x] 三大时间引擎（回溯、折射、预见）
- [x] 真实 AI 图像生成（Google Gemini）
- [x] Solana 钱包集成
- [x] NFT 铸造基础设施
- [x] IPFS 存储集成
- [x] 响应式深色主题 UI

### ✅ 第二阶段：游戏化（已完成）
- [x] 带熵系统的活体 NFT
- [x] 冻结和加速机制
- [x] 每日时间胶囊谜题游戏
- [x] 用于社交分享的 Solana Blinks
- [x] NFT 详情弹窗和增强画廊

### ✅ 第三阶段：时间线战争（已完成）
- [x] NFT 质押系统
- [x] 力量计算算法
- [x] 奖池分配
- [x] 胜负徽章系统
- [x] 实时战况统计
- [x] 阵营主题生成

### 🔄 第四阶段：优化与发布（进行中）
- [ ] 主网部署
- [ ] 智能合约审计
- [ ] 增强移动端体验
- [ ] 社交功能（评论、点赞）
- [ ] 用户资料和统计
- [ ] 邮件通知

### 🔮 第五阶段：扩展（计划中）
- [ ] 为年代定制 LoRA 训练
- [ ] 视频生成（照片转视频）
- [ ] VR/3D 场景生成
- [ ] 为开发者提供 API 市场
- [ ] "B 时间线的今天"内容系列
- [ ] 企业集成（博物馆、教育）
- [ ] 多链支持（Ethereum、Base）

---

## 📚 文档

- **[CLAUDE.md](./CLAUDE.md)** - 项目概览和架构
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - MVP 完成报告
- **[GAMIFICATION_FEATURES.md](./GAMIFICATION_FEATURES.md)** - 活体 NFT 和时间胶囊详情
- **[FEATURE_UPDATES.md](./FEATURE_UPDATES.md)** - 功能更新日志
- **[IPFS_IMPLEMENTATION.md](./IPFS_IMPLEMENTATION.md)** - 详细的 IPFS 集成指南
- **[QUICK_START_IPFS.md](./QUICK_START_IPFS.md)** - 3 分钟 IPFS 设置
- **[PHASE2_PHASE4_IMPLEMENTATION.md](./PHASE2_PHASE4_IMPLEMENTATION.md)** - Blinks 和时间线战争
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - UI/UX 设计指南

---

## 🧪 测试

### 手动测试清单

**图像生成：**
- [ ] 所有三个引擎都成功生成图像
- [ ] 年代风格正确应用
- [ ] 不同宽高比正常工作
- [ ] HD 质量产生更高分辨率

**活体 NFT：**
- [ ] 熵值随时间增加
- [ ] 冻结锁定 NFT 状态
- [ ] 加速增加熵值
- [ ] 视觉效果匹配熵值等级
- [ ] 刷新后状态持久化

**每日时间胶囊：**
- [ ] 正确关键词解锁胶囊
- [ ] 错误关键词触发震动动画
- [ ] 解锁状态持续到第二天
- [ ] 倒计时正确显示

**时间线战争：**
- [ ] 质押 NFT 交易成功创建
- [ ] 力量计算准确
- [ ] 战况统计实时更新
- [ ] 奖励正确分配

**Blinks：**
- [ ] NFT Blink URL 正确生成
- [ ] 战争 Blink URL 在 Twitter 上正常工作
- [ ] 复制 URL 功能正常
- [ ] 在 Twitter 上分享正确打开

### 自动化测试

```bash
# 运行类型检查
npm run type-check

# 运行代码检查
npm run lint

# 构建生产版本
npm run build
```

---

## 🤝 贡献

我们欢迎贡献！这个项目是为 OpenBuild 黑客松构建的。

### 如何贡献

1. Fork 仓库
2. 创建你的功能分支
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. 提交你的更改
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. 推送到分支
   ```bash
   git push origin feature/amazing-feature
   ```
5. 开启 Pull Request

### 开发指南

- 遵循现有代码风格（TypeScript、ESLint）
- 编写清晰的提交信息
- 为新功能更新文档
- 彻底测试你的更改
- 尊重 DESIGN_SYSTEM.md 中的设计系统

---

## 🐛 已知问题与限制

### 当前限制

1. **NFT 铸造**: 默认处于模拟模式（需要配置后端钱包）
2. **时间线战争**: 奖励分配尚未上链
3. **Gemini API**: 免费层的速率限制可能影响生成速度
4. **IPFS**: 首次加载可能较慢（10-30 秒）由于内容传播

### 报告问题

发现 bug？请在 [GitHub](https://github.com/x2v-co/timepics/issues) 上提交 issue，包含：
- 问题描述
- 重现步骤
- 预期 vs 实际行为
- 截图（如适用）
- 浏览器和操作系统信息

---

## 📄 许可证

MIT 许可证 - 详见 [LICENSE](./LICENSE) 文件。

**开源声明**: 这个项目是开源的，可免费使用。感谢署名但不强制要求。

---

## 🙏 致谢

- **OpenBuild Hackathon** - 提供机会和灵感
- **Solana Foundation** - 提供区块链基础设施
- **Google AI** - 提供 Gemini Imagen API
- **NFT.Storage** - 提供免费永久 IPFS 存储
- **Metaplex** - 提供 NFT 标准和工具
- **shadcn/ui** - 提供精美的 UI 组件
- **Vercel** - 提供托管和部署
- **Next.js 团队** - 提供出色的框架

---

## 📞 联系方式与链接

- **GitHub**: [github.com/x2v-co/timepics](https://github.com/x2v-co/timepics)
- **在线演示**: 黑客松后即将推出
- **Twitter**: 使用 #TimePicsAI 分享你的作品
- **Discord**: 即将推出

---

## 💡 技巧与最佳实践

### 提示词工程
- **具体描述**: "维多利亚时代伦敦街道，雾蒙蒙的夜晚，煤气灯，鹅卵石"
- **添加年代关键词**: "复古"、"复古风"、"未来主义"、"反乌托邦"
- **包含情绪**: "怀旧"、"乐观"、"不祥"
- **指定质量**: "高度细节"、"照片级真实"、"电影级"

### NFT 策略
- **在新鲜状态铸造**: 更低熵值 = 战争中更高力量
- **策略性冻结**: 在衰败前锁定你最喜欢的时刻
- **加速获得稀有性**: 带有悖论徽章的老化 NFT 是独特的
- **跨年代收藏**: 多样化你的时间投资组合

### 时间线战争
- **明智选择引擎**: 折射引擎给予 +20% 力量加成
- **把握质押时机**: 新鲜 NFT 贡献更多力量
- **早期参与战斗**: 更早的质押者在阵营获胜时获得更大奖励
- **不要害怕失败**: 悖论徽章创造独特的故障艺术收藏品

---

<div align="center">
  <h2>✨ 渲染任意时刻，永久拥有 ✨</h2>
  <p><strong>时相机 - 用AI重现时间的每一个瞬间</strong></p>
  <p>以 ❤️ 为 OpenBuild Hackathon 2026 打造</p>
</div>
