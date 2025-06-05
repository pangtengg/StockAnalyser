// const API_KEY = 'YXYHJADJTF1J54Z5';
const API_KEY = 'NUNK8MPSE4NGTTVN';

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
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${etf.symbol}&apikey=${API_KEY}`
        );
        const data = await response.json();
        const quote = data['Global Quote'];

        if (!quote || Object.keys(quote).length === 0) {
          throw new Error("No data found for symbol: " + etf.symbol);
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
    loadMockMarketData(); // fallback
  } finally {
    if (overviewLoader) overviewLoader.style.display = 'none';
  }
}

function renderMarketDataAlpha(indices) {
  console.log('Rendering enhanced market data:', indices);

  const globalMarketOverview = document.getElementById('global-market-data');

  if (globalMarketOverview) {
    globalMarketOverview.innerHTML = indices.map((index, i) => {
      const isPositive = index.change >= 0;
      const changeClass = isPositive ? 'positive' : 'negative';
      const arrow = isPositive ? '↑' : '↓';

      return `
        <div class="market-index-card ${changeClass}" style="animation-delay: ${i * 0.1}s;">
          <div class="market-index-header">
            <h4 class="market-index-name">${index.name}</h4>
            <span class="market-index-symbol">${index.symbol}</span>
          </div>

          <div class="market-index-price">$${index.price.toFixed(2)}</div>

          <div class="market-index-change ${changeClass}">
            <span class="change-arrow">${arrow}</span>
            <span>${isPositive ? '+' : ''}${index.change.toFixed(2)}</span>
            <span class="change-percentage">
              ${Math.abs(index.changePercent).toFixed(2)}%
            </span>
          </div>
        </div>
      `;
    }).join('');

    console.log('Enhanced HTML updated successfully');
  } else {
    console.error('global-market-overview element not found!');
  }
}

function showMarketLoading() {
  const globalMarketOverview = document.getElementById('global-market-data');
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
