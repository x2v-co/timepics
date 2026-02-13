# 🎮 NFT-Based Voting System

## ✅ 实现完成！

成功将统一Battle系统的投票机制升级为NFT铸造投票系统。

---

## 🎯 核心变更

### 旧系统（已移除）
- 直接投票，每轮只能投1票
- 投票奖励5个Arcade Token
- 每轮投票后不能再投

### 新系统（当前）
✨ **投票 = 铸造Battle NFT**
- 每次投票需要铸造1个Battle NFT
- 铸造成本：**100 Arcade Tokens**
- 用户可以**多次投票**（多次铸造NFT）
- 每个NFT自动质押到战斗中
- 每个NFT = 1票，拥有战斗力量值
- NFT潜在奖励：**150 Arcade Tokens**（如果选择的派系获胜）

---

## 🔄 投票流程

```
用户查看活跃Battle
  ↓
点击"Mint NFT to Vote"按钮
  ↓
检查Arcade Token余额（需要100）
  ↓
扣除100 Arcade Tokens
  ↓
铸造Battle NFT（带有图片、力量值、派系信息）
  ↓
NFT自动质押到Battle
  ↓
投票记录到Battle计数器
  ↓
用户可以继续铸造NFT投票（多次投票）
  ↓
Battle结束后，获胜方的NFT持有者获得奖励
```

---

## 📄 修改的文件

### 1. `/app/api/unified-battles/[id]/vote/route.ts` (完全重写)

**新增功能**：
- 检查用户Arcade Token余额
- 使用`spendTokens()`扣除100 tokens
- 调用`mintBattleNFT()`创建NFT
- 调用`stakeNFT()`自动质押
- 投票记录到controller
- 返回NFT信息和新余额

**关键代码**：
```typescript
const NFT_MINT_COST = 100;
const POTENTIAL_REWARD = 150;

// 检查余额
const balance = getArcadeBalance(userId);
if (balance.balance < NFT_MINT_COST) {
  return error with current balance and required amount
}

// 扣除tokens
const spendResult = spendTokens(userId, NFT_MINT_COST, ...);

// 铸造NFT
const nft = mintBattleNFT({
  userId, battleId, faction, factionName,
  battleTopic, imageUrl, engine, prompt, mintCost
});

// 自动质押
stakeNFT(nft.id, POTENTIAL_REWARD);

// 投票
controller.vote(userId, faction);
```

**API响应**：
```json
{
  "success": true,
  "message": "NFT minted and vote cast for ...",
  "nft": {
    "id": "nft-xxx",
    "name": "Faction Name - Battle NFT",
    "imageUrl": "https://...",
    "power": 100
  },
  "tokensSpent": 100,
  "newBalance": 450,
  "potentialReward": 150,
  "currentVotes": { "participantA": 5, "participantB": 3 }
}
```

### 2. `/app/unified-arena/[battleId]/page.tsx` (重大更新)

**新增导入**：
```typescript
import { getArcadeBalance } from '@/lib/arcade/tokenManager';
import { getBattleNFTs } from '@/lib/battleNFT';
import { Sparkles } from 'lucide-react';
```

**新增状态**：
```typescript
const [tokenBalance, setTokenBalance] = useState(0);
const [userNFTs, setUserNFTs] = useState<any[]>([]);
// 移除了 votedThisRound state
```

**新增UI组件**：

#### 用户钱包和统计卡片
```tsx
<Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700/50 mb-6">
  <CardContent className="pt-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Balance */}
      {/* Your NFTs */}
      {/* Voting Power */}
      {/* Mint Cost */}
    </div>
  </CardContent>
</Card>
```

显示内容：
- **Balance**: 当前Arcade Token余额
- **Your NFTs**: 用户在此战斗中铸造的NFT数量
- **Voting Power**: 所有NFT的总力量值
- **Mint Cost**: 单个NFT铸造成本（100 tokens）

#### 新的投票按钮
```tsx
<Button
  onClick={() => handleMintAndVote('A')}
  disabled={voting || tokenBalance < NFT_MINT_COST}
  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
>
  {voting ? 'Minting...' :
   tokenBalance < NFT_MINT_COST ? `Need ${NFT_MINT_COST} Tokens` :
   <>
     <Sparkles className="w-4 h-4 mr-2" />
     Mint NFT to Vote ({NFT_MINT_COST} tokens)
   </>
  }
</Button>
```

特性：
- 显示"Mint NFT to Vote (100 tokens)"
- 余额不足时显示"Need 100 Tokens"
- 铸造中显示"Minting..."
- 有Sparkles图标✨
- 按钮被禁用当余额不足或正在铸造

