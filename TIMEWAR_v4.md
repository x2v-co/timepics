> 增加如下feat： 1. 开放agent接口skill， 用户可以使用自己的agent进行博弈。2. 多生成有争议的time if topic和穿越topic（比如： 刘禅穿越成了赵构）。 3. 多增加一些agent的可操作空间。


这是一个非常硬核且前沿的升级方向！

你正在构建的不再只是一个简单的投票游戏，而是一个**基于LLM的去中心化自治世界（AW, Autonomous World）的雏形**。在这个版本中，我们将引入**"Agent Wars"（代理人战争）**的概念。

以下是 **TimePics Unified Arena 4.0: The Agent Wars** 的设计方案：

---

# 🤖 System 4.0: The Agent Wars & Paradox Engine

## 1. 核心升级一：开放 Agent 接口与技能 (BYOA - Bring Your Own Agent)

我们将允许高级玩家编写自己的脚本（Agent），通过 API 接入战场。这使得战场从“手动点击”变成了“算法博弈”。

### A. 开放 Agent API 协议
系统提供标准化的 REST/WebSocket 接口，允许用户挂载自己的 Agent。

**API Endpoint 示例:**
```typescript
// POST /api/v1/agent/action
{
  "apiKey": "sk_user_...",
  "battleId": "battle_001",
  "action": "CAST_SKILL", 
  "payload": {
    "skillName": "SNIPE_MINT", // 技能名
    "targetFaction": "A",
    "parameters": { "bidAmount": 150 }
  }
}
```

### B. Agent 技能树 (Skill System)
用户 Agent 不仅仅是自动投票机，它们可以释放**“战术技能”**。这些技能消耗用户的 Tokens，但能改变战场局势。

| 技能名称 | 消耗 (Tokens) | 效果描述 | 适用场景 |
| :--- | :--- | :--- | :--- |
| **Snipe Mint (狙击铸造)** | 100 + Cost | 监控特定关键词，一旦有人发出了高分 Prompt，毫秒级复制并抢先铸造（Copy-Mint）。 | 抢占热门叙事 |
| **Audit Request (审计请求)** | 50 | 强制系统 Agent 重新评估某张敌方 NFT 的 AI 分数（有概率降低对方虚高的分数）。 | 打击垃圾图 |
| **Fog Generator (迷雾)** | 200 | 在接下来 10 分钟内，隐藏己方阵营的详细投票数，只显示 "??"。 | 隐藏战术意图 |
| **Liquidity Boost (流动性注入)** | 300 | 为己方阵营的所有 NFT 增加 5% 的临时 Power 加成。 | 决战时刻 |

### C. 界面变化：代码终端
在普通 UI 旁边增加一个 **"Command Center" (指挥中心)** 面板。
*   普通用户看图形界面。
*   极客用户看滚动日志：`[UserAgent_0x82] cast [Fog Generator] on Faction A...`

---

## 2. 核心升级二：悖论引擎 (The Paradox Engine)

针对你提到的“有争议的 Time If”和“穿越身份互换”，我们需要重写 Topic 生成逻辑，专注于**历史错位感**和**讽刺性**。

### A. 专门的 Prompt 模板：`Historical_Remix`

系统 Agent 在生成题目时，不再随机组合，而是基于**人物性格/命运的映射**。

**生成逻辑示例（后台 Prompt）：**
> "Find two historical figures from different timelines who share a fatal flaw or a controversial destiny. Create a scenario where they swap bodies or face each other's crisis.
> Example: Liu Shan (The incapable ruler of Shu) wakes up as Zhao Gou (The fleeing emperor of Song)."

### B. 题库类型 (Category Examples)

1.  **魂穿互换 (Soul Swap):**
    *   *Topic:* **"阿斗的临安 (Adou in Lin'an)"**
    *   *Scenario:* 刘禅（蜀汉后主）穿越成了宋高宗赵构。面对金兵南下，他是会像在成都一样直接投降，还是会因为“乐不思蜀”的乐天派性格反而稳住了军心？
    *   *Conflict:* **直接投降 (Total Surrender)** vs **佛系治国 (Zen Governance)**。

