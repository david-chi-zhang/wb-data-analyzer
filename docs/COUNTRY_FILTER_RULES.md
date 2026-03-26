# World Bank 数据 - 国家/地区过滤规则

## 核心原则

**按 `country.id` 排除，不按名称过滤！**

---

## ❌ 错误方式（会导致误删）

```jq
# 错误：按国家名称过滤
map(select(.country.value | test("United|South|North|East|West"; "i") | not))
```

**问题**：
- 🇺🇸 **United States** → 被 `United` 误删
- 🇿🇦 **South Africa** → 被 `South` 误删
- 🇰🇵 **North Korea** → 被 `North` 误删
- 🇹🇱 **Timor-Leste (East)** → 被 `East` 误删
- 等等...

---

## ✅ 正确方式（按 country.id 排除）

```jq
map(select(
  .country.id as $id |
  # 排除 World Bank 聚合代码
  $id != "EU" and $id != "OE" and $id != "XC" and 
  $id != "XO" and $id != "XP" and $id != "XD" and $id != "XT" and $id != "XN" and $id != "XU" and $id != "XG" and $id != "XJ" and $id != "XQ" and $id != "XF" and $id != "XE" and $id != "XM" and $id != "XI" and $id != "XH" and $id != "XL" and
  $id != "ZT" and $id != "ZJ" and $id != "ZQ" and $id != "ZG" and $id != "ZF" and $id != "ZH" and $id != "ZI" and $id != "Z7" and $id != "Z4" and
  $id != "T5" and $id != "T2" and $id != "T3" and $id != "T6" and $id != "T7" and $id != "T4" and
  $id != "4E" and $id != "7E" and $id != "8S" and $id != "B8" and $id != "F1" and $id != "V4" and $id != "V3" and $id != "V2" and $id != "V1" and
  $id != "1W" and $id != "1A"
))
```

---

## 📋 排除代码分类表

| 前缀/代码 | 含义 | 示例 | 说明 |
|----------|------|------|------|
| **X*** | World Bank 收入/区域聚合 | XO, XP, XD, XT, XN, XU, XC, XG, XJ, XQ, XF, XE, XM, XI, XH, XL | 最常见的聚合代码 |
| **Z*** | 大区域聚合 | ZT, ZJ, ZQ, ZG, ZF, ZH, ZI, Z7, Z4 | 地理区域聚合 |
| **T*** | IDA/IBRD 区域聚合 | T5, T2, T3, T6, T7, T4 | 世行贷款项目区域分类 |
| **V*** | 人口红利阶段 | V4, V3, V2, V1 | Post/Late/Early/Pre-demographic dividend |
| **数字 + 字母** | 特殊聚合 | 1W, 1A, 4E, 7E, 8S, B8, F1 | World, Arab World, 区域排除高收入等 |
| **EU** | 欧盟 | European Union | 2 字母例外 |
| **OE** | 经合组织 | OECD members | 2 字母例外 |

---

## ✅ 保留的代码特征

**单一主权国家**：
- 2 字母 ISO 代码：`CN`, `US`, `IN`, `RU`, `JP`, `DE`, `BR`, `ID`, `FR`, `GB`, `IT`, `TR`, `MX`, `KR`, `ES`, `CA`, `SA`, `EG`, `NG`, `PL`, `AU`, `IR`, `BD`, `AR`, `CO`, `BE`, `KZ`, `DZ`, `IE`, `CL`, `IQ`, `AT`, `CZ`, `HK`, `IL`, `DK`, `GR`, `HU`, `ET`, `AO`, `FI`...

---

## 🔧 完整查询示例

```bash
curl -s "https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.PP.KD?format=json&per_page=600&date=2023:2024" | jq -r '
.[1] | 
map(select(.country.id != "" and .country.value != null and .value != null)) |
group_by(.country.id) | 
map(sort_by(.date) | reverse | .[0]) |
map(select(
  .country.id as $id |
  $id != "EU" and $id != "OE" and $id != "XC" and 
  $id != "XO" and $id != "XP" and $id != "XD" and $id != "XT" and $id != "XN" and $id != "XU" and $id != "XG" and $id != "XJ" and $id != "XQ" and $id != "XF" and $id != "XE" and $id != "XM" and $id != "XI" and $id != "XH" and $id != "XL" and
  $id != "ZT" and $id != "ZJ" and $id != "ZQ" and $id != "ZG" and $id != "ZF" and $id != "ZH" and $id != "ZI" and $id != "Z7" and $id != "Z4" and
  $id != "T5" and $id != "T2" and $id != "T3" and $id != "T6" and $id != "T7" and $id != "T4" and
  $id != "4E" and $id != "7E" and $id != "8S" and $id != "B8" and $id != "F1" and $id != "V4" and $id != "V3" and $id != "V2" and $id != "V1" and
  $id != "1W" and $id != "1A"
)) |
sort_by(.value) | reverse
'
```

---

## 📌 关键教训

1. **永远不要按名称过滤** - 名称包含常见词汇（United, South, North, East, West, Central...）
2. **按 country.id 过滤** - World Bank 的聚合代码有明确规律
3. **单一国家 = 2 字母 ISO 代码** - 这是最可靠的判断标准
4. **先观察数据规律** - 在写过滤规则前，先看看返回的数据结构

---

**Updated**: 2026-03-26  
**Source**: Indonesia GDP PPP ranking analysis