**新的handleMintAndVote函数**：
```typescript
const handleMintAndVote = async (faction: 'A' | 'B') => {
  // 检查余额
  if (tokenBalance < NFT_MINT_COST) {
    alert('Insufficient tokens');
    return;
  }

  // POST to /api/unified-battles/[id]/vote
  const response = await fetch(...);
  const data = await response.json();

  // 显示成功消息
  alert(`NFT Minted! Name, Power, Tokens spent, Potential reward`);

  // 刷新状态
  fetchBattleState();
  setTokenBalance(getArcadeBalance(userId).balance);
  setUserNFTs(getBattleNFTs(battleId).filter(...));
};
```

**参与者卡片新增字段**：
```tsx
{userNFTsA.length > 0 && (
  <div className="flex justify-between border-t border-gray-700 pt-2">
    <span className="text-gray-400">Your NFTs:</span>
    <span className="font-bold text-blue-400">{userNFTsA.length}</span>
  </div>
)}
```

---

## 💎 NFT属性

每个Battle NFT包含以下属性：

```typescript
{
  id: string;                 // 唯一ID
  owner: string;              // 用户ID
  battleId: string;           // 战斗ID
  faction: 'A' | 'B';        // 派系

  // 元数据
  name: string;              // "派系名 - Battle NFT"
  description: string;       // 战斗主题和派系
  imageUrl: string;          // 最新回合生成的图片
  engine: 'rewind' | 'refract' | 'foresee';
  prompt: string;

  // Living NFT属性
  mintDate: string;          // 铸造日期
  entropy: number;           // 0-100，随时间增加
  frozen: boolean;           // 是否冻结熵

  // 战斗属性
  power: number;             // 战斗力量（初始100）
  staked: boolean;           // 是否质押（自动质押）
  stakedAt: string;

  // 经济
  mintCost: 100;             // 铸造成本
  potentialReward: 150;      // 潜在奖励

  // 结果（战斗结束后）
  battleEnded: boolean;
  won?: boolean;             // 是否获胜
  reward?: number;           // 实际奖励
  badge?: 'canonical' | 'paradox';
}
```

---

## 🎨 用户界面更新

### Battle详情页顶部统计卡

```
┌─────────────────────────────────────────────────────────────┐
│  💰 Balance      ✨ Your NFTs    🛡️ Voting Power   ⚡ Mint Cost │
│     450              3              300              100     │
│  Arcade Tokens  Battle NFTs    Total Power      Per NFT    │
└─────────────────────────────────────────────────────────────┘
```

### 参与者卡片

```
┌─────────────────────────────────┐
│ 🏛️ Classical Rome               │
│ The Eternal Empire              │
├─────────────────────────────────┤
│ Total Votes:              15    │
│ Rounds Won:               2     │
│ Current Round:            5 votes│
│ Your NFTs:                2     │  ← 新增
├─────────────────────────────────┤
│ [ ✨ Mint NFT to Vote (100) ]   │  ← 新按钮
└─────────────────────────────────┘
```

---

## 🔥 用户体验流程

### 场景1: 用户有足够tokens

1. 用户查看Battle，看到"Mint NFT to Vote (100 tokens)"
2. 点击按钮
3. 扣除100 tokens
4. NFT铸造成功，显示弹窗：
   ```
   ✅ Battle NFT Minted!

   Classical Rome - Battle NFT
   Power: 100

   Vote cast for Classical Rome!

   Tokens spent: 100
   New balance: 350
   Potential reward: 150
   ```
5. 页面刷新，显示：
   - Balance: 350 (-100)
   - Your NFTs: 1 (+1)
   - Voting Power: 100 (+100)
   - 参与者A卡片显示"Your NFTs: 1"
6. 用户可以继续点击按钮**再次铸造NFT投票**

### 场景2: 用户tokens不足

1. 用户看到按钮显示"Need 100 Tokens"（按钮禁用）
2. 点击按钮（如果强制点击）显示：
   ```
   ❌ Insufficient Arcade Tokens!

   You have: 50 tokens
   Required: 100 tokens

   Earn more tokens by participating in battles!
   ```

### 场景3: 多次投票

1. 用户第1次铸造NFT → Balance: 400, Your NFTs: 1
2. 用户第2次铸造NFT → Balance: 300, Your NFTs: 2
3. 用户第3次铸造NFT → Balance: 200, Your NFTs: 3
4. 总投票力量 = 300 (3个NFT × 100 power)
5. 如果该派系获胜 → 每个NFT奖励150 tokens = 450 tokens总奖励
6. 净利润 = 450 - 300 = +150 tokens 🎉

---

## 💰 经济模型

### 成本
- 每个NFT铸造成本：**100 Arcade Tokens**
- 可以多次铸造（无限制）

### 奖励
- 获胜方每个NFT奖励：**150 Arcade Tokens**
- 净利润：**+50 tokens per NFT** (50% ROI)
- 失败方：**0 tokens** (失去100 tokens投资)

