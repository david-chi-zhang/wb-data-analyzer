/**
 * 测试：搜索正确的产业占比指标代码
 */

const Data360Client = require('../src/api/client');

async function testSearchIndicators() {
  console.log('🔍 搜索 WDI 产业占比相关指标\n');
  
  const client = new Data360Client({ cacheEnabled: false });

  // 搜索农业占比
  console.log('📊 搜索 "agriculture value added GDP"...');
  try {
    const result = await client.post('/data360/searchv2', {
      count: true,
      select: 'series_description/idno, series_description/name, series_description/database_id',
      search: 'agriculture value added percent GDP',
      top: 5
    });
    
    console.log(`✅ 找到 ${result.value?.length || 0} 个结果:`);
    result.value?.forEach((item, idx) => {
      const id = item.series_description?.idno || 'N/A';
      const name = item.series_description?.name || 'N/A';
      console.log(`   ${idx + 1}. ${id}`);
      console.log(`      ${name}`);
    });
  } catch (err) {
    console.log(`❌ 错误：${err.message}`);
  }
  console.log('');

  // 搜索工业占比
  console.log('📊 搜索 "industry value added GDP"...');
  try {
    const result = await client.post('/data360/searchv2', {
      count: true,
      select: 'series_description/idno, series_description/name',
      search: 'industry value added percent GDP',
      top: 5
    });
    
    console.log(`✅ 找到 ${result.value?.length || 0} 个结果:`);
    result.value?.forEach((item, idx) => {
      const id = item.series_description?.idno || 'N/A';
      const name = item.series_description?.name || 'N/A';
      console.log(`   ${idx + 1}. ${id}`);
      console.log(`      ${name}`);
    });
  } catch (err) {
    console.log(`❌ 错误：${err.message}`);
  }
  console.log('');

  // 搜索服务业占比
  console.log('📊 搜索 "services value added GDP"...');
  try {
    const result = await client.post('/data360/searchv2', {
      count: true,
      select: 'series_description/idno, series_description/name',
      search: 'services value added percent GDP',
      top: 5
    });
    
    console.log(`✅ 找到 ${result.value?.length || 0} 个结果:`);
    result.value?.forEach((item, idx) => {
      const id = item.series_description?.idno || 'N/A';
      const name = item.series_description?.name || 'N/A';
      console.log(`   ${idx + 1}. ${id}`);
      console.log(`      ${name}`);
    });
  } catch (err) {
    console.log(`❌ 错误：${err.message}`);
  }
  console.log('');

  // 测试获取印度 GDP 总量数据（验证 API 连接）
  console.log('📊 测试：获取印度 GDP 总量数据...');
  try {
    const result = await client.get('/data360/data', {
      DATABASE_ID: 'WB_WDI',
      INDICATOR: 'NY.GDP.MKTP.CD',
      REF_AREA: 'IND',
      timePeriodFrom: '2020',
      timePeriodTo: '2022'
    });
    
    console.log(`✅ 成功！返回 ${result.count} 条记录`);
    if (result.value && result.value.length > 0) {
      const sample = result.value[0];
      console.log(`   示例:`);
      console.log(`   - 年份：${sample.TIME_PERIOD}`);
      console.log(`   - 数值：${sample.OBS_VALUE}`);
      console.log(`   - 指标：${sample.INDICATOR}`);
    }
  } catch (err) {
    console.log(`❌ 错误：${err.message}`);
  }
}

testSearchIndicators().catch(console.error);
