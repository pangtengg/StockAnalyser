async function loadChart(timeframe) {
  currentTimeframe = timeframe;
  const symbol = document.getElementById('symbolInput').value.toUpperCase().trim();
  if (!symbol) return alert("Please enter a stock symbol");
  
  lastSymbol = symbol; // Store in variable instead of localStorage

  document.getElementById('loaderContainer').style.display = 'block';

  try {
    let apiFunction, interval, dataKey;
    switch(timeframe) {
      case '1D':
        apiFunction = 'TIME_SERIES_INTRADAY';
        interval = '60min';
        dataKey = `Time Series (${interval})`;
        break;
      case '1W':
      case '1M':
      case '3M':
        apiFunction = 'TIME_SERIES_DAILY';
        dataKey = 'Time Series (Daily)';
        break;
      case '1Y':
        apiFunction = 'TIME_SERIES_MONTHLY';
        dataKey = 'Monthly Time Series';
        break;
      default:
        apiFunction = 'TIME_SERIES_DAILY';
        dataKey = 'Time Series (Daily)';
    }

    let url = `https://www.alphavantage.co/query?function=${apiFunction}&symbol=${symbol}&apikey=${API_KEY}`;
    if (timeframe === '1D') url += `&interval=${interval}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data['Error Message']) throw new Error(data['Error Message']);
    if (data['Note']) throw new Error('API limit reached. Please try again later.');
    if (data['Information']) throw new Error('API call frequency limit reached. Please wait and try again.');

    const timeSeries = data[dataKey];
    if (!timeSeries) throw new Error('No data available for this timeframe');

    const entries = Object.entries(timeSeries);
    const labels = entries.map(entry => entry[0]).slice(0, 50).reverse();
    
    if (chart) chart.destroy();

    const ctx = document.getElementById('stockChart');
    
    if (currentChartType === 'candlestick') {
      const ohlcData = labels.map(label => ({
        t: new Date(label).getTime(),
        o: parseFloat(timeSeries[label]['1. open']),
        h: parseFloat(timeSeries[label]['2. high']),
        l: parseFloat(timeSeries[label]['3. low']),
        c: parseFloat(timeSeries[label]['4. close'])
      }));

      chart = new Chart(ctx, {
        type: 'candlestick',
        data: {
          datasets: [{
            label: symbol,
            data: ohlcData,
            color: {
              up: '#00ff00', 
              down: '#ff0000', 
              unchanged: '#999999'
            }
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'time', 
              time: { 
                unit: timeframe === '1D' ? 'hour' : 'day'
              }
            }
          }
        }
      });
    } else {
      const prices = labels.map(label => parseFloat(timeSeries[label]['4. close']));
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Stock Price', 
            data: prices, 
            borderColor: 'blue', 
            fill: false, 
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { 
              title: { display: true, text: 'Date' },
              ticks: {
                maxTicksLimit: 10
              }
            },
            y: { title: { display: true, text: 'Price (USD)' } }
          }
        }
      });
    }
  } catch (error) {
    alert(`Failed to fetch chart data: ${error.message}`);
    console.error(error);
  } finally {
    document.getElementById('loaderContainer').style.display = 'none';
  }
}

function setChartType(type) {
  currentChartType = type;
  if (lastSymbol) {
    loadChart(currentTimeframe);
  }
}