### 策略
- 多投 = 更高风险 + 更高回报
- 选对派系 = 赚钱
- 选错派系 = 亏损
- 鼓励用户认真分析Agent表现

### 示例
```
用户投注3个NFT到派系A：
  成本: 300 tokens

  如果派系A获胜:
    奖励: 3 × 150 = 450 tokens
    净利润: +150 tokens (50% ROI)

  如果派系A失败:
    奖励: 0 tokens
    净损失: -300 tokens
```

---

## 🧪 测试指南

### 测试步骤

1. **启动开发服务器**
   ```bash
   npm run dev
   open http://localhost:3000/unified-arena
   ```

2. **查看活跃Battle**
   - 进入任意活跃的battle详情页
   - 应该看到新的统计卡（Balance, NFTs, Power, Cost）

3. **测试投票**
   - 点击"Mint NFT to Vote (100 tokens)"
   - 确认弹窗显示NFT信息
   - 检查余额减少100
   - 检查"Your NFTs"增加1
   - 检查"Voting Power"增加100

4. **测试多次投票**
   - 再次点击按钮铸造第2个NFT
   - 再次点击按钮铸造第3个NFT
   - 确认可以多次投票
   - 检查NFT数量和力量值累加

5. **测试余额不足**
   - 在浏览器console清空余额：
     ```javascript
     localStorage.removeItem('timepics_arcade_balances');
     ```
   - 刷新页面，余额变为100（起始bonus）
   - 尝试投票，应该成功（100 tokens足够）
   - 再次投票，按钮应该变为"Need 100 Tokens"并禁用

6. **测试Battle结束后的奖励**
   - 等待Battle自然结束
   - 查看NFT Gallery（如果已实现）
   - 确认获胜方的NFT获得150 tokens奖励

---

## 📊 数据流

### 投票流程数据流

```
用户点击按钮
  ↓
handleMintAndVote(faction)
  ↓
POST /api/unified-battles/[id]/vote
  │
  ├─> getArcadeBalance(userId)  ← 检查余额
  │
  ├─> spendTokens(userId, 100, reason)  ← 扣除tokens
  │     └─> 更新localStorage
  │
  ├─> mintBattleNFT({ ... })  ← 铸造NFT
  │     └─> 保存到localStorage (timepics_battle_nfts)
  │
  ├─> stakeNFT(nftId, 150)  ← 自动质押
  │     └─> 更新NFT: staked=true, potentialReward=150
  │
  └─> controller.vote(userId, faction)  ← 记录投票
        └─> 更新battle.currentRoundVotes
  ↓
返回 { success, nft, tokensSpent, newBalance, ... }
  ↓
前端显示成功消息并刷新状态
```

---

## ✅ 实现清单

- ✅ 修改投票API为NFT铸造API
- ✅ 集成Battle NFT系统
- ✅ 集成Arcade Token扣费
- ✅ 自动质押NFT到战斗
- ✅ 更新UI显示token余额
- ✅ 更新UI显示用户NFT数量
- ✅ 更新UI显示总投票力量
- ✅ 新增"Mint NFT to Vote"按钮
- ✅ 移除单次投票限制（允许多次投票）
- ✅ 添加余额不足检查和提示
- ✅ 实时刷新余额和NFT数量
- ✅ 构建测试通过

---

## 🎉 总结

**NFT投票系统已完全实现！**

### 核心特性
- 🎨 **投票 = 铸造NFT**：每次投票都会创建一个独特的Battle NFT
- 💎 **Living NFT**：NFT拥有力量值、熵值、时间属性
- 🔄 **多次投票**：用户可以铸造多个NFT，每个NFT = 1票
- 💰 **代币经济**：100 tokens铸造，150 tokens潜在奖励
- 📊 **实时统计**：显示余额、NFT数量、投票力量
- ✨ **自动质押**：NFT铸造后自动质押到战斗
- 🎮 **游戏化**：用户需要策略性选择派系和投资额度

### 优势
- 更强的参与感（拥有NFT而不是简单投票）
- 增加token消费场景
- 鼓励用户认真分析battle
- 创建收藏价值（Battle NFT作为战斗纪念品）
- 与原有NFT Gallery系统完全兼容

### 兼容性
- ✅ 完全兼容Battle NFT系统
- ✅ 完全兼容Arcade Token系统
- ✅ 完全兼容UnifiedBattleController
- ✅ 保留所有原有battle功能

**Ready for Demo!** 🚀

---

## 📝 未来增强

可能的未来功能：
- NFT Gallery展示用户的所有Battle NFT
- NFT交易市场
- 稀有度系统（根据battle重要性、获胜难度）
- NFT合成（多个NFT合成更强大的NFT）
- 特殊徽章系统（连胜、完美预测等成就NFT）
- 链上铸造（当前为off-chain，可迁移到Solana）

