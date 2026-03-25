# 🇮🇳 印度产业占比图表 - 使用指标清单

## 📊 测试场景

**查询**: 印度不同产业增加值占 GDP 的比重（2010-2023）  
**数据源**: World Bank Data360 API (WDI 数据库)  
**国家**: India (IND)  
**年份范围**: 2010-2023（14 年）

---

## 📋 使用指标（4 个）

### 1. 农业（农林牧渔）

| 项目 | 内容 |
|------|------|
| **指标代码** | `WB_WDI_NV_AGR_TOTL_ZS` |
| **英文名称** | Agriculture, forestry, and fishing, value added (% of GDP) |
| **中文名称** | 农业、林业和渔业增加值占 GDP 比重 |
| **单位** | % of GDP |
| **数据来源** | World Bank national accounts data |
| **说明** | 对应 ISIC 第 1-5 类，包括农业、林业、畜牧业和渔业 |

**2010-2023 年数据**:
```
2010: 17.0%  →  2023: 16.2%  (变化：-0.8 个百分点 ↓)
```

---

### 2. 工业（含建筑业）

| 项目 | 内容 |
|------|------|
| **指标代码** | `WB_WDI_NV_IND_TOTL_ZS` |
| **英文名称** | Industry (including construction), value added (% of GDP) |
| **中文名称** | 工业增加值（含建筑业）占 GDP 比重 |
| **单位** | % of GDP |
| **数据来源** | World Bank national accounts data |
| **说明** | 对应 ISIC 第 10-43 类，包括采矿业、制造业、建筑业、公用事业等 |

**2010-2023 年数据**:
```
2010: 30.7%  →  2023: 25.3%  (变化：-5.4 个百分点 ↓)
```

---

### 3. 制造业

| 项目 | 内容 |
|------|------|
| **指标代码** | `WB_WDI_NV_IND_MANF_ZS` |
| **英文名称** | Manufacturing, value added (% of GDP) |
| **中文名称** | 制造业增加值占 GDP 比重 |
| **单位** | % of GDP |
| **数据来源** | World Bank national accounts data |
| **说明** | 对应 ISIC 第 10-33 类，包括所有制造业活动 |

**2010-2023 年数据**:
```
2010: 17.0%  →  2023: 13.0%  (变化：-4.0 个百分点 ↓)
```

---

### 4. 服务业

| 项目 | 内容 |
|------|------|
| **指标代码** | `WB_WDI_NV_SRV_TOTL_ZS` |
| **英文名称** | Services, value added (% of GDP) |
| **中文名称** | 服务业增加值占 GDP 比重 |
| **单位** | % of GDP |
| **数据来源** | World Bank national accounts data |
| **说明** | 对应 ISIC 第 45-99 类，包括批发零售、交通、金融、教育、医疗等所有服务业 |

**2010-2023 年数据**:
```
2010: 45.0%  →  2023: 49.5%  (变化：+4.5 个百分点 ↑)
```

---

## 📊 完整数据表格

| Year | Agriculture (%) | Industry (%) | Manufacturing (%) | Services (%) |
|------|-----------------|--------------|-------------------|--------------|
| 2010 | 17.0 | 30.7 | 17.0 | 45.0 |
| 2011 | 17.2 | 30.2 | 16.1 | 45.4 |
| 2012 | 16.8 | 29.4 | 15.8 | 46.3 |
| 2013 | 17.1 | 28.4 | 15.3 | 46.7 |
| 2014 | 16.8 | 27.7 | 15.1 | 47.8 |
| 2015 | 16.2 | 27.3 | 15.6 | 47.8 |
| 2016 | 16.4 | 26.6 | 15.2 | 47.7 |
| 2017 | 16.6 | 26.5 | 15.0 | 47.7 |
| 2018 | 16.0 | 26.4 | 14.9 | 48.4 |
| 2019 | 16.8 | 24.6 | 13.5 | 50.1 |
| 2020 | 18.7 | 25.1 | 14.1 | 47.9 |
| 2021 | 17.4 | 26.5 | 14.4 | 47.8 |
| 2022 | 16.5 | 25.4 | 13.1 | 49.7 |
| 2023 | 16.2 | 25.3 | 13.0 | 49.5 |

---

## 🔍 指标关系说明

### 产业结构分类

