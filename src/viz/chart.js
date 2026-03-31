/**
 * 图表生成模块 - IMF WEO 风格
 * 简洁、专业、数据驱动
 */

class ChartGenerator {
  /**
   * 生成 IMF WEO 风格的图表
   */
  async generate(result, options = {}) {
    const {
      title = 'Data Analysis',
      subtitle = '',
      width = 1000,
      height = 600,
      showTable = true,
      showAnalysis = true
    } = options;

    const series = result.data.map(countryData => {
      const data = countryData.data.map(d => [String(d.year), d.value]);
      
      return {
        name: countryData.countryName || countryData.country,
        type: 'line',
        data,
        smooth: false,  // IMF 风格：直线，不平滑
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2 },
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff'
        }
      };
    });

    const allYears = new Set();
    result.data.forEach(d => d.data.forEach(item => allYears.add(item.year)));
    const years = Array.from(allYears).sort((a, b) => a - b);  // 数字排序，避免字符串排序问题

    const html = this._renderIMFStyle({
      title,
      subtitle: subtitle || 'Source: World Bank Data360',
      series,
      years,
      unit: result.data[0]?.unit || '',
      width,
      height,
      showTable,
      showAnalysis,
      data: result.data
    });

    return html;
  }

  /**
   * 渲染 IMF WEO 风格 HTML
   */
  _renderIMFStyle(config) {
    const { title, subtitle, series, years, unit, width, height, showTable, showAnalysis, data } = config;

    // 生成 CSV 数据
    const csvData = this._generateCSV(data, years);
    
    // 生成表格行
    let tableHTML = '';
    if (showTable && data.length > 0) {
      const dataMap = {};
      data.forEach(d => {
        d.data.forEach(item => {
          if (!dataMap[item.year]) dataMap[item.year] = {};
          dataMap[item.year][d.countryName || d.country] = item.value;
        });
      });

      const countries = data.map(d => d.countryName || d.country);
      
      tableHTML = `
        <div class="table-section">
          <h3>Data Table</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Year</th>
                ${countries.map(c => `<th>${c}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${years.map(year => `
                <tr>
                  <td class="year">${year}</td>
                  ${countries.map(c => {
                    const value = dataMap[year]?.[c];
                    return `<td>${value !== undefined ? value.toFixed(1) : 'n.a.'}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "Segoe UI", Arial, sans-serif;
      background: #f5f5f5;
      padding: 20px;
      color: #333;
    }
    .container {
      max-width: ${width + 40}px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .header {
      padding: 24px 30px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .header-left {
      flex: 1;
    }
    .header-right {
      display: flex;
      gap: 10px;
    }
    .title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 6px;
    }
    .subtitle {
      font-size: 13px;
      color: #666;
    }
    .btn {
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: white;
      color: #333;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn:hover {
      background: #f8f9fa;
      border-color: #c0c0c0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .btn:active {
      background: #e9ecef;
    }
    .btn-primary {
      background: #0066cc;
      border-color: #0066cc;
      color: white;
    }
    .btn-primary:hover {
      background: #0052a3;
      border-color: #0052a3;
    }
    .chart-container {
      padding: 30px;
    }
    #chart {
      width: 100%;
      height: ${height}px;
    }
    .table-section {
      padding: 0 30px 30px;
    }
    .table-section h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 15px;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      border: 1px solid #e0e0e0;
    }
    .data-table thead {
      background: #f8f9fa;
    }
    .data-table thead th {
      padding: 10px 12px;
      text-align: right;
      font-weight: 600;
      color: #1a1a1a;
      border-right: 1px solid #e0e0e0;
      border-bottom: 2px solid #e0e0e0;
    }
    .data-table thead th:first-child {
      text-align: left;
      border-left: 1px solid #e0e0e0;
    }
    .data-table tbody tr {
      border-bottom: 1px solid #e0e0e0;
    }
    .data-table tbody tr:hover {
      background: #f8f9fa;
    }
    .data-table tbody td {
      padding: 8px 12px;
      text-align: right;
      border-right: 1px solid #e0e0e0;
    }
    .data-table tbody td:first-child {
      text-align: left;
      border-left: 1px solid #e0e0e0;
      font-weight: 600;
      color: #1a1a1a;
    }
    .data-table tbody tr:nth-child(even) {
      background: #fafafa;
    }
    .footer {
      padding: 15px 30px;
      border-top: 1px solid #e0e0e0;
      background: #f8f9fa;
      font-size: 11px;
      color: #666;
      text-align: left;
    }
    .footer-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 15px;
      }
      .header-right {
        width: 100%;
        justify-content: flex-end;
      }
      .container { max-width: 100%; }
      .chart-container { padding: 15px; }
      #chart { height: 400px; }
      .data-table { font-size: 11px; }
      .data-table thead th, .data-table tbody td { padding: 6px 8px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <div class="title">${title}</div>
        <div class="subtitle">${subtitle}</div>
      </div>
      <div class="header-right">
        <button class="btn" onclick="downloadCSV()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download CSV
        </button>
        <button class="btn" onclick="downloadPNG()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          Download PNG
        </button>
      </div>
    </div>
    
    <div class="chart-container">
      <div id="chart"></div>
    </div>
    
    ${showTable ? tableHTML : ''}
    
    <div class="footer">
      <div class="footer-info">
        <div>Generated with World Bank Data360 Analyzer</div>
        <div>${new Date().toISOString().split('T')[0]}</div>
      </div>
    </div>
  </div>
  
  <script>
    const chart = echarts.init(document.getElementById('chart'));
    const chartTitle = '${title.replace(/'/g, "\\'")}';
    const csvContent = ${JSON.stringify(csvData)};
    
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        textStyle: { color: '#333', fontSize: 12 },
        formatter: function(params) {
          let result = '<div style="padding: 8px; font-weight: 600;">' + params[0].name + '</div>';
          params.forEach(param => {
            const value = param.value[1];
            result += '<div style="display: flex; align-items: center; padding: 4px 8px;">';
            result += '<span style="width: 10px; height: 10px; border-radius: 50%; background: ' + param.color + '; display: inline-block; margin-right: 8px;"></span>';
            result += '<span style="flex: 1;">' + param.seriesName + '</span>';
            result += '<span style="font-weight: 600;">' + value.toFixed(1) + '${unit ? ' ' + unit : ''}</span>';
            result += '</div>';
          });
          return result;
        }
      },
      legend: {
        data: ${JSON.stringify(series.map(s => s.name))},
        bottom: 0,
        textStyle: { fontSize: 12 },
        itemWidth: 14,
        itemHeight: 14
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '15%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ${JSON.stringify(years)},
        axisLine: { lineStyle: { color: '#e0e0e0' } },
        axisLabel: { 
          color: '#666',
          fontSize: 11,
          margin: 10
        },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisLabel: { 
          color: '#666',
          fontSize: 11,
          formatter: '{value}${unit ? ' ' + unit : ''}',
          margin: 10
        },
        splitLine: { 
          lineStyle: { 
            color: '#e0e0e0',
            type: 'dashed'
          } 
        }
      },
      series: ${JSON.stringify(series)}
    };
    
    chart.setOption(option);
    
    window.addEventListener('resize', () => {
      chart.resize();
    });
    
    // Download CSV function
    function downloadCSV() {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', chartTitle.replace(/[^a-z0-9]/gi, '_') + '.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    // Download PNG function
    function downloadPNG() {
      const canvas = document.querySelector('#chart canvas');
      if (!canvas) return;
      
      const link = document.createElement('a');
      link.download = chartTitle.replace(/[^a-z0-9]/gi, '_') + '.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  </script>
</body>
</html>`;
  }

  /**
   * 生成 CSV 数据
   */
  _generateCSV(data, years) {
    const dataMap = {};
    data.forEach(d => {
      d.data.forEach(item => {
        if (!dataMap[item.year]) dataMap[item.year] = {};
        dataMap[item.year][d.countryName || d.country] = item.value;
      });
    });

    const countries = data.map(d => d.countryName || d.country);
    
    // Header
    let csv = 'Year,' + countries.join(',') + '\n';
    
    // Data rows
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
}

module.exports = ChartGenerator;
