const knowledgeContent = {
  basics: `
    <h4>Understanding the Stock Market</h4>
    <p>The stock market is a collection of exchanges where shares of publicly traded companies are bought and sold.</p>
    <p>Key concepts:</p>
    <ul>
      <li><strong>Stocks:</strong> Represent ownership in a company</li>
      <li><strong>Bonds:</strong> Debt instruments issued by companies or governments</li>
      <li><strong>Bull Market:</strong> Period of rising stock prices</li>
      <li><strong>Bear Market:</strong> Period of declining stock prices</li>
      <li><strong>Dividends:</strong> Company profits distributed to shareholders</li>
    </ul>
    <p>Stock exchanges like NYSE and NASDAQ provide platforms for trading.</p>
  `,
  technical: `
    <h4>Technical Analysis Fundamentals</h4>
    <p>Technical analysis uses historical price and volume data to predict future price movements.</p>
    <p>Common indicators:</p>
    <ul>
      <li><strong>Moving Averages:</strong> Smooth out price data to identify trends</li>
      <li><strong>RSI (Relative Strength Index):</strong> Measures speed of price movements (30=oversold, 70=overbought)</li>
      <li><strong>MACD (Moving Average Convergence Divergence):</strong> Shows relationship between two moving averages</li>
      <li><strong>Bollinger Bands:</strong> Volatility bands placed above and below a moving average</li>
    </ul>
    <p>Chart patterns like head and shoulders, triangles, and flags help predict price movements.</p>
  `,
  fundamental: `
    <h4>Fundamental Analysis Principles</h4>
    <p>Fundamental analysis evaluates a company's intrinsic value by examining related economic and financial factors.</p>
    <p>Key metrics:</p>
    <ul>
      <li><strong>P/E Ratio:</strong> Price-to-Earnings ratio measures current share price relative to earnings per share</li>
      <li><strong>EPS:</strong> Earnings Per Share indicates company profitability</li>
      <li><strong>ROE:</strong> Return on Equity measures financial performance</li>
      <li><strong>Debt-to-Equity:</strong> Measures financial leverage</li>
    </ul>
    <p>Analysts examine financial statements (income statement, balance sheet, cash flow) to assess company health.</p>
  `,
  strategies: `
    <h4>Investment Strategies</h4>
    <p>Different approaches to investing based on risk tolerance and goals:</p>
    <ul>
      <li><strong>Value Investing:</strong> Finding undervalued stocks (Warren Buffett's approach)</li>
      <li><strong>Growth Investing:</strong> Focusing on companies with strong growth potential</li>
      <li><strong>Dividend Investing:</strong> Seeking stocks with consistent dividend payments</li>
      <li><strong>Index Investing:</strong> Buying funds that track market indices</li>
      <li><strong>Dollar-Cost Averaging:</strong> Investing fixed amounts at regular intervals</li>
    </ul>
    <p>Successful investors diversify their portfolios and maintain a long-term perspective.</p>
  `
  ,
    risk: `
    <h4>Risk Management</h4>
    <p>Managing risk is critical to successful investing. It involves understanding potential losses and taking steps to reduce them.</p>
    <p>Key techniques:</p>
    <ul>
      <li><strong>Stop-Loss Orders:</strong> Automatically sell a stock at a set price to limit losses</li>
      <li><strong>Diversification:</strong> Spread investments across different assets to reduce exposure</li>
      <li><strong>Position Sizing:</strong> Allocate appropriate amounts to each trade</li>
      <li><strong>Risk/Reward Ratio:</strong> Compare expected profit to potential loss</li>
    </ul>
    <p>Use these tools to build a resilient portfolio that can withstand market volatility.</p>
  `,
  psychology: `
    <h4>Market Psychology</h4>
    <p>Investor behavior is heavily influenced by emotions, biases, and group dynamics. Understanding this can help you avoid common pitfalls.</p>
    <p>Key concepts:</p>
    <ul>
      <li><strong>Fear and Greed:</strong> Two dominant forces driving market movements</li>
      <li><strong>Herd Behavior:</strong> Following the crowd can lead to poor decisions</li>
      <li><strong>Overconfidence:</strong> Leads to excessive risk-taking</li>
      <li><strong>Loss Aversion:</strong> The tendency to fear losses more than valuing gains</li>
    </ul>
    <p>Staying rational and sticking to your plan is key to overcoming emotional investing.</p>
  `
};


function expandKnowledge(topic) {
  const contentId = `${topic}-content`;
  const content = document.getElementById(contentId);
  const btn = document.querySelector(`[onclick="expandKnowledge('${topic}')"]`);

  if (!content || !btn) return;

  if (content.style.display === 'none') {
    content.style.display = 'block';
    content.innerHTML = knowledgeContent[topic];
    btn.textContent = 'Show Less';
  } else {
    content.style.display = 'none';
    btn.textContent = 'Learn More';
  }
}

