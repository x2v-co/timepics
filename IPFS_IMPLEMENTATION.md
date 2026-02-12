# 🌐 IPFS 集成实施指南

**实施日期：** 2026-02-11
**状态：** ✅ Phase 1 完成 - 纯 IPFS (NFT.Storage)

---

## 📋 概述

TimePics.ai 现已集成 **NFT.Storage**，实现真正的去中心化图片存储。所有生成的图片和 NFT 元数据都将永久存储在 IPFS 网络上。

### 核心优势

- ✅ **完全免费**：NFT.Storage 提供免费的永久存储
- ✅ **真正 Web3**：使用 IPFS 内容寻址，符合 NFT 标准
- ✅ **永久存储**：内容通过 CID 永久可访问
- ✅ **抗审查**：去中心化，无单点故障

---

## 🚀 快速开始

### 1. 获取 NFT.Storage API Key

访问 [https://nft.storage](https://nft.storage)

1. 点击 "Sign Up" 注册账户
2. 登录后进入 "API Keys" 页面
3. 点击 "New Key" 创建新密钥
4. 复制生成的 API Key

### 2. 配置环境变量

编辑 `.env.local` 文件：

```bash
# NFT Storage Configuration (IPFS)
NFT_STORAGE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**注意：** 将 `your_nft_storage_key_here` 替换为你的真实 API Key

### 3. 重启开发服务器

```bash
npm run dev
```

---

## 🧪 测试 IPFS 集成

### 方法 1: 使用测试 API

```bash
# 检查 IPFS 状态
curl http://localhost:3000/api/ipfs/test

# 测试上传
curl -X POST http://localhost:3000/api/ipfs/test
```

**成功响应示例：**
```json
{
  "success": true,
  "message": "IPFS upload successful! ✅",
  "result": {
    "imageCID": "bafybeibhw...",
    "metadataCID": "bafkreifjk...",
    "imageUrl": "https://nftstorage.link/ipfs/bafybeibhw...",
    "metadataUrl": "https://nftstorage.link/ipfs/bafkreifjk..."
  }
}
```

### 方法 2: 使用浏览器

在浏览器中访问：
```
http://localhost:3000/api/ipfs/test
```

查看 IPFS 配置状态。

---

## 📝 API 使用指南

### 生成图片并上传到 IPFS

**端点：** `POST /api/generate-ipfs`

**请求体：**
```json
{
  "engine": "rewind",
  "prompt": "Victorian London street in 1880s",
  "era": "1880s",
  "aspectRatio": "16:9",
  "quality": "hd"
}
```

**响应示例：**
```json
{
  "success": true,
  "ipfs": {
    "imageCID": "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi",
    "metadataCID": "bafkreifjkpvx3jv6ucmkx5gtx5nlkqhqmcawtxlrgupkunvl5cq7lq45u4",
    "imageUrl": "https://nftstorage.link/ipfs/bafybeibhw...",
    "metadataUrl": "https://nftstorage.link/ipfs/bafkreifjk...",
    "imageIpfs": "ipfs://bafybeibhw...",
    "metadataIpfs": "ipfs://bafkreifjk..."
  },
  "metadata": {
    "engine": "rewind",
    "prompt": "Victorian London street in 1880s",
    "generatedAt": "2026-02-11T12:00:00.000Z"
  }
}
```

### 使用 cURL 测试

```bash
curl -X POST http://localhost:3000/api/generate-ipfs \
  -H "Content-Type: application/json" \
  -d '{
    "engine": "refract",
    "prompt": "Steampunk city with brass machinery",
    "era": "1900s"
  }'
```

---

## 🎨 前端集成示例

### React Component

```typescript
import { useState } from 'react';

function IPFSImageGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generateAndUpload = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-ipfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engine: 'foresee',
          prompt: 'Tokyo city in 2077',
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generateAndUpload} disabled={loading}>
        {loading ? 'Generating & Uploading...' : 'Generate to IPFS'}
      </button>

      {result?.success && (
        <div>
          <h3>✅ Upload Successful!</h3>
          <img src={result.ipfs.imageUrl} alt="Generated" />
          <p>Image CID: {result.ipfs.imageCID}</p>
          <a href={result.ipfs.metadataUrl} target="_blank">
            View Metadata
          </a>
        </div>
      )}
    </div>
  );
}
```

---

## 📊 IPFS URL 格式说明

### URL 类型

| 格式 | 示例 | 用途 |
|------|------|------|
| **IPFS 协议** | `ipfs://bafybeibhw...` | NFT 元数据标准（链上） |
| **HTTP 网关** | `https://nftstorage.link/ipfs/bafybeibhw...` | 浏览器访问 |

