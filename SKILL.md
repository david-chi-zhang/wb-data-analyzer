# World Bank Data360 Analyzer

世界银行数据查询与分析工具，支持 WDI（World Development Indicators）数据库的快速查询、计算和可视化。

---

## 📌 功能特性

### 核心功能
- ✅ **数据查询** - 支持国家、指标、年份范围筛选
- ✅ **自然语言解析** - 中英文混合查询，自动识别意图
- ✅ **计算模块** - 增速、指数化、CAGR、加权平均
- ✅ **可视化** - 生成 IMF WEO 风格交互式 HTML 报告
- ✅ **指标定义** - 查询指标含义和来源
- ✅ **国家群组** - 预置金砖国家、NDB 成员国、收入分组等
- ✅ **数据导出** - Download CSV（数据表格）、Download PNG（图表图片）

### 预置国家群组
| 群组 | 关键词 | 说明 |
|------|--------|------|
| 金砖五国 | `brics_founding`, `金砖五国` | BRA, RUS, IND, CHN, ZAF |
| 金砖国家 | `brics`, `金砖国家` | 含 2024 年新成员（10 国） |
| NDB 成员国 | `ndb_members`, `NDB 成员国` | 新开发银行成员国（9 国） |
| G7 | `g7`, `七国集团` | 发达经济体 |
| G20 | `g20`, `二十国集团` | 主要经济体 |
| 高收入 | `high_income` | World Bank 高收入分类 |
| 中高收入 | `upper_middle_income` | 中高收入分类 |
| 中低收入 | `lower_middle_income` | 中低收入分类 |
| 低收入 | `low_income` | 低收入分类 |
| 地域分组 | `asia`, `europe`, `africa`, `americas` | 按大洲划分 |

### 核心指标（WDI）
| 类别 | 指标 | 代码 |
|------|------|------|
| **人口** | 总人口 | `SP.POP.TOTL` |
| | 人口增长率 | `SP.POP.GROW` |
| | 城镇化率 | `SP.URB.TOTL.IN.ZS` |
| **GDP** | GDP（现价美元） | `NY.GDP.MKTP.CD` |
| | GDP 增长率 | `NY.GDP.MKTP.KD.ZG` |
| | 人均 GDP | `NY.GDP.PCAP.CD` |
| **GNI** | 人均 GNI（阿特拉斯法） | `NY.GNP.PCAP.CD` |
| **产业占比** | 农业占 GDP 比重 | `NV.AGR.TOTL.ZS` |
| | 工业占 GDP 比重 | `NV.IND.TOTL.ZS` |
| | 制造业占 GDP 比重 | `NV.IND.MANF.ZS` |
| | 服务业占 GDP 比重 | `NV.SRV.TOTL.ZS` |
| **通胀** | CPI 通胀率 | `FP.CPI.TOTL.ZG` |
| **贸易** | 贸易总额占 GDP 比重 | `NE.TRD.GNFS.ZS` |
| | 商品贸易占 GDP 比重 | `NE.TRD.GNFS_CD` |
| | 出口占 GDP 比重 | `NE.EXP.GNFS.ZS` |
| | 进口占 GDP 比重 | `NE.IMP.GNFS.ZS` |
| **就业** | 失业率 | `SL.UEM.TOTL.ZS` |

---

## 🚀 快速开始

### 安装依赖
```bash
cd worldbank-analyzer
npm install axios
```

### 基本使用
```javascript
const WorldBankAnalyzer = require('./src/index');

const analyzer = new WorldBankAnalyzer({
  cacheDir: './data/cache',
  cacheEnabled: true,
  cacheTTL: 3600000  // 1 小时
});

// 1. 查询数据
const result = await analyzer.query({
  countries: ['CHN', 'USA', 'IND'],
  indicator: 'NY.GDP.MKTP.KD.ZG',  // GDP 增长率
  years: [2020, 2030]
});

// 2. 自然语言查询
const result = await analyzer.parseAndQuery('金砖五国 2020-2030 年 GDP 增速');

// 3. 生成图表
const chartResult = await analyzer.chart({
  countries: ['CHN', 'USA'],
  indicator: 'GDP growth',
  years: [2020, 2030],
  title: '中美 GDP 增速对比'
});

// 保存 HTML 文件
const fs = require('fs');
fs.writeFileSync('chart.html', chartResult.chart);

// 4. 查询指标定义
const definition = analyzer.getDefinition('SP.POP.TOTL');

// 5. 计算
const growth = analyzer.compute(result.data, 'growth', { country: 'CHN' });
const cagr = analyzer.compute(result.data, 'cagr', { 
  country: 'CHN',
  startYear: 2020,
  endYear: 2030
});
```

