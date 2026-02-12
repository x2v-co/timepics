# 🚀 IPFS 快速开始指南

## ❌ 看到 "API Key is malformed" 错误？

这是正常的！你只需要获取一个免费的 NFT.Storage API Key。

---

## ⚡ 3 分钟快速设置

### 1️⃣ 获取 API Key (1 分钟)

访问：**https://nft.storage**

- 点击 "Sign Up" 或 "Login"
- 使用 GitHub 登录最快（推荐） or Email

登录后：
1. 点击顶部 **"API Keys"**
2. 点击 **"+ New Key"**
3. 名称填：`TimePics`
4. 点击 **"Create"**
5. **立即复制** 显示的 Key（只显示一次！）

### 2️⃣ 配置项目 (1 分钟)

打开 `.env.local` 文件，找到：

```bash
NFT_STORAGE_KEY=your_nft_storage_key_here
```

替换为你复制的 Key：

```bash
NFT_STORAGE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjow...
```

**⚠️ 重要：**
- ✅ 直接粘贴，不要引号
- ✅ 不要有空格或换行
- ✅ Key 很长（200+ 字符）是正常的

### 3️⃣ 重启服务器 (30 秒)

```bash
# 按 Ctrl+C 停止当前服务器
# 然后重新启动
npm run dev
```

### 4️⃣ 测试功能 (30 秒)

访问：**http://localhost:3000/ipfs-test**

点击：
1. **"Check Status"** → 应该显示 ✅ **Configured**
2. **"Upload Test Image"** → 应该显示成功消息和 IPFS CID

---

## ✅ 成功标志

看到以下内容说明配置成功：

```
🔍 IPFS Configuration Status
✅ Configured
```

```
✅ Upload successful!
Image CID: bafybeibhw...
Metadata CID: bafkreifjk...
```

---

## 🆘 常见问题

### Q: 我的 Key 在哪里？

**A:** 登录 https://nft.storage → 点击 "API Keys" → 查看已创建的 Key

### Q: 忘记复制 Key 了怎么办？

**A:** 删除旧 Key，创建新 Key，重新复制

### Q: 重启后还是报错？

**A:** 检查清单：
```bash
# 1. 确认 .env.local 文件存在
ls -la .env.local

# 2. 检查 Key 是否正确（显示前 20 个字符）
cat .env.local | grep NFT_STORAGE_KEY | cut -c1-40

# 3. 确保完全重启了服务器（Ctrl+C 然后 npm run dev）
```

### Q: Key 格式是什么样的？

**A:**
- ✅ 正确：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`（JWT 格式）
- ❌ 错误：`your_nft_storage_key_here`（占位符）
- ❌ 错误：`"eyJhbGci..."`（有引号）

---

## 📸 视觉指南

### NFT.Storage 页面位置

```
https://nft.storage
  ↓
登录 (GitHub/Email)
  ↓
顶部导航 "API Keys"
  ↓
"+ New Key" 按钮
  ↓
输入名称 "TimePics"
  ↓
"Create" 按钮
  ↓
⚡ 复制显示的 Key！
```

---

## 🎯 下一步

配置成功后，你可以：

### 测试上传

```bash
curl -X POST http://localhost:3000/api/ipfs/test
```

### 生成图片到 IPFS

```bash
curl -X POST http://localhost:3000/api/generate-ipfs \
  -H "Content-Type: application/json" \
  -d '{
    "engine": "foresee",
    "prompt": "Cyberpunk Tokyo 2077"
  }'
```

### 在代码中使用

```typescript
const response = await fetch('/api/generate-ipfs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    engine: 'foresee',
    prompt: 'Neon city in the future',
  }),
});

const data = await response.json();
console.log('IPFS Image URL:', data.ipfs.imageUrl);
```

---

## 💡 提示

- 🆓 **完全免费**：NFT.Storage 提供无限免费存储
- 🔒 **安全**：API Key 只在服务器端使用，不会暴露给前端
- ♾️ **永久**：上传到 IPFS 的内容永久存储
- 🌐 **去中心化**：符合 Web3 标准

---

## 📚 更多信息

- [详细实施指南](./IPFS_IMPLEMENTATION.md)
- [NFT.Storage 文档](https://nft.storage/docs/)
- [IPFS 官方文档](https://docs.ipfs.tech/)

---

**准备好了吗？** 访问 http://localhost:3000/ipfs-test 开始测试！
