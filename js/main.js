// const API_KEY = 'VSI4SC8YE7ZOIOZD';
const API_KEY = 'YXYHJADJTF1J54Z5';
let chart;
let currentChartType = 'line';
let currentTimeframe = '1M';
let lastSymbol = ''; // Use variable instead of localStorage

window.onload = () => {
  // Initialize with empty symbol since localStorage is not available
  document.getElementById('symbolInput').value = lastSymbol;
  // Load market data on page load since analyzer is the default active section
  loadGlobalMarkets();
};

function showSection(id) {
  const sections = document.querySelectorAll('section');
  const buttons = document.querySelectorAll('.nav-btn');

  sections.forEach(sec => sec.style.display = 'none');
  buttons.forEach(btn => btn.classList.remove('active'));

  document.getElementById(id).style.display = 'block';
  document.querySelector(`[onclick="showSection('${id}')"]`).classList.add('active');

  // Load content based on section
  if (id === 'news') {
    fetchStockNews();
  } else if (id === 'analyzer') {
    // Load market data when switching to analyzer
    loadGlobalMarkets();
  }
}