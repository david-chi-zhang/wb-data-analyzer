#!/usr/bin/env node
/**
 * 更新元数据缓存
 * 用法：node scripts/update-cache.js [indicators|countries|all]
 */

const cache = require('../src/cache/metadata');

async function main() {
  const type = process.argv[2] || 'all';
  
  console.log('🔄 World Bank 元数据缓存更新工具\n');
  console.log('='.repeat(50));
  
  try {
    if (type === 'all' || type === 'indicators') {
      await cache.get('indicators', () => cache.fetchIndicators());
    }
    
    if (type === 'all' || type === 'countries') {
      await cache.get('countries', () => cache.fetchCountries());
    }
    
    console.log('\n✅ 缓存更新完成！');
    console.log('\n缓存位置：data/metadata/');
    console.log('有效期：');
    console.log('  - 指标列表：30 天');
    console.log('  - 国家列表：30 天');
    
  } catch (err) {
    console.error('\n❌ 错误:', err.message);
    process.exit(1);
  }
}

main();
