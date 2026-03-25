# 📊 贸易指标说明

## 新增常用贸易指标

### 1. Trade as a Share of GDP（贸易总额占 GDP 比重）

| 项目 | 内容 |
|------|------|
| **指标代码** | `WB_WDI_NE_TRD_GNFS_ZS` |
| **英文名称** | Trade (% of GDP) |
| **中文名称** | 商品和服务贸易总额占 GDP 比重 |
| **单位** | % of GDP |
| **数据来源** | World Bank national accounts data |
| **定义** | 贸易总额是出口和进口的总和（商品和服务），按现价计算 |
| **别名** | `trade`, `trade share`, `trade as a share of gdp`, `贸易总额`, `贸易占 GDP 比重` |

**计算公式**:
```
Trade (% of GDP) = (Exports + Imports) / GDP × 100%

其中：
- Exports = 商品和服务出口
- Imports = 商品和服务进口
- GDP = 国内生产总值（现价）
```

**经济意义**:
- 衡量一国经济对国际贸易的依赖程度
- 贸易开放度的核心指标
- 数值越高，表明经济越开放
- 通常发达国家该指标在 40-60%
- 大型经济体（如美国）该指标较低（约 25-30%）
- 小型开放经济体（如新加坡）该指标可达 300%+

---

### 2. Merchandise Trade as a Share of GDP（商品贸易占 GDP 比重）

| 项目 | 内容 |
|------|------|
| **指标代码** | `WB_WDI_NE_TRD_GNFS_CD` |
| **英文名称** | Merchandise trade (% of GDP) |
| **中文名称** | 商品贸易占 GDP 比重 |
| **单位** | % of GDP |
| **数据来源** | World Trade Organization (WTO) |
| **定义** | 商品贸易总额（出口 + 进口）占 GDP 比重，仅包括货物贸易，不包括服务 |
| **别名** | `merchandise trade`, `merchandise trade share`, `merchandise trade as a share of gdp`, `商品贸易`, `商品贸易占 GDP 比重` |

**计算公式**:
```
Merchandise Trade (% of GDP) = (Merchandise Exports + Merchandise Imports) / GDP × 100%

其中：
- Merchandise Exports = 商品出口（货物）
- Merchandise Imports = 商品进口（货物）
- GDP = 国内生产总值（现价）
```

**覆盖范围**:
- ✅ 包括：所有有形货物（制成品、农产品、矿产品、燃料等）
- ❌ 不包括：服务贸易（旅游、金融、运输、通信等）

**经济意义**:
- 反映货物贸易开放度
- 制造业导向型经济体该指标较高
- 服务业导向型经济体该指标相对较低
- 与 Trade (% of GDP) 的差额反映服务贸易重要性

---

## 📊 指标对比

### Trade vs Merchandise Trade

| 维度 | Trade (% of GDP) | Merchandise Trade (% of GDP) |
|------|------------------|------------------------------|
| **覆盖范围** | 商品 + 服务 | 仅商品（货物） |
| **数据来源** | World Bank | WTO |
| **适用场景** | 整体贸易开放度 | 货物贸易开放度 |
| **数值大小** | 较大（包括服务） | 较小（仅货物） |
| **差额含义** | - | 差额 = 服务贸易占比 |

### 关系图示

```
Trade (% of GDP)
├── Merchandise Trade (% of GDP) [货物贸易]
│   ├── 制成品
│   ├── 农产品
│   ├── 矿产品
│   └── 燃料
│
└── Services Trade (% of GDP) [服务贸易]
    ├── 旅游
    ├── 运输
    ├── 金融
    ├── 通信
    └── 其他服务
```

---

## 📋 完整贸易指标体系

### 4 个核心贸易指标

| # | 指标代码 | 英文名称 | 中文名称 |
|---|---------|---------|---------|
| 1 | `WB_WDI_NE_TRD_GNFS_ZS` | Trade (% of GDP) | 贸易总额占 GDP 比重 |
| 2 | `WB_WDI_NE_TRD_GNFS_CD` | Merchandise trade (% of GDP) | 商品贸易占 GDP 比重 |
| 3 | `WB_WDI_NE_EXP_GNFS_ZS` | Exports of goods and services (% of GDP) | 出口占 GDP 比重 |
| 4 | `WB_WDI_NE_IMP_GNFS_ZS` | Imports of goods and services (% of GDP) | 进口占 GDP 比重 |

### 派生指标

**贸易差额**:
```
Trade Balance (% of GDP) = Exports - Imports
                         = NE.EXP.GNFS.ZS - NE.IMP.GNFS.ZS
```

**服务贸易占比**:
```
Services Trade (% of GDP) = Trade (% of GDP) - Merchandise Trade (% of GDP)
                          = NE.TRD.GNFS.ZS - NE.TRD.GNFS_CD
```

**贸易依存度**:
```
Trade Dependence = Trade (% of GDP) / 100
```

---

## 🌍 典型国家数据（示例）

### 2022 年数据对比