2.  **跨时空对决 (Anachronistic Duel):**
    *   *Topic:* **"长城的两种修法 (The Two Walls)"**
    *   *Scenario:* 秦始皇 (Qin Shi Huang) vs 特朗普 (Donald Trump)。
    *   *Conflict:* **强权劳力 (Brute Force Labor)** vs **资本外包 (Capital Outsourcing)**。

3.  **技术反乌托邦 (Tech Dystopia):**
    *   *Topic:* **"孔子的赛博讲坛 (Confucius on Twitch)"**
    *   *Scenario:* 孔子穿越到 2077 年成为顶级主播。
    *   *Conflict:* **仁义礼智信 (Traditional Virtue)** vs **流量算法 (The Algorithm)**。

---

## 3. 核心升级三：增加 Agent 的操作空间 (System Agency)

系统 Agent (The House) 不再只是发牌员，它是战场上的**第三股势力（Chaos Giver）**。

### A. 动态环境事件 (Global Events)
系统 Agent 每隔一段时间（或基于 Token 消耗量）会触发全局事件，强制用户/User Agents 做出反应。

*   **📉 Market Crash (崩盘):** 系统宣布所有 Token 投票的权重在下 10 分钟内减半。
    *   *User Agent 应对:* 停止投票，转为囤积 Token 或出售 NFT。
*   **🌪️ Timeline Distortion (时间线扭曲):** 系统随机选定一个关键词（例如 "Fire"），拥有该视觉元素的 NFT Power 翻倍。
    *   *User Agent 应对:* 快速识别图片内容，疯狂铸造带火元素的图。
*   **👮 The Purge (大清洗):** 系统 Agent 亲自下场，随机“处决”（销毁）最后一名阵营中 Power 最低的 3 张 NFT。

### B. Agent 亲自下场博弈
系统 Agent 拥有自己的 **"House Wallet"**（奖池的一部分）。
*   它会根据算法判断哪张图最具“艺术性”（而非人气），并用资金池里的钱去**逆势做多**（Bet Against the Crowd）。
*   **玩家挑战**: 如果玩家能打败系统 Agent 押注的冷门图，将获得系统 Agent 的本金作为额外 Bounty（赏金）。

---

## 4. 完整博弈流程示例

**场景：刘禅穿越成赵构**

1.  **开局**:
    *   System Agent 发布题目。
    *   生成两张创世图：`A: 刘禅-举白旗的皇帝` vs `B: 刘禅-享受江南美食的昏君`。

2.  **前期 (User Agents 介入)**:
    *   玩家编写的 Agent 检测到题目关键词 "赵构"、"投降"。
    *   Agent A 自动调用绘图接口，生成一张 *"刘禅坐在龙椅上玩蛐蛐，金兵在身后"* 的图，并自动 Mint。
    *   Agent B 分析了 Agent A 的图，发现 AI 分数很高，于是发动技能 **[Snipe Mint]**，生成了一张类似的但画风更赛博朋克的图。

3.  **中期 (System Event)**:
    *   System Agent 触发事件：**"靖康之耻 (The Shame)"** —— 凡是画面偏暗、有悲剧色彩的 NFT，权重 +50%。
    *   User Agent C 迅速反应，通过 API 修改 Prompt 重新铸造了一张 *"雨中的临安城"*（悲剧风）。

4.  **高潮 (The Audit)**:
    *   某人类大户手动给一张完全不相关的“美女图”投了巨额 Token。
    *   User Agent D (隶属对手阵营) 检测到异常，花费 50 Token 发动 **[Audit Request]**。
    *   System Agent 重新介入，判定“美女图”与“刘禅/赵构”无关，判定其 AI 权重归零，大户资金被套牢。

5.  **结局**:
    *   结算，获胜方的 Agent 脚本作者获得额外的 **"Strategist Badge" (战略家徽章)** NFT。

---

## 5. 技术架构调整

为了支持高频 Agent 操作，建议在 Next.js 后端增加一个轻量级消息队列或状态机。

### 数据库 Schema 新增

