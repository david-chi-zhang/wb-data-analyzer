# World Bank Data360 Analyzer

Professional data analysis tool for World Bank WDI (World Development Indicators) database with IMF WEO style HTML output.

## Features

- 📊 **Data Query** - Full WDI database support with auto-pagination
- 🌐 **Natural Language** - Chinese/English query parsing
- 🧮 **Computation** - Growth rate, CAGR, index, weighted average
- 📈 **IMF WEO Style** - Professional HTML reports with CSV/PNG export
- 🌍 **Country Groups** - 40+ predefined groups (BRICS, NDB, income groups, regions)
- 📋 **Indicators** - 30+ core indicators with aliases

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run examples
npm run example
```

## Usage

```javascript
const WorldBankAnalyzer = require('./src/index');
const analyzer = new WorldBankAnalyzer({
  cacheDir: './data/cache',
  cacheEnabled: true
});

// Query data
const result = await analyzer.query({
  countries: ['IND'],
  indicator: 'WB_WDI_NV_AGR_TOTL_ZS',
  years: [2010, 2023]
});

// Generate IMF WEO style HTML report
const chart = await analyzer.chart({
  countries: ['IND'],
  indicator: 'WB_WDI_NE_TRD_GNFS_ZS',
  years: [2010, 2023],
  title: 'India: Trade Openness Indicators'
});

// Save HTML file
const fs = require('fs');
fs.writeFileSync('india_trade.html', chart.chart);
```

## Natural Language Query

```javascript
// Chinese
analyzer.parseAndQuery('印度贸易总额占 GDP 比重 2010-2023');

// English
analyzer.parseAndQuery('India trade as a share of GDP 2010-2023');
```

## Project Structure

```
wb-data-analyzer/
├── src/
│   ├── index.js            # Main entry
│   ├── api/client.js       # API client
│   ├── query/parser.js     # Natural language parser
│   ├── compute/index.js    # Computation module
│   └── viz/chart.js        # Chart generator (IMF WEO style)
├── data/aliases/
│   ├── countries.json      # 40+ country groups
│   └── indicators.json     # 30+ indicator aliases
├── docs/                   # Documentation
├── examples/               # Example code
├── tests/                  # Test scripts
└── package.json
```

## Key Indicators

### GDP & GNI
- `WB_WDI_NY_GDP_MKTP.CD` - GDP (current US$)
- `WB_WDI_NY_GDP_MKTP.KD.ZG` - GDP growth (annual %)
- `WB_WDI_NY_GNP_PCAP.CD` - GNI per capita, Atlas method

### Sector Share
- `WB_WDI_NV_AGR_TOTL.ZS` - Agriculture (% of GDP)
- `WB_WDI_NV_IND_TOTL.ZS` - Industry (% of GDP)
- `WB_WDI_NV_IND_MANF.ZS` - Manufacturing (% of GDP)
- `WB_WDI_NV_SRV_TOTL.ZS` - Services (% of GDP)

### Trade
- `WB_WDI_NE_TRD_GNFS.ZS` - Trade (% of GDP)
- `WB_WDI_TG_VAL_TOTL_GD.ZS` - Merchandise trade (% of GDP)
- `WB_WDI_NE_EXP_GNFS.ZS` - Exports (% of GDP)
- `WB_WDI_NE_IMP_GNFS.ZS` - Imports (% of GDP)

## Country Groups

- **BRICS**: `brics_founding` (5 countries), `brics` (10 countries)
- **NDB Members**: `ndb_members` (9 countries)
- **Income Groups**: `high_income`, `upper_middle_income`, `lower_middle_income`, `low_income`
- **Regions**: `asia`, `europe`, `africa`, `americas`, etc.

## Documentation

- [HTML Output Standard](docs/HTML_OUTPUT_STANDARD.md) - IMF WEO style specification
- [Export Feature](docs/EXPORT_FEATURE.md) - CSV/PNG export guide
- [Trade Indicators](docs/TRADE_INDICATORS.md) - Trade indicator details
- [Final Delivery](docs/FINAL_DELIVERY.md) - Complete delivery summary

## License

MIT

## Author

Created with World Bank Data360 API
