/**
 * World Bank Data360 Analyzer - 主入口
 * 
 * 功能：
 * 1. 数据查询（WDI 数据库）
 * 2. 自然语言解析
 * 3. 计算（增速、指数化、CAGR）
 * 4. 可视化（ECharts 图表）
 * 5. 指标定义查询
 */

const Data360Client = require('./api/client');
const QueryParser = require('./query/parser');
const ComputeModule = require('./compute/index');
const ChartGenerator = require('./viz/chart');

// 加载别名配置
const COUNTRY_ALIASES = require('../data/aliases/countries.json');
const INDICATOR_ALIASES = require('../data/aliases/indicators.json').indicators;

class WorldBankAnalyzer {
  constructor(options = {}) {
    this.client = new Data360Client({
      cacheDir: options.cacheDir,
      cacheEnabled: options.cacheEnabled !== false,
      cacheTTL: options.cacheTTL || 3600000
    });
    
    this.parser = new QueryParser();
    this.compute = new ComputeModule();
    this.chart = new ChartGenerator();
    
    // 默认数据库
    this.defaultDatabase = options.defaultDatabase || 'WB_WDI';
  }

  /**
   * 解析自然语言查询
   */
  parse(input) {
    return this.parser.parse(input, {
      countryAliases: COUNTRY_ALIASES,
      indicatorAliases: INDICATOR_ALIASES
    });
  }

  /**
   * 查询数据
   * @param {Object} options - 查询选项
   */
  async query(options = {}) {
    const {
      database = this.defaultDatabase,
      countries,
      indicator,
      years,
      includeMetadata = true,
      all = false
    } = options;

    // 解析国家
    const countryCodes = this._resolveCountries(countries);
    if (countryCodes.length === 0) {
      throw new Error('未指定有效国家');
    }

    // 解析指标
    const indicatorCode = this._resolveIndicator(indicator);
    if (!indicatorCode) {
      throw new Error(`未找到指标：${indicator}`);
    }

    // 构建查询参数
    const params = {
      DATABASE_ID: database,
      INDICATOR: indicatorCode,
      REF_AREA: countryCodes.join(','),
    };

    // 添加年份范围
    if (years) {
      const yearRange = this._parseYears(years);
      if (yearRange.from) params.timePeriodFrom = String(yearRange.from);
      if (yearRange.to) params.timePeriodTo = String(yearRange.to);
    }

    // 执行查询
    const result = await this.client.getData(params, { all });

    // 格式化结果
    return this._formatResult(result, {
      indicator: indicatorCode,
      countries: countryCodes,
      includeMetadata
    });
  }

  /**
   * 解析并查询（自然语言）
   */
  async parseAndQuery(input) {
    const parsed = this.parse(input);
    
    if (parsed.action === 'define') {
      return this.getDefinition(parsed.indicator);
    }
    
    if (parsed.action === 'note') {
      return this.getCountryNote(parsed.countries[0]);
    }

    const result = await this.query({
      countries: parsed.countries,
      indicator: parsed.indicator,
      years: parsed.years
    });

    if (parsed.action === 'chart') {
      const html = await this.chart.generate(result, {
        title: parsed.title || this._generateTitle(result)
      });
      return {
        ...result,
        chart: html
      };
    }

    return result;
  }

  /**
   * 生成图表
   */
  async chart(options = {}) {
    const result = await this.query(options);
    const html = await this.chart.generate(result, {
      title: options.title || this._generateTitle(result),
      forecastYear: options.forecastYear,
      width: options.width || 800,
      height: options.height || 500
    });
    
    return {
      ...result,
      chart: html
    };
  }

  /**
   * 计算（增速、指数化等）
   */
  compute(data, type, options = {}) {
    return this.compute.execute(data, type, options);
  }

  /**
   * 获取指标定义
   */
  getDefinition(indicatorCode) {
    const indicator = INDICATOR_ALIASES[indicatorCode];
    if (!indicator) {
      return {
        error: 'NOT_FOUND',
        message: `未找到指标：${indicatorCode}`
      };
    }

    return {
      code: indicatorCode,
      name: indicator.name,
      name_cn: indicator.name_cn,
      unit: indicator.unit,
      category: indicator.category,
      definition: indicator.definition,
      source: indicator.source
    };
  }

  /**
   * 获取国家备注
   */
  getCountryNote(countryCode) {
    // 这里可以扩展为国家特定的备注信息
    return {
      code: countryCode,
      note: '暂无特殊备注'
    };
  }