```
GDP = 农业 + 工业 + 服务业

其中：
- 工业 = 采矿业 + 制造业 + 建筑业 + 公用事业
- 制造业 ⊂ 工业（制造业是工业的子集）
```

### 数据验证

以 2023 年为例：
```
农业 (16.2%) + 工业 (25.3%) + 服务业 (49.5%) = 91.0%

注意：总和不等于 100% 的原因：
1. 产品税和补贴未计入
2. 统计误差
3. 其他未分类活动
```

---

## 📈 趋势分析

### 主要发现

1. **服务业主导**
   - 2019 年突破 50%
   - 13 年增长 4.5 个百分点
   - 反映印度经济向服务型转型

2. **工业占比下降**
   - 从 30.7% 降至 25.3%
   - 降幅 5.4 个百分点
   - 可能与制造业外流有关

3. **制造业萎缩**
   - 从 17.0% 降至 13.0%
   - "印度制造"倡议面临挑战
   - 2020 年疫情后有所反弹

4. **农业相对稳定**
   - 基本维持在 16-18%
   - 2020 年疫情期反弹至 18.7%
   - 仍是重要经济支柱

---

## 🌐 WDI 数据库元数据

### 数据来源
- **数据库**: World Development Indicators (WDI)
- **API**: World Bank Data360 API
- **更新频率**: 定期更新
- **数据质量**: 官方统计数据

### 指标分类体系
- **分类标准**: ISIC (International Standard Industrial Classification)
- **版本**: ISIC Rev.4
- **覆盖范围**: 全球 200+ 经济体
- **时间跨度**: 1960-2023（部分指标）

### 相关指标系列

**国民经济核算**:
- `NY.GDP.MKTP.CD` - GDP (current US$)
- `NY.GDP.MKTP.KD.ZG` - GDP growth (annual %)
- `NY.GDP.PCAP.CD` - GDP per capita (current US$)

**其他产业相关**:
- `NV.AGR.TOTL.KD.ZG` - Agriculture value added (annual % growth)
- `NV.IND.TOTL.KD.ZG` - Industry value added (annual % growth)
- `NV.SRV.TOTL.KD.ZG` - Services value added (annual % growth)

---

## 📝 使用这些指标的代码示例

```javascript
const WorldBankAnalyzer = require('./src/index');
const analyzer = new WorldBankAnalyzer();

// 查询印度农业占比
const agriculture = await analyzer.query({
  countries: ['IND'],
  indicator: 'WB_WDI_NV_AGR_TOTL_ZS',
  years: [2010, 2023]
});

// 查询印度工业占比
const industry = await analyzer.query({
  countries: ['IND'],
  indicator: 'WB_WDI_NV_IND_TOTL_ZS',
  years: [2010, 2023]
});

// 查询印度制造业占比
const manufacturing = await analyzer.query({
  countries: ['IND'],
  indicator: 'WB_WDI_NV_IND_MANF_ZS',
  years: [2010, 2023]
});

// 查询印度服务业占比
const services = await analyzer.query({
  countries: ['IND'],
  indicator: 'WB_WDI_NV_SRV_TOTL_ZS',
  years: [2010, 2023]
});

// 生成完整报告（包含所有 4 个指标）
const chart = await analyzer.chart({
  countries: ['IND'],
  indicator: 'WB_WDI_NV_AGR_TOTL_ZS',  // 主指标
  years: [2010, 2023],
  title: 'India: Value Added by Sector (% of GDP)',
  subtitle: 'Source: World Bank, World Development Indicators'
});

fs.writeFileSync('india_sector_share.html', chart.chart);
```

---

## 🔗 相关链接

- **WDI 数据库**: https://data.worldbank.org/indicator
- **农业占比**: https://data.worldbank.org/indicator/NV.AGR.TOTL.ZS
- **工业占比**: https://data.worldbank.org/indicator/NV.IND.TOTL.ZS
- **制造业占比**: https://data.worldbank.org/indicator/NV.IND.MANF.ZS
- **服务业占比**: https://data.worldbank.org/indicator/NV.SRV.TOTL.ZS
- **Data360 API**: https://data360api.worldbank.org

---

**生成时间**: 2026-03-25  
**数据来源**: World Bank WDI  
**指标数量**: 4 个  
**数据年份**: 2010-2023