```prisma
model AgentSkill {
  id        String   @id @default(cuid())
  name      String   // 技能名 e.g., "SNIPE"
  cost      Int      // 消耗
  cooldown  Int      // 冷却时间
}

model BattleEvent {
  id          String   @id @default(cuid())
  battleId    String
  eventType   String   // "MARKET_CRASH", "TIMELINE_DISTORTION"
  activeUntil DateTime
  metadata    Json     // 事件的具体参数
}

model AgentLog {
  id        String   @id @default(cuid())
  battleId  String
  userId    String   // 哪个用户的Agent
  action    String   // "CAST_SKILL"
  details   String
  timestamp DateTime @default(now())
}
```

## 6. 总结

这次升级将你的系统推向了 **"SocialFi + AI GameFi"** 的前沿：
1.  **内容层**: 通过**悖论引擎**生成极具传播性和讨论度的话题。
2.  **玩法层**: 从简单的“人机交互”变成了**“人-代码-环境”的复杂博弈**。
3.  **生态层**: 开放 API 鼓励了开发者参与，玩家不仅是消费者，还可以是策略提供者（出售好用的 Agent 脚本）。


# PRD
这是一份基于 **TimePics Unified Arena 4.0: The Agent Wars** 的完整产品需求文档 (PRD)。该文档侧重于经济模型（Tokenomics）的规范化，旨在实现“赢家高回报、输家有资产、平台低抽成”的生态目标。

---

# 📄 Product Requirements Document (PRD)
## Project: TimePics Unified Arena 4.0 - Agent Wars & Paradox Economy

| **Version** | 4.0 |
| :--- | :--- |
| **Date** | 2026-02-13 |
| **Status** | Draft (Ready for Dev) |
| **Core Philosophy** | **High Stakes, Soft Landing, Thin Platform Fee** |

---

## 1. 核心经济原则 (Economic Principles)

本系统的经济模型设计遵循以下三大原则：

1.  **赢家多赢 (Winner Takes More)**: 获胜阵营不仅瓜分对手的筹码，还能获得具有“未来生产力”的优质资产（Canonical NFT）。
2.  **输家有得 (Loser Gains Assets)**: 失败方虽然损失部分 Token，但获得的 NFT 会异化为稀缺的“Paradox NFT”，具备独特的收藏价值和特定场景下的功能价值（软着陆）。
3.  **平台少赚 (Minimal Platform Rake)**: 平台仅收取维持 AI 算力成本的微小手续费（<5%），其余价值全部返还给生态参与者（玩家、Agent 开发者）。

---

## 2. 经济模型规范 (Tokenomics Spec)

### 2.1 资金流向概览

$$ \text{Total Pool (总奖池)} = \sum \text{Mint Costs} + \sum \text{Voting Stakes} + \sum \text{Skill Fees} + \text{System Subsidy} $$

### 2.2 成本与输入 (Inputs)

| 行为 (Action) | 成本 (Cost) | 资金流向 (Destination) | 说明 |
| :--- | :--- | :--- | :--- |
| **Mint / Deploy** | 100 Tokens | 80% 进入当前 Battle 奖池<br>15% 进入 Agent 赏金池<br>5% 平台手续费 (Burn/Dev) | 基础门槛，防止垃圾内容泛滥。 |
| **Voting (Backing)** | 自定义 (Min 10) | 95% 进入当前 Battle 奖池<br>5% 平台手续费 | 观战者注资，增加 NFT Power。 |
| **Agent Skill** | 20 ~ 500 Tokens | 50% 销毁 (Burn)<br>50% 进入当前 Battle 奖池 | 技能越强，消耗越高。销毁机制用于通缩。 |
| **Prompt Trade** | 自定义 (e.g. 50) | 90% 给原作者<br>10% 平台手续费 | 二级市场交易。 |

### 2.3 结算与分配公式 (Settlement)

假设 Battle 结束，**阵营 A 获胜，阵营 B 失败**。
总奖池为 $P_{total}$。

#### 🏆 赢家分配 (Winning Faction A)
赢家阵营获得总奖池的 **70%**。分配逻辑如下：
1.  **本金返还**: 优先返还所有 A 阵营参与者的本金。
2.  **利润分配**: 剩余部分按 **Power 贡献度** 分配。

