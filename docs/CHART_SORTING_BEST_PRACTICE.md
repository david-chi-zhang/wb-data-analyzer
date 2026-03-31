# 图表排序最佳实践

## 🐛 历史错误记录

**日期**: 2026-03-31  
**问题**: 图表中时间序列线条混乱、来回跳跃  
**影响**: 用户无法正确解读数据趋势

---

## ⚠️ 问题根因

### 症状
- 折线图中每个国家的线条绕来绕去
- 数据点没有按时间顺序连接
- 图表看起来混乱、不专业

### 根本原因
1. **JavaScript 字符串排序陷阱**
   ```javascript
   // ❌ 错误：默认字符串排序
   const years = [2010, 2011, ..., 2019, 2020, 2021].sort();
   // 结果：2010, 2011, ..., 2019, 2020, 2021（看起来对，但实际按字符串比较）
   
   // ❌ 更明显的错误示例
   [2, 10, 1].sort();  // 结果：[1, 10, 2]
   ```

2. **API 返回数据未排序**
   - World Bank Data360 API 返回的数据不保证按年份排序
   - 直接使用会导致数据点乱序

---

## ✅ 正确做法

### 1. 年份数组排序（chart.js）

```javascript
// ✅ 正确：使用数字比较函数
const years = Array.from(allYears).sort((a, b) => a - b);

// ❌ 错误：默认字符串排序
const years = Array.from(allYears).sort();
```

### 2. 数据点排序（index.js）

```javascript
// ✅ 正确：在格式化结果时，对每个国家的数据按年份排序
for (const country of Object.keys(grouped)) {
  grouped[country].data.sort((a, b) => a.year - b.year);
}
```

### 3. 完整修复代码

**src/viz/chart.js** (第 38 行):
```javascript
const allYears = new Set();
result.data.forEach(d => d.data.forEach(item => allYears.add(item.year)));
const years = Array.from(allYears).sort((a, b) => a - b);  // 数字排序
```

**src/index.js** (第 340 行后):
```javascript
// 对每个国家的数据按年份排序
for (const country of Object.keys(grouped)) {
  grouped[country].data.sort((a, b) => a.year - b.year);
}
```

---

## 📋 检查清单

在生成时间序列图表前，务必确认：

- [ ] 年份数组使用数字排序 `(a, b) => a - b`
- [ ] 每个国家的数据点按年份升序排列
- [ ] 测试边界情况：跨十年（2019→2020→2021）
- [ ] 测试不完整数据：某些年份缺失时排序仍正确
- [ ] 可视化验证：线条平滑、无交叉跳跃

---

## 🔍 调试技巧

### 1. 打印排序前后的数据
```javascript
console.log('Before sort:', data.map(d => d.year));
data.sort((a, b) => a.year - b.year);
console.log('After sort:', data.map(d => d.year));
```

### 2. 检查年份类型
```javascript
console.log(typeof years[0]);  // 应该是 'number'
```

### 3. 可视化验证
- 打开生成的 HTML 文件
- 鼠标悬停查看每个数据点的年份和数值
- 确认线条从左到右按时间顺序延伸

---

## 📚 相关资源

- [JavaScript Array.sort() 陷阱](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [ECharts 时间轴配置](https://echarts.apache.org/zh/option.html#xAxis.type)

---

## 🎯 教训总结

1. **永远不要假设 API 返回的数据已排序**
2. **JavaScript 的 sort() 默认是字符串排序**
3. **时间序列数据必须在绘图前显式排序**
4. **图表生成后要人工验证视觉效果**

---

*最后更新：2026-03-31*
