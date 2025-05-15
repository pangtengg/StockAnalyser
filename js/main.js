const API_KEY = 'JHOFXODQAJLHCHMO'; // Replace with your real API key
let chart;

function showSection(id) {
  const sections = document.querySelectorAll('section');
  const buttons = document.querySelectorAll('.nav-btn');

  sections.forEach(sec => sec.style.display = 'none');
  buttons.forEach(btn => btn.classList.remove('active'));

  document.getElementById(id).style.display = 'block';
  document.querySelector(`[onclick="showSection('${id}')"]`).classList.add('active');

  if (id === 'news') fetchStockNews();
  if (id === 'overview') loadGlobalMarkets();
}

async function getStockData() {
  const symbol = document.getElementById('symbolInput').value.toUpperCase();
  const loader = document.getElementById('loaderContainer');
  const errorContainer = document.getElementById('errorContainer');
  const result = document.getElementById('resultContainer');
  const errorMessage = document.getElementById('errorMessage');

  loader.style.display = 'block';
  errorContainer.style.display = 'none';
  result.style.display = 'none';

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data['Time Series (Daily)']) {
      const timeSeries = data['Time Series (Daily)'];
      const labels = Object.keys(timeSeries).slice(0, 30).reverse();
      const prices = labels.map(date => parseFloat(timeSeries[date]['4. close']));
      const latest = timeSeries[labels[labels.length - 1]];
      const latestPrice = parseFloat(latest['4. close']);
      const prevClose = parseFloat(timeSeries[labels[labels.length - 2]]['4. close']);
      const change = latestPrice - prevClose;
      const changePercent = ((change / prevClose) * 100).toFixed(2);

      document.getElementById('stockName').textContent = `${symbol} Analysis`;
      document.getElementById('stockPrice').textContent = `$${latestPrice.toFixed(2)}`;
      document.getElementById('priceChange').textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent}%)`;
      document.getElementById('priceChange').style.color = change >= 0 ? 'green' : 'red';

      plotChart(labels, prices);
      showInsights(prices);
      showPrediction(prices);

      result.style.display = 'block';
    } else {
      throw new Error(data['Error Message'] || data['Note'] || 'Invalid symbol or API limit reached.');
    }
  } catch (err) {
    errorMessage.textContent = err.message;
    errorContainer.style.display = 'block';
  } finally {
    loader.style.display = 'none';
  }
}

function plotChart(labels, prices) {
  const ctx = document.getElementById('stockChart').getContext('2d');
  if (chart) chart.destroy();

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
        x: { title: { display: true, text: 'Date' } },
        y: { title: { display: true, text: 'Price (USD)' } }
      }
    }
  });
}

function showInsights(prices) {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = (prices.reduce((a, b) => a + b) / prices.length).toFixed(2);

  document.getElementById('insightsContent').innerHTML = `
    <p>🔽 Lowest Price: $${min.toFixed(2)}</p>
    <p>🔼 Highest Price: $${max.toFixed(2)}</p>
    <p>📊 Average Price: $${avg}</p>
  `;
}

function showPrediction(prices) {
  const sma = prices.slice(-5).reduce((a, b) => a + b, 0) / 5;
  document.getElementById('predictionContent').innerHTML = `
    <p>Next day (SMA-5) prediction: $${sma.toFixed(2)}</p>
  `;
}

async function fetchStockNews() {
  document.getElementById('newsLoader').style.display = 'block';
  const newsContainer = document.getElementById('newsContent');
  newsContainer.innerHTML = '';

  try {
    const response = await fetch(`https://gnews.io/api/v4/search?q=stock&lang=en&token=YOUR_NEWS_API_KEY`);
    const data = await response.json();

    const news = data.articles.map(n => `
      <div class="news-card">
        <h4>${n.title}</h4>
        <p>${n.description}</p>
        <a href="${n.url}" target="_blank">Read more</a>
      </div>
    `).join('');

    newsContainer.innerHTML = news;
  } catch (err) {
    newsContainer.innerHTML = `<p>Error fetching news: ${err.message}</p>`;
  } finally {
    document.getElementById('newsLoader').style.display = 'none';
  }
}

async function loadGlobalMarkets() {
  document.getElementById('overviewLoader').style.display = 'block';
  const container = document.getElementById('overviewContent');
  container.innerHTML = '';

  const symbols = ['^DJI', '^GSPC', '^IXIC']; // Dow Jones, S&P 500, NASDAQ

  try {
    for (const symbol of symbols) {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      const quote = data["Global Quote"];

      if (quote) {
        container.innerHTML += `
          <div class="market-card">
            <h4>${symbol}</h4>
            <p>Price: $${parseFloat(quote["05. price"]).toFixed(2)}</p>
            <p>Change: ${quote["10. change percent"]}</p>
          </div>
        `;
      }
    }
  } catch (err) {
    container.innerHTML = `<p>Error loading market data: ${err.message}</p>`;
  } finally {
    document.getElementById('overviewLoader').style.display = 'none';
  }
}

function expandKnowledge(topic) {
  const contentId = `${topic}-content`;
  const content = document.getElementById(contentId);

  if (content.style.display === 'none') {
    content.style.display = 'block';
    content.innerHTML = `<p>Loading ${topic} content...</p>`; // placeholder
    // You can load content from API or local file here
  } else {
    content.style.display = 'none';
  }
}