---

## 💬 使用示例

### 数据查询

```javascript
// 查询中国总人口
analyzer.query({
  countries: ['CHN'],
  indicator: 'SP.POP.TOTL'
});

// 查询 NDB 成员国人均 GNI
analyzer.query({
  countries: 'ndb_members',
  indicator: 'NY.GNP.PCAP.CD',
  years: [2020, 2030]
});

// 查询金砖国家各产业占 GDP 比重
analyzer.query({
  countries: 'brics',
  indicator: 'NV.AGR.TOTL.ZS',  // 农业
  years: [2020, 2030]
});
```

### 自然语言查询

```javascript
// 中文查询
analyzer.parseAndQuery('金砖五国 2020-2030 年 GDP 增速');
analyzer.parseAndQuery('NDB 成员国人均 GNI');
analyzer.parseAndQuery('中国农业占 GDP 比重');

// 英文查询
analyzer.parseAndQuery('BRICS GDP growth 2020-2030');
analyzer.parseAndQuery('population of China');
analyzer.parseAndQuery('manufacturing share of Germany');
```

### 图表生成（IMF WEO 风格）

```javascript
// 生成 IMF WEO 风格 HTML 报告
const result = await analyzer.chart({
  countries: 'brics_founding',
  indicator: 'NY.GDP.MKTP.KD.ZG',
  years: [2020, 2030],
  title: 'BRICS: GDP Growth Rate'
});

// 保存 HTML 文件
fs.writeFileSync('brics_gdp_growth.html', result.chart);
```

**HTML 输出标准（IMF WEO 范式）**：
- ✅ 简洁专业的设计风格（白色背景、灰色边框、Segoe UI 字体）
- ✅ 交互式 ECharts 图表（直线、非平滑）
- ✅ 完整数据表格（右对齐数值、偶数行浅灰背景）
- ✅ **Download CSV** 按钮 - 一键导出数据
- ✅ **Download PNG** 按钮 - 一键导出图表
- ✅ 响应式布局（支持移动端）
- ✅ 数据来源标注
- ✅ 英文标题和标签（国际标准）

**导出功能**：
- CSV：包含所有年份和指标系列，数值保留 2 位小数
- PNG：高质量图片（1000x550px），适合插入报告/PPT

### 计算功能

```javascript
// 计算增速
const growth = analyzer.compute(data, 'growth', { country: 'CHN' });

// 计算 CAGR
const cagr = analyzer.compute(data, 'cagr', {
  country: 'CHN',
  startYear: 2020,
  endYear: 2030
});
// 返回：{ cagr: 5.23, cagrFormatted: '5.23%' }

// 计算指数化
const index = analyzer.compute(data, 'index', {
  country: 'CHN',
  baseYear: 2020
});

// 计算加权平均（需要权重数据）
const weighted = analyzer.compute(data, 'weighted', weights);
```

### 查询指标定义

```javascript
// 通过代码查询
const def = analyzer.getDefinition('SP.POP.TOTL');
// 返回：{ code, name, name_cn, unit, definition, source }

// 通过名称查询
const def = analyzer.getDefinition('population');
```

### 列出可用指标/国家群组

```javascript
// 列出所有指标
const indicators = analyzer.listIndicators();

// 按类别筛选
const gdpIndicators = analyzer.listIndicators('gdp');

// 列出国家群组
const groups = analyzer.listCountryGroups();
```

---

## 📊 数据结构

### 查询结果
```javascript
{
  success: true,
  count: 150,
  data: [
    {
      country: 'CHN',
      indicator: 'NY.GDP.MKTP.KD.ZG',
      unit: '%',
      data: [
        { year: 2020, value: 2.24 },
        { year: 2021, value: 8.45 },
        { year: 2022, value: 2.99 }
      ]
    }
  ],
  metadata: {
    database: 'WB_WDI',
    indicator: 'NY.GDP.MKTP.KD.ZG',
    countries: ['CHN'],
    source: 'World Bank Data360',
    url: 'https://data.worldbank.org'
  }
}
```

