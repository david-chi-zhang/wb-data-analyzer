# 缓存策略与性能优化

## 📊 缓存架构

```
┌─────────────────────────────────────────────────────────┐
│                   查询请求                                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  1. 元数据缓存 (data/metadata/)                          │
│     - indicators.json (指标列表，30 天)                    │
│     - countries.json (国家列表，30 天)                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  2. 数据缓存 (data/cache/)                               │
│     - 按查询参数自动缓存 (1 小时)                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  3. World Bank API                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🗂️ 缓存类型

### 1️⃣ 元数据缓存 (长期)

| 文件 | 内容 | 更新频率 | 大小估算 |
|------|------|----------|----------|
| `indicators.json` | 所有 WDI 指标定义 | 30 天 | ~500KB |
| `countries.json` | 所有经济体信息 | 30 天 | ~50KB |

**用途**:
- 指标代码验证
- 国家/地区名称解析
- 快速搜索和自动补全

### 2️⃣ 数据缓存 (短期)

| 内容 | 更新频率 | 说明 |
|------|----------|------|
| API 查询结果 | 1 小时 | 按查询参数自动缓存 |

**用途**:
- 避免重复 API 调用
- 加速相同查询

---

## 🔧 使用方法

### 更新元数据缓存

```bash
# 更新所有元数据
node scripts/update-cache.js

# 只更新指标列表
node scripts/update-cache.js indicators

# 只更新国家列表
node scripts/update-cache.js countries
```

### 程序化使用

```javascript
const cache = require('./src/cache/metadata');

// 获取指标列表（自动检查缓存）
const indicators = await cache.get('indicators', () => cache.fetchIndicators());

// 获取国家列表
const countries = await cache.get('countries', () => cache.fetchCountries());

// 强制刷新
cache.invalidate('indicators');
await cache.get('indicators', () => cache.fetchIndicators());
```

---

## ⏰ 定时更新建议

### 方案 1: Cron Job (推荐)

```bash
# 每月 1 号凌晨 2 点更新元数据
0 2 1 * * cd /path/to/wb-data-analyzer && node scripts/update-cache.js
```

### 方案 2: 启动时检查

```javascript
// 应用启动时自动检查缓存
const cache = require('./src/cache/metadata');
if (!cache.isCacheValid('indicators')) {
  await cache.refreshAll();
}
```

### 方案 3: 手动更新

在查询前检查缓存状态，如过期则提示用户更新。

---

## 📈 性能对比

| 操作 | 无缓存 | 有缓存 | 提升 |
|------|--------|--------|------|
| 指标搜索 | ~2 秒 | ~10ms | 200x |
| 国家解析 | ~1 秒 | ~5ms | 200x |
| 数据查询 | ~3 秒 | ~100ms* | 30x |

*首次查询仍需 API 调用，但后续相同查询直接命中缓存

---

## 🗑️ 缓存清理

```bash
# 删除所有缓存
rm -rf data/metadata/
rm -rf data/cache/

# 删除特定缓存
rm data/metadata/indicators.json
rm data/metadata/countries.json
```

---

## 📌 最佳实践

1. **首次使用时更新缓存** - 新环境首次运行会自动获取
2. **定期更新** - 建议每月更新一次元数据
3. **查询前检查** - 如缓存过期，提示用户更新
4. **错误处理** - API 失败时使用旧缓存（如有）

---

## 🔍 缓存内容示例

### indicators.json 结构

```json
{
  "all": [
    { "id": "NY.GDP.MKTP.CD", "name": "GDP (current US$)" },
    { "id": "NY.GDP.MKTP.PP.KD", "name": "GDP, PPP (constant 2017 international $)" }
  ],
  "byTopic": {
    "World Development Indicators": [...],
    "Public Sector": [...],
    "National Accounts": [...]
  },
  "count": 1435,
  "updatedAt": "2026-03-26T10:00:00.000Z"
}
```

### countries.json 结构

```json
{
  "all": [...],
  "singleCountries": [
    { "id": "CN", "iso2Code": "CN", "name": "China" },
    { "id": "US", "iso2Code": "US", "name": "United States" }
  ],
  "aggregates": [
    { "id": "EU", "name": "European Union" },
    { "id": "OE", "name": "OECD members" }
  ],
  "count": 271,
  "updatedAt": "2026-03-26T10:00:00.000Z"
}
```

---

**Updated**: 2026-03-26
