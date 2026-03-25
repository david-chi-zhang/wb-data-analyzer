# 📊 HTML 输出规范（IMF WEO 标准范式）

## 🎯 标准定位

World Bank Data360 Analyzer 的 HTML 输出采用 **IMF WEO（World Economic Outlook）标准范式**，确保专业、简洁、数据驱动的设计风格。

---

## 📋 设计规范

### 1. 整体布局

```
┌─────────────────────────────────────────────────────────────┐
│  [标题]                                      [CSV] [PNG]    │
│  [副标题/数据来源]                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    [交互式图表区域]                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [数据表格]（可选）                                          │
├─────────────────────────────────────────────────────────────┤
│  [页脚：生成工具 + 日期]                                     │
└─────────────────────────────────────────────────────────────┘
```

### 2. 视觉风格

| 元素 | 规范 |
|------|------|
| **背景色** | `#f5f5f5`（页面）、`#ffffff`（容器） |
| **字体** | `"Segoe UI", Arial, sans-serif` |
| **主标题** | 20px, 600, `#1a1a1a` |
| **副标题** | 13px, 400, `#666666` |
| **边框** | `1px solid #e0e0e0` |
| **按钮** | 白色背景、灰色边框、悬停浅灰 |
| **图表** | 直线（非平滑）、虚线网格 |
| **表格** | 右对齐数值、偶数行`#fafafa` |

### 3. 颜色方案

**图表系列颜色**（ECharts 默认）：
- 蓝色：`#5470c6`
- 绿色：`#91cc75`
- 橙色：`#fac858`
- 红色：`#ee6666`
- 青色：`#3ba272`
- 紫色：`#9a60b4`

---

## 🔧 技术规格

### 1. HTML 结构

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
  <style>
    /* IMF WEO 风格 CSS */
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <div class="title">{title}</div>
        <div class="subtitle">{subtitle}</div>
      </div>
      <div class="header-right">
        <button class="btn" onclick="downloadCSV()">Download CSV</button>
        <button class="btn" onclick="downloadPNG()">Download PNG</button>
      </div>
    </div>
    
    <div class="chart-container">
      <div id="chart"></div>
    </div>
    
    <div class="table-section">
      <!-- 数据表格 -->
    </div>
    
    <div class="footer">
      Generated with World Bank Data360 Analyzer | {date}
    </div>
  </div>
  
  <script>
    // ECharts 配置
    // Download CSV/PNG 函数
  </script>
</body>
</html>
```

### 2. ECharts 配置规范

```javascript
const option = {
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
    textStyle: { color: '#333', fontSize: 12 }
  },
  legend: {
    bottom: 0,
    textStyle: { fontSize: 12 },
    itemWidth: 14,
    itemHeight: 14
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '15%',
    top: '5%'
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisLine: { lineStyle: { color: '#e0e0e0' } },
    axisLabel: { color: '#666', fontSize: 11 },
    axisTick: { show: false }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisLabel: { color: '#666', fontSize: 11 },
    splitLine: { lineStyle: { color: '#e0e0e0', type: 'dashed' } }
  },
  series: [{
    type: 'line',
    smooth: false,  // IMF 风格：直线
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: { width: 2 }
  }]
};
```

### 3. 导出功能实现

**CSV 导出**：
```javascript
function downloadCSV() {
  const csvContent = generateCSV(data, years);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = generateFilename('csv');
  link.click();
}
```

**PNG 导出**：
```javascript
function downloadPNG() {
  const canvas = document.querySelector('#chart canvas');
  const link = document.createElement('a');
  link.download = generateFilename('png');
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}
```

---

## 📊 数据表格规范

### 格式要求

| 要求 | 规范 |
|------|------|
| **表头** | 浅灰背景 `#f8f9fa`，加粗字体 |
| **年份列** | 左对齐，加粗，`#1a1a1a` |
| **数据列** | 右对齐，保留 1 位小数 |
| **缺失值** | 显示 `n.a.` |
| **行背景** | 偶数行 `#fafafa`，奇数行 `#ffffff` |
| **悬停** | 浅灰背景 `#f8f9fa` |
| **边框** | `1px solid #e0e0e0` |

### 示例

```html
<table class="data-table">
  <thead>
    <tr>
      <th>Year</th>
      <th>Agriculture</th>
      <th>Industry</th>
      <th>Manufacturing</th>
      <th>Services</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="year">2010</td>
      <td>17.0</td>
      <td>30.7</td>
      <td>17.0</td>
      <td>45.0</td>
    </tr>
    <!-- 更多年份 -->
  </tbody>
</table>
```

---

## 📱 响应式设计

### 断点

- **桌面端**: `> 768px`
- **移动端**: `≤ 768px`

### 移动端适配

```css
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
  }
  .header-right {
    width: 100%;
    justify-content: flex-end;
  }
  #chart { height: 400px; }  /* 降低高度 */
  .data-table { font-size: 11px; }
}
```

---

## 🎯 使用场景

### 1. 经济分析报告
- 导出 PNG 插入 Word/PPT
- 导出 CSV 进行进一步分析
- 专业外观符合国际标准

### 2. 学术研究
- 数据表格可直接引用
- 图表符合学术出版标准
- 可重复性强

### 3. 政策简报
- 简洁清晰的设计
- 一键导出便于分享
- 移动端友好

### 4. 媒体报道
- 高质量 PNG 适合印刷
- 数据来源清晰标注
- 专业可信

---

## 🔄 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2026-03-25 | 初始版本（基础图表） |
| 1.1.0 | 2026-03-25 | 添加 CSV/PNG 导出功能 |
| 1.2.0 | 2026-03-25 | **采用 IMF WEO 标准范式** |

---

## ✅ 检查清单

生成 HTML 前请确认：

- [ ] 标题为英文（国际标准）
- [ ] 包含数据来源标注
- [ ] 图表为直线（非平滑）
- [ ] 包含 Download CSV 按钮
- [ ] 包含 Download PNG 按钮
- [ ] 表格数值右对齐
- [ ] 响应式设计正常
- [ ] 页脚包含生成日期

---

## 📝 示例代码

```javascript
const WorldBankAnalyzer = require('./src/index');
const analyzer = new WorldBankAnalyzer();

// 生成 IMF WEO 风格 HTML
const result = await analyzer.chart({
  countries: ['IND'],
  indicator: 'WB_WDI_NV_AGR_TOTL_ZS',
  years: [2010, 2023],
  title: 'India: Agriculture Value Added (% of GDP)',
  subtitle: 'Source: World Bank, World Development Indicators'
});

// 保存
fs.writeFileSync('india_agriculture.html', result.chart);
```

---

**标准版本**: IMF WEO 1.2.0  
**最后更新**: 2026-03-25  
**维护者**: World Bank Data360 Analyzer Team
