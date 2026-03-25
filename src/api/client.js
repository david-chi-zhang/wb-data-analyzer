/**
 * World Bank Data360 API 客户端
 * 封装 API 调用、分页处理、缓存管理
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://data360api.worldbank.org';

class Data360Client {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || BASE_URL;
    this.timeout = options.timeout || 30000;
    this.cacheDir = options.cacheDir || path.join(__dirname, '../../data/cache');
    this.cacheEnabled = options.cacheEnabled !== false;
    this.cacheTTL = options.cacheTTL || 3600000; // 1 小时
    
    this.ensureCacheDir();
  }

  /**
   * 确保缓存目录存在
   */
  ensureCacheDir() {
    if (this.cacheEnabled && !fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * 生成缓存键
   */
  cacheKey(endpoint, params) {
    const key = `${endpoint}_${JSON.stringify(params)}`;
    return key.replace(/[^a-zA-Z0-9]/g, '_');
  }

  /**
   * 读取缓存
   */
  readCache(key) {
    if (!this.cacheEnabled) return null;
    
    const cacheFile = path.join(this.cacheDir, `${key}.json`);
    if (!fs.existsSync(cacheFile)) return null;
    
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      const age = Date.now() - cached.timestamp;
      
      if (age > this.cacheTTL) {
        fs.unlinkSync(cacheFile);
        return null;
      }
      
      return cached.data;
    } catch (err) {
      return null;
    }
  }

  /**
   * 写入缓存
   */
  writeCache(key, data) {
    if (!this.cacheEnabled) return;
    
    const cacheFile = path.join(this.cacheDir, `${key}.json`);
    fs.writeFileSync(cacheFile, JSON.stringify({
      timestamp: Date.now(),
      data
    }, null, 2));
  }

  /**
   * GET 请求
   */
  async get(endpoint, params = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = this.cacheKey(endpoint, params);
    
    // 检查缓存
    const cached = this.readCache(cacheKey);
    if (cached) {
      console.log(`[Cache Hit] ${endpoint}`);
      return cached;
    }
    
    try {
      console.log(`[API Request] GET ${url}`, params);
      const response = await axios.get(url, {
        params,
        timeout: this.timeout
      });
      
      const data = response.data;
      
      // 写入缓存（只缓存小结果）
      if (data.count <= 1000) {
        this.writeCache(cacheKey, data);
      }
      
      return data;
    } catch (error) {
      console.error(`[API Error] GET ${url}:`, error.message);
      throw new Error(`World Bank API 请求失败：${error.message}`);
    }
  }

  /**
   * POST 请求（用于 search/metadata）
   */
  async post(endpoint, body = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = this.cacheKey(endpoint, body);
    
    const cached = this.readCache(cacheKey);
    if (cached) {
      console.log(`[Cache Hit] POST ${endpoint}`);
      return cached;
    }
    
    try {
      console.log(`[API Request] POST ${url}`, body);
      const response = await axios.post(url, body, {
        timeout: this.timeout,
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = response.data;
      this.writeCache(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error(`[API Error] POST ${url}:`, error.message);
      throw new Error(`World Bank API 请求失败：${error.message}`);
    }
  }

  /**
   * 处理分页（每页最多 1000 条）
   */
  async fetchAll(endpoint, params = {}) {
    const allData = [];
    let skip = 0;
    const limit = 1000;
    let totalCount = null;
    
    while (true) {
      const response = await this.get(endpoint, {
        ...params,
        skip,
        top: limit
      });
      
      if (totalCount === null) {
        totalCount = response.count;
      }
      
      allData.push(...response.value);
      
      // 检查是否还有更多数据
      if (allData.length >= totalCount || response.value.length < limit) {
        break;
      }
      
      skip += limit;
      console.log(`[Pagination] Fetched ${allData.length}/${totalCount}`);
    }
    
    return {
      count: allData.length,
      value: allData,
      totalCount
    };
  }

  /**
   * 获取数据（支持分页选项）
   * @param {Object} params - 查询参数
   * @param {boolean} params.all - 是否获取全部数据（自动分页）
   */
  async getData(params = {}, options = {}) {
    const { all = false, ...queryParams } = params;
    
    if (all) {
      return this.fetchAll('/data360/data', queryParams);
    } else {
      return this.get('/data360/data', queryParams);
    }
  }

  /**
   * 搜索指标
   */
  async searchIndicators(query, options = {}) {
    const {
      top = 20,
      select = 'series_description/idno, series_description/name, series_description/database_id',
      filter = null
    } = options;
    
    const body = {
      count: true,
      select,
      search: query,
      top
    };
    
    if (filter) {
      body.filter = filter;
    }
    
    return this.post('/data360/searchv2', body);
  }

  /**
   * 获取指标列表（从指定数据库）
   */
  async getIndicators(datasetId) {
    return this.get('/data360/indicators', { datasetId });
  }

  /**
   * 获取元数据
   */
  async getMetadata(query) {
    return this.post('/data360/metadata', { query });
  }

  /**
   * 获取指标的分解维度
   */
  async getDisaggregation(datasetId, indicatorId) {
    return this.get('/data360/disaggregation', {
      datasetId,
      indicatorId
    });
  }

  /**
   * 清除缓存
   */
  clearCache() {
    if (!this.cacheEnabled) return;
    
    const files = fs.readdirSync(this.cacheDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.join(this.cacheDir, file));
      }
    }
    console.log('[Cache] Cleared all cache files');
  }

  /**
   * 获取缓存统计
   */
  getCacheStats() {
    if (!this.cacheEnabled) return { enabled: false };
    
    const files = fs.readdirSync(this.cacheDir);
    const cacheFiles = files.filter(f => f.endsWith('.json'));
    
    let totalSize = 0;
    let oldest = null;
    let newest = null;
    
    for (const file of cacheFiles) {
      const filePath = path.join(this.cacheDir, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
      
      if (!oldest || stats.mtime < oldest) oldest = stats.mtime;
      if (!newest || stats.mtime > newest) newest = stats.mtime;
    }
    
    return {
      enabled: true,
      fileCount: cacheFiles.length,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
      oldest: oldest ? oldest.toISOString() : null,
      newest: newest ? newest.toISOString() : null
    };
  }
}

module.exports = Data360Client;
