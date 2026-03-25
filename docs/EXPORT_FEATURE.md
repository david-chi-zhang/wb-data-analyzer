# 📥 导出功能说明

## ✅ 已添加功能

### Download CSV / Download PNG 按钮

IMF WEO 风格的 HTML 报告现在包含两个导出按钮，位于页面右上角：

1. **Download CSV** - 下载数据表格（CSV 格式）
2. **Download PNG** - 下载图表图片（PNG 格式）

---

## 🎨 按钮样式

```
┌─────────────────────────────────────────────────────────┐
│ India: Value Added by Sector (% of GDP)   [CSV] [PNG]  │
│ Source: World Bank, WDI                                 │
└─────────────────────────────────────────────────────────┘
```

### 视觉设计
- **位置**: 页面右上角（标题右侧）
- **样式**: 简洁白色按钮，灰色边框
- **图标**: SVG 图标（下载箭头 + 文件/图片）
- **交互**: 悬停时浅灰色背景 + 阴影
- **响应式**: 移动端自动换行到标题下方

---

## 📊 CSV 导出

### 功能特点
- ✅ 包含所有年份数据
- ✅ 包含所有国家/指标系列
- ✅ 数值保留 2 位小数
- ✅ 缺失数据显示为 "n.a."
- ✅ UTF-8 编码（支持多语言）

### 示例格式
```csv
Year,Agriculture,Industry,Manufacturing,Services
2010,17.03,30.72,17.03,45.03
2011,17.19,30.16,16.14,45.44
2012,16.85,29.40,15.82,46.30
...
```

### 文件命名
自动生成：`India_Value_Added_by_Sector_of_GDP.csv`

---

## 🖼️ PNG 导出

### 功能特点
- ✅ 高质量 PNG（1.0 质量）
- ✅ 包含完整图表（标题、图例、坐标轴）
- ✅ 透明背景
- ✅ 原始分辨率（1000x550px）

### 技术实现
```javascript
function downloadPNG() {
  const canvas = document.querySelector('#chart canvas');
  const link = document.createElement('a');
  link.download = 'Chart_Title.png';
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}
```

### 文件命名
自动生成：`India_Value_Added_by_Sector_of_GDP.png`

---

## 🔧 技术实现

### 1. 按钮 HTML
```html
<div class="header-right">
  <button class="btn" onclick="downloadCSV()">
    <svg>...</svg>
    Download CSV
  </button>
  <button class="btn" onclick="downloadPNG()">
    <svg>...</svg>
    Download PNG
  </button>
</div>
```

### 2. CSV 生成
```javascript
function _generateCSV(data, years) {
  const dataMap = {};
  // 构建数据映射
  data.forEach(d => {
    d.data.forEach(item => {
      if (!dataMap[item.year]) dataMap[item.year] = {};
      dataMap[item.year][d.countryName] = item.value;
    });
  });
  
  // 生成 CSV 字符串
  let csv = 'Year,' + countries.join(',') + '\n';
  for (const year of years) {
    const row = [year];
    for (const country of countries) {
      const value = dataMap[year]?.[country];
      row.push(value !== undefined ? value.toFixed(2) : 'n.a.');
    }
    csv += row.join(',') + '\n';
  }
  
  return csv;
}
```

### 3. 下载函数
```javascript
// CSV 下载
function downloadCSV() {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'filename.csv';
  link.click();
}

// PNG 下载
function downloadPNG() {
  const canvas = document.querySelector('#chart canvas');
  const link = document.createElement('a');
  link.download = 'filename.png';
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}
```

---

## 📱 响应式设计

### 桌面端（>768px）
```
┌──────────────────────────────────────────────┐
│ Title                          [CSV] [PNG]   │
│ Subtitle                                      │
└──────────────────────────────────────────────┘
```

### 移动端（≤768px）
```
┌─────────────────────────────┐
│ Title                       │
│ Subtitle                    │
│              [CSV] [PNG]    │
└─────────────────────────────┘
```

---

## 🎯 使用场景

### 1. 数据分析师
- 下载 CSV 进行进一步分析
- 导入 Excel/Python/R
- 制作自定义图表

### 2. 报告撰写
- 下载 PNG 插入 PPT/Word
- 高质量图片适合打印
- 保持专业外观

### 3. 数据分享
- CSV 便于同事复用
- PNG 便于社交媒体分享
- 无需原始数据访问权限

---

## 📁 生成文件

| 文件 | 大小 | 功能 |
|------|------|------|
| `india_imf_style.html` | 14KB | ✅ 包含 CSV/PNG 下载按钮 |
| `india_sector_report.html` | 15KB | 无下载按钮（旧版） |

---

## 🧪 测试验证

### 测试步骤
1. 在浏览器中打开 `india_imf_style.html`
2. 点击右上角 "Download CSV" 按钮
3. 验证 CSV 文件：
   - ✅ 文件名正确
   - ✅ 包含所有年份
   - ✅ 数据准确
   - ✅ 格式正确
4. 点击 "Download PNG" 按钮
5. 验证 PNG 文件：
   - ✅ 文件名正确
   - ✅ 图表完整
   - ✅ 清晰度高
   - ✅ 无裁剪

---

## 🔄 与其他格式对比

| 特性 | CSV | PNG | HTML |
|------|-----|-----|------|
| 可编辑数据 | ✅ | ❌ | ✅ |
| 可视化图表 | ❌ | ✅ | ✅ |
| 交互式 | ❌ | ❌ | ✅ |
| 易于分享 | ✅ | ✅ | ✅ |
| 适合打印 | ❌ | ✅ | ⚠️ |
| 文件大小 | 小 | 中 | 中 |

---

## 🚀 未来增强

### P1 - 高优先级
- [ ] Excel 导出（.xlsx 格式）
- [ ] PDF 导出（完整报告）
- [ ] 自定义年份范围
- [ ] 自定义指标选择

### P2 - 中优先级
- [ ] SVG 导出（矢量图）
- [ ] 批量下载（CSV+PNG 打包）
- [ ] 邮件分享功能
- [ ] 云存储集成

### P3 - 低优先级
- [ ] API 导出
- [ ] 定时自动导出
- [ ] 导出历史记录
- [ ] 自定义模板

---

## 📝 注意事项

### CSV 导出
- ⚠️ 数值格式：2 位小数
- ⚠️ 缺失数据：显示 "n.a."
- ⚠️ 编码：UTF-8（Excel 可能需要转换）

### PNG 导出
- ⚠️ 分辨率：固定 1000x550px
- ⚠️ 浏览器兼容性：需要 Canvas 支持
- ⚠️ 大图下载：可能需要几秒

### 浏览器兼容性
- ✅ Chrome/Edge（推荐）
- ✅ Firefox
- ✅ Safari
- ⚠️ IE11（不支持，已过时）

---

**更新时间**: 2026-03-25  
**版本**: 1.1.0  
**状态**: ✅ 生产就绪
