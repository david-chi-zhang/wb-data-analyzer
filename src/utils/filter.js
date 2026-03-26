/**
 * 国家/地区过滤工具
 * 排除 World Bank 的聚合代码，只保留单一主权国家
 */

// World Bank 聚合代码排除列表
const AGGREGATE_CODES = new Set([
  // X* 系列 - 收入/区域聚合
  'XO', 'XP', 'XD', 'XT', 'XN', 'XU', 'XC', 'XG', 'XJ', 'XQ', 'XF', 'XE', 'XM', 'XI', 'XH', 'XL',
  // Z* 系列 - 大区域聚合
  'ZT', 'ZJ', 'ZQ', 'ZG', 'ZF', 'ZH', 'ZI', 'Z7', 'Z4',
  // T* 系列 - IDA/IBRD 区域聚合
  'T5', 'T2', 'T3', 'T6', 'T7', 'T4',
  // V* 系列 - 人口红利阶段
  'V4', 'V3', 'V2', 'V1',
  // 数字 + 字母 - 特殊聚合
  '1W', '1A', '4E', '7E', '8S', 'B8', 'F1',
  // 2 字母例外
  'EU', 'OE'
]);

/**
 * 判断是否为单一主权国家
 * @param {string} countryCode - 国家/地区代码
 * @returns {boolean} true = 单一国家，false = 聚合/群组
 */
function isSingleCountry(countryCode) {
  if (!countryCode || typeof countryCode !== 'string') {
    return false;
  }
  
  // 排除已知的聚合代码
  if (AGGREGATE_CODES.has(countryCode)) {
    return false;
  }
  
  // 单一国家通常是 2 字母 ISO 代码
  return /^[A-Z]{2}$/.test(countryCode);
}

/**
 * 过滤数据，只保留单一主权国家
 * @param {Array} data - World Bank API 返回的数据数组
 * @returns {Array} 过滤后的数据
 */
function filterSingleCountries(data) {
  return data.filter(item => isSingleCountry(item.country?.id));
}

module.exports = {
  isSingleCountry,
  filterSingleCountries,
  AGGREGATE_CODES
};