### 转换工具

```typescript
import { ipfsToHttpUrl, httpToIpfsUrl } from '@/lib/ipfs';

// IPFS -> HTTP
const httpUrl = ipfsToHttpUrl('bafybeibhw...');
// => https://nftstorage.link/ipfs/bafybeibhw...

// HTTP -> IPFS
const ipfsUrl = httpToIpfsUrl('https://nftstorage.link/ipfs/bafybeibhw...');
// => ipfs://bafybeibhw...
```

---

## ⚡ 性能优化

### 预期加载时间

| 场景 | 时间 |
|------|------|
| 首次访问 | 5-15 秒 |
| 网关缓存后 | 1-3 秒 |
| CDN 缓存 | < 500ms |

### 优化建议

1. **预加载提示**
   ```typescript
   <div className="text-sm text-muted-foreground">
     ⏳ IPFS content is propagating... (may take 10-30 seconds)
   </div>
   ```

2. **使用 Loading 状态**
   ```typescript
   {loading && <Spinner text="Uploading to IPFS network..." />}
   ```

3. **后备方案**
   ```typescript
   <img
     src={ipfsUrl}
     onError={() => setFallbackToPlaceholder(true)}
   />
   ```

---

## 🔍 故障排查

### 问题 1: "NFT_STORAGE_KEY not set"

**解决方案：**
1. 确认 `.env.local` 文件存在
2. 检查 `NFT_STORAGE_KEY` 是否设置
3. 重启开发服务器

### 问题 2: 图片加载缓慢

**原因：** IPFS 内容首次传播需要时间

**解决方案：**
1. 等待 10-30 秒
2. 使用多个网关：
   - `https://nftstorage.link/ipfs/`
   - `https://ipfs.io/ipfs/`
   - `https://cloudflare-ipfs.com/ipfs/`

### 问题 3: Upload 失败

**检查清单：**
```bash
# 1. 验证 API Key
curl http://localhost:3000/api/ipfs/test

# 2. 检查网络连接
ping nft.storage

# 3. 查看日志
# 开发服务器终端会显示详细错误
```

---

## 📈 使用统计

### NFT.Storage 免费配额

- **存储空间**：无限制
- **文件大小**：单个文件最大 32GB
- **上传速度**：无限制
- **带宽**：免费无限制

### 监控上传量

登录 [NFT.Storage Dashboard](https://nft.storage)：
- 查看已上传文件数量
- 查看总存储大小
- 查看 API 调用次数

---

## 🎯 下一步

### Phase 1 ✅ (当前)
- [x] 集成 NFT.Storage
- [x] 创建 IPFS 上传工具
- [x] 实现测试 API
- [x] 实现图片生成 + IPFS 上传

### Phase 2 🔄 (计划中)
- [ ] 前端 UI 集成
- [ ] 优化加载体验
- [ ] 添加上传进度显示
- [ ] 实现 NFT 铸造使用 IPFS 元数据

### Phase 3 🔮 (未来)
- [ ] 自定义 IPFS 网关
- [ ] Pin 管理界面
- [ ] 批量上传优化

---

## 📚 相关资源

- [NFT.Storage 文档](https://nft.storage/docs/)
- [IPFS 官方文档](https://docs.ipfs.tech/)
- [Solana NFT 标准](https://docs.metaplex.com/programs/token-metadata/overview)
- [TimePics.ai 主文档](./README.md)

---

## ❓ FAQ

**Q: IPFS 是否真的免费？**
A: 是的，NFT.Storage 由 Protocol Labs 运营，完全免费。

**Q: 数据会永久存储吗？**
A: 是的，NFT.Storage 使用 Filecoin 保证数据永久存储。

**Q: 为什么加载慢？**
A: IPFS 是分布式网络，首次访问需要从网络中查找内容。

**Q: 可以删除已上传的文件吗？**
A: 可以，但 IPFS 网络可能仍保留副本（去中心化特性）。

**Q: 生产环境需要付费吗？**
A: NFT.Storage 目前完全免费，未来可能推出付费计划。

---

**实施完成时间：** 2026-02-11
**文档版本：** 1.0
**维护者：** TimePics.ai Team
