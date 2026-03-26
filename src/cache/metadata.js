/**
 * 元数据缓存管理
 * 缓存 World Bank 指标定义、国家列表等元数据
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const CACHE_DIR = path.join(__dirname, '../../data/metadata');
const CACHE_TTL = {
  indicators: 30 * 24 * 60 * 60 * 1000, // 30 天
  countries: 30 * 24 * 60 * 60 * 1000,   // 30 天
  series: 7 * 24 * 60 * 60 * 1000        // 7 天
};

// World Bank 聚合代码排除列表
const AGGREGATE_CODES = new Set([
  // X* 系列 - 收入/区域聚合
  'XO', 'XP', 'XD', 'XT', 'XN', 'XU', 'XC', 'XG', 'XJ', 'XQ', 'XF', 'XE', 'XM', 'XI', 'XH', 'XL', 'XY', 'XK',
  // Z* 系列 - 大区域聚合
  'ZT', 'ZJ', 'ZQ', 'ZG', 'ZF', 'ZH', 'ZI', 'Z7', 'Z4', 'ZA', 'ZB', 'ZW', 'ZM',
  // T* 系列 - IDA/IBRD 区域聚合
  'T5', 'T2', 'T3', 'T6', 'T7', 'T4',
  // V* 系列 - 人口红利阶段
  'V4', 'V3', 'V2', 'V1',
  // 数字 + 字母 - 特殊聚合
  '1W', '1A', '4E', '7E', '8S', 'B8', 'F1', 'F6',
  // IFC 分类聚合
  'A9', 'B4', 'B7', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'JG', 'M1', 'M2', 'N6', 'R6', 'S1', 'S2', 'S3', 'S4',
  // 其他聚合
  'A4', 'A5', 'B1', 'B2', 'B3', 'B6',
  // 2 字母例外
  'EU', 'OE', 'XD'
]);

class MetadataCache {
  constructor() {
    this.ensureCacheDir();
  }

  ensureCacheDir() {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  }

  getCachePath(type) {
    return path.join(CACHE_DIR, `${type}.json`);
  }

  isCacheValid(type) {
    const cachePath = this.getCachePath(type);
    if (!fs.existsSync(cachePath)) return false;
    
    try {
      const stat = fs.statSync(cachePath);
      const age = Date.now() - stat.mtimeMs;
      const ttl = CACHE_TTL[type] || 7 * 24 * 60 * 60 * 1000;
      return age < ttl;
    } catch {
      return false;
    }
  }

  async fetchIndicators() {
    console.log('📊 获取指标列表...');
    const response = await axios.get('https://api.worldbank.org/v2/indicator', {
      params: { format: 'json', per_page: 5000 }
    });
    
    const indicators = response.data[1];
    console.log(`✅ 获取到 ${indicators.length} 个指标`);
    
    // 按主题分类
    const byTopic = {};
    indicators.forEach(ind => {
      const topic = ind.source?.value || 'Other';
      if (!byTopic[topic]) byTopic[topic] = [];
      byTopic[topic].push({
        id: ind.id,
        name: ind.name,
        sourceNote: ind.sourceNote,
        sourceOrganization: ind.sourceOrganization
      });
    });
    
    return {
      all: indicators.map(i => ({ id: i.id, name: i.name })),
      byTopic,
      count: indicators.length,
      updatedAt: new Date().toISOString()
    };
  }

  async fetchCountries() {
    console.log('🌍 获取国家/地区列表...');
    const response = await axios.get('https://api.worldbank.org/v2/country', {
      params: { format: 'json', per_page: 500 }
    });
    
    const countries = response.data[1];
    console.log(`✅ 获取到 ${countries.length} 个经济体`);
    
    // 区分单一国家和聚合（使用与 filter.js 一致的逻辑）
    const singleCountries = countries.filter(c => {
      const code = c.iso2Code;
      if (!code || code.length !== 2) return false;
      if (AGGREGATE_CODES.has(code)) return false;
      return true;
    });
    
    const aggregates = countries.filter(c => !singleCountries.includes(c));
    
    return {
      all: countries.map(c => ({
        id: c.id,
        iso2Code: c.iso2Code,
        name: c.name,
        capitalCity: c.capitalCity,
        region: c.region?.value,
        incomeLevel: c.incomeLevel?.value
      })),
      singleCountries: singleCountries.map(c => ({
        id: c.id,
        iso2Code: c.iso2Code,
        name: c.name
      })),
      aggregates: aggregates.map(c => ({
        id: c.id,
        name: c.name
      })),
      count: countries.length,
      singleCount: singleCountries.length,
      aggregateCount: aggregates.length,
      updatedAt: new Date().toISOString()
    };
  }

  async get(type, fetchFn) {
    const cachePath = this.getCachePath(type);
    
    // 检查缓存
    if (this.isCacheValid(type)) {
      console.log(`[Cache Hit] ${type}`);
      return JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    }
    
    // 获取新数据
    console.log(`[Cache Miss] ${type} - 获取新数据...`);
    const data = await fetchFn();
    
    // 保存缓存
    fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
    console.log(`✅ 缓存已保存：${cachePath}`);
    
    return data;
  }

  async refreshAll() {
    console.log('🔄 刷新所有元数据缓存...\n');
    
    const indicators = await this.get('indicators', () => this.fetchIndicators());
    const countries = await this.get('countries', () => this.fetchCountries());
    
    console.log('\n✅ 元数据缓存更新完成');
    console.log(`   指标：${indicators.count} 个`);
    console.log(`   国家/地区：${countries.count} 个`);
    console.log(`   单一国家：${countries.singleCount} 个`);
    console.log(`   聚合/区域：${countries.aggregateCount} 个`);
    
    return { indicators, countries };
  }

  invalidate(type) {
    const cachePath = this.getCachePath(type);
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
      console.log(`✅ 已删除缓存：${type}`);
    }
  }
}

module.exports = new MetadataCache();
