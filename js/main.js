const API_KEY = 'NUNK8MPSE4NGTTVN';

let chart;
let currentSymbol = '';
let currentChartType = 'line';
let currentTimeframe = '1M';
let lastSymbol = '';
let indicators = {
  sma: false,
  ema: false,
  rsi: false,
  macd: false,
  bollinger: false
};

window.onload = () => {
  document.getElementById('symbolInput').value = lastSymbol;
  showSection('analyzer');
}

function showSection(id) {
  const sections = document.querySelectorAll('section');
  const buttons = document.querySelectorAll('.nav-btn');

  // Remove active class from all buttons
  buttons.forEach(btn => btn.classList.remove('active'));

  // Hide all sections first
  sections.forEach(sec => {
    sec.style.display = 'none';
  });

  if (id === 'analyzer') {
    // Show both analyzer and global-market-overview
    document.getElementById('analyzer').style.display = 'block';
    document.getElementById('global-market-overview').style.display = 'block';
    
    // Mark Dashboard button active
    document.querySelector(`button[onclick*="'analyzer'"]`).classList.add('active');

    // Load market data if the function exists
    if (typeof loadGlobalMarkets === 'function') {
      loadGlobalMarkets();
    }
  } else {
    // Show the selected section
    const selectedSection = document.getElementById(id);
    if (selectedSection) {
      selectedSection.style.display = 'block';
    }
    
    // Mark the clicked button active
    document.querySelector(`button[onclick*="'${id}'"]`).classList.add('active');

    // Load section-specific content
    if (id === 'news' && typeof fetchStockNews === 'function') {
      fetchStockNews();
    }
  }
}

// Function to handle Enter key in the symbol input
function handleEnterKey(event) {
  if (event.key === 'Enter') {
    getStockData();
  }
}
