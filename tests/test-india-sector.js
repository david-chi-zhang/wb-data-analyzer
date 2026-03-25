/**
 * 测试：印度不同产业增加值占 GDP 比重（2010 至今）
 * IMF WEO 风格输出
 */

const Data360Client = require('../src/api/client');
const ChartGenerator = require('../src/viz/chart');
const fs = require('fs');
const path = require('path');

async function testIndiaSectorShare() {
  console.log('🇮🇳 Test: India Sector Value Added (% of GDP) 2010-2023\n');
  
  const client = new Data360Client({
    cacheDir: path.join(__dirname, '../data/cache'),
    cacheEnabled: false
  });

  const sectors = [
    { code: 'WB_WDI_NV_AGR_TOTL_ZS', name: 'Agriculture, forestry, and fishing', color: '#1f77b4' },
    { code: 'WB_WDI_NV_IND_TOTL_ZS', name: 'Industry (including construction)', color: '#ff7f0e' },
    { code: 'WB_WDI_NV_IND_MANF_ZS', name: 'Manufacturing', color: '#2ca02c' },
    { code: 'WB_WDI_NV_SRV_TOTL_ZS', name: 'Services', color: '#d62728' }
  ];

  const allData = [];

  for (const sector of sectors) {
    console.log(`📊 Querying ${sector.name}...`);
    
    try {
      const result = await client.get('/data360/data', {
        DATABASE_ID: 'WB_WDI',
        INDICATOR: sector.code,
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
          country: 'IND',
          countryName: 'India',
          indicator: sector.code,
          indicatorName: sector.name,
          color: sector.color,
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
    const allYears = new Set();
    allData.forEach(d => d.data.forEach(item => allYears.add(item.year)));
    const years = Array.from(allYears).sort();

    const dataMap = {};
    allData.forEach(d => {
      d.data.forEach(item => {
        if (!dataMap[item.year]) dataMap[item.year] = {};
        dataMap[item.year][d.indicator] = item.value;
      });
    });

    // Console table
    console.log('\n📋 India: Value added by sector (% of GDP)\n');
    console.log('┌────────┬─────────────┬─────────────┬─────────────┬─────────────┐');
    console.log('│  Year  │ Agriculture │  Industry   │ Manufacturing│  Services   │');
    console.log('├────────┼─────────────┼─────────────┼─────────────┼─────────────┤');

    for (const year of years) {
      const row = dataMap[year];
      const agr = row['WB_WDI_NV_AGR_TOTL_ZS'];
      const ind = row['WB_WDI_NV_IND_TOTL_ZS'];
      const man = row['WB_WDI_NV_IND_MANF_ZS'];
      const srv = row['WB_WDI_NV_SRV_TOTL_ZS'];
      
      console.log(`│ ${year} │  ${(agr || 0).toFixed(1).padStart(8)} │  ${(ind || 0).toFixed(1).padStart(8)} │  ${(man || 0).toFixed(1).padStart(8)} │  ${(srv || 0).toFixed(1).padStart(8)} │`);
    }
    console.log('└────────┴─────────────┴─────────────┴─────────────┴─────────────┘');

    // Generate IMF WEO style report
    console.log('\n📈 Generating IMF WEO style report...');
    
    const chartGen = new ChartGenerator();
    
    // Create result object compatible with chart generator
    const chartResult = {
      data: allData.map(d => ({
        country: d.indicator,
        countryName: d.indicatorName,
        indicator: d.indicator,
        unit: '% of GDP',
        data: d.data
      }))
    };

    const reportHtml = await chartGen.generate(chartResult, {
      title: 'India: Value Added by Sector (% of GDP)',
      subtitle: 'Source: World Bank, World Development Indicators | Data: World Bank Data360',
      width: 1000,
      height: 550,
      showTable: true,
      showAnalysis: false,
      data: chartResult.data
    });

    const reportPath = path.join(__dirname, '../examples/india_imf_style.html');
    fs.writeFileSync(reportPath, reportHtml);
    console.log(`✅ Report generated: ${reportPath}`);
    console.log(`   Open in browser to view (IMF WEO style)`);

    // Trend analysis
    if (years.length >= 2) {
      const firstYear = years[0];
      const lastYear = years[years.length - 1];
      
      console.log('\n📊 Trend Analysis (2010 vs 2023)\n');
      
      sectors.forEach(sector => {
        const sectorData = allData.find(d => d.indicator === sector.code);
        if (sectorData) {
          const first = sectorData.data.find(d => d.year === firstYear);
          const last = sectorData.data.find(d => d.year === lastYear);
          
          if (first && last) {
            const change = last.value - first.value;
            const changeStr = change >= 0 ? `+${change.toFixed(1)}` : change.toFixed(1);
            const arrow = change >= 0 ? '↑' : '↓';
            
            console.log(`${sector.name}: ${first.value.toFixed(1)}% → ${last.value.toFixed(1)}% (${changeStr} pp ${arrow})`);
          }
        }
      });
    }
  } else {
    console.log('\n⚠️ No data retrieved');
  }

  console.log('\n✅ Test completed!\n');
}

testIndiaSectorShare().catch(console.error);
