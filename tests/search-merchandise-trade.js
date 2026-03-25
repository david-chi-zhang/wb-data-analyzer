/**
 * 搜索正确的商品贸易指标代码
 */

const Data360Client = require('../src/api/client');

async function searchMerchandiseTrade() {
  console.log('🔍 Searching for Merchandise Trade indicators...\n');
  
  const client = new Data360Client({ cacheEnabled: false });

  // 搜索商品贸易相关指标
  console.log('📊 Search: "merchandise trade"...');
  try {
    const result = await client.post('/data360/searchv2', {
      count: true,
      select: 'series_description/idno, series_description/name, series_description/database_id',
      search: 'merchandise trade',
      top: 10
    });
    
    console.log(`✅ Found ${result.value?.length || 0} results:\n`);
    result.value?.forEach((item, idx) => {
      const id = item.series_description?.idno || 'N/A';
      const name = item.series_description?.name || 'N/A';
      const db = item.series_description?.database_id || 'N/A';
      console.log(`${idx + 1}. ${id}`);
      console.log(`   ${name}`);
      console.log(`   Database: ${db}\n`);
    });
  } catch (err) {
    console.log(`❌ Error: ${err.message}`);
  }

  // 搜索货物贸易相关指标
  console.log('📊 Search: "goods trade"...');
  try {
    const result = await client.post('/data360/searchv2', {
      count: true,
      select: 'series_description/idno, series_description/name',
      search: 'goods trade',
      top: 5
    });
    
    console.log(`✅ Found ${result.value?.length || 0} results:\n`);
    result.value?.forEach((item, idx) => {
      const id = item.series_description?.idno || 'N/A';
      const name = item.series_description?.name || 'N/A';
      console.log(`${idx + 1}. ${id}: ${name}\n`);
    });
  } catch (err) {
    console.log(`❌ Error: ${err.message}`);
  }
}

searchMerchandiseTrade().catch(console.error);