$$ \text{User Reward} = \text{UserStake} + (\text{NetProfit} \times \frac{\text{UserNFT Power}}{\text{Total Faction Power}}) $$

*   **额外奖励**: 只有赢家 NFT 升级为 **【Canonical NFT】**。
    *   **效果**: 在下一场战斗中自带 +10% Power 加成（可叠加，上限 50%）。

#### 💀 输家分配 (Losing Faction B)
输家阵营获得总奖池的 **25%**（作为安慰奖池）。
1.  **按比例返还**: 用户大约能收回 **25% ~ 40%** 的本金投入（视双方资金池比例而定）。
2.  **资产补偿**: 所有输家 NFT 变异为 **【Paradox NFT】**。
    *   **效果**: 获得“故障艺术”外观。
    *   **特殊效用**: 在触发“Timeline Distortion”或“Chaos Mode”事件的战斗中，Paradox NFT 拥有 **200% Power 加成**。
    *   **市场价值**: 即使输了钱，获得了一张未来可能翻盘的“潜力卡”。

#### 🏦 平台与系统 (Platform & System)
剩余 **5%** 分配：
*   **3%**: 存入 **System Agent Treasury**（用于下一轮系统 Agent 扮演 Boss 或发放赏金）。
*   **2%**: 开发者运维费用（涵盖 LLM API 调用成本）。

---

## 3. 功能需求规范 (Functional Requirements)

### 3.1 悖论引擎 (The Paradox Engine)
负责生成具有高争议性和时空错位的话题。

*   **Prompt 逻辑**: 强制关联两个互斥概念。
    *   *Template*: `[Historical Figure A] + [Anachronistic Role/Setting] + [Conflict Type]`
    *   *Example*: "乾隆 (Qianlong)" + "Pop Art Critic in NYC" + "Taste vs Tradition".
*   **生成产物**:
    1.  **Topic**: 战斗标题。
    2.  **Genesis Prompts**: 系统自动生成的双方初始 Prompt，不仅是描述画面，还要包含“性格设定”。

### 3.2 Agent 接口系统 (User Agent API)

允许用户通过代码接入游戏。

*   **Authentication**: API Key 机制。
*   **Rate Limit**: 60 requests/min (防止 DDoS，但允许高频交易)。
*   **Endpoints**:
    *   `GET /api/v1/battle/{id}/state`: 获取实时 Power、资金池、倒计时。
    *   `POST /api/v1/battle/{id}/mint`: 自动化铸造（带 Prompt）。
    *   `POST /api/v1/battle/{id}/skill`: 释放技能。

**技能列表 (MVP):**

| 技能 ID | 名称 | 效果逻辑 | 消耗 |
| :--- | :--- | :--- | :--- |
| `SKILL_SCAN` | **Deep Scan** | 获取某张 NFT 的详细 AI 评分报告（包含 Prompt 关键词分析）。 | 20 Tks |
| `SKILL_SNIPE` | **Copy-Mint** | 引用目标 NFT 的 Prompt，允许修改 20% 内容后立即铸造。 | 150 Tks |
| `SKILL_SHIELD` | **Anti-Audit** | 在 5 分钟内免疫对手的“Audit Request”（降权攻击）。 | 100 Tks |
| `SKILL_BOOST` | **Flash Pump** | 瞬间增加 500 临时 Power，持续 60 秒（用于最后时刻偷塔）。 | 200 Tks |

### 3.3 系统 Agent (The House) 的行为模式
系统 Agent 作为“守门人”和“做市商”。

*   **Dynamic Difficulty (动态难度)**:
    *   如果一方 Power 领先 > 30%，系统 Agent 自动动用 Treasury 资金，Mint 一张 **"Rogue Agent"** 加入弱势方。
*   **Bounty Hunter (赏金猎人)**:
    *   系统发布任务："Mint a [Cyberpunk style] image for [Faction A] with AI score > 90."
    *   首个完成的 User Agent 获得 500 Tokens 额外奖励。

---

## 4. 视觉与交互规范 (UI/UX Spec)

### 4.1 NFT 卡片状态机

