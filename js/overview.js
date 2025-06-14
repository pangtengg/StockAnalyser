// const ALPHA_VANTAGE_API_KEY = 'VSI4SC8YE7ZOIOZD';
const ALPHA_VANTAGE_API_KEY = 'YXYHJADJTF1J54Z5';
const ETF_SYMBOLS = [
  { symbol: 'SPY', name: 'S&P 500' },
  { symbol: 'DIA', name: 'Dow Jones' },
  { symbol: 'QQQ', name: 'NASDAQ-100' },
  { symbol: 'EWU', name: 'FTSE 100 (UK)' },
  { symbol: 'EWG', name: 'DAX (Germany)' },
  { symbol: 'EWJ', name: 'Nikkei 225 (Japan)' }
];

async function loadGlobalMarkets() {
  const overviewLoader = document.getElementById('overviewLoader');
  if (overviewLoader) overviewLoader.style.display = 'block';

  try {
    const globalData = await Promise.all(
      ETF_SYMBOLS.map(async (etf) => {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${etf.symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
        );
        const data = await response.json();
        const quote = data['Global Quote'];

        if (!quote || Object.keys(quote).length === 0) {
        throw new Error("No data found for symbol");
        }

        return {
          name: etf.name,
          symbol: etf.symbol,
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'])
        };
      })
    );

    renderMarketDataAlpha(globalData);
  } catch (error) {
    console.error('Alpha Vantage API Error:', error);
    loadMockMarketData();
  } finally {
    if (overviewLoader) overviewLoader.style.display = 'none';
  }
}

function renderMarketDataAlpha(indices) {
  console.log('Rendering enhanced market data:', indices);
  
  const globalMarketData = document.getElementById('global-market-data');
  
  if (globalMarketData) {
    globalMarketData.innerHTML = indices.map((index, i) => {
      const isPositive = index.change >= 0;
      const changeClass = isPositive ? 'positive' : 'negative';
      const cardClass = isPositive ? '' : 'negative';
      const arrow = isPositive ? '↑' : '↓';
      
      // Calculate additional indicators
      const dayRange = {
        low: (index.price - Math.abs(index.change)).toFixed(2),
        high: (index.price + Math.abs(index.change)).toFixed(2)
      };
      
      const volume = Math.floor(Math.random() * 1000000) + 500000; // Simulated volume
      const formattedVolume = (volume / 1000000).toFixed(2) + 'M';
      
      return `
        <div class="market-index-card ${cardClass}" style="animation-delay: ${i * 0.1}s;">
          <div class="market-index-header">
            <h4 class="market-index-name">${index.name}</h4>
            <span class="market-index-symbol">${index.symbol}</span>
          </div>
          
          <div class="market-index-price">$${index.price.toFixed(2)}</div>
          
          <div class="market-index-change ${changeClass}">
            <span class="change-arrow">${arrow}</span>
            <span>${isPositive ? '+' : ''}${index.change.toFixed(2)}</span>
            <span class="change-percentage ${changeClass}">
              ${Math.abs(index.changePercent).toFixed(2)}%
            </span>
          </div>

          <div class="market-index-indicators">
            <div class="indicator-row">
              <span class="indicator-label">Day Range:</span>
              <span class="indicator-value">$${dayRange.low} - $${dayRange.high}</span>
            </div>
            <div class="indicator-row">
              <span class="indicator-label">Volume:</span>
              <span class="indicator-value">${formattedVolume}</span>
            </div>
            <div class="indicator-row">
              <span class="indicator-label">Market Cap:</span>
              <span class="indicator-value">Large Cap</span>
            </div>
            <div class="indicator-row">
              <span class="indicator-label">Status:</span>
              <span class="indicator-value status-${isPositive ? 'up' : 'down'}">${isPositive ? 'Bullish' : 'Bearish'}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    console.log('Enhanced HTML updated successfully');
  } else {
    console.error('global-market-data element not found!');
  }
}

// Enhanced loading state
function showMarketLoading() {
  const globalMarketOverview = document.getElementById('global-market-overview');
  if (globalMarketOverview) {
    globalMarketOverview.innerHTML = Array(6).fill(0).map((_, i) => `
      <div class="market-loading-card" style="animation-delay: ${i * 0.1}s;">
        <div class="market-loading-skeleton" style="width: 60%;"></div>
        <div class="market-loading-skeleton" style="width: 40%; height: 30px; margin: 1rem 0;"></div>
        <div class="market-loading-skeleton" style="width: 80%;"></div>
      </div>
    `).join('');
  }
}