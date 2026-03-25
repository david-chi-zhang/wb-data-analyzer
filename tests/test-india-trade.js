/**
 * 测试：印度贸易指标（2010-2023）
 * 测试新增的 2 个贸易指标
 */

const Data360Client = require('../src/api/client');
const fs = require('fs');
const path = require('path');

async function testIndiaTradeIndicators() {
  console.log('🇮🇳 Test: India Trade Indicators (2010-2023)\n');
  
  const client = new Data360Client({
    cacheDir: path.join(__dirname, '../data/cache'),
    cacheEnabled: false
  });

  const indicators = [
    { 
      code: 'WB_WDI_NE_TRD_GNFS_ZS', 
      name: 'Trade (% of GDP)',
      name_cn: '贸易总额占 GDP 比重'
    },
    { 
      code: 'WB_WDI_TG_VAL_TOTL_GD_ZS', 
      name: 'Merchandise trade (% of GDP)',
      name_cn: '商品贸易占 GDP 比重'
    },
    { 
      code: 'WB_WDI_NE_EXP_GNFS_ZS', 
      name: 'Exports (% of GDP)',
      name_cn: '出口占 GDP 比重'
    },
    { 
      code: 'WB_WDI_NE_IMP_GNFS_ZS', 
      name: 'Imports (% of GDP)',
      name_cn: '进口占 GDP 比重'
    }
  ];

  const allData = [];

  for (const indicator of indicators) {
    console.log(`📊 Querying ${indicator.name}...`);
    
    try {
      const result = await client.get('/data360/data', {
        DATABASE_ID: 'WB_WDI',
        INDICATOR: indicator.code,
        REF_AREA: 'IND',
        timePeriodFrom: '2010',
        timePeriodTo: '2023'
      });

      if (result.count > 0 && result.value && result.value.length > 0) {
        console.log(`   ✅ Retrieved ${result.value.length} years`);
        
        const data = result.value.map(item => ({
          year: parseInt(item.TIME_PERIOD),
          value: parseFloat(item.OBS_VALUE)
        })).sort((a, b) => a.year - b.year);
        
        allData.push({
          indicator: indicator.code,
          name: indicator.name,
          data
        });
      } else {
        console.log(`   ⚠️ No data`);
      }
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
    }
  }

  if (allData.length > 0) {
    // Console table
    console.log('\n📋 India: Trade Indicators (% of GDP)\n');
    console.log('┌────────┬──────────────┬─────────────────────┬─────────────┬─────────────┐');
    console.log('│  Year  │   Trade      │ Merchandise Trade   │  Exports    │  Imports    │');
    console.log('├────────┼──────────────┼─────────────────────┼─────────────┼─────────────┤');

    const years = [...new Set(allData.flatMap(d => d.data.map(item => item.year)))].sort();
    
    const dataMap = {};
    allData.forEach(d => {
      d.data.forEach(item => {
        if (!dataMap[item.year]) dataMap[item.year] = {};
        dataMap[item.year][d.indicator] = item.value;
      });
    });

    for (const year of years) {
      const row = dataMap[year];
      const trade = row['WB_WDI_NE_TRD_GNFS_ZS'];
      const merch = row['WB_WDI_NE_TRD_GNFS_CD'];
      const exp = row['WB_WDI_NE_EXP_GNFS_ZS'];
      const imp = row['WB_WDI_NE_IMP_GNFS_ZS'];
      
      console.log(`│ ${year} │  ${(trade || 0).toFixed(1).padStart(9)} │  ${(merch || 0).toFixed(1).padStart(16)} │  ${(exp || 0).toFixed(1).padStart(9)} │  ${(imp || 0).toFixed(1).padStart(9)} │`);
    }
    console.log('└────────┴──────────────┴─────────────────────┴─────────────┴─────────────┘');

    // Trend analysis
    if (years.length >= 2) {
      const firstYear = years[0];
      const lastYear = years[years.length - 1];
      
      console.log('\n📊 Trend Analysis (2010 vs 2023)\n');
      
      indicators.forEach(ind => {
        const indicatorData = allData.find(d => d.indicator === ind.code);
        if (indicatorData) {
          const first = indicatorData.data.find(d => d.year === firstYear);
          const last = indicatorData.data.find(d => d.year === lastYear);
          
          if (first && last) {
            const change = last.value - first.value;
            const changeStr = change >= 0 ? `+${change.toFixed(1)}` : change.toFixed(1);
            const arrow = change >= 0 ? '↑' : '↓';
            
            console.log(`${ind.name}: ${first.value.toFixed(1)}% → ${last.value.toFixed(1)}% (${changeStr} pp ${arrow})`);
          }
        }
      });
    }
  }

  console.log('\n✅ Test completed!\n');
}

testIndiaTradeIndicators().catch(console.error);
