/**
 * 计算模块
 * 支持增速、指数化、CAGR、加权平均等计算
 */

class ComputeModule {
  /**
   * 执行计算
   */
  execute(data, type, options = {}) {
    switch (type.toLowerCase()) {
      case 'growth':
      case '增速':
        return this.calcGrowth(data, options);
      
      case 'change':
      case '变动':
        return this.calcChange(data, options);
      
      case 'index':
      case '指数化':
        return this.calcIndex(data, options);
      
      case 'cagr':
      case '几何平均':
      case '年化':
        return this.calcCAGR(data, options);
      
      case 'average':
      case '算术平均':
        return this.calcAverage(data, options);
      
      case 'weighted':
      case '加权平均':
        return this.calcWeightedAverage(data, options);
      
      default:
        throw new Error(`未知计算类型：${type}`);
    }
  }

  /**
   * 计算同比增速
   */
  calcGrowth(data, options = {}) {
    const { country } = options;
    const countryData = country ? data.find(d => d.country === country) : data[0];
    
    if (!countryData) {
      throw new Error(`未找到国家数据：${country}`);
    }

    const sorted = [...countryData.data].sort((a, b) => a.year - b.year);
    
    const result = sorted.map((d, i) => ({
      year: d.year,
      value: d.value,
      growth: i === 0 ? null : ((d.value - sorted[i-1].value) / sorted[i-1].value * 100)
    }));

    return {
      country: countryData.country,
      indicator: countryData.indicator,
      type: 'growth',
      data: result
    };
  }

  /**
   * 计算绝对变动
   */
  calcChange(data, options = {}) {
    const { country } = options;
    const countryData = country ? data.find(d => d.country === country) : data[0];
    
    if (!countryData) {
      throw new Error(`未找到国家数据：${country}`);
    }

    const sorted = [...countryData.data].sort((a, b) => a.year - b.year);
    
    const result = sorted.map((d, i) => ({
      year: d.year,
      value: d.value,
      change: i === 0 ? null : (d.value - sorted[i-1].value)
    }));

    return {
      country: countryData.country,
      indicator: countryData.indicator,
      type: 'change',
      data: result
    };
  }

  /**
   * 计算指数化（基期=100）
   */
  calcIndex(data, options = {}) {
    const { country, baseYear = 2020 } = options;
    const countryData = country ? data.find(d => d.country === country) : data[0];
    
    if (!countryData) {
      throw new Error(`未找到国家数据：${country}`);
    }

    const baseValue = countryData.data.find(d => d.year === baseYear)?.value;
    if (!baseValue) {
      throw new Error(`基期 ${baseYear} 无数据`);
    }

    const result = countryData.data.map(d => ({
      year: d.year,
      value: d.value,
      index: (d.value / baseValue * 100)
    }));

    return {
      country: countryData.country,
      indicator: countryData.indicator,
      type: 'index',
      baseYear,
      data: result
    };
  }

  /**
   * 计算 CAGR（复合年增长率）
   */
  calcCAGR(data, options = {}) {
    const { country, startYear, endYear } = options;
    const countryData = country ? data.find(d => d.country === country) : data[0];
    
    if (!countryData) {
      throw new Error(`未找到国家数据：${country}`);
    }

    let filtered = countryData.data;
    if (startYear) filtered = filtered.filter(d => d.year >= startYear);
    if (endYear) filtered = filtered.filter(d => d.year <= endYear);
    
    const sorted = filtered.sort((a, b) => a.year - b.year);
    
    if (sorted.length < 2) {
      return {
        country: countryData.country,
        indicator: countryData.indicator,
        type: 'cagr',
        error: '数据不足'
      };
    }

    const first = sorted[0].value;
    const last = sorted[sorted.length - 1].value;
    const n = sorted[sorted.length - 1].year - sorted[0].year;
    
    const cagr = (Math.pow(last / first, 1/n) - 1) * 100;

    return {
      country: countryData.country,
      indicator: countryData.indicator,
      type: 'cagr',
      startYear: sorted[0].year,
      endYear: sorted[sorted.length - 1].year,
      cagr,
      cagrFormatted: `${cagr.toFixed(2)}%`
    };
  }

  /**
   * 计算算术平均
   */
  calcAverage(data, options = {}) {
    const { country, startYear, endYear } = options;
    const countryData = country ? data.find(d => d.country === country) : data[0];
    
    if (!countryData) {
      throw new Error(`未找到国家数据：${country}`);
    }

    let filtered = countryData.data;
    if (startYear) filtered = filtered.filter(d => d.year >= startYear);
    if (endYear) filtered = filtered.filter(d => d.year <= endYear);
    
    const values = filtered.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;

    return {
      country: countryData.country,
      indicator: countryData.indicator,
      type: 'average',
      startYear: filtered[0]?.year,
      endYear: filtered[filtered.length - 1]?.year,
      average: avg,
      averageFormatted: avg.toFixed(2),
      count: values.length
    };
  }

  /**
   * 计算跨国加权平均
   */
  calcWeightedAverage(data, weights, options = {}) {
    const { indicator, weightIndicator } = options;
    
    // 收集所有年份
    const allYears = new Set();
    data.forEach(d => d.data.forEach(item => allYears.add(item.year)));
    
    const result = [];
    
    for (const year of allYears) {
      let weightedSum = 0;
      let weightSum = 0;
      
      for (const countryData of data) {
        const valueItem = countryData.data.find(d => d.year === year);
        const weightData = weights.find(w => w.country === countryData.country);
        const weightItem = weightData?.data.find(d => d.year === year);
        
        if (valueItem && weightItem) {
          weightedSum += valueItem.value * weightItem.value;
          weightSum += weightItem.value;
        }
      }
      
      if (weightSum > 0) {
        result.push({
          year,
          weightedAvg: weightedSum / weightSum
        });
      }
    }

    return {
      indicator: indicator || 'weighted_average',
      type: 'weighted_average',
      data: result.sort((a, b) => a.year - b.year)
    };
  }

  /**
   * 计算分段平均增速
   */
  calcSegmentedGrowth(data, segments, options = {}) {
    const { country } = options;
    const countryData = country ? data.find(d => d.country === country) : data[0];
    
    if (!countryData) {
      throw new Error(`未找到国家数据：${country}`);
    }

    const result = {};
    
    for (const segment of segments) {
      const [start, end] = segment.split('-').map(Number);
      const cagrResult = this.calcCAGR(data, {
        country,
        startYear: start,
        endYear: end
      });
      result[segment] = cagrResult.cagr;
    }

    return {
      country: countryData.country,
      indicator: countryData.indicator,
      type: 'segmented_growth',
      segments: result
    };
  }
}

module.exports = ComputeModule;
