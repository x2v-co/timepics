# 🔑 获取 NFT.Storage API Key 指南

## ❌ 当前问题

你看到 "API Key is malformed or failed to parse" 错误，这是因为 `.env.local` 中的 API Key 还是占位符。

---

## ✅ 解决步骤

### Step 1: 访问 NFT.Storage

打开浏览器，访问：**https://nft.storage**

### Step 2: 注册账户

1. 点击右上角 **"Sign Up"** 或 **"Login"**
2. 可以使用以下方式注册：
   - 📧 Email
   - 🐙 GitHub 账户
   - 🦊 MetaMask 钱包

**推荐使用 GitHub**，最快捷！

### Step 3: 创建 API Key

登录后：

1. 点击顶部导航栏的 **"API Keys"**
2. 点击 **"+ New Key"** 按钮
3. 输入 Key 名称，例如：`TimePics Hackathon`
4. 点击 **"Create"**
5. **立即复制生成的 API Key**（只显示一次！）

**API Key 格式示例：**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweD...
```

### Step 4: 配置环境变量

1. 打开 `.env.local` 文件
2. 找到这一行：
   ```bash
   NFT_STORAGE_KEY=your_nft_storage_key_here
   ```
3. 替换为你的真实 API Key：
   ```bash
   NFT_STORAGE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweD...
   ```

**⚠️ 注意：**
- 不要有引号
- 不要有空格
- 直接粘贴整个 Key

### Step 5: 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

### Step 6: 测试

访问：http://localhost:3000/ipfs-test

点击 **"Check Status"**，应该显示 ✅ **Configured**

---

## 🎯 快速验证

运行以下命令验证配置：

```bash
# 查看环境变量（不会显示完整 Key）
echo $NFT_STORAGE_KEY

# 或者测试 API
curl http://localhost:3000/api/ipfs/test
```

**成功响应示例：**
```json
{
  "configured": true,
  "message": "IPFS is configured and ready ✅"
}
```

---

## 🆘 仍然有问题？

### 问题 1: "API Key is malformed"

**原因：** Key 格式不正确

**解决：**
- 确保复制完整的 Key
- 检查是否有多余的空格或换行符
- 重新创建一个新 Key

### 问题 2: 环境变量未加载

**解决：**
```bash
# 1. 确认 .env.local 在项目根目录
ls -la .env.local

# 2. 检查文件内容
cat .env.local | grep NFT_STORAGE_KEY

# 3. 重启开发服务器
npm run dev
```

### 问题 3: 403 Forbidden

**原因：** API Key 被撤销或无效

**解决：**
- 登录 NFT.Storage
- 删除旧 Key
- 创建新 Key

---

## 📸 可视化指南

### NFT.Storage Dashboard 截图位置

```
https://nft.storage
  ↓
登录后点击顶部 "API Keys"
  ↓
点击 "+ New Key"
  ↓
输入名称 "TimePics Hackathon"
  ↓
点击 "Create"
  ↓
⚡ 立即复制显示的 API Key！
```

---

## ✅ 验证成功标志

当配置正确后，你会看到：

**测试页面 (/ipfs-test):**
```
🔍 IPFS Configuration Status
✅ Configured
```

**上传测试:**
```
✅ Upload successful!
Image CID: bafybeibhw...
```

---

## 🎉 下一步

配置成功后，你可以：

1. ✅ 测试上传功能
2. ✅ 生成 AI 图片并上传到 IPFS
3. ✅ 使用 IPFS URLs 铸造 NFT

**API 使用示例：**
```bash
curl -X POST http://localhost:3000/api/generate-ipfs \
  -H "Content-Type: application/json" \
  -d '{
    "engine": "foresee",
    "prompt": "Cyberpunk Tokyo 2077"
  }'
```

---

**需要帮助？** 参考 `IPFS_IMPLEMENTATION.md` 获取更多详细信息。