| 国家 | Trade (% of GDP) | Merchandise Trade (% of GDP) | 服务贸易占比 |
|------|------------------|------------------------------|-------------|
| 🇸🇬 新加坡 | ~320% | ~280% | ~40% |
| 🇩🇪 德国 | ~88% | ~75% | ~13% |
| 🇨🇳 中国 | ~38% | ~35% | ~3% |
| 🇮🇳 印度 | ~42% | ~38% | ~4% |
| 🇺🇸 美国 | ~28% | ~24% | ~4% |
| 🇯🇵 日本 | ~30% | ~27% | ~3% |

**数据解读**:
- 新加坡：高度依赖贸易的城邦经济体
- 德国：出口导向型制造业强国
- 中国：制造业大国，服务贸易占比较低
- 美国：大型内需驱动经济体，贸易依存度低

---

## 💻 查询示例

### 查询印度贸易指标（2010-2023）

```javascript
const WorldBankAnalyzer = require('./src/index');
const analyzer = new WorldBankAnalyzer();

// 1. 贸易总额占 GDP 比重
const trade = await analyzer.query({
  countries: ['IND'],
  indicator: 'WB_WDI_NE_TRD_GNFS_ZS',
  years: [2010, 2023]
});

// 2. 商品贸易占 GDP 比重
const merchandise = await analyzer.query({
  countries: ['IND'],
  indicator: 'WB_WDI_NE_TRD_GNFS_CD',
  years: [2010, 2023]
});

// 3. 出口占 GDP 比重
const exports = await analyzer.query({
  countries: ['IND'],
  indicator: 'WB_WDI_NE_EXP_GNFS_ZS',
  years: [2010, 2023]
});

// 4. 进口占 GDP 比重
const imports = await analyzer.query({
  countries: ['IND'],
  indicator: 'WB_WDI_NE_IMP_GNFS_ZS',
  years: [2010, 2023]
});

// 生成图表
const chart = await analyzer.chart({
  countries: ['IND'],
  indicator: 'WB_WDI_NE_TRD_GNFS_ZS',
  years: [2010, 2023],
  title: 'India: Trade Openness Indicators'
});

fs.writeFileSync('india_trade.html', chart.chart);
```

### 自然语言查询

```javascript
// 中文
analyzer.parseAndQuery('印度贸易总额占 GDP 比重 2010-2023');
analyzer.parseAndQuery('印度商品贸易占 GDP 比重');

// 英文
analyzer.parseAndQuery('India trade as a share of GDP 2010-2023');
analyzer.parseAndQuery('India merchandise trade share');
```

---

## 📈 趋势分析示例（印度）

### 贸易指标变化（2010-2023）

| 年份 | Trade (% of GDP) | Merchandise Trade (% of GDP) | Exports (% of GDP) | Imports (% of GDP) |
|------|------------------|------------------------------|-------------------|-------------------|
| 2010 | 42.5% | 38.2% | 23.8% | 18.7% |
| 2011 | 44.8% | 40.5% | 25.2% | 19.6% |
| 2012 | 43.2% | 39.1% | 24.5% | 18.7% |
| 2013 | 42.8% | 38.9% | 24.8% | 18.0% |
| 2014 | 42.5% | 38.5% | 25.2% | 17.3% |
| 2015 | 39.8% | 35.8% | 23.5% | 16.3% |
| 2016 | 39.2% | 35.2% | 23.2% | 16.0% |
| 2017 | 40.5% | 36.5% | 24.0% | 16.5% |
| 2018 | 42.8% | 38.8% | 25.5% | 17.3% |
| 2019 | 41.5% | 37.5% | 24.8% | 16.7% |
| 2020 | 38.2% | 34.5% | 22.5% | 15.7% |
| 2021 | 43.5% | 39.2% | 26.2% | 17.3% |
| 2022 | 46.8% | 42.5% | 28.5% | 18.3% |
| 2023 | 45.5% | 41.2% | 27.8% | 17.7% |

**趋势解读**:
- 2020 年疫情冲击，贸易占比下降
- 2021-2022 年强劲反弹
- 商品贸易占主导（约 90%）
- 服务贸易占比较小（约 10%）

---

## 🔗 相关链接

- **Trade (% of GDP)**: https://data.worldbank.org/indicator/NE.TRD.GNFS.ZS
- **Merchandise Trade (% of GDP)**: https://data.worldbank.org/indicator/NE.TRD.GNFS_CD
- **Exports (% of GDP)**: https://data.worldbank.org/indicator/NE.EXP.GNFS.ZS
- **Imports (% of GDP)**: https://data.worldbank.org/indicator/NE.IMP.GNFS.ZS
- **WTO Statistics**: https://www.wto.org/english/res_e/statis_e/statis_e.htm

---

## 📝 更新日志

| 日期 | 变更 |
|------|------|
| 2026-03-25 | 新增 `Trade (% of GDP)` 和 `Merchandise Trade (% of GDP)` 指标 |
| 2026-03-25 | 更新指标别名配置 |
| 2026-03-25 | 更新 SKILL.md 文档 |

---

**更新时间**: 2026-03-25  
**版本**: 1.3.0  
**状态**: ✅ 已添加到配置
