/**
 * API 连接测试
 * 验证 World Bank Data360 API 连通性
 */

const Data360Client = require('../src/api/client');

async function testAPI() {
  console.log('🧪 World Bank Data360 API 连接测试\n');
  
  const client = new Data360Client({
    cacheEnabled: false,  // 测试时禁用缓存
    timeout: 30000
  });

  // ========== 测试 1: 基础数据查询 ==========
  console.log('📊 测试 1: 查询中国 2020-2022 年 GDP 数据');
  try {
    const result = await client.get('/data360/data', {
      DATABASE_ID: 'WB_WDI',
      INDICATOR: 'NY.GDP.MKTP.CD',
      REF_AREA: 'CHN',
      timePeriodFrom: '2020',
      timePeriodTo: '2022'
    });
    
    console.log(`✅ 成功！返回 ${result.count} 条记录`);
    if (result.value.length > 0) {
      const sample = result.value[0];
      console.log(`   示例数据:`);
      console.log(`   - 年份：${sample.TIME_PERIOD}`);
      console.log(`   - 数值：${sample.OBS_VALUE}`);
      console.log(`   - 单位：${sample.UNIT_MEASURE}`);
    }
  } catch (err) {
    console.error(`❌ 失败：${err.message}`);
  }
  console.log('');

  // ========== 测试 2: 搜索指标 ==========
  console.log('🔍 测试 2: 搜索 "GDP" 相关指标');
  try {
    const result = await client.post('/data360/searchv2', {
      count: true,
      select: 'series_description/idno, series_description/name',
      search: 'GDP',
      top: 5
    });
    
    console.log(`✅ 成功！找到 ${result.value.length} 个指标`);
    result.value.forEach((item, idx) => {
      console.log(`   ${idx + 1}. ${item.series_description?.idno || 'N/A'} - ${item.series_description?.name || 'N/A'}`);
    });
  } catch (err) {
    console.error(`❌ 失败：${err.message}`);
  }
  console.log('');

  // ========== 测试 3: 获取指标列表 ==========
  console.log('📋 测试 3: 获取 WDI 数据库指标列表');
  try {
    const result = await client.get('/data360/indicators', {
      datasetId: 'WB_WDI'
    });
    
    console.log(`✅ 成功！WDI 数据库包含 ${result.value?.length || 'N/A'} 个指标`);
  } catch (err) {
    console.error(`❌ 失败：${err.message}`);
  }
  console.log('');

  // ========== 测试 4: 分页测试 ==========
  console.log('📄 测试 4: 分页查询（金砖五国人口数据）');
  try {
    const result = await client.fetchAll('/data360/data', {
      DATABASE_ID: 'WB_WDI',
      INDICATOR: 'SP.POP.TOTL',
      REF_AREA: 'BRA,RUS,IND,CHN,ZAF',
      timePeriodFrom: '2020',
      timePeriodTo: '2022'
    });
    
    console.log(`✅ 成功！获取全部 ${result.count} 条记录（自动分页）`);
  } catch (err) {
    console.error(`❌ 失败：${err.message}`);
  }
  console.log('');

  // ========== 测试 5: 缓存测试 ==========
  console.log('💾 测试 5: 缓存功能测试');
  const cachedClient = new Data360Client({
    cacheEnabled: true,
    cacheTTL: 3600000
  });
  
  try {
    console.log('   第 1 次查询（无缓存）...');
    await cachedClient.get('/data360/data', {
      DATABASE_ID: 'WB_WDI',
      INDICATOR: 'SP.POP.TOTL',
      REF_AREA: 'CHN'
    });
    
    console.log('   第 2 次查询（应有缓存）...');
    await cachedClient.get('/data360/data', {
      DATABASE_ID: 'WB_WDI',
      INDICATOR: 'SP.POP.TOTL',
      REF_AREA: 'CHN'
    });
    
    const stats = cachedClient.getCacheStats();
    console.log(`✅ 缓存统计:`);
    console.log(`   - 文件数：${stats.fileCount}`);
    console.log(`   - 总大小：${stats.totalSize}`);
  } catch (err) {
    console.error(`❌ 失败：${err.message}`);
  }
  console.log('');

  console.log('🎉 测试完成！');
}

testAPI().catch(console.error);