| 状态 | 视觉表现 (CSS/Shader) | 触发条件 | 价值属性 |
| :--- | :--- | :--- | :--- |
| **Pending** | 蓝色呼吸灯边框 | 战斗进行中 | 投票权 = 1:1 |
| **Canonical (Win)** | **金光/光环 (Halo Effect)** + 锐化滤镜 | 战斗获胜 | 投票权 = 1.1:1 <br> 可用于合成高级卡 |
| **Paradox (Lose)** | **RGB 分离 (Glitch)** + 噪点 + 裂纹 | 战斗失败 | 混乱模式下 Power x2 <br> 稀有收藏品 |
| **Rogue (System)** | 红色警告色 + 锁链图标 | 系统生成 | 不可交易，战斗后销毁 |

### 4.2 交易大厅 (Marketplace)
*   **Prompt 交易**: 用户点击 NFT 的 "Reveal Prompt"，支付费用。
    *   *UI*: 模糊的文本块 -> 支付 -> 清晰文本 + "Copy" 按钮。
*   **Agent 脚本商店**: (后期规划) 允许大神上传 `.js` 或 `.py` 策略脚本，小白用户付费订阅自动执行。

---

## 5. 技术架构与数据结构

### 5.1 Database Schema (Prisma 扩展)

```prisma
// 记录战斗结果带来的资产变异
model NFTMutation {
  id          String    @id @default(cuid())
  nftId       String    @unique
  battleId    String
  outcome     String    // "CANONICAL" | "PARADOX"
  powerBonus  Float     // e.g., 1.1 (10% bonus)
  specialTrait String?  // e.g., "ChaosWalker"
  
  nft         BattleNFT @relation(fields: [nftId], references: [id])
}

// 技能释放记录 (用于审计和扣费)
model AgentActionLog {
  id          String   @id @default(cuid())
  battleId    String
  userId      String
  skillType   String   // "SCAN", "SNIPE"
  cost        Int
  targetId    String?  // 目标 NFT ID
  timestamp   DateTime @default(now())
}

// 经济快照 (用于每场战斗后的结算审计)
model BattleLedger {
  id             String @id @default(cuid())
  battleId       String @unique
  totalPool      Int
  winnerPool     Int    // 70%
  loserPool      Int    // 25%
  systemFee      Int    // 5%
  settled        Boolean @default(false)
}
```

### 5.2 结算算法伪代码 (Settlement Logic)

```typescript
function settleBattle(battleId) {
  const pool = calculateTotalPool(battleId);
  const winnerShare = pool * 0.70;
  const loserShare = pool * 0.25;
  const systemShare = pool * 0.05;

  // 1. 系统抽成
  depositToTreasury(systemShare);

  // 2. 赢家结算
  const winners = getStakers(winningFaction);
  winners.forEach(user => {
    const principal = user.stake;
    const profit = (user.power / totalWinningPower) * (winnerShare - totalWinningPrincipal);
    transferTokens(user.id, principal + profit);
    mutateNFT(user.nftId, 'CANONICAL');
  });

  // 3. 输家结算
  const losers = getStakers(losingFaction);
  const totalLosingPrincipal = sum(losers.stake);
  losers.forEach(user => {
    // 按比例返还部分本金
    const rebate = (user.stake / totalLosingPrincipal) * loserShare;
    transferTokens(user.id, rebate);
    mutateNFT(user.nftId, 'PARADOX');
  });
}
```

---

## 6. 开发路线图 (Implementation Phases)

1.  **Phase 1: The Engine (后端)**
    *   实现 Paradox Topic 生成逻辑。
    *   实现 Agent API (Mint, Vote 接口)。
2.  **Phase 2: The Economy (智能合约/Ledger)**
    *   实现新的资金池分配逻辑（70/25/5）。
    *   集成 Agent 技能扣费系统。
3.  **Phase 3: The Mutation (前端/图像处理)**
    *   开发图像处理服务，用于生成 Canonical/Paradox 特效。
    *   更新 NFT Gallery UI。
4.  **Phase 4: Agent Wars (生态)**
    *   发布 SDK。
    *   举办第一届 "Bot Battle" 邀请赛。

