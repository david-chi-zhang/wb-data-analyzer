/**
 * 自然语言查询解析器
 * 将用户输入转换为结构化查询参数
 */

class QueryParser {
  constructor() {
    this.actions = {
      query: /查询 | 获取 | 显示 | 数据|query|get|show/i,
      chart: /画图 | 图表 | 可视化 | plot|chart|graph/i,
      define: /定义 | 是什么 | 含义 | definition|mean/i,
      note: /备注 | 说明 | note|fiscal/i,
      list: /列表 | 清单 | list|all/i
    };
  }

  /**
   * 解析用户输入
   */
  parse(input, context = {}) {
    const { countryAliases = {}, indicatorAliases = {} } = context;
    
    const result = {
      action: 'query',
      countries: [],
      indicator: null,
      years: null,
      title: null
    };

    // 1. 检测动作类型
    result.action = this._detectAction(input);

    // 2. 提取国家
    result.countries = this._extractCountries(input, countryAliases);

    // 3. 提取指标
    result.indicator = this._extractIndicator(input, indicatorAliases);

    // 4. 提取年份
    result.years = this._extractYears(input);

    // 5. 生成标题
    result.title = this._generateTitle(result);

    return result;
  }

  /**
   * 检测动作类型
   */
  _detectAction(input) {
    for (const [action, pattern] of Object.entries(this.actions)) {
      if (pattern.test(input)) {
        return action;
      }
    }
    return 'query';
  }

  /**
   * 提取国家
   */
  _extractCountries(input, aliases) {
    const countries = [];
    const lowerInput = input.toLowerCase();

    // 1. 检查国家群组别名
    for (const [key, group] of Object.entries(aliases)) {
      if (key !== '_comment' && key !== '_updated' && group.codes) {
        const groupName = group._name?.toLowerCase() || key.toLowerCase();
        if (lowerInput.includes(groupName) || 
            (group._note && lowerInput.includes(group._note.toLowerCase()))) {
          countries.push(...group.codes);
        }
      }
    }

    // 2. 常见国家名称匹配
    const countryPatterns = [
      { pattern: /中国 |china/i, code: 'CHN' },
      { pattern: /美国|usa|united states/i, code: 'USA' },
      { pattern: /日本|japan/i, code: 'JPN' },
      { pattern: /德国|germany/i, code: 'DEU' },
      { pattern: /英国|uk|britain/i, code: 'GBR' },
      { pattern: /法国|france/i, code: 'FRA' },
      { pattern: /印度|india/i, code: 'IND' },
      { pattern: /巴西|brazil/i, code: 'BRA' },
      { pattern: /俄罗斯|russia/i, code: 'RUS' },
      { pattern: /南非|south africa/i, code: 'ZAF' },
      { pattern: /韩国|korea/i, code: 'KOR' },
      { pattern: /意大利|italy/i, code: 'ITA' },
      { pattern: /加拿大|canada/i, code: 'CAN' },
      { pattern: /澳大利亚|australia/i, code: 'AUS' },
      { pattern: /墨西哥|mexico/i, code: 'MEX' },
      { pattern: /印尼|indonesia/i, code: 'IDN' },
      { pattern: /土耳其|turkey/i, code: 'TUR' },
      { pattern: /沙特|saudi/i, code: 'SAU' },
      { pattern: /埃及|egypt/i, code: 'EGY' },
      { pattern: /孟加拉|bangladesh/i, code: 'BGD' },
      { pattern: /阿联酋|uae/i, code: 'ARE' },
      { pattern: /乌拉圭|uruguay/i, code: 'URY' }
    ];

    for (const { pattern, code } of countryPatterns) {
      if (pattern.test(input)) {
        countries.push(code);
      }
    }

    // 3. 提取 3 字母国家代码
    const codeMatches = input.match(/\b[A-Z]{3}\b/g);
    if (codeMatches) {
      countries.push(...codeMatches);
    }

    return [...new Set(countries)];
  }

  /**
   * 提取指标
   */
  _extractIndicator(input, aliases) {
    const lowerInput = input.toLowerCase();

    // 1. 检查指标代码（如 SP.POP.TOTL）
    const codeMatch = input.match(/[A-Z]{2,3}\.[A-Z]{2,3}\.[A-Z]{2,5}\.[A-Z]{2,3}/i);
    if (codeMatch) {
      return codeMatch[0].toUpperCase();
    }

    // 2. 检查别名
    for (const [code, info] of Object.entries(aliases)) {
      if (info.aliases) {
        for (const alias of info.aliases) {
          if (lowerInput.includes(alias.toLowerCase())) {
            return code;
          }
        }
      }
    }

    // 3. 常见指标关键词
    const indicatorKeywords = [
      { pattern: /人口|population/i, code: 'SP.POP.TOTL' },
      { pattern: /gdp.*增长|gdp.*growth/i, code: 'NY.GDP.MKTP.KD.ZG' },
      { pattern: /\bGDP\b(?!.*增长)/i, code: 'NY.GDP.MKTP.CD' },
      { pattern: /人均 gdp|gdp per capita/i, code: 'NY.GDP.PCAP.CD' },
      { pattern: /人均 gni|gni per capita/i, code: 'NY.GNP.PCAP.CD' },
      { pattern: /农业.*占比|agriculture.*share/i, code: 'NV.AGR.TOTL.ZS' },
      { pattern: /工业.*占比|industry.*share/i, code: 'NV.IND.TOTL.ZS' },
      { pattern: /制造.*占比|manufacturing.*share/i, code: 'NV.IND.MANF.ZS' },
      { pattern: /服务.*占比|services.*share/i, code: 'NV.SRV.TOTL.ZS' },
      { pattern: /通胀|inflation|cpi/i, code: 'FP.CPI.TOTL.ZG' },
      { pattern: /失业|unemployment/i, code: 'SL.UEM.TOTL.ZS' },
      { pattern: /出口|export/i, code: 'NE.EXP.GNFS.ZS' },
      { pattern: /进口|import/i, code: 'NE.IMP.GNFS.ZS' },
      { pattern: /贸易|trade/i, code: 'NE.TRD.GNFS.ZS' }
    ];

    for (const { pattern, code } of indicatorKeywords) {
      if (pattern.test(input)) {
        return code;
      }
    }

    return null;
  }

  /**
   * 提取年份
   */
  _extractYears(input) {
    // 年份范围 (2020-2030)
    const rangeMatch = input.match(/(20\d{2})\s*[-–—]\s*(20\d{2})/);
    if (rangeMatch) {
      return [parseInt(rangeMatch[1]), parseInt(rangeMatch[2])];
    }

    // 单一年份
    const singleMatch = input.match(/\b(20\d{2})\b/);
    if (singleMatch) {
      const year = parseInt(singleMatch[1]);
      return [year, year];
    }

    return null;
  }

  /**
   * 生成标题
   */
  _generateTitle(result) {
    const parts = [];
    
    if (result.indicator) {
      parts.push(result.indicator);
    }
    
    if (result.countries.length > 0) {
      parts.push(result.countries.slice(0, 3).join(', '));
      if (result.countries.length > 3) {
        parts.push(`等${result.countries.length}国`);
      }
    }
    
    if (result.years) {
      parts.push(`${result.years[0]}-${result.years[1]}`);
    }

    return parts.join(' ');
  }
}

module.exports = QueryParser;
