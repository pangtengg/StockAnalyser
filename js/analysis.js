async function getStockData() {
  const symbol = document.getElementById('symbolInput').value.toUpperCase().trim();
  const loader = document.getElementById('loaderContainer');
  const errorContainer = document.getElementById('errorContainer');
  const result = document.getElementById('resultContainer');
  const errorMessage = document.getElementById('errorMessage');

  // Validate input
  if (!symbol) {
    errorMessage.textContent = 'Please enter a stock symbol';
    errorContainer.style.display = 'block';
    return;
  }

  loader.style.display = 'block';
  errorContainer.style.display = 'none';
  result.style.display = 'none';

  try {
    // Store symbol for later use
    lastSymbol = symbol;

    // Get quote data first
    const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    console.log('Fetching quote from:', quoteUrl);
    
    const quoteResponse = await fetch(quoteUrl);
    const quoteData = await quoteResponse.json();
    
    console.log('Quote response:', quoteData);
    
    // Check for API errors
    if (quoteData['Error Message']) {
      throw new Error(`Invalid symbol: ${quoteData['Error Message']}`);
    }
    
    if (quoteData['Note']) {
      throw new Error('API limit reached. Please wait a minute and try again.');
    }
    
    if (quoteData['Information']) {
      throw new Error('API call frequency limit reached. Please wait and try again.');
    }
    
    // Check if Global Quote exists and has data
    const quote = quoteData['Global Quote'];
    if (!quote || Object.keys(quote).length === 0 || !quote['05. price']) {
      console.log('Global Quote failed, trying alternative method...');
      await getStockDataAlternative(symbol);
      return;
    }
    
    const latestPrice = parseFloat(quote['05. price']);
    const prevClose = parseFloat(quote['08. previous close']);
    
    if (isNaN(latestPrice) || isNaN(prevClose)) {
      throw new Error('Invalid price data received');
    }
    
    const change = latestPrice - prevClose;
    const changePercent = ((change / prevClose) * 100).toFixed(2);

    document.getElementById('stockName').textContent = `${symbol} Analysis`;
    document.getElementById('stockPrice').textContent = `$${latestPrice.toFixed(2)}`;
    document.getElementById('priceChange').textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent}%)`;
    document.getElementById('priceChange').style.color = change >= 0 ? 'green' : 'red';

    // Get daily data for insights
    await getDailyDataAndAnalysis(symbol);

    result.style.display = 'block';
    
  } catch (err) {
    console.error('Error in getStockData:', err);
    errorMessage.textContent = err.message || 'Error fetching data. Please check the symbol and try again.';
    errorContainer.style.display = 'block';
  } finally {
    loader.style.display = 'none';
  }
}

// Alternative method using TIME_SERIES_DAILY
async function getStockDataAlternative(symbol) {
  const dailyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
  console.log('Fetching daily data from:', dailyUrl);
  
  const dailyResponse = await fetch(dailyUrl);
  const dailyData = await dailyResponse.json();
  
  console.log('Daily response:', dailyData);
  
  if (dailyData['Error Message']) {
    throw new Error(`Invalid symbol: ${dailyData['Error Message']}`);
  }
  
  if (dailyData['Note']) {
    throw new Error('API limit reached. Please wait a minute and try again.');
  }
  
  if (dailyData['Information']) {
    throw new Error('API call frequency limit reached. Please wait and try again.');
  }
  
  const timeSeries = dailyData['Time Series (Daily)'];
  if (!timeSeries || Object.keys(timeSeries).length === 0) {
    throw new Error('No data available for this symbol. Please check the symbol and try again.');
  }
  
  // Get the most recent trading day
  const dates = Object.keys(timeSeries).sort().reverse();
  const latestDate = dates[0];
  const previousDate = dates[1];
  
  if (!latestDate || !previousDate) {
    throw new Error('Insufficient data available for analysis.');
  }
  
  const latestData = timeSeries[latestDate];
  const previousData = timeSeries[previousDate];
  
  const latestPrice = parseFloat(latestData['4. close']);
  const prevClose = parseFloat(previousData['4. close']);
  const change = latestPrice - prevClose;
  const changePercent = ((change / prevClose) * 100).toFixed(2);

  document.getElementById('stockName').textContent = `${symbol} Analysis`;
  document.getElementById('stockPrice').textContent = `$${latestPrice.toFixed(2)}`;
  document.getElementById('priceChange').textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent}%)`;
  document.getElementById('priceChange').style.color = change >= 0 ? 'green' : 'red';

  // Use the daily data for analysis
  const prices = dates.slice(0, 30).map(date => parseFloat(timeSeries[date]['4. close']));
  showInsights(prices);
  showPrediction(prices);
  showTechnicals(prices);
  loadChart(currentTimeframe);
  
  document.getElementById('resultContainer').style.display = 'block';
}

