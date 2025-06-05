// Initialize TradingView Widget
function initTradingViewChart(symbol = 'AAPL') {
    try{
        const container = document.getElementById('tv-chart');
        if (!container) throw new Error('Chart container not found');
        
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        new TradingView.widget({
            "autosize": false,
            "width": "100%",
            "height": 610,
            "symbol": symbol,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "hide_top_toolbar": false,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "container_id": "tv-chart",
            "disabled_features": ["header_symbol_search"],
            "enabled_features": ["study_templates"],
            "studies": [
                "MASimple@tv-basicstudies",
                "RSI@tv-basicstudies",
                "MACD@tv-basicstudies",
                "Volume@tv-basicstudies"
            ],
            "overrides": {
                "paneProperties.background": "#ffffff",
                "paneProperties.vertGridProperties.color": "#f0f0f0",
                "paneProperties.horzGridProperties.color": "#f0f0f0"
            }
        });
    } catch (error) {
        console.error('Chart initialization failed:', error);
        showError('Failed to load chart. Please try again.');
    }        
}

// Modify your getStockData function to use TradingView
async function getStockData() {
    const symbol = document.getElementById('symbolInput').value.trim().toUpperCase();
    
    if (!symbol) {
        showError("Please enter a stock symbol");
        return;
    }
    
    // Show loading state
    document.getElementById('loaderContainer').style.display = 'block';
    document.getElementById('errorContainer').style.display = 'none';
    
    try {
        // Initialize TradingView chart
        initTradingViewChart(symbol);
        
        // You can keep your existing API calls for other data
        // const data = await fetchStockData(symbol);
        // updateStockInfo(data);
        // updatePrediction(data);
        
        // Show results
        document.getElementById('resultContainer').style.display = 'block';
    } catch (error) {
        showError(error.message);
    } finally {
        document.getElementById('loaderContainer').style.display = 'none';
    }
}

// Initialize with default symbol when page loads
document.addEventListener('DOMContentLoaded', () => {
    // You can initialize with a default symbol if you want
    // initTradingViewChart('AAPL');
    
    // Set up your existing event listeners
    document.getElementById('analyzeBtn').addEventListener('click', getStockData);
});

// Keep your existing helper functions like showError, etc.
function setTimeFrame(timeFrame) {
    // Convert your time frame to TradingView's interval format
    let interval;
    switch(timeFrame) {
        case '1D': interval = '1'; break; // 1 minute
        case '1W': interval = '60'; break; // 1 hour
        case '1M': interval = 'D'; break; // Daily
        case '3M': interval = 'W'; break; // Weekly
        case '1Y': interval = 'M'; break; // Monthly
        case 'ALL': interval = '12M'; break; // 12 months
        default: interval = 'D';
    }
    
    // You would need to reinitialize the chart with the new interval
    const symbol = document.getElementById('symbolInput').value.trim().toUpperCase() || 'AAPL';
    initTradingViewChart(symbol, interval);
    
    // Update active button states
    document.querySelectorAll('.button-group .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}