### 计算结果（CAGR）
```javascript
{
  country: 'CHN',
  indicator: 'NY.GDP.MKTP.KD.ZG',
  type: 'cagr',
  startYear: 2020,
  endYear: 2030,
  cagr: 5.23,
  cagrFormatted: '5.23%'
}
```

---

## 🔧 配置选项

### 构造函数选项
```javascript
new WorldBankAnalyzer({
  cacheDir: './data/cache',      // 缓存目录
  cacheEnabled: true,             // 是否启用缓存
  cacheTTL: 3600000,              // 缓存有效期（毫秒）
  defaultDatabase: 'WB_WDI'       // 默认数据库
});
```

### API 客户端选项
```javascript
new Data360Client({
  baseUrl: 'https://data360api.worldbank.org',
  timeout: 30000,
  cacheDir: './data/cache',
  cacheEnabled: true,
  cacheTTL: 3600000
});
```

---

## 🎯 常用查询场景

### 1. 金砖国家经济对比
```javascript
// GDP 总量对比
analyzer.chart({
  countries: 'brics_founding',
  indicator: 'NY.GDP.MKTP.CD',
  years: [2020, 2030],
  title: '金砖五国 GDP 总量对比'
});

// 人均 GNI 对比
analyzer.chart({
  countries: 'brics_founding',
  indicator: 'NY.GNP.PCAP.CD',
  years: [2020, 2030]
});
```

### 2. NDB 成员国产业结构
```javascript
// 农业占比
analyzer.query({
  countries: 'ndb_members',
  indicator: 'NV.AGR.TOTL.ZS',
  years: [2020, 2030]
});

// 制造业占比
analyzer.query({
  countries: 'ndb_members',
  indicator: 'NV.IND.MANF.ZS',
  years: [2020, 2030]
});
```

### 3. 收入分组对比
```javascript
// 高收入 vs 中高收入 vs 中低收入 GDP 增速
const highIncome = await analyzer.query({
  countries: 'high_income',
  indicator: 'NY.GDP.MKTP.KD.ZG',
  years: [2020, 2030]
});

const upperMiddle = await analyzer.query({
  countries: 'upper_middle_income',
  indicator: 'NY.GDP.MKTP.KD.ZG',
  years: [2020, 2030]
});
```

### 4. 计算平均增速
```javascript
// 计算中国 2020-2030 年 GDP 平均增速（CAGR）
const data = await analyzer.query({
  countries: ['CHN'],
  indicator: 'NY.GDP.MKTP.CD',
  years: [2020, 2030]
});

const cagr = analyzer.compute(data.data, 'cagr', {
  country: 'CHN',
  startYear: 2020,
  endYear: 2030
});
```

---

## 📝 注意事项

1. **API 限制**：每页最多 1000 条记录，大量数据会自动分页
2. **缓存**：建议启用缓存减少 API 调用，TTL 默认 1 小时
3. **国家代码**：使用 ISO 3 字母代码（CHN, USA, IND 等）
4. **指标代码**：使用 WDI 标准代码（NY.GDP.MKTP.CD 等）
5. **数据更新**：WDI 数据定期更新，缓存可能不是最新
6. **⚠️ 图表排序（重要！）**：
   - **问题**: 时间序列图表中线条混乱、来回跳跃
   - **原因**: JavaScript `sort()` 默认是字符串排序；API 返回数据不保证有序
   - **修复**: 
     - 年份排序必须用 `(a, b) => a - b`（数字比较）
     - 每个国家的数据点必须按年份升序排序
   - **详见**: `docs/CHART_SORTING_BEST_PRACTICE.md`

---

## 🔗 相关链接

- [World Bank Data360](https://data.worldbank.org)
- [WDI 指标列表](https://data.worldbank.org/indicator)
- [API 文档](https://data360api.worldbank.org)

---

## 📦 文件结构

```
worldbank-analyzer/
├── SKILL.md                 # 本文档
├── package.json             # 依赖配置
├── src/
│   ├── index.js            # 主入口
│   ├── api/
│   │   └── client.js       # API 客户端
│   ├── query/
│   │   └── parser.js       # 查询解析器
│   ├── compute/
│   │   └── index.js        # 计算模块
│   └── viz/
│       └── chart.js        # 图表生成
├── data/
│   ├── aliases/
│   │   ├── countries.json  # 国家群组别名
│   │   └── indicators.json # 指标别名
│   └── cache/              # 缓存目录
└── examples/               # 示例代码
```