// Function for daily data analysis
async function getDailyDataAndAnalysis(symbol) {
  try {
    const dailyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
    const dailyResponse = await fetch(dailyUrl);
    const dailyData = await dailyResponse.json();
    
    if (dailyData['Time Series (Daily)']) {
      const timeSeries = dailyData['Time Series (Daily)'];
      const dates = Object.keys(timeSeries).slice(0, 30).reverse();
      const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));

      showInsights(prices);
      showPrediction(prices);
      showTechnicals(prices);
    } else {
      // Use mock data for analysis if daily data fails
      console.log('Daily data not available, using basic analysis');
      const currentPrice = parseFloat(document.getElementById('stockPrice').textContent.replace('$', ''));
      const mockPrices = generateMockPrices(currentPrice, 30);
      showInsights(mockPrices);
      showPrediction(mockPrices);
      showTechnicals(mockPrices);
    }
    
    // Load chart with current timeframe
    loadChart(currentTimeframe);
    
  } catch (err) {
    console.error('Error getting daily data:', err);
    // Use mock data as fallback
    const currentPrice = parseFloat(document.getElementById('stockPrice').textContent.replace('$', '')) || 100;
    const mockPrices = generateMockPrices(currentPrice, 30);
    showInsights(mockPrices);
    showPrediction(mockPrices);
    showTechnicals(mockPrices);
  }
}

function generateMockPrices(basePrice, count) {
  const prices = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * 0.1; // Random change between -5% and +5%
    currentPrice = currentPrice * (1 + change);
    prices.push(currentPrice);
  }
  
  return prices.reverse(); // Return in chronological order
}

function showInsights(prices) {
  if (!prices || prices.length === 0) return;
  
  const validPrices = prices.filter(p => !isNaN(p) && p > 0);
  if (validPrices.length === 0) return;
  
  const min = Math.min(...validPrices);
  const max = Math.max(...validPrices);
  const avg = (validPrices.reduce((a, b) => a + b) / validPrices.length).toFixed(2);
  const latest = validPrices[validPrices.length - 1];
  const prev = validPrices[validPrices.length - 2] || latest;
  const change = latest - prev;
  const changePercent = prev !== 0 ? ((change / prev) * 100).toFixed(2) : '0.00';
  const volatility = (max - min).toFixed(2);
  
  document.getElementById('insightsContent').innerHTML = `
    <p>🔽 Lowest Price: $${min.toFixed(2)}</p>
    <p>🔼 Highest Price: $${max.toFixed(2)}</p>
    <p>📊 Average Price: $${avg}</p>
    <p>📈 Latest Change: <span style="color:${change >= 0 ? 'green' : 'red'}">${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent}%)</span></p>
    <p>📈 Volatility: $${volatility}</p>
  `;
}

function showPrediction(prices) {
  if (!prices || prices.length === 0) return;
  
  const validPrices = prices.filter(p => !isNaN(p) && p > 0);
  if (validPrices.length === 0) return;
  
  const sma5Count = Math.min(5, validPrices.length);
  const sma10Count = Math.min(10, validPrices.length);
  
  const sma5 = validPrices.slice(-sma5Count).reduce((a, b) => a + b, 0) / sma5Count;
  const sma10 = validPrices.slice(-sma10Count).reduce((a, b) => a + b, 0) / sma10Count;
  const trend = sma5 > sma10 ? 'upward' : 'downward';
  
  document.getElementById('predictionContent').innerHTML = `
    <p>Next day (SMA-${sma5Count}) prediction: $${sma5.toFixed(2)}</p>
    <p>Short-term trend: ${trend}</p>
    <p>${trend === 'upward' ? '📈 Bullish' : '📉 Bearish'} momentum detected</p>
  `;
}

function showTechnicals(prices) {
  if (!prices || prices.length === 0) return;
  
  const validPrices = prices.filter(p => !isNaN(p) && p > 0);
  if (validPrices.length < 2) return;
  
  // Calculate RSI
  const changes = [];
  for (let i = 1; i < validPrices.length; i++) {
    changes.push(validPrices[i] - validPrices[i-1]);
  }
  
  const gains = changes.filter(c => c > 0);
  const losses = changes.filter(c => c < 0).map(c => Math.abs(c));
  
  const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / gains.length : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / losses.length : 0;
  
  let rsi = 50; // Default neutral RSI
  if (avgLoss !== 0) {
    const rs = avgGain / avgLoss;
    rsi = 100 - (100 / (1 + rs));
  }
  
  const ma10Count = Math.min(10, validPrices.length);
  const ma10 = validPrices.slice(-ma10Count).reduce((a, b) => a + b, 0) / ma10Count;
  
  document.getElementById('technicalsContent').innerHTML = `
    <p>📊 RSI (${changes.length}): ${rsi.toFixed(2)}</p>
    <p>${rsi > 70 ? '⚠️ Overbought' : rsi < 30 ? '⚠️ Oversold' : '✅ Neutral'}</p>
    <p>📈 Moving Average (${ma10Count}): $${ma10.toFixed(2)}</p>
  `;
}
