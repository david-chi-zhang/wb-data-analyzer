#!/usr/bin/env node
/**
 * 快速查询示例 - 使用缓存加速查询
 */

const cache = require('../src/cache/metadata');

async function quickSearch(query) {
  // 从缓存中搜索指标
  const indicators = await cache.get('indicators', () => cache.fetchIndicators());
  
  const lowerQuery = query.toLowerCase();
  const matches = indicators.all.filter(i => 
    i.name.toLowerCase().includes(lowerQuery) || 
    i.id.toLowerCase().includes(lowerQuery)
  );
  
  console.log(`\n📊 搜索 "${query}" - 找到 ${matches.length} 个指标:\n`);
  matches.slice(0, 10).forEach(m => {
    console.log(`  ${m.id}`);
    console.log(`    ${m.name}\n`);
  });
  
  return matches;
}

async function listCountries() {
  const countries = await cache.get('countries', () => cache.fetchCountries());
  
  console.log(`\n🌍 国家/地区列表 - 共 ${countries.count} 个:\n`);
  console.log(`  单一国家：${countries.singleCountries.length} 个`);
  console.log(`  聚合/区域：${countries.aggregates.length} 个`);
  
  console.log('\n前 20 个单一国家:');
  countries.singleCountries.slice(0, 20).forEach(c => {
    console.log(`  ${c.iso2Code} - ${c.name}`);
  });
}

async function main() {
  console.log('🚀 快速查询示例 (使用缓存)\n');
  console.log('='.repeat(50));
  
  // 搜索 GDP 相关指标
  await quickSearch('GDP, PPP');
  
  // 搜索财政相关指标
  await quickSearch('government debt');
  
  // 列出国家
  await listCountries();
  
  console.log('\n✅ 查询完成 (使用本地缓存，无需 API 调用)');
}

main();
