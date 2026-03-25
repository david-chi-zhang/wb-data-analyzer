/**
 * World Bank Analyzer 使用示例
 */

const WorldBankAnalyzer = require('../src/index');
const fs = require('fs');
const path = require('path');

async function runExamples() {
  console.log('🌍 World Bank Data360 Analyzer - 使用示例\n');
  
  const analyzer = new WorldBankAnalyzer({
    cacheDir: path.join(__dirname, '../data/cache'),
    cacheEnabled: true
  });

  // ========== 示例 1: 查询金砖五国 GDP 总量 ==========
  console.log('📊 示例 1: 查询金砖五国 GDP 总量（2020-2030）');
  try {
    const result = await analyzer.query({
      countries: 'brics_founding',
      indicator: 'NY.GDP.MKTP.CD',
      years: [2020, 2030]
    });
    
    console.log(`✅ 查询成功，返回 ${result.count} 条记录`);
    console.log(`   国家数量：${result.data.length}`);
    result.data.forEach(country => {
      const latest = country.data[country.data.length - 1];
      console.log(`   - ${country.country}: ${latest.value.toFixed(2)} ${country.unit} (${latest.year}年)`);
    });
  } catch (err) {
    console.error('❌ 错误:', err.message);
  }
  console.log('');

  // ========== 示例 2: 自然语言查询 ==========
  console.log('💬 示例 2: 自然语言查询 - "NDB 成员国人均 GNI"');
  try {
    const parsed = analyzer.parse('NDB 成员国人均 GNI 2020-2030');
    console.log(`✅ 解析结果:`);
    console.log(`   动作：${parsed.action}`);
    console.log(`   国家：${parsed.countries.join(', ')}`);
    console.log(`   指标：${parsed.indicator}`);
    console.log(`   年份：${parsed.years?.join('-')}`);
    
    const result = await analyzer.query({
      countries: parsed.countries,
      indicator: parsed.indicator,
      years: parsed.years
    });
    
    console.log(`✅ 查询成功，返回 ${result.count} 条记录`);
  } catch (err) {
    console.error('❌ 错误:', err.message);
  }
  console.log('');

  // ========== 示例 3: 生成图表 ==========
  console.log('📈 示例 3: 生成图表 - 中美 GDP 增速对比');
  try {
    const result = await analyzer.chart({
      countries: ['CHN', 'USA'],
      indicator: 'NY.GDP.MKTP.KD.ZG',
      years: [2020, 2030],
      title: '中国 vs 美国 GDP 增长率对比'
    });
    
    const outputPath = path.join(__dirname, 'china_usa_gdp_growth.html');
    fs.writeFileSync(outputPath, result.chart);
    console.log(`✅ 图表已生成：${outputPath}`);
    console.log(`   在浏览器中打开查看交互式图表`);
  } catch (err) {
    console.error('❌ 错误:', err.message);
  }
  console.log('');

  // ========== 示例 4: 计算 CAGR ==========
  console.log('🧮 示例 4: 计算 CAGR - 中国 GDP 年均增速');
  try {
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
    
    console.log(`✅ CAGR 计算结果:`);
    console.log(`   国家：${cagr.country}`);
    console.log(`   时期：${cagr.startYear}-${cagr.endYear}`);
    console.log(`   年均增速：${cagr.cagrFormatted}`);
  } catch (err) {
    console.error('❌ 错误:', err.message);
  }
  console.log('');

  // ========== 示例 5: 查询指标定义 ==========
  console.log('📖 示例 5: 查询指标定义');
  const definition = analyzer.getDefinition('NY.GNP.PCAP.CD');
  console.log(`✅ 指标定义:`);
  console.log(`   代码：${definition.code}`);
  console.log(`   名称：${definition.name}`);
  console.log(`   中文：${definition.name_cn}`);
  console.log(`   单位：${definition.unit}`);
  console.log(`   定义：${definition.definition || '暂无'}`);
  console.log('');

  // ========== 示例 6: 列出国家群组 ==========
  console.log('🌐 示例 6: 列出可用国家群组');
  const groups = analyzer.listCountryGroups();
  console.log(`✅ 共 ${groups.length} 个国家群组:`);
  groups.slice(0, 10).forEach(group => {
    console.log(`   - ${group.name} (${group.count}国)`);
  });
  if (groups.length > 10) {
    console.log(`   ... 还有 ${groups.length - 10} 个群组`);
  }
  console.log('');

  // ========== 示例 7: 列出指标 ==========
  console.log('📋 示例 7: 列出 GDP 相关指标');
  const indicators = analyzer.listIndicators('gdp');
  console.log(`✅ 共 ${indicators.length} 个 GDP 相关指标:`);
  indicators.forEach(ind => {
    console.log(`   - ${ind.code}: ${ind.name_cn} (${ind.unit})`);
  });
  console.log('');

  // ========== 示例 8: 缓存统计 ==========
  console.log('💾 示例 8: 缓存统计');
  const stats = analyzer.getCacheStats();
  console.log(`✅ 缓存状态:`);
  console.log(`   启用：${stats.enabled}`);
  if (stats.enabled) {
    console.log(`   文件数：${stats.fileCount}`);
    console.log(`   总大小：${stats.totalSize}`);
  }
  console.log('');

  console.log('🎉 示例执行完成！');
}

// 运行示例
runExamples().catch(console.error);