  /**
   * 列出所有可用指标
   */
  listIndicators(category = null) {
    let indicators = Object.entries(INDICATOR_ALIASES).map(([code, info]) => ({
      code,
      name: info.name,
      name_cn: info.name_cn,
      unit: info.unit,
      category: info.category
    }));

    if (category) {
      indicators = indicators.filter(i => i.category === category);
    }

    return indicators;
  }

  /**
   * 列出国家群组
   */
  listCountryGroups() {
    return Object.entries(COUNTRY_ALIASES).map(([key, info]) => ({
      key,
      name: info._name,
      note: info._note,
      count: info.codes.length
    }));
  }

  // ========== 内部方法 ==========

  /**
   * 解析国家（支持群组别名）
   */
  _resolveCountries(input) {
    if (!input) return [];
    
    const inputs = Array.isArray(input) ? input : [input];
    const result = [];

    for (const item of inputs) {
      // 1. 直接是国家代码
      if (/^[A-Z]{3}$/.test(item)) {
        result.push(item);
        continue;
      }

      // 2. 检查群组别名
      const key = item.toLowerCase().replace(/\s+/g, '_');
      if (COUNTRY_ALIASES[key]) {
        result.push(...COUNTRY_ALIASES[key].codes);
        continue;
      }

      // 3. 模糊匹配群组名称
      for (const [groupKey, group] of Object.entries(COUNTRY_ALIASES)) {
        if (group._name.toLowerCase().includes(item.toLowerCase()) ||
            item.toLowerCase().includes(group._name.toLowerCase())) {
          result.push(...group.codes);
          break;
        }
      }
    }

    return [...new Set(result)];
  }

  /**
   * 解析指标
   */
  _resolveIndicator(input) {
    if (!input) return null;

    // 1. 直接是指标代码
    if (/^[A-Z._]+$/.test(input) && INDICATOR_ALIASES[input]) {
      return input;
    }

    // 2. 检查别名
    const lowerInput = input.toLowerCase();
    for (const [code, info] of Object.entries(INDICATOR_ALIASES)) {
      if (info.aliases.some(alias => alias.toLowerCase() === lowerInput)) {
        return code;
      }
    }

    // 3. 模糊匹配
    for (const [code, info] of Object.entries(INDICATOR_ALIASES)) {
      if (info.name.toLowerCase().includes(lowerInput) ||
          info.name_cn.toLowerCase().includes(lowerInput)) {
        return code;
      }
    }

    return null;
  }

  /**
   * 解析年份
   */
  _parseYears(years) {
    if (Array.isArray(years) && years.length === 2) {
      return { from: years[0], to: years[1] };
    }
    
    if (typeof years === 'string') {
      const match = years.match(/(\d{4})\s*[-–—]\s*(\d{4})/);
      if (match) {
        return { from: parseInt(match[1]), to: parseInt(match[2]) };
      }
    }

    return { from: null, to: null };
  }

  /**
   * 格式化结果
   */
  _formatResult(apiResult, options) {
    const { indicator, countries, includeMetadata } = options;
    
    // 转换 API 响应为紧凑格式
    const data = apiResult.value.map(record => ({
      country: record.REF_AREA,
      year: parseInt(record.TIME_PERIOD),
      value: parseFloat(record.OBS_VALUE),
      unit: record.UNIT_MEASURE,
      isForecast: false  // WDI 不区分实际/预测
    }));

    // 按国家分组
    const grouped = {};
    for (const item of data) {
      if (!grouped[item.country]) {
        grouped[item.country] = {
          country: item.country,
          indicator,
          unit: item.unit,
          data: []
        };
      }
      grouped[item.country].data.push({
        year: item.year,
        value: item.value
      });
    }

    // 对每个国家的数据按年份排序
    for (const country of Object.keys(grouped)) {
      grouped[country].data.sort((a, b) => a.year - b.year);
    }

    const result = {
      success: true,
      count: data.length,
      data: Object.values(grouped)
    };

    if (includeMetadata) {
      result.metadata = {
        database: this.defaultDatabase,
        indicator,
        countries,
        source: 'World Bank Data360',
        url: 'https://data.worldbank.org'
      };
    }

    return result;
  }

  /**
   * 生成标题
   */
  _generateTitle(result) {
    const indicator = result.metadata?.indicator || 'Indicator';
    const countries = result.data.map(d => d.country).join(', ');
    return `${indicator} - ${countries}`;
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.client.clearCache();
  }

  /**
   * 获取缓存统计
   */
  getCacheStats() {
    return this.client.getCacheStats();
  }
}

module.exports = WorldBankAnalyzer;
